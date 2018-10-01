const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/client/index.html',
    filename: './index.html'
})

module.exports = {
    entry: ['./src/client/index.js'],
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
                use: 'babel-loader',
            }
        ]
    },
    plugins: [htmlPlugin],
    mode: 'development',
    devtool: (process.env.NODE_ENV === 'development') ? 'eval-source-map' : false
}