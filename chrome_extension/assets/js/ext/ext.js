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

