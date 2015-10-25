var http = require('http'),
    fs = require('fs');

var lastMessage = {};

var app = http.createServer(function(request, response) {
	fs.readFile("../php/pages/home/home.php", 'utf-8', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
    console.log("go?");
}).listen(process.env.PORT, process.env.IP);

var io = require('socket.io').listen(app);
var connectCounter = 0;

io.sockets.on('connection', function(socket) {
	connectCounter++;
    socket.on('message_to_server', function(data) {
    	var msg = data["message"];
    	var decodedData = JSON.parse(msg);

    	if( !(decodedData["steamid64"] in lastMessage) || (lastMessage[decodedData["steamid64"]] != decodedData["message"]) ) {
        	io.sockets.emit("message_to_client",{ message: msg });
        }

   		lastMessage[decodedData["steamid64"]] = decodedData["message"];
    });
});

io.sockets.on('disconnect', function() {
	connectCounter--;
});
