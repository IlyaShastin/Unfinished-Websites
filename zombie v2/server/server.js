
"use strict";

var GAME;

var http = require('http'),
    fs = require('fs'),
    babel = require('babel');

require('./classes/game.js');

let app = http.createServer( function (request, response) {
    console.log("Game server started");
    fs.readFile("../index.html", 'utf-8', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}).listen(6969);

let io = require('socket.io').listen(app);

function init() {
    GAME = new Game();

    GAME.setupServer( io.sockets );
}
