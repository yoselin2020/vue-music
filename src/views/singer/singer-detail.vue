<template>
  <div class="singer-detail">
    <music-list
      @selectSong="selectMusic"
      :songs="songs"
      :pic="pic"
      :title="title"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from "@/service/singer";
import { processSongs } from "@/service/song";
import storage from "storejs";
import { mapMutations, mapActions } from "vuex";
import MusicList from "@/components/music-list/music-list";
import { SINGER_KEY } from "../../assets/js/constant.js";

export default {
  name: "singer-detail",
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
    id: {
      type: String,
      default: "",
    },
  },
  components: { MusicList },
  async created() {},
  mounted() {
    // console.log('mounted')
  },
  methods: {
    ...mapMutations(["setPlayList", "setSequenceList"]),
    ...mapActions(["selectSong"]),
    selectMusic(song) {
      this.setPlayList(this.songs);
      this.setSequenceList(this.songs);
      this.selectSong(song);
    },
  },
};
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #222222;
  z-index: 120;
}
</style>
