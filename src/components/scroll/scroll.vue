<template>
  <div ref="rootRef" class="scroll">
    <slot></slot>
  </div>
</template>
<script setup>
import useScroll from "./use-scroll";
import {
  ref,
  defineEmits,
  defineProps,
  defineExpose,
  watch,
  computed,
  nextTick,
} from "vue";
import { useStore } from "vuex";
const rootRef = ref(null);
const store = useStore();
const emit = defineEmits(["scroll"]);

const fullScreen = computed(() => store.state.fullScreen);

//语法糖必须使用defineProps替代props
const props = defineProps({
  click: {
    type: Boolean,
    default: true,
  },
  probeType: {
    type: Number,
    default: 3,
  },
  observeDOM: {
    type: Boolean,
    default: true,
  },
});
const { scroll } = useScroll(rootRef, props, emit);

watch(fullScreen, async (newFullScreen) => {
  if (!newFullScreen) {
    await nextTick();
    // 让better-scroll重新计算高度
    scroll.value.refresh();
  }
});
// console.log(scroll, "scroll");
defineExpose({
  scroll,
});
</script>

<style scoped lang="scss">
.scroll {
  height: 100%;
}
</style>
