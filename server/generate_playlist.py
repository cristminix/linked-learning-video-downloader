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

def query_filenames(courseTitle_, useLocal=False):
	global files_to_rename
	if useLocal:
		for sessionId in session:
			sessionData = session[sessionId]
			for courseTitle in sessionData:
				if courseTitle == courseTitle_:
					tocs = sessionData[courseTitle]['tocs']
					index   = 1;
					for item in tocs:
						# print(item)
						slug 			= item['slug']
						
						videoFilename 	= slug+'.mp4'
						captionFilename	= slug+'.vtt' 

						index += 1
						
						newVideoFilename 	= slug + '.mp4'
						newCaptionFilename	= slug + '.vtt'

						# print('%s|%s ==> %s|%s' %(videoFilename, captionFilename, newVideoFilename, newCaptionFilename))
						files_to_rename[videoFilename]		=	newVideoFilename
						files_to_rename[captionFilename]	=	newCaptionFilename
				return True
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

def get_tocs(sessionId, courseTitle):
    global session
    tocs = {}
    if session[sessionId].get(courseTitle) != None:
        if session[sessionId][courseTitle].get('tocs') != None:
            if(len(session[sessionId][courseTitle]['tocs']) > 0):
                tocs = session[sessionId][courseTitle]['tocs'] 
    return tocs 
    



def get_course_list():
	session_with_course = [{}]
	inputIndex = 1
	for sessionId in session:
		print(sessionId,':')
		for courseTitle in session[sessionId]:
			session_with_course.append( {"sessionId":sessionId,"courseTitle":courseTitle})
			print("\t"+courseTitle,"[",inputIndex,"]")
			inputIndex += 1
	if(inputIndex > 1):
		# print()
		courseNumber = int(input("Please select the course number:"))
		if(courseNumber > 0 and courseNumber < inputIndex):
			print(session_with_course[int(courseNumber)])
			course = session_with_course[courseNumber]
			# start_download(course['sessionId'], )
			query_filenames(course['courseTitle'], True)
			do_generate_m3u(course['courseTitle'])
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
