
function Stars( width, height ) {

    this.width       = width;
    this.height      = height;
    this.count       = 1000;
    this.starArray   = [];
    this.generated   = false;

    this.generate = function() {
        for( i = 0; i < this.count; i++ ) {
            var randX = Math.randomNumber( 0, this.width ),
                randY = Math.randomNumber( 0, this.height ),
                randS = Math.randomNumber( 1, 15 ),
                randO = Math.randomNumber( 0, 255 ),
                randB = Math.randomNumber( 1, 2 );

            var star = {
                opacity: randO,
                x: randX,
                y: randY,
                speed: randS,
                fadeout: randB == 2 ? true : false
            };

            this.starArray.push( star );
        }

        this.generated = true;
    }
    this.generate();

    this.draw = function( ctx ) {
        if( !this.generated ) return;

        for( i in this.starArray ) {
            var star = this.starArray[i];

            ctx.fillStyle = 'rgba( 255, 255, 255, ' + Math.lerp( 0, 1, star.opacity/255 ) + ' )';
    		ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.rect(star.x,star.y,1,1);
            ctx.closePath();
            ctx.fill();

            if ( star.opacity >= 255 ) {
                star.fadeout = true;
            } else if ( star.opacity <= 0 ) {
                star.fadeout = false;
            }

            if( star.fadeout ) {
                star.opacity -= star.speed;
            } else {
                star.opacity += star.speed;
            }
        }
    }
}
