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

const FontFaceObserver = require('fontfaceobserver');
const d3 = require('d3');
const equal = require('deep-equal');

/**
 * Phrase clouds are in many ways analogous to their more popular counterparts
 * word clouds.  The key difference is that a phrase cloud is capable of
 * providing greater context by including combination of words that add meaning
 * to a recommendation, rather than single words which introduce ambiguity.
 *
 * The Treemap phrase cloud uses a classic treemap layout to display the
 * phrases.
 */
export default class PhraseCloudTreeMap extends Component {
  static propTypes = {
    /** Width of underlying svg element */
    width: PropTypes.number,
    /** Height of underlying svg element */
    height: PropTypes.number,
    /** The font size of the most important phrase */
    maxFontSize: PropTypes.number,
    /** The font size of the least important phrase */
    minFontSize: PropTypes.number,
    /** Array of { text, size } objects to draw */
    phrases: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
    })).isRequired,
    /** Font family to use when drawing phrases.  "Alfa Slab One" works well,
     * but make sure to include it in your application and set
     * `waitForFontFace` to `true`. */
    fontFamily: PropTypes.string,
    /** If the specified font family is external and cannot be loaded, fallback
     * this font instead */
    fallbackFontFamily: PropTypes.string,
    /** Use font-face-observer to wait for fonts to be available.  This is
     * necessary because computations regarding character size will be affected
     * by the missing font. */
    waitForFontFace: PropTypes.bool,
  };
  static defaultProps = {
    width: 250,
    height: 200,
    maxFontSize: 18,
    minFontSize: 4,
    fontFamily: 'courier new',
    waitForFontFace: false,
    fallbackFontFamily: 'courier',
  };


  constructor(props) {
    super();
    this._redrawPhrases = this._redrawPhrases.bind(this);
    this._waitForFont = this._waitForFont.bind(this);
    this.fontFamily = props.fontFamily;
    this.update = false;
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
            `The font "${this.fontFamily}" is not available, `,
            `falling back to "${this.props.fallbackFontFamily}".`,
          );
          this.fontFamily = this.props.fallbackFontFamily;
          this._redrawPhrases();
        }
      });
    } else {
      this._redrawPhrases();
    }
  }

  _redrawPhrases() {
    const words = this.props.phrases;
    const data = {
      name: 'Phrases',
      children: [],
    };

    // eslint-disable-next-line prefer-spread
    const maximumSize = Math.max.apply(Math, words.map(d => d.size));
    // eslint-disable-next-line prefer-spread
    const minimumSize = Math.min.apply(Math, words.map(d => d.size));

    const getFontSize = (x) => {
      const b = parseInt(this.props.maxFontSize, 10);
      const a = parseInt(this.props.minFontSize, 10);
      const min = parseInt(minimumSize, 10);
      const max = parseInt(maximumSize, 10);

      if (min === max) {
        return this.props.maxFontSize;
      }
      return (((b - a) * (x - min)) / (max - min)) + a;
    };

    for (let x = 0; x < words.length; x += 1) {
      data.children.push({
        name: `phrase${x}`,
        children: [{ name: words[x].text, size: words[x].size }],
      });
    }

    function sumBySize(d) {
      return d.size;
    }

    function wrap(text) {
      const marginR = 5;
      text.each(function eachText() {
        const wrapText = d3.select(this);
        const wrapWords = wrapText.data()[0].data.name.split(/\s+/).reverse();
        const width = wrapText.data()[0].x1 - wrapText.data()[0].x0;
        const height = wrapText.data()[0].y1 - wrapText.data()[0].y0;
        const initialFontSize = wrapText.attr('font-size');
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.1; // ems
        const x = wrapText.attr('x');
        const y = wrapText.attr('y');
        const dy = 0;

        let tspan = wrapText.text(null)
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('font-size', initialFontSize)
          .attr('dy', `${dy}em`);

        let bestFontSize = initialFontSize;
        const wordWithBreaks = [];

        while (word = wrapWords.pop()) { // eslint-disable-line
          line.push(word);
          tspan.text(line.join(' '));
          tspan.attr('font-size', bestFontSize);
          if (tspan.node().getComputedTextLength() > width - marginR) {
            line.pop();
            tspan.text(line.join(' '));
            while (
              (tspan.node().getComputedTextLength() > width - marginR) &&
              (bestFontSize > 0)) {
              bestFontSize -= 1;
              tspan.attr('font-size', bestFontSize);
            }
            if (line.join(' ').trim() !== '') {
              wordWithBreaks.push(line.join(' '));
            }
            line = [word];
          }
        }
        if ((line.length > 0) && (line.join(' ').trim() !== '')) {
          tspan.text(line.join(' '));
          while (
            (tspan.node().getComputedTextLength() > width - marginR) &&
            (bestFontSize > 0)) {
            bestFontSize -= 1;
            tspan.attr('font-size', bestFontSize);
          }
          wordWithBreaks.push(line.join(' '));
        }
        line = [];

        // Make sure it fits height wise
        while
        ((tspan.node().getBBox().height * wordWithBreaks.length > height)
        && (bestFontSize > 0)) {
          bestFontSize -= 1;
          tspan.attr('font-size', bestFontSize);
        }

        wrapText.attr('font-size', bestFontSize);
        tspan.text('');

        for (let i = 0; i < wordWithBreaks.length; i += 1) {
          tspan = wrapText.append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', `${((lineNumber += 1) * lineHeight) + dy}em`)
            .text(wordWithBreaks[i]);
        }
      });
    }
    if (this.svgElement) {
      while (this.svgElement.firstChild) {
        this.svgElement.removeChild(this.svgElement.firstChild);
      }
    }

    const svg = d3.select(this.svgElement);
    const { width, height } = this.props;

    const fader = color => d3.interpolateRgb(color, '#fff')(0.2);
    const color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));
    const format = d3.format(',d');

    const treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([width, height])
      .round(true)
      .paddingInner(1);

    const root = d3.hierarchy(data)
      .eachBefore((d) => {
        // eslint-disable-next-line
        d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
      })
      .sum(sumBySize)
      .sort((a, b) => b.height - a.height || b.value - a.value);

    treemap(root);

    const cell = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    cell.append('rect')
      .attr('id', d => d.data.id)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .style('fill', d => color(d.parent.data.id))
      .style('stroke-width', '1')
      .style('fill-opacity', 0.1)
      .style('stroke', d => color(d.parent.data.id));

    cell.append('clipPath')
      .attr('id', d => `clip-${d.data.id}`)
      .append('use')
      .attr('xlink:href', d => `#${d.data.id}`);
    cell.append('text')
      .attr('x', 4)
      .attr('y', 0)
      .attr('font-size', d => getFontSize(d.value))
      .style('font-family', `'${this.fontFamily}', cursive`)
      .attr('clip-path', d => `url(#clip-${d.data.id})`)
      .style('fill', d => color(d.parent.data.id))
      .call(wrap);

    cell.append('title')
      .text(d => `Score: ${format(d.value)}\n${d.data.name}`);
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
