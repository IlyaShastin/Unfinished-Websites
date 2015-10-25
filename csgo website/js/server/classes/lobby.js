
var mysql = require('mysql');

function Lobby( host ) {
	this.host = host;
	this.id = new Date().valueOf();
	this.players = [];
	this.mapPool = [ 
		"de_dust2",
		"de_cache",
		"de_cobble",
		"de_inferno",
		"de_overpass",
		"de_season",
		"de_mirage",
		"de_train",
		"de_nuke"
	];
	this.bestOf = 1;
}

Lobby.prototype = {

	getId: function() {
		return this.id;
	},

	getHost: function() {
		return this.host;
	},

	isFull: function() {
		return this.players.length >= 9;
	},

	getPlayers: function() {
		return this.players;
	},

	addPlayer: function( ply ) {
		this.players.push( ply );
	},

	removePlayer: function( ply ) {
		this.players.splice( this.players.indexOf( ply ), 1 );
	},

	hasPlayer: function( ply ) {
		for( i in this.players ) {
			if( ply == this.players[i] ) return true;
		}
		return ply == this.host;
	},

	getBestOf: function() {
		return this.bestOf;
	},

	setBestOf: function( bo ) {
		this.bestOf = bo;
	},

	addMapToPool: function( map ) {
		if( this.mapPool.indexOf( map ) == -1 )
			this.mapPool.push( map );
	},

	removeMapToPool: function( map ) {
		this.mapPool.splice( this.mapPool.indexOf( map ), 1 );
	},

	getMapPool: function() {
		return this.mapPool;
	},

	kickPlayers: function( io ) {
		if( io != null ) {
			for( i in this.players ) {
				var ply = this.players[i];
				io.to( ply.getSocketId() ).emit('lobby:ended', { msg: "Lobby host has left the lobby!" });
			}
			io.to( this.host.getSocketId() ).emit('lobby:ended', { msg: "Lobby host has left the lobby!" });
		}
	},

	broadcastUpdate: function( io ) {
		var lobby = this;
		if( io != null ) {
			for( i in this.players ) {
				var ply = this.players[i];
				io.to( ply.getSocketId() ).emit('lobby:update', { lobby: lobby });
			}
			io.to( this.host.getSocketId() ).emit('lobby:update', { lobby: lobby });
		}
	},

	broadcastChatMessage: function( io, name, msg ) {
		if( io != null ) {
			for( i in this.players ) {
				var ply = this.players[i];
				io.to( ply.getSocketId() ).emit('lobby:receiveChat', { 
					name: name,
					msg: msg 
				});
			}
			
			io.to( this.host.getSocketId() ).emit('lobby:receiveChat', { 
				name: name,
				msg: msg 
			});
		}
	}

}

module.exports = Lobby;