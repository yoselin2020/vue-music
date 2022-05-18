import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import lazyPlugin from "vue3-lazy";
import noFullScreen from "@/mixins/noFullScreen";
import "@/assets/scss/index.scss";

// 导入flexible.js
// import "amfe-flexible";

import Vant from "vant";

const app = createApp(App);

app.use(Vant);

app.use(store).use(router);

app.mixin(noFullScreen);

app.use(lazyPlugin, {
  loading: require("@/assets/images/xhboy.png"),
  //error: "error.png",
});
app.mount("#app");
