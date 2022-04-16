<template>
  <div class="my-header">
    <img class="img" src="./logo2.png" alt="" />
    <span class="text">Chicken Music</span>
  </div>
</template>

<script>
export default {
  name: "myHeader",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.my-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  background-color: $color-background;

  .img {
    width: 30px;
  }
  .text {
    margin-left: 8px;
    color: $color-theme;
    font-size: $font-size-large;
  }
}
</style>
