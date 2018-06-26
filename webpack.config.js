
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
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          }
        ]
      },
      resolve: {
        extensions: ['*', '.js']
      },
    plugins: [

    ]
}