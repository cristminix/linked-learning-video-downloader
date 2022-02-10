from my_app import db

class TBSession(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	sessionId = db.Column(db.String(255),unique=True)
	createDate = db.Column(db.String(12))

	def __init__(self, sessionId, createDate):
		self.sessionId = sessionId
		self.createDate = createDate

	def __repr__(self):
		return '<Session %d' % (self.id)