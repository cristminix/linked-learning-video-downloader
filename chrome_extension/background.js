
/****
 * Handle History.pushState
 * */
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {event: 'onHistoryStateUpdated',url: details.url}, function(response) {
	  });
	});
});