<template>
  <div class="imgDialogWrapper">
    <!-- 查看图片 -->
    <el-dialog
      v-resize-dialog
      :visible.sync="dialogVisibleImg"
      append-to-body
      title="预览"
      class="myImgDialog"
      style="text-align: center"
    >
      <img
        class="view-img"
        @error="imgOnLoad"
        v-if="isShowImg && !imgIsList"
        @load="imgOnLoad"
        element-loading-background="transparent"
        v-loading.fullscreen.lock="imgLoading"
        :src="imgURL"
      />
      <img
        class="view-img"
        @error="imgOnLoad"
        v-for="(item, index) in imgURL"
        :key="index"
        v-if="isShowImg && imgIsList"
        @load="imgOnLoad"
        element-loading-background="transparent"
        v-loading.fullscreen.lock="imgLoading"
        :src="item"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getTokenUrl } from "@/util/auth"
import { mapGetters } from "vuex"

export default {
  name: "imgDialogWrapper",
  data() {
    return {
      dialogVisibleImg: false,
      imgURL: null,
      imgLoading: false,
      isShowImg: true,
      imgIsList: false
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    showImgUrl(url) {
      if (url instanceof Array) {
        this.isShowImg = true
        this.imgIsList = true
        this.dialogVisibleImg = true
        this.imgURL = url
      } else {
        this.imgIsList = false
        // let concatUrl = getTokenUrl(url)
        let concatUrl = url
        if (concatUrl !== this.imgURL) {
          this.isShowImg = false
          this.imgLoading = true
        }
        this.$nextTick(function () {
          this.isShowImg = true
          this.imgURL = concatUrl
          this.dialogVisibleImg = true
        })
      }
    },
    imgOnLoad() {
      this.imgLoading = false
    }
  }
}
</script>

<style lang="scss">
.myImgDialog {
  .view-img {
    max-width: 100%;
  }

  .el-dialog__body {
    min-height: 300px;
  }

  // .el-dialog__header{background: transparent!important;border: none!important;}
}
</style>
