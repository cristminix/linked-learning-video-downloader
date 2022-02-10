Ext.socket = {
	connection : 0,
    autoReconnectInterval : 5*1000,
    isConnected : false, 
    lastCallbackFn : null,

	init : (callbackFn) => {
		Ext.socket.lastCallbackFn = callbackFn;
		Ext.socket.connection = io(Ext.config.getWsServerUrl(),{});
	    Ext.socket.connection.on('connect', (socket)=>{
	    	Ext.socket.onConnect(socket);
	    	Ext.socket.isConnected = true;
	    	if(typeof callbackFn == 'function'){
	    		callbackFn();
	    	}
	    });
	    Ext.socket.connection.on('my_response', function(msg, cb) {
            console.log(msg, cb)
        });
	    Ext.socket.connection.on('disconnect', (socket)=>{Ext.socket.onDisconnect(socket)});
    	Ext.socket.connection.on('response', (msg,callbackFn)=>{Ext.socket.onResponse(msg,callbackFn)});
	},

	reconnect : () => {
		console.log('Ext.socket: Mencoba lagi dalam '+(Ext.socket.autoReconnectInterval/1000)+' detik' );
        setTimeout(function(){
            console.log("Ext.socket: Menyambung kembali...");
            Ext.socket.init(Ext.socket.lastCallbackFn);
        },Ext.socket.autoReconnectInterval);
	},

	onDisconnect : (socket) => {
		Ext.socket.isConnected = true;
		console.log(`io.socket-client disconnected .`);
		Ext.socket.reconnect();
	},

	onConnect : (socket) => {
		console.log(`io.socket-client connected .`);
	},

	onResponse : (msg,callbackFn) => {
		console.log(msg,callbackFn);
	}

};