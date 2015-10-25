var http = require('http'),
    fs = require('fs'),
    steam = require('steam-web'),
    mysql = require('mysql'),
   	Player = require('./classes/player.js'),
   	Lobby = require('./classes/lobby.js');

var host = 'mycho.de',
	user = 'root',
	password = 'letmein69';

var pool = mysql.createPool({
	host     : host,
	user     : user,
	password : password
});

var s = new steam({
	apiKey: '11E0EBF493157B550E17F323DE133855',
	format: 'json'
});

var app = http.createServer( function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write("gg");
    response.end();
}).listen(1337);

var io = require('socket.io').listen(app);

var users = [];
var lobbies = [];

function getUserBySteamId( id ) {
	for(i = 0; i < users.length; ++i) {
		var user = users[i];
		if ( user.getSteamId() == id )
			return user;
	}
}

function getUserById( id ) {
	for(i = 0; i < users.length; ++i) {
		var user = users[i];
		if ( user.getSocketId() == id )
			return user;
	}
}

function getLobbyById( id ) {
	for(i = 0; i < lobbies.length; ++i) {
		var lobby = lobbies[i];
		if ( lobby.getId() == id )
			return lobby;
	}
}

function getLobbyByHost( host ) {
	for(i = 0; i < lobbies.length; ++i) {
		var lobby = lobbies[i];
		if ( lobby.getHost() == host )
			return lobby;
	}
}

function sendformattedFriendsList( friendList, socket ) {
	var formattedList = [];
	var steamIds = [];

	for( var i in friendList.friendslist.friends ) {
		var steamId = friendList.friendslist.friends[i].steamid;
		var isConnectedUser = getUserBySteamId( steamId );

		if ( isConnectedUser != null ) {
			formattedList.push( isConnectedUser );
		} else {
			var ply = new Player( 0, steamId );
			ply.requestSteamProfileInfo( s );
			ply.requestDatabaseInfo( pool );
			formattedList.push( ply );
		}
	}

	socket.emit('sendFriendsList', { friends: formattedList });
}

io.sockets.on('connection', function(socket) {

	socket.on('connectId', function(data) {
		var steamId = data['steamId'];

		if( getUserBySteamId( steamId ) == null ) {
			var user = new Player( socket.id, steamId );
			user.requestSteamProfileInfo( s );
			user.requestDatabaseInfo( pool );
			users.push( user );
		}
	});

	socket.on('disconnect', function() { 
		var user = getUserById( socket.id );
		var lobby = getLobbyByHost(user);

		if( user != null ) {
			// Remove the user and the lobby he made, if one is there.
			if(lobby){
				lobby.kickPlayers( io );
				lobbies.splice(lobbies.indexOf(lobby), 1);
			} 

			// If the user is in a lobby remove them from it.
			if(user.inLobby()) {
				var lobby = getLobbyById( user.getLobby() );
				if(lobby) {
					lobby.removePlayer( user );
					lobby.broadcastUpdate( io );
				}
			}

			users.splice(users.indexOf(user), 1);
		}		
	});

	socket.on('getFriendsList', function(data) {
		var steamId = data['steamId'];
		s.getFriendList({
			steamid: steamId,
			relationship: 'friend',
			callback: function( err, data ) {
				sendformattedFriendsList( data, socket );
			},
		});
	});

	socket.on('lobby:create', function(data) {
		var host = getUserBySteamId( data['steamId'] );

		if( host != null ) {
			var lobby = new Lobby( host );
			lobbies.push( lobby );

			io.to(host.getSocketId()).emit('lobby:update', { lobby: lobby });
		}
	});

	socket.on('lobby:join', function(data) {
		var ply = getUserBySteamId( data['steamId'] );
		var lobby = getLobbyById( data['lobbyId'] );
		
		if( ply != null ) {
			if( lobby == null ) {
				// Invalid lobby id
				io.to(ply.getSocketId()).emit('lobby:error', { error: "Lobby with id " + data['lobbyId'] + " was not found!" });
			} else {
				if( lobby.isFull() ) {
					// Lobby is full
					io.to(ply.getSocketId()).emit('lobby:error', { error: "Attempted to join a full lobby." });
				} else if( lobby.hasPlayer( ply ) ) {
					// Player is already in the lobby
					io.to(ply.getSocketId()).emit('lobby:error', { error: "Attempted to join a lobby you are already in." });
				} else {
					ply.joinLobby( data['lobbyId'] );
					lobby.addPlayer( ply );
					lobby.broadcastUpdate( io );
				}
			}
		}
	});

	socket.on('lobby:sendChat', function(data) {
		var ply = getUserBySteamId( data['steamId'] );
		var lobby = getLobbyById( data['lobbyId'] );
		var msg = data['message'];

		if( ply != null && lobby != null ) {
			lobby.broadcastChatMessage( io, ply.getName(), msg );
		}
	});
});