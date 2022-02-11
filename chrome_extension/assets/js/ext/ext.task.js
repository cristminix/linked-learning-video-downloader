Ext.task = {
	queryTask : () => {

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
    },
	trackVideoChanges : () =>{
		clearInterval(handleUrlData.siHandler);
		handleUrlData.siHandler = setInterval(()=>{
		    handleUrlChanges();
		},2000);
	},
	trackUrlChanges : () => {
		clearInterval(handleUrlData.siHandler);
		handleUrlData.siHandler = setInterval(()=>{
		    handleUrlChanges();
		},2000);
	},
	//////////////////////////
	handleUrlData : {
	    firstTime : true,
	    siHandler : 0 
	},
	handleVideoData : {
	    siHandler : 0,
	    lastVideoUrl : '',
	    lastPosterUrl: '',
	    lastVideoSlug: ''
	},
	handleVideoChanges : () => {
	    // console.log('Checking Video Changes');
	    try{
	        const videoContainer = $('.vjs-tech');
	        const videoUrl  = videoContainer.attr('src');
	        let linkUrlSplit   = document.location.href.split('://');
	        linkUrlSplit = linkUrlSplit[1].split('/');
	        const videoSlug = linkUrlSplit[3].split('?')[0];
	        

	        const posterUrl = $('.vjs-poster')[0].style.backgroundImage.replace(/url\(\"/,'').replace(/\"\)/,'');
	        if( handleVideoData.lastVideoUrl != videoUrl){
	            handleVideoData.lastVideoUrl  = videoUrl;
	            handleVideoData.lastPosterUrl = posterUrl;
	            handleVideoData.lastVideoSlug = videoSlug;

	            const codeList = $('code');
	            let captionUrl = '';
	            for(let i = 0; i < codeList.length; i++){
	                const t = $(codeList[i]).text();
	                if(t.match(/captionFile/g)){
	                    try{
	                        const metaData = JSON.parse(t);
	                        const presentation = metaData.included[2].presentation;
	                        const videoMetaData = presentation.videoPlay.videoPlayMetadata.transcripts[0];
	                        captionUrl = videoMetaData.captionFile;
	                        // console.log(captionUrl);
	                    }catch(e){
	                        console.log('couldnot load vtt');
	                    }
	                    
	                    break;
	                }
	            }
	            // console.log('resolveVideoUrl')
	            // videoUrl = videoUrl
	            SocketProxy.resolveVideoUrl(videoSlug, videoUrl, posterUrl,captionUrl, 'afterResolveVideoUrl');
	            // console.log(handleVideoData);
	            
	        }   
	    }catch(e){
	        console.log(e)
	    }

	},

	handleUrlChanges : () => {
	    // console.log('Checking Urls');
	    if( Ext.manager.fullUrl != window.location.href || handleUrlData.firstTime){
	        // console.log(Ext.manager.getInfo());
	        
	        Ext.manager.fullUrl = window.location.href;
	        try{
	            Ext.manager.sayHi();
	        }catch(e){
	            console.log(e);
	        }
	        
	    }
	    handleUrlData.firstTime = false;
	},
    /****************************
     * Related page check task
     */
	
	checkValidCoursePage(){
		return  $('.classroom-layout__content').length > 0;
	}
};