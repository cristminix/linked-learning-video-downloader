from dataclasses import dataclass
from my_app import db
from datetime import datetime

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
	idx : int
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
	idx = db.Column(db.Integer)
	captionUrl = db.Column(db.String(255))
	duration = db.Column(db.String(255))
	posterUrl = db.Column(db.String(255))
	slug = db.Column(db.String(255))
	title = db.Column(db.String(255))
	url = db.Column(db.String(255))
	videoUrl = db.Column(db.String(255))
	createDate = db.Column(db.String(12))

	def __init__(self, courseId, idx, captionUrl, duration, posterUrl, slug, title, url, videoUrl, createDate):
		self.courseId = courseId
		self.idx = idx
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
	
# -----------------------------------------------------

class User(db.Model):
    __tablename__ = 'users'

    id          = db.Column(db.Integer, primary_key=True)
    full_name   = db.Column(db.Text)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    # Use lazy=joined to prevent O(N) queries
    address     = db.relationship("Address", uselist=False, backref="user", lazy="joined")

class Address(db.Model):
    __tablename__ = 'addresses'

    id          = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, unique=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'))

# -----------------------------------------------------