// https://twitter.com/manoloidee?s=09
import paper from 'paper'; // to be globally declared
import cconvert from 'color-convert';
import "babel-polyfill";
import seedrandom from 'seedrandom';
let seed = 'seed_' + Math.round(Math.random() * 10000000);
//let seed = 'seed_2525747';
console.log(seed);
seedrandom(seed, { global: true }); // override Math.Random


// setup paper.js
paper.install(window);
const canvas = document.querySelector('canvas');

// colors
// http://paletton.com/#uid=31b1f0kMoI2nuMguhM2MFsyN-mb
let colors = {
  0: '#FFBF00',
  1: '#28E600',
  2: '#E50070',
  3: '#FFFFFF',
  bg0: '#E3AA00',
  bg1: '#21BE00',
  bg2: '#BC005C',
  bg3: '#FFFFFF'
};

for (var key in colors) {
  let colorHsl = cconvert.hex.hsl(colors[key]);
  colors[colors[key]] = {
    full: colors[key],
    light: '#' + cconvert.hsl.hex(colorHsl[0], colorHsl[1], colorHsl[2] != 100 ? colorHsl[2] + 5 : 100),
    dark: '#' + cconvert.hsl.hex(colorHsl[0], colorHsl[1], colorHsl[2] != 0 ? colorHsl[2] - 5 : 0)
  }
}

// when DOM loads
window.onload = function() {
  paper.setup(canvas);
  let ogPt = new Point(0, canvas.height / 2);

  // grid setup
  let a = new Point(0, 0);
  let b = new Point(1, -0.577);
  let c = new Point(0, -1.14);
  let d = new Point(-1, -0.577);
  let basePath = new Path([a, b, c, d, a]);
  //basePath.strokeWeight = 2;
  //basePath.strokeColor = 'black';
  basePath.scale(100, a);
  basePath.translate(ogPt);
  //console.log('basePath: ', basePath);
  let colRecs = [];
  for (var j = 0, colCount = 100; j < colCount; j++) {
    let colRec = basePath.clone();
    colRec.translate(new Point(0, ogPt.y - (basePath.bounds.height * j)));
    colRecs.push(colRec);
  }
  colRecs.reverse();
  let recs = colRecs.map((colRec, i) => {
    let row = [];
    for (var j = 0, rowCount = 10; j < rowCount; j++) {
      let rowRec = colRec.clone();
      //rowRec.translate(new Point(0, ogPt.y - (basePath.bounds.height * j)));
      rowRec.translate(new Point((basePath.segments[0].point.x - basePath.segments[1].point.x) * j * -1, (basePath.segments[0].point.y - basePath.segments[1].point.y) * j));
      row.push(rowRec);
    }
    return row;
  });
  recs = recs.reduce((carry, row) => {
    return carry.concat(row);
  }, []);
  recs = recs.map(rec => {
    let color = colors[Math.floor(Math.random() * Math.floor(3))];

    let type = randomSelect([
      {val: 'none', chance: .70},
      {val: 'hole', chance: .10},
      {val: 'spill', chance: .20}
    ]);
    let platfrom = isoPlatform (rec, color);
    if(type === 'hole') return new Group(platfrom, isoHole(platfrom, color));
    else if(type === 'spill') return new Group(platfrom, isoSpill(platfrom, color));
    return platfrom;
  });
  //recs.forEach((rec, i) => {
    //let idTxt = new PointText({
      //point: rec.bounds.center,
      //content: i,
      //fillColor: 'black',
      //fontSize: 12
    //});
  //});

  paper.view.onFrame = (e) => {
    //project.clear();
    let speed = 5;
    if(e.count % 2 === 0) {
      recs.forEach(rec => {
        rec.translate(new Point(0, speed));
      });
    }
  };

  // Draw the view now:
  paper.view.draw();
}

