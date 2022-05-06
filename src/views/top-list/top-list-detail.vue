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
import { defineProps, onMounted, ref, onActivated, computed } from "vue";
import MusicList from "@/components/music-list/music-list";
import { useStore } from "vuex";
const store = useStore();
const props = defineProps({
  id: {
    type: [Number, String],
  },
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
});

const currentSingerInfo = computed(() => {
  return store.state.currentSingerInfo;
});

function selectSong(song) {
  if (props.songs.length > 0) {
    store.commit("setPlayList", props.songs);
    store.commit("setSequenceList", props.songs);
  } else {
    store.commit("setPlayList", currentSingerInfo.value.songs);
    store.commit("setSequenceList", currentSingerInfo.value.songs);
  }
  // console.log(song);
  //debugger;
  // 选择歌曲进行播放
  store.dispatch("selectSong", song);
}
//period
onMounted(async () => {
  //console.log(props.songs, "....");
  // if (!props.pic) {
  //   //console.log(route.matched[1].path, "route.matched[1].path");
  //   router.push({
  //     path: "/top-list",
  //     //route.matched[1].path,
  //   });
  // }
  // const period = useRoute().query.period;
  // const id = props.id;
  try {
    // const result = await getTopDetail({
    //   id,
    //   period,
    // });
    // songs.value = await processSongs(result.songs);
    //console.log(props, "props@@@@@");
    //store.commit("setSequenceList", songs.value);
    //console.log(songs, "songs.value");
  } catch (err) {}
  // console.log(props.id, "props.id");
});

onActivated(() => {
  console.log(props.songs, "songssongssongs");
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
