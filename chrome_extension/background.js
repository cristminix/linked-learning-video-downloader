
/****
 * Handle History.pushState
 * */
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {event: 'onHistoryStateUpdated',url: details.url}, function(response) {
	  });
	});
});

setTimeout(()=>{
	history.pushState({}, "title 1", 'setting-up-the-development-environment?autoAdvance=true&autoSkip=false&autoplay=true&resume=false&u=95231473');
},2000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request,sender)
	if(request.type='url'){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  // const a = $("a[href='"+request.url+"']");
		  // a.trigger('click')
		});
	}
    if (request.type == "worktimer-notification")
      chrome.notifications.create('worktimer-notification', request.options, function() { });

    sendResponse();
});

chrome.tabs.onUpdated.addListener(function(id, info, tab){

	// decide if we're ready to inject content script
	if (tab.status !== "complete"){
		console.log("not yet");
		return;
	}
	// if (tab.url.toLowerCase().indexOf("youtube.com/watch") === -1){
	// 	console.log("you are not on a YouTube video");
	// 	return;
	// }
	
	chrome.cookies.getAll({domain: "linkedin.com"}, function(_cookie) {
	// console.log('Callback for cookies came in fine.');
	// console.log('cookies.length=' + cookies.length);        
	// 	for(var i=0; i<cookies.length;i++) {
	// 	  console.log(cookies[i].name, ':', cookies[i].value);
	// 	}
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {event: 'onCoookieUpdated',cookie: _cookie}, function(response) {
			});
		});
	});
	// chrome.tabs.executeScript(null, {"file": "ytview.js"});
	
	});