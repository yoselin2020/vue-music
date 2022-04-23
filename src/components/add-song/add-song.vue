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
    <div v-show="songs.length === 0 || keyword.trim().length === 0">
      <switch-tab
        @switchTab="switchTab"
        :currentIndex="currentIndex"
        :items="['最近播放', '搜索历史']"
      ></switch-tab>
      <!--最近播放区域-->
      <div class="recently-playList-section" v-show="currentIndex === 0">
        <div class="scroll-ele" ref="recentlyPlayListSectionRef">
          <div class="playlist-wrapper">
            <div
              class="playlist-item"
              :class="song.id === currentSong.id ? 'active' : ''"
              v-for="song of recentlyPlayList"
              :key="song.id"
              @click.stop="songClickHandle(song)"
            >
              <p class="song-name">{{ song.name }}</p>
              <p class="song-singer">{{ song.singer }}</p>
            </div>
          </div>
        </div>
      </div>
      <!--搜索历史区域-->
      <div class="search-record-section" v-show="currentIndex === 1">
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
          <div
            class="song-item-wrapper"
            v-for="(song, index) of songs"
            :key="song.id"
            @click.stop="selectSong(song)"
          >
            <div class="img-wrapper">
              <img
                :src="require('@/assets/images/music-logo-big.png')"
                alt=""
              />
            </div>
            <div class="song-info">
              <span class="song-name">{{ song.name }}</span>
              <span class="song-singer">{{ song.singer }}</span>
            </div>
          </div>

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

export default {
  name: "add-song",
  components: { SwitchTab },
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
  beforeUnmount() {
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
        console.log("songs变化了");
        console.log(
          this.recentlyPlayListSectionScrollInstance,
          "this.recentlyPlayListSectionScrollInstance"
        );
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
    ]),
    ...mapActions(["addSongToPlayList"]),
    // 删除一条搜索记录
    delSearchHistory(item) {
      this.delTextFromSearchHistoryList(item);
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
        }
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

  .song-item-wrapper {
    margin-bottom: 5px;
    display: flex;
    .img-wrapper {
      margin-right: 5px;
    }
    .song-info {
      flex: 1;

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
    line-height: 30px;
    position: relative;
    text-align: center;
    font-size: 14px;
    color: $color-theme;
    .icon-wrapper {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 15px;

      i {
        color: $color-theme;
      }
    }
  }

  .search-record-section {
    .search-record-section-wrapper {
      height: 500px;
      overflow: hidden;
      box-sizing: border-box;
      padding: 10px 40px;
      .search-record-item {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
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
        margin: 5px 0;
        padding-left: 10px;
        display: flex;
        height: 35px;
        flex-direction: column;
        justify-content: space-evenly;

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
          font-size: 14px;
        }
        .song-singer {
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
