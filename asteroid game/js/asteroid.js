
function Asteroid( x, y, radius ) {

	this.x 				= x;
	this.y 				= y;
	this.radius			= radius;
	this.direction		= Math.randomFloat( 0, 2*Math.PI );
	this.speed			= Math.randomFloat( 0.3, 3.4 );
	this.colliding		= false;
	this.health			= 100;
	this.maxSegmentSize	= 20;
	this.shapeArray		= [];
	this.particle		= null;
	this.diameter		= radius*2;
	this.canBreak 		= true;
	this.speedLimit 	= 5;
	this.id 			= Math.floor( Math.random() * 20 );

	this.velx = Math.cos( this.direction ) * this.speed;
	this.vely = Math.sin( this.direction ) * this.speed;

	this.getPos = function() {
		return { x: this.x,
				 y: this.y };
	}

	this.setPos = function( x, y ) {
		this.x = x;
		this.y = y;
	}

	this.getHealth = function() {
		return this.health;
	}

	this.getRadius = function() {
		return this.radius;
	}

	this.setRadius = function( radius ) {
		this.radius = radius;
	}

	this.getSpeed = function() {
		return this.speed;
	}

	this.setSpeed = function( speed ) {
		this.speed = speed > this.speedLimit ? this.speedLimit : speed;
	}

	this.setVelocity = function( x, y ) {
		this.velx = x;
		this.vely = y;
	}

	this.getVelocity = function() {
		return { x: this.velx,
				 y: this.vely };
	}

	this.setDirection = function( direction ) {
		this.direction = direction;
	}

	this.getDirection = function() {
		return this.direction;
	}

	this.clampPosition = function( xMax, yMax ) {
		var pos = this.getPos();

		xMax += this.diameter;
		yMax += this.diameter;

		xyMin = -this.diameter;

		if ( pos.x > xMax ) this.setPos( xyMin, pos.y );
		if ( pos.x < xyMin ) this.setPos( xMax, pos.y );

		if ( pos.y > yMax ) this.setPos( pos.x, xyMin );
		if ( pos.y < xyMin ) this.setPos( pos.x, yMax );
	}

	this.distanceFrom = function( object ) {
		var thisObject = this.getPos();
        var xs = 0;
        var ys = 0;

        xs = object.x - thisObject.x;
        xs = xs * xs;

        ys = object.y - thisObject.y;
        ys = ys * ys;

        return xs + ys;
	}

	this.collide = function( asteroid ) {

	}

	this.checkForCollision = function( asteroid ) {
		if (this.colliding) return false;
		if (asteroid.colliding) return false;

		var distance = this.distanceFrom(asteroid);
		var centerDistance = this.radius * this.radius + asteroid.getRadius() * asteroid.getRadius() + this.getRadius()*1.5;
		if ( distance < centerDistance && !this.colliding ) {

			this.colliding = true;
			asteroid.colliding = true;

			this.collidedWith = asteroid;
			this.hit( asteroid.getRadius() );
			this.collide( asteroid );

			return true;
		}
	}

	this.hit = function( damage ) {
		this.health -= damage;
	}

	this.move = function() {
		var pos = this.getPos();
		var vel = this.getVelocity();

		this.setPos( pos.x + vel.x, pos.y + vel.y );
	}

	this.generateShape = function() {
		var spaceLeft = 350;

		this.shapeArray.push( [ 10, 0 ] );
		while( spaceLeft > 10 ) {
			var randomSize = Math.randomNumber( 5, this.maxSegmentSize );
			var deviation = Math.randomNumber( 0, Math.sqrt(this.getRadius()*1.5) );
			this.shapeArray.push( [ randomSize, deviation ] );
			spaceLeft -= randomSize;
		}
		this.shapeArray.push( [ spaceLeft, 0 ] );

		this.createdShape = true;
	}
	this.generateShape();

	this.draw = function( ctx ) {
		if ( !this.createdShape) return;

		if ( this.collidedWith != null ) {
			var dist = this.distanceFrom( this.collidedWith );
			if ( dist > Math.pow( this.getRadius(), 2 ) + Math.pow( this.collidedWith.getRadius(), 2 ) && this.colliding ) {
				this.colliding = false;
				this.collidedWith.colliding = false;
			}
		}

		if( this.particle != null )
			this.particle.draw( ctx );

		ctx.fillStyle = '#FFFFF';
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 8;
		ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
		ctx.beginPath();

		var currentAngle = 0;
	    for ( i = 0; i <= this.shapeArray.length-1; i++ ) {
	    	var s = this.shapeArray[i][0],
	    		d = this.shapeArray[i][1];
			var rad = Math.toRadians( currentAngle + s );
	    	var x = this.x + Math.cos(rad) * (this.radius+d),
	    		y = this.y + Math.sin(rad) * (this.radius+d);
			currentAngle += s;
	    	ctx.lineTo( x, y );
			//ctx.font = "10px Verdana";
			//ctx.fillText(i, x, y );
	    }

	    ctx.closePath();
		ctx.fill();

		//ctx.font = "10px Verdana";
		//ctx.fillText( this.id, this.x-this.radius*2, this.y );

		/*ctx.beginPath();
		ctx.lineWidth="1";
		ctx.strokeStyle="red";
		ctx.rect(this.x, this.y,1,1);
		ctx.closePath();
		ctx.stroke();*/
	}

}
