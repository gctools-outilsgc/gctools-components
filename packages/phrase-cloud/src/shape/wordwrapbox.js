/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import Shape from '.';

class WordWrapBox extends Shape {
  getPath() {
    // * * * * * * * * *
    const { characterHeight } = this;
    const path = this.generatePath(
      (adj) => {
        const l = parseInt((this.scale_width / 1.5) - adj, 10);
        return `m0,0 h${l}
          m -${l},${characterHeight}
          h${l}`;
      }
      , characterHeight,
    );

    if (path) {
      this.maximum_x = this.maxWidth - this.last.x;
      this.minimum_y = this.characterHeight;
      this.maximum_y = this.maxHeight - this.last.y;
    }
    return path;
  }
  tracerFunc(canvas, x, y, fx, fy, once) {
    once(() => {
      const charHeight = this.characterHeight;
      const startx = parseInt(this.first.x + fx, 10);
      const lastx = parseInt(this.last.x + fx, 10);
      const firsty = parseInt((this.first.y + fy + 2) - charHeight, 10);
      const lasty = parseInt(this.last.y + fy, 10);
      for (let step = startx; step <= lastx; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[step][firsty] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[step][lasty] = 1;
      }
      for (let step = firsty; step <= lasty; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[startx - 1][step] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[lastx][step] = 1;
      }
      const xlen = lastx - startx;
      const ylen = lasty - firsty;
      // eslint-disable-next-line
      const h = Math.sqrt(Math.pow(xlen, 2) + Math.pow(ylen, 2));
      for (let step = 1; step <= h; step += 1) {
        const r = step / h;
        const diagx = parseInt(startx + (xlen * r), 10);
        const diagy = parseInt(firsty + (ylen * r), 10);
        // eslint-disable-next-line no-param-reassign
        canvas[diagx][diagy] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[(startx + lastx) - diagx][diagy] = 1;
      }
      return true;
    });
  }
}

WordWrapBox.pathName = 'horizontal';

export default WordWrapBox;
