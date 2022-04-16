<template>
  <div class="play-music" v-if="fullScreen">
    <header class="header">
      <i class="iconfont icon-back" @click="noFullScreen"></i>
      <span class="song-name">{{ currentSong.name }}</span>
    </header>
    <div class="singer-pic-wrapper">
      <div class="singer-name">{{ currentSong.singer }}</div>
      <div class="pic-box">
        <img :src="currentSong.pic" alt="" />
      </div>
    </div>

    <!--  歌曲播放时长区域   -->
    <div class="song-play-time-wrapper">
      <span class="play-time">{{
        formatDuration(Math.floor(currentTime))
      }}</span>
      <div
        class="progress-wrapper"
        ref="barRef"
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend"
      >
        <van-progress
          stroke-width="4px"
          color="#ffcd32"
          track-color="#363b32"
          :show-pivot="false"
          :percentage="progressBarWidth"
        />
      </div>
      <span class="song-duration">{{
        formatDuration(currentSong.duration)
      }}</span>
    </div>
    <!--控制按钮区域-->
    <div class="play-control-wrapper">
      <span class="play-mode-icon-wrapper">
        <i :class="['iconfont', playModeIcon]" @click.stop="togglePlayMode"></i>
      </span>
      <i class="iconfont icon-prev" @click="prevSong" :style="disableStyle"></i>
      <span class="is-playing" @click="toggleSongPlay" :style="disableStyle">
        <!--播放时候显示的按钮-->
        <i class="iconfont" :class="isPlaying ? 'icon-pause' : 'icon-play'"></i>
      </span>
      <i class="iconfont icon-next" @click="nextSong" :style="disableStyle"></i>
      <i
        class="iconfont"
        @click.stop="favoriteIconClick"
        :class="isFavorite()"
        :style="{ color: favoriteColor }"
      ></i>
    </div>
  </div>
  <audio
    ref="audioRef"
    @canplay="canplay"
    @durationchange="durationchange"
    @timeupdate="timeupdate"
    @ended="ended"
    @pause="pause"
  ></audio>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  defineExpose,
  nextTick,
  onMounted,
  reactive,
} from "vue";
import { useStore } from "vuex";
import { PLAY_MODE } from "@/assets/js/constant";
import { getLyric } from "@/service/song";
import Lyric from "lyric-parser";
// 音乐标签对应ref
const audioRef = ref(null);
// vuex store
const store = useStore();
// 进度条父盒子ref
const barRef = ref(null);
// 歌曲是否已经缓冲好了
const songReady = ref(true);
// 用户是否手动点击了暂停
const isUserPause = ref(false);
// 用户手指是否移动 progress
const isMove = ref(false);
let currentLyric = reactive({});
// 进度条对应的宽度
const progressBarWidth = ref(0);
// 音乐当前播放的时间
const currentTime = ref(0);
// 当前的歌曲
const currentSong = computed(() => {
  return store.getters.currentSong;
});

//是否正在播放
const isPlaying = computed(() => {
  return store.getters.isPlaying;
});
// 歌曲的长度
const songsLength = computed(() => {
  return store.getters.songsLength;
});
// 当前播放歌曲对应的索引
const currentIndex = computed(() => {
  return store.getters.currentIndex;
});

// 播放的模式
const playMode = computed(() => {
  return store.state.playMode;
});

const playModeIcon = computed(() => {
  const playModeIcon = {
    [PLAY_MODE.sequence]: "icon-sequence",
    [PLAY_MODE.random]: "icon-random",
    [PLAY_MODE.loop]: "icon-loop",
  };
  return playModeIcon[playMode.value];
});

// 切换播放的模式
function togglePlayMode() {
  store.commit("setPlayMode", (playMode.value + 1) % 3);
}

