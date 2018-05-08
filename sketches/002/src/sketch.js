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

  let testCage = new shapes.IsoCage(canvas.width / 2, 330, 40, 'white');
  let testCageDrawer = testCage.drawer();
  testCageDrawer.next().value;
  let testCubes = [
    new shapes.IsoCube(canvas.width / 2, 330 - (.15 * 40 * 4) - (1.145 * 40 * 3), 40, colors[0]),
    new shapes.IsoCube(canvas.width / 2, 330 - (.15 * 40 * 3) - (1.145 * 40 * 2), 40, colors[1]),
    new shapes.IsoCube(canvas.width / 2, 330 - (.15 * 40 * 2) - (1.145 * 40), 40, colors[2]),
    new shapes.IsoCube(canvas.width / 2, 330 - (.15 * 40), 40, colors[3]),
  ];
  testCubes.reverse();
  testCubes.forEach(cube => cube.draw());
  console.log(testCageDrawer.next().value);


  //gen.next();
  // Draw the view now:
  paper.view.draw();
}
