/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

const fs = require('fs');
const path = require('path');


const target = path.resolve('./packages/eslint-config');
const destinationDir = path.resolve('./node_modules/@gctools-components');
const dest = path.join(destinationDir, 'eslint-config');

if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir);
}

if (fs.existsSync(dest)) {
  fs.unlinkSync(dest);
}

fs.symlinkSync(target, dest);
