/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: path.resolve(__dirname, 'src/index.ts'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
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
        filename: `opentech-ux-lib-dev.js`,
        library: 'OpentechUX',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist-dev'),
    },
    plugins: [
        new CompressionPlugin({
            exclude: /[\\/]node_modules[\\/]/,
            test: /\.(js|jsx)$/,
        }),
    ],
};
