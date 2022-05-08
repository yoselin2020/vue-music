<template>
  <div class="tabbar">
    <template v-for="(tabbarItem, index) of tabbarList" :key="tabbarItem.text">
      <div class="tabbar-item" @click.stop="tabbarToggle(tabbarItem.pagePath)">
        <span
          :class="
            $route.path === tabbarItem.pagePath ||
            $route.path.includes(tabbarItem.pagePath)
              ? 'active'
              : ''
          "
          >{{ tabbarItem.text }}</span
        >
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Tabbar",
  data() {
    return {
      tabbarList: [
        { text: "推荐", pagePath: "/recommend" },
        { text: "歌手", pagePath: "/singer" },
        { text: "排行", pagePath: "/top-list" },
        { text: "搜索", pagePath: "/search" },
      ],
    };
  },
  methods: {
    // 路由的切换
    tabbarToggle(pagePath) {
      this.$router.push({
        path: pagePath,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tabbar {
  display: flex;
  .tabbar-item {
    flex: 1;
    text-align: center;
    line-height: 30px;

    > span {
      display: inline-block;
      height: 100%;
      padding: 0 2px;
      color: $color-text-d;
      font-size: $font-size-medium;
      &.active {
        position: relative;
        color: $color-theme;
        &::after {
          position: absolute;
          content: "";
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: $color-theme;
        }
      }
    }
  }
}
</style>
