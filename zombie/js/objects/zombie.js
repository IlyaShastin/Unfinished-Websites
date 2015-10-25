
var ZOMBIE_NORMAL = 0,
    ZOMBIE_FAST = 1,
    ZOMBIE_BRUTE = 2;

var QUADRANT_LEFT = 0,
    QUADRANT_TOP = 1,
    QUADRANT_RIGHT = 2,
    QUADRANT_BOTTOM = 3;

function Zombie( type ) {

    this.x = 0;
    this.y = 0;

    this.width = 20;
    this.height = 50;

    this.angle = 0;
    this.frozen = true;

    switch ( type ) {
        case ZOMBIE_FAST:
            this.health = 80;
            this.speed = 90;
            break;

        case ZOMBIE_BRUTE:
            this.health = 170;
            this.speed = 60;
            break;

        default:
            this.health = 100;
            this.speed = 80;
    }

    this.init();
}

Zombie.prototype = {

    init: function() {
        var spawn = this.getRandomSpawnPosition( Math.randomInteger( 0, 3 ) );
        this.setPos( spawn.x, spawn.y );

        var zombVar = this;
        setTimeout( function() {
            zombVar.frozen = false;
        }, 500 );
    },

    getPos: function() {
        return { x: this.x,
                 y: this.y };
    },

    setPos: function( x , y ) {
        this.x = x;
        this.y = y;
    },

    getClosestPlayer: function() {
        var players = GAME.getPlayers(),
            closest = players[0],
            closestDist = Math.distanceFrom( this.getPos(), closest.getPos() );

        for ( i in players ) {
            if ( i == 0 ) continue;

            var ply = players[i],
                distance = Math.distanceFrom( this.getPos(), ply.getPos() );

            if ( closestDist > distance ){
                closest = ply;
                closestDist = distance;
            }

        }

        var plyPos = closest.getPos();
        this.angle = Math.atan2( plyPos.y - this.y, plyPos.x - this.x );

        return closest;
    },

    getRandomSpawnPosition: function( side ) {
        side = side || QUADRANT_LEFT;
        var pos = {};

        switch ( side ) {
            case QUADRANT_LEFT:
                pos.x = Math.randomInteger( -50, -100 );
                pos.y = Math.randomInteger( 0, window.innerHeight );
                break;
            case QUADRANT_TOP:
                pos.x = Math.randomInteger( 0, window.innerWidth );
                pos.y = Math.randomInteger( -50, -100 );
                break;
            case QUADRANT_RIGHT:
                pos.x = Math.randomInteger( window.innerWidth + 50, window.innerWidth + 100 );
                pos.y = Math.randomInteger( 0, window.innerHeight );
                break;
            case QUADRANT_BOTTOM:
                pos.x = Math.randomInteger( 0, window.innerWidth );
                pos.y = Math.randomInteger( window.innerHeight + 50, window.innerHeight + 100 );
                break;
        }

        return pos;
    },

    getVelocity: function() {
        if ( this.frozen ) return { x: 0, y: 0 };
        return { x: Math.cos( this.angle ) * (this.speed * GAME.frameTime),
                 y: Math.sin( this.angle ) * (this.speed * GAME.frameTime) }
    },

    draw: function( ctx ) {

        var target = this.getClosestPlayer();
        this.move( GAME.frameTime );

        // Draw the zombie model
        ctx.fillStyle = 'rgba( 0, 255, 0, 1 )';
        ctx.beginPath();
        ctx.rect( this.x, this.y, this.width, this.height );
        ctx.closePath();
        ctx.fill();
    },

    move: function( delta ) {

        var vel = this.getVelocity();

        this.setPos( this.x + vel.x, this.y + vel.y );
    }

}
