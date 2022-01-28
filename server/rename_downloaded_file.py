#!/usr/bin/env python

import os
import json

folder 	= r'C:\Users\Damar\Downloads\Video\python-for-non-programmer'

count 	= 1

session_json_path = "storage/session.json"
session = {}

def init_session_db():
    global session
    with open(session_json_path) as json_file:
        session = json.load(json_file)

def query_filenames():
	for sessionId in session:
		sessionData = session[sessionId]
		tocs 	= sessionData['tocs']
		index = 0;
		for item in tocs:
			# print(item)
			slug 			= item['slug']
			videoUrl 		= item['videoUrl']
			videoUrlSplit	= videoUrl.split('/')
			captionUrl 		= item['captionUrl']
			videoFilename 	= videoUrlSplit[len(videoUrlSplit)-1].split('?')[0]+'.mp4'
			captionFilename	= '' 
			if index > 0 :
				captionFilename = 'ambry' + '_' + str(index) 
			else:
				captionFilename = 'ambry'

			captionFilename += '.html'	
			index += 1
			print('%s|%s|%s' %(slug,videoFilename,captionFilename))
		# print(courseInfo)

init_session_db()
query_filenames()

# count increase by 1 in each iteration
# iterate all files from a directory
for file_name in os.listdir(folder):
    # Construct old file name
    source = folder + file_name
    print(file_name)
    # Adding the count to the new file name and extension
    # destination = folder + "sales_" + str(count) + ".txt"

    # Renaming the file
    # os.rename(source, destination)
    count += 1
# print('All Files Renamed')

# print('New Names are')
# verify the result