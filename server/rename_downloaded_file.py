#!/usr/bin/env python

import os
import json

folder 	= r'C:\Users\Damar\Downloads\Video\python-for-non-programmer\\'

count 	= 1

session_json_path 	= "storage/session.json"
session 			= {}
files_to_rename 	= {}

def init_session_db():
    global session
    with open(session_json_path) as json_file:
        session = json.load(json_file)

def query_filenames():
	global files_to_rename

	for sessionId in session:
		sessionData = session[sessionId]
		tocs 	= sessionData['tocs']
		index   = 1;
		for item in tocs:
			# print(item)
			slug 			= item['slug']
			videoUrl 		= item['videoUrl']
			videoUrlSplit	= videoUrl.split('/')
			captionUrl 		= item['captionUrl']
			
			videoFilename 	= videoUrlSplit[len(videoUrlSplit)-1].split('?')[0]+'.mp4'
			captionFilename	= '' 

			# if index > 0 :
			captionFilename = 'ambry' + '_' + str(index) 
			# else:
			# 	captionFilename = 'ambry'

			captionFilename += '.html'	
			index += 1
			
			newVideoFilename 	= slug + '.mp4'
			newCaptionFilename	= slug + '.vtt'

			# print('%s|%s ==> %s|%s' %(videoFilename, captionFilename, newVideoFilename, newCaptionFilename))
			files_to_rename[videoFilename]		=	newVideoFilename
			files_to_rename[captionFilename]	=	newCaptionFilename

def do_rename_files():
	global folder
	global files_to_rename

	for oldFilename in files_to_rename:
	    srcFilename = folder + oldFilename
	    dstFilename = folder + files_to_rename[oldFilename]
	    if os.path.exists(srcFilename) :
	    	print('Rename : %s to %s' % (oldFilename, files_to_rename[oldFilename]))
	    	os.rename(srcFilename, dstFilename)
	    	
	    else:
	    	print('Skip   : %s' % (oldFilename))

init_session_db()
query_filenames()
do_rename_files()