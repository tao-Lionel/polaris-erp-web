<template>
  <div id="notDi">
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="tableOption"
      @refresh-change="refreshChange"
      @search-change="searchChange"
      @search-reset="searchReset"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <el-button type="primary" size="small" v-if="permissions.purchase_container_generate" @click="handleGenerate"
          >生成排柜计划</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-if="permissions.purchase_container_allocate_region"
          @click="handleAllocateOverseasRegion"
        >
          分配海外仓区域
        </el-button>
        <el-button
          type="primary"
          size="small"
          v-if="permissions.purchase_container_mark_urgent"
          @click="handleMarkUrgent"
        >
          标记是否加急
        </el-button>
        <export-btn
          v-if="permissions.purchase_container_export"
          pageName="待排柜（非DI订单）"
          pageUrl="/deliveryPlan/pageNormalUnPlan"
          moduleName="purchase"
          :columns="tableOption.column"
          :pageReq="{ filtering: exportFiltering }"
        ></export-btn>
      </template>
      <template slot="search">
        <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
          <el-form-item prop="code">
            <el-input size="small" v-model="searchForm.code" clearable placeholder="采购单号" v-search-input></el-input>
          </el-form-item>
          <el-form-item prop="standardSkuCode">
            <el-input
              size="small"
              clearable
              placeholder="标准SKU"
              v-model="searchForm.standardSkuCode"
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="skuCode">
            <el-input
              size="small"
              clearable
              placeholder="工厂SKU"
              v-model="searchForm.skuCode"
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="categoryId">
            <el-cascader
              placeholder="品类"
              size="small"
              expand-trigger="hover"
              :props="props"
              v-model="searchForm.categoryId"
              :show-all-levels="false"
              :options="selectOptionData.treeCategoryData"
              @change="handleChange"
              clearable
              filterable
              collapse-tags
            ></el-cascader>
          </el-form-item>
          <el-form-item prop="warehouseId">
            <el-select v-model="searchForm.warehouseId" size="small" placeholder="入库仓库" filterable clearable>
              <el-option
                v-for="item in selectOptionData.warehouseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
        </el-form>
      </template>

      <template slot="searchAdvanced">
        <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
          <el-form-item prop="platform">
            <el-select
              v-model="searchForm.platform"
              size="small"
              placeholder="平台"
              multiple
              filterable
              clearable
              @change="platformChange"
            >
              <el-option
                v-for="item in selectOptionData.platform"
                :key="item.platformTypeCode"
                :label="item.platformTypeName"
                :value="item.platformTypeCode"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="site">
            <el-select v-model="searchForm.site" size="small" placeholder="站点" filterable multiple clearable>
              <el-option
                v-for="item in marketOption"
                :key="item.sitEnName"
                :label="item.sitEnName"
                :value="item.sitEnName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="purchaseOrganizationCode">
            <el-select
              v-model="searchForm.purchaseOrganizationCode"
              size="small"
              placeholder="采购组织"
              filterable
              clearable
            >
              <el-option
                v-for="item in selectOptionData.corporationList"
                :key="item.corporationCode"
                :label="item.corporationName"
                :value="item.corporationCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="supplierNo">
            <el-select v-model="searchForm.supplierNo" size="small" placeholder="供应商" filterable clearable>
              <el-option
                v-for="item in selectOptionData.supplierOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="factoryEstimatedDeliveryDate">
            <el-date-picker
              size="small"
              clearable
              v-model="searchForm.factoryEstimatedDeliveryDate"
              type="daterange"
              start-placeholder="工厂预计交期开始日期"
              end-placeholder="工厂预计交期结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="urgentFlag">
            <el-select v-model="searchForm.urgentFlag" size="small" placeholder="是否加急" filterable clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="overseasWarehouseRegion">
            <el-select
              v-model="searchForm.overseasWarehouseRegion"
              size="small"
              placeholder="海外仓所属区域"
              filterable
              clearable
            >
              <el-option
                v-for="item in warehouseRegionList"
                :key="item.id"
                :label="item.mappingName"
                :value="item.mappingCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
        </el-form>
      </template>
      <template slot="urgentFlag" scope="scope">
        <span> {{ scope.row.urgentFlag == 1 ? "是" : "否" }}</span>
      </template>
    </avue-crud>

    <AllocateOverseasRegion ref="AllocateOverseasRegion" />
    <el-dialog
      title="标记是否加急"
      :visible.sync="markDialogVisible"
      width="30%"
      close-on-press-escape
      close-on-click-modal
    >
      <div style="padding: 20px; text-align: center">
        <p style="padding-bottom: 20px">
          您勾选了 <span style="color: red">{{ selectList.length }}</span> 条数据，确定标记所选数据吗？
        </p>
        <div style="display: flex; justify-content: center">
          <el-form ref="markForm" :model="markForm" :rules="markRules" style="width: 50%">
            <el-form-item label-width="80px" label="是否加急" prop="isUrgent">
              <el-select size="small" v-model="markForm.isUrgent" placeholder="请选择">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="markDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleConfirmUrgent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { notDiTableOption } from "./index.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

