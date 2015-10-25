
function Gun( type ) {

    this.type = type;
    this.clip = type.clipMax;
    this.reserveAmmo = type.reserveAmmo;
    this.nextFireTime = 0;
    this.reloading = false;
    this.bullets = [];

}

Gun.prototype {

    getClipAmmo: function() {
        return this.clip;
    },

    getReserveAmmo: function() {
        return this.reserveAmmo;
    },

    fire: function() {
        if ( !this.reloading && this.nextFireTime < Date.now() ) {
            this.clip = Math.max( this.clip - 1, 0 );
            this.nextFireTime = Date.now() + this.type.fireRate;
        }
    },

    reload: function() {
        if ( !this.reloading && this.nextFireTime < Date.now() ) {
            this.reloading = true;
            this.nextFireTime = Date.now() + this.type.reloadTime;

            var missingBullets = this.type.clipMax - this.clip;

            this.clip = Math.max( missingBullets, this.reserveAmmo );
            this.reserveAmmo = Math.max( this.reserveAmmo - missingBullets, 0 );

            var gunVar = this;
            setTimeout( function() {
                gunVar.reloading = false;
            }, this.type.reloadTime );
        }
    }

}
