
import sqlite3
conn = sqlite3.connect('storage/session.db')

def query(sessionId):
    cursor = conn.execute("SELECT * from session WHERE sessionId='%s'" % (sessionId))
    data = []
    for row in cursor:
        data[0] = {"sessionId":row[0],"lastLogin":row[1],"status":row[2],"lastTocIndex":row[3],"complete":row[4]}
    return data

def exists(sessionId, courseTitle):
    cursor = conn.execute("SELECT * from course WHERE sessionId='%s' AND slug='%s'" % (sessionId, courseTitle))
    data = []
    for row in cursor:
        data[0] = {"slug":row[0],"sessionId":row[1],"title":row[2],"url":row[3],"exerciseUrl":row[4],"isDownloaded":row[5],"creationDate":row[6]}
    return data

def create(sessionId, courseTitle):
    conn.execute("INSERT INTO session (sessionId) VALUES ('%s')" % (sessionId));
    conn.execute("INSERT INTO course (sessionId,slug,isDownloaded,creationDate) VALUES ('%s', '%s', 0, '%s')" % (sessionId, courseTitle, ''));
    return True