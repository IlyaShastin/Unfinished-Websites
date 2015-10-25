"use strict";

const GAME_STATE_PRE    = 0,
      GAME_STATE_LIVE   = 1,
      GAME_STATE_PAUSE  = 2,
      GAME_STATE_INTM   = 3,
      GAME_STATE_OVER   = 4,
      GAME_STATE_MENU   = 5;

const GAME_DIFFICULTY_EASY      = 0,
      GAME_DIFFICULTY_NORMAL    = 1,
      GAME_DIFFICULTY_HARD      = 2,
      GAME_DIFFICULTY_INSANE    = 3;

const GAME_CONNECTION_REFUSED   = 0,
      GAME_CONNECTION_ACCEPT    = 1;

class Game {

    constructor() {
        this.players       = [];
        this.localPlayer   = null;
        this.zombies       = [];
        this.state         = GAME_STATE_MENU;
        this.round         = 0;
        this.intermLength  = 1000 * 7;
        this.canvas        = document.getElementById("canvas");
        this.ctx           = this.canvas.getContext("2d");

        this.tick();
    }

    //
    //  Try to connect to a server
    //
    connect( ip ) {
        this.socket = io.connect( 'http://' + ip );
        let gameVar = this;

        this.socket.on('connect_error', function( err ){
            console.log('Connection Failed.', err);
            $( "#serverAddress" ).removeClass( "error" ).addClass( "error" );
            $( "#errorText" ).html( "Server was not found." );
            gameVar.socket.disconnect();
        });

        this.socket.on('callback', function (data) {
            console.log(data);
            if ( data['refuse'] == GAME_CONNECTION_REFUSED ) {
                $( "#serverAddress" ).removeClass( "error" ).addClass( "error" );
                $( "#errorText" ).html( "Connection to server was refused." );
                throw new Error( data['error'] );
            } else if ( data['refuse'] == GAME_CONNECTION_ACCEPT ) {
                gameVar.state = GAME_STATE_PRE;
                console.log("good to go");
                // add net hooks here
            }
        });
    }

    //
    // Send the local player's pos to the server
    //
    LocalPlayerOnMove() {

    }

    //
    // Send the local player's shot to the server
    //
    LocalPlayerOnShoot() {

    }

    //
    //  Called when a new player joins the game.
    //
    playerJoin( id, name ) {
        let ply = new Player( id, name );
        this.players.push( ply )
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
    getPlayerByID( id ) {
        for( ply in this.players ) {
            let player = this.players[ply];
            if ( player.id == id ) return player;
        }
    }

    //
    //  Set game state
    //
    set state( state ) {
        console.log( "Setting State: " + state );

        if ( state == GAME_STATE_MENU ) {
            this.drawMenu();
        } else if ( state == GAME_STATE_PRE ) {
            this.drawGame();
        }
    }

    //
    //
    //
    tick() {
        console.log( "tick" );

        this.now = Date.now();
        this.frameTime = (this.now - this.then) / 1000;
        this.then = this.now;

        this.draw();

        var gameVar = this;
        window.requestAnimationFrame( function() {
            gameVar.tick();
        });
    }

    //
    //  Draws the game stuff
    //
    draw() {
        if ( this.state == GAME_STATE_MENU ) return;

        for( i in this.players )
            this.players[i].draw( this.ctx );

        for( i in this.zombies )
            this.zombies[i].draw( this.ctx );
    }

    //
    //  Draws the menu for the game
    //
    drawMenu() {
        $( "#game" ).hide();
        $( "#menu" ).show();
    }

    //
    //  Draws the game canvas
    //
    drawGame() {
        $( "#game" ).show();
        $( "#menu" ).hide();
    }

    //
    //
    //
    tooString() {
        return "Game [" + state + "] ";
    }
}
