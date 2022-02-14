
import os
import asyncio
import json
from tqdm import tqdm
import time
from datetime import datetime

from my_app.catalog.models import db,TBTocs
# from my_app.catalog.views import loop
import requests
# from flask_socketio import emit
from my_app.socket import socket_
# import asyncio
# loop = asyncio.get_event_loop()

RETRY = {}

def get_download_dir(courseTitle):
    path = "downloads"
    if not os.path.exists(path):
        os.makedirs(path)
        print("MKDIR : %s " %(path))
    path = path + "/" + courseTitle 
    if not os.path.exists(path):
        os.makedirs(path)
        print("MKDIR : %s " %(path))
    return path


def retry_download(url, filename, toc=None):
    global RETRY
    retry_count = RETRY.get(filename)
    if(retry_count <= 7 ):
        print('Retry %d' %(retry_count))
        return download_file(url, filename)

# @socket_.on('toc_download', namespace='/api')
def notify_download(data):
    socket_.emit('toc_download',data,broadcast=True)

def download_file(url, filename, toc, s):
    global RETRY
   
    if url == '':
        return True
    # if(os.path.exists(filename)):
    #     return True
    try:
        print("Downloading:%s" % (filename))
        print("url:%s" % (url))
        # r = requests.get('https://www.google.com/images/srpr/logo11w.png')

        # with open('google_logo.png', 'wb') as f:
            # f.write(r.content)
        response = requests.get(url, stream=True, allow_redirects=True,timeout=30)
        total_size_in_bytes= int(response.headers.get('content-length', 0))
        block_size = int(1024*(1024/5)) #1 Kibibyte
        s.emit('toc_download',{"url":url,"tocId":toc.id,"progress":0,"total":total_size_in_bytes,"filename":filename},broadcast=True)
        # progress_bar = tqdm(total=total_size_in_bytes, unit='iB', unit_scale=True)
        toc = TBTocs.query.filter(TBTocs.id == toc.id).first()
        toc.dlVideoSize=total_size_in_bytes
        toc.lastTryDate=datetime.now()
        db.session.commit()
        # db.session.flush()

        byte_written = 0
        with open(filename, 'wb') as file:
            for data in response.iter_content(block_size):
                byte_written += len(data)
                # progress_bar.update(byte_written)
                obj={"url":url,"tocId":toc.id,"progress":byte_written,"total":total_size_in_bytes,"filename":filename}
                
                s.emit('toc_download',obj,broadcast=True)
                toc.dlVideoStatus=byte_written
                db.session.commit()
                file.write(data)
                # time.sleep(1)

        # progress_bar.close()
        # print(total_size_in_bytes,progress_bar.n,os.path.exists(filename))
        if not os.path.exists(filename):
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