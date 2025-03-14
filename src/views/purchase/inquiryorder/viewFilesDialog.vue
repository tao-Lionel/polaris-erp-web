<template>
  <el-dialog title="查看询价凭证" :visible.sync="showDialog" width="600px" top="10vh">
    <div>
      <avue-crud :data="list" :option="viewAttachmentTableOption">
        <template slot="operation" slot-scope="scope">
          <el-popover placement="left" trigger="hover" width="600">
            <iframe
              v-if="isPdf(scope.row.url)"
              :src="getSrc(scope.row.url)"
              style="width: 100%; height: 500px"
            ></iframe>
            <img v-else style="max-width: 600px" :src="getSrc(scope.row.url)" alt="图片预览" />

            <a slot="reference" @click="preview(scope.row)">预览</a>
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
import { getTokenUrl, getDictByType, getFileExtension } from "@/util/auth"
import { getFileListByIdListApi } from "@/api/common/index"

export default {
  name: "viewAttachmentDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      list: [],
      viewAttachmentTableOption: {
        page: false,
        border: true,
        header: false,
        columnBtn: false,
        editBtn: false,
        delBtn: false,
        addBtn: false,
        selection: false,
        fixHeight: 400,
        column: [
          { label: "文件名", prop: "fileName", sortable: false },
          { label: "操作", prop: "operation", sortable: false, solt: true, width: 120 }
        ]
      }
    }
  },
  computed: {
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
    async openDialog(row) {
      this.showDialog = true
      this.getList(row.inquiryEvidence)
    },
    async getList(inquiryEvidence) {
      const formData = new FormData()
      formData.append("fileIdList", inquiryEvidence)
      const { data } = await getFileListByIdListApi(formData)
      if (data.code === 0) {
        this.list = data.data.map((item) => {
          return {
            ...item,
            url: item.filePath
          }
        })
      }
    },
    download(row) {
      window.location = getTokenUrl(row.url)
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
