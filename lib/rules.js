var Rules = function() { };

// Tank dimensions
Rules.tankWidth  = 40;
Rules.tankHeight = 40;

// The acceleration of a robot, i.e. the increase of velocity when the
// robot moves forward (1 pixel / turn).
Rules.acceleration = 1;

// The deceleration of a robot, i.e. the decrease of velocity when the
// robot moves backwards (or brakes) (2 pixels / turn).
Rules.deceleration = 2;

// The maximum velocity of a robot (8 pixels / turn).
Rules.maxVelocity = 8;

// The minimum bullet power, i.e. the amount of energy required for firing.
Rules.minBulletPower = 0.1;

// The maximum bullet power, i.e. the maximum amount of energy that can be
// transferred to a bullet when it's fired (3 energy points).
Rules.maxBulletPower = 3;

// The max turning rate of the tank, in degrees (10 deg / turn).
// NOTE: the actual turn rate depends on the velovity.
// See Rules.turnRate(velocity)
Rules.maxTurnRate = 10;

// The max gun turning rate of the tank in degrees (20 deg / turn).
Rules.gunTurnRate = 20;


// Energy taken when a tank hits or is hit by another tank.
Rules.robotHitDamage = 0.6;

// Bonus energy given when a tank moving forward hits an opponent (ramming). 
Rules.robotHitBonus = 1.2;

// Returns the turn rate depending on the current velocity.
Rules.turnRate = function(velocity) {
  return Rules.maxTurnRate - 0.75 * velocity;
}

// Energy taken when a tank hits a wall with a specific velocity.
Rules.wallHitDamage = function(velocity) {
  return Math.max(Math.abs(velocity) / 2 - 1, 0);
}

// Damage of a bullet at a specific power.
Rules.bulletDamage = function(bulletPower) {
  var damage = 4 * bulletPower;
  
  if (bulletPower > 1) damage += 2 * (bulletPower - 1);
  
  return damage;
}

// Bonus awarded for hitting someone with a bullet at a specific power.
Rules.bulletHitBonus = function(bulletPower) {
  return 3 * bulletPower;
}

// Speed of a bullet depending on its power.
Rules.bulletSpeed = function(bulletPower) {
  return 20 - 3 * bulletPower;
}

module.exports = Rules;