// 歌曲播放结束
function ended() {
  //console.log("歌曲播放结束了");
  // 歌曲自然播放结束调用下一首歌曲进行播放
  nextSong();
}
let pageX, rect;
// 手指触摸开始
function touchstart(event) {
  console.log(event, "touchstart");
  pageX = event.touches[0].pageX;
  rect = event.target.getBoundingClientRect();
}

// 手指移动事件, 还需要去计算歌词
function touchmove(event) {
  isMove.value = true;
  //console.log(event, "touchmove");
  pageX = event.touches[0].pageX;
  rect = event.target.getBoundingClientRect();
  let distance = Math.floor(pageX - rect.left);
  const width = event.currentTarget.clientWidth;
  let value = distance / width;
  currentTime.value = Math.min(
    value * currentSong.value.duration,
    currentSong.value.duration
  );
  value *= 100;
  // console.log(currentSong.value.duration, "currentSong.value.duration");
  //console.log(currentTime, "currentTime////33");
  progressBarWidth.value = value;
}

// 手指触摸离开
function touchend(event) {
  isMove.value = false;
  //console.log(event, "touchend");
  //console.log(pageX, "pageX");
  //console.log(rect.left, "left");
  let distance = Math.floor(pageX - rect.left);
  // 进度条的距离
  //console.log(distance, "distance");
  const width = event.currentTarget.clientWidth;
  let value = distance / width;
  // currentTime.value
  //progressBarWidth.value = distance / 100;
  //console.log(rect, "rect");
  currentTime.value = Math.min(
    value * currentSong.value.duration,
    currentSong.value.duration
  );
  console.log(currentTime.value, "currentTime.value");
  if (!isPlaying.value) {
    store.commit("setPlaying", true);
  }
  audioRef.value.currentTime = currentTime.value;
  value *= 100;
  // console.log(currentSong.value.duration, "currentSong.value.duration");
  //console.log(currentTime, "currentTime////33");
  progressBarWidth.value = value;
}
// audio 暂停事件
function pause() {
  store.commit("setPlaying", false);
}

// 上一首
function prevSong() {
  // progressBarWidth.value = 0;
  // currentTime.value = 0;
  let index = currentIndex.value;
  index--;
  if (index < 0) {
    // 如果已经值是-1就跳到最后一首进行播放
    index = songsLength.value - 1;
  }
  // 获取当前所在歌曲的索引
  store.commit("setPlaying", true);
  store.commit("setCurrentIndex", index);
}
//下一首
function nextSong() {
  //  progressBarWidth.value = 0;
  //currentTime.value = 0;
  let index = currentIndex.value;
  index++;
  if (index === songsLength.value) {
    // 如果越界了就播放到第一手歌曲进行播放
    index = 0;
  }
  // 获取当前所在歌曲的索引
  store.commit("setPlaying", true);
  store.commit("setCurrentIndex", index);
}

const favoriteSongList = computed(() => {
  return store.state.favoriteSongList;
});

function timeupdate(event) {
  if (!isPlaying.value) {
    // 暂停状态
    return;
  }

  // 用户手指在拖动
  if (isMove.value) {
    return;
  }
  currentTime.value = event.target.currentTime;
  progressBarWidth.value =
    (currentTime.value / currentSong.value.duration) * 100;
}

function durationchange(event) {
  // console.log(event, "event...");
}

function favoriteIconClick() {
  //console.log(currentSong.value, "currentSong.value");
  store.commit("toggleFavorite", currentSong.value);
}

function canplay() {
  songReady.value = true;
  //console.log("缓冲好了");
  if (isPlaying.value) {
    audioRef.value.play();
    currentLyric.play();
  } else {
    audioRef.value.pause();
    currentLyric.stop();
  }
}

// 喜欢的歌曲icon颜色
const favoriteColor = computed(() => {
  const findItem = favoriteSongList.value.find((item) => {
    return item.id === currentSong.value.id;
  });
  return findItem ? "#d93f30" : "";
});

