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
        return Manager.courseInfo;
    },
    getToc:()=>{
        const tocContainer = $('.classroom-layout-sidebar-body > .classroom-toc-section');
        const titleSelector = '.classroom-toc-item__title';
        const durationSelector = '.';

    }
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