function isoSpill (platfrom, color) {
  let center = platfrom.children[0].bounds.center;
  let rec = platfrom.children[0];
  let a = rec.segments[0].point;
  let b = rec.segments[1].point;
  let c = rec.segments[2].point;
  let d = rec.segments[3].point;
  let w = b.x - d.x;
  let h = a.y - c.y;
  let s = w / h;

  let gapX = Math.abs((d.x - b.x) / 15);
  let gapY = Math.abs((a.y - c.y) / 15);
  //let ap = new Point(a.x, a.y - gapY);
  //let bp = new Point(b.x - gapX, b.y);
  //let cp = new Point(c.x, c.y + gapY);
  //let dp = new Point(d.x + gapX, d.y);
  // spill
  var decagon = new Path.RegularPolygon(center, 10, 50);
  decagon.scale(s, 1, a);
  decagon.scale(.60, center);
  let randomPts = decagon.segments.map(pt => {
    let line = new Path([center, pt]);
    let random = Math.floor(Math.random() * (100 - 75 + 1)) + 75;
    let newPt = line.getPointAt((line.length / 100) * random);
    return newPt;
  });
  let spill = new Path(randomPts);
  spill.closed = true;
  spill.smooth({ type: 'catmull-rom', factor: 0.5 });
  let randomColor = colors[Math.floor(Math.random() * Math.floor(3))];
  while(randomColor === color){
    randomColor = colors[Math.floor(Math.random() * Math.floor(3))];
  }
  spill.fillColor = colors[randomColor].dark;

  //console.log('b.x - d.x: ', b.x - d.x);
  //console.log('spill.bounds.width: ', spill.bounds.width);
  if(spill.bounds.width > b.x - d.x) {
    spill.remove();
  }
  // can
  let halfPt = path => path.getPointAt(path.length / 2);
  let axis1 = new Path([
    halfPt(new Path([a,d])),
    halfPt(new Path([b,c]))
  ]);
  let axis2 = new Path([
    halfPt(new Path([a,b])),
    halfPt(new Path([d,c]))
  ]);
  //axis1.selected = true;
  //axis2.selected = true;

  let botPt = axis1.getPointAt((axis1.length / 100) * 33)
  let topPt = axis1.getPointAt((axis1.length / 100) * 66)
  let canBody = new Path([
    new Point(botPt.x, botPt.y + gapY * 2),
    new Point(botPt.x, botPt.y - gapY * 2),
    new Point(topPt.x, topPt.y - gapY * 2),
    new Point(topPt.x, topPt.y + gapY * 2)
  ]);
  canBody.clone = true;
  //canBody.selected = true;
  canBody.fillColor = colors[randomColor].full;

  //let cap = new Path.Circle(new Point(canBody.segments[0].point.x, canBody.segments[0].point.y - gapY / 2), gapY * 2);
  let cap1 = new Path.Circle(new Point(canBody.segments[0].point.x, canBody.segments[0].point.y - gapY * 2), gapY * 1.55 );
  if(Math.random() > .5) {
    cap1.fillColor = new Color({
      gradient: {
        stops: [colors[randomColor].full, colors[randomColor].dark]
      },
      destination: new Point(cap1.bounds.center.x - (cap1.bounds.width / 2), cap1.bounds.center.y - (cap1.bounds.height / 2)),
      origin: new Point(cap1.bounds.center.x + (cap1.bounds.width / 2), cap1.bounds.center.y + (cap1.bounds.height / 2))
    });
    cap1.strokeColor = colors[randomColor].light;
  } else {
    cap1.fillColor = colors[randomColor].full;
  }

  //let cap2 = new Path.Circle(new Point(canBody.segments[3].point.x, canBody.segments[3].point.y - gapY * 2), gapY - 1.75 );
  let cap2 = new Path.Circle(new Point(canBody.segments[3].point.x, canBody.segments[3].point.y - gapY * 2), gapY * 1.75 );
  cap2.fillColor = colors[randomColor].full;
  let can = new Group([canBody, cap1, cap2]);


  if(Math.random() > .5) {
    can.scale(-1, 1, can.bounds.center);
  }

  can.scale(1, 1.05, can.bounds.center);
  can.scale(.75, can.bounds.center);
  //can.scale(.60, center);
  //cap2.strokeColor = colors[randomColor].light;
  //cap.selected = true;
  return new Group([spill, can]);
}

function isoHole (platfrom, color) {
  let rec = platfrom.children[0];
  let a = rec.segments[0].point;
  let b = rec.segments[1].point;
  let c = rec.segments[2].point;
  let d = rec.segments[3].point;
  let gapX = Math.abs((d.x - b.x) / 15);
  let gapY = Math.abs((a.y - c.y) / 15);
  let ap = new Point(a.x, a.y - gapY);
  let bp = new Point(b.x - gapX, b.y);
  let cp = new Point(c.x, c.y + gapY);
  let dp = new Point(d.x + gapX, d.y);
  let holeRight = new Path([ap, bp, cp, ap]);
  holeRight.fillColor = colors[color].dark;
  let holeLeft = new Path([ap, dp, cp, ap]);
  holeLeft.fillColor = colors[color].full;
  let holeOutLine = new Path([ap, bp, cp, dp, ap]);
  //holeOutLine.strokeColor = 'black';
  return new Group([holeOutLine, holeRight, holeLeft]);
}

function isoPlatform (rec, color) {
  let a = rec.segments[0].point;
  let b = rec.segments[1].point;
  let c = rec.segments[2].point;
  let d = rec.segments[3].point;
  let gapX = Math.abs((d.x - b.x) / 20);
  let gapY = Math.abs((a.y - c.y) / 20);
  let ap = new Point(a.x, a.y - gapY);
  let bp = new Point(b.x - gapX, b.y);
  let cp = new Point(c.x, c.y + gapY);
  let dp = new Point(d.x + gapX, d.y);

  let platfromTop = new Path([ap, bp, cp, dp, ap]);
  platfromTop.translate(new Point(0, gapY * -2.5));
  //platfromTop.strokeWeight = 2;
  //platfromTop.strokeColor = 'black';
  platfromTop.fillColor = colors[color].light;

  let platfromRight = new Path([a, platfromTop.segments[0].point, platfromTop.segments[1].point, b, a]);
  //platfromRight.translate(new Point(0, gapY * -2.5));
  //platfromRight.strokeWeight = 2;
  //platfromRight.strokeColor = 'black';
  platfromRight.fillColor = colors[color].full;

  let platfromLeft = new Path([a, platfromTop.segments[0].point, platfromTop.segments[3].point, d, a]);
  //platfromRight.translate(new Point(0, gapY * -2.5));
  //platfromLeft.strokeWeight = 2;
  //platfromLeft.strokeColor = 'black';
  platfromLeft.fillColor = colors[color].dark;

  return new Group([platfromTop, platfromRight, platfromLeft]);
}


/*
 * random return an option from objects provided
 * prama{Array[Obj]}
 *
 */
function randomSelect (options) {
  let totalChance = options.reduce((total, option) => {
    total += option.chance;
    return total;
  }, 0);
  if(totalChance !== 1) throw 'randomSelect chances dont add up to 1';
  let r  = Math.random();
  let ranges = options.reduce((carry, option) => {
    carry.ranges.push({
      min: carry.total,
      max: option.chance + carry.total
    });
    carry.total += option.chance;
    return carry;
  }, {total: 0, ranges: []});
  let selected = ranges.ranges.reduce((sel, range, i) => {
    if(sel === false && range.min < r && range.max > r) return options[i];
    return sel;
  }, false);
  return selected.val;
}

