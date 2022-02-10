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
    sayHi:()=>{
        //0. Show UI
        // Ext.manager.UI.constructUI();
        // Ext.manager.getSessionId();
        //1. check the current page is valid course page

        //2. getToc 

        //3. is current page is index 0 in tocs
        // const isFirstIndex = Ext.manager.checkFirstPageIndex();
        //4. wait user to confirm to go to course hompage to reach 0 index of tocs
        
        //5. check session
        // console.log('checking session');
        // Ext.manager.checkValidCourseUrl(()=>{
        //     Ext.manager.UI.showUI();
        //     SocketProxy.Session.check('afterSessionCheck');
        // },()=>{
        //     Ext.manager.UI.hideUI();
        // });
    },
	checkValidCourseUrl:(callback_,callback_non)=>{
        const extractedUrl = Ext.manager.extractUrl();
        const urlSegment3 = extractedUrl.urlSplit[2]; 
        if(urlSegment3.match(/\?/)){
            return;
        }
        if(Ext.manager.isValidCoursePage()){
            // console.log(extractedUrl);
            if(typeof callback_ == 'function'){
                callback_();
            }
        }else{
            if(typeof callback_non == 'function'){
                callback_non();
            }
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
	getInfo:()=>{
        const extractedUrl  = Ext.manager.extractUrl();
        const fullUrl       = extractedUrl.fullUrl;
        const protoSplitStr = extractedUrl.protoSplitStr;
        const fullUrlSplit  = extractedUrl.fullUrlSplit;
        const proto         = extractedUrl.proto; 
        const urlSplit      = extractedUrl.urlSplit;

        Ext.manager.courseInfo.hostname      = urlSplit[0];
        Ext.manager.courseInfo.coursePath    = `${urlSplit[1]}/${urlSplit[2]}`;
        Ext.manager.courseInfo.courseUrl     = `${proto}${protoSplitStr}/${Ext.manager.courseInfo.hostname }/${Ext.manager.courseInfo.coursePath}`; 
        Ext.manager.courseInfo.courseTitle   = urlSplit[2];
        Ext.manager.courseInfo.tocs = Ext.manager.getToc();
        Ext.manager.courseInfo.fullUrl = fullUrl;


        return Ext.manager.courseInfo;
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
            const linkUrl = linkContainer.attr('href').replace(/autoplay=true/,'autoplay=false');
            const linkUrlSplit = linkUrl.split('/');
            const videoSlug = linkUrlSplit[3].split('?')[0];
            // console.log(titleContainer.text().trim().replace(/\n.*/g,''));
            if(videoSlug != 'quiz')
                tocs.push( {slug: videoSlug,url:linkUrl,title : titleContainer.text().trim().replace(/\n.*/g,'')
            , duration: durationContainer.text().trim().replace(/\n.*/g,'')});
        }
        
        return tocs;

    },
	getTocIndex:(videoSlug)=>{
        try{
            const tocs = Ext.manager.courseInfo.tocs;
            for (var i = 1; i < tocs.length; i++) {
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