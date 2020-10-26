const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
   devtool: 'source-map',
   entry: path.resolve(__dirname, '/src/app.js'),
   mode: 'development',
   module: {
      rules: [
         {
            exclude: /[\\/]node_modules[\\/]/,
            test: /\.(js|jsx)$/,
            use: {
               loader: 'babel-loader',
            },
         },
      ],
   },
   optimization: {
      minimize: true,
      minimizer: [
         new TerserPlugin({
            parallel: true,
            terserOptions: {
               ecma: 2020,
               ie8: true,
               compress: true,
               safari10: true,
            },
         }),
      ],
   },
   output: {
      filename: 'ux-key-lib.js',
      library: 'UXKey',
      path: path.resolve(__dirname, 'dist-dev'),
   },
   plugins: [
      new CleanWebpackPlugin(),
      new CompressionPlugin({
         test: /\.(js|jsx)$/,
         exclude: /[\\/]node_modules[\\/]/,
      }),
   ],
};
