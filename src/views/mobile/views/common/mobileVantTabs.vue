<template>
  <div id="mobile_vant_tabs">
    <van-tabs
      sticky
      swipeable
      :color="color"
      :line-width="lineWidth"
      :title-active-color="titleActiveColor"
      :title-inactive-color="titleInactiveColor"
      :swipe-threshold="swipeThreshold"
      @change="onChange"
    >
      <!-- :class="{'height_add':item.count<minAcount}" -->
      <van-tab v-for="(item, index) in state" class="height_add" :key="index" :title="item">
        <div slot="title">
          <div class="top">
            <span :class="{ tag_class: true, color_over: status === index }">{{
              item.count > 999 ? "999+" : item.count
            }}</span>
          </div>
          <p class="tab_p">{{ item.name }}</p>
        </div>

        <slot></slot>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      status: 0
    }
  },
  props: {
    // 占满屏幕的最小数量
    minAcount: {
      type: Number,
      default: 4
    },
    color: {
      type: String,
      default: "#2a8efe"
    },
    lineWidth: {
      type: Number,
      default: 30
    },
    titleActiveColor: {
      type: String,
      default: "#2a8efe"
    },
    titleInactiveColor: {
      type: String,
      default: "rgba(51,51,51,.85)"
    },
    swipeThreshold: {
      type: Number,
      default: 3
    },
    state: Array
  },
  methods: {
    onChange(index) {
      this.status = index
      this.$emit("change", index)
    }
  }
}
</script>
<style lang="scss">
@import "../../style/base";
#mobile_vant_tabs {
  // 解决向上滚动屏幕闪动问题
  .van-tabs__wrap {
    top: 0px !important;
    position: fixed !important;
  }

  //顶部样式
  .van-tabs--line {
    padding-top: pxToRem(200);
  }
  .van-tabs__wrap {
    height: pxToRem(200);
  }
  .van-tab {
    padding: 0 pxToRem(4);
  }
  .top {
    height: pxToRem(80);
    margin-top: pxToRem(20);
    position: relative;
    &::after {
      display: block;
      content: "";
      border-top: pxToRem(8) dotted #e9e9ec;
      position: relative;
      top: -50%;
      transform: translate(0, -60%);
      z-index: 1;
    }

    .tag_class {
      display: inline;
      line-height: pxToRem(60);
      padding: pxToRem(15) pxToRem(25);
      border-radius: pxToRem(30);
      background-color: #e9e9ec;
      position: relative;
      z-index: 2;
      color: rgba(51, 51, 51, 0.85);
      font-size: pxToRem(30);
    }
    // 小红点
    // .dot{
    //     &::before{
    //         display: block;
    //         content: '';
    //         height: pxToRem(12);
    //         width: pxToRem(12);
    //         border-radius: pxToRem(6);
    //         background-color: red;
    //         position: absolute;
    //         top: pxToRem(10);
    //         right: pxToRem(12);
    //     }
    // }

    .color_over {
      background-color: #2a8efe;
      color: #fff;
    }
  }
  .tab_p {
    font-size: pxToRem(28);
    font-weight: bold;
  }
  //针对列表数不够的情况下不能左右操作滑动的问题
  .height_add {
    height: calc(100vh - #{pxToRem(200)});
  }
}
</style>
