from dataclasses import dataclass
from my_app import db


@dataclass
class TBSession(db.Model):
	id : int
	sessionId : str
	createDate : str

	id = db.Column(db.Integer, primary_key=True)
	sessionId = db.Column(db.String(255),unique=True)
	createDate = db.Column(db.String(12))

	def __init__(self, sessionId, createDate):
		self.sessionId = sessionId
		self.createDate = createDate

	def __repr__(self):
		return '<Session %d' % (self.id)

@dataclass
class TBCourse(db.Model):
	id : int
	sessionId : str
	coursePath : str
	courseTitle : str
	url : str
	fullUrl : str
	hostname : str
	createDate : str

	id = db.Column(db.Integer, primary_key=True)
	sessionId = db.Column(db.String(255))
	coursePath = db.Column(db.String(255))
	courseTitle = db.Column(db.String(255))
	url = db.Column(db.String(255))
	fullUrl = db.Column(db.String(255))
	hostname = db.Column(db.String(255))
	createDate = db.Column(db.String(12))

	def __init__(self, sessionId, coursePath, courseTitle, url, fullUrl, hostname, createDate):
		self.sessionId = sessionId
		self.coursePath = coursePath
		self.courseTitle = courseTitle
		self.url = url
		self.fullUrl = fullUrl
		self.hostname = hostname
		self.createDate = createDate

@dataclass
class TBTocs(db.Model):
	id : int
	courseId: int
	captionUrl : str
	duration : str
	posterUrl : str
	slug : str
	title : str
	url : str
	videoUrl : str
	createDate : str

	id = db.Column(db.Integer, primary_key=True)
	courseId = db.Column(db.Integer)
	captionUrl = db.Column(db.String(255))
	duration = db.Column(db.String(255))
	posterUrl = db.Column(db.String(255))
	slug = db.Column(db.String(255))
	title = db.Column(db.String(255))
	url = db.Column(db.String(255))
	videoUrl = db.Column(db.String(255))
	createDate = db.Column(db.String(12))

	def __init__(self, courseId, captionUrl, duration, posterUrl, slug, title, url, videoUrl, createDate):
		self.courseId = courseId
		self.captionUrl = captionUrl
		self.duration = duration
		self.posterUrl = posterUrl
		self.slug = slug
		self.title = title
		self.url = url
		self.videoUrl = videoUrl
		self.createDate = createDate

@dataclass
class TBTask(db.Model):
	id : int
	name : str
	sessionId : str
	courseId : int
	param : str
	createDate : str


	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(255))
	sessionId = db.Column(db.String(255))
	courseId = db.Column(db.Integer)
	param = db.Column(db.String(255))
	status = db.Column(db.Integer)
	createDate = db.Column(db.String(12))

	def __init__(self, name, sessionId, courseId, param, status, createDate):
		self.name = name
		self.sessionId = sessionId
		self.courseId = courseId
		self.param = param
		self.status = status
		self.createDate = createDate
	
