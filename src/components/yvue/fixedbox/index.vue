<!--
  首次使用在采购变更编辑页面中
  可以按需拖动防止位置
  该组件在页面中使用，不需全局注册

-->
<template>
  <div class="fixed-model-box">
    <div v-if="isShow" v-move-fixed class="fixed-model el-dialog" :style="styleProps" style="margin: 0">
      <div class="fixed-model-title">
        <p>{{ fixedTitle }}</p>
        <!-- <div style='height:40px;width:40px;background:blue;'>test</div> -->
        <i @mousedown.stop @click.stop="isShow = !isShow" class="fixed-model-close el-icon-close"></i>
      </div>
      <div class="fixed-model-content">
        <slot name="content"></slot>
      </div>
    </div>
    <i v-if="!isShow" class="icon-chakan y-reviews fixed-active" @click.stop="isShow = !isShow"></i>
  </div>
</template>
<script>
// isShow=!isShow
export default {
  name: "fixed-box",
  data() {
    return {
      isShow: true
    }
  },
  props: {
    fixedTitle: String,
    styleProps: String
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.fixed-model {
  position: fixed;
  cursor: pointer;
  z-index: 2000;
  bottom: 2px;
  left: 220px;
  height: 200px;
  width: 300px;
  overflow: hidden;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 3px #eee;

  .fixed-model-title {
    background: #eee;
    font-weight: bold;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .fixed-model-content {
    padding: 5px 10px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 36px);
    overflow: hidden;
    overflow-y: scroll;
  }

  .fixed-model-close {
    cursor: pointer;
    font-size: 18px;
  }

  // left: 220px;top: unset;bottom: 0px;right: unset;
  // ::v-deep.el-dialog{width: 300px;margin: 0!important;display: inline-block;}
}

@keyframes reviewModel {
  0% {
    bottom: 40px;
  }

  20% {
    bottom: 10px;
  }

  40% {
    bottom: 28px;
  }

  60% {
    bottom: 10px;
  }

  80% {
    bottom: 15px;
  }

  100% {
    bottom: 10px;
  }
}

.fixed-active {
  position: fixed;
  left: 245px;
  bottom: 10px;
  background: transparent;
  animation: reviewModel 1s;
}
</style>
