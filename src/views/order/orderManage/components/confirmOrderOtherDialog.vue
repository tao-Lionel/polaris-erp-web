<template>
  <div>
    <el-dialog
      title="确认订单"
      :visible.sync="showDialog"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      id="orderManage-dialog"
    >
      <div>
        <p class="confirm-tips">
          请检查订单发货信息、sku匹配等是否正确，确认订单后将不可变更！确认订单后，请继续操作【生成发货单】！
        </p>
        <el-table :data="confirmTableData" :border="true" :max-height="400" style="width: 100%">
          <el-table-column prop="detailLineNo" label="明细行行号" width="100"> </el-table-column>
          <el-table-column prop="skuCode" label="SKU" width="160">
            <template slot-scope="scope">
              <div>{{ scope.row.skuCode }}</div>
              <el-button size="small" type="text" @click="changeSku(scope.$index, scope.row)">修改SKU </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="asin" label="平台SKU" width="160"> </el-table-column>
          <el-table-column prop="skuName" label="产品名称"> </el-table-column>
          <el-table-column prop="expectedQuantity" label="数量" width="70"> </el-table-column>
          <el-table-column prop="waitConfirmQuantity" label="可确认数量" width="70"> </el-table-column>
          <el-table-column prop="warehouseId" label="发货仓库" width="130">
            <template slot="header">
              <span style="color: red">*</span>
              <span>发货仓库</span>
            </template>
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.warehouseId"
                size="small"
                placeholder="全部"
                @change="getInventory($event, scope)"
              >
                <el-option
                  v-for="item in scope.row.warehouseStocks"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="confirmQuantity" label="可发货量" width="140">
            <template slot="header">
              <span style="color: red">*</span>
              <span>可发货量</span>
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <el-input-number
                  v-model="scope.row.confirmQuantity"
                  :controls="false"
                  :min="0"
                  :max="scope.row.inventory"
                  size="small"
                ></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="inventory" label="当前仓库库存量" width="120">
            <template slot-scope="scope">
              <span
                :style="{
                  color: scope.row.inventory < scope.row.waitConfirmQuantity || scope.row.inventory === 0 ? 'red' : ''
                }"
              >
                {{ scope.row.inventory }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="allStockQuantity" label="所有仓库库存量" width="120">
            <template slot-scope="scope">
              <span
                :style="{
                  color:
                    scope.row.allStockQuantity < scope.row.waitConfirmQuantity || scope.row.allInventory === 0
                      ? 'red'
                      : ''
                }"
              >
                {{ scope.row.allStockQuantity }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="60">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.isInit"
                :disabled="!scope.row.warehouseId || !scope.row.confirmQuantity || scope.row.waitConfirmQuantity === 1"
                style="font-size: 20px"
                @click="addDetail(scope)"
                >+</el-button
              >
              <el-button type="text" v-else @click="delDetail(scope)">
                <p style="font-weight: bold; color: red; width: 10px; overflow: hidden; margin-left: 1px">——</p>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align: center; margin-top: 20px">
        <el-button size="small" style="padding: 9px 30px" @click="confirmCancel">取消</el-button>
        <el-button size="small" style="padding: 9px 30px" type="primary" :loading="loadingStatus" @click="orderConfirm">
          确认
        </el-button>
      </div>
    </el-dialog>

    <batchEditSkuDialog ref="batchEditSkuDialogRef" @editSku="(res, row) => editSku(res, row)"></batchEditSkuDialog>
  </div>
</template>

<script>
import {
  getOrderConfirmOperateInfo,
  orderConfirm,
  getMateSkuList as getMateSkuListApi,
  orderMatchSku,
  getWarehouseInfoBySkuApi
} from "@/api/order/orderManage"
import { deepClone } from "@/components/avue/utils/util"
import batchEditSkuDialog from "./batchEditSkuDialog"
import { getTokenUrl } from "@/util/auth"

export default {
  name: "confirmOrderOtherDialog",
  components: { batchEditSkuDialog },
  data() {
    return {
      showDialog: false,
      confirmTableData: [],
      initConfirmTableData: [],
      orderCode: "",
      shopId: "",
      deliveryMethod: "",
      orderBusinessType: "",
      loadingStatus: false
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog(row) {
      const { orderCode, shop, deliveryMethod, orderBusinessType } = row
      this.orderCode = orderCode
      this.shopId = shop
      this.deliveryMethod = deliveryMethod
      this.orderBusinessType = orderBusinessType
      this.getDetail()
      this.showDialog = true
    },
    getDetail() {
      getOrderConfirmOperateInfo({ soOrderCode: this.orderCode }).then((res) => {
        console.log(1111, res)
        if (res.data.code === 0) {
          res.data.data.confirmDetails.forEach((item) => {
            item.isInit = true
            const status = item.warehouseStocks.some((items) => items.warehouseId === item.defaultWarehouseId)
            console.log("status", status, item)
            if (status) {
              item.warehouseId = item.defaultWarehouseId
              item.inventory = item.warehouseStocks.find(
                (items) => items.warehouseId === item.defaultWarehouseId
              ).availableQuantity
              // ==================================
            }
          })
          this.confirmTableData = res.data.data.confirmDetails
          this.initConfirmTableData = res.data.data.confirmDetails.map((item) => {
            return {
              soOrderDetailId: item.soOrderDetailId,
              skuCode: item.skuCode,
              confirmQuantity: 0,
              waitConfirmQuantity: item.waitConfirmQuantity
            }
          })
        }
      })
    },
    getInventory(val, scope) {
      let arr = []
      for (var i = 0; i < this.confirmTableData.length; i++) {
        if (this.confirmTableData[i].soOrderDetailId === scope.row.soOrderDetailId) {
          arr.push(this.confirmTableData[i])
        }
      }
      if (arr.length > 1) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].warehouseId === arr[j].warehouseId) {
              this.$message.warning(`SKU：${arr[i].skuCode}，不能选择相同的仓库！`)
              scope.row.warehouseId = ""
              return
            }
          }
        }
      }

      scope.row.warehouseStocks.forEach((item) => {
        if (item.warehouseId === val) {
          this.$set(scope.row, "inventory", item.availableQuantity)
          // this.$set(scope.row, 'confirmQuantity', item.availableQuantity)
        }
      })
    },
    addDetail(scope) {
      if (scope.row.maxConfirmQuantity <= 0) {
        this.$message.warning(`SKU：${scope.row.skuCode}，总的可发数量大于或等于数量，不允许继续添加！`)
        return
      }

      for (var i = 0; i < this.confirmTableData.length; i++) {
        if (this.confirmTableData[i].soOrderDetailId === scope.row.soOrderDetailId) {
          if (!this.confirmTableData[i].warehouseId || !this.confirmTableData[i].confirmQuantity) {
            this.$message.warning(`请先选择第${i + 1}行的发货仓库和填写可发货量！`)
            return
          }
        }
      }

      const cloneRow = deepClone(scope.row)
      cloneRow.inventory = ""
      cloneRow.confirmQuantity = ""
      cloneRow.warehouseId = ""
      cloneRow.isInit = false
      this.confirmTableData.splice(scope.$index + 1, 0, cloneRow)
    },
    delDetail(scope) {
      this.confirmTableData.splice(scope.$index, 1)
    },
    confirmCancel() {
      // this.$emit("updateList")
      this.showDialog = false
    },
    orderConfirm() {
      const status = this.confirmTableData.some((item) => item.warehouseId && item.confirmQuantity)
      if (!status) {
        this.$message.warning(`请至少完成一行的发货仓库和可发数量的填写！`)
        return
      }

      let initConfirmTableData = deepClone(this.initConfirmTableData)
      for (let i = 0; i < initConfirmTableData.length; i++) {
        for (let j = 0; j < this.confirmTableData.length; j++) {
          if (initConfirmTableData[i].soOrderDetailId === this.confirmTableData[j].soOrderDetailId) {
            initConfirmTableData[i].confirmQuantity += this.confirmTableData[j].confirmQuantity
          }
        }
      }

      console.log(111119, initConfirmTableData)

      for (let i = 0; i < initConfirmTableData.length; i++) {
        if (initConfirmTableData[i].confirmQuantity > initConfirmTableData[i].waitConfirmQuantity) {
          this.$message.warning(`
          商品明细号：${initConfirmTableData[i].soOrderDetailId}，
          SKU：${initConfirmTableData[i].skuCode}，
          总的可发数量（${initConfirmTableData[i].confirmQuantity}）大于数量（${initConfirmTableData[i].waitConfirmQuantity}），请修改可发数量！
          `)
          return
        }
      }

      const confirmDetails = this.confirmTableData
        .filter((item) => item.confirmQuantity)
        .map((item) => {
          return {
            soOrderDetailId: item.soOrderDetailId,
            skuCode: item.skuCode,
            warehouseId: item.warehouseId,
            confirmQuantity: item.confirmQuantity
          }
        })
      const params = {
        soOrderCode: this.orderCode,
        confirmDetails: confirmDetails
      }

      this.loadingStatus = true
      orderConfirm(params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success("确认订单成功")
            this.loadingStatus = false
            this.confirmCancel()
            this.$emit("updateList")
          } else {
            this.loadingStatus = false
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.confirmCancel()
          this.loadingStatus = false
        })
    },
    // 修改sku
    changeSku(index, row) {
      this.getMoreSkuList(index, row)
    },
    getMoreSkuList(index, row) {
      const page = {
        current: -1,
        size: -1,
        sellerSku: row.asin,
        storeId: this.shopId,
        deliveryMethod: this.deliveryMethod,
        orderBusinessType: this.orderBusinessType
      }
      getMateSkuListApi(page).then((res) => {
        if (res.data.code === 0) {
          let data_res = res.data.data
          let records = data_res.records || []
          console.log("records====", records)
          if (records && !records.length) {
            this.$message.warning("请前往销售SKU关系管理页面进行平台销售SKU配置！")
            return
          }
          if (records && records.length === 1) {
            // if (records[0].stockNum === 0) {
            //   this.$message.warning(`SKU：${records[0].skuCode} 没有库存，无法修改`)
            //   return
            // }

            this.editSku(records[0], row)
            return
          }
          records.forEach((item) => {
            item.imageUrl = item.imageUrl ? getTokenUrl([item.imageUrl]) : ""
          })
          this.$refs.batchEditSkuDialogRef.openDialog(records, row)
        }
      })
    },
    editSku(obj, row) {
      const params = {
        soOrderCode: this.orderCode,
        matchDetails: [
          {
            soOrderDetailId: row.soOrderDetailId,
            skuCode: obj.skuCode,
            isBundle: obj.bundleFlag ? "1" : "0",
            linkSku: obj.linkSku
          }
        ]
      }
      orderMatchSku(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("修改SKU成功")
          this.getWarehouseInfoBySku(row, obj.skuCode)
          this.$set(row, "skuCode", obj.skuCode)
          this.$set(row, "skuName", obj.skuName)
          this.$set(row, "allStockQuantity", obj.stockNum)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },

    // 根据sku获取仓库
    async getWarehouseInfoBySku(row, skuCode) {
      const { data } = await getWarehouseInfoBySkuApi({ skuCode, orderCode: this.orderCode })
      if (data.code === 0) {
        this.$set(row, "warehouseStocks", data.data[skuCode])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-tips {
  padding: 10px;
  color: red;
  background: #efefef;
  font-size: 13px;
}
</style>
