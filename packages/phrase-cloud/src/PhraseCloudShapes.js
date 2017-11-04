/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

import CornerTopLeft from './shape/corner-top-left';
import CornerTopRight from './shape/corner-top-right';
import CornerBottomRight from './shape/corner-bottom-right';
import CornerBottomLeft from './shape/corner-bottom-left';
import Horizontal from './shape/horizontal';
import Vertical from './shape/vertical';
import WordWrapBox from './shape/wordwrapbox';
import WordWrapBox3 from './shape/wordwrapbox3';

export default class PhraseCloudShapes {
  constructor(options) {
    this.options = Object.assign({
      width: 0,
      height: 0,
      scale_width: 0,
      scale_height: 0,
      phrases: [],
      MAX_FONT_SIZE: 75,
      MIN_FONT_SIZE: 4,
      shape_chooser: undefined,
      fontFamily: 'Arial',
      shapes: [
        CornerTopLeft,
        CornerTopRight,
        CornerBottomRight,
        CornerBottomLeft,
        Horizontal,
        Vertical,
        WordWrapBox,
        WordWrapBox3,
      ],
      svg: null,
    }, options);
    this.shapes = this.options.shapes;
    if ((this.shapes.length === 0) && this.options.shape_chooser) {
      this.shapes = [false];
    }
    this.length_sorted_phrases = [];
    this.sizedPhrases = [];
    this.shape_bin_cache = { phrases: [], data: [] };
    if (this.options.svg === null) {
      throw new Error('You must specify a SVG element');
    }
    const {
      width, height, phrases, MAX_FONT_SIZE, MIN_FONT_SIZE,
    }
      = this.options;
    if ([width, height].indexOf(0) >= 0) {
      throw new Error('Missing some config values...');
    }
    if (phrases.length === 0) {
      throw new Error('Cannot instantiante with no phrases');
    }
    if ((MAX_FONT_SIZE <= 0) || (MAX_FONT_SIZE < MIN_FONT_SIZE)) {
      throw new Error('Invalid MAX_FONT_SIZE');
    }
    if ((MIN_FONT_SIZE <= 0) || (MIN_FONT_SIZE > MAX_FONT_SIZE)) {
      throw new Error('Invalid MAX_FONT_SIZE');
    }
    this.options.phrases.sort((a, b) => a.size - b.size);

    if (!this.options.scale_width) this.options.scale_width = width;
    if (!this.options.scale_height) this.options.scale_height = height;

    // eslint-disable-next-line prefer-spread
    this.maximum_size = Math.max.apply(Math, phrases.map(d => d.size));
    // eslint-disable-next-line prefer-spread
    this.minimum_size = Math.min.apply(Math, phrases.map(d => d.size));
    this.maximumCharacterSize = 0;

    const ls = new Array(this.options.phrases.length);
    for (let i = 0; i < this.options.phrases.length; i += 1) {
      const { sizes } = this.getShapesForPhrase(this.options.phrases[i], i);
      ls[i] = { phrase: this.options.phrases[i], sizes };
    }
    this.sizedPhrases = ls;
  }

  getPhrasesSortedByLength() {
    try {
      return (
      /* eslint-disable prefer-spread */
        this.sizedPhrases.sort((a, b) =>
          Math.min.apply(Math, b.sizes.map(s => s.path_width)) -
          Math.min.apply(Math, a.sizes.map(s => s.path_width))));
      /* eslint-enable prefer-spread */
    } catch (e) { } // eslint-disable-line no-empty
    return null;
  }

  getPhrasesSortedBySize() {
    try {
      return this.sizedPhrases.sort((a, b) => b.phrase.size - a.phrase.size);
    } catch (e) { } // eslint-disable-line no-empty
    return null;
  }

  getPhrasesUnsorted() {
    return this.sizedPhrases;
  }

  getShapes() {
    return this.shapes;
  }

  _getBin(phrase) {
    for (let b = 0; b < this.bins.length; b += 1) {
      const bin = this.bins[b];
      if (bin.phrases.indexOf(phrase) >= 0) {
        return bin;
      }
    }
    return null;
  }

  getShapeFromCache(phrase) {
    const idx = this.shape_bin_cache.phrases.indexOf(phrase);
    if (idx >= 0) {
      return this.shape_bin_cache.data[idx];
    }
    return null;
  }

  addShapeToCache(phrase, data) {
    // const id = uuid5(phrase, `bincache_${position}`);
    this.shape_bin_cache.phrases.push(phrase);
    this.shape_bin_cache.data.push(data);
  }

  getShapesForPhrase(phrase, idx) {
    let path = false;
    let cached = false;
    let sizes = [];
    let fontSize = false;
    // eslint-disable-next-line no-cond-assign
    if (!this.options.shape_chooser
      && (cached = this.getShapeFromCache(phrase))) {
      sizes = cached.sizes; // eslint-disable-line prefer-destructuring
    } else {
      const b = parseInt(this.options.MAX_FONT_SIZE, 10);
      const a = parseInt(this.options.MIN_FONT_SIZE, 10);
      const min = parseInt(this.minimum_size, 10);
      const max = parseInt(this.maximum_size, 10);
      const x = parseInt(phrase.size, 10);

      if (min === max) {
        fontSize = this.options.MAX_FONT_SIZE;
      } else {
        fontSize = (((b - a) * (x - min)) / (max - min)) + a;
      }

      let shape = false;

      let { shapes } = this;
      if (this.options.shape_chooser) {
        shapes = this.options.shape_chooser(phrase, idx);
        if (!Array.isArray(shapes)) {
          shapes = [shapes];
        }
      }
      for (let i = 0; i < shapes.length; i += 1) {
        let ShapeObj = false;
        ShapeObj = shapes[i];
        shape = new ShapeObj(
          this.options.svg,
          this.options.width,
          this.options.height,
          this.options.fontFamily,
          fontSize,
          phrase.text,
          this.options.scale_width,
          this.options.scale_height,
        );
        path = shape.getPath();

        if (path === false) continue; // eslint-disable-line no-continue
        if (shape.textWidth < (shape.path_width + 3)) {
          sizes.push(shape);
          if (shape.characterHeight > this.maximumCharacterSize) {
            this.maximumCharacterSize = shape.characterHeight;
          }
        }
      }
      if (sizes.length === 0) {
        throw new Error(`No available shapes, using font ${fontSize}`);
      }

      // eslint-disable-next-line no-underscore-dangle
      this.addShapeToCache(phrase, { sizes });
    }

    return { sizes };
  }
}
