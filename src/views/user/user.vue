<template>
  <div class="user">
    <span class="iconfont icon-back back" @click="$router.back()"></span>
    <div class="tab-wrapper">
      <div
        class="tab-item"
        ref="itemWidthRef"
        @click="switchTab(0)"
        :style="{ color: currentIndex === 0 ? '#fff' : '' }"
      >
        我喜欢的
      </div>
      <div
        class="tab-item"
        @click="switchTab(1)"
        :style="{ color: currentIndex === 1 ? '#fff' : '' }"
      >
        最近播放
      </div>
      <div class="active" :style="transformStyle"></div>
    </div>
    <div class="random-play" @click.stop="randomPlayHandle">
      <i class="iconfont icon-play"></i>
      <span>随机播放全部</span>
    </div>
    <div class="tab-panel">
      <div class="playlist-wrapper">
        <div
          class="playlist-item"
          v-for="song of songList"
          :key="song.id"
          @click.stop="songClickHandle(song)"
        >
          <p class="song-name">{{ song.name }}</p>
          <p class="song-singer">{{ song.singer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "user",
  data() {
    return {
      currentIndex: 0,
      itemWidth: 0,
      //我喜欢的
      songList: [],
    };
  },
  computed: {
    //recentlyPlayList 最近播放
    ...mapState(["favoriteSongList", "recentlyPlayList"]),
    transformStyle() {
      return {
        transform: `translate3d(${this.currentIndex * this.itemWidth}px,0,0)`,
      };
    },
  },
  mounted() {
    if (this.currentIndex === 0) {
      this.songList = this.favoriteSongList;
    }
    // 获取一个 tab-item的宽度
    this.itemWidth = this.$refs.itemWidthRef.clientWidth;
  },
  methods: {
    ...mapMutations([""]),
    ...mapActions(["randomPlay", "addSongToPlayList"]),
    // 随机播放按钮点击事件
    randomPlayHandle() {
      let list = [];
      if (this.currentIndex === 0) {
        list = this.favoriteSongList;
      } else {
        list = this.recentlyPlayList;
      }
      this.randomPlay({ list });
      // list.forEach((song) => {
      //   this.addSongToPlayList(song);
      // });
    },
    songClickHandle(song) {
      //console.log(song, "song");
      this.addSongToPlayList(song);
      // this.songList.forEach((item) => {
      //
      // });
      this.$store.dispatch("selectSong", song);
    },
    switchTab(index) {
      this.currentIndex = index;
      if (this.currentIndex === 0) {
        this.songList = this.favoriteSongList;
      } else {
        this.songList = this.recentlyPlayList;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.user {
  position: relative;
  height: 100%;

  .back {
    position: absolute;
    left: 10px;
    top: 0;
    color: $color-theme;
    font-size: 16px;
  }
  .tab-wrapper {
    position: relative;
    margin: 20px auto 0;
    // border: 1px solid red;
    width: 240px;
    display: flex;
    height: 30px;
    border: 1px solid $color-text-d;
    .active {
      position: absolute;
      top: 0;
      background-color: #333333;
      width: 50%;
      height: 100%;
      transition: all 0.3s linear;
    }
    .tab-item {
      position: relative;
      color: $color-text-d;
      z-index: 5;
      @include f-center;
      flex: 1;
      height: 100%;
    }
  }
  .random-play {
    // background-color: red;
    margin: 10px auto;
    border: 1px solid $color-theme;
    max-width: 120px;
    text-align: center;
    line-height: 30px;
    border-radius: 10px;
    font-size: 14px;
    padding: 0 10px;
    i {
      color: $color-theme;
    }
    span {
      color: $color-theme;
      margin-left: 5px;
    }
  }

  .tab-panel {
    box-sizing: border-box;
    padding: 10px 40px;
    .playlist-wrapper {
      .playlist-item {
        display: flex;
        height: 60px;
        flex-direction: column;
        justify-content: space-evenly;
        .song-name {
          font-size: 14px;
        }
        .song-singer {
          font-size: 14px;
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
