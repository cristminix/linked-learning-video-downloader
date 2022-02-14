from flask import request, jsonify, url_for,Blueprint, render_template, session, copy_current_request_context
from my_app import app, db
from my_app.socket import socket_
from my_app.manager import *
from my_app.catalog.models import TBSession, TBCourse, TBTask, TBTocs, User, Address
from datetime import datetime
from flask_socketio import emit, disconnect
from flask_cors import cross_origin
from datatables import *
import json
import asyncio
# loop = asyncio.get_event_loop()
import threading
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
@catalog.route('/session/<sessionId>')
def session_detail(sessionId):
	session_ = TBSession.query.filter(TBSession.sessionId == sessionId).first()
	return jsonify(session_)

@cross_origin
@catalog.route('/course/<courseId>')
def course_detail(courseId):
	course = TBCourse.query.filter(TBCourse.id == courseId).first()
	return jsonify(course)

@cross_origin
@catalog.route('/course_by_session/<sessionId>')
def course_by_session(sessionId):
	course = TBCourse.query.filter(TBCourse.sessionId == sessionId).all()
	return jsonify(course)

@cross_origin
@catalog.route('/tocs_by_course/<courseId>')
def tocs_by_course(courseId):
	tocs = TBTocs.query.filter(TBTocs.courseId == courseId).all()
	return jsonify(tocs)

@cross_origin
@catalog.route('/download_by_toc/<tocId>')
def download_by_toc(tocId):
	toc = TBTocs.query.filter(TBTocs.id == tocId).first()
	if toc:
		course =  TBCourse.query.filter(TBCourse.id == toc.courseId).first()
		download_dir = get_download_dir(course.courseTitle)
		threading.Thread(target=download_file, args=(toc.videoUrl,"%s/%s.mp4" % (download_dir,toc.slug),toc,socket_)).start()
		# loop.ensure_future(download_file)
		# await asyncio.wait({task})
	return jsonify(toc)

@cross_origin
@catalog.route('/session_create',methods=['POST'])
def session_create():
	sess = TBSession(request.form.get('sessionId'), datetime.now())
	db.session.add(sess)
	db.session.commit()
	db.session.flush()
	return jsonify(sess)

@cross_origin
@catalog.route('/task/<sessionId>/<courseTitle>')
def task_detail(sessionId, courseTitle):
	course = TBCourse.query.filter(TBCourse.sessionId == sessionId , TBCourse.courseTitle == courseTitle).first()
	if course:
		task = TBTask.query.filter(TBTask.sessionId == sessionId , TBTask.courseId == course.id).all()
		return jsonify(task)

	return jsonify(None)

@cross_origin
@catalog.route('/task_create_course',methods=['POST'])
def task_create():
	course = TBCourse.query.filter(TBCourse.sessionId == request.form.get('sessionId') , TBCourse.courseTitle == request.form.get('courseTitle')).first()
	if not course:
		course = TBCourse(request.form.get('sessionId'), request.form.get('coursePath'), request.form.get('courseTitle'), request.form.get('url'), request.form.get('fullUrl'),  request.form.get('hostname'),datetime.now())
		
		db.session.add(course)
		db.session.commit()
		db.session.flush()
	
	task = TBTask.query.filter(TBTask.sessionId == request.form.get('sessionId') , TBTask.courseId == course.id , TBTask.name == 'create_course').first()
	if not task:
		task = TBTask('create_course', request.form.get('sessionId'), course.id, course.courseTitle,1,datetime.now())
		
		db.session.add(task)
		db.session.commit()
		db.session.flush()

	return jsonify(task)

@cross_origin
@catalog.route('/task_create_toc',methods=['POST'])
def task_create_toc():
	task = TBTask.query.filter(TBTask.sessionId == request.form.get('sessionId') , TBTask.courseId ==  request.form.get('courseId') , TBTask.name == 'create_toc').first()
	if not task:
		jsonData = {'length': request.form.get('length'), "tocIds":[]}
		task = TBTask('create_toc', request.form.get('sessionId'),  request.form.get('courseId'),  json.dumps(jsonData),0,datetime.now())
		db.session.add(task)
		db.session.commit()
		db.session.flush()
	tocs = json.loads(request.form.get('tocs'))

	for idx, toc_ in enumerate(tocs):
		toc = TBTocs.query.filter(TBTocs.courseId == request.form.get('courseId'), TBTocs.slug == toc_.get('slug')).first()
		if not toc:
			toc = TBTocs(request.form.get('courseId'),idx, toc_.get('captionUrl'), toc_.get('duration'), toc_.get('posterUrl'), toc_.get('slug'), toc_.get('title'), toc_.get('url'), toc_.get('videoUrl'),datetime.now())
			db.session.add(toc)
			db.session.commit()
			db.session.flush()
	# print(rjson)	
	return jsonify(task)

