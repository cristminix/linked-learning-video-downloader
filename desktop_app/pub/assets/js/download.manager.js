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
		 watch: {
	    current: {
	      handler: function (val, oldVal) {
	        // Return the object that changed
	        // var changed = val.filter( function( p, idx ) {
	        //   return Object.keys(p).some( function( prop ) {
	        //     return p[prop] !== oldVal[idx][prop];
	        //   })
	        // })
	        // Log it
	        console.log('changed')
	      },
	      deep: true
	    }
	  },
		methods:{
			translateCaption(d){
			
				const captionUrl = `http://127.0.0.1:5000/static/${this.current.course.courseTitle}/${d.slug}.vtt?nocache_=${nocache()}`;
				captionTranslator.instance.setCaptionUrl( captionUrl, d );
				$(`a[href*=translator]`).click();
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
				let activeTocs = this.current.downloadQueue;
				let activeToc = this.current.downloadQueue[toc.idx];
				activeToc[`${key}Complete`] = 1;
				activeToc[`${key}Size`] = 'calculating';
				activeToc[`${key}Retry`] = '0';
				activeToc[`${key}LastTryDate`]= moment(new Date()).fromNow();
				activeTocs[toc.idx] = activeToc;
				this.current.downloadQueue  = activeTocs;

				axios.get(`http://127.0.0.1:5000/download_by_toc/${toc.id}/${what}?cache_=${nocache()}`).then((r)=>{
					// this.current.downloadQueue = r.data;
					console.log(r.data);
				});	
			},
			generatePlaylist(){
				axios.get(`http://127.0.0.1:5000/generate_playlist/${this.current.course.id}?cache_=${nocache()}`).then((r)=>{
					console.log(data);
				});
			},
			playToc(d){
				const videoUrl = `http://127.0.0.1:5000/static/${this.current.course.courseTitle}/${d.slug}.mp4?nocache_=${nocache()}`;
				const captionUrl = `http://127.0.0.1:5000/static/${this.current.course.courseTitle}/${d.slug}.vtt?nocache_=${nocache()}`;
				videoPlayer.instance.setData(videoUrl,captionUrl,d.posterUrl);
				$(`a[href*=player]`).click();
			}
		},
		mounted(){
			axios.get(`http://127.0.0.1:5000/get_active_session?cache_=${nocache()}`).then((r)=>{
				console.log(r);
				const activeSessionId = r.data.sessionId;
				this.setSessionId(activeSessionId);
			});
			
		}
	});
};

$(document).ready(dm.init());