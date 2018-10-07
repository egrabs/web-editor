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
    devtool: 'eval-source-map',
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
                exclude: /node_modules/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 2,
                            localIdentName: '[name]_[local]_[hash:base64]',
                            minimize: true,
                            modules: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /(\.txt$|\.svg$)/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        cssPlugin,
        htmlPlugin
    ]
}