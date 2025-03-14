<template>
  <div class="execution" id="commonImport">
    <el-dialog class="importDailog" title="导入" :visible.sync="syncTpMTp" width="500px" @closed="closedFn">
      <!-- <el-alert title="必须按照下载模板进行导入" type="warning" show-icon :closable="false"></el-alert> -->
      <tip title="必须按照下载模板进行导入" />
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
              <slot name="importTip"></slot>
              <el-button
                style="margin-left: 20px"
                type="danger"
                size="small"
                v-show="excelDangerStatus"
                @click="exportdangerExcel"
                >异常文件下载</el-button
              >
            </el-form-item>
          </el-form>
        </li>
        <li>
          <el-button type="dufault" size="small" @click="downloadTemplate">下载模板</el-button>
        </li>
      </ul>
      <!-- <el-form :model="importForm"  ref="importForm" label-width="120px" :inline="true">
            <el-form-item prop="uploadFile" label="">
              <el-upload
                class="upload-inq inline-class"
                ref="upload"
                list-type="text"
                :accept="fileSuffix"
                action="String"
                :auto-upload="false"
                :on-change="signFileChange"
                :show-file-list="false"
              >
                  <el-button type="primary"
                    size="small">上传数据</el-button>
                </el-upload>
              <span>{{importForm.attachmentFileName}}</span>
            </el-form-item>
            <el-form-item label="模板下载:">
              <el-button type="text" @click="downloadTemplate">下载模板</el-button>
            </el-form-item>
            <el-form-item label="注意事项:" class="watchPoint">
              <span>必须按照下载模板进行导入</span>
            </el-form-item>
          </el-form> -->
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="declareAtCustomsDialog = false">取 消</el-button> -->
        <el-button type="primary" size="small" @click="importExcelBtn" :loading="loading">确 定</el-button>
      </span> </el-dialog
    ><!--v-show="false"-->
  </div>
</template>

<script>
import { checkTemplate } from "@/api/cockpit/database/costMaintenance"
import { getTokenUrl, newGetTokenUrl } from "@/util/auth"
import { mapGetters } from "vuex"
import tip from "./tip"
export default {
  name: "commonImport",
  props: {
    // showSync: Boolean,syncTpMTp
    downloadUrl: String,
    fileSuffix: {
      type: String,
      default: ".xls,.xlsx"
    },
    excelStatus: {
      type: Boolean,
      default: true
    },
    excelDangerStatus: {
      type: Boolean,
      default: false
    },
    // 自定义下载模板
    customDownload: Function,
    maxSize: {
      type: Number,
      default: 6
    }
  },

  data() {
    return {
      loading: false,
      //导入相关
      importForm: {
        file: {},
        attachmentFileName: "未选择任何文件"
      },
      syncTpMTp: false,
      fullscreenLoading: null
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
    syncFn() {
      this.syncTpMTp = !this.syncTpMTp
      this.excelDangerStatus = false
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
    importExcelBtn() {
      if (this.importForm.file.raw) {
        this.$emit("import", this.importForm.file)
      } else {
        this.$message.warning("请选择需要上传的文件!!")
      }
    },
    closedFn() {
      this.importForm = {
        file: {},
        attachmentFileName: "未选择任何文件"
      }
      this.$emit("initStatus", false)
    },
    downloadTemplate() {
      if (this.customDownload) {
        this.customDownload()
      } else {
        window.location = this.excelStatus ? getTokenUrl(this.downloadUrl) : newGetTokenUrl(this.downloadUrl)
      }
    },
    signFileChange(file, fileList) {
      if (!file.name) {
        this.$message.warning("请选择需要上传的文件!!")
        return
      }
      const fileNameArr = file.name.split(".")
      const fileName = fileNameArr[fileNameArr.length - 1]
      if (fileName != "xls" && fileName != "xlsx") {
        this.$message.warning("请选EXCEL文件上传!!")
        return
      }
      if (file.size / 1024 / 1024 > this.maxSize) {
        this.$message.warning(`文件限制为${this.maxSize}M以内!!`)
        return
      }
      this.importForm.file = file
      this.importForm.attachmentFileName = file.name
    },
    async exportdangerExcel() {
      if (this.importForm.file.raw) {
        this.$emit("export", this.importForm.file)
      }
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
// #commonImport{
//   .importDailog{
//       .el-form-item__content{
//           padding-right: 5%;
//           margin-left: 10% !important;
//       }
//       .upload-inq{
//           padding-right: 5%;
//       }
//       .watchPoint{
//           background-color: rgb(220, 220, 10);
//           color: rgb(150, 35, 35) !important;
//           .el-form-item__label{
//               color: rgb(150, 35, 35);
//           }
//       }
//   }
// }
</style>
