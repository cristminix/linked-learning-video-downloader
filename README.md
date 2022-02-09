# What is this for ?
Simple chrome extension that can allow you grab video url and its caption from LinkedIn Learning, for further download using command line interface, buil with python backend.
This is legacy version for education purpose using basic functional programming in python, in order to implement interprocess communication from javascript to python and vice versa via websocket interface to execute task.

# Limitation
This script is not standalone and actually doesnt fit the perfect and complete app mechanism , but its just working from its just building, so this branch is just a bootstrap for the next branch for better quality of codes and ui

# instruction
  1. Load this project directory into chrome extensions after you enable developer mode
  2. In Chrome Browser Login to linkedin learning
  3. Goto server directory then start the socket server to begin start grabbing tocs of video coursed

    $ python socket_srv.py
  
  4. In Chrome Browser select the course page, and wait for the page automatically redirect from start to end of course
  5. Watch the console from the previous socket_srv.py, once completed then you can execute another python script to download course videos

    $ python server.py
    # Then select the index number of the course, the script will download the video and subtitle for you
    # video saved in storage/downloads/<your-selected-course-name> directory
  
  7. You can also create playlist to with included python script generate_playlist
    
    $ python generate_playlist.py
    # Then select the index number of the course, the script will generate .m3u file for you
    # saved in storage/downloads/<your-selected-course-name>/playlist.m3u
       
