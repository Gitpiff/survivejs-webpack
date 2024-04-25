const { mode } = require("webpack-nano/argv")
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");
const cssLoaders = [parts.autoprefix(), parts.tailwind()];

const commonConfig = merge([
    { entry: ['./src'] },
    parts.page({ title: "Demo" }),
    parts.extractCSS({ loaders: cssLoaders }),
]);

const productionConfig = merge([parts.eliminateUnusedCSS()]);

const developmentConfig = merge([
    { entry: ["./src/index.js"]},
    parts.devServer(),
]);

const getConfig = (mode) => {
    switch (mode) {
        case "production":
            return merge(commonConfig, productionConfig, { mode });
        case "development":
            return merge(commonConfig, developmentConfig, { mode });
        default:
            throw new Error(`Trying to use an unknown mode, ${mode}`);
    }
};

// const config = {
//     module: {
//         rules: [
//             {
//                 // Conditions to match -js file here
//                 test: /\.js$/,
//                 // Restrict matching to a directory
//                 include: Path.join(__dirname, "app"),
//                 exclude: (path) => path.match(/node_modules/),
//                 // Actions to apply loaders to the matched files
//                 use: "babel-loader"
//             },
//         ],
//     },
// };

// const config = {
//     rules: [
//         {
//             test: /\.js$/,
//             use: [
//                 (info) => ({
//                     loader: "babel-loader",
//                     options: { presets: ["env"] }
//                 })
//             ]
//         },
//     ],
// }

module.exports = getConfig(mode);
