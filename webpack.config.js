const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin') // optimization指定なしでデフォで入る。指定したら上書きされて消える

const devMode = !!process.env.DEBUG

module.exports = {
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'assets'),
    //    disableHostCheck: true,
  },
  devtool: 'inline-source-map',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    minimize: !devMode,
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  output: {
    filename: devMode ? 'app.js' : 'app.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    // Reflect .envrc
    new webpack.EnvironmentPlugin({
      DEBUG: false,
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/static/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'style.css' : 'style.[hash].css',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
}
