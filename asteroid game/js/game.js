
var STATE_MENU = 0,
	STATE_LIVE = 1,
	STATE_OVER = 2;

Math.randomNumber = function( min, max ) {
	return Math.floor( (Math.random() * max) + min );
}

Math.randomFloat = function( min, max ) {
	return (Math.random() * max) + min ;
}

Math.vectorAngle = function( p1, p2 ) {
	return Math.atan2( p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI;
}

Math.toRadians = function(angle) {
	return angle * (Math.PI / 180);
}

Math.toDegrees = function( radians ) {
	return radians * (180/Math.PI);
}

Math.lerp = function( A, B, t ) {
	return A + t * (B - A);
}

function Game( canvas ) {

	this.players 		= [];
	this.asteroids 		= [];
	this.state 			= STATE_LIVE;
	this.tickrate		= 100/60;
	this.canvas 		= canvas;
	this.ctx 			= canvas.getContext("2d");
	this.initasteroids	= 40;
	this.localPlayer	= null;
	this.starBG			= new Stars( canvas.width, canvas.height );

	this.addPlayer = function( name ) {
		var ply = new Player( name );
		this.players.push( ply );
	}

	this.removePlayer = function( ply ) {
		this.players.splice(this.players.indexOf(ply), 1);
	}

	this.createasteroid = function( x, y, radius ) {
		var asteroid = new Asteroid( x, y, radius );
		this.asteroids.push( asteroid );
	}

	this.removeasteroid = function( asteroid ) {
		this.asteroids.splice(this.asteroids.indexOf(asteroid), 1);
	}

	this.asteroidBreak = function( asteroid ) {
		if( asteroid.getRadius() < 8 ) return;
		if( !asteroid.canBreak ) return;

		var amount = Math.randomNumber( 2, 3 ),
			radius = asteroid.getRadius() / amount,
			pos = asteroid.getPos();

		this.removeasteroid( asteroid );
		for ( i = 0; i < amount; i++ ) {
			this.createasteroid( pos.x, pos.y, radius );
			var ast = this.asteroids[this.asteroids.length-1];
			ast.canBreak = false;
			setTimeout( function() {
				ast.canBreak = true;
			}, 100 );
		}
	}

	this.changeGameState = function( state ) {
		this.state = state;
	}

	this.getGameState = function() {
		return this.state;
	}

	this.draw = function() {
		this.ctx.clearRect ( 0 , 0 , this.canvas.width, this.canvas.height );

		this.starBG.draw( this.ctx );

		for( i in this.players )
			this.players[i].draw(this.ctx, this.delta);

		for( i in this.asteroids )
			this.asteroids[i].draw(this.ctx);
	}

	this.physics = function() {
		for( i in this.asteroids ) {
			var asteroid1 = this.asteroids[i];
			asteroid1.move();
			asteroid1.clampPosition( this.canvas.width, this.canvas.height );
			for ( _i in this.asteroids ) {
				if ( i == _i ) continue;

				var asteroid2 = this.asteroids[_i];
				var colliding = asteroid1.checkForCollision( asteroid2 );
				//if (colliding) this.asteroidBreak( asteroid );
				if (colliding) {

					var p1 = asteroid1.getPos(),
						p2 = asteroid2.getPos(),
						v1 = asteroid1.getVelocity(),
						v2 = asteroid2.getVelocity(),
						m1 = asteroid1.getRadius(),
						m2 = asteroid2.getRadius();

					var dx = p1.x - p2.x,
						dy = p1.y - p2.y;

					var a = Math.atan2( dy, dx ),
						mag1 = Math.sqrt(v1.x*v1.x + v1.y*v1.y),
						mag2 = Math.sqrt(v2.x*v2.x + v2.y*v2.y),
						d1 = Math.atan2( v1.y, v1.x ),
						d2 = Math.atan2( v2.y, v2.x ),

						new_v1x = mag1 * Math.cos( d1 - a ),
						new_v1y = mag1 * Math.sin( d1 - a ),

						new_v2x = mag2 * Math.cos( d2 - a ),
						new_v2y = mag2 * Math.sin( d2 - a ),

						final_v1x = ( (m1-m2) * new_v1x + (m2+m2) * new_v2x ) / (m1+m2),
						final_v2x = ( (m1+m1) * new_v1x + (m2-m2) * new_v2x ) / (m1+m2),

						final_v1y = new_v1y,
						final_v2y = new_v2y;

					var XV1 = Math.cos(a) * final_v1x + Math.cos(a+Math.PI/2) * final_v1y,
						YV1 = Math.sin(a) * final_v1x + Math.sin(a+Math.PI/2) * final_v1y,

						XV2 = Math.cos(a) * final_v2x + Math.cos(a+Math.PI/2) * final_v2y,
						YV2 = Math.sin(a) * final_v2x + Math.sin(a+Math.PI/2) * final_v2y;

					asteroid1.setDirection( d1 );
					asteroid2.setDirection( d2 );

					asteroid1.setVelocity( XV1, YV1 );
					asteroid2.setVelocity( XV2, YV2 );

				}
			}
		}
	}

	this.bulletCollisions = function() {
		for ( i in this.players ) {
			var ply = this.players[i];
			var shots = ply.getShots();
			for ( b in shots ) {
				var bullet = ply.shots[b];
				for ( a in this.asteroids ) {
					var asteroid = this.asteroids[a];
					if ( asteroid.distanceFrom( bullet ) <= asteroid.getRadius() * asteroid.getRadius() ) {
						asteroid.hit( bullet.getDamage() );
						if ( asteroid.getHealth() <= 0 )
							this.asteroidBreak( asteroid );
						ply.removeBullet( bullet );
					}
				}
			}
		}
	}

	var gamevar = this;
	this.tick = function() {

		gamevar.now = Date.now();
		gamevar.delta = (gamevar.now - gamevar.then) / 1000; // seconds since last frame
		gamevar.then = gamevar.now;

		gamevar.draw();
		gamevar.physics();
		gamevar.bulletCollisions();

		window.requestAnimationFrame(gamevar.tick);
	}

	this.localPlayerMousePos = function( evt ) {
		var rect = canvas.getBoundingClientRect();
      	var x = evt.clientX - rect.left,
          	y = evt.clientY - rect.top;

		gamevar.localPlayer.setPos( x, y );
	}

	this.localPlayerMouseClick = function( evt ) {
		gamevar.localPlayer.shoot();
	}

	this.init = function() {
		for( i = 0; i < this.initasteroids; i++ ) {
			var randomX = Math.randomNumber( 0, this.canvas.width ),
				randomY = Math.randomNumber( 0, this.canvas.height ),
				randomR = Math.randomNumber( 10, 30 );
			this.createasteroid( randomX, randomY, randomR );
		}

		this.addPlayer( "Player" );
		this.localPlayer = this.players[0];

		var gamevar = this;
		window.requestAnimationFrame( function() {
			gamevar.tick();
		});

		this.canvas.addEventListener('mousemove', this.localPlayerMousePos, false);
		this.canvas.addEventListener('mousedown', this.localPlayerMouseClick, false);
	}

	this.init();
}

function startGame() {
	var canvas = document.getElementById( "canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var GAME = new Game( canvas );

}
