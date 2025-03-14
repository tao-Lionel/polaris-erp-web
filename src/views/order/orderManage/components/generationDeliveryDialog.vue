<template>
  <!-- DI、PO的生成发货批次单 -->
  <el-dialog title="生成发货批次单" :visible.sync="showDialog" width="90%">
    <div>
      <p class="confirm-tips">
        请检查订单发货信息、sku匹配等是否正确，生成发货批次单后将不可变更！若需下发至三方仓可到发货单管理页面操作
      </p>
      <el-table :data="deliveryTableData" :border="true" :max-height="500" style="width: 100%">
        <el-table-column prop="soOrderDetailId" label="商品明细号" width="100"> </el-table-column>
        <el-table-column prop="skuCode" label="SKU" width="160"> </el-table-column>
        <el-table-column prop="asin" label="平台SKU" width="120"> </el-table-column>
        <el-table-column prop="skuName" label="产品名称"> </el-table-column>
        <el-table-column prop="expectedQuantity" label="数量" width="60"> </el-table-column>
        <el-table-column prop="confirmQuantity" label="确认发货量" width="100"> </el-table-column>
        <el-table-column prop="waitSplitQuantity" label="可拆单数量" width="100"> </el-table-column>
        <el-table-column prop="warehouseId" label="发货仓库" width="150">
          <template slot="header">
            <span style="color: red">*</span>
            <span>发货仓库</span>
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.warehouseName" disabled></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="transportCode" label="物流商" width="170" v-if="logisticsModel">
          <template slot="header">
            <span style="color: red">*</span>
            <span>物流商</span>
          </template>
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.transportCode"
              size="small"
              placeholder="全部"
              @change="getLogisticsChannel($event, scope.row)"
            >
              <el-option
                v-for="item in scope.row.bseTransportCarriers"
                :key="item.transportCarrierCode"
                :label="item.carrierName"
                :value="item.transportCarrierCode"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="logisticsChannel" label="物流渠道" width="170" v-if="logisticsModel">
          <template slot="header">
            <span style="color: red">*</span>
            <span>物流渠道</span>
          </template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.logisticsChannel" size="small" placeholder="全部">
              <el-option
                v-for="item in scope.row.bseChannels"
                :key="item.bseChannelCode"
                :label="item.bseChannelName"
                :value="item.bseChannelCode"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column v-if="logisticsModel" prop="extendCode" label="ARN/排柜号" width="170">
          <template slot="header">
            <span style="color: red">*</span>
            <span>ARN/排柜号</span>
          </template>
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.extendCode"></el-input>
          </template>
        </el-table-column>

        <!-- <el-table-column
              prop="validQuantity"
              label="数量">
            </el-table-column>
            <el-table-column
              prop="inventory"
              label="可用库存量"
              width="100">
               <template slot-scope="scope">
                <span 
                :style="{color: scope.row.inventory < scope.row.validQuantity || scope.row.inventory === 0 ? 'red' : ''}">
                {{scope.row.inventory}}</span> 
              </template>
            </el-table-column> -->
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <div style="text-align: center">
              <el-popover
                v-if="scope.row.isInit"
                placement="top"
                width="190"
                ref="popoverRef"
                @hide="deliveryHideSplit"
                trigger="click"
              >
                <div>
                  <div style="display: flex; margin-bottom: 10px">
                    <span>可发货量：</span><span>{{ deliverySplitObj.purchaseCount }}</span>
                  </div>
                  <div style="display: flex; align-items: center">
                    <span>拆分量：</span>
                    <el-input-number
                      controls-position="right"
                      :controls="false"
                      :min="0"
                      :max="deliverySplitObj.purchaseCount - 1"
                      size="small"
                      v-model="deliverySplitObj.splitCount"
                    ></el-input-number>
                  </div>
                  <div style="text-align: center; margin-top: 20px">
                    <el-button
                      size="small"
                      style="padding: 7px 15px"
                      type="primary"
                      :disabled="deliverySplitObj.purchaseCount === 1"
                      @click="deliverysureSplit(scope.$index, scope.row)"
                      >确认
                    </el-button>
                  </div>
                </div>
                <el-button
                  type="text"
                  slot="reference"
                  :disabled="scope.row.validQuantity === 1"
                  @click="toDeliverySplit(scope.row)"
                  >拆分
                </el-button>
              </el-popover>
              <el-button
                type="text"
                style="color: red"
                v-else-if="!scope.row.isInit"
                @click="deliveryRemoveSplit(scope.$index)"
                >取消拆分
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getOrderDeliveryOperateInfo, orderGenerateDelivery } from "@/api/order/orderManage"
import { deepClone } from "@/components/avue/utils/util"

