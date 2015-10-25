
var http = require('http'),
    fs = require('fs');

var dgram = require('dgram'),
    server = dgram.createSocket('udp4')
    BigNumber = require('bignumber.js');

var messages = [],
	users = [];

var serverMessages = {};
 
var app = http.createServer( function (request, response) {
	console.log("Chat server started");
    fs.readFile("../../php/pages/home/home.php", 'utf-8', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}).listen(1337);

var io = require('socket.io').listen(app);

server.on('message', function (message, rinfo) {
	var msg = message.toString('ascii').slice(31,-1);

	if( msg.match(/.+<\d><(STEAM_[0-5]:[01]:\d+|\w+)><\w+>" say ".+"/gi) ) {
		var split = msg.split(/><|<|>/);

		var date = Date.now();
		var server = rinfo['address'];
		var steamID = split[2];
		var steamID64 = 0;

		if (steamID.indexOf("STEAM_") != -1) {
			var s32 = steamID.split(":");
			var s64base = BigNumber('76561197960265728');
			var steamID64 = s64base.plus(s32[2]*2).plus(s32[1]).toPrecision(17);
		} 

		var name = split[0];
		var text = split[4].replace( /(^" say "|"[\s\S]$)/gi, "" );

		var m = {
			date: date,
			server: server,
			steamID: steamID,
			steamID64: steamID64,
			name: name,
			text: text
		}


		// add chat log via mysql
		console.log( m );
		io.sockets.emit("message_to_client", m);
	}
});

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening ' + address.address + ':' + address.port);
});

server.bind(8006); 

function getUserBySteamID( id ) {
	for(i = 0; i < users.length; ++i) {
		var user = users[i];
		if ( user['steamID'] == id ) {
			return user;
		}
	}
}

function getUserByID( id ) {
	for(i = 0; i < users.length; ++i) {
		var user = users[i];
		if ( user['id'] == id ) {
			return user;
		}
	}
}

function saveMessage( msg ) {
	if( messages.length > 20 ) {
		messages.splice(0, 1);
	}

	messages.push( msg );
}

function checkForUpdatedName( steamID, name ) {
	for(i = 0; i < users.length; ++i) {
		var user = users[i];
		if ( user['steamID'] == steamID ) {
			user['name'] = name;
			io.sockets.emit("get_connected_clients", {
				connections: users
			});
		}
	}
}
 
io.sockets.on('connection', function(socket) {

	socket.emit("get_connected_clients", {
		connections: users
	});

	setTimeout( function() {
		socket.emit('send_message_history', {
			messages: messages
		}); 
	}, 1000 );
	

	socket.on('connect_to_server', function(data) {
		var name = data['name'];
		var steamID = data['steamID'];
		var user = getUserBySteamID( steamID );

		checkForUpdatedName( steamID, name );

		if ( user == null ) {
			users.push( {  
				id: socket.id,
				name: name,
				steamID: steamID
			});

			io.sockets.emit("get_connected_clients", {
				connections: users
			});
		}
	});

    socket.on('message_to_server', function(data) {
    	var msg = {
    		message: data['message'],
	    	date: data['date'],
	    	avatar: data['avatar'],
	    	name: data['name'],
	    	steamID: data['steamID']
    	}

    	saveMessage( msg );
        io.sockets.emit("message_to_client", msg);
    });

    socket.on('disconnect', function() { 
    	var user = getUserByID( socket.id );
    	if ( user != null ) {
    		var index = users.indexOf(user);
			users.splice(index, 1);

    		io.sockets.emit("get_connected_clients", {
				connections: users
			});
    	}
	});
});
