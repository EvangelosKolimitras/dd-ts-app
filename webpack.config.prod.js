const path = require("path")
const CleanWebpackPlugin = require("clean-webpack-plugin")
module.exports = {
    mode: "production",
    entry: "./src/app.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },

    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },

    plugins: [
        new CleanWebpackPlugin.CleanWebpackPlugin()
    ]
}