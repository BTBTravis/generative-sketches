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
    bg: '#69029D'
  };

  let bg = new Path.Rectangle(0, 0, canvas.width, canvas.height);
  bg.fillColor = colors.bg;

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
      console.log('data: ', data);
      cubes.push(new shapes.IsoCube(x, yOffset, size, colors[data[i]]));
    }
    //cubes.reverse();
    cubes.forEach(cube => cube.draw());
    cage.drawFg();
  }

  let w = canvas.width;
  let h = canvas.height;
  let s = 50;
  for (var i = 10; i > 0; i--) {
    let data = [];
    data = randomAdd(data);
    data = randomAdd(data);
    data = randomAdd(data);
    data = randomAdd(data);
    console.log('data: ', data);
    isoCell(w - (1.45 * i * s), h - ((.663 + .15) * s * i), s, data);
  }
  function randomAdd (arr) {
    let val = Math.floor(Math.random() * Math.floor(5));
    if(val !== 4) arr.push(val);
    return arr;
  }
  //isoCell(w - (1.45 * s), h - ((.663 + .15) * s), s, [2, 2, 2, 0]);
  //isoCell(w, h, 50, [1, 1, 0, 1]);
  //isoCell(w / 2, h / 2 + 200, 60, [2, 3, 0, 1]);


  //gen.next();
  // Draw the view now:
  paper.view.draw();
}
