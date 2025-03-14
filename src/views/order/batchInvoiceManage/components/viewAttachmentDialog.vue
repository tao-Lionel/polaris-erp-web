<template>
  <el-dialog v-if="showDialog" title="查看附件" :visible.sync="showDialog" width="70%" top="5vh">
    <div>
      <avue-crud
        :data="paginatedList"
        :option="viewAttachmentTableOption"
        :page="page"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
        @search-change="searchChange"
        @search-reset="searchReset"
      >
        <template slot="menuLeft">
          <el-button type="primary" size="small" @click="downloadSelected">批量下载</el-button>
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true" :rules="rules">
            <el-form-item prop="attachmentType">
              <el-select v-model="searchForm.attachmentType" size="small" placeholder="文件类型" multiple filterable>
                <el-option v-for="item in attachmentTypeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="attachmentSplit">
              <el-select v-model="searchForm.attachmentSplit" size="small" placeholder="是否拆分" multiple filterable>
                <el-option label="是" value="SPLIT"> </el-option>
                <el-option label="否" value="ORIGINAL"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="operation" slot-scope="scope">
          <el-popover
            placement="left"
            trigger="hover"
            width="600"
            :popper-options="{
              preventOverflow: true
            }"
            @show="handlePopoverShow(scope.row)"
            @hide="handlePopoverHide(scope.row)"
          >
            <div v-if="scope.row.showPreview">
              <iframe
                v-if="isPdf(scope.row.url)"
                :src="getSrc(scope.row.url)"
                style="width: 100%; height: 500px"
              ></iframe>
              <img v-else style="max-width: 80vh; height: 80vh" :src="getSrc(scope.row.url)" alt="图片预览" />
            </div>

            <a slot="reference">预览</a>
          </el-popover>

          <a style="margin-left: 10px" @click="download(scope.row)">下载</a>
        </template>
      </avue-crud>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAttachmentListApi, getSomeFoOrderBatchAttachmentListApi } from "@/api/order/batchInvoiceManage"
import { viewAttachmentTableOption } from "../list"
import { getTokenUrl, getDictByType, getFileExtension, downloadBlob } from "@/util/auth"
import { downloadFileByUrl } from "@/api/common/index.js"
import JSZip from "jszip"

export default {
  name: "viewAttachmentDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      list: [],
      initList: [],
      viewAttachmentTableOption,
      attachmentTypeList: [],
      searchForm: {
        attachmentType: ["PALLET"],
        attachmentSplit: ["ORIGINAL"]
      },
      rules: {
        attachmentType: [{ required: true, message: "请选择附件类型", trigger: "change" }],
        attachmentSplit: [{ required: true, message: "请选择附件拆分", trigger: "change" }]
      },
      selectedList: [],
      params: null,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      }
    }
  },
  computed: {
    // 计算分页后的数据
    paginatedList() {
      const start = (this.page.currentPage - 1) * this.page.pageSize
      const end = start + this.page.pageSize
      return this.list.slice(start, end)
    },
    isPdf() {
      return (url) => {
        if (url) {
          return getFileExtension(url) === "pdf"
        }
        return ""
      }
    }
  },
  created() {},
  mounted: function () {},
  methods: {
    async openDialog(params) {
      this.searchForm = {
        attachmentType: ["PALLET"],
        attachmentSplit: ["ORIGINAL"]
      }
      this.initList = []
      this.list = []
      this.showDialog = true
      this.params = params
      this.attachmentTypeList = await getDictByType("delivery_attachment_type")
      await this.getList()
      this.$nextTick(() => {
        this.viewAttachmentTableOption.fixHeight = document.querySelector(".el-dialog__body")?.offsetHeight - 150 || 400
      })
    },
    async getList() {
      this.$refs?.searchFormRef?.validate(async (valid) => {
        console.log("valid", valid)
        if (valid) {
          const { data } = await getSomeFoOrderBatchAttachmentListApi({ ...this.params, ...this.searchForm })
          this.initList = data.data
          this.list = data.data
          this.page.total = data.data.length // 更新总条数
        }
      })
    },
    searchChange() {
      this.getList()
    },
    searchReset() {
      this.$refs.searchFormRef.resetFields()
      this.getList()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.page.currentPage = 1 // 重置到第一页
      this.getList()
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    selectionChange(selection) {
      this.selectedList = selection
    },
    download(row) {
      window.location = getTokenUrl(row.url)
    },
    async downloadSelected() {
      if (this.selectedList.length === 0) {
        this.$message.warning("请先选择文件")
        return
      }
      const fileTypes = {
        png: "image/png",
        jpg: "image/jpeg",
        pdf: "application/pdf",
        csv: "text/csv",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        zip: "application/zip"
      }

      const zip = new JSZip()

      try {
        // 遍历文件 URL 列表
        for (let i = 0; i < this.selectedList.length; i++) {
          const item = this.selectedList[i]
          const formData = new FormData()
          formData.append("fileUrl", item.url)
          const { data } = await downloadFileByUrl(formData)
          const fileName = item.name
          // 1. 将 Base64 字符串解码为二进制数据
          const binaryString = atob(data)
          const len = binaryString.length
          const bytes = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          // 2. 将二进制数据转换为 Blob 对象
          const blob = new Blob([bytes], { type: fileTypes[getFileExtension(fileName)] })
          zip.file(fileName, blob) // 将文件添加到 ZIP 包中
        }
        // 生成 ZIP 文件
        const content = await zip.generateAsync({ type: "blob" })
        // 保存 ZIP 文件
        downloadBlob(content, "附件包", "application/zip")
      } catch (error) {
        console.error("下载或打包失败:", error)
      }
    },
    getSrc(url) {
      if (this.isPdf(url)) {
        return getTokenUrl(url) + "&type=previewPdf"
      } else {
        return getTokenUrl(url)
      }
    },
    preview(row) {
      window.open(this.getSrc(row.url))
    },
    handlePopoverShow(row) {
      if (!row.showPreview) {
        this.$set(row, "showPreview", true)
      }
    },
    handlePopoverHide(row) {
      if (row.showPreview) {
        this.$set(row, "showPreview", false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  height: 85vh;
  .el-dialog__body {
    overflow-y: scroll;
    height: calc(100% - 130px);
  }
}
</style>
