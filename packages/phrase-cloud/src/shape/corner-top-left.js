/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import Shape from '.';

class CornerTopLeft extends Shape {
  getPath() {
    //   * * * *
    // *
    // *
    // *
    const { cornerRadius } = this;
    const path = this.generatePath(adj =>
      `m0,${(this.scale_height - adj)} ` +
      `v${(this.scale_height - cornerRadius - adj) * -1} ` +
      `a${cornerRadius},${cornerRadius} ` +
      '0 0 1 ' +
      `${cornerRadius},${cornerRadius * -1} ` +
      `h${(this.scale_width - cornerRadius - adj)}`, this.characterHeight);

    if (path) {
      this.minimum_x = this.characterHeight;
      this.maximum_x =
        this.maxWidth - parseInt(Math.max(this.first.x, this.last.x), 10)
        - this.characterHeight;
      this.minimum_y = this.characterHeight;
      this.maximum_y = this.maxHeight - this.minimum_y - 1;
    }
    return path;
  }

  tracerFunc(canvas, x, y, fx, fy, once) {
    const charHeight = parseInt(this.characterHeight, 10);
    once(() => {
      const startx = parseInt(this.first.x + fx + 2, 10);
      const lastx = Math.min(this.maxWidth, parseInt(this.last.x + fx, 10));
      const firsty = parseInt(this.first.y + fy, 10);
      const lasty = parseInt(this.last.y + fy, 10);
      const leftx = Math.max(0, startx - charHeight);
      // first cap
      for (let step = startx; step > leftx; step -= 1) {
        if (step < 0) break;
        // eslint-disable-next-line no-param-reassign
        canvas[step][firsty] = 1;
      }
      // going up
      const xwithtext = parseInt(Math.max(0, leftx), 10);
      for (let step = firsty; step > lasty; step -= 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[startx][step] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[xwithtext][step] = 1;
        const xtop = Math.max(xwithtext, startx - (firsty - step));
        // eslint-disable-next-line no-param-reassign
        canvas[xtop][lasty] = 1;
        const yend =
          Math.min(lasty, (lasty - charHeight) + (firsty - step));
        // eslint-disable-next-line no-param-reassign
        canvas[lastx][yend] = 1;
        const cornerx =
          Math.max(
            startx,
            (startx + charHeight) - (firsty - step),
          );
        // eslint-disable-next-line no-param-reassign
        canvas[cornerx][yend] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[cornerx][yend + parseInt(charHeight * 1.5, 10)] = 1;
      }
      for (let step = startx; step < lastx; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[step][lasty] = 1;
        const xstep = Math.max(startx + charHeight, step);
        // eslint-disable-next-line no-param-reassign
        canvas[xstep][lasty - charHeight] = 1;
      }
      return true;
    });
  }
}

export default CornerTopLeft;
