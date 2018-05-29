import "babel-polyfill";
import seedrandom from 'seedrandom';
import weighted from 'weighted';
import genColors from './colors';
import genUtil from './utils';

var seed, canvas, ctx, colors, util, grid;
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
      let pt = chars[key].ancors[ancorKey];
      chars[key].ancors[ancorKey][0] = pt[0] - 100;
      chars[key].ancors[ancorKey][1] = pt[1] - 100;
    }
    console.log('chars[key]: ', chars[key]);
    //break;
    util.clear();
  }

  //util.mark([100,100], 'red');
  //util.mark(util.offset([100,100], chars['fwdslash'].ancors.topRight), 'red');
  //util.mark(chars['fwdslash'].ancors.topRight, 'red');
  //util.mark(chars['fwdslash'].ancors.botRight, 'blue');
  //util.mark(chars['fwdslash'].ancors.botLeft, 'green');
  //util.mark(chars['fwdslash'].ancors.topLeft, 'yellow');
  //util.mark(chars['fwdslash'].ancors.botMiddle, 'orange');
  //util.mark(chars['fwdslash'].ancors.center, 'cyan');

  // grid setup
  let gridUnitWidth = canvas.width / 20;
  let gridWidth = canvas.width - ( gridUnitWidth * 2 );
  grid = [];
  for (var i = 0; i < 10; i++) {
    let y = (gridWidth / 10) + (i * (gridWidth / 10));
    for (var j = 0; j < 10; j++) {
      let x = (gridWidth / 10) + (j * (gridWidth / 10));
      grid.push([x,y]);
    }
  }
}

let wheel = ['vertline','fwdslash','horzlineRight', 'backslash', 'vertline', 'fwdslash', 'horzlineRight', 'backslash'];
let step = 0;
function draw() {
  // draw grid
  grid.map(pt => util.mark([pt[0], pt[1]], 'red'));

  let currentChar = chars[wheel[step]];
  grid.map(pt => {
    ctx.fillStyle = '#ececec';
    util.centerRec(pt, 25, 35);
    ctx.fillStyle = 'black';
    let offset = util.ooffset(pt, currentChar.ancors.center);
    ctx.fillText(currentChar.code, offset[0], offset[1]);
  });

  //draw line
  //let endpt = [canvas.width / 2, 0];
  //util.mark(endpt, 'green');
  //for (var i = 0, len = lineKeys.length; i < len; i++) {
    //let currentChar = chars[lineKeys[i]];
    //let startAncor = currentChar.ancors[currentChar.start];
    //let startPt = [endpt[0] - startAncor[0], endpt[1] - startAncor[1]];
    //ctx.fillText(currentChar.code, startPt[0], startPt[1]);
    //let endAncor = currentChar.ancors[currentChar.end];
    //endpt = [startPt[0] + endAncor[0], startPt[1] + endAncor[1]];
    ////util.mark(endpt, 'red');
  //};
}

var fps = 5;
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
    if(step >= wheel.length) step = 0;
    //var options = {
      //'horzlineRight': 0.16,
      //'horzlineLeft': 0.16,
      //'fwdslash': 0.22,
      //'vertline': 0.22,
      //'backslash': 0.22
    //};
    //if (lastOption === 'horzlineRight') {
      //options.horzlineRight = 0.5;
      //options.horzlineLeft = 0;
    //} else if (lastOption === 'horzlineLeft') {
      //options.horzlineRight = 0;
      //options.horzlineLeft = 0.5;
    //}
    //let selectedOption = weighted.select(options);
    //lastOption = selectedOption;
    //lineKeys.unshift(selectedOption);
    util.clear();
    draw();
    step++;
  }
}

// when DOM loads
window.onload = () => {
  init();
  draw();
  update();
}
