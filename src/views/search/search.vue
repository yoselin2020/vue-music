<template>
  <div class="search" ref="searchRef">
    <van-search
      ref="vanSearchCom"
      v-model="keyword"
      placeholder="请输入搜索关键词"
      background="#222222"
    />
    <!--  hot-search   -->
    <transition name="leave">
      <div
        class="hot-search-wrapper"
        ref="_hotSearchWrapperRef"
        v-show="hotKeys.length && songs.length === 0"
      >
        <header class="header" ref="hotSearchHeaderRef">
          <span class="title">热门搜索</span>
        </header>
        <div class="hot-search-record" ref="hotSearchRecordRef">
          <div>
            <template v-for="item of hotKeys" :key="item.id">
              <span class="text" @click.stop="hotSearchItemClick(item)">{{
                item.searchWord
              }}</span>
            </template>
          </div>
        </div>
      </div>
    </transition>
    <!--搜索历史展示区域-->
    <transition name="leave">
      <div v-show="searchHistoryList.length && songs.length === 0">
        <header class="search-history-title" ref="searchHistoryTitle">
          <span class="text">搜索历史</span>
          <span class="icon-wrapper" @click.stop="clearSearchRecord"
            ><i class="iconfont icon-clear"></i
          ></span>
        </header>
        <div
          class="scroll-wrapper"
          ref="scrollRef"
          :style="[
            {
              height: searchHistorySectionHeight + 'px',
            },
          ]"
        >
          <div class="search-history-wrapper" :style="isPaddingBottom">
            <div class="search-history-content">
              <transition-group name="leave">
                <div
                  class="search-history-item"
                  v-for="(searchHistory, index) of searchHistoryList"
                  :key="searchHistory.searchWord"
                  @click.stop="searchHistoryClickHandle(searchHistory)"
                >
                  <span class="search-txt">{{ searchHistory.searchWord }}</span>
                  <span class="icon-container">
                    <i
                      class="iconfont icon-close"
                      @click.stop="delSearchHistoryItem(searchHistory)"
                    >
                    </i>
                  </span>
                </div>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--搜索结果展示区域-->
    <transition name="leave-left">
      <div class="search-songs-wrapper" v-show="songs.length > 0">
        <div
          class="search-songs-scroll-wrapper"
          ref="searchSongsWrapperScrollRef"
          :style="{ height: searchShowSectionHeight + 'px' }"
        >
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
                <span class="operator">-</span>
                <span class="song-singer">{{ song.singer }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <confirm
    v-model:visible="visible"
    v-if="visible"
    @confirm="confirm"
    @cancel="cancel"
    message="是否清空播放列表?"
  ></confirm>
</template>

<script>
import { getHotKeys, search } from "@/service/search";
import { myProcessSongs, searchSong } from "@/api/song";
import { debounce } from "throttle-debounce";
import BScroll from "better-scroll";
import { nextTick } from "vue";
import request from "@/request";
import xss from "xss";
import { mapActions, mapMutations, mapState } from "vuex";
import confirm from "@/components/confirm/confirm";

export default {
  name: "Search",
  data() {
    return {
      keyword: "",
      hotKeys: [],
      visible: false,
      showSinger: true,
      searchShowSectionHeight: 0,
      scrollInstance: null,
      songs: [],
      hotSearchWrapperScrollInstance: null,
      searchSongsWrapperScrollInstance: null,
      // 搜索历史展示区域高度
      searchHistorySectionHeight: 0,
      // 查询的数量
      limit: 30,
      offset: 0,
      //scrollPullingDownStatus: false,
    };
  },
  computed: {
    ...mapState(["searchHistoryList", "fullScreen"]),
  },
  components: {
    confirm,
  },
  async created() {
    try {
      //const result = await getHotKeys();
      const result = await request("/search/hot/detail");
      //console.log(result, "result");
      this.hotKeys = result.data;
    } catch (err) {}
  },
  watch: {
    async searchHistorySectionHeight() {
      await nextTick();
      this.scrollInstance.refresh();
    },
    fullScreen: {
      async handler() {
        await nextTick();
        this.scrollInstance.refresh();
      },
    },
    searchHistoryList: {
      async handler() {
        await nextTick();
        this.scrollInstance.refresh();
        // console.log("searchHistoryList变化了searchHistoryList");
      },
      deep: true,
    },
    async hotKeys() {
      await nextTick();
      const height2 =
        this.$refs.searchRef.clientHeight -
        this.$refs.searchHistoryTitle.clientHeight -
        this.$refs.vanSearchCom.$el.clientHeight -
        this.$refs._hotSearchWrapperRef.clientHeight;
      //  console.log(height2, "height2");
      // console.log(height2, "height2height2height2height2height2");
      // console.log(height2, "height2height2");
      this.searchHistorySectionHeight = height2 - 100;
      // console.log(
      //   this.searchHistorySectionHeight,
      //   "this.searchHistorySectionHeight"
      // );
    },
    async searchShowSectionHeight() {
      await nextTick();
      if (this.searchSongsWrapperScrollInstance) {
        this.searchSongsWrapperScrollInstance.refresh();
      }
    },
    songs: {
      async handler(newVal) {
        await nextTick();
        if (this.scrollInstance) {
          this.scrollInstance.refresh();
        }
        await nextTick();
        if (this.searchSongsWrapperScrollInstance) {
          this.searchSongsWrapperScrollInstance.refresh();
        }
      },
    },
  },
  async activated() {
    // console.log("activated");
    try {
      await nextTick();
      // console.log(this.hotSearchWrapperScrollInstance);
      this.hotSearchWrapperScrollInstance.refresh();
      this.scrollInstance.refresh();
      this.searchSongsWrapperScrollInstance.refresh();
    } catch (e) {}
  },
  async mounted() {
    // console.log("mounted");
    const height =
      this.$refs.searchRef.clientHeight -
      this.$refs.vanSearchCom.$el.clientHeight;
    this.searchShowSectionHeight = height - 200;
    this.$watch("keyword", debounce(500, this.searchHandle));
    await nextTick();
    this.scrollInstance = new BScroll(this.$refs.scrollRef, {
      click: true,
      observeDOM: true,
    });

    this.hotSearchWrapperScrollInstance = new BScroll(
      this.$refs.hotSearchRecordRef,
      {
        probeType: 2,
        click: true,
        observeDOM: true,
      }
    );

    this.searchSongsWrapperScrollInstance = new BScroll(
      this.$refs.searchSongsWrapperScrollRef,
      {
        click: true,
        observeDOM: true,
        probeType: 2,
        pullUpLoad: true,
        pullDownRefresh: true,
      }
    );
    this.searchSongsWrapperScrollInstance.on(
      "pullingDown",
      this.scrollPullingDown
    );
    this.searchSongsWrapperScrollInstance.on("pullingUp", this.scrollPullingUp);
  },
  methods: {
    ...mapMutations([
      "addTextToSearchHistoryList",
      "delTextFromSearchHistoryList",
      "setSearchHistoryList",
    ]),
    ...mapActions(["addSongToPlayList"]),
    // 清空搜索历史
    confirm() {
      this.setSearchHistoryList([]);
    },
    //取消清空
    cancel() {},
    // 上拉刷新
    async scrollPullingDown() {
      this.offset = 0;
      this.limit = 30;
      this.keyword = "";
      // 重新请求数据
      await this.searchHandle(this.keyword);
      this.searchSongsWrapperScrollInstance.finishPullDown();
    },
    // 滚动到底部(下拉加载更多)
    async scrollPullingUp() {
      // 继续去请求数据
      //console.log("滚动到底部");
      // this.limit += 10;
      this.offset++;
      await this.searchHandle(this.keyword);
      this.searchSongsWrapperScrollInstance.finishPullUp();
    },
    // 搜索历史item 点击事件
    searchHistoryClickHandle(searchHistory) {
      this.keyword = searchHistory.searchWord;
      // console.log(searchHistory, "searchHistory");
    },
    // 用户点击了搜索到的歌曲
    async selectSong(song) {
      // console.log(song);
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
    // 热门搜索点击事件
    hotSearchItemClick(item) {
      this.keyword = item.searchWord;
      // console.log(this.keyword, "this.keyword");
    },
    delSearchHistoryItem(history) {
      this.delTextFromSearchHistoryList(history);
      // this.searchHistoryList.splice(index, 1);
    },
    // 清空搜索记录
    async clearSearchRecord() {
      this.visible = true;
      // try {
      //   await this.$dialog.confirm({
      //     title: "提示",
      //     message: "确认清空搜索记录?",
      //     confirmButtonColor: "#6d6d6d",
      //     cancelButtonColor: "#6d6d6d",
      //   });
      //   this.searchHistoryList = [];
      // } catch (err) {}
    },
    async searchHandle(newVal) {
      newVal = xss(newVal);
      //debugger;
      if (newVal.trim() === "") {
        this.songs = [];
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
        this.recentlyPlayListSectionScrollInstance.refresh();
      } catch (err) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 10px;

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

  .search-songs-wrapper {
    //box-sizing: border-box;
    padding: 10px 30px;
    overflow: hidden;

    .search-songs-scroll-wrapper {
      padding-bottom: 100px;

      .song-item-wrapper {
        margin-bottom: 5px;
        display: flex;

        .img-wrapper {
          margin-right: 5px;
        }

        .song-info {
          color: $color-text-d;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;

          .operator {
            color: $color-text-d;
            margin: 0 5px;
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
    }
  }

  .hot-search-wrapper {
    padding: 0 12px;

    .header {
      height: 40px;
      display: flex;
      justify-content: space-between;
      line-height: 40px;

      .title {
        font-size: 14px;
        color: #717171;
      }
    }

    .icon-wrapper {
      @include f-center;

      i {
        color: #717171;
      }
    }

    .hot-search-record {
      height: 120px;
      overflow: hidden;

      div {
        display: flex;
        flex-wrap: wrap;
      }

      .text {
        margin-right: 10px;
        margin-bottom: 10px;
        background-color: #333333;
        border-radius: 2px;
        flex: 0 0 1;
        padding: 4px 8px;
        color: $color-text-d;
        font-size: 14px;
      }
    }
  }

  .scroll-wrapper {
    flex: 0 0 1;
    box-sizing: border-box;
    overflow: hidden;
  }

  .search-history-title {
    padding: 4px 12px;
    display: flex;
    line-height: 40px;
    justify-content: space-between;

    .text {
      font-size: 14px;
      color: $color-text-d;
    }

    .icon-wrapper {
      @include f-center;

      i {
        color: $color-text-d;
      }
    }
  }

  .search-history-wrapper {
    box-sizing: border-box;

    .search-history-content {
      .search-history-item {
        display: flex;
        justify-content: space-between;
        line-height: 25px;
        padding: 4px 12px;

        .search-txt {
          font-size: 14px;
          color: $color-text-d;
        }

        .icon-container {
          i {
            font-size: 14px;
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>
