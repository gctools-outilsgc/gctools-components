/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from './placement/grid';
import Linear from './placement/linear';
import Random from './placement/random';
import Onion from './placement/onion';
import SuperNova from './placement/supernova';
// TODO: remove placements as dependencies (make user choose)

const d3 = require('d3');
const FontFaceObserver = require('fontfaceobserver');
const equal = require('deep-equal');

const format = d3.format(',d');

/**
 * At NRC we've been working on innovative ways to visualize recommendation
 * data.  One of the methods we've developped is called the "Phrase cloud".
 *
 * Phrase clouds are in many ways analogous to their more popular counterparts
 * word clouds.  The key difference is that a phrase cloud is capable of
 * providing greater context by including combinations of words that add
 * meaning to a recommendation, rather than single words, which introduce
 * ambiguity.
 */
class PhraseCloudSquare extends Component {
  constructor(props) {
    super();
    this._redrawPhrases = this._redrawPhrases.bind(this);
    this._waitForfont = this._waitForFont.bind(this);
    this._replaceSvgWith = this._replaceSvgWith.bind(this);
    this._emptySvg = this._emptySvg.bind(this);
    this.pathObjects = [];
    this.textObjects = [];
    this.max_size = 0;
    this.fontFamily = props.fontFamily;
    this.update = 0;
  }

  componentDidMount() {
    this._waitForFont();
  }

