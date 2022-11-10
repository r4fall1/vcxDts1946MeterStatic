module.exports = {
    publicPath: 'https://cdn.jsdelivr.net/gh/r4fall1/vcxDts1946MeterWeb@v1.1.1/prd/',
    configureWebpack: (config) => {
        config.output.filename = '[name].js';
        config.output.chunkFilename = '[name].js';
    },
    css: {
        extract: {
            filename: '[name].css',
            chunkFilename: '[name].css'
        }
    }
}