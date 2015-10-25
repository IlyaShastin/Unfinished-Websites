
var GAMESTATE_LOBBY = 0,
    GAMESTATE_LIVE  = 1,
    GAMESTATE_INTERMISSION = 2,
    GAMESTATE_OVER  = 3;

var GAME;

Math.getRotatedCoord = function( x, y, cx, cy, angle ) {
    var radians = (Math.PI / 180) * angle,
	    cos = Math.cos(radians),
	    sin = Math.sin(radians),
	    nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
	    ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
	return { x: nx,
             y: ny };
}

Math.distanceFrom = function( obj1, obj2 ) {
    var xs = 0;
    var ys = 0;

    xs = obj2.x - obj1.x;
    xs = xs * xs;

    ys = obj2.y - obj1.y;
    ys = ys * ys;

    return xs + ys;
}

Math.randomInteger = function( min, max ) {
    return Math.floor((Math.random() * max) + min);
}

function startGame() {
    GAME = new Game( GAMESTATE_LIVE );


}
