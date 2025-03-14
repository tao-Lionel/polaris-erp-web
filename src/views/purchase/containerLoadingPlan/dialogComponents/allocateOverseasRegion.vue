<template>
  <el-dialog title="分配海外仓区域" :visible.sync="dialogVisible" width="40%" @close="handleClose">
    <div class="file-box">
      <el-upload
        ref="upload"
        style="width: 100%; display: flex; flex-direction: column; align-items: center"
        drag
        :multiple="false"
        :action="action"
        :accept="accept"
        :before-upload="onBeforeUpload"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        :file-list="fileList"
        show-file-list
        :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip" style="margin-bottom: 15px">
          说明： <br />
          1.支持上传扩展名为{{ accept }}格式的文件

          <div
            style="display: flex; justify-content: flex-end; align-items: center; margin-right: 50px; margin-top: 20px"
          >
            <p style="margin-right: 20px">模版数据下载 <a @click="downloadTemplate">下载模版</a></p>
            <el-button size="small" type="primary" @click="onHttpRequest">上传</el-button>
          </div>
        </div>
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    </span></el-dialog
  >
</template>

<script>
import { downloadTemplate, allocationWarehouseArea } from "@/api/purchase/containerLoadingPlan/index.js"
import { downloadBlob } from "@/util/auth"

export default {
  name: "allocateOverseasRegion",
  data() {
    return {
      dialogVisible: false,
      fileData: null,
      accept: ".xlsx,.xls",
      fileList: [],
      action: ""
    }
  },
  methods: {
    handleClose() {
      console.log("dddddd")
      this.fileList = []
    },
    handleOpenDialog(data) {
      this.dialogVisible = true
    },
    onBeforeUpload(file) {
      console.log("file", file)
      const lastName = file.name.split(".").pop().toLowerCase()
      const localFileType = this.accept.replace(/\./g, "").split(",")
      if (!localFileType.includes(lastName)) {
        this.$message.error("上传的文件格式不正确!")
        return false // 阻止上传
      }
      this.fileData = file // 保存文件
      return true // 允许上传
    },
    handleFileChange(file, fileList) {
      this.fileList = [file] // 仅保留最后一个文件
      console.log("文件GAIBIAN：", file, fileList)
    },

    // 文件移除后处理
    handleFileRemove(file, fileList) {
      console.log("文件移除：", file)
      this.fileList = fileList // 更新文件列表
    },
    // 上传
    async onHttpRequest(param) {
      if (!this.fileList.length) {
        this.$message.error("请选择要上传的文件!")
        return
      }

      const formData = new FormData()
      this.fileList.forEach((file) => {
        formData.append("file", file.raw)
      })

      try {
        const { data } = await allocationWarehouseArea(formData)
        if (data.code === 0) {
          console.log("上传成功:", data.data)
          this.$message.success("上传成功!")
        } else {
          console.error("上传失败:", data.message)
          this.$message.error(`上传失败: ${data.message}`)
        }
      } catch (error) {
        console.error("上传异常:", error)
        this.$message.error("上传失败，请稍后重试!")
      }
    },
    async downloadTemplate() {
      console.log("下载模版")
      const { data } = await downloadTemplate({
        templateName: "分配海外仓区域导入模板"
      })
      downloadBlob(data, "分配海外仓区域导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    }
  }
}
</script>
<style lang="scss" scoped>
.file-box {
  padding: 20px;
}
</style>
