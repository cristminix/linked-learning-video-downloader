
Ext.socket = {
	connection : 0,
    autoReconnectInterval : 5*1000,
    isConnected : false, 
    lastCallbackFn : null,

	init : (callbackFn) => {
		if(Ext.socket.isConnected){
			Ext.log('Ext.socket.init : already inited.');
			return;
		}
		Ext.socket.lastCallbackFn = callbackFn;
		Ext.socket.connection = io(Ext.config.getWsServerUrl(),{});
	    Ext.socket.connection.on('connect', (socket)=>{
	    	Ext.socket.onConnect(socket);
	    	Ext.socket.isConnected = true;
	    	if(typeof callbackFn == 'function'){
	    		callbackFn();
	    	}
	    });
	    Ext.socket.connection.on('do_translate', function(data, cb) {
            if(document.location.host == 'translate.google.com'){
            	Ext.translator.ignit(data);
            }

        });
	    Ext.socket.connection.on('disconnect', (socket)=>{Ext.socket.onDisconnect(socket)});
    	Ext.socket.connection.on('response', (msg,callbackFn)=>{Ext.socket.onResponse(msg,callbackFn)});
	},

	reconnect : () => {
		Ext.log('Ext.socket: Mencoba lagi dalam '+(Ext.socket.autoReconnectInterval/1000)+' detik' );
        setTimeout(function(){
            Ext.log("Ext.socket: Menyambung kembali...");
            Ext.socket.init(Ext.socket.lastCallbackFn);
        },Ext.socket.autoReconnectInterval);
	},

	onDisconnect : (socket) => {
		Ext.socket.isConnected = true;
		Ext.log(`io.socket-client disconnected .`);
		Ext.socket.reconnect();
	},

	onConnect : (socket) => {
		Ext.log(`io.socket-client connected .`);
	},

	onResponse : (msg,callbackFn) => {
		Ext.log(msg,callbackFn);
	},
	send : (_action, _data, _callback) =>{
        const payload = Object.assign({
            action : _action,
            callback : typeof _callback == 'string' ? _callback : 'noop'
        },_data);
        // Ext.log(payload);
        // Ws.conn.send(JSON.stringify(payload));
        Ext.socket.connection.emit(_action, payload);
    },

};