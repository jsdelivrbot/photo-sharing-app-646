
const webpack = require('webpack');

module.exports = {
    entry:
        [
            './public/js/main.js'
        ],
    watch: true,
    output: {
        path: __dirname + '/public/js/',
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                use:['style-loader','css-loader','sass-loader']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
          })
    ],
    resolve: {
        extensions: ['*', '.js']
    },
}