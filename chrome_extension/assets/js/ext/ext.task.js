Ext.task = {
	
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
	
    /****************************
     * Related page check task
     */
	
	checkValidCoursePage(){
		return  $('.classroom-layout__content').length > 0;
	},
	/****
	 * For async await return
	 * */
	getTask: async (taskName) => {
		try {
	 		let url = `${Ext.config.getServerUrl()}task/${Ext.manager.getSessionId()}/${Ext.manager.getCourseTitle()}`;
	 		if(typeof taskName == 'string'){
	 			url += `?name=${taskName}`;
	 		}
	 		let res = await Ext.proxy.create(url,'get');		
	        return res.data;
	    }
	    catch (err) {
	        return false;
	    }
	},

	createTask: async (taskName, param)=>{
		let url,res;
		const courseInfo = Ext.manager.getCourseInfo();
		try {
			switch(taskName){
				case 'create_course':
					url = `${Ext.config.getServerUrl()}task_create_course`;
			 		
			 		res = await Ext.proxy.create(url,'post',{
			 			sessionId : Ext.manager.getSessionId(),
			 			coursePath : courseInfo.coursePath,
			 			courseTitle : courseInfo.courseTitle,
			 			url: courseInfo.courseUrl,
			 			fullUrl: courseInfo.fullUrl,
			 			hostname: courseInfo.hostname 
			 		});		
			        return res.data;
				break;

				case 'create_toc':

					url = `${Ext.config.getServerUrl()}task_create_toc`;
			 		const tocs = Ext.manager.getToc();

			 		res = await Ext.proxy.create(url,'post',{
			 			sessionId : Ext.manager.getSessionId(),
			 			courseId : param.courseId,
			 			length: tocs.length,
			 			tocs: JSON.stringify(tocs)
			 		});	

			 			
			        return res.data;
				break;

				case 'update_toc':

					url = `${Ext.config.getServerUrl()}update_toc`;
			 		// const tocs = Ext.manager.getToc();

			 		res = await Ext.proxy.create(url,'post',{
			 			courseId:param.courseId,
			 			slug : param.slug,
			 			videoUrl : param.videoUrl,
			 			posterUrl : param.posterUrl,
			 			captionUrl : param.captionUrl
			 		});		

			 		Ext.state.currentTocsQueue[param.tocIndex].videoUrl = param.videoUrl;
			 		Ext.state.currentTocsQueue[param.tocIndex].captionUrl = param.captionUrl;
			 		Ext.state.currentTocsQueue[param.tocIndex].posterUrl = param.posterUrl;
			        return res.data;
				break;
			}
	 		
	    }
	    catch (err) {
	        return false;
	    }
	}
};