const registerRouter = require("./backend/router");
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  // publicPath: "./",
  publicPath: process.env.NODE_ENV === "production" ? "/music/" : "/",
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        @import "@/assets/scss/variable.scss";
         @import "@/assets/scss/mixin.scss";
        `,
      },
    },
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      const BundleAnalyzerPlugin =
        require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
      config.plugins.push(new BundleAnalyzerPlugin());
      config.externals = {
        vue: "Vue",
        axios: "axios",
        "vue-router": "VueRouter",
        "better-scroll": "BetterScroll",
        vuex: "Vuex",
        nprogress: "NProgress",
        // swiper: "Swiper",
      };
    } else {
      // 为开发环境修改配置...
    }
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }
      registerRouter(devServer.app);
      return middlewares;
    },
  },
});
