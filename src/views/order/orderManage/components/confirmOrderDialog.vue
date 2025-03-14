<template>
  <!-- DI PO 的确认订单 -->
  <div>
    <el-dialog title="确认订单" :visible.sync="showDialog" width="90%">
      <div>
        <p class="confirm-tips">
          DI、PO订单，只能一次性确认SKU的最大接单数量、一次性选择SKU映射。
          释放部分占用库存后，子数据才能继续确认订单，父数据不允许多次确认订单。整单释放占用库存后，父数据才能再次确认订单、修改SKU！
        </p>
        <el-table
          :data="confirmTableData"
          :border="true"
          :max-height="500"
          style="width: 100%"
          row-key="detailLineNo"
          :row-class-name="rowClassName"
        >
          <el-table-column prop="detailLineNo" label="明细行行号" width="100"> </el-table-column>
          <el-table-column prop="skuCode" label="SKU" width="140">
            <template slot-scope="scope">
              <div>{{ scope.row.skuCode }}</div>
              <el-button size="small" type="text" @click="changeSku(scope.$index, scope.row)">修改SKU </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="asin" label="平台SKU" width="140"> </el-table-column>
          <el-table-column prop="skuName" label="产品名称"> </el-table-column>
          <el-table-column prop="expectedQuantity" label="数量" width="70"> </el-table-column>
          <el-table-column prop="waitConfirmQuantity" label="可确认数量" width="70"> </el-table-column>
          <el-table-column prop="remainingWaitConfirmQuantity" label="剩余可确认数量" width="70"> </el-table-column>
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
                :disabled="scope.row.parentDisabled"
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
                  :disabled="scope.row.parentDisabled"
                  @change="changeConfirmQuantity($event, scope)"
                ></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="inventory" label="当前SKU仓库库存量" width="120">
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
          <el-table-column prop="allStockQuantity" label="当前SKU所有仓库库存量" width="120">
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
          <el-table-column prop="allSkuStockQuantity" label="所有SKU仓库库存量" width="120"></el-table-column>
          <el-table-column label="操作" fixed="right" width="60">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="!scope.row.parentId"
                :disabled="scope.row.waitConfirmQuantity === 1"
                style="font-size: 20px"
                @click="addDetail(scope)"
              >
                +
              </el-button>
              <el-button type="text" v-else @click="delDetail(scope)">
                <p style="font-weight: bold; color: red; width: 10px; overflow: hidden; margin-left: 1px">——</p>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer">
        <el-button size="small" @click="showDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <batchEditSkuDialog ref="batchEditSkuDialogRef" @editSku="(res, row) => editSku(res, row)"></batchEditSkuDialog>
  </div>
</template>

<script>
import {
  getOrderConfirmOperateInfo,
  getMateSkuList as getMateSkuListApi,
  orderMatchSku,
  orderConfirm,
  getWarehouseInfoBySkuApi
} from "@/api/order/orderManage"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import batchEditSkuDialog from "./batchEditSkuDialog"
import { getTokenUrl } from "@/util/auth"

