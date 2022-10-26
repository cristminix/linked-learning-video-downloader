function contains(selector, text) {
	var elements = document.querySelectorAll(selector);
	return [].filter.call(elements, function(element){
	  return RegExp(text).test(element.textContent);
	});
  }
var delay_translator = makeDelay(250);
var delay_polite = makeDelay(250);
Ext.translator = {

	afterTranslate(){
		if(document.location.href.match(/src\_\=com\.malinkcorporation\.ext/)){
			console.log('after translate');
			// let a = contains('button','star');
			// let b = a[0].parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling;
			// let c = b.firstChild.firstChild.firstChild.firstChild.firstChild.textContent;
			// console.log(c)
			$('div[aria-live=polite]').unbind("DOMSubtreeModified");
			$("div[aria-live=polite]").bind("DOMSubtreeModified", (a) => {
				 
					if($(a.target).attr('data-language-code')=="id"){
						
						// $('div[aria-live=polite]').unbind("DOMSubtreeModified");
						delay_translator((e) => {
							// console.log(a.target)
							// console.log($(a.target).attr('data-text'));
							const url = `${Ext.config.getServerUrl()}output_translate`;
							const postData = {
								tocId : getQueryString('tocId_'),
								lineNumber:getQueryString('lineNumber_'),
								result: JSON.stringify($(a.target).attr('data-text'))
							};
							Ext.proxy.post(url,postData,(r)=>{
								const rootKey = `translate_tocId.${getQueryString('tocId_')}`;
								let lines = Ext.config.getLS(rootKey,'lines');
								let lastLine = getQueryString('lineNumber_');
								
								if(lastLine >= 0){
									if(lastLine >= (lines.length-1)){
									}
								}
							},(r)=>{
								// err
							});
						});

						return;
					} 
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