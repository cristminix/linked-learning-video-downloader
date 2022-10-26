# What is this for ?
Simple chrome extension that can allow you grab video url and its caption from LinkedIn Learning.

# Initialize project
Server side
```
cd linked-learning-video-downloader
python3 -m venv venv
source venv/bin/activate

#install dependencies
pip install -r desktop_app/backend/requirement.txt

npm install
```
Client side
```
cd linked-learning-video-downloader
cd desktop_app
npm install
```
# Starting server app
```
cd linked-learning-video-downloader
python3 desktop_app/backend/run.py 
```
# Start gui app
```
cd linked-learning-video-downloader
cd desktop_app
npm start
```

# Load unpacked extension from google chrome extensions settings
Extension directory is located in:
```
linked-learning-video-downloader/chrome_extension
```
