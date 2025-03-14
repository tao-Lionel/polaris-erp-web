<template>
  <div class="execution" id="bsecurrency">
    <basic-container>
      <!-- 工单信息 -->
      <div class="orderManageDetail-step jbNav">
        <el-form label-width="70px" class="demo-form-inline">
          <detail-wrapper :options="{ title: '工单信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="工单编号">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    size="mini"
                    v-model="detailData.omsAfterSaleMainMsgVo.workOrderCode"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工单类型">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    size="mini"
                    v-model="detailData.omsAfterSaleMainMsgVo.workOrderTypeName"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工单状态">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    v-model="detailData.omsAfterSaleMainMsgVo.workOrderStatusName"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="售后原因">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    v-model="detailData.omsAfterSaleMainMsgVo.reasonMsg"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="投诉原文" label-width="85px">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    v-model="detailData.omsAfterSaleMainMsgVo.complainOriginalText"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="要点提取" label-width="100px">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    v-model="detailData.omsAfterSaleMainMsgVo.keyPointsExtractionText"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 备注信息 -->
      <div style="position: relative" class="bzNav">
        <el-form label-width="70px" class="demo-form-inline">
          <detail-wrapper :options="{ title: '备注信息' }">
            <avue-crud ref="crud" :data="detailData.remarkList" :option="remarkOption"> </avue-crud>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 原订单信息 -->
      <div class="orderManageDetail-step jbNav">
        <el-form label-width="70px" class="demo-form-inline">
          <detail-wrapper :options="{ title: '原订单信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="平台订单号" label-width="100px">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    v-model="detailData.omsAfterSaleMainMsgVo.sourceCode"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单号">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    v-model="detailData.omsAfterSaleMainMsgVo.soOrderCode"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="店铺">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    size="mini"
                    v-model="detailData.omsAfterSaleMainMsgVo.shopAccount"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="交货模式">
                  <el-select
                    v-model="detailData.omsAfterSaleMainMsgVo.soOrderBusinessType"
                    size="small"
                    placeholder="请选择"
                    clearable
                    disabled
                  >
                    <el-option v-for="item in businessType" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <avue-crud ref="crud" :data="detailData.omsAfterSaleMainDetailMsgVos" :option="originOrderOption">
            </avue-crud>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 产品信息 -->
      <div style="position: relative" class="cpNav">
        <detail-wrapper :options="{ title: '订单信息' }">
          <template #custom>
            <el-button size="small" type="primary" v-if="detailData.soOrderIdNew" @click="handleJump"
              >跳转新订单</el-button
            >
          </template>

          <el-table
            :data="detailData.productList"
            stripe
            show-summary
            border
            max-height="600"
            class="cancelFixedTop"
            style="width: 100%"
          >
            <el-table-column prop="detailLineNo" label="明细行行号" width="100"> </el-table-column>
            <el-table-column prop="imageUrl" label="图片" width="80">
              <template slot-scope="scope">
                <img
                  style="width: 60px"
                  v-if="scope.$index !== detailData.productList.length - 1"
                  :src="scope.row.imageUrl"
                  alt="暂无图片"
                />
              </template>
            </el-table-column>
            <el-table-column width="140" prop="asin  " label="平台SKU">
              <template slot-scope="scope">
                <p>{{ scope.row.asin }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="skuName" label="品名" width="180"> </el-table-column>
            <el-table-column prop="sku" label="SKU" width="220">
              <template slot-scope="scope">
                <div v-if="scope.$index === detailData.productList.length - 1">优惠总金额：</div>
                <div v-else>
                  <el-tag type="success" v-if="scope.row.isBundle" style="margin-bottom: 5px">bundle</el-tag>
                  <el-input readonly="" size="small" v-model="scope.row.sku" placeholder="暂无数据"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="expectedQuantity" label="数量" width="70"> </el-table-column>
            <el-table-column prop="validQuantity" width="100" label="确认发货量"> </el-table-column>
            <el-table-column prop="actualDeliveryNum" label="已发货量"> </el-table-column>
            <el-table-column prop="cancelQuantity" label="取消数量"> </el-table-column>
            <el-table-column prop="unitSalesPrice" width="120" label="销售单价">
              <template slot-scope="scope">
                {{ scope.row.unitSalesPrice }}{{ scope.row.noneTaxPrice ? "/" : " "
                }}{{ scope.row.noneTaxPriceCurrency }}
              </template>
            </el-table-column>
            <el-table-column prop="noneTaxPrice" width="120" label="实付单价(不含税)">
              <template slot-scope="scope">
                {{ scope.row.noneTaxPrice }}{{ scope.row.noneTaxPrice ? "/" : " " }}{{ scope.row.noneTaxPriceCurrency }}
              </template>
            </el-table-column>
            <el-table-column prop="tax" width="120" label="税率/税费"> </el-table-column>
            <el-table-column prop="taxPrice" width="120" label="实付单价(含税)">
              <template slot-scope="scope">
                {{ scope.row.taxPrice }}
                {{ scope.row.taxPrice ? "/" : " " }}
                {{ scope.row.taxPriceCurrency }}
              </template>
            </el-table-column>
            <el-table-column prop="noneTaxAmount" width="130" label="实付总金额(不含税)">
              <template slot-scope="scope">
                {{ scope.row.noneTaxAmount }}
                {{ scope.$index !== detailData.productList.length - 1 ? "/" : " " }}
                {{ scope.row.noneTaxAmountCurrency }}
              </template>
            </el-table-column>
            <el-table-column prop="taxAmount" width="120" label="实付总金额(含税)">
              <template slot-scope="scope">
                {{ scope.row.taxAmount }}
                {{ scope.$index !== detailData.productList.length - 1 ? "/" : " " }}
                {{ scope.row.taxAmountCurrency }}
              </template>
            </el-table-column>
            <el-table-column prop="postponeRemark" label="延期要求"> </el-table-column>
          </el-table>
        </detail-wrapper>
      </div>

      <!-- 退款信息 -->
      <div class="orderManageDetail-step jbNav">
        <el-form label-width="70px" class="demo-form-inline">
          <detail-wrapper :options="{ title: '退款信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="总退款金额" label-width="90px">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    size="mini"
                    v-model="omsAfterSaleMainRefundMsgVos.totalRefundAmount"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="收款人姓名" label-width="90px">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    size="mini"
                    v-model="omsAfterSaleMainRefundMsgVos.receiverName"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="收款账号">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    size="mini"
                    v-model="omsAfterSaleMainRefundMsgVos.receiverAccount"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="收款方式">
                  <el-input
                    class="el-input--small"
                    placeholder="暂无数据"
                    readonly
                    size="mini"
                    v-model="omsAfterSaleMainRefundMsgVos.refundMethodName"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 产品信息 -->
      <div style="position: relative" class="cpNav">
        <detail-wrapper :options="{ title: '退货信息' }">
          <el-table
            :data="detailData.omsAfterSaleMainReturnMsgVos"
            stripe
            border
            max-height="600"
            class="cancelFixedTop"
            style="width: 100%"
          >
            <el-table-column prop="returnCode" label="退货单号" width="160"> </el-table-column>
            <el-table-column prop="sku" label="SKU" width="180"> </el-table-column>
            <el-table-column width="240" prop="skuName" label="产品名称"> </el-table-column>
            <el-table-column prop="categoryName" label="品类" width="180"> </el-table-column>
            <el-table-column prop="brandName" label="品牌" width="220"> </el-table-column>
            <el-table-column prop="soOrderDetailQuantity" label="下单数量" width="120"> </el-table-column>
            <el-table-column prop="actualDeliveryNum" width="120" label="已发货数量"> </el-table-column>
            <el-table-column prop="returnQuantity" label="申请退货数量" width="130"> </el-table-column>
            <el-table-column prop="logisticsNo" label="退货物流单号" width="230"> </el-table-column>
            <el-table-column prop="actualReturnNum" label="实际退货数量" width="130"> </el-table-column>
            <el-table-column prop="warehouseName" width="200" label="退货仓库"> </el-table-column>
            <el-table-column prop="returnInBoundNo" width="200" label="退货入库单号"> </el-table-column>
          </el-table>
        </detail-wrapper>
      </div>

      <!-- 操作日志 -->
      <div class="orderManageDetail-step jbNav">
        <el-form label-width="70px" class="demo-form-inline">
          <detail-wrapper :options="{ title: '操作日志' }">
            <avue-crud ref="crud" :data="operationLog" :option="operationLogOption"> </avue-crud>
          </detail-wrapper>
        </el-form>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { remarkOption, originOrderOption, operationLogOption } from "./index"
import { getAllBizLog } from "@/api/baseSetup/bseoperatelog/prdoperatelog"
import { getDetail, getObjByType } from "@/api/order/afterOrderManage"
export default {
  name: "afterOrderDetail",

  components: {},
  data() {
    return {
      orderDetail: {},
      remarkOption: remarkOption,
      originOrderOption: originOrderOption,
      operationLogOption: operationLogOption,
      detailData: {
        omsAfterSaleMainMsgVo: {
          workOrderCode: ""
        }
      },
      operationLog: [],
      omsAfterSaleMainRefundMsgVos: {}, // 退款信息
      businessType: []
    }
  },
  mounted() {
    this.getDetail(this.$route.query.id)
    this.getObjByType()
  },
  methods: {
    async getDetail(id) {
      if (!id) return
      const { data } = await getDetail({
        workOrderCode: id
      })
      if (data.code !== 0) return
      this.detailData = data.data
      console.log(this.detailData)
      console.log(this.detailData.omsAfterSaleMainRefundMsgVos[0])
      this.omsAfterSaleMainRefundMsgVos = this.detailData.omsAfterSaleMainRefundMsgVos[0] || {
        totalRefundAmount: "",
        refundMethod: "",
        receiverName: "",
        receiverAccount: ""
      }
      this.detailData.productList = this.dealProductList(this.detailData)
      this.getOPLog()
    },
    dealProductList(data) {
      const dealData = JSON.parse(JSON.stringify(data))
      const resData = [
        {
          sku: "",
          noneTaxAmount: `${dealData.discountAmount}/${dealData.discountCurrency}`,
          taxAmount: `${dealData.discountAmount}/${dealData.discountCurrency}`
        }
      ]
      return [...dealData.productList, ...resData]
    },
    async getOPLog() {
      const { data } = await getAllBizLog({
        bizId: this.detailData.omsWorkOrderId,
        className: "OmsAfterSaleWorkOrder"
      })
      console.log(data)
      this.operationLog = data.data
    },
    handleJump() {
      this.$router.push({
        path: "/order/orderManages/detail",
        query: { id: this.detailData.soOrderIdNew }
      })
    },
    getObjByType() {
      getObjByType("order_business_type").then((res) => {
        if (res.data.code === 0) {
          this.businessType = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flex4 {
  display: flex;
  flex-wrap: wrap;
  .f4-item {
    width: 25%;
  }
}
.flex5 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.el-input--small {
  .el-input__inner {
    cursor: not-allowed !important;
  }
}
</style>
