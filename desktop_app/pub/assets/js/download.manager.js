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
const formatBytes = (bytes, decimals = 2)=> {
		bytes = parseFloat(bytes);
		if(isNaN(bytes)){
			bytes = 0;
			return 'n/a';
		}
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
Vue.filter('fromNow',(data)=> {const str = moment(data).fromNow();return str.match(/Invalid/) ? 'n/a':str;});
Vue.filter('formatBytes',formatBytes);
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
			updateIndividualDownloadQueueInfo(){

			},
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
			downloadToc(toc,what){
				const key = what == 'caption' ? 'dlCaption': 'dlVideo';
				this.current.downloadQueue[toc.idx][`${key}Status`] = 'downloading';
				this.current.downloadQueue[toc.idx][`${key}Size`] = 'calculating';
				// this.current.downloadQueue[toc.idx][`${key}Retry`] = '0';
				this.current.downloadQueue[toc.idx][`${key}LastTryDate`]= moment(new Date()).fromNow();

				axios.get(`http://127.0.0.1:5000/download_by_toc/${toc.id}/${what}?cache_=${nocache()}`).then((r)=>{
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