
function Player( socketId, steamId ) {
	this.socketId = socketId;
	this.steamId = steamId;
	this.registered = false;
	this.status = "";
}

Player.stateToString = [
	"Offline",
	"Online",
	"Busy",
	"Away",
	"Snooze",
	"Looking to Trade",
	"Looking to Play"
];

Player.prototype = {

	getSteamId: function() {
		return this.steamId;
	},

	getSocketId: function() {
		return this.socketId;
	},

	isRegistered: function() {
		return this.registered;
	},

	getName: function() {
		return this.name;
	},

	getAvatar: function() {
		return this.avatar;
	},

	joinLobby: function( id ) {
		this.lobby = id;
	},

	inLobby: function() {
		return this.lobby != null;
	},

	getLobby: function() {
		return this.lobby;
	},

	setStatus: function( str ) {
		this.status = str;
	},

	requestSteamProfileInfo: function( s ) {
		var ply = this;
		s.getPlayerSummaries({
			steamids: ply.steamId,
			callback: function(err, data) {
				if (data == null) return;

				ply.name = data.response.players[0].personaname;
				ply.avatar = data.response.players[0].avatarfull;
				ply.state = data.response.players[0].personastate;
				ply.strState = Player.stateToString[ply.state];

				if (data.response.players[0].gameid != null) {
					if (data.response.players[0].gameid == 730)
						ply.setStatus( "In Game Counter-Strike: Global Offensive." );
					else
						ply.setStatus( "Playing Other Game." );
				} else {
					ply.setStatus( ply.strState );
				}

			}
		});
	},

	requestDatabaseInfo: function( pool ) {
		var ply = this;
		pool.getConnection(function(err, connection) {
			connection.changeUser( {database: 'csgo_sync_main'}, function(err) {
				if (err) throw err;

				connection.query( 'SELECT COUNT(STEAMID) FROM Users WHERE STEAMID = ?', [ply.steamId], function(err, rows) {
		    		if (err) throw err;
		    		if ( rows[0].length > 0 ) ply.registered = true;

			    	connection.release();
			  	});
			});
		});
	}

}

module.exports = Player;