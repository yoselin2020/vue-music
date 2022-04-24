<template>
  <div class="tools">
    <span @click.stop="nextPlay">
      <img :src="require('@/assets/images/next3.png')" alt="" />
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
}
</style>
