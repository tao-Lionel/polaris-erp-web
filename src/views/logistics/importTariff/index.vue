<template>
  <div id="importTariff">
    <basic-container>
      <div style="min-height: 600px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="first">
            <template slot="label">
              <p class="pane-title">明细</p>
            </template>
            <avue-crud
              ref="detailCrud"
              :page="page1"
              :data="detailData"
              :option="detailOption"
              @refresh-change="refreshChange1"
              @search-change="searchChange1"
              @search-reset="searchReset1"
              @size-change="sizeChange1"
              @current-change="currentChange1"
            >
              <template slot="menuLeft">
                <el-button type="primary" size="small" @click="handleAddTariff">添加</el-button>
              </template>
              <template slot-scope="scope" slot="search">
                <el-form
                  @submit.native.prevent
                  :model="searchForm1"
                  :inline="true"
                  ref="searchForm1"
                  style="float: left"
                >
                  <el-form-item prop="refundStatus">
                    <el-select
                      v-model="searchForm1.categoryId"
                      size="small"
                      filterable
                      placeholder="产品品类"
                      clearable
                      multiple
                    >
                      <el-option
                        v-for="item in categoryList"
                        :key="item.categoryId"
                        :label="item.categoryName"
                        :value="item.categoryId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item prop="">
                    <el-select
                      v-model="searchForm1.sourceCountry"
                      size="small"
                      filterable
                      placeholder="产地"
                      clearable
                      multiple
                    >
                      <el-option
                        v-for="item in countryList"
                        :key="item.countryCode"
                        :label="item.countryShortName"
                        :value="item.countryCode"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="">
                    <el-select
                      v-model="searchForm1.targetCountry"
                      size="small"
                      filterable
                      placeholder="目的国"
                      clearable
                      multiple
                    >
                      <el-option
                        v-for="item in countryList"
                        :key="item.countryCode"
                        :label="item.countryShortName"
                        :value="item.countryCode"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="" label="是否反倾销">
                    <el-radio-group v-model="searchForm1.isAntiDumping">
                      <el-radio :label="2">全部</el-radio>
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </template>
              <template slot-scope="scope" slot="tariffRate">
                {{ handleNumberPrecision(scope.row.tariffRate) }}%
              </template>

              <template slot-scope="scope" slot="mpf"> {{ handleNumberPrecision(scope.row.mpf) }}% </template>
              <template slot-scope="scope" slot="hmf"> {{ handleNumberPrecision(scope.row.hmf) }}% </template>
              <template slot-scope="scope" slot="antiDumpingRate">
                {{ handleNumberPrecision(scope.row.antiDumpingRate) }}%
              </template>
              <template slot-scope="scope" slot="consumptionRate">
                {{ handleNumberPrecision(scope.row.consumptionRate) }}%
              </template>

              <template slot-scope="scope" slot="status"> {{ scope.row.status == 1 ? "正常" : "停用" }} </template>
              <template slot-scope="scope" slot="opeSolt">
                <div>
                  <el-button type="text" style="color: red" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                </div>
              </template>
            </avue-crud>
          </el-tab-pane>
          <el-tab-pane label="汇总" name="second">
            <template slot="label">
              <p class="pane-title">汇总</p>
            </template>

            <avue-crud
              ref="totalCrud"
              :page="page2"
              :data="totalData"
              :option="totalOption"
              @refresh-change="refreshChange2"
              @search-change="searchChange2"
              @search-reset="searchReset2"
              @size-change="sizeChange2"
              @current-change="currentChange2"
            >
              <template slot-scope="scope" slot="search">
                <el-form
                  @submit.native.prevent
                  :model="searchForm1"
                  :inline="true"
                  ref="searchForm1"
                  style="float: left"
                >
                  <el-form-item prop="refundStatus">
                    <el-input v-model.trim="searchForm2.categoryName" size="small" placeholder="产品品类"></el-input>
                  </el-form-item>

                  <el-form-item prop="" label="已维护关税率">
                    <el-radio-group v-model="searchForm2.isMaintenance">
                      <el-radio :label="2">全部</el-radio>
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </template>

              <template slot-scope="scope" slot="opeSolt">
                <div>
                  <el-button type="text" @click="handleAdd(scope.row)">添加</el-button>
                  <el-button type="text" v-if="scope.row.maintenanceNum > 0" @click="handleCheckDetail(scope.row)"
                    >查看明细</el-button
                  >
                </div>
              </template>
            </avue-crud>
          </el-tab-pane>
        </el-tabs>
      </div>
      <AddTariffDialog
        v-model="addTariffVisible"
        :categoryList="categoryList"
        :countryList="countryList"
        :editRow="editRow"
        :type="type"
        :categoryId="categoryId"
        @success="success"
      ></AddTariffDialog>
    </basic-container>
  </div>
</template>

