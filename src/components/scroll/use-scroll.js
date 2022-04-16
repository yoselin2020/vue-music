import BScroll from "better-scroll";
import { ref, onMounted, onUnmounted } from "vue";
export default function useScroll(wrapper, options = {}, emit) {
  const scroll = ref(null);
  onMounted(() => {
    scroll.value = new BScroll(wrapper.value, {
      // 检测DOM的变化,会自动刷新scroll
      observeDOM: true,
      ...options,
    });
    if (options.probeType > 0) {
      scroll.value.on("scroll", (pos) => {
        emit("scroll", pos);
      });
    }
  });

  onUnmounted(() => {
    scroll.value.destroy();
  });

  return {
    scroll,
  };
}