@cross_origin
@catalog.route('/update_toc',methods=['POST'])
def update_toc():
	toc = TBTocs.query.filter(TBTocs.slug == request.form.get('slug'), TBTocs.courseId == request.form.get('courseId')).first()
	if toc:
		toc.captionUrl = request.form.get('captionUrl')
		toc.posterUrl =  request.form.get('posterUrl')
		toc.videoUrl = request.form.get('videoUrl')
		toc.captionUrl = request.form.get('captionUrl')
		db.session.commit()
		# db.session.flush()

	return jsonify(toc)
# ----------------------------------------------------
# Example
def perform_search(queryset, user_input):
    return queryset.filter(
        db.or_(
            User.full_name.like('%' + user_input + '%'),
            Address.description.like('%' + user_input + '%')
            )
        )

def perform_column_search(model_column, queryset, user_input):
    return queryset.filter(model_column.like("%" + user_input + "%"))

@app.route("/data")
def datatables_users():
    table = DataTable(request.args, User, db.session.query(User), [
        "id",
        ("name", "full_name", lambda i: "User: {}".format(i.full_name)),
        ("address", "address.description"),
    ])
    table.add_data(link=lambda obj: 'view_user/%s'%(obj.id))
    table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    # table.searchable_column(
    #     lambda model_column, queryset, user_input:
    #         perform_column_search(model_column, queryset, user_input)
    # )

    return json.dumps(table.json())
# -----------------------------------------------------
@cross_origin
@catalog.route('/datatables/sessions')
def datatables_sessions():
	table = DataTable(request.args, TBSession, db.session.query(TBSession), [
	    "id",
	    "sessionId",
	    "createDate"
	])
	table.add_data(link=lambda obj: 'view_user/%s'%(obj.id))
	return json.dumps(table.json())

@cross_origin
@catalog.route('/datatables/tasks')
def datatables_tasks():
	table = DataTable(request.args, TBTask, db.session.query(TBTask), [
		"id",
		"name",
		"sessionId",
		"courseId",
		# ("courseTitle", "tbCourse.courseTitle"),
		"param",
		"status",
		"createDate"
	])
	table.add_data(link=lambda obj: 'view_user/%s'%(obj.id))
	return json.dumps(table.json())

@cross_origin
@catalog.route('/datatables/courses')
def datatables_courses():
	table = DataTable(request.args, TBCourse, db.session.query(TBCourse), [
	    "id",
	    "sessionId",
	    "coursePath",
	    "courseTitle",
	    "url",
	    "hostname",
	    "createDate"
	])
	table.add_data(link=lambda obj: 'view_user/%s'%(obj.id))
	return json.dumps(table.json())

@cross_origin
@catalog.route('/datatables/tocs')
def datatables_tocs():
	table = DataTable(request.args, TBTocs, db.session.query(TBTocs), [
	    "id",
	    "courseId",
	    "idx",
	    "title",
	    "captionUrl",
	    "duration",
	    "posterUrl",
	    "slug",
	    "url",
	    "videoUrl",
	    "createDate"
	])
	table.add_data(link=lambda obj: 'view_user/%s'%(obj.id))
	return json.dumps(table.json())
# ----------------------------------------------------




# @socket_.on('my_event', namespace='/api')
# def test_message(message):
#     session['receive_count'] = session.get('receive_count', 0) + 1
#     emit('my_response',
#          {'data': message['data'], 'count': session['receive_count']})


# @socket_.on('my_broadcast_event', namespace='/api')
# def test_broadcast_message(message):
#     session['receive_count'] = session.get('receive_count', 0) + 1
#     emit('my_response',
#          {'data': message['data'], 'count': session['receive_count']},
#          broadcast=True)


# @socket_.on('disconnect_request', namespace='/api')
# def disconnect_request():
#     @copy_current_request_context
#     def can_disconnect():
#         disconnect()

#     session['receive_count'] = session.get('receive_count', 0) + 1
#     emit('my_response',
#          {'data': 'Disconnected!', 'count': session['receive_count']},
#          callback=can_disconnect)

# @socket_.on('session_check', namespace='/api')
# def api_session_check(payload):
#     print(payload)
#     payload['count'] = TBSession.query.filter(TBSession.sessionId == payload.get('sessionId')).count()

#     emit('my_response',payload,broadcast=True)


# @socket_.on('query_task', namespace='/api')
# def api_query_task(message):
#     pass

# @socket_.on('resolve_video_url', namespace='/api')
# def api_resolve_video_url(message):
#     pass

# @socket_.on('start_download', namespace='/api')
# def api_start_download(message):
#     pass