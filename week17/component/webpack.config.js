const path = require('path')

module.exports = {
    entry: './main2.jsx',
    mode: 'development',
    optimization: {
        minimize: false
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist/')
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            ["@babel/plugin-transform-react-jsx", { pragma: 'createElement' }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.view/,
                use: [
                    {
                        loader: require.resolve('./myLoader.js')
                    }
                ]
            }
        ]
    }
}