import "babel-polyfill";
import paper from 'paper'; // to be globally declared
import seedrandom from 'seedrandom';
import weighted from 'weighted';
import genColors from './colors';
import genUtil from './utils';

var seed, canvas, ctx, colors, util, grid, cw;

function init() {
  // seed
  seed = 'seed_' + Math.round(Math.random() * 10000000); // random every load
  //seed = 'seed_2525747'; // set seed
  seedrandom(seed, { global: true }); // override Math.Random
  // setup paper.js
  paper.install(window);
  // canvas selection
  canvas = document.querySelector('canvas');
  paper.setup(canvas);
  // resolution fix
  // TODO: check if we still need this fix with paper.js...
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  // canvas setup
  // util
  //util = new genUtil({
    //canvas: canvas,
    //ctx: ctx
  //});

  // colors
  colors = new genColors({ // http://paletton.com/#uid=75a0J0kU5OUplRWyiToTKuvSQnE
    0: '#EC0085',
    1: '#FF4C00',
    2: '#00E086',
    3: '#A6F900',
    4: '#FFFFFF',
    5: '#000000',
    bg0: '#E3AA00',
    bg1: '#21BE00',
    bg2: '#BC005C',
    bg3: '#FFFFFF'
  });
  console.log('colors: ', colors);
  // select random starting pts
  grid = [];
  for (var i = 0; i < 10; i++) {
    grid.push(new Point(
      Math.floor(Math.random() * canvas.width),
      Math.floor(Math.random() * canvas.height),
    ));
  }

  //grid.forEach(pt => {
    ////console.log('pt: ', pt);
    //var shape = new Shape.Circle(pt, 1);
    //shape.strokeColor = 'black';
  //});
  // random sizes
  grid = grid.map(pt => {
    let sizes = {
      1: 0.13,
      2: 0.33,
      3: 0.33,
      4: 0.10,
      5: 0.10
    };
    return {
      pt: pt,
      size: window.parseInt(weighted.select(sizes))
    };
  });



}

function draw() {
  // draw bg
  var bg = new Path.Rectangle({
    topLeft: new Point(0,0),
    bottomRight: new Point(canvas.width, canvas.height),
    fillColor: {
      gradient: {
        stops: [['#00A562', 0.05], ['#00804C', 0.75]],
        radial: true
      },
      origin: new Point(canvas.width / 2, canvas.height / 2),
      destination: new Point(0,0)
    }
  });
  // draw cones

  // ellipse
  let shapes = grid.map(obj => {
    let pt = obj.pt;
    let x = obj.size * 25;
    // color
    let bodyColorIndex = Math.floor(Math.random() * 4);
    let capColorType = weighted.select({
      'white': 0.25,
      'black': 0.25,
      'og': 0.5,
    });
    let capColor = '#FFFFFF';
    if(capColorType == 'black') capColor = '#000000';
    else if(capColorType == 'og') capColor = colors[bodyColorIndex].full;
    // ellipse
    let cap = new Shape.Ellipse({
      point: obj.pt,
      size: [x, x/2 ],
      fillColor: capColor
    });
    pt = new Point(pt.x + x/2, pt.y + x/4);
    let lengths = {
      1: 500,
      2: 333,
      3: 200,
      4: 125,
      5: 150
    };
    let a = new Point(pt.x - x/2, pt.y);
    let c = new Point(pt.x + x/2, pt.y);
    let b = new Point(pt.x, pt.y - lengths[obj.size]/2);
    let body = new Path({
      segments: [a,b,c],
      fillColor: colors[bodyColorIndex].full,
      closed: true
    });
    return {orgin: pt, size: obj.size, shape: new Group([body, cap])};
  });

  // transform shapes
  shapes = shapes.map((grp, i) => {
    // rotate shape
    grp.shape.rotate(Math.floor(Math.random() * 360), grp.origin);
    // scale shape
    let scaler = 1;
    if(i % 2 == 0) {
      scaler = Math.random() * 1.25 + .5;
      console.log('scaler: ', scaler);
      grp.shape.scale(scaler, grp.origin);
    }
    grp.scaler = scaler;
    return grp;
  });
  // force smaller shapes to background
  shapes.sort(function (a, b) {
      return (a.scaler + a.size) - (b.scaler + b.size);
  });

  shapes = shapes.map(obj => {
    obj.shape.bringToFront();
    return obj;
  });
  bg.sendToBack();

  //let glob = shapes.reduce((glob, obj) => {
    //glob.addChild(obj.shape);
    //return glob;
  //}, new Group([]));

  console.log('shapes: ', shapes);
  paper.view.draw(); // paper.js draw
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
    //util.clear();
    draw();
    step++;
  }
}

// when DOM loads
window.onload = () => {
  init();
  draw();
  //update();
}
