Ext.config = {
	baseUrl : 'http://127.0.0.1:5000/',
	getWsServerUrl : () => {
		return Ext.config.baseUrl;
	},
	getServerUrl : () => {
		return Ext.config.baseUrl;
	}
};