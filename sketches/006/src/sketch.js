import "babel-polyfill";
import seedrandom from 'seedrandom';
import weighted from 'weighted';
import genColors from './colors';
import genUtil from './utils';

var seed, canvas, ctx, colors, util, grid, cw;
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
    ctx.fillText(chars[key].code, 100, 100);
    chars[key].ancors = util.findAncors(); // find ancors
    // offset ancors
    for (let ancorKey in chars[key].ancors) {
      let pt = chars[key].ancors[ancorKey];
      chars[key].ancors[ancorKey][0] = pt[0] - 100;
      chars[key].ancors[ancorKey][1] = pt[1] - 100;
    }
    //break;
    util.clear();
    let font = ctx.font;
    ctx.font = '200px serif';
    ctx.fillText(chars[key].code, canvas.width / 2, canvas.height / 2);
    chars[key].largeAncors = util.findAncors(); // find ancors
    // offset ancors
    for (let ancorKey in chars[key].largeAncors) {
      let pt = chars[key].largeAncors[ancorKey];
      chars[key].largeAncors[ancorKey][0] = pt[0] - (canvas.width / 2) ;
      chars[key].largeAncors[ancorKey][1] = pt[1] - (canvas.height / 2);
    }
    ctx.font = '18px serif';
    util.clear();
  }

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

  function CenterWheel () {
    this.step = 0;
    this.phases = ['vertline','fwdslash','horzlineRight', 'backslash', 'vertline', 'fwdslash', 'horzlineRight', 'backslash'];
    this.phases.reverse();
    this.drawCount = 0;
    this.draw = () => {
      let centerPt = [canvas.width / 2, canvas.height / 2];
      ctx.fillStyle = 'black';
      let scaleFactor = 9;
      util.centerRec(centerPt, 25 * scaleFactor, 35 * scaleFactor);
      ctx.fillStyle = 'red';
      let currentChar = chars[this.phases[this.step]];
      let offset = util.ooffset(centerPt, currentChar.largeAncors.center);
      let font = ctx.font;
      ctx.font = '200px serif';
      ctx.fillText(currentChar.code, offset[0], offset[1]);
      ctx.font = font;
      this.drawCount++;
    }
    this.incriment = function () {
      if(this.drawCount % 4 != 0) return null;
      if(this.step < this.phases.length - 1) this.step++;
      else this.step = 0;
    }
  }
  cw = new CenterWheel();


  // center wheel setup

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

  // draw center wheel
  cw.draw();
  cw.incriment();
  //ctx.fillText(currentChar.code, offset[0], offset[1]);

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
