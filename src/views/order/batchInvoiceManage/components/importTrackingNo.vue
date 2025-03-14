<template>
  <el-dialog
    title="跟踪号导入修改"
    :visible.sync="showDialog"
    width="50%"
    top="5vh"
    :close-on-click-modal="false"
    :before-close="close"
    class="dialogShowScroll"
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
        :file-list="fileList"
        :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <div>
              <p v-if="this.fileList.length">
                已选中 <span style="font-weight: bold">{{ this.fileList?.[0].name }}</span>
              </p>
              <a @click="handleDownloadTemplate">模版文件下载</a>
              <br />
              说明： <br />
              1.每个文件大小为{{ maxMB }}M以内，单次上传最大数量为{{ maxSize }}张；<br />
            </div>

            <el-button size="small" type="primary" style="margin-top: 20px" @click="onHttpRequest" :loading="loading"
              >上传</el-button
            >
          </div>
          <div>
            <avue-crud ref="crud" :data="tableData" :option="tableOption">
              <template slot="status" slot-scope="scope">
                <div v-show="scope.row.status === 0" style="color: green">修改成功</div>
                <div v-show="scope.row.status === 1" style="color: red">修改失败</div>
              </template>
            </avue-crud>
          </div>
        </div>
      </el-upload>
    </div>
    <span slot="footer">
      <el-button size="small" @click="close">关 闭</el-button>
      <el-button size="small" type="primary" @click="confirmModify" :loading="confirmLoading">{{
        confirmLoading ? "导入修改中…" : "确认修改"
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFileExtension, getDictByType } from "@/util/auth"
import { uploadAttachmentApi } from "@/api/order/batchInvoiceManage"
import { downloadTemplate, uploadFileBatchApi, uploadOmsFoBatchTruckingNumber } from "@/api/order/batchInvoiceManage"
import { downloadBlob } from "@/util/auth"

export default {
  name: "importTrackingNo",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {},
      action: "",
      accept: "",
      maxMB: 10, // 文件大小
      maxSize: 300, // 文件个数
      uploadSuccessList: [],
      lading: false,
      fileList: [],
      tableData: [],
      tableOption: {
        maxHeight: 300,
        index: true,
        indexLabel: "序号",
        border: true,
        header: false,
        menu: false,
        selection: false,
        column: [
          { label: "ARN/排柜号", prop: "platformOrderNo", sortable: false },
          { label: "跟踪号", prop: "truckingNumber", sortable: false },
          { label: "状态", prop: "status", sortable: false, solt: true }
        ]
      },
      confirmLoading: false
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    async openDialog() {
      this.showDialog = true
      this.uploadSuccessList = []
      this.loading = false
    },
    async handleDownloadTemplate() {
      const { data } = await downloadTemplate({
        templateName: "跟踪单号修改导入模板"
      })
      downloadBlob(data, "跟踪单号修改导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    // 上传文件之前的校验
    onBeforeUpload(file) {
      // 校验文件类型
      // let lastName = getFileExtension(file.name)
      // let localFileType = this.accept.replace(/\./g, "").split(",")
      // if (!localFileType.includes(lastName)) {
      //   this.$message.error("上传的文件格式不正确!")
      //   return false
      // }
      // 校验文件大小
      const isLt1M = file.size / 1024 / 1024 < this.maxMB
      if (!isLt1M) {
        setTimeout(() => {
          this.$message.error(`${file.name}文件大小超过 ${this.maxMB}MB!`)
        }, 0)
        return false
      }
      return true
    },

    handleChangeFile(file, fileList) {
      console.log("🥶 ---> handleChangeFile ---> file, fileList👉", file, fileList)
      this.fileList = fileList
    },

    // 上传
    async onHttpRequest(param) {
      if (this.fileList.length === 0) {
        this.$message.error("请选择要上传的文件!")
        return
      }

      const formData = new FormData()
      this.fileList.forEach((item) => {
        formData.append("file", item.raw)
      })
      const { data } = await uploadFileBatchApi(formData, "跟踪单号修改导入模板.xlsx")
      if (data.code === 0) {
        this.$message.success("上传成功!")
        this.tableData = data.data
      }

      // this.lading = true
    },
    // 创建
    close() {
      this.$refs.upload.clearFiles()
      this.$emit("success")
      this.showDialog = false
    },
    async confirmModify() {
      this.confirmLoading = true
      for (const item of this.tableData) {
        try {
          await uploadOmsFoBatchTruckingNumber({
            truckingNo: item.truckingNumber,
            platformFoOrder: [item.platformOrderNo]
          })
          this.$set(item, "status", 0)
        } catch (error) {
          this.$set(item, "status", 1)
        }
      }
      this.$message.success("上传完成")
      this.$emit("success")
      this.confirmLoading = false
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
  display: none;
}
</style>
