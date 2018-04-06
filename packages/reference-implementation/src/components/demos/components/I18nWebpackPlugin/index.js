/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import { Localizer }
  from '@gctools-components/i18n-translation-webpack-plugin/dist/localizer';

import Demo from '../../demo';
import { ExampleCode } from '../../_utils/CodeExample/source';

const demo = () => (
  <Demo
    name="I18n translation webpack plugin"
    component={Localizer}
    title={__('I18n translation webpack plugin')}
  >
    <p>
  Provides automatic creation of familiar gettext based translation files,
  while automatically injecting the translation strings into your application
  bundle.  Various levels of code splitting are supported.
    </p>

    <h3>Quickstart</h3>
    Add it like any other webpack plugin.
    <ExampleCode language="jsx">
      {`
  const I18nTranslationWebpackPlugin =
    require('@gctools-components/i18n-translation-webpack-plugin');

  module.exports = {
    plugins: [
      new I18nTranslationWebpackPlugin()
    ]
  };
      `}
    </ExampleCode>
    Encapsulate your strings with the translation function (double
    underscore by default).
    <ExampleCode language="jsx">
      {`
  // Regular javascript
  const mystring = __('This is a translation test.');

  // Inside JSX
  <span>{__('Translate inside JSX')}</span>
      `}
    </ExampleCode>
    Control the language using the globally available `localizer`.
    <ExampleCode language="jsx">
      {`
      localizer.setLanguage('fr_CA');
      `}
    </ExampleCode>
    The generated .po files will contain all the message ids found in your
    project with empty strings.  The translation function will return the
    message id until a string has been defined in the .po file.
    <ExampleCode language="gettext">
      {`
  // i18n/fr_CA/LC_MESSAGES/mypath/myfile.js.po
  msgid "This is a translation test."
  msgstr "Ceci est un test de traduction."

  msgid "Translate inside JSX"
  msgstr "Traduire à l'intérieur de JSX"
      `}
    </ExampleCode>

    <h3>Plugin options</h3>
    When you instantiate the plugin, you can pass several options to customize
    it&apos;s behaviour.  When an option is omitted, it takes on the default
    value shown below.
    <ExampleCode language="jsx">
      {`
  const I18nTranslationWebpackPlugin =
    require('@gctools-components/i18n-translation-webpack-plugin');

  module.exports = {
    plugins: [
      new I18nTranslationWebpackPlugin({
        // Array of locale IDs to support.
        languages: ['en_CA', 'fr_CA'],

        // Relative path from project root to store localization files.
        i18n_dir: 'i18n',

        // RegEx pattern used to process javascript files for translations
        extract_text_test: /\\.(js|jsx)$/,

        // RegEx pattern to ignore for translation
        extract_text_exclude: /node_modules/,

        // Type of code splitting (lazy loading) to use.
        codeSplitting: 'language',

        // The global function used for translation.
        translate_global: '__',

        // The global function used for the localizer.
        localizer_global: 'localizer',

        // Function name to add to 'window' for the localizer, or false.
        localizer_window: false,

        // The global function used for positional interpolation.
        interpolate_global: '___',
      })
    ]
  };
      `}
    </ExampleCode>
    <p>
    The codeSplitting option can be set to one of the following values.
    </p>
    <ExampleCode language="jsx">
      {`

       language          Create 1 bundle per language
       domain            Create 1 bundle per domain.
                         Each term extracted from the same file belong to the
                         same domain.
       language+domain   Create 1 bundle per domain, per language.
       all               Single language bundle with all terms and languages.
       none              Translation strings are bundled with the application
                         and loaded synchronously.  (no code splitting)

    `}
    </ExampleCode>

    <h3>Detailed use</h3>
    <p>
      Behind the scenes translations are provided by the&nbsp;
      <strong>
        <a
          href="https://messageformat.github.io/Jed/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Jed
        </a>
      </strong>&nbsp;
      library.  The global translation function mapped by this plugin is in
      fact a wrapper for Jed&apos;s&nbsp;
      <strong>translate(<i>key</i>).fetch()</strong>
      &nbsp;function.  This is very convenient for direct translations, but
      falls short when dealing with plurals or positional interpolation.
    </p>
    <h4>Pluralization</h4>
    <p>
      You can access the pluralization features of Jed by adding a quantity
      parameter to your translation.
    </p>
    <ExampleCode language="react">
      {`
// somefile.js
<ul>
  <li>{__('I have %d key', 0)}</li>
  <li>{__('I have %d key', 1)}</li>
  <li>{__('I have %d key', 5)}</li>
  <li>{__('%dI have a key', 1)}</li>
  <li>{__('%dI have a key', 2)}</li>
</ul>

// i18n/en_CA/LC_MESSAGES/somefile.js.po
#, python-format
msgid "I have %d key"
msgid_plural "I have %d keys"
msgstr[0] ""
msgstr[1] ""

#, python-format
msgid "%dI have a key"
msgid_plural ""
msgstr[0] "I have a key"
msgstr[1] "I have some keys"
      `}
    </ExampleCode>
    <p>
      Although we don&apos;t want to display a value with &quot;I have a
      key&quot;, the interpolation variable &quot;%d&quot; is still included,
      otherwise gettext-loader would be unable to determine that we want to
      express a plural form, and would not indicate such in the generated .pot
      file.  We simply need to provide a translated form that doesn&apos;t
      include the variable.
    </p>
    <p>
      Alternatively, we could add the plural forms directly into each language
      file - but that would be more time consuming.
    </p>
    <p>
      The code above produces the following output:
    </p>
    <ul>
      <li>{__('I have %d key', 0)}</li>
      <li>{__('I have %d key', 1)}</li>
      <li>{__('I have %d key', 5)}</li>
      <li>{__('%dI have a key', 1)}</li>
      <li>{__('%dI have a key', 2)}</li>
    </ul>

    <h4>Positional interpolation</h4>
    <p>
      Certain languages change the order of words, for example adjectives in
      english appear before the subject; while in french they appear after.
    </p>
    <p>
      These features are exposed using the interpolation function which is 3
      underscores by default.
    </p>
    <ExampleCode language="react">
      {`
// somefile.js
{___(__("I have a %1$s %2$s."), __("red"), __("car") )}

// i18n/fr_CA/LC_MESSAGES/somefile.js.po
msgid "red"
msgstr "rouge"

msgid "car"
msgstr "voiture"

msgid "I have a %1$s %2$s."
msgid_plural ""
msgstr[0] "J'ai une %2$s %1$s."
msgstr[1] ""
    `}
    </ExampleCode>
    <p>
      The code above produces the output below.  Since the site is built using
      this plugin, try changing languages to see how it behaves.
    </p>
    <ul>
      <li>{___(__('I have a %1$s %2$s.'), __('red'), __('car'))}</li>
    </ul>
    <h3>Linting</h3>
    <p>
      Because this plugin introduces several globally available functions, you
      should inform the linter, if applicable.
    </p>
    <ExampleCode language="json">
      {`
// package.json

"eslintConfig": {
  "globals": {
    "__": true,
    "___": true,
    "localizer": true
  }
}
    `}
    </ExampleCode>

  </Demo>
);

export default LocalizedComponent(demo);
