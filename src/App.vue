<template>
  <div class="app" ref="appRef">
    <my-header ref="myHeaderRef"></my-header>
    <tabbar ref="tabBarRef"></tabbar>
    <div class="scroll-wrapper" :style="[isPaddingBottom]">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"/>
        </keep-alive>
      </router-view>
    </div>
    <!--音乐播放器组件-->
    <play-music></play-music>
    <router-view name="user" v-slot="{ Component }">
      <transition name="move">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import PlayMusic from '@/components/play-music/play-music'
import myHeader from '@/components/my-header/my-header'
import tabbar from '@/components/tabbar/tabbar'

export default {
  name: 'App',
  components: { PlayMusic, myHeader, tabbar }
}
</script>

<style lang="scss" scoped>
.app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-wrapper {
  flex: 1;
  overflow: hidden;
}
</style>
