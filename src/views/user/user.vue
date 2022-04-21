<template>
  <div class="user" ref="userRef">
    <span class="iconfont icon-back back" @click="$router.back()"></span>
    <div class="tab-wrapper" ref="tabWrapperRef">
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
    <div class="random-play" ref="randomPlayRef" @click.stop="randomPlayHandle">
      <i class="iconfont icon-play"></i>
      <span>随机播放全部</span>
    </div>
    <div class="tab-panel" :style="isPaddingBottom">
      <div
        class="playlist-wrapper"
        ref="playlistScrollRef"
        :style="[
          { height: playlistScrollSectionHeight + 'px' },
          isPaddingBottom,
        ]"
      >
        <div class="temp-box">
          <div
            :class="[
              'playlist-item',
              currentSong.id === song.id ? 'active2' : '',
            ]"
            ref="playlistItemRef"
            v-for="(song, index) of songList"
            :key="song.id"
            @click.stop="songClickHandle(song, index)"
          >
            <p class="song-name">
              <span>{{ song.name }}</span>
            </p>
            <p class="song-singer">
              <span>{{ song.singer }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import BScroll from "better-scroll";
import { nextTick } from "vue";
export default {
  name: "user",
  data() {
    return {
      currentIndex: 0,
      itemWidth: 0,
      //我喜欢的
      songList: [],
      playlistScrollInstance: null,
      playlistScrollSectionHeight: 0,
      playlistItemHeight: 0,
      playSongCurrentIndex: 0,
    };
  },
  computed: {
    //recentlyPlayList 最近播放
    ...mapState(["favoriteSongList", "recentlyPlayList", ""]),
    ...mapGetters(["currentSong"]),
    slideBlockTransformStyle() {
      return {
        transform: `translate3d(0,${this.playSongCurrentIndex},0)`,
      };
    },
    transformStyle() {
      return {
        transform: `translate3d(${this.currentIndex * this.itemWidth}px,0,0)`,
      };
    },
  },
  watch: {
    async songList() {
      await nextTick();
      this.playlistScrollInstance.refresh();
      // console.log(this.$refs.playlistItemRef[0], "this.$refs.playlistItemRef");
    },
    currentIndex: {
      async handler() {
        await nextTick();
        this.playlistScrollInstance.refresh();
      },
    },
  },
  mounted() {
    if (this.currentIndex === 0) {
      this.songList = this.favoriteSongList;
    }
    // this.playlistItemHeight = this.$refs.playlistItemRef[0].clientHeight;

    // console.log(this.$refs.playlistItemRef[0].clientHeight, "88+++");
    // 获取一个 tab-item的宽度
    this.itemWidth = this.$refs.itemWidthRef.clientWidth;
    this.playlistScrollInstance = new BScroll(this.$refs.playlistScrollRef, {
      observeDOM: true,
      click: true,
      probeType: 3,
    });
    let height =
      this.$refs.userRef.clientHeight -
      this.$refs.tabWrapperRef.clientHeight -
      this.$refs.randomPlayRef.clientHeight;
    this.playlistScrollSectionHeight = height - 200;
    // console.log(
    //   this.$refs.randomPlayRef.clientHeight,
    //   "this.$refs.tabWrapperRef.clientHeight"
    // );
    // console.log(height - 200, "heightheightheight");
  },
  methods: {
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
    songClickHandle(song, index) {
      this.playSongCurrentIndex = index;
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

    .temp-box {
      position: relative;
    }
    .slide-block {
      position: absolute;
      left: 0;
      transition: all 0.3s linear;
      height: 35px;
      width: 2px;
      background-color: $color-theme;
    }

    .playlist-wrapper {
      overflow: hidden;
      .playlist-item {
        margin: 5px 0;
        padding-left: 5px;
        display: flex;
        height: 35px;
        flex-direction: column;
        justify-content: space-between;
        &.active2 {
          position: relative;
          &::before {
            position: absolute;
            left: 0;
            content: "";
            top: 0;
            height: 100%;
            width: 2px;
            background-color: #ffcd32;
          }
        }
        .song-name {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          width: 250px;
          display: inline-block;
          font-size: 14px;
        }
        .song-singer {
          text-align: left;
          span {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 250px;
            display: inline-block;
            font-size: 14px;
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>
