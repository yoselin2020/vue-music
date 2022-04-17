<template>
  <div class="singer-detail">
    <div
      class="singer-pic-wrapper"
      :style="{ backgroundImage: `url(${singer.pic})` }"
    >
      <header class="header">
        <i class="iconfont icon-back" @click="$router.back()"></i>
        <span>{{ singer.name }}</span>
      </header>
      <div class="random-play">
        <i class="icon iconfont icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
    </div>
    <div class="scroll-wrapper" ref="scrollWrapperRef">
      <!--      <scroll @scroll="scroll">-->
      <div
        class="songs-wrapper"
        :style="{ paddingBottom: fullScreen ? '' : '60px' }"
      >
        <div
          class="songs-item"
          v-for="(item, index) of songs"
          :key="index"
          @click="selectMusic(index)"
        >
          <div class="songs-name">{{ item.name }}</div>
          <div class="songs-desc">{{ item.singer }}·{{ item.album }}</div>
        </div>
      </div>
      <!--      </scroll>-->
    </div>
  </div>
</template>

<script>
import { getSingerDetail } from "@/service/singer";
import { processSongs } from "@/service/song";
import BScroll from "better-scroll";
import store from "storejs";
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "singer-detail",
  data() {
    return {
      songs: [],
      scrollY: 0,
      scrollEl: null,
    };
  },
  components: {},
  computed: {
    ...mapGetters(["fullScreen"]),
    singer() {
      let singer = store.get("singer");
      //console.log(singer, "singer55");
      return singer || {};
    },
  },
  async created() {
    const mid = this.$route.query.mid;
    try {
      const result = await getSingerDetail({ mid });
      //   console.log(result, "getSingerDetail");
      let songs = await processSongs(result.songs);
      this.songs = songs;
      this.setPlayList(songs);
      this.setSequenceList(songs);
      //  console.log(songs, "songs");
      // this.songs = ;
    } catch (err) {}
  },
  mounted() {
    console.log(this.fullScreen);
    this.scrollEl = new BScroll(this.$refs.scrollWrapperRef, {
      observeDOM: true,
      click: true,
      probeType: 3,
    });
    this.scrollEl.on("scroll", this.scroll);
  },
  methods: {
    ...mapMutations(["setPlayList", "setSequenceList"]),
    ...mapActions(["selectSong"]),
    selectMusic(index) {
      this.selectSong(index);
    },
    scroll({ x, y }) {
      this.scrollY = -y;
    },
  },
};
</script>

<style lang="scss" scoped>
.singer-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  .singer-pic-wrapper {
    position: relative;
    width: 100%;
    height: 262px;
    background-size: cover;
    .header {
      position: relative;
      text-align: center;
      line-height: 30px;
      font-size: $font-size-large;
      .icon-back {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .icon {
      vertical-align: middle;
      color: $color-theme;
    }
    .text {
      margin-left: 6px;
      color: $color-theme;
      font-size: $font-size-small;
    }
    .random-play {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 7px 20px;
      border-radius: 10px;
      border: 1px solid $color-theme;
    }
  }
  .scroll-wrapper {
    box-sizing: border-box;
    flex: 1;
    // padding-bottom: 200px;
    overflow: hidden;
    .songs-wrapper {
      box-sizing: border-box;
      padding: 30px;
      .songs-item {
        padding: 10px 0;
        .songs-name {
          font-size: $font-size-medium;
        }
        .songs-desc {
          margin-top: 10px;
          font-size: $font-size-medium;
          color: $color-text-d;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
