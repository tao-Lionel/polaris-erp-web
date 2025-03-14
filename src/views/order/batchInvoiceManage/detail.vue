<template>
  <div>
    <basic-container>
      <div>
        <div class="header">
          <div class="header-main">
            <copy-text>
              <span style="font-size: 24px; font-weight: bold">{{ orderDetail.batchOrderCode }}</span>
            </copy-text>
            <el-tag type="primary">{{ orderDetail.orderBusinessType }}</el-tag>
            <el-tag type="primary">{{ orderDetail.deliveryName }}</el-tag>
            <span style="white-space: nowrap">查看详情</span>
          </div>
        </div>
        <!-- 发货批次单信息 -->
        <div class="info-wrapper">
          <detail-wrapper :options="{ title: '发货批次单信息' }">
            <el-row>
              <el-col span="6" class="detail-wrapper-item">
                <span>发货批次单号：</span>
                <span>{{ orderDetail.batchOrderCode }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>ARN/排柜号：</span>
                <span>{{ orderDetail.platformFoOrder }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>发货批次单状态：</span>
                <span>{{ orderDetail.deliveryStatus }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>平台：</span>
                <span>{{ orderDetail.platformCode }}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col span="6" class="detail-wrapper-item">
                <span>站点：</span>
                <span>{{ orderDetail.marketCode }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>店铺：</span>
                <span>{{ orderDetail.shopName }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>交货模式：</span>
                <span>{{ orderDetail.orderBusinessType }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>发货仓库：</span>
                <span>{{ orderDetail.warehouseName }}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col span="6" class="detail-wrapper-item">
                <span>物流渠道：</span>
                <span>{{ orderDetail.logisticsChannelName }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>提货时间：</span>
                <span>{{ orderDetail.platformRequestPickUpTime }}</span>
              </el-col>
            </el-row>

            <div class="info-table table-wrapper">
              <avue-crud :data="infoTableData" :option="infoTableOption" :span-method="spanMethod">
                <template slot="foDetailInfos" slot-scope="scope">
                  <span>{{ scope.row.asin ? scope.row.asin + " / " : "" }} </span>
                  <span>{{ scope.row.sku ? scope.row.sku + " / " : "" }} </span>
                  <span>{{ scope.row.quantity }}</span>
                </template>

                <template slot-scope="scope" slot="operation">
                  <el-button v-if="scope.row.showToggle" type="text" size="small" @click="toggleMoreData(scope.row)">
                    {{ scope.row.isExpanded ? "收起" : "显示更多" }}
                  </el-button>
                </template>
              </avue-crud>
            </div>
          </detail-wrapper>
        </div>
        <!-- 备注信息 -->
        <div>
          <detail-wrapper :options="{ title: '备注信息' }">
            <avue-crud ref="crud" :data="orderRemarkList" :option="remarkOption"> </avue-crud>
          </detail-wrapper>
        </div>

        <!-- 配送信息 -->
        <div>
          <detail-wrapper
            :options="{
              title: '配送信息'
            }"
          >
            <el-row>
              <el-col span="6" class="detail-wrapper-item">
                <span>收件人：</span>
                <span>{{ orderDetail.receiveName }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>电话：</span>
                <span>{{ orderDetail.phone }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>邮箱：</span>
                <span>{{ orderDetail.receiveEmail }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>国家：</span>
                <span>{{ orderDetail.country }}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col span="6" class="detail-wrapper-item">
                <span>省/州：</span>
                <span>{{ orderDetail.stateOrRegion }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>市：</span>
                <span>{{ orderDetail.city }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>区：</span>
                <span>{{ orderDetail.district }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>邮编：</span>
                <span>{{ orderDetail.postalCode }}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col span="6" class="detail-wrapper-item">
                <span>地址：</span>
                <span>{{ orderDetail.address }}</span>
              </el-col>
              <el-col span="6" class="detail-wrapper-item">
                <span>接收仓仓库编码：</span>
                <span>{{ orderDetail.desWarehouse }}</span>
              </el-col>
            </el-row>
          </detail-wrapper>
        </div>

        <!-- 产品信息 -->
        <div>
          <detail-wrapper
            :options="{
              title: '产品信息',
              customContentStyle: {
                padding: '10px'
              }
            }"
          >
            <div class="table-wrapper">
              <div v-for="item in productTableData" :key="item.id">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    margin: 10px 0;
                    cursor: pointer;
                  "
                  @click.stop="toggleProductDetail(item)"
                >
                  <span style="white-space: nowrap">订单号：</span>
                  <copy-text>
                    <span>{{ item.orderCode }}</span>
                    <i v-show="!item.isExpanded" class="el-icon-arrow-right product-animation" />
                    <i v-show="item.isExpanded" class="el-icon-arrow-down product-animation" />
                  </copy-text>
                </div>
                <transition name="fade-slide">
                  <avue-crud
                    v-show="item.isExpanded"
                    :data="item.products"
                    :option="productOption"
                    class="product-table-animation"
                    :summaryMethod="getSummaries"
                  >
                    <!-- 图片 -->
                    <template slot="imageUrl" slot-scope="scope">
                      <div v-if="scope.row.$index !== item.products.length - 1">
                        <img :src="scope.row.imageUrl" alt="暂无图片" />
                      </div>
                    </template>
                    <!-- sku -->
                    <template slot="sku" slot-scope="scope">
                      <div v-if="scope.row.$index === item.products.length - 1">优惠总金额：</div>
                      <div v-else>
                        <el-tag type="success" v-if="scope.row.isBundle" style="margin-bottom: 5px">bundle</el-tag>
                        <span>{{ scope.row.sku }}</span>
                      </div>
                    </template>
                    <!-- 销售单价 -->
                    <template slot="unitSalesPrice" slot-scope="scope">
                      {{ scope.row.unitSalesPrice ? scope.row.unitSalesPrice : "" }}
                      {{
                        scope.row.noneTaxPriceCurrency && scope.row.unitSalesPrice ? scope.row.noneTaxPriceCurrency : ""
                      }}
                    </template>
                    <!-- 实付单价(不含税) -->
                    <template slot="noneTaxPrice" slot-scope="scope">
                      {{ scope.row.noneTaxPrice ? scope.row.noneTaxPrice : "" }}
                      {{
                        scope.row.noneTaxPriceCurrency && scope.row.noneTaxPrice ? scope.row.noneTaxPriceCurrency : ""
                      }}
                    </template>
                    <!-- 税率/税费 -->
                    <template slot="tax" slot-scope="scope">
                      <div v-if="scope.row.$index !== item.products.length - 1">
                        <div v-if="!orderDetail.isBundle">
                          {{ scope.row.taxRate + "/" + scope.row.tax }}
                          {{ scope.row.taxCurrency ? scope.row.taxCurrency : "" }}
                        </div>
                        <div v-else>
                          <span v-for="(item, index) in scope.row.taxShowMuch" :key="index">
                            {{ item.taxRate + " /" }} {{ item.remark }} {{ item.tax }} {{ item.taxCurrency }}
                          </span>
                        </div>
                      </div>
                    </template>
                    <!-- 实付单价(含税) -->
                    <template slot="taxPrice" slot-scope="scope">
                      {{ scope.row.taxPrice ? scope.row.taxPrice : "" }}
                      {{ scope.row.taxPriceCurrency && scope.row.taxPrice ? scope.row.taxPriceCurrency : "" }}
                    </template>
                    <!-- 实付总金额(不含税) -->
                    <template slot="noneTaxAmount" slot-scope="scope">
                      {{ scope.row.noneTaxAmount ? scope.row.noneTaxAmount : "" }}
                      {{
                        scope.row.noneTaxAmountCurrency && scope.row.noneTaxAmount
                          ? scope.row.noneTaxAmountCurrency
                          : ""
                      }}
                    </template>
                    <!-- 实付总金额(含税) -->
                    <template slot="taxAmount" slot-scope="scope">
                      {{ scope.row.taxAmount ? scope.row.taxAmount : "" }}
                      {{ scope.row.taxAmountCurrency && scope.row.taxAmount ? scope.row.taxAmountCurrency : "" }}
                    </template>
                  </avue-crud>
                </transition>
              </div>
            </div>
          </detail-wrapper>
        </div>

        <!-- 操作日志 -->
        <div>
          <detail-wrapper
            :options="{
              title: '操作日志',
              customContentStyle: {
                padding: '10px'
              }
            }"
          >
            <avue-crud ref="opeCrud" :data="logData" :option="logOption"> </avue-crud>
          </detail-wrapper>
        </div>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { getAllBizLog } from "@/api/order/invoiceManage"
import { getDetailsApi } from "@/api/order/batchInvoiceManage"
import { infoTableOption, logOption, remarkOption, productOption, tableField } from "./list.js"

export default {
  name: "BatchInvoiceManageDetail",
  components: {},
  data() {
    return {
      orderDetail: {},
      logData: [],
      logOption,
      productTableData: [],
      orderId: "",
      batchOrderCode: "",
      infoTableData: [],
      infoTableOption,
      remarkOption,
      productOption,
      orderRemarkList: []
    }
  },
  computed: {},
  activated() {
    this.orderId = this.$route.query.id
    this.batchOrderCode = this.$route.query.batchOrderCode
    this.getDetail()
    this.getLog()
  },
  methods: {
    async getLog() {
      const params = {
        bizId: this.orderId,
        className: "OmsFoBatchOrder"
      }
      const { data } = await getAllBizLog(params)
      if (data.code === 0) {
        this.logData = data.data
      }
    },

    async getDetail() {
      const { data } = await getDetailsApi({ batchOrderCode: this.batchOrderCode })
      if (data.code == 0) {
        this.orderDetail = data.data

        this.infoTableData = this.setTableData(data.data?.orderInfoVOList)
        this.productTableData = data.data?.detailList.map((item) => {
          let discountObj = {
            noneTaxAmount: item.discountAmount + " " + item.discountCurrency,
            taxAmount: item.discountAmount + " " + item.discountCurrency
          }
          item.products.push(discountObj)

          return {
            ...item,
            isExpanded: false
          }
        })

        this.orderRemarkList = data.data?.orderRemarkList || []
      }
    },

    // 设置表格数据
    setTableData(data) {
      let arr = []
      let currentIndex = 0 // 添加索引计数器

      data?.forEach((item) => {
        const rowCount = item.pcnodes.length
        const displayCount = rowCount > 2 ? 2 : rowCount // 初始显示的行数

        // 为每个 item 添加一个唯一标识
        const groupId = `group_${currentIndex}`

        // 平台特殊信息
        const { df, diPo, dsvMp } = item.omsOrderCustomerOptionsVO || {}
        // 移除所有特殊列
        this.infoTableOption.column = this.infoTableOption.column.filter((col) => {
          return (
            !tableField.DF.some((dfCol) => dfCol.prop === col.prop) &&
            !tableField.DI_PO.some((diPoCol) => diPoCol.prop === col.prop) &&
            !tableField.DSV_MP.some((dsvCol) => dsvCol.prop === col.prop)
          )
        })
        if (df) {
          this.infoTableOption.column.splice(
            10,
            0,
            ...tableField.DF.map((item) => ({
              ...item,
              sortable: false
            }))
          )
        }
        if (diPo) {
          this.infoTableOption.column.splice(
            10,
            0,
            ...tableField.DI_PO.map((item) => ({
              ...item,
              sortable: false
            }))
          )
        }
        if (dsvMp) {
          this.infoTableOption.column.splice(
            10,
            0,
            ...tableField.DSV_MP.map((item) => ({
              ...item,
              sortable: false
            }))
          )
        }

        item.pcnodes.forEach((detail, detailIndex) => {
          // 当 pcnodes 长度大于 2 时，只显示前两条
          if (rowCount > 2 && detailIndex >= 2) return

          arr.push({
            ...item,
            ...detail,
            ...item.omsOrderCustomerOptionsVO?.df,
            ...item.omsOrderCustomerOptionsVO?.diPo,
            ...item.omsOrderCustomerOptionsVO?.dsvMp,
            groupId, // 添加组标识
            totalTaxAmountAndCurrency: item.totalTaxAmount + " " + item.totalTaxAmountCurrency,
            totalNoneTaxAmountAndCurrency: item.totalNoneTaxAmount + " " + item.totalNoneTaxAmountCurrency,
            showToggle: detailIndex === 0 && rowCount > 2, // 标记是否显示切换按钮
            isExpanded: false, // 标记是否已展开
            _row: detailIndex === 0 ? displayCount : 0, // 需要合并的行数，0代表不展示
            _col: detailIndex === 0 ? 1 : 0 // 需要合并的列数, 0代表不展示
          })
        })
        currentIndex++
      })
      return arr
    },

    // 合并行
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (!["cartonCode", "palletCode", "foDetailInfos", "cusPalletCode", "cusCartonCode"].includes(column.property)) {
        return {
          rowspan: row._row,
          colspan: row._col
        }
      }
    },

    // 切换显示更多/收起
    toggleMoreData(row) {
      const originalData = this.orderDetail.orderInfoVOList.find((item) => item.orderCode === row.orderCode)
      if (!originalData) return

      // 获取同组的所有行的索引范围
      const groupRows = this.infoTableData.reduce((acc, item, index) => {
        if (item.groupId === row.groupId) {
          acc.push(index)
        }
        return acc
      }, [])

      const startIndex = groupRows[0] // 组的起始索引

      if (!row.isExpanded) {
        // 展开：插入剩余的数据
        const insertIndex = startIndex + 2 // 从第三行开始插入
        originalData.pcnodes.slice(2).forEach((detail, detailIndex) => {
          this.infoTableData.splice(insertIndex + detailIndex, 0, {
            ...originalData,
            ...detail,
            groupId: row.groupId,
            showToggle: false,
            isExpanded: false,
            _row: 0,
            _col: 0
          })
        })
        // 更新第一行的合并行数为全部行数
        this.infoTableData[startIndex]._row = originalData.pcnodes.length
      } else {
        // 收起：删除展开的数据
        const removeCount = originalData.pcnodes.length - 2
        this.infoTableData.splice(startIndex + 2, removeCount)
        // 更新第一行的合并行数为默认显示行数（2）
        this.infoTableData[startIndex]._row = 2
      }

      // 更新展开状态
      this.infoTableData[startIndex].isExpanded = !row.isExpanded
    },

    // 切换产品详情
    toggleProductDetail(item) {
      console.log(item)
      this.$set(item, "isExpanded", !item.isExpanded)
    },

    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const amountKey = [
        "expectedQuantity",
        "validQuantity",
        "actualDeliveryNum",
        "unshippedNum",
        "taxAmount",
        "noneTaxAmount",
        "sku",
        "tax",
        "actualReturnQuantity",
        "cancelQuantity",
        "receiveQuantity"
      ]
      const DIAndPoAmountKey = [
        "expectedQuantity",
        "validQuantity",
        "actualDeliveryNum",
        "cancelQuantity",
        "actualReturnQuantity",
        "receiveQuantity"
      ]
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = ""
          return
        }
        if (amountKey.includes(column.property)) {
          if (column.property === "tax") {
            const taxValue = data.map((item) => Number(item[column.property]))
            const taxCurrency = data[0].taxCurrency

            if (!taxValue.every((value) => isNaN(value))) {
              sums[index] =
                taxValue
                  .reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                      return prev + curr
                    } else {
                      return prev
                    }
                  }, 0)
                  .toFixed(2) +
                " " +
                taxCurrency
                  ? taxCurrency
                  : " "
            } else {
              sums[index] = "-/-"
            }
          } else if (column.property === "sku") {
            sums[index] = "总计："
          } else if (
            DIAndPoAmountKey.includes(column.property) &&
            ["DI", "PO"].includes(this.orderDetail.orderBusinessType)
          ) {
            // DI、PO单只合并父元素的值
            let parentRows = data.filter((item) => item?.isParentDetail)
            // 判断[column.property] 有值或者等于0
            const allNonVal = parentRows.every((item) => item[column.property] === 0 || item[column.property])
            if (allNonVal) {
              sums[index] = parentRows.reduce((pre, cur) => {
                return pre + cur[column.property]
              }, 0)
            } else {
              sums[index] = "-/-"
            }
          } else {
            const values = data.map((item) => Number(item[column.property]))
            const currency = data[0].taxAmountCurrency
            if (!values.every((value) => isNaN(value))) {
              sums[index] =
                values
                  .reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                      return prev + curr
                    } else {
                      return prev
                    }
                  }, 0)
                  .toFixed(2) +
                " " +
                currency
            } else {
              sums[index] = "-/-"
            }
          }
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  background: #fff;
  z-index: 666;
  width: calc(100% - 260px);
  left: 230px;
  top: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #efefef;
  padding: 20px;
  box-sizing: border-box;

  .header-main {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.info-wrapper {
  padding: 70px 0 0 0;

  .info-table {
    padding: 10px;
  }
}
.detail-wrapper-item {
  padding: 15px;
}

::v-deep .el-table thead {
  color: #000;
}
::v-deep .el-table th {
  background-color: #f7f8fb;
}

.product-animation {
  transition: transform 0.3s ease;
}

.product-table-animation {
  animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

// 渐入渐出动画
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-enter-to,
.fade-slide-leave {
  opacity: 1;
  transform: translateY(0);
}
</style>
