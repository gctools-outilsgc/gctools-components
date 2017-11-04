/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import MemoryCanvas from '../memory-canvas';

const pathProps = require('svg-path-properties');

class Shape {
  constructor(
    svg, maxWidth, maxHeight, fontFamily, fontSize, text,
    swidth, sheight,
  ) {
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.scale_width = swidth || maxWidth;
    this.scale_height = sheight || maxHeight;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.svg = svg;
    this.text = text;
    this.canvas = new MemoryCanvas(maxWidth, maxHeight);

    this.minimum_x = 0;
    this.maximum_x = this.maxWidth;
    this.minimum_y = 0;
    this.maximum_y = this.maxHeight;

    this.offset_length_x = 0;
    this.offset_length_y = 0;

    this.path_width = 0;

    this.x = 0;
    this.y = 0;

    const tmpText = this.svg.append('text')
      .style('font-size', this.fontSize)
      .style('font-family', `'${this.fontFamily}', cursive`)
      .append('tspan')
      .text('W');

    let w = 20;
    try {
      w = tmpText.node().getComputedTextLength();
    } catch (e) { } // eslint-disable-line

    const characterWidth = w;
    const characterHeight = characterWidth;
    tmpText.remove();
    const cornerDiameter = (characterWidth + characterHeight) * 2;
    const cornerRadius = cornerDiameter / 2;

    const defs = this.svg.append('defs');
    const tmpText2 = this.svg.append('text')
      .style('font-family', `'${this.fontFamily}', cursive`)
      .attr('text-anchor', 'middle')
      .style('font-size', `${this.fontSize}px`)
      .text(text);

    try {
      w = tmpText2.node().getComputedTextLength();
    } catch (e) {
      w = characterWidth * text.length;
    }

    const textWidth = w;
    tmpText2.remove();
    defs.remove();

    this.characterHeight = characterHeight;
    this.characterWidth = characterWidth;
    this.cornerRadius = cornerRadius;
    this.textWidth = textWidth;
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

  generatePath(pathFunc, margin) {
    const marginX = margin || 0;
    const marginY = margin || 0;
    let path = false;
    const path1 = pathFunc(0);
    const props1 = pathProps.svgPathProperties(path1);
    const length1 = props1.getTotalLength();
    path = pathFunc((length1 - this.textWidth) / 2);
    const props2 = pathProps.svgPathProperties(path);
    const length2 = props2.getTotalLength();
    const point = props2.getPointAtLength(length2);
    if ((point.x + marginX > this.scale_width)
      || (point.y + marginY > this.scale_height)
      || (point.y + marginY < 0) || (point.x + marginX < 0)
    ) {
      path = false;
    } else {
      this.pathProperties = props2;
      this.path_width = length2;
      this.first = props2.getPointAtLength(1);
      this.last = point;
    }
    this.path = path;
    return path;
  }

  getMemoryCanvas() {
    return this.canvas;
  }

  placeShapeOnCanvas(x, y) {
    this.x = x;
    this.y = y;
    this.getMemoryCanvas().placeShape(this, x, y);
  }
}

export default Shape;
