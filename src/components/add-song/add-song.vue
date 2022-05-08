<template>
  <div class="add-song">
    <header class="header">
      <span>添加歌曲到列表</span>
      <div class="icon-wrapper" @click.stop="hide">
        <i class="iconfont icon-close"></i>
      </div>
    </header>
    <van-search
      v-model="keyword"
      placeholder="搜索歌曲/歌手"
      background="#222222"
    />
    <div
      class="switch-wrapper"
      v-show="songs.length === 0 || keyword.trim().length === 0"
    >
      <switch-tab
        @switchTab="switchTab"
        :currentIndex="currentIndex"
        :items="['最近播放', '搜索历史']"
      ></switch-tab>
      <!--最近播放区域-->
      <div class="recently-playList-section" v-show="currentIndex === 0">
        <div class="no-result" v-show="recentlyPlayList.length === 0">
          <img
            :src="require('@/assets/images/no-result@2x.7f236bd8.png')"
            alt=""
          />
          <span class="text">你还没有听过歌曲</span>
        </div>
        <div class="scroll-ele" ref="recentlyPlayListSectionRef">
          <!--:class="song.id === currentSong.id ? 'active' : ''"-->
          <div class="playlist-wrapper">
            <transition-group name="list">
              <div
                class="playlist-item"
                v-for="song of recentlyPlayList"
                :key="song.id"
                @click.stop="songClickHandle(song)"
              >
                <van-swipe-cell
                  @click="swiperCellClick($event, song)"
                  :class="currentSong.id === song.id ? 'active2' : ''"
                >
                  <p class="song-name">{{ song.name }}</p>
                  <p class="song-singer">{{ song.singer }}</p>
                  <svg
                    @click.stop="addToPlayListQueue(song)"
                    t="1650811025936"
                    class="icon"
                    viewBox="0 0 1025 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="45618"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M512 1024c-282.787759 0-512-229.248343-512-512C0 229.212241 229.212241 0 512 0 794.751657 0 1024.036102 229.212241 1024.036102 512 1024.036102 794.787759 794.751657 1024 512 1024zM768.036102 460.80722l-204.80722 0L563.228882 256 460.843323 256l0 204.80722L256 460.80722l0 102.385559 204.80722 0 0 204.80722 102.385559 0 0-204.80722 204.80722 0L768 460.80722z"
                      p-id="45619"
                      fill="#ffcd32"
                    ></path>
                  </svg>
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
      <!--搜索历史区域-->
      <div class="search-record-section" v-show="currentIndex === 1">
        <div class="no-result" v-show="searchHistoryList.length === 0">
          <img
            :src="require('@/assets/images/no-result@2x.7f236bd8.png')"
            alt=""
          />
          <span class="text">暂无搜索历史</span>
        </div>
        <div class="search-record-section-wrapper" ref="searchRecordSectionRef">
          <div>
            <transition-group name="leave">
              <div
                class="search-record-item"
                v-for="(item, index) of searchHistoryList"
                :key="item.searchWord"
                @click.stop="searchHistoryClickHandle(item)"
              >
                <span class="text">{{ item.searchWord }}</span>
                <i
                  class="iconfont icon-close"
                  @click.stop="delSearchHistory(item)"
                ></i>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
    <div
      class="search-result-wrapper"
      v-show="songs.length && keyword.trim().length > 0"
    >
      <div class="scroll-wrapper" ref="searchResultWrapperRef">
        <div>
          <search-songs :songs="songs" showTools @selectSong="selectSong" />
          <!--          <div-->
          <!--            class="song-item-wrapper"-->
          <!--            v-for="(song, index) of songs"-->
          <!--            :key="song.id"-->
          <!--            @click.stop="selectSong(song)"-->
          <!--          >-->
          <!--            <div class="img-wrapper">-->
          <!--              <img-->
          <!--                :src="require('@/assets/images/music-logo-big.png')"-->
          <!--                alt=""-->
          <!--              />-->
          <!--            </div>-->
          <!--            <div class="song-info">-->
          <!--              <span class="song-name">{{ song.name }}</span>-->
          <!--              <span class="song-singer">{{ song.singer }}</span>-->
          <!--              <svg-->
          <!--                @click.stop="addToPlayListQueue(song)"-->
          <!--                t="1650811025936"-->
          <!--                class="icon2"-->
          <!--                viewBox="0 0 1025 1024"-->
          <!--                version="1.1"-->
          <!--                xmlns="http://www.w3.org/2000/svg"-->
          <!--                p-id="45618"-->
          <!--                width="18"-->
          <!--                height="18"-->
          <!--              >-->
          <!--                <path-->
          <!--                  d="M512 1024c-282.787759 0-512-229.248343-512-512C0 229.212241 229.212241 0 512 0 794.751657 0 1024.036102 229.212241 1024.036102 512 1024.036102 794.787759 794.751657 1024 512 1024zM768.036102 460.80722l-204.80722 0L563.228882 256 460.843323 256l0 204.80722L256 460.80722l0 102.385559 204.80722 0 0 204.80722 102.385559 0 0-204.80722 204.80722 0L768 460.80722z"-->
          <!--                  p-id="45619"-->
          <!--                  fill="#ffcd32"-->
          <!--                ></path>-->
          <!--              </svg>-->
          <!--            </div>-->
          <!--          </div>-->

          <!--          <div-->
          <!--            class="song-item"-->
          <!--            v-for="(song, index) of songs"-->
          <!--            :key="song.id"-->
          <!--            :class="song.id === currentSong.id ? 'active' : ''"-->
          <!--          >-->
          <!--            <div @click.stop="selectSong(song)">-->
          <!--              <span class="song-name">{{ song.name }}</span>-->
          <!--              <span class="song-singer">{{ song.singer }}</span>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/request";
