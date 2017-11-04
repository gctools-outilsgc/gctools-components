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
import CTL from '../shape/corner-top-left';
import CTR from '../shape/corner-top-right';
import CBR from '../shape/corner-bottom-right';
import CBL from '../shape/corner-bottom-left';
import WWB from '../shape/wordwrapbox';
import H from '../shape/horizontal';

const uuid = require('uuid/v4');
const d3 = require('d3');

class Onion extends Placement {
  constructor(options) {
    const pmod = 2;
    super(Object.assign(options, {
      scale_width: options.width / pmod,
      scale_height: options.height / pmod,
      shapes: [],
      shape_chooser: (phrase, idx) => {
        if (idx === options.phrases.length - 1) return [H, WWB];
        if (idx === options.phrases.length - 2) return CTL;
        if (idx === options.phrases.length - 3) return CBR;
        const t = options.phrases.length - 4;
        const test = (t - idx) - (Math.floor((t - idx) / 4) * 4);
        switch (test) {
          case 0:
            return CTL;
          case 1:
            return CTR;
          case 2:
            return CBR;
          case 3:
            return CBL;
          default:
            throw new Error('Error placing phrases');
        }
      },
    }));
    const fader = color => d3.interpolateRgb(color, '#fff')(0.2);
    this.color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));
  }
  run(done, step) {
    super.run();
    const drawQueue = [];

    const placed = new MemoryCanvas(this.width, this.height);
    let x = this.phrases.length - 1;
    let quadrant = 0;
    const quadrantSpace = [];
    for (let i = 0; i < 10; i += 1) {
      quadrantSpace.push({ x: 0, y: 0 });
    }
    const worker = (obj) => {
      setTimeout(() => {
        const { phrase } = obj.phrases[x];
        const { sizes } = obj.shaper.getShapesForPhrase(phrase, x);
        const pathId = uuid();

        const shape = sizes[0];

        let x1 = shape.minimum_x;
        let y1 = shape.minimum_y;

        if (y1 < 0) {
          throw new Error('this is weird');
        }
        switch (quadrant) {
          case 0: {
            // center the first block (this step only happens once)
            x1 = (obj.width / 2) - (shape.last.x / 2);
            y1 = (obj.height / 2) - (shape.last.y / 2);
            quadrantSpace[3].x = x1;
            quadrantSpace[3].y = y1 - shape.characterHeight;

            quadrantSpace[1].x = shape.last.x;
            quadrantSpace[1].y = shape.last.y;

            quadrantSpace[2].y = y1;
            quadrantSpace[2].x = x1;

            break;
          }
          case 1: {
            // Upper left corner of block (this step only happens once)
            x1 = (obj.width / 2) - (shape.last.x / 2);
            y1 = quadrantSpace[3].y
              - ((shape.first.y / 2) - (quadrantSpace[1].y / 2));
            quadrantSpace[3].x = x1;
            quadrantSpace[3].y = y1;
            break;
          }
          case 2: {
            // Lower right corner (this step only happens once)
            x1 = (obj.width / 2);
            y1 = quadrantSpace[2].y + shape.characterHeight;
            quadrantSpace[4].x = x1 + (shape.last.x / 2);
            quadrantSpace[5].y = y1;
            break;
          }
          case 3: {
            // Start of 4-corner loop, (upper left)
            x1 = (obj.width / 2) - shape.last.x;
            y1 = quadrantSpace[quadrant].y - shape.characterHeight;
            quadrantSpace[quadrant].x = x1 + shape.last.x;
            // quadrantSpace[quadrant].y = y1;
            break;
          }
          case 4: {
            // 4-corner loop (upper right)
            x1 = (obj.width / 2);
            y1 = quadrantSpace[quadrant - 1].y - shape.characterHeight;
            quadrantSpace[quadrant].x = x1 + shape.last.x;
            quadrantSpace[quadrant - 1].y = y1 - shape.characterHeight;
            break;
          }
          case 5: {
            // 4-corner loop (bottom right)
            x1 = (obj.width / 2);
            y1 = quadrantSpace[quadrant].y;
            quadrantSpace[quadrant].x = x1;
            quadrantSpace[quadrant].y = y1;
            break;
          }
          case 6: {
            // 4-corner loop (bottom left)
            x1 = (obj.width / 2) - shape.last.x;
            y1 = quadrantSpace[quadrant - 1].y + shape.characterHeight;
            quadrantSpace[3].x = x1;
            // quadrantSpace[3].y = y1;
            break;
          }

          default:
            break;
        }
        shape.placeShapeOnCanvas(x1, y1);
        placed.placeShape(shape, x1, y1);
        const stepObj = {
          pathInfo: shape,
          pathId,
          red: false,
          text: phrase.text,
          x1,
          y1,
          item_color: obj.color(x),
        };

        drawQueue.push(stepObj);
        if (step) step([stepObj], shape.getMemoryCanvas());
        x -= 1;
        if (x >= 0) {
          quadrant += 1;
          if (quadrant >= 7) {
            quadrant = 3;
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

export default Onion;
