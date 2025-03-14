<template>
  <div class="execution" id="commonImport">
    <el-dialog class="importDailog" title="导入" :visible.sync="syncTpMTp" width="500px" @closed="closedFn">
      <tip title="必须按照下载模板进行导入" />
      <ul>
        <li>
          <el-form :model="importForm" ref="importForm" :inline="true">
            <el-form-item prop="uploadFile">
              <el-upload
                class="upload-demo"
                ref="upload"
                :show-file-list="false"
                list-type="text"
                :accept="fileSuffix"
                action="String"
                :auto-upload="false"
                :on-change="signFileChange"
              >
                <el-button type="primary" size="small">上传数据</el-button>
              </el-upload>
              <span>{{ importForm.attachmentFileName }}</span>
            </el-form-item>
          </el-form>
        </li>
        <li>
          <el-button type="dufault" size="small" @click="downloadTemplate">下载模板</el-button>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="importExcelBtn" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import request from "@/router/axios"
import tip from "./tip"
export default {
  name: "commonImport",
  props: {
    downloadUrl: String,
    downloadTitle: String,
    fileSuffix: {
      type: String,
      default: ".xls,.xlsx"
    }
  },

  data() {
    return {
      loading: false,
      //导入相关
      importForm: {
        file: {},
        attachmentFileName: "未选择任何文件"
      },
      syncTpMTp: false,
      fullscreenLoading: null
    }
  },
  updated() {},
  created() {},
  mounted: function () {},
  components: {
    tip
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    requestPost(url, obj, isBlob) {
      return request({
        url: url,
        method: "post",
        data: obj,
        responseType: isBlob ? "blob" : ""
      })
    },
    syncFn() {
      this.syncTpMTp = !this.syncTpMTp
    },
    openFullScreen() {
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "导入中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      })
    },
    closeFullScreen() {
      this.fullscreenLoading.close()
    },
    importExcelBtn() {
      if (this.importForm.file.raw) {
        this.$emit("import", this.importForm.file)
      } else {
        this.$message.warning("请选择需要上传的文件!!")
      }
    },
    closedFn() {
      this.importForm = {
        file: {},
        attachmentFileName: "未选择任何文件"
      }
      this.$emit("initStatus", false)
    },
    downloadTemplate() {
      this.requestPost(this.downloadUrl, { templateName: `${this.downloadTitle}.xlsx` }, true).then((res) => {
        const blob = new Blob([res.data], { type: "application/vnd.ms-excel;charset=utf-8" })
        const blobUrl = window.URL.createObjectURL(blob)
        const filename = `${this.downloadTitle}.xlsx`
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(blobUrl)
      })
    },
    signFileChange(file, fileList) {
      if (!file.name) {
        this.$message.warning("请选择需要上传的文件!!")
        return
      }
      const fileNameArr = file.name.split(".")
      const fileName = fileNameArr[fileNameArr.length - 1]
      if (fileName != "xls" && fileName != "xlsx") {
        this.$message.warning("请选EXCEL文件上传!!")
        return
      }
      if (file.size / 1024 / 1024 > 6) {
        this.$message.warning("文件文件限制为6M以内!!")
        return
      }
      this.importForm.file = file
      this.importForm.attachmentFileName = file.name
    }
  }
}
</script>

<style lang="scss" scoped>
.el-custom-info {
  background: #edf3ff;
  border: 1px solid #b7cefe;
  display: flex;
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  .icon-curstom-wn {
    margin-right: 10px;
    color: #4a85fd;
    font-size: 16px;
  }
  .el-custom-tip {
    color: #585a5d;
  }
}
</style>
