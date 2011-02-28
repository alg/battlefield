function ManualControl(app, link) {
  var self = this;
  
  var BTN_LEFT  = 65; // A
  var BTN_UP    = 87; // W
  var BTN_RIGHT = 68; // D
  var BTN_DOWN  = 83; // S
  var BTN_SPACE = 32; // space
  var BTN_Q     = 81;
  var BTN_E     = 69;
  
  var commands = { move: 0, turn: 0, fire: 0 }

  function moveAhead() { commands.move = 1; }
  function moveBack()  { commands.move = -1; }
  function stopMove()  { commands.move = 0; }
  function turnLeft()  { commands.turn = -1; }
  function turnRight() { commands.turn = 1; }
  function stopTurn()  { commands.turn = 0; }
  function fire()      { commands.fire = 1; }

  $(document).keydown(function(event) {
    switch(event.which) {
      case BTN_UP:    moveAhead(); break;
      case BTN_DOWN:  moveBack(); break;
      case BTN_LEFT:  turnLeft(); break;
      case BTN_RIGHT: turnRight(); break;
      case BTN_SPACE: fire(); break;
      case BTN_Q:     commands.turnGun = -1; break;
      case BTN_E:     commands.turnGun = 1; break;
    }
  }).keyup(function(event){
    switch(event.which){
      case BTN_UP:    
      case BTN_DOWN:  
        stopMove();
        break;

      case BTN_LEFT:
      case BTN_RIGHT: 
        stopTurn(); 
        break;
      
      case BTN_Q:
      case BTN_E:
        commands.turnGun = 0;
        break;
    }
  }).click(function() { fire() });
  
  var wasIdle = nowIdle = false;
  link.addMessageListener(function(json) {
    var move = commands.move * 8,
        turn = commands.turn * 10,
        fire = commands.fire,
        turnGun = commands.turnGun * 10;
    
    nowIdle = (move || turn || fire || turnGun) == 0;
    
    if (!nowIdle || !wasIdle) {
      app.command({ move: move, turn: turn, fire: fire, turnGun: turnGun });
      wasIdle = nowIdle;
    }
  });
}

$(function() {
  new ManualControl(app, link);
});