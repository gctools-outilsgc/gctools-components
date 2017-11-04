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

const uuid = require('uuid/v4');
const d3 = require('d3');

class Grid extends Placement {
  constructor(options) {
    const pmod = 1.5;
    super(Object.assign(options, {
      scale_width: options.width / pmod,
      scale_height: options.height / pmod,
      shapes: [],
      shape_chooser: (phrase, idx) => {
        const test = idx - (Math.floor(idx / 4) * 4);
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
    let x = 0;
    let quadrant = 0;
    const usePath = 0;
    const quadrantSpace = [
      { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
    ];
    const worker = (obj) => {
      setTimeout(() => {
        const { phrase } = obj.phrases[x];
        const { sizes } = obj.shaper.getShapesForPhrase(phrase, x);
        const pathId = uuid();

        const shape = sizes[usePath];

        let x1 = shape.minimum_x;
        let y1 = shape.minimum_y;

        if (y1 < 0) {
          throw new Error('this is weird');
        }

        switch (quadrant) {
          case 0: {
            x1 += quadrantSpace[quadrant].x;
            y1 += quadrantSpace[quadrant].y + quadrantSpace[quadrant + 1].y;
            quadrantSpace[quadrant].x += shape.characterHeight;
            quadrantSpace[quadrant].y += shape.characterHeight;
            break;
          }
          case 1: {
            x1 += shape.maximum_x;
            x1 += quadrantSpace[quadrant].x;
            y1 += quadrantSpace[quadrant].y + quadrantSpace[quadrant - 1].y;
            quadrantSpace[quadrant].x -= shape.characterHeight;
            quadrantSpace[quadrant].y += shape.characterHeight;
            break;
          }
          case 2: {
            x1 += shape.maximum_x;
            x1 += quadrantSpace[quadrant].x;
            y1 += shape.maximum_y;
            y1 += quadrantSpace[quadrant].y + quadrantSpace[quadrant + 1].y;
            quadrantSpace[quadrant].x -= shape.characterHeight;
            quadrantSpace[quadrant].y -= shape.characterHeight;
            break;
          }
          case 3: {
            x1 += quadrantSpace[quadrant].x;
            y1 += shape.maximum_y;
            y1 += quadrantSpace[quadrant].y + quadrantSpace[quadrant - 1].y;
            quadrantSpace[quadrant].x += shape.characterHeight;
            quadrantSpace[quadrant].y -= shape.characterHeight;
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
        x += 1;
        if (x < obj.phrases.length) {
          quadrant += 1;
          if (quadrant >= 4) {
            quadrant = 0;
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

export default Grid;
