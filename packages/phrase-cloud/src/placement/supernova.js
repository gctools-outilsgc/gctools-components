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

class SuperNova extends Placement {
  constructor(options) {
    const pmod = 1;
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
    let quadrant = 0;
    let north = this.height / 2;
    let south = this.height / 2;

    const quadrantSpace = [];
    for (let i = 0; i < 10; i += 1) {
      quadrantSpace.push({ x: 0, y: 0 });
    }
    const worker = (obj) => {
      setTimeout(() => {
        const { phrase } = obj.phrases[x];
        const pathId = uuid();

        let shape = false;
        let x1 = obj.width / 2;
        let y1 = obj.height / 2;
        let stepY = true;
        let initX = obj.width / 2;

        switch (quadrant) {
          case 0: {
            // first move, center.
            shape =
              obj.getNamedShapeOrSmallest(
                x,
                ['WordWrapBox', 'WordWrapBox3', 'Horizontal'],
              );
            break;
          }
          case 1: {
            // Start of 4-corner loop, (upper left)
            shape = obj.getNamedShapeOrSmallest(x, 'CornerTopLeft');
            initX = (obj.width / 2) - (shape.last.x / 2);
            if (shape.constructor.name !== 'CornerTopLeft') {
              initX = obj.width;
            }
            break;
          }
          case 2: {
            // 4-corner loop (upper right)
            shape = obj.getNamedShapeOrSmallest(x, 'CornerTopRight');
            initX = (obj.width / 2) - (shape.last.x / 2);
            if (shape.constructor.name !== 'CornerTopRight') {
              initX = 0;
            }
            break;
          }
          case 3: {
            // 4-corner loop (bottom right)
            shape = obj.getNamedShapeOrSmallest(x, 'CornerBottomRight');
            initX = (obj.width / 2) - (shape.last.x / 2);
            if (shape.constructor.name !== 'CornerBottomRight') {
              initX = 0;
            }
            break;
          }
          case 4: {
            // 4-corner loop (bottom left)
            shape = obj.getNamedShapeOrSmallest(x, 'CornerBottomLeft');
            initX = (obj.width / 2) - (shape.last.x / 2);
            if (shape.constructor.name !== 'CornerBottomLeft') {
              initX = obj.width;
            }
            break;
          }

          default:
            throw new Error('Unable to match quadrant');
        }

        for (let p = 0; p < obj.height; p += 1) {
          switch (quadrant) {
            case 0: {
              // first move, center.
              x1 = (obj.width / 2) - (shape.last.x / 2);
              y1 = (obj.height / 2) - (shape.last.y / 2);
              south = y1;
              north = y1 - shape.first.y;
              break;
            }
            case 1: {
              // Start of 4-corner loop, (upper left)
              if (stepY) {
                y1 = north - p;
                stepY = false;
              } else {
                x1 -= (shape.characterHeight / 2);
                if (x1 < shape.minimum_x) {
                  x1 = initX;
                  stepY = true;
                }
              }
              break;
            }
            case 2: {
              // 4-corner loop (upper right)
              if (stepY) {
                y1 = north - p;
                stepY = false;
              } else {
                x1 += (shape.characterHeight / 2);
                if (x1 > shape.maximum_x + shape.characterHeight) {
                  x1 = initX;
                  stepY = true;
                }
              }
              break;
            }
            case 3: {
              // 4-corner loop (bottom right)
              if (stepY) {
                y1 = (south - shape.first.y - shape.characterHeight) + p;
                stepY = false;
              } else {
                x1 += (shape.characterHeight / 2);
                if (x1 > shape.maximum_x + shape.characterHeight) {
                  x1 = initX;
                  stepY = true;
                }
              }
              break;
            }
            case 4: {
              // 4-corner loop (bottom left)
              if (stepY) {
                y1 = (south - shape.first.y - shape.characterHeight) + p;
                stepY = false;
              } else {
                x1 -= (shape.characterHeight / 2);
                if (x1 < shape.minimum_x) {
                  x1 = initX;
                  stepY = true;
                }
              }
              break;
            }

            default:
              break;
          }
          shape.placeShapeOnCanvas(x1, y1);
          if (!placed.intersects(shape)) {
            break;
          }
          shape.getMemoryCanvas().clear();
        }

        if (
          !placed.intersects(shape)
          && x1 > shape.minimum_x
          && x1 < shape.maximum_x
          && y1 > shape.minimum_y
          && y1 < shape.maximum_x
        ) {
          placed.placeShape(shape, x1, y1);
          const stepObj = {
            pathInfo: shape,
            pathId,
            red: false,
            text: phrase.text,
            score: phrase.size,
            x1,
            y1,
            item_color: obj.color(x),
          };

          drawQueue.push(stepObj);
          if (step) step([stepObj], shape.getMemoryCanvas());
        }
        x += 1;
        if (x < obj.phrases.length) {
          quadrant += 1;
          if (quadrant >= 5) {
            quadrant = 1;
          }
          worker(obj);
        } else if (done) {
          done(drawQueue, placed);
        }
      }, 0);
    };
    worker(this);
  }
}

export default SuperNova;
