
import os
import asyncio
import json
from datetime import datetime,timedelta
from my_app.catalog.models import db,TBTocs,TBCourse
import requests
from my_app.socket import socket_
from my_app import app
import cv2
import urllib.parse

RETRY = {}
def get_video_duration(path):
    print(path)
    # create video capture object
    data = cv2.VideoCapture(os.path.realpath(path))
      
    # count the number of frames
    frames = data.get(cv2.CAP_PROP_FRAME_COUNT)
    fps = int(data.get(cv2.CAP_PROP_FPS))
      
    # calculate dusration of the video
    seconds = int(frames / fps)
    video_time = str(timedelta(seconds=seconds))
    # print("duration in seconds:", seconds)
    # print("video time:", video_time)
    return seconds

def do_generate_m3u(courseId):
    course = TBCourse.query.filter(TBCourse.id == courseId).first()
    if course:
        tocs = TBTocs.query.filter(TBTocs.courseId == courseId).all()
        if len(tocs) > 0:
            buffer = "#EXTM3U\n";
            folder = get_download_dir(course.courseTitle)

            for toc in tocs:
                filename = "%s.mp4" % (toc.slug)
                filenameEncoded = urllib.parse.quote(filename)
                filenameSplitText = os.path.splitext( filename)
                fileExt = filenameSplitText[1]
                path = "%s/%s" % (folder,filename)
                if fileExt == '.mp4': 
                    if os.path.exists(path):
                        videoDuration = get_video_duration(path)
                        buffer += "#EXTINF:%d,%s\n" % (videoDuration, filename)
                        buffer += filenameEncoded + "\n"
            playlistFile = folder + '/' + 'playlist.m3u'
            with open(playlistFile, 'w') as f:
                f.write(buffer)
                f.close()
            return playlistFile
       
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


def retry_download(what, course, toc, s):
    # global RETRY
    # retry_count = RETRY.get(filename)
    if what == 'caption':
        retryCount = toc.dlCaptionRetry
    else:
        retryCount = toc.dlVideoRetry
    if(retryCount <= 7 ):
        print('Retry %d' %(retryCount))
        return download_file(what, course, toc, s)

def notify_download(data):
    socket_.emit('toc_download',data,broadcast=True)

