const nocache = ()=>{return btoa(new Date())};

$(document).ready(()=>{
console.log('hello')	
/*-----------------------------------------------------------------------------------------------------------*/
let app = new Vue({
	el : '#container',
	data: {
		activeSessionId:0,
		activeCourseId:0,
		sessions:[],
		courses:[],
		tocs:[]
	},
	mounted(){
			// const activeSessionId = '22475070334f47693919e41bbcdbbf8d';
			console.log('mounted')
			this.getSessions();
		},
	methods:{
			
		getSessions(){
			axios.get(`http://127.0.0.1:5000//datatables/sessions?draw=100&&start=0&length=1000&cache_=${nocache()}`).then((r)=>{
				this.sessions = r.data;
				console.log(r.data);
			});	
		},
		getCourses(sessionId){
			axios.get(`http://127.0.0.1:5000//course_by_session/${sessionId}?cache_=${nocache()}`).then((r)=>{
				this.courses= r.data;
				console.log(r.data);
			});
		},
		getTocs(courseId){
			axios.get(`http://127.0.0.1:5000//tocs_by_course/${courseId}?cache_=${nocache()}`).then((r)=>{
				this.tocs= r.data;
				console.log(r.data);
			});
		},
		setSessionId(sessionId){
			this.activeSessionId = sessionId;
		},
		setCourseId(courseId){
			this.activeCourseId = courseId;
		}
	}
});
/*-----------------------------------------------------------------------------------------------------------*/
});