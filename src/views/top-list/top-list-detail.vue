<template>
  <div class="top-list-detail" :style="isPaddingBottom">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      @selectSong="selectSong"
    ></music-list>
  </div>
</template>

<script>
export default {
  name: "top-list-detail",
};
</script>

<script setup>
import { defineProps, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getTopDetail } from "@/service/top-list";
import { processSongs } from "@/service/song";
import MusicList from "@/components/music-list/music-list";
import { useStore } from "vuex";
const store = useStore();
const songs = ref([]);
const props = defineProps({
  id: {
    type: [Number, String],
  },
  pic: {
    type: String,
  },
  title: {
    type: String,
  },
});

function selectSong(song) {
  console.log(song);
  //debugger;
  // 选择歌曲进行播放
  store.dispatch("selectSong", song);
}
//period
onMounted(async () => {
  const period = useRoute().query.period;
  const id = props.id;
  try {
    const result = await getTopDetail({
      id,
      period,
    });
    songs.value = await processSongs(result.songs);
    store.commit("setPlayList", songs.value);
    store.commit("setSequenceList", songs.value);
    // console.log(songs.value, "songs.value");
  } catch (err) {}
  // console.log(props.id, "props.id");
});
</script>

<style scoped lang="scss">
.top-list-detail {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #222222;
  z-index: 100;
}
</style>
