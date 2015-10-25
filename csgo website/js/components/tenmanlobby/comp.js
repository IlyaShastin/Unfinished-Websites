var TenManLobby = React.createClass({
	getInitialState: function() {
        return {
            players: [],
            playerElements: [],
            hostUser: {},
            id: 0,
            mapPool: [ 
				"de_dust2",
				"de_cache",
				"de_cobble",
				"de_inferno",
				"de_overpass",
				"de_season",
				"de_mirage",
				"de_train",
				"de_nuke"
			]
        };
    },

	componentDidMount: function() {
        this.props.socket.on('lobby:update', this._update);
        this.props.socket.on('lobby:error', this._error);
        this.props.socket.on('lobby:ended', this._ended);
       	this.props.socket.emit('lobby:create', { steamId: this.props.localUser.steamid });
    },

    _ended: function( data ){
    	console.log( data['msg'] );
    },

    _error: function( data ) {
    	console.log( data['error'] );
    },

    _update: function( data ) {
    	var lobby = data['lobby'];
    	console.log( lobby );

    	this.replaceState( { 
    		players: lobby.players,
    		playerElements: [],
    		hostUser: lobby.host,
    		id: lobby.id,
    		mapPool: lobby.mapPool
    	} );

    	this._players();
    },

    _canKick: function() {
    	return this.props.localUser.steamid == this.state.hostUser.steamId;
    },

    _players: function() {
    	for( var i = 0; i < 9; i++ ) {
    		if( this.state.players[i] != null ) {
    			this.state.playerElements.push( <div className = "player" key={i} >
    												<Avatar user={this.state.players[i].avatar} wide = "50%" ></Avatar>
    												<a href = "#" id = "kick" steamId={this.state.players[i].steamId} className={this._canKick ? 'canKick' : 'cannotKick' }>x</a>
    												<h1>{this.state.players[i].name}</h1>
    											</div> );
    		} else {
    			this.state.playerElements.push( <div className = "noplayer" key={i} >
    												<img src = "../../img/noplayer.png" ></img>
    												<h1><span className="one"> . </span><span className="two"> . </span><span className="three"> . </span>​</h1>
    											</div> );
    		}
    	} 
    },

    _getRealHost: function() {
    	return this.state.hostUser.hasOwnProperty( 'name' ) ? this.state.hostUser : this.props.localUser;
    },

    render: function() {
    	this._players();

        return(
        	<div>
        		<div id = "TenManLobby">
		        	<h1 id = "lobbyHeading" >10 Man Lobby <i>({this.state.id})</i></h1>

		        	<div id = "localUserInfo" >
		        		<Avatar user={this._getRealHost().avatar} wide={"128px"} ></Avatar>
		        		<h1 id = "userName" >{this._getRealHost().name}</h1>
		        		<h1 id = "proficiency" >0.00 round win proficiency</h1>
		        		<h1 id = "favoriteWep" >Favorite weapon: <img src = "../../img/guns/tec9.png" height = "30px"></img> with 0 kills</h1>
		        		<h1 id = "games" >0 games played (<span id = "green" >0</span> | <span id = "red" >0</span>)</h1>
		        	</div>

		        	<div id = "options" >
		        		<div id = "bestof" >
		        			<form action="">
								<input type="radio" name="bo" value="bo5" id="bo5"></input><label htmlFor="bo5">BO5</label><br></br>
								<input type="radio" name="bo" value="bo3" id="bo3"></input><label htmlFor="bo3">BO3</label><br></br>
								<input type="radio" name="bo" value="bo1" id="bo1" defaultChecked></input><label htmlFor="bo1">BO1</label>
							</form>
		        		</div>

		        		<div id = "maps">
		        			<a href = "#" className = "cache" ><img src = "../../img/maps/cache.png" ></img></a>
		        			<a href = "#" className = "cobble" ><img src = "../../img/maps/cobble.png" ></img></a>
		        			<a href = "#" className = "dust2" ><img src = "../../img/maps/dust2.png" ></img></a>
		        			<a href = "#" className = "inferno" ><img src = "../../img/maps/inferno.png" ></img></a>
		        			<a href = "#" className = "mirage" ><img src = "../../img/maps/mirage.png" ></img></a>
		        			<a href = "#" className = "nuke" ><img src = "../../img/maps/nuke.png" ></img></a>
		        			<a href = "#" className = "overpass" ><img src = "../../img/maps/overpass.png" ></img></a>
		        			<a href = "#" className = "season" ><img src = "../../img/maps/season.png" ></img></a>
		        			<a href = "#" className = "train" ><img src = "../../img/maps/train.png" ></img></a>
		        		</div>
		        	</div>

		        	<div id = "players" >
		        		{this.state.playerElements}
		        	</div>
		        </div>

		        <ChatBox 	socket={this.props.socket} 
		        			steamId={this.props.localUser.steamid}
		        			lobbyId={this.state.id}>
		        </ChatBox>
        	</div>
        );
    }

});