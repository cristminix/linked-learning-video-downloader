function delay_wait(callback, ms) {
  var timer = 0;
  return function() {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}
function makeDelay(ms) {
    var timer = 0;
    return function(callback){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
};
var delay = makeDelay(250);
Ext.job = {
	start(){
		// Ext.socket.init();
		// Ext.session.check((data)=>{
		// 	console.log(data);
		// },(error)=>{
		// 	console.log(error)
		// });
		// Ext.task.queryTask();


		// 1. Check valid Course Page

		const isValidCoursePage = Ext.task.checkValidCoursePage();
		console.log('Checking valid course Page :');
		if(isValidCoursePage){
			console.log('URL Is valid course page');
		}else{
			console.log('URL Is not valid course page, extension is not running');
		}
	},
	init(historyChanged, url){
		if(historyChanged){
			console.log('History changed', url);
			$("#vjs_video_3_html5_api").unbind("DOMSubtreeModified");
			$("#vjs_video_3_html5_api").bind("DOMSubtreeModified", () => {
				delay((e) => {
				  Ext.job.start();
				  try{
						player=$('#vjs_video_3_html5_api')[0];
						player.pause();
						
				  }catch(e){
						console.log(e)	
				  }
				});
			});	
		}else{
			Ext.job.start();	
		}
	}
};

