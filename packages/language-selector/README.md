# Language selector

The language selector component is a simple drop down list allowing the end
user to choose a language.

The list of languages is read directly from the localization service made
available by using `i18n-translation-webpack-plugin`. When a user chooses a
language, that localization service is updated and notifies any listeners
automatically.

## Installation

```
yarn add @gctools-components/language-selector
```

## Usage

```
import React from 'react';
import LanguageSelector from '@gctools-components/language-selector';

const LanguageExample = () => (
  <div>
    <h1>Choose your language</h1>
    <LanguageSelector />
  </div>
);

export default LanguageExample;
```

## Copyright
© Her Majesty the Queen in Right of Canada, as represented by the Minister of
the National Research Council, 2017
