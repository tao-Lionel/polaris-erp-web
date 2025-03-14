<template>
  <div class="profitdetail">
    <basic-container>
      <!--头部以及标题信息信息-->
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: titleName,
          list: []
        }"
      >
      </detail-template>

      <!--商品信息模块-->
      <div>
        <el-form class="demo-form-inline" label-width="70px">
          <detail-wrapper :options="{ title: '基础信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="标准SPU">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.spuCode"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工厂SKU">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.skuCode"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="品类">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.categoryName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品名称">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.skuName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="包装长*宽*高(cm)" label-width="130px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.specification"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="平台">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.platformTypeName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="销售站点">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.sitName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="模式">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.salesModel"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="长(英寸)*宽(英寸)*高(英寸)" label-width="180px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.specificationsIn"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="最长边+周长(英寸)" label-width="140px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.longestAddPerimeter"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="体积(立方英尺)" label-width="120px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.volumeIn"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="磅">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.pound"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="币种">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.currency"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="品牌">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.brandName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品定位">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.productPositioning"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="区域">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.todo"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="创建人">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.createName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.createTime"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="更新人">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.updateName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="更新时间">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.updateTime"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="链接SKU">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.linkSku"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="链接SPU" label-width="120px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.linkSpu"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="ASIN/商品ID" label-width="120px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.asin"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!--价格相关模块-->
      <div>
        <el-form class="demo-form-inline" label-width="70px">
          <detail-wrapper :options="{ title: '价格相关' }">
            <el-row>
              <!-- <el-col :span="6">
                <el-form-item label="供应商">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.supplierName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="目标价格">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.targetPrice"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供货价折扣率" label-width="100px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.supplyPriceDiscount"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供货价">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.supplyPrice"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="PPM">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.ppm"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="标准售价">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.sellingPrice"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="标准不含税售价" label-width="110px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.sellingPriceNoTax"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="欧洲增值税" label-width="100px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.vatRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="盈亏平衡费比" label-width="120px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.balanceProfitRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!--财务相关模块-->
      <div>
        <el-form class="demo-form-inline" label-width="70px">
          <detail-wrapper :options="{ title: '财务相关' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="佣金">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.commission"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="佣金比">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.commissionRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="推广费">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.promotionExpenses"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="推广费费比" label-width="90px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.promotionExpensesRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="coop">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.coop"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="coop比">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.coopRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="AVS/高级客服费" label-width="120px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.avs"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="AVS/高级客服费比" label-width="130px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.avsRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="运费补贴">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.freightAllowance"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="运费补贴比" label-width="90px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.freightAllowanceRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="货损">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.damageCharge"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="货损比">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.damageChargeRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="退款">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.refundFee"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="退款比">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.refundFeeRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="管理费">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.managementFee"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="管理费比">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.managementFeeRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-form-item label="产品成本">
              <el-input
                class="el-input--small"
                v-model="prdDetial.purchasePrice"
                placeholder="暂无数据"
                :disabled="true"
                size="mini"
              ></el-input>
            </el-form-item> -->
            </el-row>
            <el-row>
              <!-- <el-col :span="6">
                <el-form-item label="原币" label-width="90px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.oriPurchasePrice"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="FOB采购价" label-width="90px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.purchasePrice"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="FOB采购价费比" label-width="120px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.purchasePriceRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="净利润">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.grossProfit"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="利润率">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.grossProfitRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="财务手续费费比" label-width="120px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.paymentCommissionRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="财务手续费" label-width="120px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.paymentCommission"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="店铺" label-width="120px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.storeName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="海外仓入库费" label-width="120px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.overseasWarehouseFee"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!--运营和物流相关模块-->
      <div>
        <el-form class="demo-form-inline" label-width="100px">
          <detail-wrapper :options="{ title: '运营和物流相关' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="FBA配送费">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.deliveryCharge"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="海运费">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.oceanFreight"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="头程费用" label-width="140px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.firstLegCost"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="头程费用费比">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.firstLegCostRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="6">
                <el-form-item label="可叠放层数">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.floors"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="每层横放数">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.horizontalNumber"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="每层竖放数" label-width="140px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.verticalNumber"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="打托数">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.palletNumber"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="6">
                <el-form-item label="订单处理费">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.orderProcessingFee"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单处理费占比" label-width="110px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.orderProcessingFeeRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="关税">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.tariff"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="关税率">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.tariffRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="仓储费">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.storageCharges"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="仓储费比">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.storageChargesRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="PO出库费">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.poDeliveryFee"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="PO订单单件处理费" label-width="140px">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.poOrderProcessingFee"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="尾程配送费">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.lastLegCost"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="尾程配送费比">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.lastLegCostRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="总成本">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.totalCost"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总成本费比">
                  <el-input
                    class="el-input--small"
                    v-model="prdDetial.totalCostRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>

              <!-- <el-form-item label="产品成本占比">
              <el-input
                class="el-input--small"
                v-model="prdDetial.purchasePriceRate"
                placeholder="暂无数据"
                :disabled="true"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="装卸费">
              <el-input
                class="el-input--small"
                v-model="prdDetial.a"
                placeholder="暂无数据"
                :disabled="true"
                size="mini"
              ></el-input>
            </el-form-item> -->
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { getPrdCalculateRecord } from "@/api/baseSetup/bseplatformtype"

import { deepClone } from "../../../../util/util"
export default {
  name: "prdlcreate",
  data() {
    return {
      titleName: "查看详情",
      prdDetial: {}
    }
  },
  created() {
    const id = this.$route.params.id
    this.init(id)
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    async init(id) {
      const res = await getPrdCalculateRecord(id)
      this.prdDetial = res.data.data
    }
  },
  components: {}
}
</script>

<style lang="scss">
// @import "./prdcreate.scss";
.profitdetail .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}
</style>
