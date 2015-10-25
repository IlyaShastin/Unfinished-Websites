
function Player( name ) {

	this.name 		= name;
	this.x 			= 0;
	this.y 			= 0;
	this.health		= 100;
	this.scale 		= 10;
	this.lastPoint 	= [ 0, 0 ];
	this.angle 		= 90;
	this.shot  		= false;
	this.shootDelay	= 100; // ms
	this.shots		= [];

	this.getShots = function() {
		return this.shots;
	}

	this.getName = function() {
		return this.name;
	}

	this.setName = function( name ) {
		this.name = name;
	}

	this.getPos = function() {
		return { x: this.x, y: this.y };
	}

	this.setPos = function( x, y ) {
		this.x = x;
		this.y = y;

		if ( x != this.lastPoint[0] && y != this.lastPoint[1] ) {
			var plyvar = this;
			setTimeout(function() {
				plyvar.lastPoint = [ x, y ];
			}, 10);

			plyvar.updateAngle();
		}
	}

	this.getShape = function() {
		return {
			top: [ this.x, this.y-this.scale ],
			bottomleft: [ this.x-(this.scale*0.7), this.y+this.scale ],
			middle: [ this.x, this.y+(this.scale*0.2) ],
			bottomright: [ this.x+(this.scale*0.7), this.y+this.scale ]
		}
	}

	this.getHealth = function() {
		return this.health;
	}

	this.setHealth = function( health ) {
		this.health = health;
	}

	this.updateCoordFromRotation = function( cx, cy, x, y, angle ) {
		var radians = (Math.PI / 180) * angle,
	        cos = Math.cos(radians),
	        sin = Math.sin(radians),
	        nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
	        ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
	    return [nx, ny];
	}

	this.updateAngle = function() {
		var x = this.x,
			y = this.y;
		var xx = this.lastPoint[0],
			yy = this.lastPoint[1];

		var ang = Math.atan2(yy - y, xx - x) * 180 / Math.PI -90;

		this.angle = ang;
	}

	this.shoot = function() {
		if( this.shot ) return;

		var bullet = new Bullet( this.x, this.y, this.angle-90 );
		this.shots.push( bullet );

		var plyvar = this;
		plyvar.shot = true;
		setTimeout( function() {
			plyvar.shot = false;
		}, this.shootDelay );
	}

	this.removeBullet = function( bullet ) {
		var index = this.shots.indexOf(bullet);
		this.shots.splice(index, 1);
	}

	this.draw = function( ctx, delta ) {

		for( i in this.shots ) {
			var bullet = this.shots[i];
			bullet.draw( ctx );

			var canvas = ctx.canvas;
			if ( bullet.outOfBounds( canvas.width, canvas.height ) ) {
				this.removeBullet( bullet );
			}
		}

		var shape = this.getShape();
		ctx.fillStyle = 'white';
		ctx.shadowBlur = 0;
		ctx.beginPath();
			var top = this.updateCoordFromRotation( this.x, this.y, shape.top[0], shape.top[1], this.angle ),
				bottomleft = this.updateCoordFromRotation( this.x, this.y, shape.bottomleft[0], shape.bottomleft[1], this.angle ),
				middle = this.updateCoordFromRotation( this.x, this.y, shape.middle[0], shape.middle[1], this.angle ),
				bottomright = this.updateCoordFromRotation( this.x, this.y, shape.bottomright[0], shape.bottomright[1], this.angle );

			ctx.lineTo( top[0], top[1] );
			ctx.lineTo( bottomleft[0], bottomleft[1] );
			ctx.lineTo( middle[0], middle[1] );
			ctx.lineTo( bottomright[0], bottomright[1] );
		ctx.closePath();
		ctx.fill();
	}
}
