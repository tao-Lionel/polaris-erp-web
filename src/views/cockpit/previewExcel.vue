<template>
  <div>
    <basic-container>
      <vue-office-excel
        class="dialogShowScroll"
        :src="excel"
        :options="options"
        style="height: 100vh"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </basic-container>
  </div>
</template>

<script>
//引入VueOfficeExcel组件
import VueOfficeExcel from "@vue-office/excel"
//引入相关样式
import "@vue-office/excel/lib/index.css"
import { getTokenUrl } from "@/util/auth"

export default {
  name: "PreviewExcel",
  components: { VueOfficeExcel },
  data() {
    return {
      loading: null,
      options: {
        xls: false, //预览xlsx文件设为false；预览xls文件设为true
        // minColLength: 0, // excel最少渲染多少列，如果想实现xlsx文件内容有几列，就渲染几列，可以将此值设置为0.
        // minRowLength: 0, // excel最少渲染多少行，如果想实现根据xlsx实际函数渲染，可以将此值设置为0.
        widthOffset: 10, //如果渲染出来的结果感觉单元格宽度不够，可以在默认渲染的列表宽度上再加 Npx宽
        heightOffset: 10, //在默认渲染的列表高度上再加 Npx高
        // beforeTransformData: (workbookData) => {
        //   return workbookData
        // }, //底层通过exceljs获取excel文件内容，通过该钩子函数，可以对获取的excel文件内容进行修改，比如某个单元格的数据显示不正确，可以在此自行修改每个单元格的value值。
        transformData: (workbookData) => {
          // workbookData.forEach((item) => {
          //   item.styles.forEach((style) => {
          //     style.font.size = 10
          //     style.font.name = "微软雅黑"
          //   })
          // })
          // return workbookData
        } //将获取到的excel数据进行处理之后且渲染到页面之前，可通过transformData对即将渲染的数据及样式进行修改，此时每个单元格的text值就是即将渲染到页面上的内容
      },
      excel: getTokenUrl(decodeURIComponent(this.$route.query.url))

      // getTokenUrl(
      //   "finance/bill/overseaWarehouse/2024-08/上海环世供应链科技有限公司/e7c91632-255c-490c-97bb-d6c3231214e3_2024-08@上海环世供应链科技有限公司@海外仓账单明细.xlsx"
      // ) //设置文档地址
    }
  },
  computed: {},
  created() {},
  mounted: function () {
    this.loading = this.$loading({
      target: ".vue-office-excel",
      lock: true,
      text: "文件略大，努力加载中...",
      spinner: "el-icon-loading"
    })
  },
  methods: {
    renderedHandler() {
      this.loading.close()
      console.log("渲染完成")
    },
    errorHandler(e) {
      this.loading.close()
      this.$message.error("文件加载失败")
      console.log("渲染失败", e)
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  opacity: 1 !important;
  width: 10px;
  height: 10px;
}
::v-deep .abc {
  font-size: 30px;
}
</style>
