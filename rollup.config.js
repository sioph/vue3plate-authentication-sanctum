import { defineConfig } from 'rollup'
import vue from 'rollup-plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default defineConfig({
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      exports: 'named'
    }
  ],
  plugins: [
    peerDepsExternal(),
    nodeResolve({
      preferBuiltins: false
    }),
    commonjs(),
    vue({
      target: 'browser',
      css: false,
      exposeFilename: false
    })
  ],
  external: [
    'vue',
    'vue-router',
    'vuex',
    'axios',
    '@fortawesome/fontawesome-svg-core',
    '@fortawesome/free-solid-svg-icons',
    '@fortawesome/vue-fontawesome'
  ]
}) 