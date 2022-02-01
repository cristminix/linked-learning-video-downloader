#!/usr/bin/env python

import asyncio
from email import message
import json
import logging
import websockets
import os
import requests
import re

logging.basicConfig()

STATE           = {"value": 0}
USERS           = set()
PARAM           = {}
SESSION         = {}
SESSION_DB_PATH = "storage/session.json"

def get_download_dir(courseTitle):
    path = "storage/downloads"
    if not os.path.exists(path):
        os.makedirs(path)
        print("MKDIR : %s " %(path))
    path = path + "/" + courseTitle 
    if not os.path.exists(path):
        os.makedirs(path)
        print("MKDIR : %s " %(path))
    return path

def download_file(url, filename):
    if url == '':
        return True
    if(os.path.exists(filename)):
        return True
    try:    
        r  = requests.get(url, allow_redirects=True)
        fh = open(filename, 'wb')
        fh.write(r.content)
        fh.close()
        return True
    finally:
        return False
    
    


async def resolve_video_url(sessionId, courseTitle, slug, videoUrl, posterUrl, captionUrl, callback):
    global SESSION
    if SESSION[sessionId].get(courseTitle) == None:
        SESSION[sessionId][courseTitle] = {}
        SESSION[sessionId][courseTitle]['tocs'] = []
    tocs = SESSION[sessionId][courseTitle]['tocs']
    
    idx = 0
    for i in tocs :
        if i['slug'] == slug :
            SESSION[sessionId][courseTitle]['tocs'][idx]['videoUrl']     = videoUrl
            SESSION[sessionId][courseTitle]['tocs'][idx]['posterUrl']    = posterUrl
            SESSION[sessionId][courseTitle]['tocs'][idx]['captionUrl']   = captionUrl
            break
        idx += 1
    # print(tocs)    
    update_session_db()
    print(slug,"\n",videoUrl,"\n",idx,"\n")

    download_dir = get_download_dir(courseTitle) 
    # download_file(videoUrl, download_dir + '/' + slug+'.mp4')
    vttFile = download_dir + '/' + slug+'.vtt'
    download_file(captionUrl, vttFile )
    status_vtt = os.path.exists(vttFile)
    if status_vtt :
        status_vtt = os.path.getsize(vttFile) > 10
        if status_vtt == False:
            os.remove(vttFile)

    message = json.dumps({"courseTitle": courseTitle, "videoUrl": videoUrl, "posterUrl": posterUrl, "type": "video", "sessionId": sessionId, "status":status_vtt, "index": idx, "slug": slug, "callback": callback})
    if USERS:  # asyncio.wait doesn't accept an empty list
        await asyncio.wait([user.send(message) for user in USERS])

def init_session_db():
    global SESSION
    if os.path.exists(SESSION_DB_PATH):
        with open(SESSION_DB_PATH) as json_file:
            SESSION = json.load(json_file)
            print('Loading json_db', len(SESSION))
    else:
        print('WARNING : file %s doesnt exists' %(SESSION_DB_PATH))
        update_session_db()

def update_session_db():
    jsonString = json.dumps(SESSION,indent=4, sort_keys=True)
    jsonFile = open(SESSION_DB_PATH, "w")
    jsonFile.write(jsonString)
    jsonFile.close()

async def session_check(sessionId, courseTitle, callback):
    global SESSION
    # print(SESSION)
    status = SESSION.get(sessionId) != None
    if(status):
        status = SESSION[sessionId].get(courseTitle) != None 
    if(status):
        status = len(SESSION[sessionId][courseTitle]['tocs']) > 0;
    message = json.dumps({"type":"session","sessionId":sessionId,"courseTitle": courseTitle,"status":status, "callback":callback})
    if USERS:  # asyncio.wait doesn't accept an empty list
        await asyncio.wait([user.send(message) for user in USERS])

async def session_create(sessionId, courseInfo, callback):
    SESSION[sessionId] = {}
    SESSION[sessionId][courseInfo['courseTitle']] = courseInfo;

    message = json.dumps({"type":"session","sessionId":sessionId, "courseTitle": courseInfo['courseTitle'],  "status":True, "callback":callback})
    update_session_db()
    if USERS:  # asyncio.wait doesn't accept an empty list
        await asyncio.wait([user.send(message) for user in USERS])
def state_event():
    return json.dumps({"type": "state", **STATE})


def users_event():
    return json.dumps({"type": "users", "count": len(USERS)})


async def notify_state():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = state_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def notify_users():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = users_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def register(websocket):
    USERS.add(websocket)
    await notify_users()


async def unregister(websocket):
    USERS.remove(websocket)
    await notify_users()


async def counter(websocket, path):
    # register(websocket) sends user_event() to websocket
    await register(websocket)
    try:
        # await websocket.send(state_event())
        async for message in websocket:
            data = json.loads(message)
            
            if data["action"] == "session_check":
                await session_check(data['sessionId'],data['courseTitle'],data['callback'])
            elif data["action"] == "session_create":
                await session_create(data['sessionId'],data['courseInfo'],data['callback'])
            elif data["action"] == "resolve_video_url":
                await resolve_video_url(data['sessionId'],data['courseTitle'],data['slug'],data['videoUrl'],data['posterUrl'],data['captionUrl'],data['callback'])
            else:
                logging.error("unsupported event: %s", data)
    finally:
        await unregister(websocket)

init_session_db()
start_server = websockets.serve(counter, "localhost", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()