"use strict";

var GAME;

window.onload = function() {
    $( "#joinServer" ).click( function() {
        let address = $( "#serverAddress" ).val();
        if ( address.trim() == "" ) return;

        GAME.connect( address );
    });
}

function startGame() {
    GAME = new Game();
    
}
