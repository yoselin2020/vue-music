<template>
  <div class="tools">
    <span @click.stop="nextPlay">
      <svg
        t="1650811025936"
        class="icon"
        viewBox="0 0 1025 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="45618"
        width="16"
        height="16"
      >
        <path
          d="M512 1024c-282.787759 0-512-229.248343-512-512C0 229.212241 229.212241 0 512 0 794.751657 0 1024.036102 229.212241 1024.036102 512 1024.036102 794.787759 794.751657 1024 512 1024zM768.036102 460.80722l-204.80722 0L563.228882 256 460.843323 256l0 204.80722L256 460.80722l0 102.385559 204.80722 0 0 204.80722 102.385559 0 0-204.80722 204.80722 0L768 460.80722z"
          p-id="45619"
          fill="#ffcd32"
        ></path>
      </svg>
      <!--      <img :src="require('@/assets/images/next3.png')" alt="" />-->
    </span>
  </div>
</template>

<script>
export default {
  name: "tools",
  data() {
    return {};
  },
  emits: ["next-play"],
  methods: {
    // 添加到下一首播放
    nextPlay() {
      this.$emit("next-play");
    },
  },
};
</script>

<style lang="scss" scoped>
.tools {
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;

  img {
    width: 20px;
  }
}
</style>
