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
    const pmod = 1.7;
    super(Object.assign(options, {
      scale_width: options.width / pmod,
      scale_height: options.height / pmod,
    }));
    const fader = color => d3.interpolateRgb(color, '#fff')(0.2);
    this.color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));
  }
  run(done, step) {
    super.run();
    const drawQueue = [];

    const placed = new MemoryCanvas(this.width, this.height);
    let x = 0;
    const worker = (obj) => {
      setTimeout(() => {
        const { phrase } = obj.phrases[x];
        const { sizes } = obj.shaper.getShapesForPhrase(phrase);

        const pathId = uuid();
        let usePath = 0;

        let shape = sizes[usePath];
        let pathInfo = shape;
        let x1 = pathInfo.minimum_x;
        let y1 = pathInfo.minimum_y;
        let counter = 0;
        let red = false;
        let translate = 'horizontal';
        let bestIntersect = obj.width * obj.height;
        let bestFit = false;
        const inc = pathInfo.characterHeight;
        const innerWorker = () => {
          counter += 1;
          setTimeout(() => {
            shape.getMemoryCanvas().clear();
            shape.placeShapeOnCanvas(x1, y1);
            const intersects = placed.intersects(shape);
            let exitLoop = false;
            if (!intersects) {
              // TODO used the already created shape above
              placed.placeShape(shape, x1, y1);
              exitLoop = true;
            } else {
              const { pixelCount, shapeCount } =
                placed.getIntersects(shape);

              if (pixelCount * (shapeCount * 2) < bestIntersect) {
                bestFit = shape;
                bestIntersect = pixelCount * (shapeCount * 2);
              }

              if (counter === 2000) {
                red = true;
                if (bestFit) {
                  placed.placeShape(bestFit, bestFit.x, bestFit.y);
                  pathInfo = bestFit;
                  exitLoop = true;
                }
              } else if (translate === 'horizontal') {
                if ((x1 + inc) < pathInfo.maximum_x) {
                  x1 += inc;
                } else {
                  x1 = pathInfo.minimum_x;
                  translate = 'vertical';
                }
              } else if (translate === 'vertical') {
                if ((y1 + inc) < pathInfo.maximum_y) {
                  y1 += inc;
                } else {
                  y1 = pathInfo.minimum_y;
                  translate = 'diagonal';
                }
              } else if (translate === 'diagonal') {
                let stop = true;
                if ((x1 + inc) < pathInfo.maximum_x) {
                  stop = false;
                  x1 += inc;
                }
                if ((y1 + inc) < pathInfo.maximum_y) {
                  stop = false;
                  y1 += inc;
                }
                if (stop) {
                  x1 = pathInfo.maximum_x;
                  y1 = pathInfo.maximum_y;
                  translate = 'diag_r';
                }
              } else if (translate === 'diag_r') {
                let stop = true;
                if ((x1 - inc) > pathInfo.minimum_x) {
                  stop = false;
                  x1 -= inc;
                }
                if ((y1 - inc) > pathInfo.minimum_y) {
                  stop = false;
                  y1 -= inc;
                }
                if (stop) {
                  if (usePath < sizes.length - 1) {
                    usePath += 1;
                    shape = sizes[usePath];
                    pathInfo = sizes[usePath];
                    x1 = pathInfo.minimum_x;
                    y1 = pathInfo.minimum_y;
                    translate = 'horizontal';
                  } else if (bestFit) {
                    red = true;
                    placed.placeShape(bestFit, bestFit.x, bestFit.y);
                    pathInfo = bestFit;
                    exitLoop = true;
                  }
                }
              }
            }
            if (!exitLoop && (counter < 2000)) {
              innerWorker();
            } else {
              const stepObj = {
                pathInfo,
                pathId,
                red,
                text: phrase.text,
                x1: pathInfo.x,
                y1: pathInfo.y,
                item_color: obj.color(x),
              };

              drawQueue.push(stepObj);
              if (step) step([stepObj], pathInfo.getMemoryCanvas());
              x += 1;
              if (x < obj.phrases.length) {
                worker(obj);
              } else if (done) {
                done(drawQueue, placed);
              }
            }
          }, 0);
        };
        innerWorker();
      }, 0);
    };
    worker(this);
  }
}

export default Linear;
