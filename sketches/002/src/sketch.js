import paper from 'paper';
import cconvert from 'color-convert';

// setup paper.js
paper.install(window);
const canvas = document.querySelector('canvas');

window.onload = function() {
  paper.setup(canvas);

  /*
   * IsoCube Class
   * param{x} int x cord in pixels
   * prama{y} int y cord in pixels
   * prama{color} hex color
   */
  function IsoCube (x, y, size, color) {
    // def colors
    let colorHsl = cconvert.hex.hsl(color);
    let topColor = '#' + cconvert.hsl.hex(colorHsl[0], colorHsl[1], colorHsl[2] != 100 ? colorHsl[2] + 5 : 100);
    let rightColor = color;
    let leftColor = '#' + cconvert.hsl.hex(colorHsl[0], colorHsl[1], colorHsl[2] != 0 ? colorHsl[2] - 5 : 0);

    // def points
    let a = new Point(0, 0);
    let b = new Point(1, -.577);
    let c = new Point(0, -.577 * 2);
    let d = new Point(-1, -.577);
    let ogBotPts = [a,b,c,d];
    let ogTopPts = ogBotPts.map(pt => new Point(pt.x, pt.y - 1.145));
    let botPts = ogBotPts.map(scalePts);
    let topPts = ogTopPts.map(scalePts);
    function scalePts (pt) {
      pt.x = Math.round(pt.x * size);
      pt.y = Math.round(pt.y * size);
      return pt;
    };

    console.log('topPts: ', topPts);

    // draw IsoCube to screen
    this.draw = function () {
      let left = drawSide([botPts[0], botPts[3], topPts[3], topPts[0]], leftColor);
      let right = drawSide([botPts[0], botPts[1], topPts[1], topPts[0]], rightColor);
      let top = drawSide(topPts, topColor);
      let cube = new Group([left, right, top]);
      cube.translate(new Point(x, y));
      return cube;
    }
    function drawSide (pts, color) {
      var path = new Path();
      path.fillColor = color;
      path.strokeColor = color;
      path.strokeWidth = 1;
      path.add(pts[0]);
      path.add(pts[1]);
      path.add(pts[2]);
      path.add(pts[3]);
      return path;
    }
  }

  let colors = {
    0: '#FFD500',
    1: '#A1F600',
    2: '#8C02D2',
    3: '#FFFFFF',
    bg: '#69029D'
  };

  let bg = new Path.Rectangle(0, 0, canvas.width, canvas.height);
  bg.fillColor = colors.bg;

  let testCubes = [
    new IsoCube(canvas.width / 2, 100, 10, colors[0]),
    new IsoCube(canvas.width / 2, 175, 10, colors[1]),
    new IsoCube(canvas.width / 2, 250, 10, colors[2]),
    new IsoCube(canvas.width / 2, 325, 10, colors[3]),
  ];
  testCubes.reverse();
  testCubes.forEach(cube => cube.draw());

  // Draw the view now:
  paper.view.draw();
}
