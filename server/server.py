
import os
import requests
import json
import sys
from tqdm import tqdm

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
    retry_count = RETRY.get(url)
    if(retry_count <= 3 ):
        print('Retry %d' %(retry_count))
        return download_file(url, filename)
def download_file(url, filename):
    global RETRY
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 
        "Accept-Encoding": "gzip, deflate", 
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8", 
        "Dnt": "1", 
        "Host": "httpbin.org", 
        "Upgrade-Insecure-Requests": "1", 
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36", 
    }
    if url == '':
        return True
    if(os.path.exists(filename)):
        return True
    try:    
        # r  = requests.get(url, allow_redirects=True)
        # fh = open(filename, 'wb')
        # fh.write(r.content)
        # fh.close()
        # return True
        # url = "http://www.ovh.net/files/10Mb.dat" #big file test
        # Streaming, so we can iterate over the response.
        proxies=dict(http='socks5://127.0.0.1:1080',https='socks5://127.0.0.1:1080')
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
            print(filename + " ERROR, something went wrong RETRY:%d",RETRY.get(url))
            if(RETRY.get(url) == None):
                RETRY[url] = 1
                retry_download(url, filename)
            else:
                retry_download(url, filename)
                RETRY[url] += 1


            return False
        else:
            return True 
    except requests.exceptions.ConnectTimeout as e:
        print(filename + " ERROR, something went wrong RETRY:%d",RETRY.get(url))
        if(RETRY.get(url) == None):
            RETRY[url] = 1
            return retry_download(url, filename)
        else:
        	return retry_download(url, filename)
        	RETRY[url] += 1
    finally:
        return False

def get_tocs(sessionId, courseTitle):
    global SESSION
    tocs = {}
    if SESSION[sessionId].get(courseTitle) != None:
        if SESSION[sessionId][courseTitle].get('tocs') != None:
            if(len(SESSION[sessionId][courseTitle]['tocs']) > 0):
                tocs = SESSION[sessionId][courseTitle]['tocs'] 
    return tocs 
    
def start_download(sessionId, courseTitle, callback='', index=1):
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
        # break
        status_mp4 = download_file(videoUrl, mp4File )
        dl_status = vttFile and mp4File
      
        idx +=1

def init_session_db():
    global SESSION
    if os.path.exists(SESSION_DB_PATH):
        with open(SESSION_DB_PATH) as json_file:
            SESSION = json.load(json_file)
            print('Loading json_db', len(SESSION))
    else:
        print('WARNING : file %s doesnt exists' %(SESSION_DB_PATH))
        update_session_db()

def get_course_list():
	session_with_course = [{}]
	inputIndex = 1
	for sessionId in SESSION:
		print(sessionId,':')
		for courseTitle in SESSION[sessionId]:
			session_with_course.append( {"sessionId":sessionId,"courseTitle":courseTitle})
			print("\t"+courseTitle,"[",inputIndex,"]")
			inputIndex += 1
	if(inputIndex > 1):
		# print()
		courseNumber = int(input("Please select the course number:"))
		if(courseNumber > 0 and courseNumber < inputIndex):
			print(session_with_course[int(courseNumber)])
			course = session_with_course[courseNumber]
			start_download(course['sessionId'], course['courseTitle'])
		else:
			print("You have not select valid course number")
	else:
		print("There is no course to download.")
def main():
	init_session_db()
	get_course_list()
	pass


if __name__ == "__main__":
	main()