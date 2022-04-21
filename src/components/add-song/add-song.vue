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
            <div
              class="search-record-item"
              v-for="(item, index) of searchHistoryList"
              :key="item.searchWord"
            >
              <span class="text">{{ item.searchWord }}</span>
              <i
                class="iconfont icon-close"
                @click.stop="delSearchHistory(item)"
              ></i>
            </div>
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
          <div class="song-item" v-for="(song, index) of songs" :key="song.id">
            <div @click.stop="selectSong(song)">
              <span class="song-name">{{ song.name }}</span>
              <span class="song-singer">{{ song.singer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/request";
import SwitchTab from "@/components/switch-tab/switch-tab";
import { mapActions, mapMutations, mapState } from "vuex";
import BScroll from "better-scroll";
import { debounce } from "throttle-debounce";
import { nextTick } from "vue";
import { myProcessSongs } from "@/api/song";

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
  },
  watch: {
    currentIndex: {
      async handler() {
        await nextTick();
        if (this.searchRecordSectionScrollInstance) {
          this.searchRecordSectionScrollInstance.refresh();
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
      console.log(song);
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
      console.log(res, "res");
      this.addSongToPlayList(song);
      console.log(song);
    },
    async searchHandle(newVal) {
      if (newVal.trim() === "") {
        this.songs = [];
        return;
      }
      try {
        const result = await request("/cloudsearch", {
          keywords: this.keyword,
          limit: 100,
        });
        this.addTextToSearchHistoryList(this.keyword);
        console.log(result, "result");
        if (result.code === 200) {
          let songs = result.result.songs.slice();
          this.songs = await myProcessSongs(songs);
          await nextTick();
          this.recentlyPlayListSectionScrollInstance.refresh();
        }
      } catch (err) {}
      console.log(newVal, "newVal");
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
    songClickHandle(song) {
      this.addSongToPlayList(song);
      this.$store.dispatch("selectSong", song);
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
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #222222;
  z-index: 350;
  display: flex;
  flex-direction: column;

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
          font-size: 14px;
        }
        i {
          font-size: 14px;
          color: #405461;
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
        display: flex;
        height: 60px;
        flex-direction: column;
        justify-content: space-evenly;
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
