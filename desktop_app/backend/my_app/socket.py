# from flask import Flask, render_template, session, copy_current_request_context, request
from flask_socketio import SocketIO
# , emit, disconnect
from threading import Lock
from flask_cors import CORS, cross_origin
from my_app import app
async_mode = 'threading'
cors = CORS(app,resources={r"/*":{"origins":"*"}})
app.config['SECRET_KEY'] = 'secret!'
socket_ = SocketIO(app, async_mode=async_mode,cors_allowed_origins="*")
# import eventlet
# eventlet.monkey_patch()
thread = None
thread_lock = Lock()