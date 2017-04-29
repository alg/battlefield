var sys = require('sys');

var Placement = function(bfWidth, bfHeight, cellW, cellH) {
  var self = this;
  
  var unusedCells = [];
  var numCellHorizontal = bfWidth / cellW - 1;
  var numCellVertical   = bfHeight / cellH - 1;

  // Resets the placement to start a new round
  self.reset = () => {
    var totalCells = numCellHorizontal * numCellVertical;
    for (var i = 0; i < totalCells; i++) unusedCells.push(i);
    unusedCells.sort(() => 0.5 - Math.random());
  }
  
  self.reserveCell = () => {
    var cell = unusedCells.pop();
    
    if (typeof cell == 'undefined') return null;

    return { x: (cell % numCellHorizontal + 1) * cellW, y: (parseInt(cell / numCellHorizontal) + 1) * cellH };
  }
  
  self.reset();
}

module.exports = Placement;