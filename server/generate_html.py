import json 
 
 
SESSION = {}
SESSION_DB_PATH = "storage/session.json"

def init():
    global SESSION
    with open(SESSION_DB_PATH) as json_file:
        SESSION = json.load(json_file)
    
    for sessionId in SESSION:
        for courseTitle in SESSION[sessionId]:
            tocs = SESSION[sessionId][courseTitle]['tocs']
            for i in tocs :
                print('<a href="%s">%s</a><br/>' % (i['videoUrl'], i['slug']))
                print('<a href="%s">Caption%s </a><br/>' % (i['captionUrl'], i['slug']))
                # print('<a href="%s"><img src="%s" alt="%s"/></a>' % (i['posterUrl'],i['posterUrl'], i['slug']))
init()