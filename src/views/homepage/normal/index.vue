<template>
  <basic-container>
    <div class="content-img">
      <!-- <img src="/img/home/home.jpg" /> -->
      <!-- <div class="right-bottom home-span">
        <span>创新</span>
        <span>尊重</span>
        <span>敬畏</span>
        <span>不凡</span>
        <span>相信</span>
      </div> -->
    </div>
  </basic-container>
</template>
<style lang="scss" scoped>
.content-img {
  width: 100%;
  height: calc(100vh - 120px);
  position: relative;
  text-align: center;
  background-image: url("/img/home/home.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.right-bottom {
  position: absolute;
  bottom: 10px;
  right: 20px;
}

.home-span {
  span {
    //  color: #ffcc99;
    // color: rgba(255, 221, 153, .8);
    color: rgba(27, 169, 177, 0.8);
    font-size: 30px;
    margin: 5px 20px 10px 80px;
    font-weight: bold;
  }
}

::v-deep.el-card__body {
  padding: 0px;
}
</style>
