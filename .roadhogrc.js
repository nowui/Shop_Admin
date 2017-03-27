const path = require('path');
const pxtorem = require('postcss-pxtorem');

const svgSpriteDirs = [
  require.resolve('antd').replace(/warn\.js$/, ''),
  path.resolve(__dirname, 'src/svg/'),
];

export default {
  'entry': 'src/index.js',
  'svgSpriteLoaderDirs': svgSpriteDirs,
  "theme": "./theme.config.js",
  'disableCSSModules': false,
  'less': false,
  'publicPath': '/',
  'outputPath': './dist',
  'autoprefixer': null,
  'proxy': null,
  'extraBabelPlugins': [
    'transform-runtime',
    ['import', { 'libraryName': 'antd', 'style': true }]
  ],
  'env': {
    'development': {
      'extraBabelPlugins': [
        'dva-hmr'
      ]
    }
  }
}
