
function Game( state ) {
    this.state = state;
    this.players = [];
    this.zombies = [];
    this.currentRound = 1;

    this.now = Date.now();
    this.frameTime = 0;
    this.then = 0;

    this.intermissionLength = 1000 * 7;

    this.init();
}

Game.prototype = {

    //
    //  Get the state of the current game
    //
    getState: function() {
        return this.state;
    },

    //
    //  Set the state of the current game
    //  state - ENUM representing the state to be set
    //
    setState: function( state ) {
        this.state = state;
    },

    //
    //  Get the amount of zombies for the round
    //  round - the round for which the amount of zombies to get
    //
    getZombieCount: function( round ) {
        return Math.pow( round, 2 ) + 5;
    },

    //
    //  Add a zombie to the current game
    //
    addZombie: function( type ) {
        var zomb = new Zombie( type );
        this.zombies.push( zomb );
    },

    //
    // remove a zombie from the current game
    //
    removeZombie: function( zomb ) {
        this.zombies.splice( this.zombies.indexOf(zomb), 1 );
    },

    //
    //  Add a player to the game
    //  name - string name of the player
    //
    addPlayer: function( name ) {
        var ply = new Player( name );
        this.players.push( ply );
    },

    //
    // Remove a player from the game
    //
    removePlayer: function( ply ) {
        this.players.splice( this.players.indexOf(ply), 1 );
    },

    //
    //  Get all the players in the current game
    //
    getPlayers: function() {
        return this.players;
    },

    //
    //  Tick, called every frame
    //
    tick: function() {
        this.now = Date.now();
        this.frameTime = (this.now - this.then) / 1000;
        this.then = this.now;

        this.draw( this.ctx );
        this.roundTick();

        var gameVar = this;
        window.requestAnimationFrame( function() {
            gameVar.tick();
        });
    },

    //
    //  Draw all the elements in the current game
    //
    draw: function( ctx ) {
        this.ctx.clearRect ( 0 , 0 , this.canvas.width, this.canvas.height );

        for( i in this.players )
            this.players[i].draw( ctx );

        for( i in this.zombies )
            this.zombies[i].draw( ctx );

    },

    //
    //  Called when the local player moves his mouse
    //
    mouseMove: function( evt ) {
        var rect = this.canvas.getBoundingClientRect();
      	var x = evt.clientX - rect.left,
          	y = evt.clientY - rect.top;

        this.localPlayer.mouseMove( x, y );
    },

    //
    // Called whent the local player clicks his mouse
    //
    mouseClick: function( evt ) {
        this.zombies.length = 0;
    },

    //
    //  Called when a key is pressed down
    //
    keyDown: function( evt ) {
        var key = String.fromCharCode(evt.keyCode);
        this.localPlayer.key( key, true );
    },

    //
    //  Called when a key is released
    //
    keyUp: function( evt ) {
        var key = String.fromCharCode(evt.keyCode);
        this.localPlayer.key( key, false );
    },

    //
    //  Called before a reound is started. During the intermission.
    //
    preRound: function() {
        this.currentRound += 1;
        this.zombies.length = 0;

        this.startRound();
    },

    //
    // Called after the round ends
    //
    postRound: function() {
        var gameVar = this;
        setTimeout( function() {
            gameVar.preRound();
        }, this.intermissionLength );
    },

    //
    // Starts a new round, dependent on this.currentRound
    //
    startRound: function() {
        for ( i = 0; i < this.getZombieCount( this.currentRound ); i++ )
            this.addZombie( ZOMBIE_NORMAL );

        this.setState( GAMESTATE_LIVE );
    },

    //
    // Checks for the round to end
    //
    roundTick: function() {
        if ( this.zombies.length <= 0 && this.getState() == GAMESTATE_LIVE ) {
            this.postRound();
            this.setState( GAMESTATE_INTERMISSION );
        }
    },

    //
    //  Initial things that need to be done....
    //
    init: function() {
        this.canvas = document.getElementById( "canvas" );
	    this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx = this.canvas.getContext("2d");

        this.addPlayer( "localplayer" );
        this.localPlayer = this.players[0];

        this.startRound();

        var gameVar = this;
        window.requestAnimationFrame( function() {
            gameVar.tick();
        });

        this.canvas.addEventListener('mousemove', function( evt ) {
            gameVar.mouseMove( evt );
        }, false);

        this.canvas.addEventListener('mousedown', function( evt ) {
            gameVar.mouseClick( evt );
        }, false);

        document.addEventListener('keydown', function( evt ) {
            gameVar.keyDown( evt );
        }, false);
		document.addEventListener('keyup', function( evt ) {
            gameVar.keyUp( evt );
        }, false);
    }
}
