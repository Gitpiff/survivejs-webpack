const { WebpackPluginServe } = require("webpack-plugin-serve");
const { MiniHtmlWebpackPlugin } = require("mini-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const glob = require("glob");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");

const ALL_FILES = glob.sync(path.join(__dirname, "src/*.js"));

exports.devServer = () => ({
    watch: true,
    plugins: [
        new WebpackPluginServe({
            port: parseInt(process.env.PORT, 10) || 8080,
            static: "./dist",
            liveReload: true,
            waitForBuild: true
        }),
    ],
});

exports.page = ({ title }) => ({
    plugins: [new MiniHtmlWebpackPlugin({ context: {title} })],
});

// Files ending with .css will invoke these loaders
exports.extractCSS = ({ options = {}, loaders = [] } = {}) => {
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader, options },
                        "css-loader"
                    ].concat(loaders),
                    sideEffects: true,
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
        ],
    }
};

// Loads Tailwind
exports.tailwind = () => ({
    loader: "postcss-loader",
    options: {
        postcssOptions: { plugins: [require("tailwindcss")()] },
    },
});

//Purges unused CSS
exports.eliminateUnusedCSS = () => ({
    plugins: [
        new PurgeCSSPlugin({
            paths: ALL_FILES,
            extractors: [
                {
                    extractor: (content) =>
                        content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
                    extensions: ["html"],
                },
            ],
        }),
    ],
});

// Sets autoprefixing -order matters, place after tailwind is done loading-
exports.autoprefix = () => ({
    loader: "postcss-loader",
    options: {
        postcssOptions: { plugins: [require("autoprefixer")()] },
    },
});
