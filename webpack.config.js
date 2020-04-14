const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

// The path to the cesium source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const olSource = 'node_modules/openlayers/src/ol';

module.exports = {
    mode: 'development',
    entry: {
        index: path.join(__dirname, '/src/index.js'),
        demo: path.join(__dirname, '/src/demo.js'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, './dist'),
        library: 'wasm',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            // {
            //     test: /\.tsx?$/,
            //     loader: 'ts-loader',
            //     exclude: /node_modules/,
            // },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [/node_modules/, path.resolve(__dirname, 'src')]
            },
            {
                test: /\.(woff(2)?|ttf|eot|png|gif)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/'
                    }
                }]
            },
            {
                test: /\.js$/,
                loader: "exports-loader",
                include: [path.resolve(__dirname, 'src/wasm')]
            },
            // {
            //     test: /\.wasm$/,
            //     type: "javascript/auto",
            //     loader: "file-loader",
            //     include: [path.resolve(__dirname, 'src/wasm')]
            // },
            // {
            //     test: /\.wasmm$/,
            //     loaders: ['arraybuffer-loader']
            // }
        ]
    },
    // resolve: {
    //     extensions: [".tsx", ".ts", ".js"]
    // },

    devServer: {
        port:3000,
        contentBase: path.join(__dirname, './dist'),
        inline: true,
        hot: true,
        historyApiFallback: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['demo'],
            filename: "index.html"
        }),
        // new HtmlWebpackPlugin({
        //     chunks: ['index'],
        // }),
        new CopyWebpackPlugin([{from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'}]),
        new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
        new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('')
        }),
        // Split cesium into a seperate bundle
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'cesium',
        //     minChunks: function (module) {
        //         return module.context && module.context.indexOf('cesium') !== -1;
        //     }
        // })
    ],
    node: {
        fs: 'empty',
    }

};