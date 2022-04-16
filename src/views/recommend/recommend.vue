<template>
  <scroll @scroll="scroll">
    <div class="recommend">
      <van-swipe
        class="my-swipe"
        :autoplay="3000"
        indicator-color="white"
        @change="change"
      >
        <van-swipe-item v-for="(slider, index) of sliders" :key="index">
          <a class="link" :href="slider.link">
            <img class="img" :src="slider.pic" alt="" />
          </a>
        </van-swipe-item>
      </van-swipe>
      <!--热门歌单推荐-->
      <div class="hot-singer-recommend-wrapper">
        <header class="header">热门歌单推荐</header>

        <div class="hot-singer-recommend-content">
          <template v-for="(album, idx) of albums" :key="idx">
            <div class="hot-singer-recommend-item">
              <img
                class="hot-singer-recommend-item-img"
                v-lazy="album.pic"
                alt=""
              />
              <div class="hot-singer-recommend-item-desc">
                <div class="singer-name">{{ album.username }}</div>
                <div class="singer-title">{{ album.title }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </scroll>
</template>

<script>
import { getRecommend } from "@/service/recommend";
import Scroll from "@/components/scroll/scroll";
export default {
  name: "Recommend",
  data() {
    return {
      albums: [],
      // 轮播图数据
      sliders: [],
    };
  },
  components: {
    Scroll,
  },
  async created() {
    try {
      const result = await getRecommend();
      this.albums = result.albums;
      this.sliders = result.sliders;
    } catch (err) {}
  },
  methods: {
    change(event) {
      //console.log(event, "event");
    },
    scroll(pos) {
      // console.log(pos, "pos");
    },
  },
};
</script>

<style lang="scss" scoped>
.recommend {
  .my-swipe {
    .van-swipe-item {
      height: 150px;
      .link {
        height: 100%;
        .img {
          height: 100%;
        }
      }
    }

    :deep .van-swipe__indicator--active {
      width: 16px;
      border-radius: 5px;
    }
  }

  .hot-singer-recommend-wrapper {
    .header {
      line-height: 50px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-theme;
    }

    .hot-singer-recommend-content {
      .hot-singer-recommend-item {
        box-sizing: border-box;
        padding: 15px;
        display: flex;
        .hot-singer-recommend-item-img {
          width: 60px;
          height: 60px;
        }
        .hot-singer-recommend-item-desc {
          margin-left: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;

          .singer-name {
            font-size: $font-size-medium;
          }
          .singer-title {
            color: $color-text-d;
            font-size: $font-size-medium;
          }
        }
      }
    }
  }
}
</style>
