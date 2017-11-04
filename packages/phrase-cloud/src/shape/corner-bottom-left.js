/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import Shape from '.';

class CornerBottomLeft extends Shape {
  getPath() {
    // *
    // *
    // *
    // *
    //   * * * *
    const { cornerRadius } = this;
    const path = this.generatePath(adj => 'm0,0 ' +
      `v${(this.scale_height - cornerRadius - adj)} ` +
      `a${cornerRadius},${cornerRadius} ` +
      '0 0 0 ' +
      `${cornerRadius},${cornerRadius} ` +
      `h${(this.scale_width - cornerRadius - adj)}`, this.characterHeight);

    if (path) {
      this.minimum_y = this.characterHeight;
      this.maximum_x =
        this.maxWidth - parseInt(Math.max(this.first.x, this.last.x), 10);
      this.maximum_y = this.maxHeight
        - parseInt(Math.max(this.first.y, this.last.y), 10)
        - this.characterHeight;
    }
    return path;
  }

  tracerFunc(canvas, x, y, fx, fy, once) {
    const charHeight = parseInt(this.characterHeight, 10);
    once(() => {
      const startx = parseInt(this.first.x + fx, 10);
      const lastx = Math.min(this.maxWidth, parseInt(this.last.x + fx, 10));
      const firsty = parseInt(this.first.y + fy, 10);
      const lasty = parseInt(this.last.y + fy, 10);
      const firstXBoundary = Math.min(this.maxWidth, startx + charHeight);
      const topy = Math.max(0, lasty - charHeight);
      // going down
      for (let step = firsty; step < topy; step += 1) {
        const inc = step - firsty;
        const xcap = Math.min(firstXBoundary, startx + inc);
        // eslint-disable-next-line no-param-reassign
        canvas[xcap][firsty] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[startx][step] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[firstXBoundary][step] = 1;
        const yend =
          Math.min(lasty, topy + inc);
        // eslint-disable-next-line no-param-reassign
        canvas[lastx][yend] = 1;
        const cornerx =
          Math.min(
            startx + charHeight,
            startx + inc,
          );
        // eslint-disable-next-line no-param-reassign
        canvas[cornerx][yend] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[cornerx + charHeight][yend]
          = 1;
      }
      for (let step = firstXBoundary; step < lastx; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[step][lasty] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[step][topy] = 1;
      }
      return true;
    });
  }
}

export default CornerBottomLeft;
