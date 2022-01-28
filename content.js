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
let Manager = {
    sessionKey:'__MalinkCorpSessionID__',
    sessionId:null,
    courseInfo:{},
    sayHi:()=>{
        Manager.sessionId = getCookie(Manager.sessionKey);
        if(Manager.sessionId == null){
            Manager.sessionId = md5((new Date().toString()));
            setCookie(Manager.sessionKey, Manager.sessionId, 7); 
        }
        Ws.conn.send(JSON.stringify({
            action : 'chk_session', 
            sessionId : Manager.sessionId,
            courseInfo : Manager.getInfo()
        }));
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
        const tocContainer      = $('.classroom-layout-sidebar-body > .classroom-toc-section');
        const itemSelector      = '.classroom-toc-item__content';
        const titleSelector     = '.classroom-toc-item__title';
        // const linkSelector     = '.classroom-toc-item__link';
        const durationSelector  = '.t-12';
        
        let tocs = [];

        for(let i = 0; i < tocContainer.length; i++){
            const itemContainer = $(tocContainer[i]).find(itemSelector);
            for(let j = 0; j < itemContainer.length; j++){
                const titleContainer    = itemContainer.find(titleSelector);
                const linkContainer    = itemContainer.closest('a');
                const durationContainer  = itemContainer.find(durationSelector);
                const linkUrl = linkContainer.attr('href');
                const linkUrlSplit = linkUrl.split('/');
                const videoSlug = linkUrlSplit[3].split('?')[0];
                tocs[i] = {slug: videoSlug,url:linkUrl,title : titleContainer.text().trim().replace(/\n.*/g,'')
                , duration: durationContainer.text().trim().replace(/\n.*/g,'')};
            }
        }

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
    console.log('Checking Video Changes');
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
        console.log(handleVideoData);

    }

};

const handleUrlChanges = () => {
    console.log('Checking Urls');
    if( Manager.courseInfo.fullUrl != window.location.href || handleUrlData.firstTime){
        console.log(Manager.getInfo());
    }
    handleUrlData.firstTime = false;
};

clearInterval(handleUrlData.siHandler);
handleUrlData.siHandler = setInterval(()=>{
    handleUrlChanges();
},2000);

clearInterval(handleVideoData.siHandler);
handleVideoData.siHandler = setInterval(()=>{
    handleVideoChanges();
},2000);

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