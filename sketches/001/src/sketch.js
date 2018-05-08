import paper from 'paper';

// Only executed our code once the DOM is ready.
paper.install(window);
window.onload = function() {
  const canvas = document.querySelector('canvas');
  paper.setup(canvas);

  let debugPath = new Path();
  debugPath.strokeColor = 'green';

  function IsoBlock () {
    let ogHeight = Math.floor(Math.random() * (400 - 100 + 1) ) + 100;
    let height = ogHeight;
    let dir = 'up';

    this.updateHeight = function() {
      if(height < ogHeight && dir === 'up') height++;
      else if(height > 100 && dir === 'down') height--;
      else if(height === ogHeight) dir = 'down';
      else if(height === 100) dir = 'up';
    };

    this.x = 0;
    this.y = 0;

    this.setCords = function(x,y) {
      this.x = x;
      this.y = y;
    };

    let a = new Point(0, 0);
    let b = new Point(a.x + 10, a.y - 5.77);
    let c = new Point(b.x - 8.29, b.y - 5);
    let d = new Point(c.x - 10, c.y + 5.77);
    let basePts = [a,b,c,d];
    basePts = basePts.map(pair => { // scale up basePts
      pair.x = pair.x * 10;
      pair.y = pair.y * 10;
      return pair;
    });
    console.log('basePts: ', basePts);

    this.draw = function () {
      let basePtsPrime = basePts.map(pt => { // copy the basePts up to create top of block
        return new Point(pt.x, pt.y - height);
      });
      let left = drawSide([basePts[0], basePts[3], basePtsPrime[3], basePtsPrime[0]], '#cccccc');
      let right = drawSide([basePts[0], basePts[1], basePtsPrime[1], basePtsPrime[0]], '#a3a3a3');
      let top = drawSide(basePtsPrime, '#eaeaea');
      let rec = new Group([left, right, top]);
      rec.translate(new Point(this.x, this.y));
    }

    function drawSide (pts, color) {
      var sidePath = new Path();
      sidePath.fillColor = color;
      sidePath.add(pts[0]);
      sidePath.add(pts[1]);
      sidePath.add(pts[2]);
      sidePath.add(pts[3]);
      return sidePath;
    }
  }

  //let ogPt = new Point(canvas.width - 100, 0);
  let ogPt = new Point(canvas.width / 2 - 100, -150);
  let row = 0;
  let col = 0;
  let isoBlocks = [];
  for (var i = 0; i < 200; i++) {
    if(i % 13  === 0) {
      row++;
      col = 0;
    }
    let pt = new Point((row * 82.89) + ogPt.x + (-100 * col), (row * 50) + ogPt.y + (57.699 * col));
    let block = new IsoBlock();
    block.setCords(pt.x, pt.y);
    //block.draw();
    isoBlocks.push(block);
    col++;
  }

  paper.view.onFrame = (e) => {
    //if(e.count % 30  === 0) {
      project.clear();
      isoBlocks.forEach(block => {
        block.updateHeight();
        block.draw();
      });
    //}
  };


    //let rec1 = new IsoBlock();
    //rec1.drawAt(canvas.width / 2, canvas.height / 2);
      //rec.translate(new Point(canvas.width / 2, canvas.height / 2));
  // Note that the plus operator on Point objects does not work
  // in JavaScript. Instead, we need to call the add() function:
  //path.lineTo(start.add([ 200, -50 ]));
  // Draw the view now:
  paper.view.draw();
}
