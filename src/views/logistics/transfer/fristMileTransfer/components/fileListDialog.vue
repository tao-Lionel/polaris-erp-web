<template>
  <el-dialog title="文件列表" :visible.sync="showDialog" width="660px">
    <div>
      <el-button type="primary" size="small" @click="handleDownloadAll" style="margin-bottom: 10px">下载全部</el-button>
      <el-table :data="fileList" border>
        <el-table-column label="文件名" prop="fileName" />
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="handlePreview(scope.row)" size="small">预览</el-button>
            <el-button type="text" @click="handleDownload(scope.row)" size="small">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFileListApi, downloadAllApi } from "@/api/logistics/transfer/fristMileTransfer"
import { previewFileApi } from "@/api/common"
import { getStore as getSession } from "@/util/store"

export default {
  name: "FileListDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      fileList: [],
      erpBizNo: ""
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(erpBizNo) {
      this.showDialog = true
      this.erpBizNo = erpBizNo
      this.getFileList(erpBizNo)
    },
    // 获取文件列表
    async getFileList(erpBizNo) {
      this.fileList = []
      const params = {
        bizType: "TRANSFER",
        erpBizNo
      }

      const { data } = await getFileListApi(params)
      if (data.code === 0) {
        console.log(data.data)
        this.fileList = data.data
      }
    },
    handlePreview(item) {
      previewFileApi({ fileId: item.fileId }).then((res) => {
        let type = "application/pdf"
        if (["xlsx", "xls"].includes(this.getFileType(item.fileName))) {
          type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        } else {
          type = "application/pdf"
        }

        const blob = new Blob([res.data], { type: type })
        let pdfData = URL.createObjectURL(blob)
        window.open(pdfData)
      })
    },
    getFileType(name) {
      return this.getFileExt(name).toLowerCase()
    },
    // 获取文件扩展名
    getFileExt(fileName = "") {
      const index = fileName.lastIndexOf(".")
      return index !== -1 ? fileName.substring(index + 1) : ""
    },
    // 下载单个
    handleDownload(item) {
      previewFileApi({ fileId: item.fileId }).then((res) => {
        const blobUrl = window.URL.createObjectURL(res.data)
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = item.fileName
        a.click()
        window.URL.revokeObjectURL(blobUrl)
        this.$message.success("下载成功")
      })
    },
    // 下载全部
    async handleDownloadAll() {
      const { data } = await downloadAllApi({ bizType: "TRANSFER", erpBizNo: this.erpBizNo })
      if (data?.code === 0) {
        let count = getSession({ name: "downloadCount" })
        this.$store.commit("SET_DOWNLOAD_COUNT", Number(count) + 1)
        this.$message.success(`异步下载中，请点击右上角【下载列表】图标进行查看！`)
      }

      // const filename = res.headers["content-disposition"].split("=")[1]
      // downloadBlob(res.data, decodeURI(filename), "application/pdf")
      // this.$message.success("下载成功")
    }
  }
}
</script>

<style lang="scss" scoped></style>
