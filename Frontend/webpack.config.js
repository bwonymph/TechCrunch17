const path = require("path");

module.exports = {
    entry : "./src/index.jsx",
    output : {
        path : path.resolve(__dirname, "build"),
        filename : "bundle.js",
    },
    module : {
        rules : [{
            test: /\.jsx?$/,
            include: [
              path.resolve(__dirname, "src")
            ],
            loader : "babel-loader",
            options : {
                presets : ["es2015", "react"]
            }
        }],
    }
};