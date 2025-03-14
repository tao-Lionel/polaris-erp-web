<template>
  <div id="pop_bun">
    <div class="pop-bun" v-if="buttons.length === 2">
      <el-button :type="buttons[0].type || 'info'" v-if="buttons[0].isShow" @click="popClose">{{
        buttons[0].value || "取消"
      }}</el-button>
      <el-button :type="buttons[1].type || 'primary'" v-if="buttons[1].isShow" @click="popPass">{{
        buttons[1].value || "确定"
      }}</el-button>
    </div>
    <div class="pop-bun pop-bun2" v-else>
      <el-button :type="buttons[0].type || 'primary'" v-if="buttons[0].isShow" @click="popPass">{{
        buttons[0].value || "确定"
      }}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    buttons: {
      type: Array,
      default: () => [
        {
          value: "取消",
          isShow: true,
          type: "info"
        },
        {
          value: "确定",
          isShow: true,
          type: "primary"
        }
      ]
    }
  },
  methods: {
    popClose() {
      this.$emit("popClose")
    },
    popPass() {
      this.$emit("popPass")
    }
  }
}
</script>
<style lang="scss">
@import "../../style/base";
#pop_bun {
  .pop-bun {
    margin-top: pxToRem(40);
    button {
      width: 40%;
      height: pxToRem(90);
      margin: 0 5%;
      border-radius: pxToRem(10);
    }
  }
  .pop-bun2 {
    button {
      margin: 0 30%;
    }
  }
}
</style>
