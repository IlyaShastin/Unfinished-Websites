window.onload = function() {

    var messages = [];
    var host = process.env.IP,
    	port = 1337;
    	
    var socket = io.connect('http://' + host + ':' + port);

    socket.on('message', function (data) {
      console.log( data.message );
    });

}
