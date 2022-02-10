Ext.session = {
	check : (_callback) => {
		// let url_reactivate = base_url()+'adm/loket_reactivate/'+item_64;
		axios.get(Ext.config.getServerUrl()+'session/'+Ext.manager.getSessionId(),{
			headers:{
				'Access-Control-Allow-Origin' : '*'
			}
		}

			);
	    // Ext.proxy.send('session_check',{sessionId:Ext.manager.getSessionId()},_callback);    

	    //,courseTitle: Ext.manager.getCourseTitle()        
	},
	create : (_callback) => {
	    Ext.proxy.send('session_create',{sessionId:Ext.manager.getSessionId()},_callback);
	}

	//,courseTitle: Ext.manager.getCourseTitle(),courseInfo:Ext.manager.getInfo()
};