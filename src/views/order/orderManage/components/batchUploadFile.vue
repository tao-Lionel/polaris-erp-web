<template>
  <el-dialog
    title="批量上传附件"
    :visible.sync="showDialog"
    width="660px"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <div>
      <el-upload
        ref="upload"
        drag
        :multiple="true"
        :action="action"
        :accept="accept"
        :before-upload="onBeforeUpload"
        :on-change="handleChangeFile"
        show-file-list
        :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip" style="margin-bottom: 15px">
          说明： <br />
          1.支持上传扩展名为{{ accept }}格式的文件
          <!-- 每个文件大小为{{ maxMB }}M以内，单次上传最大数量为
          {{ maxSize }}张；<br /> -->
          <!-- 2.请确保文件状态为上传成功；<br /> -->
          <div style="display: flex; justify-content: flex-end; margin-right: 50px">
            <el-button size="small" type="primary" @click="onHttpRequest">上传</el-button>
          </div>
        </div>
      </el-upload>

      <avue-crud ref="crud" :data="tableData" :option="tableOption">
        <template slot="fileStatus" slot-scope="scope">
          <div v-show="scope.row.fileStatus === 99">待上传</div>
          <div v-show="scope.row.fileStatus === true">上传成功</div>
          <div v-show="scope.row.fileStatus === false">上传失败</div>
        </template>
        <template slot="errorMsg" slot-scope="scope">
          <el-button size="small" type="text" v-if="scope.row.fileStatus === 99" @click="handleFileDel(scope)">
            移除
          </el-button>
          <div v-else>{{ scope.row.errorMsg }}</div>
        </template>
      </avue-crud>
    </div>
    <span slot="footer">
      <el-button size="small" @click="close">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { batchUploadAttachmentApi } from "@/api/logistics/transfer/fristMileTransfer"

export default {
  name: "batchUploadContract",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {},
      action: "",
      accept: ".png,.jpg,.pdf,.xlsx,.xls,.doc,.docx",
      maxMB: 5, // 文件大小
      maxSize: 100, // 文件个数
      tableData: [],
      tableOption: {
        index: true,
        indexLabel: "序号",
        border: true,
        header: false,
        menu: false,
        selection: false,
        column: [
          {
            label: "文件名",
            prop: "name",
            sortable: false
          },
          {
            label: "处理状态",
            prop: "fileStatus",
            sortable: false,
            solt: true
          },
          {
            label: "错误原因/操作",
            prop: "errorMsg",
            sortable: false,
            solt: true,
            copy: false
          }
        ]
      },
      singleMaxFileSize: 10, // 单次上传文件个数
      detail: {}
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog(detail) {
      this.detail = detail
      this.showDialog = true
    },

    getFileType(name) {
      return this.getFileExt(name).toLowerCase()
    },
    // 上传文件之前的校验
    onBeforeUpload(file) {
      // 校验文件类型
      let lastName = this.getFileType(file.name)
      let localFileType = this.accept.replace(/\./g, "").split(",")
      if (!localFileType.includes(lastName)) {
        this.$message.error("上传的文件格式不正确!")
        return false
      }
      // 校验文件大小
      // const isLt1M = file.size / 1024 / 1024 < this.maxMB
      // if (!isLt1M) {
      //   setTimeout(() => {
      //     this.$message.error(`${file.name}文件大小超过 ${this.maxMB}MB!`)
      //   }, 0)
      //   return false
      // }
      return true
    },

    handleChangeFile(file, fileList) {
      if (this.onBeforeUpload(file)) {
        // if (this.tableData.length >= this.maxSize) {
        //   setTimeout(() => {
        //     this.$message.error(`一次最多上传${this.maxSize}张文件!`)
        //   }, 0)
        //   return
        // } else {
        this.tableData.push({ ...file, fileStatus: 99 })
        // }
      }
    },

    handleFileDel(scope) {
      this.tableData.splice(scope.row.$index, 1)
    },
    // 上传
    async onHttpRequest(param) {
      const files = this.tableData.filter((item) => item.raw).map((item) => item.raw)
      if (files.length === 0) {
        this.$message.error("请选择要上传的文件!")
        return
      }

      const formData = new FormData()
      files.forEach((item) => {
        formData.append("files", item)
      })
      const { data } = await batchUploadAttachmentApi(formData, this.detail.value)

      if (data.code === 0) {
        this.tableData = data.data.map((item) => {
          return {
            name: item.fileName,
            fileStatus: item.status,
            errorMsg: item.errorMsg
          }
        })
      }

      // const sendFileBatch = async (fileBatch) => {
      //   const formData = new FormData()
      //   fileBatch.forEach((item) => {
      //     formData.append("files", item)
      //   })

      //   return new Promise((resolve, reject) => {
      //     batchUploadAttachmentApi(formData)
      //       .then((res) => {
      //         // this.onRefresh()
      //         // 获取文件状态 TODO

      //         this.tableData = res.data.data.map((item) => {
      //           return {
      //             name: item.fileName,
      //             fileStatus: item.status,
      //             errorMsg: item.reason
      //           }
      //         })

      //         console.log(res)

      //         resolve()
      //       })
      //       .catch((error) => {
      //         this.$message.success("上传失败")
      //         reject()
      //       })
      //   })
      // }

      // const processFileListInBatches = async (fileList, batchSize) => {
      //   for (let i = 0; i < fileList.length; i += batchSize) {
      //     const fileBatch = fileList.slice(i, i + batchSize)
      //     try {
      //       // 等待当前批次请求完成再发送下一批次
      //       await sendFileBatch(fileBatch)
      //     } catch (error) {
      //       this.$message.success("上传失败")
      //     }
      //   }
      //   this.$message.success("上传完成")
      // }

      // processFileListInBatches(files, this.singleMaxFileSize)
    },
    // 获取文件扩展名
    getFileExt(fileName = "") {
      const index = fileName.lastIndexOf(".")
      return index !== -1 ? fileName.substring(index + 1) : ""
    },
    close() {
      this.$refs.upload.clearFiles()
      this.tableData = []
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
  height: 500px;
}
::v-deep .el-upload-list--text {
  display: none;
}
</style>
