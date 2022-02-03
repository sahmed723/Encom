const webpack = require('webpack');
const cssnano = require('cssnano');
const glob = require('glob');
const path = require('path');

const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = require('./site.config');

// Hot module replacement
const hmr = new webpack.HotModuleReplacementPlugin();

// Optimize CSS assets
const optimizeCss = new OptimizeCssAssetsPlugin({
  assetNameRegExp: /\.css$/g,
  cssProcessor: cssnano,
  cssProcessorPluginOptions: {
    preset: [
      'default',
      {
        discardComments: {
          removeAll: true,
        },
      },
    ],
  },
  canPrint: true,
});

// Clean webpack
const clean = new CleanWebpackPlugin();

// Copy assets
const copy = new CopyWebpackPlugin({
  patterns: [
    {
      from: 'images',
      to: 'images',
      globOptions: {
        ignore: ['**/favicon.*'],
      },
    },
  ],
});

// Stylelint
const stylelint = new StyleLintPlugin();

// Extract CSS
const cssExtract = new MiniCssExtractPlugin({
  filename: 'style.[contenthash].css',
});

// HTML generation
const paths = [];
const generateHTMLPlugins = () => glob.sync('./src/*.html').map((dir) => {
  const filename = path.basename(dir);

  if (filename !== '404.html') {
    paths.push(filename);
  }

  return new HTMLWebpackPlugin({
    filename,
    template: path.join(config.root, config.paths.src, filename),
    meta: {
      viewport: config.viewport,
    },
    minify: {
      removeRedundantAttributes: false, // do not remove type="text"
    },
  });
});

// Webpack bar
const webpackBar = new WebpackBar({
  color: '#5F48FF',
});

module.exports = [
  clean,
  config.env === 'production' && copy,
  stylelint,
  cssExtract,
  ...generateHTMLPlugins(),
  config.env === 'production' && optimizeCss,
  webpackBar,
  config.env === 'development' && hmr,
].filter(Boolean);
