import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import "vant/lib/index.css";
import "@/assets/scss/index.scss";
import lazyPlugin from "vue3-lazy";
import noFullScreen from "@/mixins/noFullScreen";
const app = createApp(App);
app.use(store).use(router).use(Vant);

app.mixin(noFullScreen);

app.use(lazyPlugin, {
  loading: require("@/assets/images/default.png"),
  //error: "error.png",
});
app.mount("#app");
