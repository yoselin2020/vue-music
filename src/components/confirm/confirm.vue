<template>
  <teleport to="body">
    <div class="confirm">
      <div class="confirm-wrapper">
        <div class="tip-message">{{ message }}</div>
        <div class="btn-wrapper">
          <span class="clear" @click="confirm">清空</span>
          <span class="cancel" @click="cancel">取消</span>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: "confirm",
  data() {
    return {};
  },
  mounted() {
    console.log(this.visible, "visiblevisible");
  },
  emits: ["confirm", "cancel", "update:visible"],
  props: {
    message: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    confirm() {
      this.$emit("confirm");
      this.$emit("update:visible", false);
    },
    cancel() {
      this.$emit("cancel");
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 400;
  background-color: rgba(0, 0, 0, 0.3);
  .confirm-wrapper {
    border-radius: 10px;
    width: 250px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #333333;
    z-index: 401;
    height: 100px;
    .tip-message {
      @include f-center;
      flex: 1;
      font-size: 18px;
      color: $color-text-d;
    }
    .btn-wrapper {
      display: flex;
      height: 40px;
      border-top: 1px solid rgba(0, 0, 0, 0.3);
      .clear {
        color: #fff;
        @include f-center;
        flex: 1;
        color: $color-text-d;
      }
      .cancel {
        @include f-center;
        border-left: 1px solid rgba(0, 0, 0, 0.3);
        flex: 1;
        color: $color-text-d;
      }
    }
  }
}
</style>
