/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

const pathProps = require('svg-path-properties');

class MemoryCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.clear();
  }

  clear() {
    this.canvas = new Array(parseInt(this.width + 1, 10));
    for (let x = 0; x <= this.width; x += 1) {
      this.canvas[x] = new Array(parseInt(this.height + 1, 10));
    }
    this.shapeIndex = new Array(parseInt(this.width + 1, 10));
    for (let i = 0; i <= this.width; i += 1) {
      this.shapeIndex[i] = new Array(parseInt(this.height + 1, 10));
    }
    this.shapeCount = 0;
    this.pathModX = 0;
    this.pathModY = 0;
  }

  placeShape(shape, x0, y0) {
    this.shapeCount += 1;
    const pathInfo = shape;
    this.pathModX = 0;
    this.pathModY = 0;
    const usePath = pathInfo.path.replace( // eslint-disable-line
      // eslint-disable-next-line no-useless-escape
      /m(\d[\.\d]*?)[, ](\d[\.\d]*?) /, (m, x, y) => {
        this.pathModX = parseInt(x, 10);
        this.pathModY = parseInt(y, 10);
        const r = `m${x0 + pathInfo.offset_length_x},` +
        `${y0 + pathInfo.offset_length_y} `;
        return r;
      });
    try {
      const props = pathProps.svgPathProperties(usePath);
      if (['WordWrapBox', 'WordWrapBox3', 'Horizontal']
        .indexOf(shape.constructor.name) >= 0) {
        this.pathModX +=
          parseInt((shape.path_width - shape.textWidth) / 2, 10);
      }
      let onceDone = false;
      let breakLoop = false;
      const once = (func) => {
        if (!onceDone) {
          const v = func();
          if (v === true) breakLoop = true;
        }
        onceDone = true;
      };
      for (let i = 0; i < shape.textWidth; i += 1) {
        const point = props.getPointAtLength(i);
        const x = parseInt(point.x, 10) + this.pathModX;
        const y = parseInt(point.y, 10) + this.pathModY;
        if (shape.tracerFunc) {
          shape.tracerFunc(this.canvas, x, y, x0, y0, once);
        }
        if (breakLoop) break;
        this.canvas[x][y] = 1;
      }
      const shapeCanvas = shape.getMemoryCanvas().canvas;
      shapeCanvas.map((v, x) => v.map((v1, y) => {
        this.shapeIndex[x][y] = this.shapeCount;
        return undefined;
      }));
    } catch (e) { } // eslint-disable-line no-empty
    shape.old_x = undefined; // eslint-disable-line no-param-reassign
    shape.old_y = undefined; // eslint-disable-line no-param-reassign
  }

  intersects(shape) {
    const canvas1 = shape.getMemoryCanvas().canvas;
    for (let x1 = 0; x1 < canvas1.length; x1 += 1) {
      const found = canvas1[x1].some((a, y) => {
        if (this.canvas[x1][y] === 1) {
          return true;
        }
        return false;
      });
      if (found) {
        return true;
      }
    }
    return false;
  }

  getIntersects(shape) {
    const canvas1 = shape.getMemoryCanvas().canvas;
    let c = 0;
    const seen = [];
    for (let x = 0; x < canvas1.length; x += 1) {
      c += canvas1[x].filter((a, y) => (this.canvas[x][y] === 1)).length;
    }
    for (let x = 0; x < canvas1.length; x += 1) {
      canvas1[x].map((v, y) => {
        if ((this.canvas[x][y] === 1)
          && (seen.indexOf(this.shapeIndex[x][y]) < 0)) {
          seen.push(this.shapeIndex[x][y]);
        }
        return undefined;
      });
    }
    return { pixelCount: c, shapeCount: seen.length };
  }
}

export default MemoryCanvas;
