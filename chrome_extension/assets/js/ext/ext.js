try{
	Vue.config.devtools = false;
	Vue.config.productionTip = false;
}catch{}
let Ext = {
	main : (historyChanged, url) =>{
		// 1. init socket
		Ext.socket.init();
		Ext.ui.constructUI();
		// 2. init job
		Ext.job.init(historyChanged, url);
	},
	log(data){
		// console.log(data);
	}
};


