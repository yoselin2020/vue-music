<template>
  <div class="home">
    <my-header></my-header>
    <tabbar></tabbar>
    <div class="scroll-wrapper" :style="isPaddingBottom">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import MyHeader from "@/components/my-header/my-header";
import Tabbar from "@/components/tabbar/tabbar";
export default {
  name: "Home",
  components: { Tabbar, MyHeader },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;

  .scroll-wrapper {
    flex: 1;
    overflow: hidden;
  }
}
</style>
