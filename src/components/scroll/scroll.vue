<template>
  <div ref="rootRef" class="scroll">
    <slot></slot>
  </div>
</template>
<script setup>
import useScroll from "./use-scroll";
import { ref, defineEmits, defineProps, defineExpose } from "vue";
const rootRef = ref(null);
const emit = defineEmits(["scroll"]);
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
});
const { scroll } = useScroll(rootRef, props, emit);
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
