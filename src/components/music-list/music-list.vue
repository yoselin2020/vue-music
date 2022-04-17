<template>
  <div class="music-list">
    <div class="img-wrapper" :style="{ backgroundImage: `url(${props.pic})` }">
      <div class="filter"></div>
      <header class="header">
        <i class="iconfont icon-back" @click="$router.back()"></i>
        <span class="title">{{ props.title }}</span>
      </header>
      <div class="random-play-all">
        <i class="iconfont icon-play"></i>
        <span>随机播放全部</span>
      </div>
    </div>
    <div class="play-list">
      <div class="play-list-wrapper">
        <div class="scroll-wrapper" ref="scrollRef">
          <div class="list-content">
            <div
              class="list-item"
              v-for="(song, index) of props.songs"
              :key="song.id"
              @click="selectSong(song)"
            >
              <!--              {{ song }}-->
              <div class="icon-wrapper">
                <img
                  v-if="index < 3"
                  :src="require(`@/assets/images/icon${index}.png`)"
                />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="song-desc">
                <p class="song-name">{{ song.name }}</p>
                <p class="song-singer">{{ song.singer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "music-list",
};
</script>

<script setup>
import {
  defineProps,
  ref,
  defineEmits,
  onMounted,
  nextTick,
  onUnmounted,
} from "vue";
import BScroll from "better-scroll";
import { useStore } from "vuex";
const emits = defineEmits(["selectSong"]);
const scrollInstance = ref(null);
const scrollRef = ref(null);
const store = useStore();
const props = defineProps({
  pic: {
    type: String,
  },
  title: {
    type: String,
  },
  songs: {
    type: Array,
  },
});
function selectSong(song) {
  // console.log(song);
  // debugger;
  emits("selectSong", song);
}
onUnmounted(() => {
  scrollInstance.value = null;
});
onMounted(async () => {
  await nextTick();
  scrollInstance.value = new BScroll(scrollRef.value, {
    observeDOM: true,
    click: true,
  });
  //console.log(props.songs, "o");
});
</script>

<style lang="scss" scoped>
.music-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  .img-wrapper {
    position: relative;
    height: 260px;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }

    .header {
      position: relative;
      text-align: center;
      line-height: 40px;
      .icon-back {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 15px;
        color: $color-theme;
      }
    }
    .random-play-all {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;
      border: 1px solid $color-theme;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 14px;
      color: $color-theme;
      .icon-play {
        vertical-align: middle;
      }
      span {
        margin-left: 5px;
        vertical-align: middle;
      }
    }
  }
  .play-list {
    flex: 1;
    overflow: hidden;
    .play-list-wrapper {
      height: 100%;
      .scroll-wrapper {
        height: 100%;
        .list-content {
          padding: 15px 40px;
          .list-item {
            display: flex;
            .icon-wrapper {
              margin-right: 15px;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                width: 24px;
              }
              span {
                color: $color-theme;
              }
            }

            .song-desc {
              height: 60px;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              .song-singer {
                font-size: 12px;
                color: $color-text-d;
              }
              .song-name {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
