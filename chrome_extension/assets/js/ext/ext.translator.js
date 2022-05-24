var delay_translator = makeDelay(250);
Ext.translator = {

	afterTranslate(){
		if(document.location.href.match(/src\_\=com\.malinkcorporation\.ext/)){
			console.log('after translate')
			console.log($('c-wiz[jsrenderer=WFss9b]'))
			$('c-wiz[jsrenderer=WFss9b]').unbind("DOMSubtreeModified");
			$("c-wiz[jsrenderer=WFss9b]").bind("DOMSubtreeModified", () => {
				// let jsname = $('span[jsName=W297wb]');
				// console.log(jsname.text())

				delay_translator((e) => {
				  try{
				  		console.log('span[jsName=W297wb]');
						const jsname =$('span[jsName=W297wb]');
						if(jsname.length){
							// console.log();
							// Proxy.post()
							$('c-wiz[jsrenderer=WFss9b]').unbind("DOMSubtreeModified");
							const url = `${Ext.config.getServerUrl()}output_translate`;
							const postData = {
								tocId : getQueryString('tocId_'),
								lineNumber:getQueryString('lineNumber_'),
								result: JSON.stringify(jsname.text())
							};
							Ext.proxy.post(url,postData,(r)=>{
								const rootKey = `translate_tocId.${getQueryString('tocId_')}`;
								let lines = Ext.config.getLS(rootKey,'lines');
								let lastLine = getQueryString('lineNumber_');
								// if(!inspectedLines){

								// }else{
									if(lastLine >= 0){
										if(lastLine >= (lines.length-1)){
											// Ext.config.setLS(rootKey,'inspectedLines',[]);
											// Ext.config.setLS(rootKey,'lastLine',false);
											// Ext.config.setLS(rootKey,'lines',[]);
											//localStorage.removeItem(rootKey);
											//localStorage.clear();
										}
									}
									
								// }
								
								
							},(r)=>{
								// err
							});
						}					
				  }catch(e){
						Ext.log(e);	
				  }
				});

			});
		}
	},
	inspectTextArea(line,lineNumber,tocId){
		const text = encodeURI(line);
		const url = `?hl=id&tab=TT&sl=en&tl=id&text=${text}&op=translate&src_=com.malinkcorporation.ext&tocId_=${tocId}&lineNumber_=${lineNumber}`;
		const rootKey = `translate_tocId.${tocId}`;

		inspectedLines = Ext.config.getLS(rootKey,'inspectedLines');

		if(!inspectedLines){
			inspectedLines = [];
		}
		inspectedLines.push(lineNumber);
		
		Ext.config.setLS(rootKey,'inspectedLines',inspectedLines);
		Ext.config.setLS(rootKey,'lastLine',lineNumber);

		document.location.href = url;
	},
	ignit: (data) => {
		console.log('Ext.translator.init',data);

		const lines = data.lines;
		const tocId = data.tocId;
		const idxPtr = parseInt(data.idxPtr);

		const rootKey = `translate_tocId.${tocId}`;

		let linesLS = Ext.config.getLS(rootKey,'lines');

		if(!linesLS){
			linesLS = lines;
			Ext.config.setLS(rootKey,'lines',lines);
		}
		let inspectedLines = [];
		let inspectedLinesLS = Ext.config.getLS(rootKey,'inspectedLines');
		if(!inspectedLinesLS){
			inspectedLinesLS = inspectedLines;
			Ext.config.setLS(rootKey,'inspectedLines',inspectedLines);
		}
		lineNumber = idxPtr;
		// for(let lineNumber = 0; lineNumber < lines.length; lineNumber++){
			// if(inspectedLinesLS.indexOf(lineNumber) == -1){
				const line = linesLS[lineNumber];
				Ext.translator.inspectTextArea(line,lineNumber,tocId);
				// break;
			// }
			
		// }
	}
};