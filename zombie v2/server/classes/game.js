
"use strict";

const GAME_STATE_PRE    = 0,
      GAME_STATE_LIVE   = 1,
      GAME_STATE_PAUSE  = 2,
      GAME_STATE_INTM   = 3,
      GAME_STATE_OVER   = 4;

const GAME_DIFFICULTY_EASY      = 0,
      GAME_DIFFICULTY_NORMAL    = 1,
      GAME_DIFFICULTY_HARD      = 2,
      GAME_DIFFICULTY_INSANE    = 3;

const GAME_CONNECTION_REFUSED   = 0,
      GAME_CONNECTION_ACCEPT    = 1;

class Game {

    constructor() {
        this.players       = [];
        this.zombies       = [];
        this.tickRate      = 100/60;
        this.state         = GAME_STATE_PRE;
        this.round         = 0;
        this.intermLength  = 1000 * 7;
        this.port          = 6969;

        this.tick();
    }

    //
    //  Set up the game server
    //
    setupServer( server ) {
        let gameVar = this;
        server.on('connection', function(socket) {
            if (!gameVar.isJoinable()) {
                console.log("Refused");
                socket.emit('callback', { refuse: GAME_CONNECTION_REFUSED });
                socket.disconnect();
            } else {
                console.log("Connected");
                socket.emit('callback', { refuse: GAME_CONNECTION_ACCEPT });
            }



            socket.on('playerMove', function( data ) {
                // When a player moves
            });

            socket.on('playerShoot', function( data ) {
                // When a player shoots
            });

            socket.on('disconnect', function( data ) {
            	// Player leave
        	});
        });
        console.log("Set up server hooks");
    }

    //
    //  Called when a player moves
    //
    playerMove( id, moveData ) {

    }

    //
    //  Called when a player moves
    //
    playerShoot( id, shootData ) {

    }

    //
    //  Called when a new player joins the game.
    //
    playerJoin( id, name ) {
        let ply = new Player( id, name );
        this.players.push( ply )
    }

    //
    //  Get whether the server is joinable
    //
    isJoinable() {
        return (this.state == GAME_STATE_PRE) && (this.players.length <= 4);
    }

    //
    //  Called when a player leaves the game
    //
    playerLeave( id ) {
        let player = this.getPlayerByID( id );

        if ( player != null )
            this.players.splice(this.players.indexOf(player), 1);
    }

    //
    //  Get a player by his ID
    //
    playerByID( id ) {
        for( ply in this.players ) {
            let player = this.players[ply];
            if ( player.id == id ) return player;
        }
    }

    //
    //  Constant loop for the game logic
    //
    tick() {
        this.now = Date.now();
        this.frameTime = (this.now - this.then) / 1000;
        this.then = this.now;

        this.roundTick();

        let gameVar = this;
        window.requestAnimationFrame( function() {
            gameVar.tick();
        });
    }

    //
    //  Called every tick for the round logic
    //
    roundTick() {
        switch(this.state) {
            case GAME_STATE_PRE:
                // pre game tick
                console.log("pre-game");
                break;

            case GAME_STATE_LIVE:
                // Live game tick
                console.log("live");
                break;

            case GAME_STATE_PAUSE:
                // paused game tick
                console.log("paused");
                break;

            case GAME_STATE_INTM:
                // intermission game tick
                console.log("intermission");
                break;

            case GAME_STATE_OVER:
                // game over tick
                console.log("game over");
                break;

            default:
                throw new Error("Invalid game state running.");
        }
        // if ( this._zombies.length <= 0 && this.isSate( GAME_STATE_LIVE ) ) {
        //
        // }
    }

    //
    //  Check if this state is the current state
    //
    isState( state ) {
        return this.state == state;
    }

    //
    //  Called when the game's state is changed
    //
    set state( state ) {
        switch( state ) {
            case GAME_STATE_PRE:
                // pre game tick
                console.log("-pre-game");
                break;

            case GAME_STATE_LIVE:
                // Live game tick
                console.log("-live");
                break;

            case GAME_STATE_PAUSE:
                // paused game tick
                console.log("-paused");
                break;

            case GAME_STATE_INTM:
                // intermission game tick
                console.log("-intermission");
                break;

            case GAME_STATE_OVER:
                // game over tick
                console.log("-game over");
                break;

            default:
                throw new Error("Invalid game state running.");
        }
    }
}
