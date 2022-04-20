<template>
  <div class="search" ref="searchRef">
    <van-search
      ref="vanSearchCom"
      v-model="keyword"
      placeholder="请输入搜索关键词"
      background="#222222"
    />
    <!--  hot-search   -->
    <div
      class="hot-search-wrapper"
      v-show="hotKeys.length && songs.length === 0"
    >
      <header class="header">
        <span class="title">热门搜索</span>
      </header>
      <div class="hot-search-record">
        <template v-for="item of hotKeys" :key="item.id">
          <span class="text" @click="hotSearchItemClick(item)">{{
            item.key
          }}</span>
        </template>
      </div>
    </div>
    <div v-show="searchHistoryList.length && songs.length === 0">
      <header class="search-history-title">
        <span class="text">搜索历史</span>
        <span class="icon-wrapper" @click.stop="clearSearchRecord"
          ><i class="iconfont icon-clear"></i
        ></span>
      </header>
      <div class="scroll-wrapper" ref="scrollRef">
        <div class="search-history-wrapper">
          <div class="search-history-content">
            <div
              class="search-history-item"
              v-for="(searchHistory, index) of searchHistoryList"
              :key="searchHistory.txt"
            >
              <span class="search-txt">{{ searchHistory.txt }}</span>
              <span class="icon-container">
                <i
                  class="iconfont icon-close"
                  @click.stop="delSearchHistoryItem(index)"
                >
                </i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--搜索结果展示区域-->
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
              <span class="song-singer">{{ song.singer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHotKeys, search } from "@/service/search";
import { debounce } from "throttle-debounce";
import BScroll from "better-scroll";
import { nextTick } from "vue";
import request from "@/request";
import { mapActions, mapMutations } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      keyword: "",
      hotKeys: [],
      showSinger: true,
      page: 1,
      searchHistoryList: [
        { txt: "我们的歌" },
        { txt: "张杰" },
        { txt: "冰雪奇缘2" },
        { txt: "桥边姑娘" },
      ],
      searchShowSectionHeight: 0,
      scrollInstance: null,
      songs: [],
      searchSongsWrapperScrollInstance: null,
    };
  },
  async created() {
    try {
      const result = await getHotKeys();
      //console.log(result, "result");
      this.hotKeys = result.hotKeys;
    } catch (err) {}
  },
  watch: {
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
        if (this.searchSongsWrapperScrollInstance) {
          this.searchSongsWrapperScrollInstance.refresh();
        }
      },
    },
  },
  async mounted() {
    const height =
      this.$refs.searchRef.clientHeight -
      this.$refs.vanSearchCom.$el.clientHeight;
    this.searchShowSectionHeight = height;
    // console.log(this.searchShowSectionHeight, "this.searchShowSectionHeight");
    this.$watch("keyword", debounce(500, this.searchHandle));
    await nextTick();
    this.scrollInstance = new BScroll(this.$refs.scrollRef, {
      click: true,
      observeDOM: true,
    });
    this.searchSongsWrapperScrollInstance = new BScroll(
      this.$refs.searchSongsWrapperScrollRef,
      {
        click: true,
        observeDOM: true,
        probeType: 2,
        bounce: false,
      }
    );
  },
  methods: {
    ...mapMutations(["addTextToSearchHistoryList"]),
    ...mapActions(["addSongToPlayList"]),
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

    // 热门搜索点击事件
    hotSearchItemClick(item) {
      this.keyword = item.key;
      console.log(this.keyword, "this.keyword");
      //  this.reqSearch(item.key);
    },
    async reqSearch() {
      try {
        const result = await search(this.keyword, this.page, this.showSinger);
        console.log(result, "result");
      } catch (err) {
        console.log(err, "请求出错了！");
      }
    },
    delSearchHistoryItem(index) {
      this.searchHistoryList.splice(index, 1);
    },
    // 清空搜索记录
    async clearSearchRecord() {
      try {
        await this.$dialog.confirm({
          title: "提示",
          message: "确认清空搜索记录?",
          confirmButtonColor: "#6d6d6d",
          cancelButtonColor: "#6d6d6d",
        });
        this.searchHistoryList = [];
      } catch (err) {}
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
          let arrId = songs.map((song) => song.id).join(",");
          const result2 = await request("/song/url", {
            id: arrId,
          });
          let song2 = result2.data;
          songs.forEach((item) => {
            const findItem = song2.find((item2) => item2.id === item.id);
            item.url = findItem.url;
          });
          //console.log(result2, "result2");
          console.log(songs, "processSongs");
          songs = songs.map((item) => ({
            url: item.url,
            name: item.name,
            singer: item.ar[0].name,
            pic: item.al.picUrl,
            id: item.id,
            duration: item.dt / 1000,
            album: item.al.name,
          }));
          console.log(songs, "songssongssongssongs");
          this.songs = songs;
          await nextTick();
          this.recentlyPlayListSectionScrollInstance.refresh();
        }
      } catch (err) {}
      // this.reqSearch();
      // console.log(newVal, "newVal");
      // const searchHistoryList = this.searchHistoryList;
      // searchHistoryList.unshift({
      //   txt: newVal,
      // });
      // this.searchHistoryList = [...new Set(searchHistoryList)];
      // this.$nextTick(() => {
      //   this.scrollInstance = new BScroll(this.$refs.scrollRef, {
      //     click: true,
      //     observeDOM: true,
      //   });
      // });
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
    }
  }

  .hot-search-wrapper {
    padding: 0 12px;
    .header {
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
      display: flex;
      flex-wrap: wrap;
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
