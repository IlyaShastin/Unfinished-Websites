
function Player( name ) {
    this.name = name;
    this.x = 100;
    this.y = 100;
    this.width = 20;
    this.height = 50;
    this.angle = 0;
    this.speed = 120;
    this.aimAt = {};

    this.keysDown = {};
}

Player.prototype = {

    getName: function() {
        return this.name;
    },

    setPos: function( x, y ) {
        this.x = x;
        this.y = y;
    },

    getPos: function() {
        return { x: this.x,
                 y: this.y }
    },

    getCenterPos: function() {
        return { x: this.x + ( this.width * 0.5 ),
                 y: this.y + ( this.height * 0.5 ) }
    },

    mouseMove: function( x, y ) {
        this.aimAt = { x: x, y: y };

        var center = this.getCenterPos();
        var ang = Math.atan2(center.y - y, center.x - x) * 180 / Math.PI;
        this.setAngle( ang );
    },

    getAngle: function() {
        return this.angle;
    },

    setAngle: function( angle ) {
        this.angle = angle;
    },

    key: function( key, down ) {
        this.keysDown[key] = down;
    },

    move: function( delta ) {
        for ( key in this.keysDown ) {
            var keyDown = this.keysDown[key];

            if ( key == "W" && keyDown ) {
                this.setPos( this.x, this.y - this.speed*delta );
            } else if ( key == "S" && keyDown ) {
                this.setPos( this.x, this.y + this.speed*delta );
            } else if ( key == "A" && keyDown ) {
                this.setPos( this.x - this.speed*delta, this.y );
            } else if ( key == "D" && keyDown ) {
                this.setPos( this.x + this.speed*delta, this.y );
            }
        }
    },

    draw: function( ctx ) {
        this.move( GAME.frameTime );

        // Draw the player model
        ctx.fillStyle = 'rgba( 255, 0, 0, 1 )';
        ctx.beginPath();
        ctx.rect( this.x, this.y, this.width, this.height );
        ctx.closePath();
        ctx.fill();

        // Draw the debug aim line
        var cpos = this.getCenterPos();
        var rot = Math.getRotatedCoord( this.aimAt.x, this.aimAt.y, cpos.x, cpos.y, this.angle );

        ctx.fillStyle = 'rgba( 255, 255, 0, 1 )';
        ctx.beginPath();
        ctx.moveTo( cpos.x, cpos.y );
        ctx.lineTo( this.aimAt.x, this.aimAt.y );
        ctx.closePath();
        ctx.stroke();
    }

}
