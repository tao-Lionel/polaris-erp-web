<template>
  <div class="export-btn">
    <el-button :type="type" size="small" @click="handleExport" v-bind="$attrs"> {{ buttonText }} </el-button>
  </div>
</template>

<script>
import { exportPageComApi } from "@/api/common"
import { downloadBlob } from "@/util/auth"
import { getStore as getSession } from "@/util/store"

export default {
  name: "ExportBtn",
  components: {},
  props: {
    pageName: {
      type: String,
      default: ""
    },
    pageUrl: {
      type: String,
      default: ""
    },
    moduleName: {
      type: String,
      default: ""
    },
    columns: {
      type: Array,
      default: () => []
    },
    pageReq: {
      type: Object,
      default: () => {}
    },
    type: { type: String, default: "primary" }, // 显式声明 type
    buttonText: { type: String, default: "导 出" }
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    // 转换column
    transformColumn(columns) {
      // 如果columns 最后一列是操作列，则去掉
      if (columns[columns.length - 1].solt && columns[columns.length - 1].label === "操作") {
        columns.pop()
      }
      return columns.map((item) => {
        return {
          title: item.label,
          name: item.prop
        }
      })
    },

    async handleExport() {
      const params = {
        pageName: this.pageName,
        pageUrl: this.pageUrl,
        columnList: this.transformColumn([...this.columns]),
        pageReq: this.pageReq
      }

      exportPageComApi(this.moduleName, params)
        .then((res) => {
          console.log("res======", res)
          if (res.data instanceof Blob) {
            downloadBlob(res.data, `${this.pageName}.xlsx`, "application/vnd.ms-excel;charset=utf-8")
            this.$message.success(`导出成功`)
          } else {
            let count = getSession({ name: "downloadCount" })
            this.$store.commit("SET_DOWNLOAD_COUNT", Number(count) + 1)
            this.$message.success(`${res.data}，请点击右上角【下载列表】图标进行查看！`)
          }
        })
        .catch((err) => {
          // this.$message.error("导出失败")
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.export-btn {
  display: inline-flex;
  margin-right: 10px;
}
.el-button + .export-btn {
  margin-left: 10px;
}
</style>