  shouldComponentUpdate(next) {
    if (!equal(this.props, next)) {
      if (this.props.fontFamily !== next.fontFamily) {
        this.fontFamily = next.fontFamily;
        this.update = 1;
      } else {
        this.update = 2;
      }
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    if (this.update > 0) {
      if (this.update === 1) {
        this._waitForFont();
      } else {
        this._redrawPhrases();
      }
      this.update = 0;
    }
  }

  _waitForFont() {
    if (this.props.waitForFontFace) {
      const observer = new FontFaceObserver(this.fontFamily);
      observer.load().then(() => {
        this._redrawPhrases();
      }).catch(() => {
        if (this.fontFamily !== this.props.fallbackFontFamily) {
          console.warn( // eslint-disable-line no-console
            `The font "${this.fontFamily}" is not available, to`,
            ` "${this.props.fallbackFontFamily}".`,
          );
          this.fontFamily = this.props.fallbackFontFamily;
          this._redrawPhrases();
        }
      });
    } else {
      setTimeout(() => this._redrawPhrases(), 20);
    }
  }

  _replaceSvgWith(callback) {
    if (callback) {
      const objects = [];
      Object.keys(this.pathObjects).forEach((p) => {
        objects.push(this.pathObjects[p].object);
        objects.push(this.pathObjects[p].text);
        if (this.pathObjects[p].pathOutline) {
          objects.push(this.pathObjects[p].pathOutline);
        }
      });
      if (this.zoom_group) {
        objects.push(this.zoom_group);
      }
      callback(() => {
        let p = false;
        while (p = objects.pop()) { // eslint-disable-line no-cond-assign
          p.remove();
        }
      });
    }
  }

  _emptySvg() {
    // Clear the SVG of previously rendered items
    let p = false;
    while (p = this.pathObjects.pop()) { // eslint-disable-line no-cond-assign
      p.object.remove();
      p.text.remove();
      if (p.pathOutline) p.pathOutline.remove();
    }
    if (this.zoom_group) this.zoom_group.remove();
  }

  _redrawPhrases() {
    // this._emptySvg();

    this._replaceSvgWith((done) => {
      // Setup SVG zoom
      const root = d3.select(this.svgElement);
      this.zoom_group = root.append('g');
      const svg = this.zoom_group.append('g');
      svg.append('rect')
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .attr('width', this.props.width)
        .attr('height', this.props.height);
      const zoomed = () => {
        svg.attr('transform', d3.event.transform);
      };
      const zoom = d3.zoom()
        .scaleExtent([1, 140])
        .on('zoom', zoomed);

      this.zoom_group.call(zoom);
      let Pla = false;
      if (this.props.placement === 'grid') {
        Pla = Grid;
      } else if (this.props.placement === 'random') {
        Pla = Random;
      } else if (this.props.placement === 'onion') {
        Pla = Onion;
      } else if (this.props.placement === 'linear') {
        Pla = Linear;
      } else if (this.props.placement === 'supernova') {
        Pla = SuperNova;
      } else {
        Pla = SuperNova;
      }

      // Initialize placement algorithm
      const placement = new Pla({
        phrases: this.props.phrases,
        svg,
        width: this.props.width,
        height: this.props.height,
        MAX_FONT_SIZE: this.props.maxFontSize,
        MIN_FONT_SIZE: this.props.minFontSize,
        fontFamily: this.fontFamily,
      });

      // Execute the algorithm and place elements on SVG
      const defs = svg.append('defs');
      placement.run((drawQueue, placed) => {  // eslint-disable-line
        // placed.canvas.map((xv, xx) => { // eslint-disable-line
        //   xv.map((v, y) => { // eslint-disable-line
        //     // if (y > this.props.height) throw new Error('wtf y');
        //     svg.append('rect')
        //       .attr('width', 1)
        //       .attr('height', 1)
        //       .style('fill', '#444')
        //       .attr('transform', `translate(${xx},${y})`);
        //   });
        // });

        for (let i = drawQueue.length - 1; i >= 0; i -= 1) {
          const {
            pathInfo, pathId, red, text, x1, y1, item_color, score,
          }
            = drawQueue[i];

          this.pathObjects.push({
            object: defs.append('path')
              .attr('d', pathInfo.path)
              .attr('id', pathId)
              .attr('transform', 'translate(' +
                `${x1 + pathInfo.offset_length_x},` +
                `${y1 + pathInfo.offset_length_y})`),
            text: svg.append('text')
              .style('font-family', `'${this.fontFamily}', cursive`)
              .style('opacity', (red) ? 0.5 : 1)
              .attr('text-anchor', 'middle')
              .attr('font-size', pathInfo.fontSize)
              .append('textPath')
              .attr('startOffset', '50%')
              .attr('xlink:href', `#${pathId}`)
              .attr('fill', item_color)
              .text(text),
          });
          this.pathObjects[this.pathObjects.length - 1].text
            .append('title')
            .text(`Score: ${format(score)}\n${text}`);

          if (red) {
            this.pathObjects[this.pathObjects.length - 1].pathOutline =
              svg.append('path')
                .attr('d', pathInfo.path)
                .attr('fill', 'none')
                .attr('stroke', 'red')
                .attr('transform', 'translate(' +
                  `${x1 + pathInfo.offset_length_x},` +
                  `${y1 + pathInfo.offset_length_y})`)
                .attr('stroke-width', '1px');
          }
        }
        done();
      });
    });
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <svg
          ref={(c) => { this.svgElement = c; }}
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }
}

PhraseCloudSquare.defaultProps = {
  placement: 'supernova',
  width: 250,
  height: 200,
  maxFontSize: 18,
  minFontSize: 4,
  fontFamily: 'courier new',
  waitForFontFace: false,
  fallbackFontFamily: 'courier',
};

PhraseCloudSquare.propTypes = {
  /** Width of underlying svg element */
  width: PropTypes.number,
  /** Height of underlying svg element */
  height: PropTypes.number,
  /** The font size of the most important phrase */
  maxFontSize: PropTypes.number,
  /** The font size of the least important phrase */
  minFontSize: PropTypes.number,
  /** Placement algorithm to use (will most likely be deprecated) */
  placement: PropTypes.string,
  /** Array of { text, size } objects to draw */
  phrases: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
  })).isRequired,
  /** Font family to use when drawing phrases.  "Alfa Slab One" works well,
   * but make sure to include it in your application and set `waitForFontFace`
   * to `true`. */
  fontFamily: PropTypes.string,
  /** If the specified font family is external and cannot be loaded, fallback
   * this font instead */
  fallbackFontFamily: PropTypes.string,
  /** Use font-face-observer to wait for fonts to be available.  This is
   * necessary because computations regarding character size will be affected
   * by the missing font. */
  waitForFontFace: PropTypes.bool,
};

export default PhraseCloudSquare;
