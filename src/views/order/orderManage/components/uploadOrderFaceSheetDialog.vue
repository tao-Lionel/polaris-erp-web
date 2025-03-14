<template>
  <!-- 上传面单 -->
  <el-dialog
    title="上传面单"
    :visible.sync="showDialog"
    width="40%"
    top="10vh"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialogShowScroll"
  >
    <el-upload
      ref="upload"
      drag
      multiple
      action="String"
      :accept="accept"
      :on-change="handleChangeFile"
      show-file-list
      :auto-upload="false"
      :limit="maxSize"
      :on-exceed="handleExceed"
      :on-remove="handleRemoveFile"
    >
      <!-- <el-button size="small" type="primary">选择文件</el-button> -->
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        说明： <br />
        1.支持上传扩展名为{{ accept }}格式的文件。<br />
        2.每个文件大小为{{ maxMB }}M以内，单次上传最大数量为{{ maxSize }}张。
      </div>
    </el-upload>

    <span slot="footer">
      <el-button size="small" @click="close">关 闭</el-button>
      <el-button size="small" type="primary" @click="onHttpRequest">上传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { orderShippingLabelSaveApi } from "@/api/order/orderManage"
import { uploadFileBatchApi } from "@/api/common/index.js"
import { getFileExtension } from "@/util/auth"

export default {
  name: "uploadDeliveryNoteDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      fileList: [],
      accept: ".pdf,.png",
      maxMB: 5, // 文件大小
      maxSize: 100, // 文件个数
      uploadSuccessList: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(selectRows) {
      this.showDialog = true
      this.fileList = []
    },

    handleExceed() {
      this.$message.error(`一次最多上传${this.maxSize}张文件!`)
      this.$refs.upload.clearFiles()
    },

    // 验证文件
    validateFile(file) {
      // 校验文件类型
      let lastName = getFileExtension(file.name)
      let localFileType = this.accept.replace(/\./g, "").split(",")
      if (!localFileType.includes(lastName)) {
        this.$message.error("上传的文件格式不正确!")
        return false
      }
      // 校验文件大小
      const isLt1M = file.size / 1024 / 1024 < this.maxMB
      if (!isLt1M) {
        this.$message.error(`${file.name}文件大小超过 ${this.maxMB}MB!`)
        return false
      }
      return true
    },

    handleChangeFile(file, fileList) {
      if (this.validateFile(file)) {
        this.fileList.push({ ...file })
      }
      this.$nextTick(() => {
        // 更新 el-upload 组件的文件列表，只保留验证通过的文件
        this.$refs.upload.uploadFiles = fileList.filter((f) =>
          this.fileList.some((validFile) => validFile.uid === f.uid)
        )
      })
    },

    handleRemoveFile(file, fileList) {
      this.fileList = fileList.filter((f) => f.uid !== file.uid)
    },

    async onHttpRequest() {
      if (this.fileList.length === 0) {
        this.$message.warning("请选择要上传的文件")
        return
      }
      const files = this.fileList.filter((item) => item.raw).map((item) => item.raw)

      const formData = new FormData()
      for (let item of files) {
        formData.append("files", item)
      }

      const { data } = await uploadFileBatchApi(formData, "finance/platformbill/")
      if (data.code === 0) {
        this.uploadSuccessList = data.data
      }

      this.handleCreate()
    },

    async handleCreate() {
      const res = await orderShippingLabelSaveApi({
        uploadFileInfoList: this.uploadSuccessList.map((item) => {
          return {
            fileId: item.fileId,
            fileUrl: item.fileUrl,
            fileName: item.fileName
          }
        })
      })
      if (res.data.code === 0) {
        this.$message.success("上传成功!")
      }
      this.close()
    },

    close() {
      this.$refs.upload.clearFiles()
      this.fileList = []
      this.uploadSuccessList = []
      this.$emit("updateList")
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
::v-deep .el-dialog__body {
  overflow-y: auto;
}
::v-deep .el-upload-list--text {
  display: flex;
  flex-direction: column;
}
::v-deep .el-dialog {
  height: 500px;
  .el-dialog__body {
    overflow-y: auto;
    height: calc(100% - 135px);
  }
}
</style>
