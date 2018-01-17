const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Is the current build a development build
const IS_DEV = (process.env.NODE_ENV === 'dev')

const dirNode = 'node_modules'
const dirApp = path.join(__dirname, 'app')
const dirAssets = path.join(__dirname, 'assets')

const appHtmlTitle = 'Webpack Boilerplate'

/**
 * Webpack Configuration
 */
module.exports = {
  entry: {
    vendor: [
      'lodash'
    ],
    bundle: path.join(dirApp, 'index')
  },
  resolve: {
    modules: [
      dirNode,
      dirApp,
      dirAssets
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV: IS_DEV
    }),

    new webpack.ProvidePlugin({
      // lodash
      '_': 'lodash'
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.ejs'),
      title: appHtmlTitle
    })
  ],
  module: {
    rules: [
      // BABEL
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          compact: true
        }
      },

      // STYLES
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: IS_DEV
            }
          }
        ]
      },

      // CSS / SASS
      {
        test: /\.scss/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: IS_DEV
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: IS_DEV,
              includePaths: [dirAssets]
            }
          }
        ]
      },

      // EJS
      {
        test: /\.ejs$/,
        loader: 'ejs-loader'
      },

      // IMAGES
      {
        test: /\.(jpe?g|png|gif|svg|m4a)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },

      { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', exclude: /node_modules/ }
    ]
  }
}
