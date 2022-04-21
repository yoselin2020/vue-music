<template>
  <scroll @scroll="scroll" ref="scrollRef">
    <div class="recommend">
      <van-swipe
        class="my-swipe"
        :autoplay="3000"
        indicator-color="white"
        @change="change"
      >
        <van-swipe-item v-for="(slider, index) of sliders" :key="index">
          <a class="link">
            <img
              @click.stop=""
              @error="imgLoadError"
              class="img"
              :src="slider.pic"
              alt=""
            />
          </a>
        </van-swipe-item>
      </van-swipe>
      <!--热门歌单推荐-->
      <div class="hot-singer-recommend-wrapper">
        <header class="header">热门歌单推荐</header>

        <div class="hot-singer-recommend-content">
          <template v-for="(album, idx) of albums" :key="idx">
            <div
              class="hot-singer-recommend-item"
              @click="albumClickHandle(album)"
            >
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
  <router-view v-slot="{ Component }">
    <transition name="move">
      <component :is="Component" :pic="pic" :title="title" :songs="songs" />
    </transition>
  </router-view>
  <!--  <transition name="move">-->
  <!--    <router-view :pic="pic" :title="title" :songs="songs"></router-view>-->
  <!--  </transition>-->
</template>

<script>
import { getAlbum, getRecommend } from "@/service/recommend";

import Scroll from "@/components/scroll/scroll";
import { processSongs } from "@/service/song";
import { nextTick } from "vue";
export default {
  name: "Recommend",
  data() {
    return {
      albums: [],
      // 轮播图数据
      sliders: [],
      pic: "",
      title: "",
      songs: [],
    };
  },
  components: {
    Scroll,
  },
  watch: {
    sliders: {
      async handler() {
        //console.log(this.$refs.scrollRef, "this.$refs.scrollRef");
        await nextTick();
        this.$refs.scrollRef.scroll.refresh();
        // this.$refs.scrollRef.scroll.value.refresh();
      },
      albums: {
        async handler() {
          await nextTick();
          this.$refs.scrollRef.scroll.refresh();
        },
      },
    },
  },
  async created() {
    try {
      const result = await getRecommend();
      this.albums = result.albums;
      this.sliders = result.sliders;
    } catch (err) {}
  },
  methods: {
    imgLoadError() {
      console.log("imgLoadError");
    },
    change(event) {
      //   console.log(event, "event");
    },
    async albumClickHandle(album) {
      console.log(album, "album");
      const id = album.id;
      this.pic = album.pic;
      this.title = album.title;
      const result = await getAlbum(album);
      let songs = await processSongs(result.songs);
      this.songs = songs;
      // console.log(songs, "songs");
      this.$router.push({
        path: `/recommend/${id}`,
      });
      //debugger;
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
    margin-top: 2px;
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
