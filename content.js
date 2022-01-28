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
            SocketProxy.send('session_check',{sessionId:Manager.getSessionId()},_callback);            
        },
        create : (_callback) => {
            SocketProxy.send('session_create',{sessionId:Manager.getSessionId(),courseInfo:Manager.getInfo()},_callback);
        }
    },
    resolveVideoUrl : (videoSlug, videoUrl, posterUrl,captionUrl, _callback) => {
        SocketProxy.send('resolve_video_url',{sessionId:Manager.getSessionId(),captionUrl:captionUrl,slug: videoSlug, videoUrl: videoUrl, posterUrl: posterUrl},_callback);
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
    sessionKey:'__MalinkCorpSessionID__',
    sessionId:null,
    courseInfo:{},
    getSessionId:()=>{
        Manager.sessionId = getCookie(Manager.sessionKey);
        if(Manager.sessionId == null){
            Manager.sessionId = md5((new Date().toString()));
            setCookie(Manager.sessionKey, Manager.sessionId, 7); 
        }
        return Manager.sessionId;
    },
    sayHi:()=>{
        Manager.getSessionId();
        console.log('checking session');
        SocketProxy.Session.check('afterSessionCheck');        
    },
    onMessage:(event)=>{
            const data = JSON.parse(event.data);
            if(typeof Cb[data.callback] == 'function'){
                Cb[data.callback](data)
            }
    },
    getInfo:()=>{
        const fullUrl       = window.location.href;
        const protoSplitStr = '://';
        const fullUrlSplit  = fullUrl.split(protoSplitStr);
        const proto         = fullUrlSplit[0]; 
        const urlSplit      = fullUrlSplit[1].split('/');
        Manager.courseInfo.hostname      = urlSplit[0];
        Manager.courseInfo.coursePath    = `${urlSplit[1]}/${urlSplit[2]}`;
        Manager.courseInfo.courseUrl     = `${proto}${protoSplitStr}/${Manager.courseInfo.hostname }/${Manager.courseInfo.coursePath}`; 
        Manager.courseInfo.courseTitle   = urlSplit[2];
        Manager.courseInfo.tocs = Manager.getToc();
        Manager.courseInfo.fullUrl = fullUrl;

        return Manager.courseInfo;
    },
    getToc:()=>{
        // const tocContainer      = $('.classroom-layout-sidebar-body > .classroom-toc-section');
        const itemSelector      = '.classroom-toc-item .classroom-toc-item__content';
        const titleSelector     = '.classroom-toc-item__title';
        // const linkSelector     = '.classroom-toc-item__link';
        const durationSelector  = '.t-12';
        
        let tocs = [];
        // for(let i = 0; i < tocContainer.length; i++){
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
        // }

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
//*************************************************
// console.log('Hello')
// $('li.name > h1').text('Hello')