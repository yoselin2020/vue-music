<template>
  <div class="recommend-detail">
    <music-list @selectSong="selectSong"></music-list>
    <!-- :pic="pic"
      :title="title"
      :songs="songs"  -->
  </div>
</template>

<script>
import MusicList from "@/components/music-list/music-list";
import storage from "storejs";
import { SINGER_KEY } from "../../assets/js/constant.js";

export default {
  name: "recommend-detail",
  components: { MusicList },
  data() {
    return {};
  },
  props: {
    pic: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    songs: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    songs: {
      handler(newVal) {
        console.log(newVal, "newVal");
      },
    },
  },
  created() {
    if (this.songs.length && this.pic && this.title) {
      const cacheData = {
        songs: this.songs,
        pic: this.pic,
        title: this.title,
      };
      storage.set(SINGER_KEY, cacheData);
    }
  },
  async mounted() {},
  methods: {
    selectSong(song) {
      // 选择歌曲进行播放
      this.$store.commit("setPlayList", this.songs);
      this.$store.commit("setSequenceList", this.songs);
      this.$store.dispatch("selectSong", song);
    },
  },
};
</script>

<style scoped lang="scss">
.recommend-detail {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #222222;
  z-index: 100;
}
</style>
