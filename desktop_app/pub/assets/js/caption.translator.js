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
			isLoading:false,
			isTranslating:false,
			isSaving:false,
			toc:{title:''},
			captionUrl:'',
			inputBuffer:'',
			outputBuffer:'',
			maxBufferExceed: 4950,
			inputBufferSegments:[],
			outputBufferSegments:[],
			autoTranslateSegments:true,
			autoClickTranslateBtn:false,
			autoSaveOnComplete:true,
			autoPage:true,
			idxPtr: 0
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
				// if(this.bufferExceeded){

				// }
				return this.inputBufferSegments.length;
				// return Math.ceil(this.inputBuffer.length/this.maxBufferExceed);
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
					$(`textarea.outputBufferSegments_${i}`).val('');
				}
				console.log(this.inputBufferSegments);

				if(this.autoClickTranslateBtn){
					console.log(`Performing autoClickTranslateBtn`);
					let self = this;

					setTimeout(()=>{
						self.doTranslate();
					},500);
				}
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
	            let self = this;
				axios({method:'post',url:url,data:payload,headers:headers}).then((r)=>{
					console.log(r);
					if(self.autoPage){
						console.log(`Performing autoPage`);
						self.loadVtt('next');
					}
				});
			},
			loadVtt(p){
				if(p=='prev'){
					console.log(this.toc);
					if(this.toc.idx > 0){
						const prevToc = dm.instance.current.downloadQueue[this.toc.idx-1];
						console.log(prevToc);
						const captionUrl = `http://127.0.0.1:5000/static/${dm.instance.current.course.courseTitle}/${prevToc.slug}.vtt?nocache_=${nocache()}`;
						this.setCaptionUrl( captionUrl, prevToc );
					}
					return;
				}else if(p=='next'){
					console.log(this.toc);
					if(this.toc.idx < dm.instance.current.downloadQueue.length){
						const nextToc = dm.instance.current.downloadQueue[this.toc.idx+1];
						console.log(nextToc);
						const captionUrl = `http://127.0.0.1:5000/static/${dm.instance.current.course.courseTitle}/${nextToc.slug}.vtt?nocache_=${nocache()}`;
						this.setCaptionUrl( captionUrl, nextToc );
					}
					return;
				}
				axios.get(this.captionUrl).then((r)=>{
					this.idxPtr = 0;
					this.inputBuffer = r.data.replace(/(&quot\;)/g,"\"");
					this.extractBufferSegments();
					// console.log(r);
				});
			},
			updateResult(data){
				const bufferExceeded = this.inputBuffer.length > this.maxBufferExceed;
				if(bufferExceeded){
					const bIdx = parseInt(data.lineNumber);
					this.outputBufferSegments[bIdx] = data.result.replace(/(\d)(,)/gm,'$1.').replace(/\:\s*/gm,':').replace(/ \-\> /gm,' --> ').replace(/(\d+)\.$/gm,'$1').replace(/WebVTT\./,'WEBVTT');
					$(`textarea.outputBufferSegments_${bIdx}`).val(this.outputBufferSegments[bIdx]);
					this.outputBuffer = this.outputBufferSegments.join("\n\n");
				}else{
					this.outputBuffer = data.result.replace(/(\d)(,)/gm,'$1.').replace(/\:\s*/gm,':').replace(/ \-\> /gm,' --> ').replace(/(\d+)\.$/gm,'$1').replace(/WebVTT\./,'WEBVTT');
					if(this.autoSaveOnComplete){
						console.log(`Performing auto saving ...`);
						this.saveResult();
					}
				}
				this.isTranslating = false; 
				console.log('translate.done');
				let self = this;
				if(bufferExceeded){
					setTimeout(()=>{
						if(self.autoTranslateSegments){
							
							console.log(`checking outputBufferSegments index count: ${self.bufferSegmentLength}`);
							const nextIdxPtr = parseInt(data.lineNumber)+1;
							if(nextIdxPtr < self.bufferSegmentLength){
								self.idxPtr = nextIdxPtr;
								console.log(`Translating next segment [${nextIdxPtr}]`);
								self.doTranslate();
							}
							if(nextIdxPtr == self.bufferSegmentLength){
								// self.idxPtr = 0;
								if(self.autoSaveOnComplete){
									console.log(`Performing auto saving ...`);
									self.saveResult();
								}
							}
						}
					},500);
					

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
	            this.isTranslating = true;
				axios({method:'post',url:url,data:payload,headers:headers}).then((r)=>{
					console.log(r)
				});
			}
		}
	});

};
$(document).ready(()=>{captionTranslator.init();
	// Translate.google.com checker
const webview = document.querySelector('webview')
webview.addEventListener('dom-ready', () => {
  // webview.openDevTools()
  captionTranslator.instance.isTranslating = false;

})
webview.addEventListener('did-finish-load', () => {
  // webview.openDevTools()
})
webview.addEventListener('did-fail-load', () => {
  // webview.openDevTools()
})
webview.addEventListener('did-start-loading', () => {
  // webview.openDevTools()
  captionTranslator.instance.isTranslating = true;
})

webview.addEventListener('console-message', (e) => {
  console.log('translate.google.com:', e.message)
})
});
