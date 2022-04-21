<template>
  <router-view></router-view>
  <router-view name="user" v-slot="{ Component }">
    <transition name="move">
      <component :is="Component" />
    </transition>
  </router-view>
  <!--音乐播放器组件-->
  <play-music></play-music>
</template>

<style lang="scss">
#app,
body,
html {
  height: 100%;
}
</style>
<script>
import PlayMusic from "@/components/play-music/play-music";
export default {
  components: { PlayMusic },
};
</script>
