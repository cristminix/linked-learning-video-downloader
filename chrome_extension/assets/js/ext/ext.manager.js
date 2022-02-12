Ext.manager = {
	sessionKey: '__MalinkCorpSessionID__',
    sessionId: null,
    currentCourseTitle: null,
    courseInProgress: false,
    courseIsComplete: false,
    firstIndexChecked: false,
    fullUrl : '',
    courseInfo: {},
    getSessionId: ()=>{
        Ext.manager.sessionId = getCookie(Ext.manager.sessionKey);
        if(Ext.manager.sessionId == null){
            Ext.manager.sessionId = md5((new Date().toString()));
            setCookie(Ext.manager.sessionKey, Ext.manager.sessionId, 7); 
        }
        return Ext.manager.sessionId;
    },
    isFirstIndexChecked:()=>{
        return getCookie(Ext.manager.sessionKey+'_chkFirstIndex') == 'yes';
    },
    createFirstIndexState:()=>{
        setCookie(Ext.manager.sessionKey+'_chkFirstIndex','yes', 7); 
    },
	isValidCoursePage:()=>{
        return $('.classroom-layout__content').length > 0;
    },
    checkCourseIsComplete:()=>{
        return Ext.manager.courseIsComplete;
    },
    getCurrentVideoInfo(){
        const videoContainer = $('.vjs-tech');
        const videoUrl  = videoContainer.attr('src');
        let linkUrlSplit   = document.location.href.split('://');
        linkUrlSplit = linkUrlSplit[1].split('/');
        const videoSlug = linkUrlSplit[3].split('?')[0];
        

        const posterUrl = $('.vjs-poster')[0].style.backgroundImage.replace(/url\(\"/,'').replace(/\"\)/,'');
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
        return {
            videoUrl : videoUrl,
            posterUrl : posterUrl,
            captionUrl: captionUrl,
            videoSlug : videoSlug
        }
    },
    
	
	getCourseTitle : ()=>{
        const extractedUrl  = Ext.manager.extractUrl();
        courseTitle = extractedUrl.urlSplit[2];
        return courseTitle;
    },
    extractUrl : () => {
        const fullUrl       = window.location.href;
        const protoSplitStr = '://';
        const fullUrlSplit  = fullUrl.split(protoSplitStr);
        const proto         = fullUrlSplit[0]; 
        const urlSplit      = fullUrlSplit[1].split('/');

        return {
            fullUrl : fullUrl,
            proto : proto,
            protoSplitStr : protoSplitStr,
            urlSplit : urlSplit,
            fullUrlSplit : fullUrlSplit
        };
    },
	getCourseInfo:()=>{
        const extractedUrl  = Ext.manager.extractUrl();
        const fullUrl       = extractedUrl.fullUrl;
        const protoSplitStr = extractedUrl.protoSplitStr;
        const fullUrlSplit  = extractedUrl.fullUrlSplit;
        const proto         = extractedUrl.proto; 
        const urlSplit      = extractedUrl.urlSplit;

        let courseInfo = {};

        courseInfo.hostname      = urlSplit[0];
        courseInfo.coursePath    = `${urlSplit[1]}/${urlSplit[2]}`;
        courseInfo.courseUrl     = `${proto}${protoSplitStr}/${courseInfo.hostname }/${courseInfo.coursePath}`; 
        courseInfo.courseTitle   = urlSplit[2];
        // Ext.manager.courseInfo.tocs = Ext.manager.getToc();
        courseInfo.fullUrl = fullUrl;


        return courseInfo;
    },
	getToc:()=>{
        const itemSelector      = '.classroom-toc-item .classroom-toc-item__content';
        const titleSelector     = '.classroom-toc-item__title';
        const durationSelector  = '.t-12';
        
        let tocs = [];
        const itemContainer = $(itemSelector);
        for(let j = 0; j < itemContainer.length; j++){
            const titleContainer    = $(itemContainer[j]).find(titleSelector);
            const linkContainer     = $(itemContainer[j]).closest('a.ember-view');
            const durationContainer  = $(itemContainer[j]).find(durationSelector);
            const origLinkUrl = linkContainer.attr('href');
            const linkUrl = origLinkUrl.replace(/autoplay=true/,'autoplay=false');

            const linkUrlSplit = linkUrl.split('/');
            const videoSlug = linkUrlSplit[3].split('?')[0];
            const titleText = titleContainer.text().trim().replace(/\n.*/g,'');
            const durationText = durationContainer.text().trim().replace(/\n.*/g,'');

            if(videoSlug != 'quiz'){
                tocs.push( {slug: videoSlug,url:linkUrl,title : titleText, duration: durationText, origLinkUrl:origLinkUrl});
            }
        }
        
        return tocs;

    },
	getTocIndexBySlug:(videoSlug)=>{
        try{
            const tocs = Ext.state.currentTocsQueue;
            for (var i = 0; i < tocs.length; i++) {
                if(tocs[i].slug == videoSlug){
                    return i;
                }
            }
        }catch(e){
            return -1;
        }
        return -1;
    }
};