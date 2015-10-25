"use strict";

class Player {
	constructor( id, name ) {
		this.id 		= id;
		this.name 		= name;

		// Common vars
		this.x 		= 0;
		this.y 		= 0;
		this.width 	= 20;
	    this.height	= 50;
	    this.angle 	= 0;
		this.health = 100;

		// Max values
		this.max_x_speed 	= 120;
		this.max_y_speed	= 120;

		// Current Vals
		this.x_speed 	= 0;
		this.y_speed 	= 0;

	    this.keysDown 	= {};

		this.kills = 0;
		this.lives = 3;
	}


	//
	//	Remove a life from the player
	//
	die() {
		this.lives -= 1;
		this.health = 100;
	}

	//
	// Set a status of a key the client pressed
	//
	key( key, down ) {
		this.keysDown[key] = down;
	}

	//
	// Move the player
	//
	move( delta ) {
		let pos = this.pos;
		let keys = this.keysDown;

		// Move over the y axis
		if ( keys["W"] ) {
			this.y_speed = Math.min(this.y_speed - 1, -this.max_y_speed);
		} else if ( keys["S"] ) {
			this.y_speed = Math.max(this.y_speed + 1, this.max_y_speed);
		}

		// Move over the x axis
		if ( keys["D"] ) {
			this.x_speed = Math.min(this.x_speed + 1, this.max_x_speed);
		} else if ( keys["A"] ) {
			this.x_speed = Math.max(this.x_speed - 1, -this.max_x_speed);
		}

		this.pos = { x: pos.x + this.x_speed * delta,
		 			 y: pos.y + this.y_speed * delta }
	}

	//
	// Get the center pos of the player
	//
	get centerPos() {
		return { x: this.x + ( this.width * 0.5 ),
                 y: this.y + ( this.height * 0.5 ) }
	}

	//
	// Get the health of the player
	// Cannot be < 0
	//
	get health() {
		return Math.max( this.health, 0 )
	}

	//
	// Get the pos of the player
	//
	get pos() {
		return { x: this.x,
                 y: this.y }
	}

    //
    //  Get the size of the player
    //
    get size() {
        return { w: this.width,
                 h: this.height }
    }

	//
	// Get if the player is alive
	//
	get isAlive() {
	    return this.health > 0;
	}

	//
	// set the health of the player
	// Cannot be negative
	//
	set health( hp ) {
		if (hp < 0) {
			throw new Error('Invalid value for health: ' + hp);
	    }
	    this.health = hp;
	}

	//
	// Set the angle of the player
	// Used for shooting
	//
	set angle( ang ) {
		this.angle = ang;
	}

	//
	// Set the pos of the player
	//
	set pos( pos ) {
		this.x = pos.x;
		this.y = pos.y;
	}

    //
    //  Get the draw function  for the player
    //
    draw( ctx ) {
		if (!this.isAlive) return;

        this.move( GAME.frameTime );
        let pos = this.pos;
        let size = this.size;

        // Draw the player model
        ctx.fillStyle = 'rgba( 255, 0, 0, 1 )';
        ctx.beginPath();
        ctx.rect( pos.x, pos.y, size.width, size.height );
        ctx.closePath();
        ctx.fill();

        // Draw the debug aim line
        // var cpos = this.centerPos;

        // ctx.fillStyle = 'rgba( 255, 255, 0, 1 )';
        // ctx.beginPath();
        // ctx.moveTo( cpos.x, cpos.y );
        // ctx.lineTo( this.aimAt.x, this.aimAt.y );
        // ctx.closePath();
        // ctx.stroke();
    }

	//
	// Printing player to the console 'Player [id] name'
	//
	toString() {
		return 'Player [${this.id}] ${this.name}';
	}

}
