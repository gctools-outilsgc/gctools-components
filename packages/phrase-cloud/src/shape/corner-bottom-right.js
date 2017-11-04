/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import Shape from '.';

class CornerBottomRight extends Shape {
  getPath() {
    //         *
    //         *
    //         *
    // * * * *
    const { cornerRadius } = this;
    const path = this.generatePath(
      adj =>
        `m0,${(this.scale_height - adj)} ` +
      `h${(this.scale_width - cornerRadius - adj)} ` +
      `a${cornerRadius},${cornerRadius} ` +
      '0 0 0 ' +
      `${cornerRadius},${cornerRadius * -1} ` +
      `v${(this.scale_height - cornerRadius - adj) * -1}`,
      this.characterHeight,
    );

    if (path) {
      this.minimum_y = parseInt(Math.max(this.last.y), 10);
      this.maximum_y =
        this.maxHeight - parseInt(Math.max(this.first.y), 10);

      this.maximum_x =
        this.maxWidth - parseInt(Math.max(this.first.x, this.last.x), 10);
    }
    return path;
  }

  getDirection(x, y, initial) {
    if (!this.old_x) {
      this.old_x = x;
      this.old_y = y;
      return initial;
    }
    let direction = initial;
    if (y > this.old_y) {
      direction = 'down';
    } else if (y < this.old_y) {
      direction = 'up';
    } else if (x > this.old_x) {
      direction = 'right';
    } else if (x < this.old_x) {
      direction = 'left';
    } else {
      direction = 'none';
    }
    this.old_x = x;
    this.old_y = y;
    return direction;
  }

  tracerFunc(canvas, x, y, fx, fy, once) {
    const charHeight = parseInt(this.characterHeight, 10);
    once(() => {
      const startx = parseInt(this.first.x + fx, 10);
      const lastx = Math.min(this.maxWidth, parseInt(this.last.x + fx, 10));
      const firsty = parseInt(this.first.y + fy, 10);
      const lasty = parseInt(this.last.y + fy, 10);
      const leftx = Math.max(0, lastx - charHeight);
      // going right
      for (let step = startx; step < leftx; step += 1) {
        const inc = step - startx;
        const ycap = Math.max(firsty - charHeight, firsty - inc);
        // eslint-disable-next-line no-param-reassign
        canvas[startx][ycap] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[step][firsty] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[step][firsty - charHeight] = 1;
        const xend = Math.max(
          Math.min(lastx, Math.min(this.maxWidth, leftx + inc)),
          0,
        );
        // eslint-disable-next-line no-param-reassign
        canvas[xend][lasty] = 1;
        const cornery =
          Math.max(
            firsty - inc,
            firsty - charHeight,
          );
        // eslint-disable-next-line no-param-reassign
        canvas[xend][cornery] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[xend][cornery - charHeight] = 1;
      }
      for (let step = firsty - charHeight; step > lasty; step -= 1) {
        // eslint-disable-next-line no-param-reassign
        canvas[lastx][step] = 1;
        // eslint-disable-next-line no-param-reassign
        canvas[leftx][step] = 1;
      }
      return true;
    });
  }
}

export default CornerBottomRight;
