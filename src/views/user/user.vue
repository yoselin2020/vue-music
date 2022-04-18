<template>
  <div class="user">
    <span class="iconfont icon-back back" @click="$router.back()"></span>
    <div class="tab-wrapper">
      <div
        class="tab-item"
        ref="itemWidthRef"
        @click="currentIndex = 0"
        :style="{ color: currentIndex === 0 ? '#fff' : '' }"
      >
        我喜欢的
      </div>
      <div
        class="tab-item"
        @click="currentIndex = 1"
        :style="{ color: currentIndex === 1 ? '#fff' : '' }"
      >
        最近播放
      </div>
      <div class="active" :style="transformStyle"></div>
    </div>
    <div class="random-play">
      <i class="iconfont icon-play"></i>
      <span>随机播放全部</span>
    </div>
    <div class="tab-panel">
      <div class="playlist-wrapper">
        <div class="playlist-item" v-for="song of songList" :key="song.id">
          <p class="song-name">{{ song.name }}</p>
          <p class="song-singer">{{ song.singer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "user",
  data() {
    return {
      currentIndex: 0,
      itemWidth: 0,
      //我喜欢的
      songList: [],
      // 最近播放
      latelyPlayList: [],
    };
  },
  computed: {
    ...mapState(["favoriteSongList"]),
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
  methods: {},
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
    margin: 10px auto;
    border: 1px solid $color-theme;
    max-width: 120px;
    text-align: center;
    line-height: 30px;
    border-radius: 10px;
    font-size: 14px;
    padding: 0 10px;
    span {
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
