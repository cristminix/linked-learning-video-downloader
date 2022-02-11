
function makeDelay(ms) {
    var timer = 0;
    return function(callback){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
};
var delay = makeDelay(250);
Ext.job = {
	init :  (historyChanged, url)=>{
		if(historyChanged){
			Ext.log('History changed', url);
			$("#vjs_video_3_html5_api").unbind("DOMSubtreeModified");
			$("#vjs_video_3_html5_api").bind("DOMSubtreeModified", () => {
				delay((e) => {
				  Ext.job.start();
				  try{
						player=$('#vjs_video_3_html5_api')[0];
						player.pause();
						
				  }catch(e){
						Ext.log(e);	
				  }
				});
			});	
		}else{
			Ext.job.start();	
		}
	},
	start :  async ()=>{
		// 
		// Ext.session.check((data)=>{
		// 	Ext.log(data);
		// },(error)=>{
		// 	Ext.log(error)
		// });
		// Ext.task.queryTask();


		// 1. Check valid Course Page

		const isValidCoursePage = Ext.task.checkValidCoursePage();
		Ext.log('Checking valid course Page :');
		if(isValidCoursePage){
			Ext.log('URL Is valid course page');
			Ext.log('Await getting session');

			// 1. check session
			let session = await Ext.session.getSession();
			
			if(session == null){
				// 2. jika belum dibuat
				// 2.1 buat session
				session = await Ext.session.createSession();
				// 2.2 lanjut ke step 3
			}
			console.log(session)
			// 3. jika sudah dibuat
			let task = await Ext.task.getTask();
			// 4. cek task 
			// 5. jika belum dibuat
			if(task == null){
				// 5.1 buat task 
				task = await Ext.task.createTask();
			}
			console.log(task)

			// 6. kerjakan task
			Ext.job.doTask(task);
		}else{
			Ext.log('URL Is not valid course page, extension is not running');
		}
	},

	doTask(task){
		Ext.log(task)
	}
	
};

