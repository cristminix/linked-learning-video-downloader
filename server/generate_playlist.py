#!/usr/bin/env python

from genericpath import exists
import os
import json
import cv2
import datetime
import urllib.parse

folder 	= 'storage/downloads'

count 	= 1

session_json_path 	= "storage/session.json"
session 			= {}
files_to_rename 	= {}

def init_session_db():
    global session
    with open(session_json_path) as json_file:
        session = json.load(json_file)

def get_video_duration(path):
	print(path)
	# create video capture object
	data = cv2.VideoCapture(os.path.realpath(path))
	  
	# count the number of frames
	frames = data.get(cv2.CAP_PROP_FRAME_COUNT)
	fps = int(data.get(cv2.CAP_PROP_FPS))
	  
	# calculate dusration of the video
	seconds = int(frames / fps)
	video_time = str(datetime.timedelta(seconds=seconds))
	# print("duration in seconds:", seconds)
	# print("video time:", video_time)
	return seconds

def query_filenames(courseTitle_):
	global files_to_rename

	for sessionId in session:
		sessionData = session[sessionId]
		for courseTitle in sessionData:
			if(courseTitle == courseTitle_):
				tocs = sessionData[courseTitle]['tocs']
				index   = 1;
				for item in tocs:
					# print(item)
					slug 			= item['slug']
					videoUrl 		= item['videoUrl']
					videoUrlSplit	= videoUrl.split('/')
					captionUrl 		= item['captionUrl']
					
					videoFilename 	= videoUrlSplit[len(videoUrlSplit)-1].split('?')[0]+'.mp4'
					captionFilename	= '' 

					if index > 1 :
						captionFilename = 'ambry' + '_' + str(index) 
					else:
						captionFilename = 'ambry'

					captionFilename += '.html'	
					index += 1
					
					newVideoFilename 	= slug + '.mp4'
					newCaptionFilename	= slug + '.vtt'

					# print('%s|%s ==> %s|%s' %(videoFilename, captionFilename, newVideoFilename, newCaptionFilename))
					files_to_rename[videoFilename]		=	newVideoFilename
					files_to_rename[captionFilename]	=	newCaptionFilename

def do_generate_m3u(courseTitle):
	global folder
	global files_to_rename
	buffer = "#EXTM3U\n";

	for oldFilename in files_to_rename:
		filename = files_to_rename[oldFilename]
		filenameEncoded = urllib.parse.quote(filename)
		filenameSplitText = os.path.splitext( filename)
		fileExt = filenameSplitText[1]
		path = folder +'/'+courseTitle+'/'+filename
		if fileExt == '.mp4': 
			if os.path.exists(path):
				videoDuration = get_video_duration(path)
				buffer += "#EXTINF:%d,%s\n" % (videoDuration, filename)
				buffer += filenameEncoded + "\n"
	
	with open(folder+'/'+courseTitle+'/playlist.m3u', 'w') as f:
		f.write(buffer)
		f.close()
	print(buffer)

courseTitle='python-quick-start'
init_session_db()
query_filenames(courseTitle)
do_generate_m3u(courseTitle)