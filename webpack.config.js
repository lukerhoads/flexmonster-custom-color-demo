const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js', '.jsx', '.tsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                loader: 'url-loader',
                options: {
                  name: 'flexmonster-icons.[ext]',
                  publicPath: ''
                }
            },
        ],
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: './templates/index.html',
        // }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'templates' }
            ]
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        liveReload: true,
        compress: true,
        port: 3000,
    },
}
