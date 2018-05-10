// https://twitter.com/manoloidee?s=09
import paper from 'paper'; // to be globally declared
import cconvert from 'color-convert';
import "babel-polyfill";
//import createShapes from './shapes';

//const shapes = createShapes({
  //cconvert: cconvert
//});

// setup paper.js
paper.install(window);
const canvas = document.querySelector('canvas');

window.onload = function() {
  paper.setup(canvas);

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


  //let ogPt = new Point(0, canvas.height);
  //let ogPt = new Point(canvas.width / 2, canvas.height / 2);
  let ogPt = new Point(0, canvas.height / 2);

  let a = new Point(0, 0);
  let b = new Point(1, -0.577);
  let c = new Point(0, -1.14);
  let d = new Point(-1, -0.577);


  let basePath = new Path([a, b, c, d, a]);
  basePath.strokeWeight = 2;
  basePath.strokeColor = 'black';
  basePath.scale(100, a);
  basePath.translate(ogPt);
  console.log('basePath: ', basePath);
  let recs = [];
  for (var i = 0, rowCount = 10; i < rowCount; i++) {
    for (var j = 0, colCount = 100; j < colCount; j++) {
      let rec = basePath.clone();
      let bgRandomVal = Math.floor(Math.random() * Math.floor(3));
      rec.fillColor = colors['bg' + bgRandomVal];
      rec.translate(new Point(0, ogPt.y - (basePath.bounds.height * j)));
      rec.translate(new Point((basePath.segments[0].point.x - basePath.segments[1].point.x) * i * -1, (basePath.segments[0].point.y - basePath.segments[1].point.y) * i));
      recs.push(rec);
    }
  }

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
    //
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
