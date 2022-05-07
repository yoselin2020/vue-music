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
      <span>随机播放一首歌曲</span>
    </div>
    <div class="tab-panel-wrapper">
      <transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
        :style="songList.length === 0 ? { 'animation-delay': 0.5 + 's' } : {}"
      >
        <div class="no-result" v-show="songList.length === 0">
          <img
            :src="require('@/assets/images/no-result@2x.7f236bd8.png')"
            alt=""
          />
          <span class="text">{{
            currentIndex === 0 ? "暂无收藏歌曲" : "你还没有听过歌曲"
          }}</span>
        </div>
      </transition>
      <div class="tab-panel" :style="isPaddingBottom">
        <div
          class="playlist-wrapper"
          ref="playlistScrollRef"
          :style="[
            { height: playlistScrollSectionHeight + 'px' },
            isPaddingBottom,
          ]"
        >
          <div class="wrapper-box">
            <div class="temp-box" :style="isPaddingBottom">
              <!--name="list"-->
              <transition-group
                enter-active-class="animate__animated animate__slideInRight"
                leave-active-class="animate__animated animate__slideOutRight"
              >
                <div
                  :class="['playlist-item']"
                  ref="playlistItemRef"
                  v-for="(song, index) of songList"
                  :key="song.id"
                  @click.stop="songClickHandle(song, index)"
                >
                  <van-swipe-cell
                    @open="swiperCellOpen"
                    @click="swiperCellClick($event, song)"
                    :class="currentSong.id === song.id ? 'active2' : ''"
                  >
                    <p class="song-name">
                      <span>{{ song.name }}</span>
                    </p>
                    <p class="song-singer">
                      <span>{{ song.singer }}</span>
                    </p>
                    <template #right>
                      <van-button
                        square
                        text="删除"
                        type="danger"
                        class="delete-button"
                      />
                    </template>
                  </van-swipe-cell>
                </div>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import BScroll from "better-scroll";
import { getRandom } from "@/assets/js/util";
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
    ...mapState([
      "favoriteSongList",
      "recentlyPlayList",
      "currentIndex",
      "isPlaying",
    ]),
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
      async handler(newVal) {
        if (newVal === 0) {
          if (!this.isPlaying) {
            return;
          }
          await nextTick();
          // 如果切换到了我喜欢的tab,让他滚动到可视区
          // console.log(this.$refs.playlistScrollRef);
          const idx = this.songList.findIndex(
            (item) => item.id === this.currentSong.id
          );
          if (idx > -1) {
            const children =
              this.$refs.playlistScrollRef.querySelectorAll(".playlist-item");
            //console.log(children, "childrenchildrenchildren");
            this.playlistScrollInstance.scrollToElement(children[idx], 300);
          }
        }
        await nextTick();
        this.playlistScrollInstance.refresh();
      },
      important: true,
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
    this.playlistScrollSectionHeight = height - 100;
    // console.log(
    //   this.$refs.randomPlayRef.clientHeight,
    //   "this.$refs.tabWrapperRef.clientHeight"
    // );
    // console.log(height - 200, "heightheightheight");
  },
  methods: {
    ...mapActions([
      "randomPlay",
      "addSongToPlayList",
      "delSong",
      "delOneSongFromFavorite",
    ]),
    ...mapMutations(["delRecentlyPlaySong"]),
    // 滑动单元格打开的状态
    swiperCellOpen(event) {
      // console.log(event, "event-open");
    },
    //点击了右侧的删除按钮
    swiperCellClick(event, song) {
      if (event === "right") {
        // 移除歌曲
        // 移除歌曲后,我们还要从playList中进行移除操作
        if (this.currentIndex === 0) {
          // 从我喜欢的歌曲中移除掉
          this.delOneSongFromFavorite(song);
        } else {
          //   从最近播放中将歌曲移除掉
          this.delRecentlyPlaySong(song);
        }
        // this.delSong(song);
        // console.log("点击了删除按钮", "eeee");
      }
    },
    // 随机播放按钮点击事件
    async randomPlayHandle() {
      let list = [];
      if (this.currentIndex === 0) {
        list = this.favoriteSongList;
      } else {
        list = this.recentlyPlayList;
      }
      let index = getRandom(0, list.length);
      this.addSongToPlayList(list[index]);
      //this.randomPlay({ list });
      // await nextTick();
      // this.playlistScrollInstance.refresh();
      // list.forEach((song) => {
      //   this.addSongToPlayList(song);
      // });
    },
    songClickHandle(song, index) {
      //console.log(song, "song...");
      // console.log(song, "song");
      // debugger;
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
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: #222222;
  .back {
    position: absolute;
    left: 10px;
    top: 18px;
    color: $color-theme;
    font-size: 16px;
  }
  .tab-wrapper {
    position: relative;
    margin: 10px auto 0;
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
      font-size: 14px;
    }
  }
  .random-play {
    // background-color: red;
    margin: 10px auto;
    border: 1px solid $color-theme;
    width: 150px;
    // margin: 0 auto;
    text-align: center;
    //  line-height: 30px;
    border-radius: 10px;
    font-size: 14px;
    padding: 10px;
    i {
      font-size: 15px;
      vertical-align: middle;
      color: $color-theme;
    }
    span {
      font-size: 14px;
      color: $color-theme;
      margin-left: 5px;
    }
  }
  .tab-panel-wrapper {
    position: relative;
    .no-result {
      position: absolute;
      width: 100%;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      > img {
        margin-bottom: 20px;
        width: 100px;
        height: 100px;
      }
      .text {
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }

  .tab-panel {
    position: relative;
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
      position: relative;
      box-sizing: border-box;
      overflow: hidden;

      .wrapper-box {
        // background-color: pink;
      }
      .playlist-item {
        box-sizing: border-box;
        margin: 5px 0;
        padding-left: 5px;
        display: flex;
        height: 35px;
        flex-direction: column;
        justify-content: space-between;
        .delete-button {
          border: 0 !important;
          height: 100%;
        }
        ::v-deep(.van-button--danger) {
          box-sizing: border-box;
          border: 0 !important;
        }
        ::v-deep(.van-swipe-cell) {
          padding-left: 10px;
          &.active2 {
            .van-swipe-cell__wrapper {
              position: relative;
              &::before {
                position: absolute;
                left: -5px;
                content: "";
                top: 0;
                height: 100%;
                width: 2px;
                background-color: #ffcd32;
              }
            }
          }
          .van-button--danger {
            box-sizing: border-box;
            border: 0 !important;
          }
        }

        //::v-deep(.van-button--danger) {
        //  border: 1px solid transparent;
        //}

        //&.active2 {
        //  position: relative;
        //  &::before {
        //    position: absolute;
        //    left: 0;
        //    content: "";
        //    top: 0;
        //    height: 100%;
        //    width: 2px;
        //    background-color: #ffcd32;
        //  }
        //}
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
