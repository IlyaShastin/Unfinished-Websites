var Friends = React.createClass({
    getInitialState: function() {
        return {
            players: [],
            playerElements: []
        };
    },

	getDefaultProps: function() {
	    return {
            socket: null,
            localUser: {}
	    };
	},

    componentDidMount: function(){
        this.props.socket.emit('getFriendsList', { steamId: this.props.localUser.steamid });
        this.props.socket.on('sendFriendsList', this._updateList);

        var fr = this;
        setInterval(function() {
            fr.props.socket.emit('getFriendsList', { steamId: fr.props.localUser.steamid });
        }, 30000);
    },

    _updateList: function( data ) {
        var friends = data['friends'];
        friends.sort( function( a, b ) {
            return a.hasOwnProperty( 'gameinfo' ) ? -1 : 1;
        });

        console.log(friends);

        this.replaceState( { 
            players: friends,
            playerElements: []
        } );
    },

    _getProperFriendColor: function( ply ) {
        var col = "blue";
        if( ply.csgo ) col = "green";
        //if( !ply.registered ) col = "red";

        return col;
    },

    _friends: function() {
        for( var i in this.state.players ) {
            this.state.playerElements.push(
                <div id = "friend" key = {i} >
                    <Avatar user={this.state.players[i].avatar} wide = "48px" avClass = {this._getProperFriendColor(this.state.players[i])} ></Avatar>
                    <div id = "userInfo">
                        <h1 id = "name" className = {this._getProperFriendColor(this.state.players[i])} >{this.state.players[i].name}</h1>
                        <h1 id = "status" className = {this._getProperFriendColor(this.state.players[i])} >{this.state.players[i].gameinfo || "Online" }</h1>
                    </div>
                    
                </div>
            );
        }
    },

    render: function() {
    	this._friends();

        return(
        	<div id = "Friends">
        		<h1 id = "heading">FRIENDS</h1>
        		<div id = "friendlist">
					{this.state.playerElements}
        		</div>
	        </div>
        );
    }

});

// <Avatar user={this.props.players.avatar} ></Avatar>
// 