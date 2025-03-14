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
        <div class="el-upload__tip" slot="tip">
          说明： <br />
          1.支持上传扩展名为{{ accept }}格式的文件 <br />
          2.每个文件大小为{{ maxMB }}M以内，单次上传最大数量为{{ maxSize }}张；<br />
          <!-- 2.请确保文件状态为上传成功；<br /> -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-right: 50px">
            <el-form ref="importFormRef" :model="importForm" :inline="true" :rules="rules">
              <el-form-item prop="site">
                <el-select v-model="importForm.site" filterable size="small" placeholder="请选择站点" clearable>
                  <el-option v-for="item in siteOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <div>
              <el-button size="small" type="primary" @click="onHttpRequest">上传</el-button>
            </div>
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
import { uploadOverseaBillApi } from "@/api/finance/billingManagement"
import { getFileExtension } from "@/util/auth"
import { getCountry } from "@/api/baseSetup/bsecountry"

export default {
  name: "batchUploadContract",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {},
      action: "",
      accept: ".pdf,.xlsx",
      maxMB: 10, // 文件大小
      maxSize: 10, // 文件个数
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
            sortable: false,
            width: 180
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
      importForm: {
        site: ""
      },
      siteOptions: [],
      rules: {
        site: [{ required: true, message: "请选择站点", trigger: "change" }]
      }
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog() {
      this.showDialog = true
      this.importForm.site = "US"
      this.getAllCountry()
    },

    // 获取国家
    async getAllCountry() {
      const { data } = await getCountry()
      this.siteOptions = data.data.map((item) => ({
        label: item.countryCode,
        value: item.countryCode
      }))
    },

    // 上传文件之前的校验
    onBeforeUpload(file) {
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
        setTimeout(() => {
          this.$message.error(`${file.name}文件大小超过 ${this.maxMB}MB!`)
        }, 0)
        return false
      }
      return true
    },

    handleChangeFile(file, fileList) {
      if (this.onBeforeUpload(file)) {
        if (this.tableData.length >= this.maxSize) {
          setTimeout(() => {
            this.$message.error(`一次最多上传${this.maxSize}张文件!`)
          }, 0)
          return
        } else {
          this.tableData.push({ ...file, fileStatus: 99 })
        }
      }
    },

    handleFileDel(scope) {
      this.tableData.splice(scope.row.$index, 1)
    },
    // 上传
    async onHttpRequest(param) {
      const valid = await Promise.all([this.$refs.importFormRef.validate()])
      if (!valid) {
        return
      }

      const files = this.tableData.filter((item) => item.raw).map((item) => item.raw)
      if (files.length === 0) {
        this.$message.error("请选择要上传的文件!")
        return
      }

      const formData = new FormData()
      files.forEach((item) => {
        formData.append("files", item)
      })
      const { data } = await uploadOverseaBillApi(formData, this.importForm.site)

      if (data.code === 0) {
        this.tableData = data.data.map((item) => {
          return {
            name: item.fileName,
            fileStatus: item.status,
            errorMsg: item.errorMsg
          }
        })
      }
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
