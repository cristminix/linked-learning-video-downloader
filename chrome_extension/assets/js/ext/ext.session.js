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
	create :  (_callback) => {
	    const url = Ext.config.getServerUrl()+'session_create';
	    Ext.proxy.post(url,{sessionId:Ext.manager.getSessionId()},_callback); 
	},

	/****
	 * For async await return
	 * */

	 getSession : async () => {
	 	try {
	 		const url = `${Ext.config.getServerUrl()}/session/${Ext.manager.getSessionId()}`;
	 		let res = await Ext.proxy.create(url,'get');		
	        return res.data;
	    }
	    catch (err) {
	        return false;
	    }
	 },

	 createSession : async () => {
	 	try {
	 		const url = `${Ext.config.getServerUrl()}session_create`;
	 		let res = await Ext.proxy.create(url,'post',{sessionId:Ext.manager.getSessionId()});		
	        return res.data;
	    }
	    catch (err) {
	        return false;
	    }
	 }

};