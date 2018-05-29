export default function Utils (config) {
  const canvas = config.canvas;
  const ctx = config.ctx;
  this.height = canvas.clientHeight;
  this.width = canvas.clientWidth;

  /*
   * for a given x and y returns the color of that pixel
   * @prama{canv} int, between 0 and canvas width
   * @prama{x} int, between 0 and canvas width
   * @prama{y} int, between 0 and canvas height
   */
  this.getColor = function (x, y, imgData) {
    const red = y * (this.width * 4) + x * 4;
    const indices = [red, red + 1, red + 2, red + 3];
    return {
      red: imgData.data[indices[0]],
      green: imgData.data[indices[1]],
      blue: imgData.data[indices[2]],
      alpha: imgData.data[indices[3]]
    };
  };


  /*
   * finds the four corners of non white pixels currently on the canvas
   */
  this.findAncors = () => {
    var currentImgData = ctx.getImageData(0, 0, this.width, this.height); // get capture of current canvas pixles
    let coloredPixles = [];
    for (var x = 0, col = this.width; x < col; x++) {
      for (var y = 0, row = this.height; y < row; y++) {
        let color = this.getColor(x, y, currentImgData);
        if(color.red !== 0 || color.green !== 0 || color.blue !== 0 || color.alpha !== 0) coloredPixles.push([x,y]);
      }
    }
    let topRight = coloredPixles.reduce((maxPixel, currentPixel) => { // smallest y and largest x
      if(currentPixel[0] >= maxPixel[0]) maxPixel[0] = currentPixel[0];
      if(currentPixel[1] <= maxPixel[1]) maxPixel[1] = currentPixel[1];
      return maxPixel;
    }, [coloredPixles[0][0], coloredPixles[0][1]]);
    let botRight = coloredPixles.reduce((maxPixel, currentPixel) => { // largest y and largest x
      if(currentPixel[0] >= maxPixel[0]) maxPixel[0] = currentPixel[0];
      if(currentPixel[1] >= maxPixel[1]) maxPixel[1] = currentPixel[1];
      return maxPixel;
    }, [coloredPixles[0][0], coloredPixles[0][1]]);
    let topLeft = coloredPixles.reduce((maxPixel, currentPixel) => { // largest y and smallest x
      if(currentPixel[0] <= maxPixel[0]) maxPixel[0] = currentPixel[0];
      if(currentPixel[1] <= maxPixel[1]) maxPixel[1] = currentPixel[1];
      return maxPixel;
    }, [coloredPixles[0][0], coloredPixles[0][1]]);
    let botLeft = coloredPixles.reduce((maxPixel, currentPixel) => { // largest y and largest x
      if(currentPixel[0] <= maxPixel[0]) maxPixel[0] = currentPixel[0];
      if(currentPixel[1] >= maxPixel[1]) maxPixel[1] = currentPixel[1];
      return maxPixel;
    }, [coloredPixles[0][0], coloredPixles[0][1]]);
    let botMiddle = [botRight[0] - ((botRight[0] - botLeft[0]) / 2), botRight[1]]
    let center = [botMiddle[0], ((botMiddle[1] + topLeft[1]) / 2)];
    //let botMiddle = [botRight[0] - ((botRight[0] - botLeft[0]) / 2), botRight[1]]
    return {
      topRight: topRight,
      botRight: botRight,
      topLeft: topLeft,
      botLeft: botLeft,
      botMiddle: botMiddle,
      center: center
    };
  }

  this.clear = () => ctx.clearRect(0, 0, this.width, this.height);
  this.mark = (pt, color) => {
    let prevFillColor = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillRect(pt[0] - 2, pt[1] - 2, 4, 4);
    ctx.fillStyle = prevFillColor;
  };
  this.offset = (pt1, pt2) => {
    return [pt1[0] + pt2[0], pt1[1] + pt2[1]];
  };
  this.ooffset = (pt1, pt2) => {
    return [pt1[0] - pt2[0], pt1[1] - pt2[1]];
  };
  this.centerRec = (pt, width, height) => {
    ctx.fillRect(pt[0] - (width / 2), pt[1] - (height / 2), width, height);
  };
};

