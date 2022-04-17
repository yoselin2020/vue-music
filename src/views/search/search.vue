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
        <span class="icon-wrapper" @click.stop="clearSearchRecord"
          ><i class="iconfont icon-clear"></i
        ></span>
      </header>
      <div class="hot-search-record">
        <template v-for="(record, index) of searchRecord" :key="record.txt">
          <span class="text">{{ record.txt }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "throttle-debounce";
export default {
  name: "Search",
  data() {
    return {
      keyword: "",
      searchRecord: [
        { txt: "我们的歌" },
        { txt: "张杰" },
        { txt: "冰雪奇缘2" },
        { txt: "桥边姑娘" },
        { txt: "左手指月" },
        { txt: "星辰大海" },
      ],
    };
  },
  mounted() {
    this.$watch("keyword", debounce(500, this.searchHandle));
  },
  methods: {
    // 清空搜索记录
    async clearSearchRecord() {
      try {
        await this.$dialog.confirm({
          title: "提示",
          message: "确认清空搜索记录?",
          confirmButtonColor: "#6d6d6d",
          cancelButtonColor: "#6d6d6d",
        });
        this.searchRecord = [];
      } catch (err) {}
    },
    searchHandle(newVal) {
      if (newVal.trim() === "") {
        return;
      }
      console.log(newVal, "newVal");
      const searchList = this.searchRecord;
      searchList.unshift({
        txt: newVal,
      });
      this.searchRecord = [...new Set(searchList)];
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
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
        margin-left: 10px;
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
}
</style>
