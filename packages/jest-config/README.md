# jest-config

Provides a preconfigured Jest environment to run GCTools component tests with.

## How to use it

First, install it.

    yarn add @gctools-components/jest-config

Next update the scripts section of your package.json like this:

    "scripts": {
      // ...
      "test": "jest --rootDir . --config ./node_modules/@gctools-components/jest-config/index.js"
    }

## Copyright
© Her Majesty the Queen in Right of Canada, as represented by the Minister of
the National Research Council, 2017
