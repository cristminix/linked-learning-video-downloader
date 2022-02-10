Ext.proxy = {
	send : (_action, _data, _callback) =>{
        const payload = Object.assign({
            action : _action,
            callback : typeof _callback == 'string' ? _callback : 'noop'
        },_data);
        // console.log(payload);
        // Ws.conn.send(JSON.stringify(payload));
        Ext.socket.connection.emit(_action, payload);
    },
    resolveVideoUrl : (videoSlug, videoUrl, posterUrl,captionUrl, _callback) => {
        // Ext.manager.UI.setCurrentVideo(videoSlug);
        // Ext.manager.UI.setCurrentIndex(Ext.manager.getTocIndex(videoSlug));
        // Ext.manager.UI.setTotalVideos(Ext.manager.courseInfo.tocs.length);
        // let firstIndexChecked = Ext.manager.isFirstIndexChecked();
        // Ext.manager.UI.setChkIndex(firstIndexChecked?'Yes':'No');
        Ext.proxy.send('resolve_video_url',{sessionId:Ext.manager.getSessionId(),courseTitle: Ext.manager.getCourseTitle(),captionUrl:captionUrl,slug: videoSlug, videoUrl: videoUrl, posterUrl: posterUrl},_callback);
    } ,
    startDownload : (_callback) => {
        Ext.proxy.send('start_download',{sessionId:Ext.manager.getSessionId(),courseTitle: Ext.manager.getCourseTitle()},_callback);
    }
};