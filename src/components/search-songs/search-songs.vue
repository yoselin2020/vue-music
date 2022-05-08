<template>
  <div class="search-songs">
    <div
      class="list-item"
      v-for="(song, index) of songs"
      :key="song.id"
      @click.stop="selectSong(song)"
    >
      <div class="icon-wrapper">
        <img :src="require(`@/assets/images/music-logo-big.png`)" alt="logo" />
      </div>
      <div class="song-desc">
        <p class="song-name">{{ song.name }}</p>
        <p class="song-singer">
          <span>
            {{ song.singer }}
          </span>
        </p>
      </div>
      <div class="tools-wrapper" v-if="showTools">
        <tools @next-play="addToPlayListQueue(song)"></tools>
      </div>
    </div>
  </div>
</template>

<script>
import tools from "../tools/tools.vue";
export default {
  name: "search-songs",
  data() {
    return {};
  },
  components: {
    tools,
  },
  props: {
    songs: {
      type: Array,
      default: () => [],
    },
    showTools: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["selectSong"],
  methods: {
    addToPlayListQueue(song) {
      //console.log(song, "song");
      //this.currentSingerInfo.songs
      this.$store.commit("addToPlayListQueue", song);
      // console.log(song, "songi");
    },
    selectSong(songs) {
      this.$emit("selectSong", songs);
    },
  },
};
</script>

<style scoped lang="scss">
.search-songs {
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
        display: inline-block;
        width: 24px;
        text-align: center;
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
        text-align: left;

        span {
          font-size: 12px;
          display: inline-block;
          width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: $color-text-d;
        }
      }

      .song-name {
        overflow: hidden; //超出的文本隐藏

        text-overflow: ellipsis; //溢出用省略号显示

        display: -webkit-box;

        -webkit-line-clamp: 2; // 超出多少行

        -webkit-box-orient: vertical;

        font-size: 14px;
      }
    }
  }
}
</style>
