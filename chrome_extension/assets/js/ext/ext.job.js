
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
			const vtag =$('video.vjs-tech');
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
		// Ext.runOnceWaitForMainTag = false;
		$('main.init-body__main').unbind("DOMSubtreeModified");
		$("main.init-body__main").bind("DOMSubtreeModified", () => {
			delay_page((e) => {
			  try{
			  		console.log('init-body__main');
					const vtag =$('video.vjs-tech');
					if(vtag.length && !Ext.runOnceWaitForMainTag){
						Ext.runOnceWaitForMainTag = true;
						$('main.init-body__main').unbind("DOMSubtreeModified");
						console.log('Vtag detected.')
			  			Ext.job.start();
			  			player=$('video.vjs-tech')[0];
						player.pause();
					}					
			  }catch(e){
					Ext.log(e);	
			  }
			});
		});
	},
	waitForVideoTag : ()=>{
		$("video.vjs-tech").unbind("DOMSubtreeModified");
		$("video.vjs-tech").bind("DOMSubtreeModified", () => {
			delay_video((e) => {
			  Ext.job.start();
			  try{
					player=$('video.vjs-tech')[0];
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
			let tasks = await Ext.task.getTask();
			// 4. cek task 
			// 5. jika belum dibuat
			if(tasks == null){
				// 5.1 buat task 
				// const createCourseTask = await Ext.task.createTask('create_course');
				tasks= [];
			}
			// console.log(tasks)

			// 6. kerjakan tasks
			Ext.job.doTask(tasks);
		}else{
			Ext.log('URL Is not valid course page, extension is not running');
			if(document.location.hostname == 'translate.google.com'){
				Ext.translator.afterTranslate();
			}
		}
	},

	doTask: async (tasks) =>{
		// Ext.log(tasks);
		
		try{
			// 1. check create_course
			let createCourseTask = Ext.job.checkTask('create_course',tasks);
			if( typeof createCourseTask != 'object'){
				createCourseTask = await Ext.task.createTask('create_course');
				tasks.push(createCourseTask);
			}
			// 2. check create_toc
			let createTocTask = Ext.job.checkTask('create_toc',tasks);
			if( typeof createTocTask != 'object'){
				createTocTask = await Ext.task.createTask('create_toc',createCourseTask);
				tasks.push(createTocTask);
			}
			// 3. check update_toc
			let taskUpdateToc = Ext.job.queryTask('update_toc',createTocTask, tasks);
			console.log(tasks);
		}catch(e){
			console.log(e)
		}
	},
	checkTask(taskName, tasks){
		for(let i=0 ; i < tasks.length; i++){
			const r = tasks[i];
			if(r.name == taskName){
				return r;
			}
		}
		return false;
	},
	queryTask : async (taskName, param, tasks) =>{
		switch(taskName){
			case 'update_toc':

			 	if(Ext.state.currentTocsQueue.length == 0){
			 		Ext.state.currentTocsQueue = Ext.manager.getToc();
			 	}
				const info = Ext.manager.getCurrentVideoInfo();

				

				// 1. check first index checked
				/*if(!Ext.state.firstIndexChecked ){
					// 1.2. jika tidak
					Ext.state.firstIndexChecked = true;
					// 1.3. goto first link confirm
					if(tocIndex != 0){
						if(confirm('Would you like to go to the first link course ?')){
						// 1.3.1. goto the first lik
							console.log('Go to the first link toc index');
							const toc = Ext.state.currentTocsQueue[0];
							const url = toc.origLinkUrl;
							const a = $("a[href='"+url+"']");
							if(a.length>0){
								setTimeout(()=>{
									a[0].click()
								},1000); 
								break;
							}
							return;	
						}
					}
					
				}*/
				const tocIndex = info.tocIndex;

				Ext.state.lastTocIndexUpdate = tocIndex ;

				// 2. get current toc
				console.log('Get current toc from active index');
				console.log('Last toc index:', Ext.state.lastTocIndexUpdate);
				// const nextTocIndex = Ext.state.lastTocIndexUpdate + 1;
				// param.;


				const taskCreateToc = param;
				const toc = {
					courseId: param.courseId,
					tocIndex : tocIndex,
					slug: info.videoSlug,
					videoUrl: info.videoUrl,
					captionUrl: info.captionUrl,
					posterUrl: info.posterUrl
				};
				console.log('Updating toc', toc);
				if(info.captionUrl=='none'){
					alert('Capture subtitle failed');
				}
				const taskUpdateToc = await Ext.task.createTask('update_toc', toc);
				if(taskUpdateToc != null){
					if(typeof taskUpdateToc.videoUrl == 'string'){
						Ext.state.currentTocsQueue[tocIndex] = taskUpdateToc;

						if(tocIndex <= Ext.state.currentTocsQueue.length){
							console.log('Go to the next link toc index');
							if(tocIndex < Ext.state.currentTocsQueue.length-1){
								const toc = Ext.state.currentTocsQueue[tocIndex+1];
								const url = toc.origLinkUrl;
								const a = $("a[href='"+url+"']");
								if(a.length>0){
									setTimeout(()=>{
										a[0].click()
										// document.location.href = toc.url
									},6000); 
								}	
							}else{
								alert('Grabber Complete');
								Ext.state.currentTocsQueue = [];
								Ext.state.lastTocIndexUpdate = -1 ;
							}
						}
					}
				}
				console.log(taskUpdateToc);
			break;
		}
	}
};

