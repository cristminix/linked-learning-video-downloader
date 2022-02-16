Ext.config = {
	baseUrl : 'http://127.0.0.1:5000/',
	getWsServerUrl : () => {
		return Ext.config.baseUrl;
	},
	getServerUrl : () => {
		return Ext.config.baseUrl;
	},
	getLS(rootKey,childKey){
		let rootKey_str = localStorage.getItem(rootKey);
		if(rootKey_str == null){
			return false;
		}

		let rootKey_obj = JSON.parse(rootKey_str);
		if(typeof rootKey_obj[childKey] != 'undefined'){
			return rootKey_obj[childKey];
		}
	},
	setLS(rootKey,childKey,val){
		let rootKey_str = localStorage.getItem(rootKey);
		let rootKey_obj = {};
		if(rootKey_str != null){
			rootKey_obj = JSON.parse(rootKey_str);
		}

		rootKey_obj[childKey] = val;
		localStorage.setItem(rootKey,JSON.stringify(rootKey_obj));
	},
};