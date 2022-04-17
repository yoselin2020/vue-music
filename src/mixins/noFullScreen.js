import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      isPaddingBottom: (state) =>
        !state.fullScreen && state.currentIndex !== -1
          ? { paddingBottom: "65px" }
          : { paddingBottom: "" },
    }),
  },
};
