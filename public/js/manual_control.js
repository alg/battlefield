function ManualControl(app){
  var BTN_LEFT  = 65;
  var BTN_UP    = 87;
  var BTN_RIGHT = 68;
  var BTN_DOWN  = 83;
  var BTN_SPACE = 32;
  this.command = { move: 0, turn: 0, fire: 0 }

  this.move_ahead = function(){
    this.command.move = this.command.move < 0 ? 0 : 1;
    app.command(this.command);
  }

  this.move_back = function(){
    this.command.move = this.commandmove > 0 ? 0 : -1;
    app.command(this.command);
  }

  this.stop_move = function(){
    this.command.move = 0
    app.command(this.command)
  }

  this.stop_turn = function(){
    this.command.turn = 0
    app.command(this.command)
  }

  this.turn_left = function(){
    this.command.turn = this.command.move < 0 ? 1 : -1;
    app.command(this.command)
  }

  this.turn_right = function(){
    this.command.turn = this.command.move >= 0 ? 1 : -1;
    app.command(this.command)
  }

  this.fire = function(){
    app.command({fire: 1})
  }

  var control = this;

  $(document).keydown(function(event){
    switch(event.which){
      case BTN_UP:    control.move_ahead(); break;
      case BTN_DOWN:  control.move_back(); break;
      case BTN_LEFT:  control.turn_left(); break;
      case BTN_RIGHT: control.turn_right(); break;
      case BTN_SPACE: control.fire(); break;
    }
  })


  $(document).keyup(function(event){
    switch(event.which){
      case BTN_UP:    
      case BTN_DOWN:  
        control.stop_move();
      break;

      case BTN_LEFT:
      case BTN_RIGHT: 
        control.stop_turn(); 
      break;
    }
  })

  $(document).click(function(){ control.fire() })
}
