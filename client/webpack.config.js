const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { InjectManifest, GenerateSW } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const is_prod = process.env.NODE_ENV === 'production'
// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

const plugins = [
  new HtmlWebpackPlugin({
    title: 'Webpack Fun - Generated',
    filename: 'index.html',
    template: path.join(__dirname, 'src/index.html'),
    inject: 'body'
  }),
  new MiniCssExtractPlugin({
    filename: is_prod ? 'style.[contenthash].css' : 'style.css'
  }),
]

if (is_prod) plugins.push(...[
  new InjectManifest({
    swSrc: path.resolve("./src-sw.js")
  }),
  new WebpackPwaManifest({
    name: 'Just Another Text Editor',
    short_name: 'jate',
    description: 'A text editor for your browser',
    background_color: '#555555',
    start_url: './',
    publicPath: './',
    inject: true,
    theme_color: '#555555',
    fingerprints: false,
    display: "standalone",
    icons: [
      {
        src: path.resolve('src/images/logo.png'),
        destination: path.join('assets/icons'),
        sizes: [96, 128, 192, 256, 384, 512],
        ios: true
      },
    ]
  })
])
module.exports = () => {
  return {
    mode: is_prod ? 'production' : 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    plugins: plugins,
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ],
    },
  };
};
