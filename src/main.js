import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/scss/index.scss";
import lazyPlugin from "vue3-lazy";
import noFullScreen from "@/mixins/noFullScreen";
import {
  Button,
  Search,
  SwipeCell,
  Circle,
  Swipe,
  SwipeItem,
  Progress,
} from "vant";

const vantCom = [Button, Search, SwipeCell, Circle, Swipe, SwipeItem, Progress];

const app = createApp(App);

vantCom.forEach((com) => app.use(com));

app.use(store).use(router);

app.mixin(noFullScreen);

app.use(lazyPlugin, {
  loading: require("@/assets/images/xhboy.png"),
  //error: "error.png",
});
app.mount("#app");