<script>
import { detailOption, totalOption } from "./index"
import {
  queryAllLowestLevelCategory,
  getCountry,
  listPage,
  summaryListPage,
  deleteTariff
} from "@/api/logistics/importTariff/index.js"

import AddTariffDialog from "./addTariffDialog"

export default {
  name: "importTariff",
  data() {
    return {
      activeName: "first",
      detailData: [],
      totalData: [],
      detailOption: detailOption,
      totalOption: totalOption,
      page1: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      page2: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchForm1: {
        categoryId: [],
        sourceCountry: [],
        targetCountry: [],
        isAntiDumping: 2
      },
      searchForm2: {
        categoryName: "",
        isMaintenance: 2
      },
      countryList: [],
      categoryList: [],
      addTariffVisible: false,
      editRow: {},
      type: "",
      categoryId: ""
    }
  },
  components: {
    AddTariffDialog
  },
  created() {
    this.getCountry()
    this.queryAllLowestLevelCategory()
    this.listPage()
    this.summaryListPage()
  },
  methods: {
    getListByDetail() {},
    getListByTotal() {},
    getCountry() {
      getCountry().then((res) => {
        if (res.data.code == 0) {
          this.countryList = res.data.data
        }
      })
    },
    queryAllLowestLevelCategory() {
      queryAllLowestLevelCategory().then((res) => {
        if (res.data.code == 0) {
          this.categoryList = res.data.data
        }
      })
    },
    async listPage() {
      const postData = JSON.parse(JSON.stringify(this.searchForm1))
      if (postData.categoryId.length == 0) delete postData.categoryId
      if (postData.sourceCountry.length == 0) delete postData.sourceCountry
      if (postData.targetCountry.length == 0) delete postData.targetCountry
      if (postData.isAntiDumping == 2) {
        delete postData.isAntiDumping
      }
      const { data } = await listPage({
        ...postData,
        page: this.page1.currentPage,
        pageSize: this.page1.pageSize
      })
      if (data.code === 0) {
        this.detailData = data.data.records
        this.page1.total = data.data.total
        this.page1.currentPage = data.data.page
      }
    },
    async summaryListPage() {
      const postData = JSON.parse(JSON.stringify(this.searchForm2))
      if (postData.isMaintenance == 2) {
        delete postData.isMaintenance
      }
      if (!postData.categoryName) {
        delete postData.categoryName
      }
      const { data } = await summaryListPage({
        ...postData,
        page: this.page2.currentPage,
        pageSize: this.page2.pageSize
      })
      if (data.code === 0) {
        this.totalData = data.data.records
        this.page2.total = data.data.total
        this.page2.currentPage = data.data.page
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleEdit(row) {
      console.log("编辑")
      // update()
      this.addTariffVisible = true
      this.editRow = row
      this.categoryId = row.categoryId
      this.type = "edit"
    },
    async handleDelete(row) {
      console.log("删除", row)
      this.$confirm("删除后数据不可恢复，是否继续?", "", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        center: true
      }).then(async () => {
        const { data } = await deleteTariff({
          id: [row.id]
        })
        if (data.code === 0) {
          this.$message.success("删除成功")
          this.listPage()
        }
      })
    },
    handleAdd(row) {
      this.addTariffVisible = true
      this.type = "totalAdd"
      this.editRow = {}
      this.categoryId = row.categoryId
    },
    handleCheckDetail(row) {
      this.searchForm1.categoryId = [row.categoryId]
      this.activeName = "first"
      this.listPage()
    },
    refreshChange1() {
      this.page1.currentPage = 1
      this.listPage()
    },
    searchChange1() {
      this.page1.currentPage = 1
      this.listPage()
    },
    searchReset1() {
      console.log("情況")

      this.searchForm1 = {
        categoryId: [],
        sourceCountry: [],
        targetCountry: [],
        isAntiDumping: 2
      }
    },
    sizeChange1(val) {
      this.page1.pageSize = val
      this.listPage()
    },
    currentChange1(val) {
      this.page1.currentPage = val
      this.listPage()
    },
    refreshChange2() {
      this.page2.currentPage = 1
      this.summaryListPage()
    },
    searchChange2() {
      this.page2.currentPage = 1
      this.summaryListPage()
    },
    searchReset2() {
      this.searchForm2 = {
        categoryName: "",
        isMaintenance: 2
      }
    },
    sizeChange2(val) {
      this.page2.pageSize = val
      this.summaryListPage()
    },
    currentChange2(val) {
      this.page2.currentPage = val
      this.summaryListPage()
    },
    handleAddTariff() {
      this.addTariffVisible = true
      this.type = "add"
      this.editRow = {}
    },
    success() {
      this.activeName == "first" ? this.listPage() : this.summaryListPage()
      this.editRow = {}
    },
    handleNumberPrecision(num) {
      return Math.round(num * 100 * 100000) / 100000
    }
  }
}
</script>

<style lang="scss" scoped>
#importTariff {
  .pane-title {
    width: 160px;
    text-align: center;
  }
}
</style>
