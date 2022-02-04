#!/usr/bin/env python

import asyncio
from email import message
import json
import logging
import websockets
import os
import requests
import re
from tqdm import tqdm

logging.basicConfig()

STATE           = {"value": 0}
USERS           = set()
PARAM           = {}
SESSION         = {}
SESSION_DB_PATH = "storage/session.json"
RETRY = {}
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

def retry_download(url, filename):
    global RETRY
    retry_count = RETRY.get(filename)
    if(retry_count <= 7 ):
        print('Retry %d' %(retry_count))
        return download_file(url, filename)
def download_file(url, filename):
    global RETRY
   
    if url == '':
        return True
    if(os.path.exists(filename)):
        return True
    try:
        print("Downloading:%s" % (filename))
        print("url:%s" % (url))
        response = requests.get(url, stream=True, allow_redirects=True,timeout=30)
        total_size_in_bytes= int(response.headers.get('content-length', 0))
        block_size = 1024 #1 Kibibyte
        progress_bar = tqdm(total=total_size_in_bytes, unit='iB', unit_scale=True)
        with open(filename, 'wb') as file:
            for data in response.iter_content(block_size):
                progress_bar.update(len(data))
                file.write(data)
        progress_bar.close()
        print(total_size_in_bytes,progress_bar.n,os.path.exists(filename))
        if (total_size_in_bytes != 0 and progress_bar.n != total_size_in_bytes ) or not os.path.exists(filename):
            print(filename + " ERROR, something went wrong RETRY: ",  RETRY.get(filename))
            if(RETRY.get(filename) == None):
                RETRY[filename] = 1
                return retry_download(url, filename)
            else:
                RETRY[filename] += 1
                return retry_download(url, filename)
        else:
            return True
        return False
    except requests.exceptions.RequestException as e:
        print(filename + " ERROR, something went wrong RETRY: ",  RETRY.get(filename))
        if(RETRY.get(filename) == None):
            RETRY[filename] = 1
            return retry_download(url, filename)
        else:
            RETRY[filename] += 1
            return retry_download(url, filename)
        return False
    except requests.exceptions.ConnectTimeout as e:
        print(filename + " ERROR, something went wrong RETRY: ",  RETRY.get(filename))
        if(RETRY.get(filename) == None):
            RETRY[filename] = 1
            return retry_download(url, filename)
        else:
            RETRY[filename] += 1
            return retry_download(url, filename)
        return False
    return False

def get_tocs(sessionId, courseTitle):
    global SESSION
    tocs = {}
    if SESSION[sessionId].get(courseTitle) != None:
        if SESSION[sessionId][courseTitle].get('tocs') != None:
            if(len(SESSION[sessionId][courseTitle]['tocs']) > 0):
                tocs = SESSION[sessionId][courseTitle]['tocs'] 
    return tocs 
    
async def start_download(sessionId, courseTitle, callback, index=1):
    download_dir = get_download_dir(courseTitle) 
    tocs = get_tocs(sessionId, courseTitle)
    idx = 0
    for i in tocs:
        videoUrl = i['videoUrl']
        captionUrl = i['captionUrl']
        slug = i['slug']
        mp4File = download_dir + '/' + slug+'.mp4'
        vttFile = download_dir + '/' + slug+'.vtt'
        status_vtt = download_file(captionUrl, vttFile )
        status_mp4 = download_file(videoUrl, mp4File )
        dl_status = vttFile and mp4File
        message = json.dumps({"courseTitle": courseTitle, "videoUrl": videoUrl, "type": "dl", "sessionId": sessionId, "status":dl_status,"tocs":tocs, "index": idx, "slug": slug, "callback": callback})
        if USERS:
            task = asyncio.create_task(notify_client(message))
            await asyncio.wait({task})
        idx +=1

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
    print("\n",slug,":[",idx,"]")

    dl_status = True

    message = json.dumps({"courseTitle": courseTitle, "videoUrl": videoUrl, "posterUrl": posterUrl, "type": "video", "sessionId": sessionId, "status":dl_status,"tocs":tocs, "index": idx, "slug": slug, "callback": callback})
    if USERS:  # asyncio.wait doesn't accept an empty list
        task = asyncio.create_task(notify_client(message))
        await asyncio.wait({task})

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
    global SESSION
    jsonString = json.dumps(SESSION,indent=4, sort_keys=True)
    jsonFile = open(SESSION_DB_PATH, "w")
    jsonFile.write(jsonString)
    jsonFile.close()
async def notify_client(message):
    for user in USERS:
        try:
            await user.send(message)
        except websockets.exceptions.ConnectionClosedError as e:
            pass
    return True

async def session_check(sessionId, courseTitle, callback):
    global SESSION
    # print(SESSION)
    status = SESSION.get(sessionId) != None
    if(status):
        status = SESSION[sessionId].get(courseTitle) != None 
    if(status):
        status = len(SESSION[sessionId][courseTitle]['tocs']) > 0;
    message = json.dumps({"type":"session","sessionId":sessionId,"courseTitle": courseTitle,"status":status, "callback":callback})
    if USERS:
        task = asyncio.create_task(notify_client(message))
        await asyncio.wait({task})

async def session_create(sessionId, courseInfo, callback):
    if SESSION.get(sessionId) == None:
        SESSION[sessionId] = {}
    
    SESSION[sessionId][courseInfo['courseTitle']] = courseInfo;

    message = json.dumps({"type":"session","sessionId":sessionId, "courseTitle": courseInfo['courseTitle'],  "status":True, "callback":callback})
    update_session_db()
    if USERS:
        task = asyncio.create_task(notify_client(message))
        await asyncio.wait({task})
def state_event():
    return json.dumps({"type": "state", **STATE})


def users_event():
    return json.dumps({"type": "users", "count": len(USERS)})


async def notify_state():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = state_event()
        task = asyncio.create_task(notify_client(message))
        await asyncio.wait({task})


async def notify_users():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = users_event()
        task = asyncio.create_task(notify_client(message))
        await asyncio.wait({task})


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
            elif data["action"] == "start_download":
                await start_download(data['sessionId'],data['courseTitle'],data['callback'],data.get('index'))
            else:
                logging.error("unsupported event: %s", data)
    except websockets.exceptions.ConnectionClosedError as e:
        pass

    finally:
        await unregister(websocket)

init_session_db()
start_server = websockets.serve(counter, "localhost", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()