export default {
  name: "confirmOrderDialog",
  components: { batchEditSkuDialog },
  data() {
    return {
      showDialog: false,
      confirmTableData: [],
      orderCode: null,
      shopId: null,
      deliveryMethod: null,
      orderBusinessType: null
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog({ orderCode, shop, deliveryMethod, orderBusinessType }) {
      this.showDialog = true
      this.confirmTableData = []
      this.orderCode = orderCode
      this.shopId = shop
      this.deliveryMethod = deliveryMethod
      this.orderBusinessType = orderBusinessType
      this.getOrderDetail(orderCode)
    },
    // 获取确认订单详情
    async getOrderDetail(orderCode) {
      const { data } = await getOrderConfirmOperateInfo({ soOrderCode: orderCode })

      if (data.code === 0) {
        data.data.confirmDetails.forEach((item) => {
          item.index = 1 // 用来生成子级的明细行号
          item.confirmQuantity = 0
          item.parentDisabled = false
          item.parentId = 0
          const status = item.warehouseStocks.some((items) => items.warehouseId === item.defaultWarehouseId)
          if (status) {
            item.warehouseId = item.defaultWarehouseId
          }
        })
        this.confirmTableData = data.data.confirmDetails
        this.confirmTableData.forEach((item) => {
          this.setRemaining(item)
        })
        // this.initConfirmTableData = data.data.confirmDetails.map((item) => {
        //   return {
        //     soOrderDetailId: item.soOrderDetailId,
        //     skuCode: item.skuCode,
        //     confirmQuantity: 0,
        //     waitConfirmQuantity: item.waitConfirmQuantity
        //   }
        // })
      }
    },
    // 选择仓库的回调
    getInventory(val, scope) {
      let arr = []
      for (var i = 0; i < this.confirmTableData.length; i++) {
        if (this.confirmTableData[i].skuCode === scope.row.skuCode) {
          arr.push(this.confirmTableData[i])
        }
      }
      if (arr.length > 1) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].warehouseId && arr[j].warehouseId && arr[i].warehouseId === arr[j].warehouseId) {
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
        }
      })
    },
    // 修改可发货量
    changeConfirmQuantity(val, scope) {
      const { row } = scope
      this.changeParentConfirmQuantity(row)
    },
    // 拆分
    addDetail(scope) {
      const { row, $index } = scope
      if (row.maxConfirmQuantity <= 0) {
        this.$message.warning(`SKU：${row.skuCode}，总的可发数量大于或等于数量，不允许继续添加！`)
        return
      }

      // for (var i = 0; i < this.confirmTableData.length; i++) {
      //   if (this.confirmTableData[i].soOrderDetailId === row.soOrderDetailId) {
      //     if (!this.confirmTableData[i].warehouseId || !this.confirmTableData[i].confirmQuantity) {
      //       this.$message.warning(`请先选择第${i + 1}行的发货仓库和填写可发货量！`)
      //       return
      //     }
      //   }
      // }

      // 有了子级，父级的仓库和可发货量不可选
      row.parentDisabled = true
      row.warehouseId = null

      // 复制当前行
      const cloneRow = deepClone(row)

      // 子级的父级id
      cloneRow.parentId = row.detailLineNo

      // 生成子级的明细行行号
      cloneRow.detailLineNo = `${row.detailLineNo}-${row.index}`
      row.index += 1

      cloneRow.inventory = "" // 当前SKU仓库库存量
      cloneRow.confirmQuantity = "" // 可发货量
      cloneRow.warehouseId = "" // 仓库
      // 子级的仓库和可发货量可选
      cloneRow.parentDisabled = false

      // 删除子级的index
      delete cloneRow.index
      delete cloneRow.remainingWaitConfirmQuantity
      delete cloneRow.expectedQuantity
      delete cloneRow.waitConfirmQuantity

      let lastIndex = this.findLastIndex(this.confirmTableData, row.detailLineNo)
      let index = lastIndex !== -1 ? lastIndex : $index

      this.confirmTableData.splice(index + 1, 0, cloneRow)
    },

    findLastIndex(arr, detailLineNo) {
      const length = arr.length
      for (let i = length - 1; i >= 0; i--) {
        let item = arr[i]
        if (item.parentId == detailLineNo) {
          return i
        }
      }
      return -1
    },
    // 删除拆分
    delDetail(scope) {
      const { row, $index } = scope
      // 删除当前行
      this.confirmTableData.splice($index, 1)

      this.changeParentConfirmQuantity(row)

      let index = 0
      this.confirmTableData.forEach((item) => {
        // 重新生成当前父元素下的明细行号
        if (item.parentId === row.parentId) {
          index += 1
          this.$set(item, "detailLineNo", `${item.parentId}-${index}`)
        }
      })

      const childrenItem = this.confirmTableData.find((item) => item.parentId === row.parentId)

      // 清空子级的情况
      if (!childrenItem) {
        const currentParentRow = this.confirmTableData.find((item) => item.detailLineNo === row.parentId)
        this.$set(currentParentRow, "parentDisabled", false)
        this.$set(currentParentRow, "index", 1)
      }
    },
    // 修改父级的可发货量
    changeParentConfirmQuantity(row) {
      let sum = 0
      // 判断是否是子级
      if (row.parentId) {
        const currentParentRow = this.confirmTableData.find((item) => item.detailLineNo === row.parentId)
        // 父数据的可发货量=所有子数据可发货量之和
        this.confirmTableData.forEach((item) => {
          if (item.parentId === row.parentId) {
            sum += item.confirmQuantity
          }
        })
        this.$set(currentParentRow, "confirmQuantity", sum)
        this.setRemaining(currentParentRow)
      } else {
        // 不是子级的情况
        this.setRemaining(row)
      }
    },
    // 计算剩余可确认数量
    setRemaining(row) {
      if ((row.waitConfirmQuantity && row.confirmQuantity) || row.confirmQuantity === 0) {
        // 可确认数量 - 可发货量
        let sum = row.waitConfirmQuantity - row.confirmQuantity
        this.$set(row, "remainingWaitConfirmQuantity", sum)
      }
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
    },

    rowClassName({ row }) {
      if (row.parentId === 0) {
        return "parent-row"
      }
    },

    submit() {
      const status = this.confirmTableData.some((item) => item.warehouseId && item.confirmQuantity)
      if (!status) {
        this.$message.warning(`请至少完成一行的发货仓库和可发数量的填写！`)
        return
      }

      for (let i = 0; i < this.confirmTableData.length; i++) {
        let item = this.confirmTableData[i]
        if (item.confirmQuantity > item.waitConfirmQuantity) {
          this.$message.warning(`
          商品明细号：${item.soOrderDetailId}，
          SKU：${item.skuCode}，
          总的可发数量（${item.confirmQuantity}）大于数量（${item.waitConfirmQuantity}），请修改可发数量！
          `)
          return
        }
      }

      console.log("this.confirmTableData====", this.confirmTableData)

      // 组合数据
      const confirmDetails = this.confirmTableData
        .filter((item) => item.warehouseId)
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

      console.log("params==========", params)

      orderConfirm(params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success("确认订单成功")
            this.$emit("updateList")
            this.showDialog = false
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$message.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .parent-row {
  background-color: rgba(255 249 204 / 36%);
}
</style>
