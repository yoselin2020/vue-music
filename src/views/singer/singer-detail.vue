<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :pic="pic"
      :title="title"
      @selectSong="selectMusic"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from "@/service/singer";
import { processSongs } from "@/service/song";
// import store from "storejs";
import { mapMutations, mapActions } from "vuex";
import MusicList from "@/components/music-list/music-list";
export default {
  name: "singer-detail",
  data() {
    return {
      songs: [],
    };
  },
  props: {
    pic: String,
    title: String,
    id: String,
  },
  components: { MusicList },
  async created() {
    // if (!this.pic) {
    //   this.$router.push({
    //     path: "/singer",
    //   });
    // }
    // const mid = this.$route.query.mid;
    const mid = this.$route.params.id;
    try {
      const result = await getSingerDetail({ mid });
      //    debugger;
      let songs = await processSongs(result.songs);
      this.songs = songs;
      //console.log(this.songs, "this.songs.......");
    } catch (err) {}
  },
  mounted() {},
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
