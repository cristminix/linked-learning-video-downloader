#!/usr/bin/env python

# WS server example that synchronizes state across clients

import asyncio
from email import message
import json
import logging
import websockets
import os

logging.basicConfig()

STATE           = {"value": 0}
USERS           = set()
PARAM           = {}
SESSION         = {}
SESSION_DB_PATH = "storage/session.json"

async def resolve_video_url(sessionId, courseTitle, slug, videoUrl, posterUrl, captionUrl, callback):
    global SESSION
    if SESSION[sessionId][courseTitle] == None:
        SESSION[sessionId][courseTitle] = {}
        SESSION[sessionId][courseTitle]['tocs'] = []
    tocs = SESSION[sessionId][courseTitle]['tocs']
    print(slug,videoUrl,posterUrl)
    idx = 0
    for i in tocs :
        if i['slug'] == slug :
            SESSION[sessionId][courseTitle]['tocs'][idx]['videoUrl']     = videoUrl
            SESSION[sessionId][courseTitle]['tocs'][idx]['posterUrl']    = posterUrl
            SESSION[sessionId][courseTitle]['tocs'][idx]['captionUrl']   = captionUrl
            break
        idx += 1

    update_session_db()
    message = json.dumps({"courseTitle": courseTitle, "videoUrl": videoUrl, "posterUrl": posterUrl, "type": "video", "sessionId": sessionId, "status":True, "index": idx, "slug": slug, "callback": callback})
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
    jsonString = json.dumps(SESSION)
    jsonFile = open(SESSION_DB_PATH, "w")
    jsonFile.write(jsonString)
    jsonFile.close()

async def session_check(sessionId, courseTitle, callback):
    global SESSION
    # print(SESSION)
    status = SESSION.get(sessionId) != None
    if(status):
        status = SESSION[sessionId].get(courseTitle) != None 
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
            # action = PARAM['action']
            # # print()
            # if action != None:
            #     # print(type(action))
            #     await eval(action + '()')
            

            if data["action"] == "minus":
                STATE["value"] -= 1
                await notify_state()
            elif data["action"] == "plus":
                STATE["value"] += 1
                await notify_state()
            
            # PARAM['action'] = data['action']    
            if data["action"] == "session_check":
                await session_check(data['sessionId'],data['courseTitle'],data['callback'])
            elif data["action"] == "session_create":
                await session_create(data['sessionId'],data['courseInfo'],data['callback'])
            elif data["action"] == "resolve_video_url":
                await resolve_video_url(data['sessionId'],data['courseTitle'],data['slug'],data['videoUrl'],data['posterUrl'],data['captionUrl'],data['callback'])
            else:
                logging.error("unsupported event: %s", data)
                # if data["action"] == 'session_check':
                #     session_check()
    finally:
        await unregister(websocket)

init_session_db()
start_server = websockets.serve(counter, "localhost", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()