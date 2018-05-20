import paper from 'paper'; // to be globally declared
import cconvert from 'color-convert';
import "babel-polyfill";
import seedrandom from 'seedrandom';
import weighted from 'weighted';
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

let chars = {
  fwdslash: {
    code: '\u{2571}',
    start: [0, 3],
    end: [-11, 20]
  },
  backslash: {
    code: '\u{2572}',
    start: [11, 3],
    end: [10, 20]
  },
  vertline: {
    code: '\u{2502}',
    start: [5, 5],
    end: [0, 20]
  },
  horzlineRight: {
    code: '\u{2500}',
    start: [0, -5],
    end: [-13, 0]
  },
  horzlineLeft: {
    code: '\u{2500}',
    start: [13, -5],
    end: [13, 0]
  }
};

function draw (keys, pt) {
  let line = [];
  //let pt1 = new Point(200,200);
  for (var i = 0, len = keys.length; i < len; i++) {
    if (i > 0) var ancorPt = line[i - 1].endPt;
    else var ancorPt = pt;
    let info = chars[keys[i]];
    //let ancorDebug = new Path.RegularPolygon(ancorPt, 4, 3);
    //ancorDebug.strokeColor = 'green';
    let startPt = new Point(ancorPt.x - info.start[0], ancorPt.y - info.start[1]);
    //let startDebug = new Path.RegularPolygon(startPt, 4, 3);
    //startDebug.strokeColor = 'red';
    let endPt = new Point(ancorPt.x - info.end[0], ancorPt.y - info.end[1]);
    //let endDebug = new Path.RegularPolygon(endPt, 4, 3);
    //endDebug.strokeColor = 'blue';

    let symb = new PointText({
      point: startPt,
      content: info.code,
      fillColor: 'black',
      fontSize: 18
    });
    line.push({
      endPt: endPt,
      symb: symb
    });
  };
  let lastPt = line[line.length - 1].endPt;
  let offset = new Point(pt.x - lastPt.x, pt.y - lastPt.y);
  line.forEach(seg => {
    seg.symb.translate(offset);
  });
  return line;
}
// when DOM loads
window.onload = function() {
  paper.setup(canvas);
  //let ogPt = new Point(0, canvas.height / 2);
  //let ogPt = new Point(canvas.width / 2, canvas.height / 2);
  let ogPt = new Point(canvas.width / 2, canvas.height / 8);
  //https://yuanchuan.name/2018/05/06/unicode-patterns.html
  //https://www.obliquity.com/computer/html/unicode2500.html

  let lineKeys = [];
  //let lineKeys = [ 'vertline', 'horzlineLeft', 'vertline', 'horzlineRight', 'fwdslash', 'horzlineRight', 'vertline', 'horzlineLeft', 'fwdslash', 'backslash', 'horzlineLeft', 'vertline', 'horzlineRight', 'backslash', 'backslash', 'horzlineLeft', 'vertline',  'horzlineLeft', 'horzlineLeft', 'vertline', 'vertline', 'vertline','vertline', 'vertline','vertline',];
  //let line = draw(lineKeys, ogPt);
  //line = draw(lineKeys, (ogPt - line[line.length - 1].endPt));




  paper.view.onFrame = (e) => {
    //let speed = 5;
    if(e.count % 8 === 0) {
      //project.clear();
      var options = {
        'horzlineRight': 0.16,
        'horzlineLeft': 0.16,
        'fwdslash': 0.22,
        'vertline': 0.22,
        'backslash': 0.22
      };
      if (lineKeys[lineKeys.length - 1] === 'horzlineRight') {
        options.horzlineRight = 0.5;
        options.horzlineLeft = 0;
      } else if (lineKeys[lineKeys.length - 1] === 'horzlineLeft') {
        options.horzlineRight = 0;
        options.horzlineLeft = 0.5;
      }
      lineKeys.push(weighted.select(options));
      let line = draw(lineKeys, ogPt);
    }
  };

  // Draw the view now:
  paper.view.draw();
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