import SwitchTab from "@/components/switch-tab/switch-tab";
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import BScroll from "better-scroll";
import { debounce } from "throttle-debounce";
import { nextTick } from "vue";
import { myProcessSongs, searchSong } from "@/api/song";
import xss from "xss";
import SearchSongs from "../search-songs/search-songs.vue";

export default {
  name: "add-song",
  components: { SwitchTab, SearchSongs },
  data() {
    return {
      keyword: "",
      currentIndex: 0,
      recentlyPlayListSectionRef: null,
      recentlyPlayListSectionScrollInstance: null,
      // 搜索到的歌曲
      songs: [],
      songsCount: 0,
      searchResultWrapperScrollInstance: null,
      searchRecordSectionScrollInstance: null,
      offset: 0,
      limit: 30,
    };
  },
  emits: ["hide"],
  mounted() {
    // 初始化scroll实例对象
    this.initScroll();
    this.$watch("keyword", debounce(500, this.searchHandle));
  },
  unmounted() {
    // 清除bs实例对象
    this.recentlyPlayListSectionScrollInstance.destroy();
    this.searchResultWrapperScrollInstance.destroy();
  },
  computed: {
    ...mapState(["recentlyPlayList", "searchHistoryList"]),
    ...mapGetters(["currentSong"]),
  },
  watch: {
    currentIndex: {
      async handler() {
        await nextTick();
        if (this.searchRecordSectionScrollInstance) {
          this.searchRecordSectionScrollInstance.refresh();
        }
        if (this.recentlyPlayListSectionScrollInstance) {
          this.recentlyPlayListSectionScrollInstance.refresh();
        }
      },
    },
    searchHistoryList: {
      async handler() {
        await nextTick();
        this.searchRecordSectionScrollInstance.refresh();
      },
      deep: true,
    },
    songs: {
      async handler() {
        await nextTick();
        // console.log("songs变化了");
        // console.log(
        //   this.recentlyPlayListSectionScrollInstance,
        //   "this.recentlyPlayListSectionScrollInstance"
        // );
        if (this.recentlyPlayListSectionScrollInstance) {
          this.recentlyPlayListSectionScrollInstance.refresh();
        }
        if (this.searchResultWrapperScrollInstance) {
          this.searchResultWrapperScrollInstance.refresh();
        }
        if (this.searchRecordSectionScrollInstance) {
          this.searchRecordSectionScrollInstance.refresh();
        }
      },
    },
  },
  methods: {
    ...mapMutations([
      "addTextToSearchHistoryList",
      "delTextFromSearchHistoryList",
      "delRecentlyPlaySong",
    ]),
    ...mapActions(["addSongToPlayList"]),
    addToPlayListQueue(song) {
      //this.currentSingerInfo.songs
      this.$store.commit("addToPlayListQueue", song);
      console.log(song, "songi");
    },
    // 删除一条搜索记录
    delSearchHistory(item) {
      this.delTextFromSearchHistoryList(item);
    },
    //点击了右侧的删除按钮
    swiperCellClick(event, song) {
      // debugger;
      if (event === "right") {
        console.log(event, song);
        // 移除歌曲
        // 移除歌曲后,我们还要从playList中进行移除操作
        if (this.currentIndex === 0) {
          //   从最近播放中将歌曲移除掉
          this.delRecentlyPlaySong(song);
        }
      }
    },
    // 用户点击了搜索到的歌曲
    async selectSong(song) {
      //   console.log(song);
      if (
        !song.hasOwnProperty("id") ||
        !song.hasOwnProperty("url") ||
        !song.hasOwnProperty("duration")
      ) {
        return;
      }
      // 获取歌词
      let res = await request("/lyric", {
        id: song.id,
      });
      song.lyric = res.lrc.lyric;
      //  song.lyric = res.klyric.lyric;
      // console.log(res, "res");
      await this.addSongToPlayList(song);
      this.keyword = "";
      this.songs = [];
      // console.log(song);
    },
    // 搜索方法处理函数
    async searchHandle(newVal) {
      newVal = xss(newVal);
      //debugger;
      if (newVal.trim() === "") {
        this.songs = [];
        await nextTick();
        if (this.searchRecordSectionScrollInstance) {
          this.searchRecordSectionScrollInstance.refresh();
        }
        return;
      }
      try {
        const result = await searchSong({
          keywords: newVal,
          limit: this.limit,
          offset: this.offset,
        });
        // 处理 url
        let song = await myProcessSongs(result);
        //console.log(song, "song");
        this.songs = [...this.songs, ...song];
        // console.log(this.songs, "this.songs");
        // debugger;
        this.addTextToSearchHistoryList({ searchWord: this.keyword });
        await nextTick();
        this.recentlyPlayListSectionScrollInstance.refresh();
      } catch (err) {}
    },
    async pullingUpHandle() {
      this.offset++;
      await this.searchHandle(this.keyword);
      this.searchResultWrapperScrollInstance.finishPullUp();
      // console.log("pullUp");
    },
    async initScroll() {
      this.searchRecordSectionScrollInstance = new BScroll(
        this.$refs.searchRecordSectionRef,
        {
          probeType: 2,
          click: true,
          observeDOM: true,
        }
      );
      this.searchResultWrapperScrollInstance = new BScroll(
        this.$refs.searchResultWrapperRef,
        {
          probeType: 2,
          click: true,
          observeDOM: true,
          pullUpLoad: true,
        }
      );
      this.searchResultWrapperScrollInstance.on(
        "pullingUp",
        this.pullingUpHandle
      );
      this.recentlyPlayListSectionScrollInstance = new BScroll(
        this.$refs.recentlyPlayListSectionRef,
        {
          probeType: 2,
          click: true,
          observeDOM: true,
        }
      );
    },
    // 搜索历史item 点击事件
    searchHistoryClickHandle(searchHistory) {
      this.keyword = searchHistory.searchWord;
      // console.log(searchHistory, "searchHistory");
    },
    async songClickHandle(song) {
      this.addSongToPlayList(song);
      await this.$store.dispatch("selectSong", song);
      this.keyword = "";
      this.songs = [];
    },
    switchTab(index) {
      console.log(index, "iiii");
      this.currentIndex = index;
    },
    hide() {
      this.$emit("hide", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #222222;
  z-index: 350;
  display: flex;
  flex-direction: column;

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
  .switch-wrapper {
  }

  .song-item-wrapper {
    margin-bottom: 5px;
    display: flex;

    .img-wrapper {
      margin-right: 5px;
    }

    .song-info {
      position: relative;
      flex: 1;

      .icon2 {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        z-index: 10;
      }

      .song-name {
        font-size: 14px;
        color: $color-text-d;
      }

      .song-singer {
        margin-left: 5px;
        font-size: 14px;
        color: $color-text-d;
      }
    }
  }

  ::v-deep(.van-search__content) {
    background-color: #333333;

    .van-field__control {
      color: #ffffff;

      &::placeholder {
        color: $color-text-d;
      }

      caret-color: #ffffff;
    }
  }

  .search-result-wrapper {
    box-sizing: border-box;
    padding: 20px 40px;
    overflow: hidden;

    .scroll-wrapper {
      height: 500px;

      .song-item {
        margin-bottom: 10px;

        .song-name {
          font-size: 14px;
        }

        .song-singer {
          font-size: 14px;
          margin-left: 10px;
        }
      }
    }
  }

  .header {
    line-height: 40px;
    position: relative;
    text-align: center;
    font-size: 14px;
    color: $color-theme;

    .icon-wrapper {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 15px;

      .add-icon {
      }

      i {
        color: $color-theme;
      }
    }
  }

  .search-record-section {
    position: relative;
    padding: 10px 40px;

    .search-record-section-wrapper {
      height: 500px;
      overflow: hidden;

      //   margin: 0 10px;
      box-sizing: border-box;

      .search-record-item {
        box-sizing: border-box;
        padding-left: 15px;
        line-height: 35px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        //  margin: 10px 0;
        .text {
          color: $color-text-d;
          font-size: 14px;
        }

        i {
          font-size: 14px;
          color: $color-text-d;
        }
      }
    }
  }

  .recently-playList-section {
    position: relative;
    flex: 1;
    height: 500px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 10px 40px;

    .scroll-ele {
      height: 100%;
    }

    .playlist-wrapper {
      .playlist-item {
        position: relative;
        margin: 5px 0;
        padding-left: 10px;
        display: flex;
        height: 35px;
        flex-direction: column;
        justify-content: space-evenly;

        .delete-button {
          border: 0 !important;
          border: none;
          height: 100%;
        }

        .icon {
          position: absolute;
          right: 10px;
          z-index: 20;
          top: 50%;
          transform: translateY(-50%);
        }

        :deep(.van-swipe-cell) {
          position: relative;
          padding-left: 10px;

          .van-swipe-cell__right {
            right: -1px;
          }

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

        &.active {
          position: relative;

          &::before {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 2px;
            background-color: #ffcd32;
            content: "";
          }
        }

        .song-name {
          margin-right: 20px;
          font-size: 14px;
        }

        .song-singer {
          margin-right: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
