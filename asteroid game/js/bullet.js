
function Bullet( x, y, angle ) {

    this.x          = x;
    this.y          = y;
    this.angle      = Math.toRadians(angle);
    this.speed      = 9;
    this.damage     = Math.randomNumber( 10, 35 );

    this.getVelocity = function() {
        return { x: Math.cos( this.angle ) * this.speed,
                 y: Math.sin( this.angle ) * this.speed };
    }

    this.getDamage = function() {
        return this.damage;
    }

    this.move = function() {
        var vel = this.getVelocity();

        this.x += vel.x;
        this.y += vel.y;
    }

    this.outOfBounds = function( xMax, yMax ) {
        if ( this.x > xMax ) return true;
		if ( this.x < 0 ) return true;

		if ( this.y > yMax ) return true;
		if ( this.y < 0 ) return true;

        return false;
    }

    this.draw = function( ctx ) {
        ctx.fillStyle = 'rgba( 255, 0, 0, 1 )';
        ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 5;
		ctx.shadowColor = 'rgba(255, 0, 0, 1)';
        ctx.beginPath();
        ctx.rect( this.x, this.y, 3, 3 );
        ctx.closePath();
        ctx.fill();

        this.move();
    }

}