def download_file(what, course, toc, s):
    with app.app_context():
        # global RETRY
        download_dir = get_download_dir(course.courseTitle)
        course_cookies = json.loads(course.cookie)
        cookies = {}
        for cookie in course_cookies:
            cookies[cookie['name']] = cookie['value']
        # print(cookies)
        if what == 'caption':
            filename = "%s/%s.vtt" % (download_dir, toc.slug)
            url = toc.captionUrl
        else:
            filename = "%s/%s.mp4" % (download_dir, toc.slug)
            url = toc.videoUrl
    
        if url == '':
            return True
        # if(os.path.exists(filename)):
        #     return True
        try:
            print("Downloading:%s" % (filename))
            print("url:%s" % (url))
    
            # head_response = requests.head(url, allow_redirects=True,timeout=30, cookies=cookies)
            response = requests.get(url, stream=True, allow_redirects=True,timeout=30, cookies=cookies,headers={'Accept-Encoding': None})
            total_size_in_bytes= int(response.headers.get('content-length', 0))
            print(response.headers)
            # print(head_response.headers)
            block_size = int(1024*(1024/5)) #1 Kibibyte
            notify_download({"what":what,"lastTryDate": str(datetime.now()),"url":url,"tocIndex":toc.idx,"tocId":toc.id,"progress":0,"total":total_size_in_bytes,"filename":filename})
            # progress_bar = tqdm(total=total_size_in_bytes, unit='iB', unit_scale=True)
            toc = TBTocs.query.filter(TBTocs.id == toc.id).first()
            if what == 'caption':
                toc.dlCaptionSize = total_size_in_bytes
                toc.dlCaptionStatus = 0
                toc.dlCaptionComplete = 0
                toc.dlCaptionLastTryDate = datetime.now()
            else:
                toc.dlVideoSize = total_size_in_bytes
                toc.dlVideoStatus = 0
                toc.dlVideoComplete = 0
                toc.dlVideoLastTryDate = datetime.now()
            
            db.session.commit()
            
            byte_written = 0
            with open(filename, 'wb') as file:
                for data in response.iter_content(block_size):
                    byte_written += len(data)
                    # progress_bar.update(byte_written)
                    obj={"what":what,"lastTryDate": str(datetime.now()),"url":url,"tocIndex":toc.idx,"tocId":toc.id,"progress":byte_written,"total":total_size_in_bytes,"filename":filename}
                    notify_download(obj)
                    if what == 'caption':
                        toc.dlCaptionStatus = byte_written
                        if toc.dlCaptionStatus == toc.dlCaptionSize:
                            toc.dlCaptionComplete = 1
                    else:
                        toc.dlVideoStatus = byte_written
                        if toc.dlVideoStatus == toc.dlVideoSize:
                            toc.dlVideoComplete = 1
                    # if total_size_in_bytes == 0 and byte_written > 0:
                    #     toc.dlVideoSize = byte_written
                    #     toc.dlVideoComplete = 1
                        
                    db.session.commit()
                    file.write(data)
            if response.headers['Transfer-Encoding'] == 'chunked' and byte_written > 0:
                toc.dlVideoSize = byte_written
                toc.dlVideoComplete = 1
                db.session.commit()
                file.write(data)

            # db.session.flush()
            # progress_bar.close()
            # print(total_size_in_bytes,progress_bar.n,os.path.exists(filename))
            if not os.path.exists(filename):
                if what == 'caption':
                    retryCount = toc.dlCaptionRetry
                else:
                    retryCount = toc.dlVideoRetry
                print(filename + " ERROR, something went wrong RETRY: ",  retryCount)
                if(retryCount == None):
                    retryCount = 1
                    if what == 'caption':
                        toc.dlCaptionRetry = retryCount 
                    else:
                        toc.dlVideoRetry = retryCount
                    
                    db.session.commit()
                        
                    return retry_download(what, course, toc, s)
                else:
                    retryCount += 1
                    if what == 'caption':
                        toc.dlCaptionRetry = retryCount 
                    else:
                        toc.dlVideoRetry = retryCount
                    
                    db.session.commit()
                    return retry_download(what, course, toc, s)
            else:
                return True
            return False
        except requests.exceptions.RequestException as e:
            if what == 'caption':
                    retryCount = toc.dlCaptionRetry
            else:
                retryCount = toc.dlVideoRetry
            print(filename + " ERROR, something went wrong RETRY: ",  retryCount)
            if(retryCount == None):
                retryCount = 1
                if what == 'caption':
                    toc.dlCaptionRetry = retryCount 
                else:
                    toc.dlVideoRetry = retryCount
                
                db.session.commit()
                    
                return retry_download(what, course, toc, s)
            else:
                retryCount += 1
                if what == 'caption':
                    toc.dlCaptionRetry = retryCount 
                else:
                    toc.dlVideoRetry = retryCount
                
                db.session.commit()
                return retry_download(what, course, toc, s)
            return False
        except requests.exceptions.ConnectTimeout as e:
            if what == 'caption':
                    retryCount = toc.dlCaptionRetry
            else:
                retryCount = toc.dlVideoRetry
            print(filename + " ERROR, something went wrong RETRY: ",  retryCount)
            if(retryCount == None):
                retryCount = 1
                if what == 'caption':
                    toc.dlCaptionRetry = retryCount 
                else:
                    toc.dlVideoRetry = retryCount
                
                db.session.commit()
                    
                return retry_download(what, course, toc, s)
            else:
                retryCount += 1
                if what == 'caption':
                    toc.dlCaptionRetry = retryCount 
                else:
                    toc.dlVideoRetry = retryCount
                
                db.session.commit()
                return retry_download(what, course, toc, s)
            return False
        return False