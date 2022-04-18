<template>
  <div class="index-list-wrapper">
    <div
      :class="['index-title', currentIndex === index ? 'active' : '']"
      v-for="(outSinger, index) of singers"
      @click="indexItemClick(index)"
    >
      {{ outSinger.title }}
    </div>
  </div>
  <scroll @scroll="scroll" ref="scrollRef">
    <div class="singer">
      <!--      <div class="fixedTitle" :style="fixedStyle">{{ fixedTitle }}</div>-->
      <div class="singer-content">
        <template v-for="(outSinger, index) of singers" :key="index">
          <div class="singer-item-wrapper">
            <header class="title">{{ outSinger.title }}</header>
            <div
              class="singer-item"
              v-for="(innerSinger, idx) of outSinger.list"
              :key="idx"
              @click.stop="toSingerDetail(innerSinger)"
            >
              <img :src="innerSinger.pic" alt="" />
              <span class="singer-name">{{ innerSinger.name }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </scroll>
  <router-view :pic="pic" :title="title"></router-view>
</template>

<script>
import { getSingerList } from "@/service/singer";
import scroll from "@/components/scroll/scroll";
import store from "storejs";
import { mapMutations } from "vuex";
export default {
  name: "Singer",
  components: { scroll },
  data() {
    return {
      singers: [],
      clientHeights: [],
      scrollY: 0,
      currentIndex: 0,
      fixedStyle: {},
      pic: "",
      title: "",
    };
  },
  computed: {
    fixedTitle() {
      if (this.singers.length) {
        return this.singers[this.currentIndex].title;
      }
      return "";
    },
  },
  async created() {
    try {
      let result = await getSingerList();
      //console.log(result, "result");
      this.singers = result.singers;
      await this.$nextTick();
      // 获取每个item的高度
      const singerItemWrappers = document.querySelectorAll(
        ".singer-item-wrapper"
      );
      let height = 0;
      const clientHeights = this.clientHeights;
      clientHeights.push(height);
      singerItemWrappers.forEach((ele) => {
        height += ele.clientHeight;
        clientHeights.push(height);
      });
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    toSingerDetail(innerSinger) {
      //   debugger;
      this.pic = innerSinger.pic;
      this.title = innerSinger.name;
      // console.log(innerSinger, "innerSinger");
      try {
        // store.set("singer", innerSinger);
        this.$router.push(`/singer/${innerSinger.mid}`);
        // this.$router.push("/singer-detail?mid=" + innerSinger.mid);
      } catch (err) {}
    },
    indexItemClick(index) {
      const singerItemWrappers = document.querySelectorAll(
        ".singer-item-wrapper"
      );
      const scroll = this.$refs.scrollRef.scroll;
      scroll.scrollToElement(singerItemWrappers[index], 300);
    },
    scroll(pos) {
      let fixedTitleHeight = 30; // 30px
      this.scrollY = -pos.y;
      for (let i = 0; i < this.clientHeights.length - 1; i++) {
        const prevHeight = this.clientHeights[i];
        const nextHeight = this.clientHeights[i + 1];
        if (this.scrollY >= prevHeight && this.scrollY <= nextHeight) {
          this.currentIndex = i;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// 右侧索引导航区域
.index-list-wrapper {
  box-sizing: border-box;
  padding: 15px 5px;
  position: fixed;
  top: 50%;
  right: 0;
  background-color: #242424;
  transform: translateY(-50%);
  z-index: 100;
  border-radius: 10px;
  .index-title {
    margin: 4px 0;
    font-size: $font-size-small;
    text-align: center;

    &.active {
      color: $color-theme;
    }
  }
}
.singer {
  // 头部固定区域
  .fixedTitle {
    position: fixed;
    top: 70px;
    left: 0;
    padding-left: 15px;
    width: 100%;
    box-sizing: border-box;
    font-size: $font-size-small;
    color: $color-text-d;
    line-height: 30px;
    background-color: $color-highlight-background;
  }
  .singer-content {
    .singer-item-wrapper {
      .title {
        box-sizing: border-box;
        font-size: $font-size-small;
        color: $color-text-d;
        padding-left: 15px;
        line-height: 30px;
        background-color: $color-highlight-background;
      }

      .singer-item {
        box-sizing: border-box;
        padding: 15px 25px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .singer-name {
          margin-left: 20px;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
