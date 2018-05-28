import "babel-polyfill";
import seedrandom from 'seedrandom';
import weighted from 'weighted';
import genColors from './colors';
import genUtil from './utils';

var seed, canvas, ctx, colors, util;
var chars = {
  fwdslash: {
    code: '\u{2571}',
    start: 'topRight',
    end: 'botLeft'
  },
  backslash: {
    code: '\u{2572}',
    start: 'topLeft',
    end: 'botRight'
  },
  vertline: {
    code: '\u{2502}',
    start: 'topRight',
    end: 'botMiddle'
  },
  horzlineRight: {
    code: '\u{2500}',
    start: 'topLeft',
    end: 'topRight'
  },
  horzlineLeft: {
    code: '\u{2500}',
    start: 'topRight',
    end: 'topLeft'
  }
};


function init() {
  // seed
  seed = 'seed_' + Math.round(Math.random() * 10000000); // random every load
  //seed = 'seed_2525747'; // set seed
  seedrandom(seed, { global: true }); // override Math.Random
  // canvas selection
  canvas = document.querySelector('canvas');
  // resolution fix
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  // canvas setup
  ctx = canvas.getContext('2d');
  ctx.font = '18px serif';
  // util
  util = new genUtil({
    canvas: canvas,
    ctx: ctx
  });

  // colors
  colors = new genColors({ // http://paletton.com/#uid=31b1f0kMoI2nuMguhM2MFsyN-mb
    0: '#FFBF00',
    1: '#28E600',
    2: '#E50070',
    3: '#FFFFFF',
    bg0: '#E3AA00',
    bg1: '#21BE00',
    bg2: '#BC005C',
    bg3: '#FFFFFF'
  });
  // determin pts
  for (let key in chars) {
    console.log('key: ', key);
    ctx.fillText(chars[key].code, 100, 100);
    chars[key].ancors = util.findAncors(); // find ancors
    // offset ancors
    for (let ancorKey in chars[key].ancors) {
      util.mark(chars[key].ancors.topLeft, 'red');
      let pt = chars[key].ancors[ancorKey];
      chars[key].ancors[ancorKey][0] = pt[0] - 100;
      chars[key].ancors[ancorKey][1] = pt[1] - 100;
    }
    console.log('chars[key]: ', chars[key]);
    //break;
    util.clear();
  }
}


let lineKeys = ['vertline','vertline','vertline', 'fwdslash'];
function draw() {
  //draw line
  //var line = [];
  let endpt = [canvas.width / 2, 0];
  util.mark(endpt, 'green');
  for (var i = 0, len = lineKeys.length; i < len; i++) {
    //if (i > 0) var ancorPt = line[i - 1].endPt;
    //else var ancorPt = [canvas.width / 2, canvas.height / 2];
    let currentChar = chars[lineKeys[i]];
    let startAncor = currentChar.ancors[currentChar.start];
    let startPt = [endpt[0] - startAncor[0], endpt[1] - startAncor[1]];
    ctx.fillText(currentChar.code, startPt[0], startPt[1]);
    let endAncor = currentChar.ancors[currentChar.end];
    endpt = [startPt[0] + endAncor[0], startPt[1] + endAncor[1]];
    //util.mark(endpt, 'red');
  };
}

var fps = 8;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;
var lastOption = '';
function update() {
    requestAnimationFrame(update);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
      then = now - (delta % interval);
      var options = {
        'horzlineRight': 0.16,
        'horzlineLeft': 0.16,
        'fwdslash': 0.22,
        'vertline': 0.22,
        'backslash': 0.22
      };
      if (lastOption === 'horzlineRight') {
        options.horzlineRight = 0.5;
        options.horzlineLeft = 0;
      } else if (lastOption === 'horzlineLeft') {
        options.horzlineRight = 0;
        options.horzlineLeft = 0.5;
      }
      let selectedOption = weighted.select(options);
      lastOption = selectedOption;
      lineKeys.unshift(selectedOption);
      //lineKeys.push(weighted.select(options));
      //let line = draw(lineKeys, ogPt);
      util.clear();
      draw();
      //window.requestAnimationFrame(update);
    }
}

// when DOM loads
window.onload = () => {
  init();
  draw();
  update();
}



