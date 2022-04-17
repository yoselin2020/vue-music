import { createStore, createLogger } from "vuex";
import { FAVORITE_SONG_KEY } from "@/assets/js/constant";
import storage from "storejs";
const debug = process.env.NODE_ENV !== "production";

import { PLAY_MODE } from "@/assets/js/constant";
import { shuffle } from "@/assets/js/util";
import { Toast } from "vant";
export default createStore({
  plugins: debug ? [createLogger()] : [],
  state: {
    // 播放器列表
    playList: [],
    // 顺序播放列表
    sequenceList: [],
    // 播放器是否全屏状态
    fullScreen: false,
    // 播放模式
    playMode: PLAY_MODE.sequence,
    // 当前播放歌曲的索引
    currentIndex: -1,
    // 播放的状态
    isPlaying: false,
    // 喜欢的歌曲
    favoriteSongList: storage.get(FAVORITE_SONG_KEY) || [],
  },
  getters: {
    playList: (state) => state.playList,
    // 当前播放的歌曲
    currentSong: (state) => state.playList[state.currentIndex] || {},
    // 是否全屏
    fullScreen: (state) => state.fullScreen,
    // 是否正在播放
    isPlaying: (state) => state.isPlaying,
    // 当前播放歌曲索引
    currentIndex: (state) => state.currentIndex,
    // 歌曲的长度
    songsLength: (state) => state.playList.length,
    //喜欢的歌曲
  },
  mutations: {
    // 是否正在播放
    setPlaying(state, isPlaying) {
      state.isPlaying = isPlaying;
    },
    // 播放器列表
    setPlayList(state, list) {
      list.forEach((item) => {
        item.isDel = false;
      });
      state.playList = list;
    },
    // 顺序播放列表
    setSequenceList(state, list) {
      list.forEach((item) => {
        item.isDel = false;
      });
      state.sequenceList = list;
    },
    // 播放器是否全屏状态
    setFullScreen(state, status) {
      state.fullScreen = status;
    },
    // 播放模式
    setPlayMode(state, playMode) {
      state.playMode = playMode;
    },
    // 当前播放歌曲的索引
    setCurrentIndex(state, index) {
      state.currentIndex = index;
    },
    // 实现歌曲的喜欢不喜欢切换
    toggleFavorite(state, song) {
      const favoriteSongList = state.favoriteSongList;
      const findSong = favoriteSongList.find((item) => item.id === song.id);
      if (!findSong) {
        // 没有就添加
        state.favoriteSongList.push(song);
        storage.set(FAVORITE_SONG_KEY, state.favoriteSongList);
      } else {
        //如果有，就删除
        let index = favoriteSongList.findIndex((item) => item.id === song.id);
        state.favoriteSongList.splice(index, 1);
        storage.set(FAVORITE_SONG_KEY, state.favoriteSongList);
      }
    },
  },
  actions: {
    // 用户点击了一首歌曲
    async selectSong({ commit, state }, song) {
      let index = state.playList.findIndex((item) => item.id === song.id);
      if (index === -1) {
        index = 0;
      }
      commit("setPlaying", true);
      commit("setFullScreen", true);
      commit("setPlayMode", PLAY_MODE.sequence);
      commit("setCurrentIndex", index);
    },
    // 随机播放歌曲
    async randomPlay({ commit }, { list, index }) {
      commit("setPlayMode", PLAY_MODE.random);
      commit("setPlaying", true);
      commit("");
    },

    // 播放模式的修改
    changeMode({ commit, state, getters }, mode) {
      const currentSongId = getters.currentSong.id;
      // 随机播放
      if (PLAY_MODE.random === mode) {
        commit("setPlayList", shuffle(state.sequenceList));
        Toast({
          type: "success",
          message: "已切换到随机播放",
        });
        console.log("随机播放");
      } else if (PLAY_MODE.sequence === mode) {
        // 顺序播放
        Toast({
          type: "success",
          message: "已切换到顺序播放",
        });
        console.log("顺序播放");
        commit("setPlayList", state.sequenceList);
      } else {
        // 单曲循环
        Toast({
          type: "success",
          message: "已切换到单曲循环",
        });
        console.log("单曲循环");
        // Toast.success("已切换到单曲循环");
      }
      let index = state.playList.findIndex((song) => {
        return song.id === currentSongId;
      });
      // 如果没有找到默认就是第一手歌曲
      if (index === -1) {
        index = 0;
      }
      commit("setCurrentIndex", index);
      commit("setPlayMode", mode);
    },
  },
  modules: {},
});
