

const targetTMSUrl = 'http://192.168.1.105:13101'
// const targetTMSUrl = 'http://192.168.1.140:82'

module.exports = {
  baseUrl: process.env.BASE_API,
  lintOnSave: true,

  configureWebpack: {
    externals: {
      BMap: 'BMap',
      BMapLib: 'BMapLib'
    },
    devServer: {
      proxy: {
        '/platform': {
          target: targetTMSUrl,
          ws: false
        }
      }
    }
  }
}
