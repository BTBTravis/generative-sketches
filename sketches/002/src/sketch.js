// https://twitter.com/manoloidee?s=09
import paper from 'paper'; // to be globally declared
import cconvert from 'color-convert';
import "babel-polyfill";
import createShapes from './shapes';

const shapes = createShapes({
  cconvert: cconvert
});

// setup paper.js
paper.install(window);
const canvas = document.querySelector('canvas');

window.onload = function() {
  paper.setup(canvas);


  // global colors for the sketch
  let colors = {
    0: '#FFD500',
    1: '#A1F600',
    2: '#8C02D2',
    3: '#FFFFFF',
    bg0: '#69029D',
    bg1: '#c5a402',
    bg2: '#FFFFFF',
    bg3: '#7abc01'
  };


  function isoCell (x, y, size, data) {
    let cage = new shapes.IsoCage(x, y, size, 'white', data.length);
    cage.drawBg();

    let cubes = [];
    for (var i = 0; i < data.length; i++) {
      switch (i) {
        case 1:
          var yOffset = y - (.15 * size * 2) - (1.145 * size);
          break;
        case 2:
          var yOffset = y - (.15 * size * 3) - (1.145 * size * 2);
          break;
        case 3:
          var yOffset = y - (.15 * size * 4) - (1.145 * size * 3);
          break;
        default:
          var yOffset = y - (.15 * size);
      }
      cubes.push(new shapes.IsoCube(x, yOffset, size, colors[data[i]]));
    }
    //cubes.reverse();
    cubes.forEach(cube => cube.draw());
    cage.drawFg();
  }

  function draw() {
    let bg = new Path.Rectangle(0, 0, canvas.width, canvas.height);
    let bgRandomVal = Math.floor(Math.random() * Math.floor(5));
    bg.fillColor = colors['bg' + bgRandomVal];

    let w = canvas.width;
    let h = canvas.height;
    let s = 50;
    for (var i = 10; i > -2; i--) {
      let ax = w - (1.45 * i * s);
      let ay = h - ((.663 + .15) * s * i);
      //if (i % 3 == 0) {
        //isoCell(ax + (1.45 * s), ay - (.663 + .15) * s, s, randomData());
        //isoCell(ax, ay, s, randomData());
        //isoCell(ax - (1.45 * s), ay + (.663 + .15) * s, s, randomData());
      //}
      isoCell(ax, ay, s, randomData());
    }
    function randomData () {
      let data = [];
      data = randomAdd(data);
      data = randomAdd(data);
      data = randomAdd(data);
      data = randomAdd(data);
      return data;
    }
    function randomAdd (arr) {
      let val = Math.floor(Math.random() * Math.floor(6));
      if(val < 4) arr.push(val);
      return arr;
    }
  }


  paper.view.onFrame = (e) => {
    if(e.count % 60  === 0) {
      project.clear();
      draw();
      //isoBlocks.forEach(block => {
        //block.updateHeight();
        //block.draw();
      //});
    }
  };

  // Draw the view now:
  paper.view.draw();
}
