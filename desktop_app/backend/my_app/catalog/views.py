from flask import request, jsonify, Blueprint, render_template, session, copy_current_request_context
from my_app import app, db
from my_app.socket import socket_
from my_app.catalog.models import TBSession
from datetime import datetime
from flask_socketio import emit, disconnect
from flask_cors import cross_origin

catalog = Blueprint('catalog', __name__)
import os
# @catalog.route('/')
# @catalog.route('/home')
# def home():
# 	return "Welcome to the Catalog Home."
@catalog.route('/')
@catalog.route('/home')
def home():
	# return os.path.abspath('.')
    return render_template('index.html', async_mode=socket_.async_mode)
@cross_origin
@catalog.route('/session/<id>')
def session_detail(id):
	session_ = TBSession.query.filter(TBSession.sessionId == id).first()
	return jsonify(session_)

@catalog.route('/sessions')
def sessions():
	sessions = TBSession.query.all()
	res = {}
	for session in sessions:
		res[session.id] = {
			"sessionId" : session.sessionId,
			"createDate" : session.createDate
		}

	return jsonify(res)

@catalog.route('/session-create', methods=['POST'])
def create_session():
	sessionId = request.form.get("sessionId")
	createDate = datetime.now()

	session = TBSession(sessionId, createDate)
	db.session.add(session)
	db.session.commit()

	return "TBSession added"

# ----------------------------------------------------




@socket_.on('my_event', namespace='/api')
def test_message(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']})


@socket_.on('my_broadcast_event', namespace='/api')
def test_broadcast_message(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']},
         broadcast=True)


@socket_.on('disconnect_request', namespace='/api')
def disconnect_request():
    @copy_current_request_context
    def can_disconnect():
        disconnect()

    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': 'Disconnected!', 'count': session['receive_count']},
         callback=can_disconnect)

@socket_.on('session_check', namespace='/api')
def api_session_check(payload):
    print(payload)
    payload['count'] = TBSession.query.filter(TBSession.sessionId == payload.get('sessionId')).count()

    emit('my_response',payload,broadcast=True)

@socket_.on('session_create', namespace='/api')
def api_session_create(payload):
	sess = TBSession(payload.get('sessionId'), datetime.now())
	db.session.add(session)
	db.session.commit()
	payload['record'] = sess 	
	emit('my_response',payload,broadcast=True)

@socket_.on('query_task', namespace='/api')
def api_query_task(message):
    pass

@socket_.on('resolve_video_url', namespace='/api')
def api_resolve_video_url(message):
    pass

@socket_.on('start_download', namespace='/api')
def api_start_download(message):
    pass