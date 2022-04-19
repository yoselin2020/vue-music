<template>
  <div class="search">
    <van-search
      v-model="keyword"
      placeholder="请输入搜索关键词"
      background="#222222"
    />
    <!--  hot-search   -->
    <div class="hot-search-wrapper">
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
    <template v-if="searchHistoryList.length">
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
    </template>
  </div>
</template>

<script>
import { getHotKeys, search } from "@/service/search";
import { debounce } from "throttle-debounce";
import BScroll from "better-scroll";
import { nextTick } from "vue";
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
      scrollInstance: null,
    };
  },
  async created() {
    try {
      const result = await getHotKeys();
      //console.log(result, "result");
      this.hotKeys = result.hotKeys;
    } catch (err) {}
  },
  mounted() {
    this.$watch("keyword", debounce(500, this.searchHandle));
    this.$nextTick().then(() => {
      this.scrollInstance = new BScroll(this.$refs.scrollRef, {
        click: true,
        observeDOM: true,
      });
    });
  },
  methods: {
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
    searchHandle(newVal) {
      if (newVal.trim() === "") {
        return;
      }
      this.reqSearch();
      console.log(newVal, "newVal");
      const searchHistoryList = this.searchHistoryList;
      searchHistoryList.unshift({
        txt: newVal,
      });
      this.searchHistoryList = [...new Set(searchHistoryList)];
      this.$nextTick(() => {
        this.scrollInstance = new BScroll(this.$refs.scrollRef, {
          click: true,
          observeDOM: true,
        });
      });
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
