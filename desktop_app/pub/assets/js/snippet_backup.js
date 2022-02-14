namespace = 'http://127.0.0.1:5000/test';
    var socket = io(namespace);

    socket.on('connect', function() {
        socket.emit('my_event', {data: 'connected to the SocketServer...'});
    });

    socket.on('my_response', function(msg, cb) {
        $('#log').append('<br>' + $('<div/>').text('logs #' + msg.count + ': ' + msg.data).html());
        (async () => {
    const response = await window.api.doAction(msg);
    console.log(response); // we now have the response from the main thread without exposing
                           // ipcRenderer, leaving the app less vulnerable to attack    
    })();
        if (cb)
            cb();
    });
    $('form#emit').submit(function(event) {
        socket.emit('my_event', {data: $('#emit_data').val()});
        return false;
    });
    $('form#broadcast').submit(function(event) {
        socket.emit('my_broadcast_event', {data: $('#broadcast_data').val()});
        return false;
    });
    $('form#disconnect').submit(function(event) {
        socket.emit('disconnect_request');
        return false;
    });