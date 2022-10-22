function getMediaPlayer() {
    var ret = {};

    var scriptContent = `
	window.__mediaPlayer = require('media-player');
	`;
    // for (var i = 0; i < variables.length; i++) {
    //     var currVariable = variables[i];
    //     scriptContent += "if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', JSON.stringify(" + currVariable + "));\n"
    // }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

	ret = window.__mediaPlayer;
	console.log(require('media-player'))
    // for (var i = 0; i < variables.length; i++) {
    //     var currVariable = variables[i];
    //     ret[currVariable] = $.parseJSON($("body").attr("tmp_" + currVariable));
    //     $("body").removeAttr("tmp_" + currVariable);
    // }

     $("#tmpScript").remove();

    return ret;
}
Ext.main();

chrome.runtime.onMessage.addListener(function (response, sendResponse) {
	// console.log(response);
	if(typeof response.event != 'undefined'){
		if(response.event == 'onHistoryStateUpdated'){
			Ext.main(true, response.url);
		}
	}
});