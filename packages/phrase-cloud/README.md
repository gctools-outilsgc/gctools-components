# Phrase cloud

At NRC we've been working on innovative ways to visualize recommendation
data.  One of the methods we've developped is called the "Phrase cloud".

Phrase clouds are in many ways analogous to their more popular counterparts
word clouds.  The key difference is that a phrase cloud is capable of
providing greater context by including combinations of words that add
meaning to a recommendation, rather than single words, which introduce
ambiguity.

## Installation

```
yarn add @gctools-components/phrase-cloud
```

## Usage

```
import React from 'react';
import PhraseCloud from '@gctools-components/phrase-cloud';

const PhraseCloudExample = () => (
  <PhraseCloud
    waitForFontFace
    fontFamily="Roboto Condensed"
    placement="onion"
    phrases={[
      { text: 'This phrase is O.K.', size: 7 },
      { text: 'I am not an important phrase', size: 4 },
      { text: 'I am also of no importance', size: 4 },
      { text: 'I am important', size: 13 },
      { text: 'GCTools rocks!', size: 13 },
      { text: 'I am GREAT.', size: 14 },
    ]}
  />
);
export default PhraseCloudExample;
```

## Copyright
© Her Majesty the Queen in Right of Canada, as represented by the Minister of
the National Research Council, 2017
