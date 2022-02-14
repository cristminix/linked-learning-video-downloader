from my_app import app
from my_app.socket import socket_
# import asyncio

if __name__ == '__main__':
    socket_.run(app, debug=False)