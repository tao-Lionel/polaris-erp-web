<template>
  <div>
    <el-upload
      ref="upload"
      :accept="accept"
      :before-upload="onBeforeUpload"
      :http-request="onHttpRequest"
      :file-list="fileList"
      :show-file-list="true"
      :limit="1"
      :on-exceed="onExceed"
      :on-remove="onRemove"
    >
      <el-button size="small">点击上传</el-button>
    </el-upload>

    <div style="display: flex" v-if="fileUrl">
      <!-- 默认的查看方式 -->
      <div v-if="['png', 'jpg', 'jpeg', 'gif'].includes(getFileType(fileUrl))">
        <!-- 图片显示 -->
        <el-popover placement="right" trigger="click">
          <img style="max-width: 600px" :src="getTokenUrl(fileUrl)" />
          <el-button type="text" slot="reference">
            <i class="el-icon-view y-reviews"> </i>
          </el-button>
        </el-popover>
      </div>

      <!-- 默认的下载方式 -->
      <div>
        <i class="el-icon-download y-reviews" @click="downloadFile(fileUrl)"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadFileApi } from "@/api/common/index.js"
import { getTokenUrl, downloadFileByUrl } from "@/util/auth"

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
    // 接受上传的文件类型
    accept: {
      type: String,
      default: ".xls,.xlsx"
    },
    // 最大上传大小，以MB为单位
    maxMB: {
      type: Number,
      default: 5
    },
    fileUrl: String
  },
  data() {
    return {
      fileList: [],
      resUrl: null,
      file: null,
      getTokenUrl: getTokenUrl
    }
  },
  watch: {
    fileUrl: {
      handler(val) {
        if (val) {
          this.fileList = [
            {
              name: this.getFileName(val),
              url: this.getTokenUrl(val)
            }
          ]
        } else {
          this.fileList = []
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted: function () {},
  methods: {
    // 截取文件名
    getFileName(fileUrl) {
      return fileUrl.substring(fileUrl.lastIndexOf("-") + 1)
    },
    clearFiles() {
      this.$refs.upload.clearFiles()
      this.fileList = []
    },
    getFileType(name) {
      return this.getFileExt(name).toLowerCase()
    },
    // 上传文件之前的钩子
    onBeforeUpload(file) {
      this.file = file
      // 校验文件类型
      let lastName = this.getFileType(file.name)
      let localFileType = this.accept.replace(/\./g, "").split(",")
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
      formData.append("applicationName", "前端")
      formData.append("directory", "warehouse/inviteTender/")
      this.$refs.upload.clearFiles()
      const { data } = await uploadFileApi(formData)
      if (data.code === 0) {
        this.result = data.data
        this.fileList = [{ name: data.data.fileName, url: data.data.fileUrl }]
        this.$emit("uploadSuccess", data.data)
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
    onExceed(files, fileList) {
      if (files) {
        this.$message.warning("只能上传一个文件")
        return
      }
    },
    downloadFile(fileUrl) {
      downloadFileByUrl(getTokenUrl(fileUrl), this.getFileName(fileUrl))
    },
    // 移除文件
    onRemove(file, fileList) {
      this.$emit("update:fileUrl", null)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload-list {
  width: 180px;
}
::v-deep .el-upload-list__item-name {
  font-size: 12px;
}
</style>
