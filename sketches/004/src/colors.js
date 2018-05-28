import cconvert from 'color-convert';
export default function GenColors(colors) {
  for (var key in colors) { // init color setup
    let colorHsl = cconvert.hex.hsl(colors[key]);
    this[key] = {
      full: colors[key],
      light: '#' + cconvert.hsl.hex(colorHsl[0], colorHsl[1], colorHsl[2] != 100 ? colorHsl[2] + 5 : 100),
      dark: '#' + cconvert.hsl.hex(colorHsl[0], colorHsl[1], colorHsl[2] != 0 ? colorHsl[2] - 5 : 0)
    }
  }
};
