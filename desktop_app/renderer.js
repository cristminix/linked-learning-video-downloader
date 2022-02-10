/**
 * Sending messages to Main
 * `data` can be a boolean, number, string, object, or array
 */
api.send( 'custom-endpoint', {'data':'This is from renderer.js'} )

/**
 * Receiving messages from Main
 */
api.handle( 'custom-endpoint', ( event, data ) => function( event, data ) {
    console.log( data )
    socket.emit('my_broadcast_event', {data: data});
}, event);