import { getSit } from "@/api/order/orderManage"
import { getNotDiList, markUrgentFlag } from "@/api/purchase/containerLoadingPlan/index.js"
import { setFiltering, setOrderBy } from "@/util/auth"
import AllocateOverseasRegion from "./dialogComponents/allocateOverseasRegion.vue"
import { getObjByType } from "@/api/admin/dict.js"

export default {
  name: "notDi",
  components: { AllocateOverseasRegion },
  props: {
    selectOptionData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      props: { multiple: false },
      //搜索条件，和前端控件绑定
      searchForm: {
        code: "",
        standardSkuCode: "",
        skuCode: "",
        categoryName: "",
        warehouseId: "",
        platform: "",
        site: "",
        purchaseOrganizationCode: "",
        supplierNo: "",
        factoryEstimatedDeliveryDate: "",
        urgentFlag: "",
        overseasWarehouseRegion: ""
      },
      operatorParams: {
        // code: "LIKE",
        // standardSkuCode: "LIKE",
        // skuCode: "LIKE",
        factoryEstimatedDeliveryDate: "BETWEEN",
        supplierNo: "EQUAL",
        purchaseOrganizationCode: "EQUAL"
      },
      tableData: [],
      selectList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [10, 20, 30, 40, 50, 100, 200, 500]
      },

      tableOption: notDiTableOption,
      activeName: "first",
      markDialogVisible: false,
      markForm: {
        isUrgent: "1",
        poOrderDetailExtensionIdList: ""
      },
      markRules: {
        isUrgent: [{ required: true, message: "请选择是否加急", trigger: "blur" }]
      },
      marketOption: [],
      orderBy: [
        {
          field: "updateTime",
          order: "desc"
        }
      ]
    }
  },
  created() {
    this.getList()
    getObjByType("warehouse_region").then((res) => {
      if (res.data.code === 0) {
        console.log("res.data.data", res.data.data)
        if (res.data.data.length > 0) {
          this.warehouseRegionList = res.data.data[0].dictMappings
        }
      }
    })
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions"]),
    exportFiltering() {
      return setFiltering(
        {
          ...this.searchForm
        },
        this.operatorParams
      )
    }
  },
  methods: {
    platformChange(val) {
      console.log(val)
      this.searchForm.site = []
      this.getPlatformSit(val)
    },
    handleGenerate() {
      if (this.selectList.length === 0) {
        this.$message({
          type: "warning",
          message: "未选中数据"
        })
        return
      }
      this.$router.push({
        path: "/purchase/containerLoadingPlan/generate",
        query: {
          type: "OTHER"
        }
      })

      localStorage.setItem(
        "containerIds",
        JSON.stringify(this.selectList?.map((item) => item.id).filter((i) => i != ""))
      )
    },
    handleAllocateOverseasRegion() {
      this.$refs.AllocateOverseasRegion.handleOpenDialog()
    },
    handleMarkUrgent() {
      if (this.selectList.length === 0) {
        this.$message({
          type: "warning",
          message: "未选中数据"
        })
        return
      }
      this.markDialogVisible = true
      this.markForm.poOrderDetailExtensionIdList = this.selectList.map((item) => item.id)
    },
    async handleConfirmUrgent() {
      const { data } = await markUrgentFlag({
        urgentFlag: this.markForm.isUrgent,
        poOrderDetailExtensionIdList: this.markForm.poOrderDetailExtensionIdList
      })
      if (data.code == 0) {
        this.$message({
          type: "success",
          message: "标记成功"
        })
        this.getList()
        this.markDialogVisible = false
      }
    },
    selectionChange(list) {
      this.selectList = list
    },

    getList(opt) {
      const { categoryId } = this.searchForm
      const postData = deepClone({
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...opt,
        filtering: setFiltering(
          {
            ...this.searchForm,
            categoryId: categoryId ? categoryId[categoryId.length - 1] : ""
          },
          this.operatorParams
        ),
        orderBy: setOrderBy(null, this.orderBy)
      })

      getNotDiList(postData).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },

    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList({
        page: 1
      })
    },
    /**
     * 搜索回调
     */
    searchChange() {
      this.getList()
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    currentChange(val) {
      console.log("🥶 ---> currentChange ---> val👉", val)
      this.page.currentPage = val
      this.getList()
    },
    //根据平台查询站点
    getPlatformSit(param) {
      getSit(param).then((res) => {
        this.marketOption = this.sortArray(res.data, "sitName")
      })
    },
    // 排序
    sortArray(arr, field) {
      return arr.sort((a, b) => {
        const nameA = a[field].toUpperCase() // 忽略大小写
        const nameB = b[field].toUpperCase() // 忽略大小写
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__content {
  margin-left: 0 !important;
}
#notDi {
}
::v-deep .el-dialog .el-dialog__footer {
  padding: 10px !important;
}
</style>
