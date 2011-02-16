function ManualControl(app){
  var BTN_LEFT  = 97;
  var BTN_UP    = 119;
  var BTN_RIGHT = 100;
  var BTN_DOWN  = 115;
  var BTN_SPACE = 32;

  this.move_ahead = function(){
    this.move = this.move < 0 ? 0 : 1;
    app.command({move: move, turn: 0});
  }

  this.move_back = function(){
    this.move = this.move > 0 ? 0 : -1;
    app.command({move: this.move, turn: 0});
  }

  this.turn_left = function(){
    var turn = this.move < 0 ? 1 : -1;
    app.command({turn: turn})
  }

  this.turn_right = function(){
    var turn = this.move >= 0 ? 1 : -1;
    app.command({turn: turn})
  }

  this.fire = function(){
    app.command({fire: 1})
  }

  var control = this;

  $(document).keypress(function(event){
    switch(event.which){
      case BTN_UP:    control.move_ahead(); break;
      case BTN_DOWN:  control.move_back(); break;
      case BTN_LEFT:  control.turn_left(); break;
      case BTN_RIGHT: control.turn_right(); break;
      case BTN_SPACE: control.fire(); break;
    }
  })

  $(document).click(function(){ control.fire() })
}
