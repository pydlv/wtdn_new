// vue.config.js
module.exports = {
    chainWebpack: config => {
        config.module
            .rule('raw-loader')
            .test(/\.txt$/i)
            .use('raw-loader')
            .loader('raw-loader')
            .end()
    }
}
