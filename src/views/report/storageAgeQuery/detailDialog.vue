<template>
  <el-dialog :title="title" :visible="value" width="80%" @close="handleCancel" @open="open">
    <div id="storageAgeQuery">
      <basic-container>
        <div style="padding-bottom: 20px">总库龄： {{ age }} 天</div>
        <avue-crud ref="crud" :data="tableData" :option="detailTableOption"> </avue-crud>
      </basic-container>
    </div>
    <span slot="footer" class="dialog-footer" style="display: flex; justify-content: center">
      <el-button style="padding: 9px 30px" size="small" @click="handleCancel">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { detailTableOption } from "./index"
import * as API from "@/api/storageAgeQuery"

export default {
  props: {
    value: {
      default: false,
      required: true,
      type: Boolean
    },
    id: {
      required: true,
      type: Number | String,
      default: () => ""
    },
    // title: {
    //   default: () => '公司库龄明细',
    //   type: String,
    // },
    detailType: {
      default: () => "company"
    },
    detailItem: {}
  },
  data() {
    return {
      title: "公司库龄明细",
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      detailTableOption: detailTableOption,

      age: 0
    }
  },
  watch: {
    id(newValue, oldValue) {
      // 在此处处理 id 变化的逻辑
    }
  },
  created() {},
  methods: {
    dealParam() {
      let paramObj = {}
      switch (this.detailType) {
        case "company":
          this.title = "公司库龄明细"
          paramObj = {
            companyBatchNoList: this.detailItem.companyBatchNoList || [],
            sku: this.detailItem.sku,
            site: [`${this.detailItem.platform}-${this.detailItem.site}`],
            platform: [this.detailItem.platform]
          }

          break
        case "overseas":
          this.title = "海外库龄明细"
          paramObj = {
            overseaBatchNoList: this.detailItem.overseaBatchNoList || [],
            sku: this.detailItem.sku,
            site: [`${this.detailItem.platform}-${this.detailItem.site}`],
            platform: [this.detailItem.platform]
          }

          break
        case "platform":
          this.title = "平台站点库龄明细"
          paramObj = {
            platformSiteBatchNoList: this.detailItem.platformSiteBatchNoList,
            sku: this.detailItem.sku,
            site: [`${this.detailItem.platform}-${this.detailItem.site}`],
            platform: [this.detailItem.platform]
          }

          break
        case "warehouse":
          this.title = "仓库库龄明细"
          paramObj = {
            warehouseBatchNoList: this.detailItem.warehouseBatchNoList,
            sku: this.detailItem.sku,
            warehouseId: [this.detailItem.warehouseId]
          }

          break
      }
      return paramObj
    },
    open() {
      this.getList()
    },
    async getList() {
      const { data } = await API.getStorageAgeDetail(this.dealParam())
      this.tableData = data.data.pageResult.records

      // 不同平台显示的库龄字段不一致，统一处理为age
      if (this.detailType == "company") {
        this.age = data.data.totalCompanyStockAge
        this.tableData.forEach((item) => {
          item.age = item.companyStockAge
          item.latestInboundNo = item.latestInboundNoWithCompany
          item.latestInboundDate = item.latestInboundNoWithCompanyDate
        })
      }
      if (this.detailType == "platform") {
        this.age = data.data.totalPlatformSiteStockAge
        this.tableData.forEach((item) => {
          item.age = item.platformSiteStockAge
          item.latestInboundNo = item.latestInboundNoWithPlatformSite
          item.latestInboundDate = item.latestInboundNoWithPlatformSiteDate
        })
      }
      if (this.detailType == "overseas") {
        this.age = data.data.totalOverseaStockAge
        this.tableData.forEach((item) => {
          item.age = item.overseaStockAge
          item.latestInboundNo = item.latestInboundNoWithOversea
          item.latestInboundDate = item.latestInboundNoWithOverseaDate
        })
      }
      if (this.detailType == "warehouse") {
        this.age = data.data.totalWarehouseStockAge
        this.tableData.forEach((item) => {
          item.age = item.warehouseStockAge
          item.latestInboundNo = item.latestInboundNoWithWarehouse
          item.latestInboundDate = item.latestInboundNoWithWarehouseDate
        })
      }
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    selectionChange(selected) {
      this.selectRows = selected
    },
    refreshChange() {
      this.getList(this.page)
    },
    handleFilter(param) {
      // this.clearSelectClear();
      // this.page.page = 1;
      // this.queryParamQ = deepCloneIgnoreNull(this.queryParam);
      this.getList(this.page, param)
    },
    handleCancel() {
      this.$emit("input", false)
    }
  }
}
</script>

<style lang="scss"></style>
