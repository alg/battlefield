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
- Every bullet fired costs 0.1 to 3 points of energy (you decide)
- The more energy a bullet has, the faster it moves and the more energy it will take
- Every bullet hit takes 4 times the energy plus 2 times the energy above 1
- Every collision with the wall takes energy. The exact amount depends on velocity
- Every collision with another tank takes 0.6 points of energy from both
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

From this moment, you can start issuing commands:

    turnLeft(deg)
    turnRight(deg)
    turnGunLeft(deg)
    turnGunRight(deg)
    move(distance)
    fire(power)

You can have any combination of these depending on what you need.

Contributions
-------------

Fork, branch, fix or implement, make a pull request. As simple as this.

Here's what I plan:

*Server side (Rails):*

* Game scoreboard
* Accounts and Twitter OAuth
* Uploading of the control scripts to accounts
* Leaderboard with community scores


*Client side:*

* Tank control API
* Sample bots

