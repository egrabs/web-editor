const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssPlugin = new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
});

const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/client/index.html',
    filename: './index.html'
})

module.exports = {
    entry: './src/client/index.jsx',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
          rules: [
            {
                test: /\.jsx?$/,
                resolve: {
                    extensions: ['.js', '.jsx']
                },
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        cssPlugin,
        htmlPlugin
    ]
}