import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';

export default {
  input: './index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    json(),
    cjs(),
    resolve({ preferBuiltins: true }),
    babel(),
    builtins(),
  ]
};
