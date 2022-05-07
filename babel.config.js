const plugins = ["@vue/babel-plugin-transform-vue-jsx"];
// 生产环境移除console
if (process.env.NODE_ENV === "production") {
  plugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    ...plugins,
    // externals 和 cdn 加速后,这里的按需引入需要注释掉不然会出问题
    // [
    //   "import",
    //   {
    //     libraryName: "vant",
    //     libraryDirectory: "es",
    //     style: true,
    //   },
    // ],
  ],
};
