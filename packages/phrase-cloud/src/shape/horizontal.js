/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import Shape from '.';

class Horizontal extends Shape {
  getPath() {
    // * * * * * * * * *
    const path = this.generatePath(
      adj => `m0,0 h${this.scale_width - adj}`,
      this.characterHeight,
    );
    if (path) {
      this.maximum_x = this.maxWidth - this.last.x;
      this.minimum_y = this.characterHeight;
      this.maximum_y = this.maxHeight;
    }
    return path;
  }
  tracerFunc(canvas, x, y) {
    const charHeight = this.characterHeight;
    for (let step = 1; step < charHeight; step += 1) {
      // eslint-disable-next-line no-param-reassign
      canvas[x][y - step] = 1;
    }
  }
}

Horizontal.pathName = 'horizontal';

export default Horizontal;
