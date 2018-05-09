export default (services) => {
  /*
   * IsoCube Class
   * param{x} int x cord in pixels
   * prama{y} int y cord in pixels
   * prama{color} hex color
   */
  function IsoCube (x, y, size, color) {
    // def colors
    let colorHsl = services.cconvert.hex.hsl(color);
    console.log('color: ', color);
    console.log('colorHsl: ', colorHsl);
    let topColor = '#' + services.cconvert.hsl.hex(colorHsl[0], colorHsl[1], colorHsl[2] != 100 ? colorHsl[2] + 5 : 100);
    let rightColor = color;
    let leftColor = '#' + services.cconvert.hsl.hex(colorHsl[0], colorHsl[1], colorHsl[2] != 0 ? colorHsl[2] - 5 : 0);

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

  /*
   * IsoCage Class
   * param{x} int x cord in pixels
   * prama{y} int y cord in pixels
   * prama{color} hex color
   */

  function IsoCage (x, y, size, color, cubeCount) {
    // def points
    let ogBotPts = {
      a: new Point(0, 0),
      b: new Point(1.15, -.663),
      c: new Point(0, -.663 * 2),
      d: new Point(-1.15, -.663)
    };
    let ogTopPts = {};
    for (var key in ogBotPts) { // create the top ring of pts by moving the botpts up the page via subtracting from their y vals
      ogTopPts[key + 'p'] = new Point(ogBotPts[key].x, ogBotPts[key].y - 5.33);
    }
    let ogPts = Object.assign({}, ogBotPts, ogTopPts);
    let pts = {};
    for (var key in ogPts) {
      let pt = ogPts[key];
      pt.x = Math.round(pt.x * size);
      pt.y = Math.round(pt.y * size);
      pts[key] = pt;
    }
    function scalePts (pt) {
      pt.x = Math.round(pt.x * size);
      pt.y = Math.round(pt.y * size);
      return pt;
    };

    // draw IsoCage to screen
    this.drawBg = () => {
      let cageBack = new Group([
        drawLine([pts.b, pts.c, pts.d]),
        drawLine([pts.bp, pts.cp, pts.dp]),
        drawLine([pts.c, pts.cp])
      ]);
      cageBack.translate(new Point(x, y));
      return cageBack;
    };

    this.drawFg = () => {
      let cageFront = new Group([
        drawLine([pts.a, pts.b, pts.bp, pts.cp, pts.dp, pts.d, pts.a]),
        drawLine([pts.a, pts.ap]),
        drawLine([pts.dp, pts.ap, pts.bp]),
      ]);

      let rightSideSupports = [];
      //let rightSideSupports = [support, support2, support3, support4];
      if (cubeCount > 0) {
        var support = drawLine([
          new Point(pts.b.x - (.15 * size), pts.b.y - ((1.145 + .15) * size)),
          new Point(pts.b.x, pts.b.y - ((.15 + 1.145) * size)),
          new Point(pts.b.x - (.15 * size), pts.b.y - ((1.145) * size))
        ]);
        rightSideSupports.push(support);
      }
      if (cubeCount > 1) {
        var support2 = support.clone();
        support2.translate(new Point(0, (1.145 + .15) * size * -1));
        rightSideSupports.push(support2);
      }
      if (cubeCount > 2) {
        var support3 = support2.clone();
        support2.translate(new Point(0, (1.145 + .15) * size * -1));
        rightSideSupports.push(support3);
      }
      if (cubeCount > 3) {
        var support4 = drawLine([
          pts.bp,
          new Point(pts.b.x - (.15 * size), pts.bp.y + (.3 * size))
        ]);
        rightSideSupports.push(support4);
      }

      let leftSideSupports = rightSideSupports.map(x => {
        let y = x.clone();
        y.scale(-1, 1);
        y.translate(new Point(-2.15 * size, 0));
        return y;
      });

      if (rightSideSupports.length > 0) {
        cageFront.addChildren(rightSideSupports);
        cageFront.addChildren(leftSideSupports);
      }

      cageFront.translate(new Point(x, y));
      return cageFront;
    }

    function drawLine (pts) {
      let path = new Path();
      path.strokeColor = color;
      path.strokeWidth = 2;
      path.strokeCap = 'round';
      pts.forEach(pt => path.add(pt));
      return path;
    }

  }

  return {
    IsoCube: IsoCube,
    IsoCage: IsoCage
  };
}
