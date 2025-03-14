<template>
  <el-dialog
    title="批量上传附件"
    :visible.sync="showDialog"
    width="500px"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <div>
      <el-form ref="importFormRef" :model="importForm" :inline="true" :rules="rules">
        <el-form-item prop="storeId">
          <el-select
            v-model="importForm.storeId"
            filterable
            size="small"
            placeholder="店铺"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in storeOptions"
              :key="item.storeId"
              :label="item.storeAccount"
              :value="item.storeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-upload
        ref="upload"
        multiple
        :action="action"
        :accept="accept"
        :on-change="handleChangeFile"
        show-file-list
        :auto-upload="false"
        :limit="maxSize"
        :on-exceed="handleExceed"
        :on-remove="handleRemoveFile"
      >
        <el-button size="small" type="primary" @click.native="validate">选择文件</el-button>
        <div class="el-upload__tip" slot="tip" style="margin-bottom: 15px">
          说明： <br />
          1.支持上传扩展名为{{ accept }}格式的文件。<br />
          2.每个文件大小为{{ maxMB }}M以内，单次上传最大数量为{{ maxSize }}张。
          <!-- 2.文件必须一个是pdf，一个是xlsx，可只上传一个文件，但是不能同时上传两个后缀相同的文件<br /> -->
        </div>
      </el-upload>
    </div>
    <span slot="footer">
      <el-button size="small" @click="close">关 闭</el-button>
      <el-button size="small" type="primary" @click="onHttpRequest">上传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { uploadFileBatchApi } from "@/api/common/index.js"
import { getFileExtension } from "@/util/auth"
import { createFinPlatformSettlementApi } from "@/api/finance/billingManagement"
import { getAll } from "@/api/baseSetup/bsestore.js"

export default {
  name: "batchUploadContract",
  components: {},
  data() {
    return {
      showDialog: false,
      action: "",
      accept: ".pdf,.xlsx,.csv,.xml",
      maxMB: 5, // 文件大小
      maxSize: 10, // 文件个数
      fileList: [],
      importForm: {
        storeId: ""
      },
      storeOptions: [],
      rules: {
        storeId: [{ required: true, message: "请选择店铺", trigger: "change" }]
      },
      uploadSuccessList: []
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog() {
      this.showDialog = true
      this.fileList = []
      this.getStoreList()
    },

    // 获取店铺
    async getStoreList() {
      const { data } = await getAll()
      this.storeOptions = data.data
    },

    // 校验
    validate(event) {
      this.$refs.importFormRef.validate((valid) => {
        if (valid) {
          return true
        } else {
          // 阻止事件冒泡
          event.stopPropagation()
        }
      })
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

    // 上传
    async onHttpRequest(param) {
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

    // 创建
    async handleCreate() {
      const res = await createFinPlatformSettlementApi({
        filePath: this.uploadSuccessList.map((item) => item.fileUrl)?.join(","),
        storeId: this.importForm.storeId
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
      this.importForm = {
        storeId: ""
      }
      this.$emit("updateList")
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload-list--text {
  display: flex;
  flex-direction: column;
}
</style>
