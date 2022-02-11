Ext.main();

chrome.runtime.onMessage.addListener(function (response, sendResponse) {
	// console.log(response);
	if(typeof response.event != 'undefined'){
		if(response.event == 'onHistoryStateUpdated'){
			Ext.main(true, response.url);
		}
	}
});