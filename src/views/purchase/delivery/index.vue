<template>
  <div class="podelivery" id="delivery">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        class="handle-cell-hidden"
      >
        <template slot-scope="scope" slot="menuLeft">
          <el-button type="primary" size="small" @click="delRows" v-if="permissions.poDelivery_delete">删除</el-button>

          <el-button type="primary" size="small" @click="arrangeComfirm(1)" v-if="permissions.poDelivery_arrange">
            确认安排
          </el-button>

          <el-button type="primary" size="small" @click="exportData" v-if="permissions.poDelivery_export">
            导出
          </el-button>

          <el-button type="primary" size="small" @click="print()" v-if="permissions.poDelivery_print">
            打印单据
          </el-button>

          <el-button type="primary" size="small" @click="cancelConfirm()"> 撤销确认 </el-button>
        </template>
        <template slot="deliveryProduct" slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row.deliveryNo)">{{ scope.row.detailCount }}笔</el-button>
        </template>

        <template slot="deliveryStatus" slot-scope="scope">
          <a @click="showOperateLog(scope.row.deliveryNo)">{{ formatData(scope.row.deliveryStatus) }}</a>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm">
            <el-form-item prop="deliveryNo" label="">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.deliveryNo"
                placeholder="单据编号,支持多个"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-form-item prop="deliveryStatus">
              <el-select
                multiple
                collapse-tags
                v-model="searchForm.deliveryStatus"
                size="small"
                placeholder="单据状态"
                clearable
              >
                <el-option
                  v-for="(item, index) in deliveryStatusOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="supplierName" label="">
              <el-select v-model="searchForm.supplierName" size="small" placeholder="请选择供应商" filterable clearable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="warehouseId">
              <el-select v-model="searchForm.warehouseId" size="small" filterable clearable placeholder="仓库">
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>

        <template slot="deliveryNo" slot-scope="scope">
          <router-link :to="'/delivery/create?deliveryNo=' + scope.row.deliveryNo" :title="scope.row.deliveryNo">{{
            scope.row.deliveryNo
          }}</router-link>
        </template>
        <template slot="shippingContainerNoList" slot-scope="scope">
          <div v-if="scope.row.shippingContainerNoList && scope.row.shippingContainerNoList.length">
            <p v-for="item in scope.row.shippingContainerNoList" :key="item">{{ item }}</p>
          </div>
          <span v-else></span>
        </template>

        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="corporationName">
              <el-select v-model="searchForm.corporationName" size="small" placeholder="法人主体" filterable clearable>
                <el-option
                  v-for="item in corporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="sku">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.sku"
                placeholder="SKU,支持多个"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-form-item prop="requisitionBatchNo">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.requisitionBatchNo"
                placeholder="采购计划号,支持多个"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.purchaseOrderNo"
                placeholder="采购单号,支持多个"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>

            <el-form-item prop="iniTaxType">
              <el-select
                multiple
                collapse-tags
                v-model="searchForm.iniTaxType"
                size="small"
                placeholder="税别"
                clearable
              >
                <el-option
                  v-for="(item, index) in iniTaxTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="cabinetCode">
              <el-input
                v-model="searchForm.cabinetCode"
                size="small"
                v-search-input
                placeholder="排柜号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="inboundNo" label="">
              <el-input
                v-model="searchForm.inboundNo"
                size="small"
                v-search-input
                placeholder="入库单号,支持多个"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="shippingContainerNo">
              <el-input
                v-model="searchForm.shippingContainerNo"
                size="small"
                v-search-input
                placeholder="出货柜号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchaseByName">
              <el-input
                v-model="searchForm.purchaseByName"
                size="small"
                v-search-input
                clearable
                placeholder="采购员"
              ></el-input>
            </el-form-item>
            <el-form-item prop="inboundStatus">
              <el-select v-model="searchForm.inboundStatus" size="small" placeholder="入库状态" filterable clearable>
                <el-option label="已入库" :value="true"></el-option>
                <el-option label="未入库" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <avue-crud-search-item
              ref="searchCrudItemRef"
              :searchFields="searchFields"
              @updateField="updateField"
            ></avue-crud-search-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>

        <template slot="tableBeforeSlot">
          <div style="position: relative; font-size: 13px">
            <div style="position: absolute; top: 7px; left: 300px; z-index: 100">
              <span>汇总数量：</span><span>{{ deliveryQuantityTotal }}</span>
              <span style="margin-left: 30px">汇总金额：</span><span>{{ amountTotal }}</span>
            </div>
          </div>
        </template>
        <template slot="opeSolt" slot-scope="scope">
          <a
            class="operator-button"
            v-if="permissions.poDelivery_notification"
            @click="handleLinkShipmentNotification(scope.row)"
            >关联出货通知单</a
          >
        </template>
      </avue-crud>

      <el-dialog title="送货产品详情" :visible.sync="detailTableVisible">
        <p>
          币别：{{ detailTableCurrency }}&nbsp;&nbsp;&nbsp;总数量：{{ detailTableSum }}&nbsp;&nbsp;&nbsp;总体积：{{
            detailTableVolume
          }}(m³)
        </p>
        <avue-crud :data="detailTableData" :option="detailTableOptions"></avue-crud>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="detailTableVisible = false">关 闭 </el-button>
        </div>
      </el-dialog>
      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
      <ShipmentNotificationDialog ref="ShipmentNotification" @success="getList(page)"></ShipmentNotificationDialog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  delRows,
  arrangeComfirm,
  showDetail,
  exportDeliveryData,
  cancelConfirmPoDeliveryApi
} from "@/api/purchase/delivery/podelivery.js"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { downloadBlob } from "@/util/auth"
import { tableOption, detailTableOptions } from "@/const/crud/purchase/delivery/podelivery.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import operationlog from "@/views/purchase/log/index"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getAll as getAllCorporationApi } from "@/api/baseSetup/bsecorporation"
import ShipmentNotificationDialog from "./shipmentNotificationDialog.vue"
import { setFiltering, setOrderBy } from "@/util/auth"
export default {
  name: "podelivery",
  data() {
    return {
      detailTableOptions: detailTableOptions,
      selectRows: [],
      detailTableCurrency: "",
      detailTableSum: "",
      detailTableVolume: "",
      detailTableData: [],
      detailTableVisible: false,
      //搜索条件，和前端控件绑定
      searchForm: {
        corporationName: "",
        deliveryNo: "", //单据编号
        deliveryStatus: "",
        iniTaxType: "",
        purchaseOrderNo: "",
        searchDate: [],
        sku: "",
        supplierName: "",
        cabinetCode: "",
        inboundStatus: "",
        requisitionBatchNo: "",
        inboundDate: [],
        inboundNo: "",
        shippingContainerNo: "",
        purchaseByName: "",
        warehouseId: ""
      },
      iniTaxTypeOptions: [
        {
          label: "含税",
          value: "1"
        },
        {
          label: "非税",
          value: "2"
        }
      ],
      deliveryStatusOptions: [
        {
          label: "未处理",
          value: "0"
        },
        {
          label: "已安排",
          value: "1"
        }
      ],
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      tableOption: tableOption,
      deliveryQuantityTotal: 0,
      amountTotal: 0,
      warehouseOptions: [],
      supplierOptions: [],
      searchFields: [
        { label: "单据时间", value: "searchDate", type: "daterange", default: true },
        { label: "送货时间", value: "deliveryDate", type: "daterange" },
        { label: "入库时间", value: "inboundDate", type: "daterange" }
      ],
      corporationList: [],
      orderBy: [{ field: "createTime", order: "desc" }]
    }
  },
  created() {
    getAllWarehouse().then((res) => {
      if (res.data.code === 0) {
        let arr = res.data.data.filter((item) => item.funcState === "1")
        this.warehouseOptions = arr.map((item) => {
          return {
            label: item.warehouseName,
            value: item.warehouseId
          }
        })
      }
    })
    this.getSupplierAll()
    this.getCorporation()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    operationlog,
    ShipmentNotificationDialog
  },
  methods: {
    exportData() {
      exportDeliveryData(this.searchFormConfirm)
        .then((res) => {
          downloadBlob(res.data, "送货单导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    formatData(id) {
      const obj = {
        0: "未处理",
        1: "已安排"
      }
      return obj[id]
    },
    // 查看日志
    showOperateLog(deliveryNo) {
      this.$refs.operationlog.showOperateLogDialog(deliveryNo, 15)
    },
    //跳转打印页面
    print() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("只能勾选一条数据操作")
        return
      }
      if (this.selectRows[0].deliveryStatus != 1) {
        this.$message.warning("只有已安排的数据才能打印或导出")
        return
      }
      this.$router.push({
        path: "/delivery/print",
        query: {
          deliveryNo: this.selectRows[0].deliveryNo
        }
      })
    },
    //确认/撤销安排
    arrangeComfirm(type) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      for (let index = 0; index < this.selectRows.length; index++) {
        if (this.selectRows[index].deliveryStatus == type) {
          this.$message.warning("请检查[单据状态]是否正确")
          return
        }
      }

      arrangeComfirm(this.selectRows, type)
        .then((response) => {
          if (response.data.code == 0) {
            // 手动调用清除选择
            this.$refs.crud.selectClear()
            this.getList(this.page)
            this.$message.success("操作成功")
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
            return
          } else {
            this.$message.error("操作失败")
            return
          }
          this.getList(this.page)
        })
        .finally(() => {})
    },
    //删除按钮
    delRows() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      var deliveryNoList = []
      this.selectRows.forEach((item) => {
        deliveryNoList.push(item.deliveryNo)
      })
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRows(deliveryNoList).then((response) => {
            //this.tableData.splice(this.selectList[0].$index, 1, Object.assign({}, selectRow))
            if (response.data.code == 0) {
              this.getList(this.page)
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              })
              // 手动调用清除选择
              this.$refs.crud.selectClear()
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("删除失败")
              return
            }

            this.getList(this.page)
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    //勾选方法
    selectionChange(selected) {
      this.selectRows = selected
      this.deliveryQuantityTotal = this.selectRows.reduce((prev, cuv) => {
        return prev + (cuv.count ? cuv.count : 0)
      }, 0)

      let amountTotal = this.selectRows.reduce((prev, cuv) => {
        return prev + (cuv.amount ? cuv.amount : 0)
      }, 0)
      this.amountTotal = amountTotal.toFixed(2)
    },
    //显示送货产品
    showDetail(deliveryNo) {
      //清空历史记录
      showDetail(deliveryNo).then((response) => {
        if (response.data.code == 0) {
          var detailList = response.data.data
          // debugger;
          this.detailTableData = []
          //
          this.detailTableVisible = true
          this.detailTableCurrency = detailList[0].currency
          this.detailTableSum = detailList[0].deliverySum
          this.detailTableVolume = detailList[0].volume
          detailList.forEach((item) => {
            item.boxInfo = item.boxLength + "/" + item.boxWidth + "/" + item.boxHeight
          })
          this.detailTableData = detailList
        }
      })
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      this.page.currentPage = page.currentPage

      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
          // {
          //   filtering: setFiltering(
          //     {
          //       ...this.searchForm
          //     },
          //     this.operatorParams
          //   )
          // }
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
      this.$refs.searchCrudItemRef.resetField()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierName,
            label: item.supplierName
          })
        })
      }
    },
    // 撤销确认
    async cancelConfirm() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      for (let item of this.selectRows) {
        if (item.deliveryStatus === 0) {
          this.$message.warning("请勾选已确认安排的数据操作")
          return
        }
      }
      const deliveryNoList = this.selectRows.map((item) => item.deliveryNo)
      const { data } = await cancelConfirmPoDeliveryApi(deliveryNoList)
      if (data.code === 0) {
        this.$message.success("撤销成功")
        this.$refs.crud.selectClear()
        this.refreshChange()
      } else {
        this.$message.warning(data.msg)
      }
    },
    updateField(obj) {
      this.searchForm = { ...this.searchForm, ...obj }
    },
    // 获取法人主体
    async getCorporation() {
      const { data } = await getAllCorporationApi()
      if (data.code === 0) {
        this.corporationList = data.data
      }
    },
    handleLinkShipmentNotification(row) {
      console.log("row", row)
      this.$refs.ShipmentNotification?.openDialog(row)
    }
  }
}
</script>

<style lang="scss" scoped></style>
