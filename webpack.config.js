const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './index.tsx',
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.json'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // {
            //     test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
            //     loader: 'url-loader',
            //     options: {
            //       name: 'flexmonster-icons.[ext]',
            //       publicPath: ''
            //     }
            // }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'templates', 'index.html'),
        }),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        liveReload: true,
        compress: true,
        port: 3000,
    },
}
