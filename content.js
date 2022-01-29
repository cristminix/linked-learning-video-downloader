function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
const get_ws_server = () => {
    return "127.0.0.1"
}
SocketProxy = {
    send : (_action, _data, _callback) =>{
        const payload = Object.assign({
            action : _action,
            callback : typeof _callback == 'string' ? _callback : 'noop'
        },_data);
        Ws.conn.send(JSON.stringify(payload));
    },
    Session : {
        check : (_callback) => {
            SocketProxy.send('session_check',{sessionId:Manager.getSessionId(),courseTitle: Manager.getCourseTitle()},_callback);            
        },
        create : (_callback) => {
            SocketProxy.send('session_create',{sessionId:Manager.getSessionId(),courseTitle: Manager.getCourseTitle(),courseInfo:Manager.getInfo()},_callback);
        }
    },
    resolveVideoUrl : (videoSlug, videoUrl, posterUrl,captionUrl, _callback) => {
        SocketProxy.send('resolve_video_url',{sessionId:Manager.getSessionId(),courseTitle: Manager.getCourseTitle(),captionUrl:captionUrl,slug: videoSlug, videoUrl: videoUrl, posterUrl: posterUrl},_callback);
    } 
};
let Cb = {
    startWaiters : ()=>{
        clearInterval(handleUrlData.siHandler);
        handleUrlData.siHandler = setInterval(()=>{
            handleUrlChanges();
        },2000);

        clearInterval(handleVideoData.siHandler);
        handleVideoData.siHandler = setInterval(()=>{
            handleVideoChanges();
        },2000);
    },
    afterSessionCheck : (data)=>{
        if(!data.status){
            SocketProxy.Session.create('afterSessionCreate')
        }else{
            Manager.getInfo();
            Cb.startWaiters();
        }
        console.log(data);
    },
    afterSessionCreate : (data)=>{
        if(data.status){
            Manager.getInfo();
            Cb.startWaiters();
        }
        console.log(data);
    },
    afterResolveVideoUrl : (data)=>{
        if(data.status){
            Cb.resolveNextVideo(data.index, data.videoUrl,data.posterUrl);
        }
        console.log(data);
    },
    resolveNextVideo: (index,videoUrl,posterUrl) => {
        Manager.courseInfo.tocs[index].videoUrl=videoUrl;
        Manager.courseInfo.tocs[index].posterUrl=posterUrl;

        if(index < Manager.courseInfo.tocs.length - 1){
            const nextToc = Manager.courseInfo.tocs[index+1];
            const linkSelector = `a[href*=${nextToc.slug}]`;
            console.log(linkSelector)
            // $(linkSelector).click();
            document.location.href = nextToc.url;
            
        }else{
            console.log('You have reach the last video');
        }
        // console.log(Manager.courseInfo.tocs)
    }
};
let Manager = {
    sessionKey: '__MalinkCorpSessionID__',
    sessionId: null,
    currentCourseTitle: null,
    courseInProgress: false,
    courseIsComplete: false,
    courseInfo: {},
    getSessionId: ()=>{
        Manager.sessionId = getCookie(Manager.sessionKey);
        if(Manager.sessionId == null){
            Manager.sessionId = md5((new Date().toString()));
            setCookie(Manager.sessionKey, Manager.sessionId, 7); 
        }
        return Manager.sessionId;
    },
    UI:{
        html: `
<div id="__MalinkCorpSessionID__">
    <div class="ui_title"><h4>Lynda Course Downloader</h4></div>
    <table class="ui_table">
        <tbody>
            <tr>
                <th>Course Title</th><td><span class="course_title"></span></td>
            </tr>
            <tr>    
                <th>Total Videos</th><td><span class="total_videos"></span></td>
            </tr>
            <tr>
                <th>Current Video</th><td><span class="current_video"></span></td>
            </tr>
            <tr>
                <th>Progress</th><td><span class="dl_progress"></span></td>
            </tr>
            <tr>
                <td colspan="2"><button>Continue</button><button>Pause</button><button>Stop</button></td>
            </tr>
        </tbody>
    </table>
    <div class="ui_warning"><code></code></div>
    <div class="ui_error"><code></code></div>

</div>
        `,
        applyUIStyle:()=>{
            setTimeout(()=>{
                $('#__MalinkCorpSessionID__').css({'font-size':'80%', position: 'absolute',padding:'1em',background:'#fff','text-align':'left','z-index':'10000'})
            },1000);
        },
        constructUI:()=>{
            if($(`${Manager.sessionKey}`).length == 0){
                $(document.body).prepend(Manager.UI.html);
                Manager.UI.applyUIStyle();
            }
        },
        setCourseTitle:(title)=>{
            $(`${Manager.sessionKey} .course_title`).text(title);
        },
        setTotalVideos:(title)=>{
            $(`${Manager.sessionKey} .total_videos`).text(title);
        },
        setCurrentVideo:(title)=>{
            $(`${Manager.sessionKey} .current_video`).text(title);
        },
        waning:(message)=>{
            setTimeout(()=>{
                $(`${Manager.sessionKey} .ui_warning code`).text(message);
            },3000);
        },
        error:(message)=>{
            setTimeout(()=>{
                $(`${Manager.sessionKey} .ui_error code`).text(message);
            },3000);
        }
    },
    isValidCoursePage:()=>{
        return $('.classroom-layout__content').length > 0;
    },
    checkCourseIsComplete:()=>{
        return Manager.courseIsComplete;
    },
    checkFirstPageIndex:()=>{
        const tocs = Manager.getToc();

        if(Manager.currentCourseTitle != null){
            if(Manager.courseInProgress == false){

            }
        }
    },
    sayHi:()=>{
        //0. Show UI
        Manager.UI.constructUI();
        Manager.getSessionId();
        //1. check the current page is valid course page

        //2. getToc 

        //3. is current page is index 0 in tocs
        const isFirstIndex = Manager.checkFirstPageIndex();
        //4. wait user to confirm to go to course hompage to reach 0 index of tocs
        
        //5. check session
        console.log('checking session');
        SocketProxy.Session.check('afterSessionCheck');        
    },
    onMessage:(event)=>{
            const data = JSON.parse(event.data);
            if(typeof Cb[data.callback] == 'function'){
                Cb[data.callback](data)
            }
    },
    getCourseTitle : ()=>{
        const extractedUrl  = Manager.extractUrl();
        courseTitle = extractedUrl.urlSplit[2];
        Manager.UI.setCourseTitle(courseTitle);
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
        const extractedUrl  = Manager.extractUrl();
        const fullUrl       = extractedUrl.fullUrl;
        const protoSplitStr = extractedUrl.protoSplitStr;
        const fullUrlSplit  = extractedUrl.fullUrlSplit;
        const proto         = extractedUrl.proto; 
        const urlSplit      = extractedUrl.urlSplit;

        Manager.courseInfo.hostname      = urlSplit[0];
        Manager.courseInfo.coursePath    = `${urlSplit[1]}/${urlSplit[2]}`;
        Manager.courseInfo.courseUrl     = `${proto}${protoSplitStr}/${Manager.courseInfo.hostname }/${Manager.courseInfo.coursePath}`; 
        Manager.courseInfo.courseTitle   = urlSplit[2];
        Manager.courseInfo.tocs = Manager.getToc();
        Manager.courseInfo.fullUrl = fullUrl;

        return Manager.courseInfo;
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
            const linkUrl = linkContainer.attr('href');
            const linkUrlSplit = linkUrl.split('/');
            const videoSlug = linkUrlSplit[3].split('?')[0];
            console.log(titleContainer.text().trim().replace(/\n.*/g,''));
            if(videoSlug != 'quiz')
                tocs.push( {slug: videoSlug,url:linkUrl,title : titleContainer.text().trim().replace(/\n.*/g,'')
            , duration: durationContainer.text().trim().replace(/\n.*/g,'')});
        }
        Manager.UI.setTotalVideos(tocs.length);
        return tocs;

    }
};
let handleUrlData = {
    firstTime : true,
    siHandler : 0 
};

