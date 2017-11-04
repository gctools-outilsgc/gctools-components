/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import PhraseCloudShapes from '../PhraseCloudShapes';

class Placement {
  constructor(options) {
    this.options = Object.assign({
      width: 0,
      height: 0,
      scale_width: 0,
      scale_height: 0,
      phrases: [],
      MAX_FONT_SIZE: 75,
      MIN_FONT_SIZE: 4,
      svg: null,
      shaper: undefined,
      fontFamily: 'Arial',
    }, options);

    this.shaper = false;
    this.width = this.options.width;
    this.height = this.options.height;
    this.phrases = this.options.phrases;
    this.options = options;
    this.setShaper(this.options.shaper);
  }

  setShaper(shaper) {
    if (!shaper) {
      this.shaper = new PhraseCloudShapes(this.options);
      this.phrases = this.shaper.getPhrasesSortedBySize();
      // this.phrases = this.shaper.getPhrasesSortedByLength();
    } else {
      this.shaper = shaper;
    }
  }

  setPhrases(phrases) {
    this.phrases = phrases;
  }

  getNamedShapeOrSmallest(idx, shapeName) {
    let min = this.options.width * 2;
    let smallest = null;
    const match = (Array.isArray(shapeName)) ? shapeName : [shapeName];
    let priority = match.length;
    let priomatch = false;

    for (let s = 0; s <= this.phrases[idx].sizes.length - 1; s += 1) {
      const st = this.phrases[idx].sizes[s];
      if (st.path_width < min) {
        smallest = st;
        min = st.path_width;
      }
      const MatchIdx = match.indexOf(st.constructor.name);
      if (MatchIdx === 0) {
        return st;
      } else if (MatchIdx > 0) {
        if (MatchIdx < priority) {
          priority = MatchIdx;
          priomatch = st;
        }
      }
    }
    if (priomatch) {
      return priomatch;
    }
    return smallest;
  }

  run() {
    if (this.shaper === false) {
      throw new Error('Cannot call Placement without a valid Shaper');
    }
  }
}

export default Placement;
