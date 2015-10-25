
function GunType( name, clipMax, clipCount, damage, fireRate, reloadTime, image ) {

    this.name = name;
    this.clipMax = clipMax;
    this.clipCount = clipCount;
    this.reserveAmmo = clipMax * clipCount;
    this.damage = damage;
    this.fireRate = fireRate;
    this.reloadTime = reloadTime;
    this.image = image;

}
