// const devMode = process.env.NODE_ENV !== 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// require('babel-polyfill');
require("@babel/polyfill");

const outputDirectory = 'dist';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  // entry: './src/index.jsx',
  entry: ['@babel/polyfill', './src/index.jsx'],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: `${__dirname}/dist/public`,
    filename: 'main.js',
  },
  // mode : devMode ? 'development' : 'production',
  // watch : devMode,
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
};