// 歌曲是否喜欢
function isFavorite() {
  const findItem = favoriteSongList.value.find((item) => {
    return item.id === currentSong.value.id;
  });
  return findItem ? "icon-favorite" : "icon-not-favorite";
}

// 暴露数据给外部 父组件可以通过ref 获取到组件拿到数据
defineExpose({
  audioRef,
});

// 不是全屏播放
function noFullScreen() {
  store.commit("setFullScreen", false);
}
// console.log(currentSong, "currentSong");
// 监视音乐是否播放状态
watch(isPlaying, (newVal) => {
  // if (!audioRef.value) {
  //   return;
  // }
  // 歌曲播放的时候也是需要 给一个 src
  audioRef.value.src = currentSong.value.url;
  // 避免暂停后再次播放从头开始播放
  audioRef.value.currentTime = currentTime.value;
});

// 不可点击样式
const disableStyle = computed(() => {
  if (!songReady.value) {
    return {
      opacity: 0.3,
    };
  }
  return {};
});

// 格式化音乐时长
function formatDuration(time) {
  if (time > -1) {
    //let hour = Math.floor(time / 3600);
    let min = Math.floor(time / 60) % 60;
    let sec = time % 60;
    time = "";
    // if (hour < 10) {
    //   time = "0" + hour + ":";
    // } else {
    //   time = hour + ":";
    // }
    if (min < 10) {
      time += "0";
    }
    time += min + ":";

    if (sec < 10) {
      time += "0";
    }
    time += sec;
  }
  //console.log(time, "time");
  //let i = time.indexOf(":");
  return time;
  //return time.substring(i + 1);
}

// 监听当前歌曲的变化
watch(currentSong, async (newSong) => {
  console.log(newSong, "newSong");
  try {
    songReady.value = false;
    newSong.lyric = await getLyric(newSong);
    currentLyric = new Lyric(newSong.lyric, handler);
    // 播放歌词
    function handler({ lineNum, txt }) {
      console.log(lineNum, txt);
    }
    //console.log(currentLyric, "currentLyric");
    //console.log(result, "result");
    // audioRef.value不为空
    if (audioRef.value) {
      audioRef.value.src = newSong.url;
    }
  } catch (err) {}
});

function toggleSongPlay() {
  songReady.value = false;
  isUserPause.value = true;
  store.commit("setPlaying", !isPlaying.value);
}

const fullScreen = computed(() => {
  return store.getters.fullScreen;
});
</script>

<style lang="scss" scoped>
.play-music {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: $color-background;
  z-index: 99999;

  .song-play-time-wrapper {
    box-sizing: border-box;
    position: fixed;
    bottom: 100px;
    left: 0;
    width: 100%;
    padding: 10px 20px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    // background-color: pink;

    .play-time {
      font-size: 12px;
    }
    .song-duration {
      font-size: 13px;
    }

    .progress-wrapper {
      box-sizing: border-box;
      margin: 0 10px;
      flex: 1;
      .van-progress {
        ::v-deep(.van-progress__portion) {
          // position: relative;
          &::after {
            position: absolute;
            content: "";
            right: 0;
            top: 50%;
            transform: translate(50%, -50%);
            display: inline-block;
            width: 10px;
            height: 10px;
            border: 2px solid #fff;
            border-radius: 50%;
            background-color: #ffcd32;
          }
        }
      }
    }
  }

  .play-control-wrapper {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 40px;
    color: $color-theme;
    font-size: 30px;
  }

  .header {
    text-align: center;
    position: relative;
    line-height: 40px;
    .icon-back {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%) rotate(-90deg);
      color: $color-theme;
    }
  }

  .singer-pic-wrapper {
    .singer-name {
      margin-bottom: 20px;
      text-align: center;
    }
    .pic-box {
      margin: 0 auto;
      width: 300px;
      height: 300px;
      overflow: hidden;
      border: 10px solid #4e5649;
      background-color: pink;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
