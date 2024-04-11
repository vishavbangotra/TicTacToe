from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET')
socket = SocketIO(app, cors_allowed_origins="*")
CORS(app)

@socket.on('connect')
@cross_origin()
def handle_connect():
    print('Client connected')

@socket.on('disconnect')
@cross_origin()
def handle_disconnect():
    print('Client disconnected')

@socket.on('message')
@cross_origin()
def handle_message(data):
    print('Received message:', data)

@socket.on('new_message')
@cross_origin()
def handle_new_message(message):
    print('Received message:', message)
    socket.emit('message', message)

if __name__ == '__main__':
    if app.config['SERVER_NAME'] and app.config['SERVER_NAME'].startswith('unix://'):
        socket_file = app.config['SERVER_NAME'][7:]  # Remove the "unix://" prefix
        if os.path.exists(socket_file):
            os.unlink(socket_file)
        app.run(debug=True, host=socket_file)
    else:
        app.run(debug=True)