<template>
  <div class="switch-tab">
    <div class="tab-wrapper">
      <div
        v-for="(item, index) of items"
        :key="index"
        class="tab-item"
        ref="itemWidthRef"
        @click="switchTab(index)"
        :style="{ color: currentIndex === index ? '#fff' : '' }"
      >
        {{ item }}
      </div>
      <div class="active" :style="transformStyle"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "switch-tab",
  data() {
    return {
      itemWidth: 0,
    };
  },
  computed: {
    transformStyle() {
      return {
        transform: `translate3d(${this.currentIndex * this.itemWidth}px,0,0)`,
      };
    },
  },
  mounted() {
    //console.log(this.$refs.itemWidthRef, "this.$refs.itemWidthRef");
    // 获取一个 tab-item的宽度
    this.itemWidth = this.$refs.itemWidthRef[0].clientWidth;
  },
  props: {
    currentIndex: {
      type: [Number, String],
      default: 0,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["switchTab"],
  methods: {
    switchTab(index) {
      this.$emit("switchTab", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.switch-tab {
  .tab-wrapper {
    position: relative;
    margin: 20px auto 0;
    // border: 1px solid red;
    width: 240px;
    display: flex;
    height: 30px;
    border: 1px solid $color-text-d;
    .active {
      position: absolute;
      top: 0;
      background-color: #333333;
      width: 50%;
      height: 100%;
      transition: all 0.3s linear;
    }
    .tab-item {
      position: relative;
      color: $color-text-d;
      z-index: 5;
      @include f-center;
      flex: 1;
      height: 100%;
    }
  }
}
</style>