let handleVideoData = {
    siHandler : 0,
    lastVideoUrl : '',
    lastPosterUrl: '',
    lastVideoSlug: ''
}

const handleVideoChanges = () => {
    // console.log('Checking Video Changes');
    const videoContainer = $('.vjs-tech');
    const videoUrl  = videoContainer.attr('src');
    let linkUrlSplit   = document.location.href.split('://');
    linkUrlSplit = linkUrlSplit[1].split('/');
    const videoSlug = linkUrlSplit[3].split('?')[0];
    Manager.UI.setCurrentVideo(videoSlug);
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
                    console.log(captionUrl);
                }catch(e){
                    console.log('couldnot load vtt');
                }
                
                break;
            }
        }
        console.log('resolveVideoUrl')
        SocketProxy.resolveVideoUrl(videoSlug, videoUrl, posterUrl,captionUrl, 'afterResolveVideoUrl')
        // console.log(handleVideoData);

    }

};

const handleUrlChanges = () => {
    // console.log('Checking Urls');
    if( Manager.courseInfo.fullUrl != window.location.href || handleUrlData.firstTime){
        // console.log(Manager.getInfo());
    }
    handleUrlData.firstTime = false;
};

//**************************************************
let Ws = {
    conn: 0,
    instance:false,
    autoReconnectInterval : 5*1000,
    init:function() {
        Ws.conn = new WebSocket('ws://'+get_ws_server()+':8080/');
        
        Ws.conn.onopen = ()=>{
            console.log('Koneksi WebSocket terhubung');
            Manager.sayHi();
            if(typeof Ws.conn.onmessage != 'function'){
                Ws.conn.onmessage = Manager.onMessage;
            }
        };
        Ws.conn.onclose = () =>{
            console.log('Koneksi WebSocket ditutup');
            Ws.reconnect();
        };
    },
    reconnect : function( ){
        console.log('Ws: Mencoba lagi dalam '+(Ws.autoReconnectInterval/1000)+' detik' );
        var self = Ws;
        setTimeout(function(){
            console.log("Ws: Menyambung kembali...");
            self.init();
        },Ws.autoReconnectInterval);
    }

}
Ws.init(); 