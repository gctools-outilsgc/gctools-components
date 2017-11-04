/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import Shape from '.';

class CornerTopRight extends Shape {
  getPath() {
    //   * * * *
    //           *
    //           *
    //           *
    //           *
    const { cornerRadius } = this;
    const path = this.generatePath(
      adj => 'm0,0 ' +
        `h${(this.scale_width - cornerRadius - adj)}` +
        `a${cornerRadius},${cornerRadius} ` +
        '0 0 1 ' +
        `${cornerRadius},${cornerRadius} ` +
        `v${(this.scale_height - cornerRadius - adj)} `,
      this.characterHeight,
    );

    if (path) {
      this.maximum_x = this.maxWidth -
        parseInt(Math.max(this.first.x, this.last.x), 10) -
        this.characterHeight;
      this.minimum_y = this.characterHeight;
      this.maximum_y =
        this.maxHeight - parseInt(Math.max(this.first.y, this.last.y), 10);
    }
    return path;
  }

  tracerFunc(canvas, x, y, fx, fy, once) {
    const charHeight = parseInt(this.characterHeight, 10);
    once(() => {
      const startx = parseInt(this.first.x + fx, 10);
      const lastx = Math.min(this.maxWidth, parseInt(this.last.x + fx, 10));
      const firsty = parseInt((this.first.y + fy + 2) - charHeight, 10);
      const realfy = parseInt(this.first.y + fy + 2, 10);
      const lasty = parseInt(this.last.y + fy, 10);
      const max = Math.min(this.maxWidth, (lastx + charHeight) - 1);
      // first cap
      for (let step = firsty; step < realfy; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[startx][step] = 1;
      }
      // end cap (bottom)
      for (let step = lastx; step < max; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[step][lasty] = 1;
      }
      // end cap (top)
      for (let step = firsty; step < realfy; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[lastx][step] = 1;
      }
      // end cap (top right)
      for (let step = lastx; step < max; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[step][realfy] = 1;
      }
      // curved box
      const curvedy = parseInt(realfy + charHeight, 10);
      for (let step = lastx; step > lastx - charHeight; step -= 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[step][curvedy] = 1;
      }
      const curvedx = parseInt(lastx - charHeight, 10);
      for (let step = realfy; step < realfy + charHeight; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[curvedx][step] = 1;
      }
      // top part of phrase
      for (let step = startx; step < lastx; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[step][firsty] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[step][realfy] = 1;
      }
      // bottom
      for (let step = realfy; step < lasty + 1; step += 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[lastx][step] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[max][step] = 1;
      }
      return true;
    });
  }
}

export default CornerTopRight;
