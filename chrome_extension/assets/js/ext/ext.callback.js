Ext.callback = {
	
	afterStartDownload:(data)=>{
        console.log(data)
    },
    startWaiters : ()=>{
        clearInterval(handleVideoData.siHandler);
        handleVideoData.siHandler = setInterval(()=>{
            handleVideoChanges();
        },2000);
    },
    afterSessionCheck : (data)=>{
        if(!data.status){
            Ext.session.create('afterSessionCreate')
        }else{
            Ext.manager.getInfo();
            Ext.callback.startWaiters();
        }
        console.log(data);
    },
    afterSessionCreate : (data)=>{
        if(data.status){
            Ext.manager.getInfo();
            Ext.callback.startWaiters();
        }
        console.log(data);
    },
    afterResolveVideoUrl : (data)=>{
        
        let firstIndexChecked = Ext.manager.isFirstIndexChecked();
        Ext.manager.UI.setChkIndex(firstIndexChecked?'Yes':'No');
        // $('video')[0].stop();
        console.log(data);
        const tocs = data.tocs;    
        if(data.status){
            if(data.index == 0 && !firstIndexChecked){
                Ext.manager.createFirstIndexState();
                Ext.callback.resolveNextVideo(data.index, data.videoUrl,data.posterUrl,tocs);

            }
            else if(data.index > 0 && !firstIndexChecked  ){
                Ext.manager.createFirstIndexState();
                console.log('Starting from the first videos');

                Ext.callback.resolveNextVideo(-1, data.videoUrl,data.posterUrl,tocs);
            }else{
                Ext.callback.resolveNextVideo(data.index, data.videoUrl,data.posterUrl,tocs);
            }
        }else{
            Ext.callback.resolveNextVideo(data.index-1, data.videoUrl,data.posterUrl,tocs);
        }
        
    },
    resolveNextVideo: (index,videoUrl,posterUrl,tocs) => {
        Ext.manager.courseInfo.tocs = tocs;
        try{
            Ext.manager.courseInfo.tocs[index].videoUrl=videoUrl;
            Ext.manager.courseInfo.tocs[index].posterUrl=posterUrl;
        }catch(e){
            Ext.manager.courseInfo.tocs[0].videoUrl=videoUrl;
            Ext.manager.courseInfo.tocs[0].posterUrl=posterUrl;
        }
        

        if(index < Ext.manager.courseInfo.tocs.length - 1){
            const nextToc = Ext.manager.courseInfo.tocs[index+1];
            const linkSelector = `a[href*=${nextToc.slug}]`;
            console.log(nextToc.url);
            console.log('waiting for 1 sec to redirect');
            setTimeout(()=>{
                document.location.href = nextToc.url;
            },1000);
        }else{
            console.log('You have reach the last video');
            SocketProxy.startDownload('afterStartDownload')
            // eraseCookie(Ext.manager.sessionKey+'_chkFirstIndex');
        }
    },

    
};