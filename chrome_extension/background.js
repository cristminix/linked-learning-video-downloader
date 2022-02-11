
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