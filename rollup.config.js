// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'cjs',
  },
  plugins: [
    typescript({
      exclude: ['./src/__test__/**'],
      sourceMap: true,
    }),
    commonjs(),
  ],
};
