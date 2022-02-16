let Ext = {
	main : (historyChanged, url) =>{
		// 1. init socket
		Ext.socket.init();
		// 2. init job
		Ext.job.init(historyChanged, url);
	},
	log(data){
		console.log(data);
	}
};

Ext.translator = {
	afterTranslate(){
		if(document.location.href.match(/src\_\=com\.malinkcorporation\.ext/)){
			console.log('after translate')
			console.log($('c-wiz[jsrenderer]'))
			$('span[jsName=W297wb]').unbind("DOMSubtreeModified");
			$("span[jsName=W297wb]").bind("DOMSubtreeModified", () => {
				let jsname = $('span[jsName=W297wb]');
				console.log(jsname.text())

			});
		}
	},
	inspectTextArea(line,i){
		const text = encodeURI(line);
		const url = `?hl=id&tab=TT&sl=en&tl=id&text=${text}&op=translate&src_=com.malinkcorporation.ext`;
		// history.pushState(url, "Terjemahin Donks", url);
		// const inspectedLines = localStorage.getItem('lastLine');
		// if(inspectedLines){

		// }
		inspectedLines = localStorage.getItem('inspectedLines');

		if(inspectedLines != null){
			inspectedLines = JSON.parse(inspectedLines);
		}else{
			inspectedLines = [];
		}
		inspectedLines.push(i);
		localStorage.setItem('inspectedLines',JSON.stringify(inspectedLines));
		localStorage.setItem('lastLine',i);
		document.location.href = url;
		// const nd = $('textarea');
		// nd.val(line).change();
		// const el = nd[0];
		// el.dispatchEvent(new Event('focus'));
		// el.dispatchEvent(new MouseEvent('click'));

		// el.dispatchEvent(new KeyboardEvent('keypress',{'key':' '}));
		// el.dispatchEvent(new KeyboardEvent('keydown',{'key':' '}));
		// el.dispatchEvent(new KeyboardEvent('keyup',{'key':' '}));
		// el.dispatchEvent(new Event('blur'));

	},
	ignit: (data) => {
		let lines = localStorage.getItem('lines');

		if(lines != null){
			lines = JSON.parse(lines);
		}else{
			lines = data.lines;
		}
		// lines = ;
		localStorage.setItem('lines',JSON.stringify(lines));
		inspectedLines = localStorage.getItem('inspectedLines');
		if(inspectedLines != null){
			inspectedLines = JSON.parse(inspectedLines);
		}else{
			inspectedLines = [];
		}
		for(let i = 0; i < lines.length; i++){
			if(inspectedLines.indexOf(i) == -1){
				const line = lines[i];
				Ext.translator.inspectTextArea(line,i);
				break;
			}
			
		}
	}
};

