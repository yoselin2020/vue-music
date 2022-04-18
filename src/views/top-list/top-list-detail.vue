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
import { useRoute, useRouter } from "vue-router";
import { getTopDetail } from "@/service/top-list";
import { processSongs } from "@/service/song";
import MusicList from "@/components/music-list/music-list";
import { useStore } from "vuex";
const router = useRouter();
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
  // console.log(song);
  //debugger;
  // 选择歌曲进行播放
  store.commit("setPlayList", songs.value);
  store.dispatch("selectSong", song);
}
//period
onMounted(async () => {
  if (!props.pic) {
    let route = useRoute();
    //console.log(route.matched[1].path, "route.matched[1].path");
    router.push({
      path: route.matched[1].path,
    });
  }
  const period = useRoute().query.period;
  const id = props.id;
  try {
    const result = await getTopDetail({
      id,
      period,
    });
    songs.value = await processSongs(result.songs);
    store.commit("setSequenceList", songs.value);
    //console.log(songs, "songs.value");
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
