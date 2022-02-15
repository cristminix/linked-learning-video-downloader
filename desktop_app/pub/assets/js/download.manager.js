const nocache = ()=>{return btoa(new Date())};
let dm = {
	instance : null,
	init_2(){
		
	}
};
Vue.filter('makeTitle',(slug)=> {
  slug = slug.replace(/(\d+)$/,'')	
  var words = slug.split('-');

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(' ');
});
dm.init = ()=>{
	dm.instance = new Vue({
		el : '#download_manager',
		data:{
			current : {
				sessionId : '<none>',
				courseList: [],
				downloadQueue:[],
				course : {}
			}
		},

		methods:{
			
			updateQueue(course){
				// console.log(course)
				this.current.course = course;
				this.setCourseId(course.id);
			},
			setSessionId(sessionId){
				this.current.sessionId = sessionId;
				axios.get(`http://127.0.0.1:5000/course_by_session/${this.current.sessionId}?cache_=${nocache()}`).then((r)=>{
					this.current.courseList = r.data;
				});
			},
			setCourseId(courseId){
				axios.get(`http://127.0.0.1:5000/tocs_by_course/${courseId}?cache_=${nocache()}`).then((r)=>{
					this.current.downloadQueue = r.data;
				});
			},
			downloadToc(toc){
				this.current.downloadQueue[toc.idx].status = 'downloading';
				this.current.downloadQueue[toc.idx].size = 'calculating';
				this.current.downloadQueue[toc.idx].lastTryDate= moment(new Date()).fromNow();
				axios.get(`http://127.0.0.1:5000/download_by_toc/${toc.id}?cache_=${nocache()}`).then((r)=>{
					// this.current.downloadQueue = r.data;
					console.log(r.data);
				});	
			},
			generatePlaylist(){
				axios.get(`http://127.0.0.1:5000/generate_playlist/${this.current.course.id}?cache_=${nocache()}`).then((r)=>{
					console.log(data);
				});
			}
		},
		mounted(){
			const activeSessionId = '0793fdf069e8fe5b34822f60f5d8c9a7';
			this.setSessionId(activeSessionId);
		}
	});
};

$(document).ready(dm.init());