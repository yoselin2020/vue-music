<template>
  <router-view></router-view>
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
