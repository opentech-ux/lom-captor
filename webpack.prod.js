const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
   entry: path.resolve(__dirname, '/src/app.js'),
   mode: 'production',
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
            extractComments: false,
            parallel: true,
            terserOptions: {
               compress: true,
               ecma: 2020,
               format: {
                  comments: false,
               },
               ie8: true,
               safari10: true,
            },
         }),
      ],
   },
   output: {
      clean: true,
      filename: 'opentech-ux-lib.js',
      library: 'OpentechUX',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
   },
   plugins: [
      new CompressionPlugin({
         exclude: /[\\/]node_modules[\\/]/,
         test: /\.(js|jsx)$/,
      }),
   ],
};
