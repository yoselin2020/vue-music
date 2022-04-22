<template>
  <div class="top-list">
    <div class="scroll-wrapper" ref="scrollRef">
      <div class="list-content">
        <div
          class="list-item"
          v-for="(top, index) of topList"
          :key="topList.id"
          @click.stop="toTopListDetail(top)"
        >
          <div class="img-wrapper">
            <img v-lazy="top.pic" :alt="topList.name" />
          </div>
          <div class="song-list-wrapper">
            <div
              class="song-item"
              v-for="(song, idx) of top.songList"
              :key="song.id"
            >
              <p class="song-desc">
                {{ idx + 1 }}.{{ song.songName }}-{{ song.singerName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="move">
        <component :pic="pic" :title="title" :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: "TopList",
};
</script>
<script setup>
import { getTopList } from "@/service/top-list";
import { onActivated, nextTick, onMounted, ref } from "vue";
import BScroll from "better-scroll";

import { useRouter } from "vue-router";

const router = useRouter();
const pic = ref("");
const title = ref("");
const topList = ref([]);

const scrollRef = ref(null);
const scrollInstance = ref(null);

onActivated(async () => {
  await nextTick();
  if (scrollInstance.value) {
    scrollInstance.value.refresh();
  }
  // console.log("top-list-activated");
});
function toTopListDetail(top) {
  //console.log(top);
  //  debugger;
  let id = top.id;
  let period = top.period;
  title.value = top.name;
  pic.value = top.pic;
  //console.log(id, "id");
  //  console.log(`/top-list/${id}`, "`/top-list/${id}`");
  router.push({
    path: `/top-list/${id}?period=${period}`,
  });
}

onMounted(async () => {
  try {
    const result = await getTopList();
    // console.log(result, "result");
    topList.value = result.topList;
    await nextTick();
    scrollInstance.value = new BScroll(scrollRef.value, {
      click: true,
      observeDOM: true,
    });
  } catch (err) {}
});
</script>

<style scoped lang="scss">
.top-list {
  height: 100%;
  .scroll-wrapper {
    height: 100%;
    .list-content {
      .list-item {
        box-sizing: border-box;
        padding: 10px 20px 0;
        display: flex;
        .img-wrapper {
          img {
            width: 100px;
            height: 100px;
          }
        }
        .song-list-wrapper {
          box-sizing: border-box;
          padding-left: 15px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          .song-item {
            .song-desc {
              color: $color-text-d;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
