/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import initStoryshots from '@storybook/addon-storyshots';

const jest = require('jest');

jest.mock('material-ui/RefreshIndicator');
jest.mock('material-ui/internal/Tooltip');
jest.mock('react-dotdotdot');
jest.mock('react-masonry-component');

initStoryshots();
