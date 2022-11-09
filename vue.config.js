module.exports = {
    configureWebpack: (config) => {
        config.output.filename = '[name].[hash:8].js';
        config.output.chunkFilename = '[name].[hash:8].js';
    },
    css: {
        extract: {
            filename: '[name].[hash:8].css',
            chunkFilename: '[name].[hash:8].css'
        }
    }
}