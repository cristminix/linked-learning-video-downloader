let captionTranslator={
	instance : null,

};
const chunkStr = (str, n, acc) => {     
    if (str.length === 0) {
        return acc
    } else {
        acc.push(str.substring(0, n));
        return chunkStr(str.substring(n), n, acc);
    }
};
captionTranslator.init = () =>{
	captionTranslator.instance = new Vue({
		el : '#translator',
		data:{
			toc:{title:''},
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
				this.outputBuffer ='';
				this.inputBufferSegments = [];
				this.outputBufferSegments = [];
			 
				
				const bufferExceeded = this.inputBuffer.length > this.maxBufferExceed;
				if(bufferExceeded){
					let tmpBufferSegments = [];
					let tmpBuffer = '';
					let bufferedNl = this.inputBuffer.replace(/\r\n/g,"\n").split("\n");
					for(let l = 0;l<bufferedNl.length;l++){
						const line = bufferedNl[l].replace(/^\s+|\s+$/gm,'');

						if(line != ''){
							tmpBuffer += line + "\n";
						}
						if(line == ''){
							tmpBuffer += "\n";
							tmpBufferSegments.push(tmpBuffer);
							tmpBuffer='';
						}
					}
					tmpBuffer = '';
					let tmpBufferSegments2=[];
					for(let t=0;t<tmpBufferSegments.length;t++){
						if((tmpBuffer.length + tmpBufferSegments[t].length) <= this.maxBufferExceed){
							tmpBuffer += tmpBufferSegments[t];
						}else{
							tmpBufferSegments2.push(tmpBuffer);
							tmpBuffer = '';
							tmpBuffer += tmpBufferSegments[t];

						}
					}
					tmpBufferSegments2.push(tmpBuffer);
					this.inputBufferSegments = tmpBufferSegments2;
					// console.log(tmpBufferSegments2s);
					// chunkStr(this.inputBuffer, this.maxBufferExceed, this.inputBufferSegments);
				}
				for(let i= 0; i < this.inputBufferSegments.length; i++ ){
					this.outputBufferSegments[i] = '';
				}
				console.log(this.inputBufferSegments)
			},
			setCaptionUrl(url,toc){
				this.toc = toc;
				this.captionUrl = url;
				this.loadVtt();
			},
			saveResult(){
				let lines = this.outputBuffer;
				const bufferExceeded = this.inputBuffer.length > this.maxBufferExceed;
				// if(bufferExceeded){
				// 	lines = this.inputBufferSegments.join('');
				// }
				let payload = new FormData();
				payload.append('lines',JSON.stringify(lines));
				payload.append('tocId',JSON.stringify(this.toc.id));

				const url = `http://127.0.0.1:5000/do_translate_save_result`;
				const headers =  {
	                'Accept': 'application/json',
	                'Content-Type': 'multipart/form-data',
	                'Access-Control-Allow-Origin' : '*'
	            };
				axios({method:'post',url:url,data:payload,headers:headers}).then((r)=>{
					console.log(r)
				});
			},
			loadVtt(){
				axios.get(this.captionUrl).then((r)=>{
					this.inputBuffer = r.data.replace(/(&quot\;)/g,"\"");
					this.extractBufferSegments();
					// console.log(r);
				});
			},
			updateResult(data){
				const bufferExceeded = this.inputBuffer.length > this.maxBufferExceed;
				if(bufferExceeded){
					const bIdx = parseInt(data.lineNumber);
					this.outputBufferSegments[bIdx] = data.result.replace(/(\d)(,)/g,'$1.');
					$(`textarea.outputBufferSegments_${bIdx}`).val(data.result);
					this.outputBuffer = this.outputBufferSegments.join("\n\n");
				}else{
					this.outputBuffer = data.result.replace(/(\d)(,)/g,'$1.');
				}
				 
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
				payload.append('tocId',JSON.stringify(this.toc.id));

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
