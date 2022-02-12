
function makeDelay(ms) {
    var timer = 0;
    return function(callback){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
};
var delay_video = makeDelay(250);
var delay_page = makeDelay(250);
Ext.job = {

	init :  (historyChanged, url)=>{
		if(historyChanged){
			Ext.runOnceWaitForMainTag = false;
			console.log('History changed', url);
			const vtag =$('#vjs_video_3_html5_api');
			if(vtag.length){
				Ext.job.waitForVideoTag();
			}else{
				Ext.job.waitForMainContentTag();
			}
				
		}else{
			Ext.job.start();	
		}
	},
	waitForMainContentTag:()=>{
		
		$('main.init-body__main').unbind("DOMSubtreeModified");
		$("main.init-body__main").bind("DOMSubtreeModified", () => {
			delay_page((e) => {
			  try{
			  		console.log('init-body__main');
					const vtag =$('#vjs_video_3_html5_api');
					if(vtag.length && !Ext.runOnceWaitForMainTag){
						Ext.runOnceWaitForMainTag = true;
						$('main.init-body__main').unbind("DOMSubtreeModified");
						console.log('Vtag detected.')
			  			Ext.job.start();
			  			player=$('#vjs_video_3_html5_api')[0];
						player.pause();
					}					
			  }catch(e){
					Ext.log(e);	
			  }
			});
		});
	},
	waitForVideoTag : ()=>{
		$("#vjs_video_3_html5_api").unbind("DOMSubtreeModified");
		$("#vjs_video_3_html5_api").bind("DOMSubtreeModified", () => {
			delay_video((e) => {
			  Ext.job.start();
			  try{
					player=$('#vjs_video_3_html5_api')[0];
					player.pause();
					
			  }catch(e){
					Ext.log(e);	
			  }
			});
		});
	},
	start :  async ()=>{

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
				// const createCourseTask = await Ext.task.createTask('create_course');
				task= [];
			}
			// console.log(task)

			// 6. kerjakan task
			Ext.job.doTask(task);
		}else{
			Ext.log('URL Is not valid course page, extension is not running');
		}
	},

	doTask: async (task) =>{
		// Ext.log(task);
		
		try{
			// 1. check create_course
			let createCourseTask = Ext.job.checkTask('create_course',task);
			if( typeof createCourseTask != 'object'){
				createCourseTask = await Ext.task.createTask('create_course');
				task.push(createCourseTask);
			}
			// 1. check create_course
			let createTocTask = Ext.job.checkTask('create_toc',task);
			if( typeof createTocTask != 'object'){
				createTocTask = await Ext.task.createTask('create_toc',createCourseTask);
				task.push(createTocTask);
			}
			console.log(task);
		}catch(e){
			console.log(e)
		}
	},
	checkTask(taskName, task){
		for(let i=0 ; i < task.length; i++){
			const r = task[i];
			if(r.name == taskName){
				return r;
			}
		}
		return false;
	}
};

