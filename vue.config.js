const Timestamp = new Date().getTime();
module.exports = {
    lintOnSave: false,
    devServer: {
        port: 8184, // 端口
        proxy: {
            '/api': {
                target: 'http://192.168.0.3:19095/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                }
            }
        }
    },
    configureWebpack: {
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
          filename: `[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
          chunkFilename: `[name].${process.env.VUE_APP_Version}.${Timestamp}.js`
        }
      },
    // 输出文件目录
    outputDir: 'D:/wwwroot/flyLongApp/build',
}
