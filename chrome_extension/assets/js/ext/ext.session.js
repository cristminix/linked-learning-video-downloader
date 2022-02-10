Ext.session = {
	check : (_callback) => {
	    Ext.proxy.send('session_check',{sessionId:Ext.manager.getSessionId(),courseTitle: Ext.manager.getCourseTitle()},_callback);            
	},
	create : (_callback) => {
	    Ext.proxy.send('session_create',{sessionId:Ext.manager.getSessionId(),courseTitle: Ext.manager.getCourseTitle(),courseInfo:Ext.manager.getInfo()},_callback);
	}
};