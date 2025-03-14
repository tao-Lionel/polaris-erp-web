<template>
  <div class="execution" id="commonImport">
    <el-dialog class="importDailog" title="导入" :visible.sync="syncTpMTp" width="500px" @closed="closedFn">
      <tip title="必须按照下载模板进行导入" />
      <slot name="header"> </slot>

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
          <slot name="downloadTemplate">
            <el-button type="dufault" size="small" @click="downloadTemplate">下载模板</el-button>
          </slot>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="previewExcelBtn" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="excelErrorStatus" width="35%">
      <div v-if="importBtnStatus">
        <p style="color: red; padding: 0 0 10px">
          导入的数据中存在错误信息，以下是导入的数据中对应的错误原因，请在excel中修改完成之后再重新导入！
        </p>
        <el-button type="warning" size="small" style="margin-bottom: 10px" @click="downloadErrorExcel">
          下载错误文件
        </el-button>
      </div>

      <p v-else style="color: #000; padding: 0 0 10px">导入数据检验全部正确，请点击导入按钮上传数据！</p>
      <template>
        <el-table :data="excelErrorData" :max-height="400" border style="width: 100%">
          <el-table-column prop="indexNum" label="excel序号" width="120"> </el-table-column>
          <el-table-column prop="errMsg">
            <template slot="header" slot-scope="scope">
              {{ importBtnStatus ? "错误原因" : "提示信息" }}
            </template>

            <template slot-scope="scope">
              <p v-if="scope.row.errMsg" style="color: rgb(245, 108, 108)">{{ scope.row.errMsg }}</p>
              <p v-else>{{ scope.row?.tipsMsg ? scope.row?.tipsMsg : "无错误，数据正确" }}</p>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="text-align: center; margin-top: 20px">
        <el-button size="small" style="padding: 9px 30px" v-if="!importBtnStatus" type="primary" @click="importExcel"
          >导 入</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/router/axios"
import { getTokenUrl, newGetTokenUrl, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import tip from "./tip"
import { exportErrorDataApi } from "@/api/common/index.js"

export default {
  name: "newCommonImport",
  props: {
    fileSuffix: {
      type: String,
      default: ".xls,.xlsx"
    },
    excelStatus: {
      type: Boolean,
      default: true
    },
    downloadUrl: String,
    downloadTitle: String,
    previewUrl: String,
    uploadUrl: String,
    // 是否要保存上传的文件
    isUploadFile: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      importForm: {
        file: {},
        attachmentFileName: "未选择任何文件"
      },
      syncTpMTp: false,
      fullscreenLoading: null,
      excelErrorData: [],
      excelErrorStatus: false,
      importBtnStatus: false,
      downloadParams: [], // 导入模板下载时的参数
      uploadParams: {} // 上传excel的参数
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
    syncFn(paramsObj) {
      this.downloadParams = paramsObj.downloadParams ? paramsObj.downloadParams : []
      this.uploadParams = paramsObj.uploadParams ? paramsObj.uploadParams : {}
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
    async importExcel() {
      let params = this.excelErrorData
      if (this.isUploadFile) {
        const formData = new FormData()
        formData.append("file", this.importForm.file.raw)
        formData.append("dto", JSON.stringify(this.excelErrorData))
        params = formData
      }

      this.openFullScreen()
      let res = await this.requestPost(this.uploadUrl, params, false)
      this.closeFullScreen()
      if (res.data.code === 0) {
        if (res.data.data && res.data.data.length) {
          res.data.data.sort((a, b) => Boolean(b.errMsg) - Boolean(a.errMsg))
          const status = res.data.data.some((item) => item.errMsg)
          if (status) {
            this.excelErrorData = res.data.data
            this.importBtnStatus = true
            this.excelErrorStatus = true
          } else {
            this.syncTpMTp = false
            this.excelErrorStatus = false
            this.$message.success("导入成功")
            this.$emit("import", this.importForm.file)
          }
        } else {
          this.syncTpMTp = false
          this.excelErrorStatus = false
          this.$message.success("导入成功")
          this.$emit("import", this.importForm.file)
        }
      } else if (data.code == 1) {
        this.$message.error(data.msg)
      } else {
        this.$message.error("导入失败")
      }
    },
    async previewExcelBtn() {
      if (this.importForm.file.raw) {
        // this.loading = true
        let formdata = new FormData()
        formdata.append("file", this.importForm.file.raw)
        for (let key in this.uploadParams) {
          formdata.append(key, this.uploadParams[key])
        }
        let res = await this.requestPost(this.previewUrl, formdata, false)
        this.loading = false
        if (res.data.code === 0) {
          if (res.data.data && res.data.data.length) {
            res.data.data.sort((a, b) => Boolean(b.errMsg) - Boolean(a.errMsg))
            this.excelErrorData = res.data.data
            this.importBtnStatus = res.data.data.some((item) => item.errMsg)
            this.excelErrorStatus = true
          } else {
            this.$message.success("导入成功")
            this.$emit("import", this.importForm.file)
            this.syncTpMTp = false
          }
        } else if (data.code == 1) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("预览失败")
        }
      } else {
        this.$message.warning("请选择需要上传的文件!!")
      }
    },
    downloadTemplate() {
      this.requestPost(this.downloadUrl, this.downloadParams, true).then((res) => {
        const blob = new Blob([res.data], { type: "application/vnd.ms-excel;charset=utf-8" })
        const blobUrl = window.URL.createObjectURL(blob)
        const filename = this.downloadTitle + ".xlsx"
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(blobUrl)
      })
    },
    closedFn() {
      this.importForm = {
        file: {},
        attachmentFileName: "未选择任何文件"
      }
      this.excelDangerStatus = false
    },
    signFileChange(file, fileList) {
      if (!file.name) {
        this.$message.warning("请选择需要上传的文件!!")
        return
      }
      const fileNameArr = file.name.split(".")
      const fileName = fileNameArr[fileNameArr.length - 1]
      if (fileName != "xls" && fileName != "xlsx") {
        this.$message.warning("请选择EXCEL文件上传!!")
        return
      }
      if (file.size / 1024 / 1024 > 6) {
        this.$message.warning("文件文件限制为6M以内!!")
        return
      }
      this.importForm.file = file
      this.importForm.attachmentFileName = file.name
    },
    // 下载错误文件
    async downloadErrorExcel() {
      const moduleName = this.uploadUrl.split("/")?.[1]
      if (!moduleName) return
      const { data } = await exportErrorDataApi(moduleName, {
        templateName: `${this.downloadTitle}.xlsx`,
        errorList: this.excelErrorData
      })
      downloadBlob(data, `${this.downloadTitle}-错误数据.xlsx`, "application/vnd.ms-excel;charset=utf-8")
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
