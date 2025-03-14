const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

// const url = 'http://127.0.0.1:9999'
// const url = 'http://trobs.gateway.aukeyit.com'
// const url = 'http://172.16.46.26:9999'
// const url = 'http://trobs.aukeyit.com'
// const url = 'http://192.168.1.84:9999'
const url = process.env.VUE_APP_API_BASE_URL

function resolve(dir) {
  return path.join(__dirname, ".", dir)
}

// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require("compression-webpack-plugin")
// 定义压缩文件类型
const productionGzipExtensions = ["js", "css", "scss"]

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    // 忽略的打包文件
    config.externals({
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "element-ui": "ELEMENT"
    })

    //默认的SVG加载需排除掉这个目录，否则会出报错
    config.module.rule("svg").exclude.add(resolve("src/icons")).end()

    //增加svg加载器
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
  },
  transpileDependencies: ["avue-plugin-transfer", "avue-plugin-ueditor"],
  // 配置转发代理
  devServer: {
    // port:80,
    // disableHostCheck: true,
    proxy: {
      "/api/product": {
        target: "http://192.168.11.22:8607",
        ws: true,
        pathRewrite: {
          "^/api/product/": ""
        }
      },
      // "/api/product": {
      //   target: "http://192.168.11.22:8607",
      //   ws: true,
      //   pathRewrite: {
      //     "^/api/product/": ""
      //   }
      // },
      "/api/": {
        target: url,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      const plugins = []
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log", "console.info"]
            },
            warnings: false
          },
          sourceMap: false,
          parallel: true
        })
      )
      // 去掉打印警告
      class CustomFilterPlugin {
        constructor({ exclude }) {
          this.exclude = exclude
        }

        apply(compiler) {
          compiler.hooks.afterEmit.tap("CustomFilterPlugin", (compilation) => {
            compilation.warnings = compilation.warnings.filter((warning) => !this.exclude.test(warning.message))
          })
        }
      }

      // 生产环境
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false // 是否删除源文件
        })
      )

      plugins.push(
        new CustomFilterPlugin({
          exclude: /Conflicting order between:/
        })
      )

      config.plugins = [...config.plugins, ...plugins]
    }
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto"
    })
  },
  css: {
    extract:
      process.env.NODE_ENV === "production"
        ? {
            ignoreOrder: true
          }
        : false
  }
}
