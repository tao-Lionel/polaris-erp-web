<template>
  <el-dialog title="导入装箱方案" :visible.sync="dialogVisible" width="40%" @close="handleClose">
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

          <div style="display: flex; justify-content: center; margin-right: 50px; margin-top: 20px">
            <!-- <el-button size="small" type="primary" @click="downloadTemplate">下载模版文件</el-button> -->

            <el-button size="small" type="primary" v-if="permissions.purchase_container_upload" @click="onHttpRequest"
              >上传</el-button
            >
          </div>
        </div>
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    </span>
    <PackingPlanConfirm
      ref="PackingPlanConfirm"
      :boxCarTypeList="boxCarTypeList"
      :departureHarbourList="departureHarbourList"
    ></PackingPlanConfirm>
  </el-dialog>
</template>

<script>
import { exportGroupList, importResult } from "@/api/purchase/containerLoadingPlan/index.js"
import { downloadBlob } from "@/util/auth"
import { cloneDeep } from "lodash"
import PackingPlanConfirm from "./packingPlanConfirm.vue"
import { mapGetters } from "vuex"
export default {
  name: "importPlan",
  components: { PackingPlanConfirm },
  data() {
    return {
      dialogVisible: false,
      fileData: null,
      accept: ".xlsx,.xls",
      exportData: [],
      fileList: [],
      action: "",
      boxCarTypeList: [],
      departureHarbourList: []
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    handleClose() {
      this.fileList = []
    },
    handleOpenDialog(data, boxCarTypeList, departureHarbourList) {
      this.dialogVisible = true

      console.log("打开弹窗", data)
      this.exportData = data
      this.boxCarTypeList = boxCarTypeList
      this.departureHarbourList = departureHarbourList
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

    async downloadTemplate() {
      const postData = cloneDeep(this.exportData)
      postData.forEach((item) => {
        console.log('typeof item.loadRate === "number" :', typeof item.loadRate === "number")
        item.loadRate = Number(item.loadRate)
      })
      const { data } = await exportGroupList(postData)
      console.log("data")
      downloadBlob(data, "排柜分组信息.xls", "application/vnd.ms-excel;charset=utf-8")
    },
    // 文件选择后处理
    handleFileChange(file, fileList) {
      console.log("已选择文件：", fileList)
      this.fileList = [file] // 保存文件列表
    },

    // 文件移除后处理
    handleFileRemove(file, fileList) {
      console.log("文件移除：", file)
      this.fileList = fileList // 更新文件列表
    },
    // 上传
    async onHttpRequest() {
      if (!this.fileList.length) {
        this.$message.error("请选择要上传的文件!")
        return
      }

      const formData = new FormData()
      this.fileList.forEach((file) => {
        formData.append("file", file.raw)
      })
      const { type } = this.$route.query

      try {
        const { data } = await importResult(formData, `?type=${type}&filePath=purchase/shipmentPlan/`)
        if (data.code === 0) {
          console.log("上传成功:", data.data)
          this.$message.success("上传成功!")

          this.$refs.PackingPlanConfirm?.handleOpenDialog(data.data)
          this.dialogVisible = false
        } else {
          console.error("上传失败:", data.message)
          this.$message.error(`上传失败: ${data.message}`)
        }
      } catch (error) {
        console.error("上传异常:", error)
        this.$message.error("上传失败，请稍后重试!")
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.file-box {
  padding: 20px;
}
</style>
