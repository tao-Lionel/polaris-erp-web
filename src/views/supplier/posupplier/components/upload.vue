<template>
  <div>
    <el-upload
      ref="upload"
      :action="action"
      :accept="accept"
      :before-upload="onBeforeUpload"
      :http-request="onHttpRequest"
      :file-list="fileList"
      :disabled="disabled"
      :show-file-list="showFileList"
    >
      <el-badge :is-dot="resUrl != null || updateFileId">
        <el-button type="text" :disabled="disabled">点击上传（{{ localDesc }}）</el-button>
      </el-badge>
    </el-upload>

    <div style="display: flex">
      <!-- 查看插槽 -->
      <div v-if="$slots.view">
        <slot name="view"> </slot>
      </div>

      <!-- 默认的查看方式 -->
      <div v-else-if="resUrl || updateFileId">
        <!-- 文件显示 -->
        <el-button v-if="['pdf'].includes(getFileType(this.file?.name)) || updateFileId" type="text" @click="openPdf()">
          <i class="el-icon-view y-reviews"></i>
        </el-button>

        <!-- 图片显示 -->
        <el-popover v-else placement="right" trigger="click">
          <img style="max-width: 600px" :src="resUrl" />
          <el-button type="text" slot="reference">
            <i class="el-icon-view y-reviews"> </i>
          </el-button>
        </el-popover>
      </div>

      <!-- 下载插槽 -->
      <div v-if="$slots.download">
        <slot name="download"> </slot>
      </div>

      <!-- 默认的下载方式 -->
      <div v-else-if="result || updateFileId">
        <i class="el-icon-download y-reviews" @click="downloadFile()"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { getTokenUrl } from "@/util/auth"
import { previewFileApi, uploadFileApi } from "@/api/common"

export default {
  name: "upload",
  components: {},
  props: {
    // 上传地址
    action: {
      type: String,
      default: ""
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否显示已上传文件列表
    showFileList: {
      type: Boolean,
      default: false
    },
    // 接受上传的文件类型
    accept: {
      type: String,
      default: ".jpeg, .png, .jpg"
    },
    // 最大上传大小，以MB为单位
    maxMB: {
      type: Number,
      default: 5
    },
    // 自定义文本
    desc: {
      type: String,
      default: ""
    },
    // 上传成功后的文件
    updateFileId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      fileList: [],
      localDesc: "",
      resUrl: null,
      file: null,
      result: null
    }
  },
  created() {
    this.localDesc = this.desc === "" ? `支持格式：${this.accept}，文件最大${this.maxMB}MB` : this.desc
  },
  mounted: function () {},
  computed: {},
  methods: {
    getFileType(name) {
      return this.getFileExt(name).toLowerCase()
    },
    // 上传文件之前的钩子
    onBeforeUpload(file) {
      console.log("file====", file)
      this.file = file
      // 校验文件类型
      let lastName = this.getFileType(file.name)
      let localFileType = this.accept.replace(/\./g, "").split(",")
      console.log("localFileType", localFileType)
      if (!localFileType.includes(lastName)) {
        this.$message.error("上传的文件格式不正确!")
        return false
      }
      // 校验文件大小
      const isLt1M = file.size / 1024 / 1024 < this.maxMB
      if (!isLt1M) {
        this.$message.error(`上传文件大小不能超过 ${this.maxMB}MB!`)
        return false
      }
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    async onHttpRequest(param) {
      let formData = new FormData()
      formData.append("file", param.file, param.file.name)
      formData.append("applicationName", "")
      this.$refs.upload.clearFiles()

      const res = await uploadFileApi(formData)
      console.log("res=====", res)

      if (res.data.code === 0) {
        this.resUrl = getTokenUrl(res.data.data.fileUrl)
        this.result = res.data.data
        this.$emit("uploadSuccess", res.data.data)
        this.$message.success("上传成功!")
      } else {
        this.$message.error("上传失败!")
      }
    },
    // 获取文件扩展名
    getFileExt(fileName = "") {
      const index = fileName.lastIndexOf(".")
      return index !== -1 ? fileName.substring(index + 1) : ""
    },
    // 打开文件
    async openPdf() {
      previewFileApi({ fileId: this.result?.id || this.updateFileId }).then((res) => {
        const blob = new Blob([res.data], { type: "application/pdf" })
        let pdfData = URL.createObjectURL(blob)
        window.open(pdfData)
      })
    },
    // 下载文件
    downloadFile() {
      previewFileApi({ fileId: this.result?.id || this.updateFileId }).then((res) => {
        const blobUrl = window.URL.createObjectURL(res.data)
        const filename = this.result?.fileName || "下载"
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(blobUrl)
        this.$message.success("下载成功")
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
