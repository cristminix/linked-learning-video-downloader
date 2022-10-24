function queryMP() {
    var ret = {};

    var scriptContent = `
	_mp = require('media-player');
    console.log(_mp);
    _vjs = _mp.videojs(document.querySelector('video.vjs-tech'));
    _captionUrl = _vjs.textTracks()[0].src;
    console.log(_captionUrl);
    setTimeout(()=>{_vjs.pause();},1000);
    //not working cookie
    _cookie = document.cookie;
    window.postMessage({from: "TOP", captionUrl: _captionUrl, cookie: _cookie},"*");
	`;


    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

}
Ext.main();
window.addEventListener("message", function(message) {
    if (message.data.from == "TOP") {
        console.log(message);
        Ext.state.lastCaptionUrl = message.data.captionUrl;
        Ext.state.cookie = message.data.cookie;
        chrome.runtime.sendMessage({captionUrl: message.data.captionUrl,cookie:message.data.cookie});
    }
});
chrome.runtime.onMessage.addListener(function (response, sendResponse) {
	// console.log(response);
	if(typeof response.event != 'undefined'){
		if(response.event == 'onHistoryStateUpdated'){
			Ext.main(true, response.url);
		}
        else if(response.event == 'onCoookieUpdated'){
			// Ext.main(true, response.url);
            console.log(JSON.stringify(response.cookie));
		}
	}
});