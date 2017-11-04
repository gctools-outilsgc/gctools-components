
<div align="center">
<img  src="https://avatars0.githubusercontent.com/u/8387256" alt="GCTools" />
</div>
<div align="center">

![Build Status](https://travis-ci.org/gctools-outilsgc/gctools-components.svg?branch=master)

</div>

<div align="center">

# GCTools-NRC Components

### Research and innovation to benefit all public servants

<p>
  Re-usable Javascript components primarily written by the National Research
  Council for use within GCTools and other GoC sites.
</p>

</div>


## Contributing

The `gctools-nrc-components` repo is managed as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) that is composed of many npm packages.  These packages are controlled by [lerna](https://github.com/lerna/lerna).

To get started, install lerna.

    yarn global add lerna

Prepare the development environment.

    lerna bootstrap

Most components use [storybook](https://github.com/storybooks/storybook) to
ease development.  Simply go into the package you want to work on, and start
storybook.

    yarn run storybook

### How to create a new component

A new component helper exists at the base of the repo to help you create a new
component with minimal effort.  From the base of the repo run the following:

    yarn new component my-component

## Reference implementation

The reference implementation contains documentation and examples for all
components in this repo and can be found in `packages/reference-implementation`
.  The reference implementation doesn't use storybook, start it as shown below.

    yarn start

## Copyright

© Her Majesty the Queen in Right of Canada, as represented by the Minister of
the National Research Council, 2017

## License

Unless otherwise specified, all packages in this monorepo is licensed under the
terms of the MIT license, available at the root of the repo in the `LICENSE`
file.
