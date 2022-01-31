def generate_html(sessionId, courseTitle):
    global SESSION
    with open(SESSION_DB_PATH) as json_file:
        SESSION = json.load(json_file)
    
    for sessionId in SESSION:
        for courseTitle in SESSION[sessionId]:
            tocs = SESSION[sessionId][courseTitle]['tocs']
            for i in tocs :
                print('<a href="%s">%s</a><br/>' % (i['videoUrl'], i['slug']))
                print('<a href="%s">Caption%s </a><br/>' % (i['captionUrl'], i['slug']))

def do_rename_files(sessionId, courseTitle):
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

def get_video_duration(path):
	# create video capture object
	data = cv2.VideoCapture(path)
	  
	# count the number of frames
	frames = data.get(cv2.CAP_PROP_FRAME_COUNT)
	fps = int(data.get(cv2.CAP_PROP_FPS))
	  
	# calculate dusration of the video
	seconds = int(frames / fps)
	video_time = str(datetime.timedelta(seconds=seconds))
	# print("duration in seconds:", seconds)
	# print("video time:", video_time)
	return seconds

def do_generate_m3u():
	global folder
	global files_to_rename
	buffer = "#EXTM3U\n";

	for oldFilename in files_to_rename:
	    filename = files_to_rename[oldFilename]
	    filenameEncoded = urllib.parse.quote(filename)
	    filenameSplitText = os.path.splitext( filename)
	    fileExt = filenameSplitText[1]

	    if fileExt == '.mp4' :
	    	videoDuration = get_video_duration(folder + filename)
	    	buffer += "#EXTINF:%d,%s\n" % (videoDuration, filename)
	    	buffer += filenameEncoded + "\n"
	
	with open(folder+'playlist.m3u', 'w') as f:
		f.write(buffer)
		f.close()
	print(buffer)