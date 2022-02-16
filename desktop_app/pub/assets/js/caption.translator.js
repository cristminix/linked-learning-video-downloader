let captionTranslator={
	instance : null,

};
captionTranslator.init = () =>{
	captionTranslator.instance = new Vue({
		el : '#translator',
		data:{
			captionUrl:'',
			inputBuffer:'',
			outputBuffer:'',
			maxBufferExceed: 4950,
			inputBufferSegments:[],
			outputBufferSegments:[],
		},
		computed:{
			bufferLength(){
				return this.inputBuffer.length;
			},
			bufferExceed(){
				return this.inputBuffer.length > this.maxBufferExceed;
			},
			bufferExceedLength(){
				return this.inputBuffer.length - this.maxBufferExceed;
			},
			bufferSegmentLength(){
				return Math.floor(this.inputBuffer.length/this.maxBufferExceed);
			} 
		},
		methods:{
			extractBufferSegments(){
				this.inputBufferSegments = [];
				this.outputBufferSegments = [];
				const bufferSegmentLength = Math.floor(this.inputBuffer.length/this.maxBufferExceed);
				let pStart=0,pEnd=0;
				for(let i= 0; i < bufferSegmentLength; i++ ){
					pStart += (i==0?0:this.maxBufferExceed);
					pEnd += (i==0?this.maxBufferExceed:pStart);
					if(pEnd > this.inputBuffer.length){
						pEnd =  this.inputBuffer.length;
					}
					this.inputBufferSegments[i] = this.inputBuffer.substr(pStart,pEnd);
					this.outputBufferSegments[i] = '';
				}
				console.log(this.inputBufferSegments)
			},
			setCaptionUrl(url){
				this.captionUrl = url;
				this.loadVtt();
			},
			loadVtt(){
				axios.get(this.captionUrl).then((r)=>{
					this.inputBuffer = r.data;
					this.extractBufferSegments();
					// console.log(r);
				});
			},
			doTranslate(){
				let lines = [];
				const bufferExceeded = this.inputBuffer.length > this.maxBufferExceed;
				if(bufferExceeded){
					lines = this.inputBufferSegments;
				}else{
					lines.push(this.inputBuffer);
				}
				let payload = new FormData();
				payload.append('lines',JSON.stringify(lines));
				
				const url = `http://127.0.0.1:5000/do_translate`;
				const headers =  {
	                'Accept': 'application/json',
	                'Content-Type': 'multipart/form-data',
	                'Access-Control-Allow-Origin' : '*'
	            };
				axios({method:'post',url:url,data:payload,headers:headers}).then((r)=>{
					console.log(r)
				});
			}
		}
	});

};
$(document).ready(captionTranslator.init());
