const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? 'https://cdn.jsdelivr.net/gh/r4fall1/vcxDts1946MeterWeb@v' + version + '/prd/' : '',
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