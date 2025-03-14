<template>
  <div class="pre-down-look">
    <el-dialog :visible.sync="showFlag" title="查看" :append-to-body="false">
      <div v-if="download" class="pdf-btn">
        <el-button type="primary" size="mini" @click="downLoad()">下载</el-button>
      </div>
      <div class="pdf-body">
        <div
          v-loading.fullscreen.lock="showModel"
          element-loading-text="首次加载文件比较慢,拼命加载中"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        ></div>
        <!-- pdf _003-->
        <pdf v-for="i in 20" :key="i" :src="src" :page="i" style="display: inline-block; width: 100%"></pdf>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pdf from "vue-pdf"
import { getTokenUrl } from "@/util/auth"
export default {
  name: "pre-down-look",
  data() {
    return {
      showFlag: false,
      showModel: false,
      src: "",
      numPages: 0,
      urlDown: ""
    }
  },
  props: {
    innerVisible: Boolean,
    download: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  methods: {
    pdfFn(url) {
      this.showFlag = true
      url = getTokenUrl(url)
      if (url !== this.urlDown) {
        this.urlDown = url
        const task = pdf.createLoadingTask(url)
        this.src = task
        let _this = this
        _this.showModel = true
        task
          .then(function (pdf) {
            _this.numPages = pdf._pdfInfo.numPages
            _this.showModel = false
          })
          .catch(function (err) {
            _this.$message.error("文档预览解析出错")
            _this.showModel = false
          })
      }
    },
    downLoad() {
      window.location = this.urlDown
    }
  },
  components: {
    pdf
  }
}
</script>

<style lang="scss" scoped>
.pre-down-look {
  .el-dialog__header {
    border-bottom: 0px solid #eceef5 !important;
  }

  ::v-deep.el-dialog {
    height: 80%;
  }

  ::v-deep.el-dialog__body {
    height: calc(100% - 40px);
  }

  ::v-deep.el-dialog__body {
    padding: 0 !important;
  }

  .pdf-btn {
    padding: 10px;
  }

  .pdf-body {
    padding: 10px 10px 20px;
    height: calc(100% - 68px);
    overflow: hidden;
    overflow-y: scroll;
    border: 1px solid #eceef5;
  }
}
</style>
