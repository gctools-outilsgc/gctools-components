/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import Placement from '.';
import MemoryCanvas from '../memory-canvas';

const uuid = require('uuid/v4');
const d3 = require('d3');

class Linear extends Placement {
  constructor(options) {
    super(options);
    const fader = color => d3.interpolateRgb(color, '#fff')(0.2);
    this.color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));
  }
  run(callback) {
    super.run();
    const drawQueue = [];

    const placed = new MemoryCanvas(this.width, this.height);
    for (let x = 0; x < this.phrases.length; x += 1) {
      const { phrase } = this.phrases[x];
      const { sizes } = this.shaper.getShapesForPhrase(phrase);

      const pathId = uuid();

      let bestIntersect = this.width * this.height;
      let bestFit = false;
      let x1 = 0;
      let y1 = 0;
      let pathInfo = false;
      let red = false;

      for (let p1 = 0; p1 < sizes.length; p1 += 1) {
        for (let r = 0; r < 20; r += 1) {
          pathInfo = sizes[p1];

          x1 = parseInt(
            (Math.random() * pathInfo.maximum_x) + pathInfo.minimum_x,
            10,
          );
          y1 = parseInt(
            (Math.random() * pathInfo.maximum_y) + pathInfo.minimum_y,
            10,
          );
          pathInfo.getMemoryCanvas().clear();
          pathInfo.placeShapeOnCanvas(x1, y1);
          const intersects = placed.intersects(pathInfo);

          if (!intersects) {
            placed.placeShape(pathInfo, x1, y1);
            bestFit = false;
            break;
          }
          const { pixelCount, shapeCount } = placed.getIntersects(pathInfo);

          if (pixelCount * (shapeCount * 2) < bestIntersect) {
            bestFit = pathInfo;
            bestIntersect = pixelCount * (shapeCount * 2);
          }
        }
        if (!bestFit) break;
      }
      if (bestFit) {
        red = true;
        pathInfo = bestFit;
        placed.placeShape(pathInfo, pathInfo.x, pathInfo.y);
      }

      drawQueue.push({
        pathInfo,
        pathId,
        red,
        text: phrase.text,
        x1: pathInfo.x,
        y1: pathInfo.y,
        item_color: this.color(x),
      });
    }
    callback(drawQueue, placed);
  }
}

export default Linear;
