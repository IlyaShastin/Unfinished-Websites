
function CollisionParticle( x, y, spawn, life, direction, speed  ) {

    this.x              = x;
    this.y              = y;
    this.date           = new Date();
    this.spawnTime      = spawn;
    this.lifeTime       = life; //ms
    this.dieTime        = this.spawnTime + this.lifeTime;
    this.direction      = direction;
    this.speed          = speed;
    this.dead           = false;
    this.radius         = 2;

    this.getPos = function() {
        return { x: this.x,
                 y: this.y };
    }

    this.setPos = function( x, y ) {
        this.x = x;
        this.y = y;
    }

    this.getVelocity = function() {
        return { x: Math.cos( this.direction ) * this.speed,
				 y: Math.sin( this.direction ) * this.speed };
    }

    this.getOpacity = function() {
        var lifeLeft = this.dieTime - this.date.getTime();
        return 1;// Math.lerp( 1, 0, lifeLeft / this.lifeTime );
    }

    this.draw = function( ctx ) {
        ctx.fillStyle = 'rgba( 0, 255, 0, ' + this.getOpacity() + ' )';
        ctx.beginPath();
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 8;
		ctx.shadowColor = 'rgba(0, 0, 0, 1)';
		ctx.arc( this.x, this.y, this.radius, 0, 2*Math.PI );
		ctx.closePath();
		ctx.fill();
    }

}
