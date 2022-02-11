Ext.session = {
	check : (_callback) => {

		const url = Ext.config.getServerUrl()+'session/'+Ext.manager.getSessionId();
	    Ext.proxy.get(url,(session)=>{
	    	if(session != null){
	    		_callback(session)
	    	}else{
	    		_callback(false)
	    	}
	    },()=>{

	    });    

	},
	create : (_callback) => {
	    const url = Ext.config.getServerUrl()+'session_create';
	    Ext.proxy.post(url,{sessionId:Ext.manager.getSessionId()},_callback); 
	}

};