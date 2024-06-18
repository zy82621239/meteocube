const { defineConfig } = require('@vue/cli-service')

var webpack = require("webpack") 

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: (config) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery"
      })
  )
  },
  devServer:{
    proxy: {
      '/api': {
        target: 'https://api.open-meteo.com/',
        changeOrigin: true, 
        pathRewrite: {
          '/api': ''
        }, 
      },
      '/archive-api': {
        target: 'https://archive-api.open-meteo.com/',
        changeOrigin: true, 
        pathRewrite: {
          '/archive-api': ''
        }, 
      },
      '/air-quality-api': {
          target: 'https://air-quality-api.open-meteo.com/',
          changeOrigin: true, 
          pathRewrite: {
            '/air-quality-api': ''
          },
      },
      // '${api}': {
      //   target: 'https://api.open-meteo.com/',
      //   changeOrigin: true, 
      //   pathRewrite: {
      //     '${api}': ''
      //   }, 
      // },
      // '${archive-api}': {
      //   target: 'https://archive-api.open-meteo.com/',
      //   changeOrigin: true, 
      //   pathRewrite: {
      //     '${archive-api}': ''
      //   }, 
      // },
      // '${air-quality-api}': {
      //     target: 'https://air-quality-api.open-meteo.com/',
      //     changeOrigin: true, 
      //     pathRewrite: {
      //       '${air-quality-api}': ''
      //     },
      // },
    }
  }
})
