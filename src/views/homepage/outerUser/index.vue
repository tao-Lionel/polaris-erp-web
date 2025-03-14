<template>
  <basic-container>
    <div class="content-img"></div>
  </basic-container>
</template>
<style lang="scss" scoped>
.content-img {
  width: 100%;
  height: calc(100vh - 120px);
  position: relative;
  text-align: center;
  background-image: url("/img/home/home2.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

::v-deep.el-card__body {
  padding: 0px;
}
</style>
