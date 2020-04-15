const path = require("path")

module.exports = {
    mode: "development",
    entry: "./src/app.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "dist"
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
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.js']
    }
}