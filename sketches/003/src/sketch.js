// https://twitter.com/manoloidee?s=09
import paper from 'paper'; // to be globally declared
import cconvert from 'color-convert';
import "babel-polyfill";
import seedrandom from 'seedrandom';
//seedrandom('seed3', { global: true }); // override Math.Random
seedrandom('seed' + Math.random(), { global: true }); // override Math.Random

//import createShapes from './shapes';
//const shapes = createShapes({
  //cconvert: cconvert
//});

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


window.onload = function() {
  paper.setup(canvas);
  console.log('colors: ', colors);
  let ogPt = new Point(0, canvas.height / 2);

  let a = new Point(0, 0);
  let b = new Point(1, -0.577);
  let c = new Point(0, -1.14);
  let d = new Point(-1, -0.577);

  let basePath = new Path([a, b, c, d, a]);
  //basePath.strokeWeight = 2;
  //basePath.strokeColor = 'black';
  basePath.scale(100, a);
  basePath.translate(ogPt);
  console.log('basePath: ', basePath);
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
      //let idTxt = new PointText({
        //point: rowRec.bounds.center,
        //content: `${i}, ${j}`,
        //fillColor: 'black',
        //fontSize: 12
      //});
    }
    //let idTxt = new PointText({
      //point: colRec.bounds.center,
      //content: i,
      //fillColor: 'black',
      //fontSize: 12
    //});
    return row;
  });

  recs = recs.reduce((carry, row) => {
    return carry.concat(row);
  }, []);


  recs = recs.map(rec => {
    let color = colors[Math.floor(Math.random() * Math.floor(3))];
    return isoPlatform (rec, color);
  });
  //recs.forEach((rec, i) => {
    //let idTxt = new PointText({
      //point: rec.bounds.center,
      //content: i,
      //fillColor: 'black',
      //fontSize: 12
    //});
  //});

  //let offset = 0;
  //document.addEventListener('keydown', (e) => {
    //console.log('e.key: ', e.key);
    //if(e.key !== 'h' && e.key !== 'j') return;
    //let speed = 5;
    //recs.forEach(rec => {
      //rec.translate(new Point(0, (e.key == 'h' ? speed : speed * -1)));
    //});
    //paper.view.draw();
  //});


  paper.view.onFrame = (e) => {
    //if(e.count % 60  === 0) {
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

let val = randomSelect([
  {val: '49%', chance: .49},
  {val: '25%', chance: .25},
  {val: '26%', chance: .26}
]);
console.log('val: ', val);
