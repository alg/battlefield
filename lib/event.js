var Event = {};

// Sent when a robot hits the wall
// Data: tank -- tank ID
Event.hitWall = 'hitWall';

// Sent when a tank hits another tank
// Data: tank -- tank ID, otherTank -- victim ID
Event.hitTank = 'hitTank';

module.exports = Event;