var Event = {};

// Sent when a robot hits the wall
// Data: tank -- tank ID
Event.hitWall = 'hitWall';

// Sent when a tank hits another tank
// Data: tank -- tank ID, otherTank -- victim ID
Event.hitTank = 'hitTank';

// Sent when a tank hits a bullet (or, well, vice versa)
// Data: tank -- tank ID, sourceTank -- bullet source ID, (x, y) -- position of the hit
Event.hitBullet = 'hitBullet';

module.exports = Event;