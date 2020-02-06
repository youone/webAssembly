const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        demo: path.join(__dirname, '/src/demo.js'),
        mapping: path.join(__dirname, '/src/index.js'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, './dist'),
        library: 'mappinglib',
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
            chunks: ['demo']
        }),
    ],

    node: {
        fs: 'empty',
    }

};