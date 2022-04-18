<template>
  <div class="recommend-detail">
    <music-list
      :pic="pic"
      :title="title"
      :songs="songs"
      @selectSong="selectSong"
    ></music-list>
  </div>
</template>

<script>
import MusicList from "@/components/music-list/music-list";
export default {
  name: "recommend-detail",
  components: { MusicList },
  data() {
    return {};
  },
  props: {
    pic: String,
    title: String,
    songs: Array,
  },
  methods: {
    selectSong(song) {
      // 选择歌曲进行播放
      this.$store.commit("setPlayList", this.songs);
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
