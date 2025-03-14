<template>
  <div id="SCDataExport">
    <basic-container>
      <div style="height: 100%">
        <div class="title-head">选中导出的数据类型</div>
        <el-row :gutter="12">
          <el-card class="box-card" v-for="(item, index) in categoryData" :key="index">
            <div slot="header" class="clearfix">
              <span class="card-title">{{ item.category }}</span>
            </div>
            <div class="flex-box">
              <div class="flex-item" v-for="(ele, ind) in item.items" :key="ind">
                <el-button plain class="type-btn" @click="handleModule(ele)">{{ ele.name }}</el-button>
              </div>
            </div>
          </el-card>
        </el-row>
      </div>
      <ExportDialog
        v-model="visible"
        :title="dialogTitle"
        :paramsData="paramsData"
        :moduleId="moduleId"
        :exportModel="exportModel"
        @handleClose="handleClose"
      ></ExportDialog>
    </basic-container>
  </div>
</template>

<script>
import { getExportInfo } from "@/api/financialStatements/supplyChainDataExport"
import ExportDialog from "./exportDialog.vue"

export default {
  name: "SCDataExport",
  data() {
    return {
      categoryData: [],
      visible: false,
      dialogTitle: "",
      paramsData: [],
      moduleId: "",
      exportModel: "SYNC"
    }
  },
  components: {
    ExportDialog
  },
  created() {
    this.getExportInfo()
  },
  methods: {
    async getExportInfo() {
      const { data } = await getExportInfo()
      if (data.code == 0) {
        this.categoryData = this.categorizeData(data.data)
      }
    },
    categorizeData(data) {
      const categorizedData = []

      data.forEach((item) => {
        const category = item.category
        let categoryItem = categorizedData.find((cat) => cat.category === category)

        if (!categoryItem) {
          categoryItem = { category: category, items: [] }
          categorizedData.push(categoryItem)
        }

        categoryItem.items.push(item)
        categoryItem.items.sort((a, b) => a.orderNum - b.orderNum)
      })
      console.log("categorizedData", categorizedData)
      return categorizedData
    },
    handleModule(ele) {
      this.visible = true
      this.dialogTitle = ele.name
      this.paramsData = ele.params
      this.moduleId = ele.id
      this.exportModel = ele.exportModel
    },
    handleClose() {
      this.paramsData = []
      this.moduleId = ""
      this.dialogTitle = ""
      this.exportModel = ""
    }
  }
}
</script>

<style lang="scss" scoped>
#SCDataExport {
  .title-head {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .card-title {
    font-size: 20px;
    font-weight: bold;
  }
  .cont-text {
    font-size: 16px;
  }
  .type-btn {
    max-width: 220px;
    height: 80px;
    overflow-wrap: break-word;
    white-space: normal;
  }
  .flex-box {
    display: flex;
    flex-wrap: wrap;
    .flex-item {
      margin: 10px 20px 10px 0px;
    }
    .flex-item:last-child() {
      margin-right: 0px;
    }
  }
}
</style>
