/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import Shape from '.';

class ArcUp extends Shape {
  getPath() {
    // *           *
    //  *         *
    //   *       *
    //     * * *
    const { characterHeight } = this;
    const path = this.generatePath(
      adj =>
        `m0,0 a1,1 0 0,0 ${this.scale_width - adj},0 `,
      characterHeight,
    );

    if (path) {
      this.maximum_x = this.maxWidth -
        parseInt(Math.max(this.first.x, this.last.x), 10) -
        this.characterHeight;
      this.minimum_y = this.characterHeight;
      const mid = this.pathProperties
        .getPropertiesAtLength(this.path_width / 2);
      this.maximum_y -= parseInt(mid.y, 10);
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

ArcUp.pathName = 'arc-up';

export default ArcUp;