export default {
  name: "generationDeliveryDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      orderCode: null,
      deliveryTableData: [],
      logisticsModel: false,
      deliverySplitObj: {
        purchaseCount: 0,
        splitCount: 0,
        maxSplitCount: 0
      }
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog(orderCode) {
      this.showDialog = true
      this.orderCode = orderCode
      this.getDetail(orderCode)
    },
    getDetail(orderCode) {
      getOrderDeliveryOperateInfo({ soOrderCode: orderCode }).then((res) => {
        if (res.data.code === 0) {
          res.data.data.deliveryDetails.forEach((item) => {
            item.isInit = true
            item.orderSplit = false
            item.isExpectedQuantity = item.waitSplitQuantity
            item.splitCount = 0
          })
          // res.data.data.logisticsCode = 'FEDEX'
          // res.data.data.logisticsChannel = 'FEDEX_HOME_DELIVERY'
          for (let i = 0; i < res.data.data.deliveryDetails.length; i++) {
            for (let j = 0; j < res.data.data.deliveryDetails[i].bseTransportCarriers.length; j++) {
              if (
                res.data.data.deliveryDetails[i].bseTransportCarriers[j].transportCarrierCode ===
                res.data.data.logisticsCode
              ) {
                res.data.data.deliveryDetails[i].transportCode = res.data.data.logisticsCode
                res.data.data.deliveryDetails[i].bseChannels =
                  res.data.data.deliveryDetails[i].bseTransportCarriers[j].bseChannels

                let bseChannels = res.data.data.deliveryDetails[i].bseTransportCarriers[j].bseChannels
                const status = bseChannels.some((item) => item.bseChannelCode === res.data.data.logisticsChannel)
                if (status) {
                  res.data.data.deliveryDetails[i].logisticsChannel = res.data.data.logisticsChannel
                }
              }
            }
          }
          this.deliveryTableData = res.data.data.deliveryDetails
          this.logisticsModel = res.data.data.logisticsModel === "NO_LOGISTICS" ? false : true
        }
      })
    },
    getLogisticsChannel(val, row) {
      this.$set(row, "logisticsChannel", "")
      row.bseTransportCarriers.forEach((item) => {
        if (item.transportCarrierCode === val) {
          row.bseChannels = item.bseChannels
        }
      })
    },
    toDeliverySplit(row) {
      this.deliverySplitObj.purchaseCount = row.waitSplitQuantity
    },
    deliverysureSplit(index, row) {
      if (this.deliverySplitObj.splitCount <= 0) return

      this.deliverySplitObj.purchaseCount = row.waitSplitQuantity - this.deliverySplitObj.splitCount
      row.waitSplitQuantity = this.deliverySplitObj.purchaseCount

      if (row.splitCount) {
        row.splitCount = row.waitSplitQuantity
      }

      const newRow = deepClone(row)
      newRow.isInit = false
      newRow.orderSplit = true
      newRow.waitSplitQuantity = this.deliverySplitObj.splitCount
      newRow.splitCount = 0
      this.deliverySplitObj.splitCount = 0
      this.deliveryTableData[index].orderSplit = true
      this.deliveryTableData.splice(index + 1, 0, newRow)

      if (this.deliverySplitObj.splitCount >= this.deliverySplitObj.purchaseCount) {
        this.deliverySplitObj.splitCount = this.deliverySplitObj.purchaseCount
      }
    },
    deliveryHideSplit() {
      this.deliverySplitObj.splitCount = 0
    },
    deliveryRemoveSplit(index) {
      for (let i = index; i >= 0; i--) {
        if (this.deliveryTableData[i].isInit) {
          this.deliveryTableData[i].waitSplitQuantity += this.deliveryTableData[index].waitSplitQuantity
          if (this.deliveryTableData[i].waitSplitQuantity === this.deliveryTableData[i].isExpectedQuantity) {
            this.deliveryTableData[i].orderSplit = false
          }
          break
        }
      }
      this.deliveryTableData.splice(index, 1)
    },
    submit() {
      const params = {
        soOrderCode: this.orderCode,
        generateDeliverys: []
      }

      let generateDeliverys = this.deliveryTableData.filter((item) => {
        if (this.isOrderBusinessType && this.logisticsModel) {
          return item.transportCode || item.logisticsChannel || item.extendCode
        }
        if (this.logisticsModel) {
          return item.transportCode || item.logisticsChannel
        }
        return item
      })

      for (let i = 0; i < generateDeliverys.length; i++) {
        if (!generateDeliverys[i].transportCode && this.logisticsModel) {
          this.$message.warning(`SKU：${this.deliveryTableData[i].skuCode}的物流商不能为空`)
          return
        }
        if (!generateDeliverys[i].logisticsChannel && this.logisticsModel) {
          this.$message.warning(`SKU：${this.deliveryTableData[i].skuCode}的物流渠道不能为空`)
          return
        }
        if (!generateDeliverys[i].extendCode && this.isOrderBusinessType && this.logisticsModel) {
          this.$message.warning(`SKU：${this.deliveryTableData[i].skuCode}的ARN/排柜号不能为空`)
          return
        }
      }

      params.generateDeliverys = generateDeliverys.map((item) => {
        return {
          warehouseId: item.warehouseId,
          transportCode: item.transportCode,
          extendCode: item.extendCode,
          logisticsChannel: item.logisticsChannel,
          deliveryDetails: [
            { soOrderDetailId: item.soOrderDetailId, skuCode: item.skuCode, deliveryQuantity: item.waitSplitQuantity }
          ]
        }
      })

      if (params.generateDeliverys.length == 0 && this.logisticsModel) {
        this.$message.error("请检查必填字段！")
        return
      }
      console.log("params======", params)

      orderGenerateDelivery(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("生成发货单成功")
        } else {
          this.$message.error(res.data.msg)
        }
      })

      this.$emit("updateList")
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
