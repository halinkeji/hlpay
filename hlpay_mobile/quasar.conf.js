/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v1.quasar.dev/quasar-cli/quasar-conf-js

// const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

module.exports = function (ctx) {
  return {
    // https://v1.quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://v1.quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v1.quasar.dev/quasar-cli/boot-files
    boot: [
      'i18n',
      'axios',
      'utils'
    ],

    // https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'ionicons-v4',
      // 'mdi-v5',
      'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'history', // available values: 'hash', 'history'
      publicPath: process.env.NODE_ENV === 'production' ? '/m/hlpay/' : '/',

      env: ctx.dev
        ? {
            BASE_URL_API: 'https://www.halin.cc/hlpay' // dev 开发环境
          }
        : {
            BASE_URL_API: 'https://www.halin.cc/hlpay' // prod 生产 环境
          },
      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      transpileDependencies: [],

      // rtl: false, // https://v1.quasar.dev/options/rtl-support
      // preloadChunks: true,
      showProgress: false,
      gzip: true,
      analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      extendWebpack (cfg, { isServer, isClient }) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          // 添加目录结构别名
          css: path.resolve(__dirname, './src/css'),
          assets: path.resolve(__dirname, './src/assets'),
          pages: path.resolve(__dirname, './src/pages'),
          utils: path.resolve(__dirname, './src/utils'),
          '@': path.resolve(__dirname, './src')
        }
        // cfg.module.rules.push({
        //           enforce: 'pre',
        //           test: /\.(js|vue)$/,
        //           loader: 'eslint-loader',
        //           exclude: /node_modules/
        //         })
      }

      // https://v1.quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      // chainWebpack (chain) {
      //   chain.plugin('eslint-webpack-plugin')
      //     .use(ESLintPlugin, [{ extensions: ['js', 'vue'] }])
      // }
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 8080,
      open: true // opens browser window automatically
    },

    // https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'en-us', // Quasar language pack
      config: {},

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      components: [],
      directives: [],

      // Quasar plugins
      plugins: [
        'Loading',
        'Notify',
        'LoadingBar',
        'LocalStorage',
        'SessionStorage',
        'Cookies',
        'Meta',
        'Dialog',
        'Loading'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://v1.quasar.dev/options/animations
    animations: [],

    // https://v1.quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://v1.quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: 'hlframework frontend mobile hlpay',
        short_name: 'hlframework frontend mobile hlpay',
        description: 'hlframework frontend mobile hlpay',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    }
  }
}
