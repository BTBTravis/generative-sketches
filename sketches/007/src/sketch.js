import "babel-polyfill";
import paper from 'paper'; // to be globally declared
import seedrandom from 'seedrandom';
import weighted from 'weighted';
import genColors from './colors';

var seed, canvas, colors, grid, shapes, bg;


var fillKey = weighted.select({
  'white': 0.15,
  'black': 0.15,
  'green': 0.33,
  'pink': 0.33
});

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

  // colors
  colors = new genColors({ // http://paletton.com/#uid=75a0J0kU5OUplRWyiToTKuvSQnE
    0: '#EC0085',
    1: '#FF4C00',
    2: '#00E086',
    3: '#A6F900',
    4: '#FFFFFF',
    5: '#000000'
  });
  console.log('colors: ', colors);
  // select random starting pts
  grid = [];
  for (var i = 0; i < 20; i++) {
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

  var fills = {
    'white': '#FFFFFF',
    'black': '#000000',
    'green': {
      gradient: {
        stops: [['#00A562', 0.05], ['#00804C', 0.75]],
        radial: true
      },
      origin: new Point(canvas.width / 2, canvas.height / 2),
      destination: new Point(0,0)
    },
    'pink': {
      gradient: {
        stops: [['#C3006E', 0.05], ['#970055', 0.75]],
        radial: true
      },
      origin: new Point(canvas.width / 2, canvas.height / 2),
      destination: new Point(0,0)
    }
  };

  bg = new Path.Rectangle({
    topLeft: new Point(0,0),
    bottomRight: new Point(canvas.width, canvas.height),
    fillColor: fills[fillKey]
  });
  // draw cones

  // ellipse
  shapes = grid.map(obj => {
    let pt = obj.pt;
    let x = obj.size * 25;
    // color
    let bodyColorIndex = Math.floor(Math.random() * 4);
    let colorOptions = {
      'white': 0.25,
      'black': 0.25,
      'og': 0.5,
    };
    if (fillKey == 'black') colorOptions.black = 0;
    if (fillKey == 'white') colorOptions.white = 0;
    let capColorType = weighted.select(colorOptions);
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
    let guideLine = new Path({
      segments: [pt,b],
      //strokeColor: 'black',
    });
    return {orgin: pt, size: obj.size, shape: new Group([body, cap, guideLine])};
  });

  // transform shapes
  shapes = shapes.map((grp, i) => {
    // rotate shape
    grp.rot = Math.floor(Math.random() * 360);
    grp.shape.rotate(grp.rot, grp.origin);
    // scale shape
    grp.scale = 1;
    if (i % 2 == 0) {
      grp.scale = Math.random() * 1.25 + .5;
      grp.shape.scale(grp.scale, grp.origin);
    }
    return grp;
  });
  // force smaller shapes to background
  shapes.sort(function (a, b) {
      return (a.scale + a.size) - (b.scale + b.size);
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

var fps = 30;
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

    shapes.map(obj => {
      let guide = obj.shape.children[2];
      let pt1 = guide.getPointAt(0);
      let pt2 = guide.getPointAt(guide.length);
      let dir = pt1.subtract(pt2);
      dir = dir.normalize();
      // animate along primaty axis
      let finalDir = new Point(dir.x * 5/obj.size, dir.y * 5/obj.size);
      obj.shape.translate(finalDir);

      //reset pos if needed
      let bbPts = [obj.shape.bounds.topLeft, obj.shape.bounds.topRight, obj.shape.bounds.bottomLeft, obj.shape.bounds.bottomRight];
      let onPage = bbPts.reduce((onPage, pt) => {
         return onPage || bg.bounds.contains(pt);
      }, false);
      if (!onPage) {

        obj.shape.translate(new Point((obj.shape.bounds.centerX - canvas.width / 2) * 2 * -1, (obj.shape.bounds.centerY - canvas.height / 2) * 2 * -1));
      }

    });
    //util.clear();
    //draw();
    //step++;
  }
}

// when DOM loads
window.onload = () => {
  init();
  draw();
  update();
}
