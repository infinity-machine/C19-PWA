const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.
module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack Fun - Generated',
        filename: 'index.html',
        template: path.join(__dirname, 'src/index.html'),
        inject: 'body'
      }),
      new MiniCssExtractPlugin({
        filename: 'style.[contenthash].css'
      }),
      new InjectManifest({
        swSrc: path.resolve("./src-sw.js")
      }),
      new WebpackPwaManifest({
        name: 'TextBoi Editor',
        short_name: 'TBE',
        description: 'A text editor for your browser',
        background_color: '#555555',
        start_url: './',
        publicPath: './',
        inject: true,
        theme_color: '#555555',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            destination: path.join('assets/icons'),
            sizes: [96, 128, 192, 256, 384, 512], // multiple sizes,
            ios: true
          },
        ]
      })
    ],

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
