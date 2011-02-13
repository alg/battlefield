Battlefield
===========

The idea behind this project is to make the battlefield server run on Node.js
and let the tanks themselves be controlled by the client-side JavaScript.
Server transmits complete battlefield status with tanks and bullets positions
for you to decide on the strategy and the next move. The status is transmitted
every 30ms and you can update your logic as quickly as you like. Controlling
JavaScript can send commands to the tank on the server at any moment to adjust
the course line (turn body CW / CCW, move forward, backward or stop, and fire
the gun), so you are free to make choices.

You can utilize whatever computational power you can lay your hands on. Whether
it's your laptop or 20-server EC2 cloud to get to the victory.

Rules
-----

The set of rules is approximate and will change:

- You can connect to the battlefield and observe at any moment
- You can join the battlefield as a player only before the game starts
- Every tank is placed randomly on the grid of the battlefield
- Every tank has 100 points of energy in the beginning
- When the energy is gone to zero, you can no longer fire
- If you get a bullet with zero energy, you are dead
- Every bullet fired costs 1 point of energy
- Every bullet hit takes 2 points of energy
- Every collision with the wall takes 1 point of energy
- Every collision with another tank takes 1 point of energy from both
- The game lasts until the last one standing

Installation and use
--------------------

There's no lengthy installation. At a present stage, you need a Node.js server
and a browser with WebSocket support. Webkit-based browsers (Safari or Chrome)
should be fine.

To run the server:

    $ node server.js

To run the server with auto-restarts on code change (for development):

    $ node run_dev_server.js

Once the server is running, connect to http://localhost:8000/ and you should see
a battle field with your tank. The game is not running yet. To run the game,
either open http://localhost:8000/start in another window or call "app.go()".

From this moment, you can start issuing commands, for example:

    app.command({ move: 1, turn: -1, turnTurret: 1, fire: 1 })

You can have any combination of these depending on what you need.

* _move_ makes the tank move (1) forward, (-1) backward or (0) stop
* _turn_ makes the tank turn (1) counter-clockwise, (-1) clockwise or (0) stop turning
* _turnTurret_ turns the turret
* _fire_ with any argument makes it fire in the direction of the turret

Note: at this stage I wasn't working on the client-side API. I expect it to be as
friendly as the following soon:

    function MyTank() {
      this.tankStatuses = {};
      this.bulletStatuses = {};
  
      this.addStatusListener(function(battlefieldStatus) {
        this.tankStatuses = battlefieldStatus.tanks;
        this.bulletStatuses = battlefieldStatus.bullets;
    
        // ...
      });
  
      // to command your tank
      this.command({ turn: 1, move: -1, turnTurret: -1, fire: true });
    }

    // Inherit everything from the BasicTank
    MyTank.prototype = new BasicTank();

Contributions
-------------

Fork, branch, fix or implement, make a pull request. As simple as this.

Here's what I plan:

*Server side:*

* Collision detection between tanks
* Collision detection between tanks and walls
* Game scoreboard
* Accounts and Twitter OAuth
* Uploading of the control scripts to accounts
* Leaderboard with community scores


*Client side:*

* Tank control API
* Sample bots

