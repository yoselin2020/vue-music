import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/scss/index.scss";
import lazyPlugin from "vue3-lazy";
import noFullScreen from "@/mixins/noFullScreen";
// import storage from "storejs";
// import { FAVORITE_SONG_KEY, recentlyPlayListKEY } from "@/assets/js/constant";
//
// import { myProcessSongs } from "@/api/song";
//
// import { processSongs } from "@/service/song";
// 处理歌曲url地址过期问题
// let recentlyPlayListSong1 = [],
//   recentlyPlayListSong2 = [];

// let favoriteListSong1 = [],
//   favoriteListSong2 = [];
// // 最近播放的歌曲
// const recentlyPlayList = storage.get(recentlyPlayListKEY) || [];
// // 我喜欢的歌曲
// const favoriteList = storage.get(FAVORITE_SONG_KEY) || [];
//
// recentlyPlayList.forEach((song) => {
//   if (song.isWY) {
//     recentlyPlayListSong2.push(song);
//     return;
//   }
//   recentlyPlayListSong1.push(song);
// });
//
// if (recentlyPlayListSong1.length > 0) {
//   processSongs(recentlyPlayListSong1).then(
//     (result) => {
//       let value = storage.get(recentlyPlayListKEY);
//       if (value && Array.isArray(value)) {
//         storage.set(recentlyPlayListKEY, [...value, ...result]);
//         store.commit("setRecentlyPlayList", [...value, ...result]);
//       } else {
//         storage.set(recentlyPlayListKEY, [...result]);
//         store.commit("setRecentlyPlayList", [...result]);
//       }
//     },
//     (error) => {}
//   );
// }

// []  处理最近播放歌曲的url
// Promise.all([
//   processSongs(recentlyPlayListSong1),
//   myProcessSongs(recentlyPlayListSong2),
// ]).then((result) => {
//   let [result1 = [], result2 = []] = result;
//   let arr = [];
//   if (result1.length > 0) {
//     arr.push(...result1);
//   }
//   if (result2.length > 0) {
//     arr.push(...result2);
//   }
//   console.log(arr, "arra");
//   storage.set(recentlyPlayListKEY, arr);
// });
//
// favoriteList.forEach((song) => {
//   if (song && song.isWY) {
//     favoriteListSong2.push(song);
//     return;
//   }
//   favoriteListSong1.push(song);
// });
// //处理我喜欢的歌曲的url
// Promise.all([
//   processSongs(favoriteListSong1),
//   myProcessSongs(favoriteListSong2),
// ]).then((result) => {
//   let [result1 = [], result2 = []] = result;
//   let arr = [];
//   if (result1.length > 0) {
//     arr.push(...result1);
//   }
//   if (result2.length > 0) {
//     arr.push(...result2);
//   }
//   console.log(arr, "arrb");
//   storage.set(FAVORITE_SONG_KEY, arr);
// });

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
