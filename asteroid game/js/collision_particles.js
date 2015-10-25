
function CollisionParticles( x, y, ctx ) {

    this.x              = x;
    this.y              = y;
    this.date           = new Date();
    this.spawnTime      = this.date.getTime();
    this.particleCount  = 5;
    this.particleArray  = [];

    this.getPos = function() {
        return { x: this.x,
                 y: this.y };
    }

    this.init = function() {
        for( i = 0; i < this.particleCount; i++ ) {
            var lifeTime = Math.randomNumber( 1000, 3000 ),
                direction = Math.randomNumber( 0, 360 ),
                speed = Math.randomNumber( 1, 4 );
            var particle = new CollisionParticle( 0, 0, this.date.getTime(), lifeTime, direction, speed );

            this.particleArray.push( particle );
        }
    }
    this.init();

    this.particleMove = function( particle ) {
        var vel = particle.getVelocity(),
            pos = particle.getPos();

        particle.setPos( this.x + pos.x + vel.x, this.y + pos.y + vel.y );
    }

    this.tick = function() {
        for( i in this.particleArray ) {
            this.particleMove( this.particleArray[i] );
        }
    }

    this.draw = function( ctx ) {
        for( i in this.particleArray )
            this.particleArray[i].draw( ctx );
    }

}
