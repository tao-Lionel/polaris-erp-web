<template>
  <div id="addmeasuremen">
    <basic-container>
      <!--头部以及标题信息信息-->
      <!-- <detail-template :value='1' :options="{
        template:1,
        title:titleName,
        list:[]
        }">
      </detail-template> -->

      <!--商品信息模块-->
      <div>
        <el-form ref="searchFormForm" :model="searchForm" :rules="searchFormRules">
          <!-- <el-form-item prop="spu" label="标准SPU">
            <el-input v-model="searchForm.spu" clearable class="el-input--small"></el-input>
          </el-form-item> -->
          <detail-wrapper :options="{ title: '基础信息' }" style="position: relative">
            <div style="display: flex">
              <el-form-item
                label="SPU或SKU"
                :prop="spuOrSkuRadio === 1 ? 'spu' : 'sku'"
                class="addmeasuremen-form-item"
              >
                <!-- <el-autocomplete
                  size="mini"
                  :popper-append-to-body="false"
                  v-model="searchForm.spu"
                  :trigger-on-focus="false"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入产品编码"
                  @select="handleSelect"
                  v-search-input-trim
                ></el-autocomplete> -->
                <el-button type="text" @click="spuOrSkuStatus = true">点击输入</el-button>
              </el-form-item>
              <el-form-item label="测算规则" prop="ruleId" class="addmeasuremen-form-item">
                <el-select
                  v-model="searchForm.ruleId"
                  size="mini"
                  placeholder="全部"
                  @change="getRuleDetail"
                  filterable
                >
                  <el-option v-for="item in platformRule" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="平台" class="addmeasuremen-form-item">
                <el-input class="el-input--small" size="mini" v-model="searchForm.platformCode" disabled></el-input>
              </el-form-item>
              <el-form-item label="销售站点" class="addmeasuremen-form-item">
                <el-input class="el-input--small" size="mini" v-model="searchForm.salesSiteName" disabled></el-input>
              </el-form-item>
              <el-form-item label="模式" class="addmeasuremen-form-item">
                <el-input class="el-input--small" size="mini" v-model="searchForm.salesModel" disabled></el-input>
              </el-form-item>
              <el-form-item label="测算批次号" class="addmeasuremen-form-item">
                <div style="display: flex">
                  <el-input class="el-input--small" size="mini" v-model="batchId"></el-input>
                  <el-checkbox v-model="batchIdChecked" style="margin-left: 10px">指定</el-checkbox>
                </div>
              </el-form-item>
            </div>
            <div class="matchRule_btn">
              <el-button size="mini" type="primary" @click="submitForm('searchFormForm')">匹配规则</el-button>
            </div>
            <p class="matchRule_tips">*请先填写筛选条件，点击“匹配规则”按钮，再在操作详情填写信息或批量导入数据！</p>
          </detail-wrapper>
        </el-form>
      </div>

      <!--测算操作详情模块-->
      <div class="iod-target-top border-rang" style="position: relative">
        <p class="iod-target target-title">测算操作详情</p>
        <el-button
          class="addmeasuremen_save"
          size="mini"
          type="primary"
          :disabled="!multipleSelection.length && !choiceAllChecked"
          @click="saveData"
          >保存</el-button
        >
        <el-button
          class="addmeasuremen_import"
          size="mini"
          type="primary"
          @click="showImport"
          :disabled="!tableData.length"
          >批量导入</el-button
        >
        <el-button
          class="addmeasuremen_cale"
          size="mini"
          type="primary"
          :disabled="!multipleSelection.length && !choiceAllChecked"
          @click="AllCalculate"
          >批量测算</el-button
        >
        <el-button
          class="addmeasuremen_price"
          size="mini"
          type="primary"
          @click="getNewPrice"
          :disabled="!multipleSelection.length && !choiceAllChecked"
          >获取最新定价</el-button
        >
        <el-button
          class="addmeasuremen_back"
          size="mini"
          type="primary"
          :disabled="!multipleSelection.length && !choiceAllChecked"
          @click="calcBack"
          >批量反算</el-button
        >
        <div class="checked_all" style="padding: 10px 0 10px 20px">
          <el-checkbox
            v-model="choiceAllChecked"
            :disabled="!tableData.length"
            style="font-size: 12px"
            @change="choiceAll"
            >全选</el-checkbox
          >
          <span style="font-size: 13px"
            >已经选中<span style="color: #397fd6">{{ choiceAllData.length }}</span
            >条数据</span
          >
        </div>
        <el-table
          :data="tableData"
          stripe
          ref="table"
          :max-height="tableHeight"
          @cell-click="cellClick"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ textAlign: 'center', color: '#000' }"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column fixed label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spuCode" fixed label="标准SPU" width="120"></el-table-column>
          <el-table-column prop="skuCode" fixed label="工厂SKU" width="120"></el-table-column>
          <el-table-column prop="skuName" fixed label="产品名称" width="120"></el-table-column>
          <el-table-column label="基础信息" header-align="center" width="140">
            <el-table-column prop="platformTypeCode" label="平台" width="120"></el-table-column>
            <el-table-column prop="salesSiteName" label="销售站点" width="120"></el-table-column>
            <el-table-column prop="brandName" label="品牌" width="120"></el-table-column>
            <el-table-column prop="categoryName" label="品类" width="120"></el-table-column>
            <el-table-column prop="specification" label="包装长*宽*高(cm)" width="140"></el-table-column>
            <el-table-column
              prop="specificationsIn"
              v-if="searchForm.platformCode === 'WAYFAIR'"
              label="长(英寸)*宽(英寸)*高(英寸)"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="longestAddPerimeter"
              v-if="searchForm.platformCode === 'WAYFAIR'"
              label="最长边+周长(英寸)"
              width="140"
            ></el-table-column>
            <el-table-column
              prop="volumeIn"
              v-if="searchForm.platformCode === 'WAYFAIR'"
              label="体积(立方英尺)"
              width="140"
            ></el-table-column>
            <el-table-column
              prop="pound"
              v-if="searchForm.platformCode === 'WAYFAIR'"
              label="磅"
              width="60"
            ></el-table-column>
            <el-table-column prop="salesModel" label="模式" width="120"></el-table-column>
            <el-table-column prop="currency" label="币种" width="120"></el-table-column>
            <el-table-column prop="productPosition" label="产品定位" width="120"></el-table-column>
          </el-table-column>
          <el-table-column label="价格相关">
            <el-table-column prop="supplierNo" label="供应商" width="180">
              <template slot-scope="scope">
                <div style="text-align: center" :class="'supplierNo' + scope.$index" v-if="scope.row.isShowInput">
                  <el-select
                    v-model="tableData[scope.$index].supplierNo"
                    size="small"
                    placeholder="全部"
                    @change="setSupplierNo($event, scope.$index)"
                  >
                    <el-option
                      v-for="item in supplierArr"
                      :key="item.supplierNo"
                      :label="item.supplierName"
                      :value="item.supplierNo"
                    >
                    </el-option>
                  </el-select>
                  <el-button
                    style="margin: 10px 0"
                    type="primary"
                    v-if="!scope.$index && tableData.length !== 1"
                    @click="needSet"
                    >批量填充</el-button
                  >
                </div>
                <div v-else style="text-align: center">
                  <div class="noInputContent">{{ supplierName ? supplierName : "请选择" }}</div>
                  <el-button style="margin: 10px 0" type="primary" v-if="!scope.$index && tableData.length !== 1"
                    >批量填充</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="targetPrice" label="目标价格" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'targetPrice' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  v-model="tableData[scope.$index].targetPrice"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent" :class="{ inputActive: scope.row.targetPrice }">
                  {{ scope.row.targetPrice ? scope.row.targetPrice : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="supplyPriceDiscount" label="供货价折扣率" width="120"></el-table-column>
            <el-table-column
              prop="initSellingPrice"
              label="推算售价"
              width="140"
              v-if="searchForm.salesSiteName !== '日本'"
            ></el-table-column>
            <el-table-column prop="sellingPrice" label="标准售价" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'sellingPrice' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  v-model="tableData[scope.$index].sellingPrice"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">
                  {{ scope.row.sellingPrice ? scope.row.sellingPrice : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sellingPriceNoTax" label="不含税标准售价" width="140"></el-table-column>
            <!-- <el-table-column prop="sellingPriceHasTax" label="含税售价" width="140"></el-table-column> -->
            <el-table-column prop="supplyPrice" label="供货价" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'supplyPrice' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  v-model="tableData[scope.$index].supplyPrice"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">{{ scope.row.supplyPrice ? scope.row.supplyPrice : "请输入" }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="ppm" label="PPM" width="120">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'ppm' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  v-model="tableData[scope.$index].ppm"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">{{ scope.row.ppm ? scope.row.ppm : "请输入" }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="vatRate" label="欧洲增值税" width="120"></el-table-column>
          </el-table-column>
          <el-table-column label="财务相关" width="150">
            <el-table-column prop="commission" label="佣金" width="120"></el-table-column>
            <el-table-column prop="commissionRate" label="佣金比" width="120">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'commissionRate' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  :disabled="!tableData[scope.$index].totalCost"
                  v-model="tableData[scope.$index].commissionRate"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">
                  {{ scope.row.commissionRate ? scope.row.commissionRate : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="promotionExpenses" label="推广费" width="120"></el-table-column>
            <el-table-column prop="promotionExpensesRate" label="推广费费比" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'promotionExpensesRate' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  :disabled="!tableData[scope.$index].totalCost"
                  v-model="tableData[scope.$index].promotionExpensesRate"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent" :class="{ inputActive: scope.row.promotionExpensesRate }">
                  {{ scope.row.promotionExpensesRate ? scope.row.promotionExpensesRate : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="coop" label="COOP" width="120"></el-table-column>
            <el-table-column prop="coopRate" label="COOP比" width="120">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'coopRate' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  :disabled="!tableData[scope.$index].totalCost"
                  v-model="tableData[scope.$index].coopRate"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent" :class="{ inputActive: scope.row.coopRate }">
                  {{ scope.row.coopRate ? scope.row.coopRate : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="avs" label="AVS/高级客服费" width="130"></el-table-column>
            <el-table-column prop="avsRate" label="AVS/高级客服费比" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'avsRate' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  :disabled="!tableData[scope.$index].totalCost"
                  v-model="tableData[scope.$index].avsRate"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent" :class="{ inputActive: scope.row.avsRate }">
                  {{ scope.row.avsRate ? scope.row.avsRate : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="freightAllowance" label="运费补贴" width="120"></el-table-column>
            <el-table-column prop="freightAllowanceRate" label="运费补贴比" width="120">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'freightAllowanceRate' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  :disabled="!tableData[scope.$index].totalCost"
                  v-model="tableData[scope.$index].freightAllowanceRate"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent" :class="{ inputActive: scope.row.freightAllowanceRate }">
                  {{ scope.row.freightAllowanceRate ? scope.row.freightAllowanceRate : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="damageCharge" label="货损" width="120"></el-table-column>
            <el-table-column prop="damageChargeRate" label="货损比" width="120">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'damageChargeRate' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  :disabled="!tableData[scope.$index].totalCost"
                  v-model="tableData[scope.$index].damageChargeRate"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent" :class="{ inputActive: scope.row.damageChargeRate }">
                  {{ scope.row.damageChargeRate ? scope.row.damageChargeRate : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="refundFee" label="退款" width="120"></el-table-column>
            <el-table-column prop="refundFeeRate" label="退款比" width="120"></el-table-column>
            <el-table-column prop="managementFee" label="管理费" width="120"></el-table-column>
            <el-table-column prop="managementFeeRate" label="管理费比" width="120">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'managementFeeRate' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  :disabled="!tableData[scope.$index].totalCost"
                  v-model="tableData[scope.$index].managementFeeRate"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent" :class="{ inputActive: scope.row.managementFeeRate }">
                  {{ scope.row.managementFeeRate ? scope.row.managementFeeRate : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="purchasePrice" label="FOB采购价(USD)" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'purchasePrice' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  v-model="tableData[scope.$index].purchasePrice"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">
                  {{ scope.row.purchasePrice ? scope.row.purchasePrice : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="purStandardCoin" label="原币" width="130"></el-table-column> -->
            <el-table-column prop="purchasePriceRate" label="FOB采购价费比" width="130"></el-table-column>
            <el-table-column prop="grossProfit" label="毛利" width="120"></el-table-column>
            <el-table-column prop="grossProfitRate" label="毛利率" width="120">
              <template slot-scope="scope">
                <div style="text-align: center" :class="'grossProfitRate' + scope.$index" v-if="scope.row.isShowInput">
                  <el-input-number
                    class="addmeasuremen_el-input-number"
                    :disabled="!tableData[scope.$index].totalCost"
                    v-model="tableData[scope.$index].grossProfitRate"
                    placeholder="请输入"
                    :precision="4"
                    :controls="false"
                  ></el-input-number>
                  <el-button
                    style="margin: 10px 0"
                    type="primary"
                    v-if="!scope.$index && tableData.length !== 1"
                    @click="needSetGrossProfitRate(scope.row)"
                    >批量填充</el-button
                  >
                </div>

                <div v-else style="text-align: center">
                  <div class="noInputContent">
                    {{ scope.row.grossProfitRate ? scope.row.grossProfitRate : "请输入" }}
                  </div>
                  <el-button style="margin: 10px 0" type="primary" v-if="!scope.$index && tableData.length !== 1"
                    >批量填充</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="运营和物流相关" width="150">
            <el-table-column prop="deliveryCharge" label="尾程配送费" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'deliveryCharge' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  v-model="tableData[scope.$index].deliveryCharge"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">
                  {{ scope.row.deliveryCharge ? scope.row.deliveryCharge : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="floors" label="可叠放层数" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'floors' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  @blur="calcPalletNumber(scope.$index)"
                  v-model="tableData[scope.$index].floors"
                  placeholder="请输入"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">{{ scope.row.floors ? scope.row.floors : "请输入" }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="horizontalNumber" label="每层横放数" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'horizontalNumber' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  @blur="calcPalletNumber(scope.$index)"
                  v-model="tableData[scope.$index].horizontalNumber"
                  placeholder="请输入"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">
                  {{ scope.row.horizontalNumber ? scope.row.horizontalNumber : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="verticalNumber" label="每层竖放数" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'verticalNumber' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  @blur="calcPalletNumber(scope.$index)"
                  v-model="tableData[scope.$index].verticalNumber"
                  placeholder="请输入"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">
                  {{ scope.row.verticalNumber ? scope.row.verticalNumber : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="palletNumber" label="打托数" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'palletNumber' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  v-model="tableData[scope.$index].palletNumber"
                  placeholder="请输入"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">
                  {{ scope.row.palletNumber ? scope.row.palletNumber : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="oceanFreight" label="海运费" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'oceanFreight' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  v-model="tableData[scope.$index].oceanFreight"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">
                  {{ scope.row.oceanFreight ? scope.row.oceanFreight : "请输入" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="qty" label="qty" width="140">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.isShowInput"
                  :class="'qty' + scope.$index"
                  class="addmeasuremen_el-input-number"
                  v-model="tableData[scope.$index].qty"
                  placeholder="请输入"
                  :precision="4"
                  :controls="false"
                ></el-input-number>
                <div v-else class="noInputContent">{{ scope.row.qty ? scope.row.qty : "请输入" }}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="poDeliveryFee" label="PO出库费" width="120"></el-table-column> -->
            <!-- <el-table-column prop="poOrderProcessingFee" label="PO订单单件处理费" width="140"></el-table-column> -->
            <el-table-column prop="tariff" label="关税" width="120"></el-table-column>
            <el-table-column prop="tariffRate" label="关税率" width="120"></el-table-column>
            <el-table-column prop="paymentCommission" label="财务手续费" width="120"></el-table-column>
            <el-table-column prop="paymentCommissionRate" label="财务手续费费比" width="120"></el-table-column>
            <el-table-column prop="balanceProfitRate" label="盈亏平衡费比" width="170"></el-table-column>
            <el-table-column prop="firstLegCost" label="头程费用（含装卸费）" width="170"></el-table-column>
            <el-table-column prop="firstLegCostRate" label="头程费用费比" width="170"></el-table-column>
            <el-table-column prop="storageCharges" label="仓储费" width="120"></el-table-column>
            <el-table-column prop="storageChargesRate" label="仓储费费比" width="120"></el-table-column>
            <el-table-column prop="orderProcessingFee" label="订单处理费" width="120"></el-table-column>
            <el-table-column prop="orderProcessingFeeRate" label="订单处理费费比" width="120"></el-table-column>
            <el-table-column prop="totalCost" label="总成本" width="120"></el-table-column>
            <el-table-column prop="totalCostRate" label="总成本费比" width="120"></el-table-column>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="simpleCalculate(scope.row, scope.$index)">测算</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="text-align: right; margin-top: 10px">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="30"
          layout="total, prev, pager, next"
          :total="totalCount"
        >
        </el-pagination>
      </div>
    </basic-container>

    <!-- 输入SPU或SKU弹窗 -->
    <el-dialog
      title="输入SPU或SKU"
      :visible.sync="spuOrSkuStatus"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="padding: 5px 0 10px">
        <el-radio-group v-model="spuOrSkuRadio" @input="getSpuOrSku">
          <el-radio :label="1">SPU</el-radio>
          <el-radio :label="2">SKU</el-radio>
        </el-radio-group>
      </div>
      <el-input type="textarea" :rows="10" placeholder="多个spu或者sku用换行输入" v-model="spuOrSku"> </el-input>
      <div style="text-align: center; margin-top: 20px">
        <el-button size="small" style="padding: 9px 30px" @click="spuOrSkuCancel">取消</el-button>
        <el-button
          size="small"
          style="padding: 9px 30px"
          :loading="loadingStatus"
          type="primary"
          @click="spuOrSkuConfirm"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <commonImport
      ref="commonImport"
      :downloadUrl="downloadUrl"
      :fileSuffix="fileSuffix"
      :excelStatus="false"
      :excelDangerStatus="excelDangerStatus"
      @import="importExcelBtn"
      @export="exportdangerExcel"
    >
    </commonImport>
  </div>
</template>
<script>
// let addmeasuremen_result = []

import { mapGetters } from "vuex"
// import { getProcessSpu } from "@/api/product/prdlist/prdlist";
import { fetchList as getProcessSpu } from "@/api/ruleConfig/prdCalcRule/prdCalcRule"
import {
  getPrdcalculaterule,
  getPrdCalculateRuleDetail,
  matchRule,
  testGetPrdFinalCalculate,
  calculateHandelImport,
  batchSave,
  exportErrorExcel,
  getSellingPriceBatch
} from "@/api/baseSetup/bseplatformtype"
import { getAll } from "@/api/supplier/posupplier"
import commonImport from "@/views/cockpit/commonImport"
import { downloadBlob } from "@/util/auth"

export default {
  name: "prdlcreate",
  data() {
    return {
      choiceAllData: [],
      choiceAllChecked: false,
      spuOrSkuStatus: false,
      spuOrSkuRadio: 1,
      spuOrSku: "",
      downloadUrl: "product/prdCalculateRecord/downTemplate",
      fileSuffix: ".xlsx",
      titleName: "",
      searchForm: {
        spu: "",
        ruleId: "",
        platformCode: "",
        platformTypeId: "",
        salesSiteName: "",
        salesModel: ""
      },
      searchFormRules: {
        spu: [{ required: true, message: "请输入spu或sku", trigger: "blur" }],
        sku: [{ required: true, message: "请输入spu或sku", trigger: "blur" }],
        ruleId: [{ required: true, message: "请选择测算规则", trigger: "change" }]
      },
      updateForm: {},
      tableData: [],
      platform: [], // 平台
      sitInfo: [], // 销售站点
      platformModel: [], // 模式
      platformRule: [], // 测算规则
      supplierArr: [], // 供应商
      multipleSelection: [],
      needSupplierNo: "",
      requireKey: [
        { title: "supplierNo", name: "供应商" },
        // {title: 'supplyPrice', name: '供货价'},{title: 'sellingPrice',name: '建议售价'},
        { title: "promotionExpensesRate", name: "推广费费比" },
        { title: "purchasePrice", name: "FOB采购价" },
        { title: "floors", name: "可叠放层数", isHidden: true },
        { title: "horizontalNumber", name: "每层横放数", isHidden: true },
        { title: "verticalNumber", name: "每层竖放数", isHidden: true },
        { title: "palletNumber", name: "打托数", isHidden: true }
      ],
      ruleObj: {
        id: "",
        code: ""
      },
      excelDangerStatus: false,
      supplierName: "",
      tableHeight: "",
      newPrice: {
        skuIds: [],
        platform: "",
        salesSite: "",
        salesModel: ""
      },
      reversalFlag: false,
      batchId: "",
      batchIdChecked: false,
      currentPage1: 1,
      AlltableData: [],
      addmeasuremen_result: Object.freeze([]),
      totalCount: 0
    }
  },
  created() {
    const params = {
      size: -1,
      current: -1
    }
    getProcessSpu(params).then((res) => {
      if (res.data.code === 0) {
        this.platformRule = res.data.data.records.filter((item) => item.status === 0)
      }
    })
    getAll().then((res) => {
      if (res.data.code === 0) {
        this.supplierArr = res.data.data
      }
    })
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  mounted() {
    this.tableHeight = document.body.clientHeight - 384
    // this.submitForm('searchFormForm')
  },
  methods: {
    getSpuOrSku(val) {
      if (val === 1) {
        this.searchForm.sku = ""
      } else {
        this.searchForm.spu = ""
      }
    },
    handleCurrentChange(val) {
      this.currentPage1 = val
      this.tableData = Object.freeze(this.AlltableData[--val])
    },
    choiceAll(val) {
      this.choiceAllData = val ? this.addmeasuremen_result : []
      this.multipleSelection = []
      this.$refs.table.clearSelection()
    },
    spuOrSkuCancel() {
      this.$confirm("此操作将清空输入框数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.spuOrSku = ""
          this.searchForm.spu = ""
          this.searchForm.sku = ""
          this.spuOrSkuRadio = 1
          this.spuOrSkuStatus = false
        })
        .catch(() => {})
    },
    spuOrSkuConfirm() {
      if (this.spuOrSkuRadio === 1) {
        this.searchForm.spu = this.spuOrSku.split("\n").join(",").trim()
      } else {
        this.searchForm.sku = this.spuOrSku.split("\n").join(",").trim()
      }
      this.spuOrSkuStatus = false
    },
    calcPalletNumber(index) {
      const calcKey = ["floors", "horizontalNumber", "verticalNumber"]
      const palletNumber = calcKey.reduce((prev, crv) => {
        return prev * parseInt(this.tableData[index][crv] ? this.tableData[index][crv] : 0)
      }, 1)
      this.$set(this.tableData[index], "palletNumber", palletNumber)
    },
    async getRuleDetail(id) {
      const res = await getPrdCalculateRuleDetail({ id })
      if (res.data.code === 0) {
        this.searchForm.platformCode = res.data.data.platformCode
        this.searchForm.salesSiteName = res.data.data.salesSiteName
        this.searchForm.salesModel = res.data.data.salesModel
        this.searchForm.platformTypeId = res.data.data.platformId
        this.searchForm.salesSite = res.data.data.salesSite
        this.searchForm.salesModel = res.data.data.salesModel
        this.ruleObj.id = res.data.data.id
        this.ruleObj.code = res.data.data.code
        this.newPrice.platform = res.data.data.platformId
        this.newPrice.salesSite = res.data.data.salesSite
        this.newPrice.salesModel = res.data.data.salesModel
      } else {
        this.$message.warning(res.data.msg)
      }
    },
    async submitForm(formName) {
      this.choiceAllChecked = false
      this.multipleSelection = []
      this.choiceAllData = []
      this.$refs.table.clearSelection()

      this.tableData = []
      this.addmeasuremen_result = []
      this.AlltableData = []
      this.currentPage1 = 1
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await matchRule(this.searchForm)
          if (res.data.code === 1) {
            this.$message.warning(res.data.msg)
            this.tableData = []
            return
          }

          if (res.data.data && res.data.data.length) {
            // 加上唯一索引
            res.data.data.forEach((item, index) => {
              item.tableIndex = index
              item.ruleId = this.ruleObj.id
              item.ruleCode = this.ruleObj.code
              item.floors = 0
              item.horizontalNumber = 0
              item.verticalNumber = 0
              item.isShowInput = false
            })

            // 优化表格列表渲染问题
            // const length = Math.ceil(res.data.data.length / 10)
            // let min = 0
            // let max = res.data.data.length < 10 ? res.data.data.length : 10
            // let count = 0
            // let that = this
            // function calc() {
            //   for(let i = min; i < max; i++) {
            //     that.tableData.push(res.data.data[i])
            //   }

            //   count++
            //   min += 10
            //   max = res.data.data.length - max > 10 ? max + 10 : res.data.data.length
            //   if (count < length) {
            //     window.requestAnimationFrame(calc)
            //   }
            // }
            // window.requestAnimationFrame(calc)
            this.totalCount = res.data.data.length
            this.addmeasuremen_result = res.data.data
            var result = [],
              chunkSize = 30
            for (var i = 0; i < res.data.data.length; i += chunkSize) {
              result.push(res.data.data.slice(i, i + chunkSize))
            }
            this.AlltableData = result
            this.tableData = this.AlltableData[this.currentPage1 - 1]
          }
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    // querySearch(queryString, cb) {
    //   this.searchForm.spu = queryString;
    //   let params = {};
    //   params.spuCode = queryString;
    //   getProcessSpu(
    //     Object.assign(
    //       {
    //         isHideLoading:true,
    //         current: 1,
    //         size: 10
    //       },
    //       params
    //     )
    //   ).then(response => {
    //     this.restaurants = this.loadSpuAll(response.data.data.records);
    //     let restaurants = this.restaurants;
    //     // let results = queryString
    //     //   ? restaurants.filter(this.createFilter(queryString))
    //     //   : restaurants;
    //     // 调用 callback 返回建议列表的数据
    //     cb(restaurants);
    //   });
    // },
    // createFilter(queryString) {
    //   return state => {
    //     return (
    //       state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    //     );
    //   };
    // },
    // loadSpuAll(records) {
    //   //加载spu信息
    //   let arr = [];
    //   records.forEach(element => {
    //     arr.push({
    //       spu: element,
    //       value: element.spuCode
    //     });
    //   });
    //   return arr;
    // },
    handleSelect(val) {
      getPrdcalculaterule({ spuCode: val.value }).then((res) => {
        this.platformRule = res.data.data
      })
    },
    setSupplierNo(supplierNo, index) {
      if (index) return
      if (this.tableData && !supplierNo) return
      this.needSupplierNo = supplierNo
    },
    needSet() {
      this.addmeasuremen_result.forEach((item) => {
        this.$set(item, "supplierNo", this.needSupplierNo)
      })
      let selectedName = {}
      selectedName = this.supplierArr.find((item) => {
        return item.supplierNo === this.needSupplierNo
      })
      this.supplierName = selectedName.supplierName
    },
    needSetGrossProfitRate(row) {
      this.addmeasuremen_result.forEach((item) => {
        this.$set(item, "grossProfitRate", row.grossProfitRate)
      })
    },
    getNewPrice() {
      this.currentPage1 = 1
      let multipleSelection = this.choiceAllChecked ? this.addmeasuremen_result : this.multipleSelection
      this.newPrice.skuIds = multipleSelection.map((item) => item.skuId)
      getSellingPriceBatch(this.newPrice).then((res) => {
        if (res.data.code === 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            for (let j = 0; j < multipleSelection.length; j++) {
              if (res.data.data[i].skuId === multipleSelection[j].skuId) {
                this.$set(multipleSelection[j], "sellingPrice", res.data.data[i].sellingPrice)
                this.$set(multipleSelection[j], "targetPrice", res.data.data[i].sellingPrice)
                this.$set(multipleSelection[j], "supplyPrice", res.data.data[i].supplyPrice)
                this.$set(multipleSelection[j], "palletNumber", res.data.data[i].palletNumber)

                this.$set(multipleSelection[j], "floors", res.data.data[i].floors)
                this.$set(multipleSelection[j], "horizontalNumber", res.data.data[i].horizontalNumber)
                this.$set(multipleSelection[j], "oceanFreight", res.data.data[i].oceanFreight)
                this.$set(multipleSelection[j], "qty", res.data.data[i].qty)
                this.$set(multipleSelection[j], "verticalNumber", res.data.data[i].verticalNumber)
                this.$set(multipleSelection[j], "purchasePrice", res.data.data[i].purchasePrice)
              }
            }
          }
          console.log(1111, multipleSelection)
          var result = [],
            chunkSize = 30
          for (var i = 0; i < multipleSelection.length; i += chunkSize) {
            result.push(multipleSelection.slice(i, i + chunkSize))
          }
          this.AlltableData = result
          this.tableData = this.AlltableData[this.currentPage1 - 1]
          this.$message.success("获取最新定价成功")
        }
      })
    },
    calcBack() {
      this.reversalFlag = true
      this.AllCalculate()
    },
    simpleCalculate(data, index) {
      this.$set(data, "isShowInput", true)
      data.reversalFlag = false
      if (this.batchIdChecked && this.batchId) {
        data.batchId = this.batchId
      } else {
        data.batchId = ""
      }

      this.$nextTick(() => {
        const resStatus = this.checkCalculate([data])
        if (resStatus) {
          this.toCalculate([data])
        }
      })
    },
    AllCalculate() {
      let multipleSelection = this.choiceAllChecked ? this.addmeasuremen_result : this.multipleSelection
      multipleSelection.forEach((item) => {
        item.reversalFlag = this.reversalFlag
        if (!this.choiceAllChecked) {
          item.isShowInput = true
        }
        if (this.batchIdChecked && this.batchId) {
          item.batchId = this.batchId
        } else {
          item.batchId = ""
        }
      })
      this.$nextTick(() => {
        if (this.reversalFlag) {
          this.toCalculate(multipleSelection)
          return
        }
        const resStatus = this.checkCalculate(multipleSelection)
        if (resStatus) {
          this.toCalculate(multipleSelection)
        }
      })
    },
    checkCalculate(data) {
      // 如果是欧洲国家过滤必填项
      const country = ["US"]
      // 当前页批量测算
      if (country.includes(this.searchForm.salesSiteName)) {
        this.requireKey = this.requireKey.filter((item) => !item.isHidden)
      }
      console.log(this.requireKey)
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < this.requireKey.length; j++) {
          if (data[i][this.requireKey[j].title] === undefined || data[i][this.requireKey[j].title] === null) {
            if (this.choiceAllChecked) {
              this.$message.warning(`全部选中的数据中包含${this.requireKey[j].name}没有填写，请完善数据后在重新测算！`)
              return false
            } else {
              this.$message.warning(`请填写第${data[i].tableIndex + 1}行中${this.requireKey[j].name}的值`)
              // 定位到未填写数据单元格
              const domClassName = this.requireKey[j].title + data[i].tableIndex
              const requireDom = document.getElementsByClassName(domClassName)[0]
              const fatherDom = requireDom.parentNode.parentNode
              const childrenDom = requireDom.firstElementChild.firstElementChild
              const tableDom = document.getElementsByClassName("el-table__body-wrapper")[0]

              const left = fatherDom.offsetLeft - 715
              const top = fatherDom.offsetTop
              tableDom.scrollLeft = left
              tableDom.scrollTop = top
              childrenDom.focus()
              return false
            }
          }
        }
      }
      return true
    },
    async toCalculate(data) {
      this.reversalFlag = false

      const res = await testGetPrdFinalCalculate(data)
      if (res.data.code === 0) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < res.data.data.length; j++) {
            if (data[i].skuCode === res.data.data[j].skuCode) {
              Object.assign(data[i], res.data.data[j])
            }
          }
        }
        this.$message.success("测算成功")
      } else {
        this.$message.warning(res.data.msg)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length) {
        this.choiceAllChecked = false
        this.choiceAllData = []
      }
    },
    async saveData() {
      let multipleSelection = this.choiceAllChecked ? this.addmeasuremen_result : this.multipleSelection
      console.log(multipleSelection)
      for (let i = 0; i < multipleSelection.length; i++) {
        if (multipleSelection[i].totalCost === null) {
          if (this.choiceAllChecked) {
            this.$message.warning(`全部选中的数据中包含没有测算的数据，请测算完之后在点击保存！`)
          } else {
            this.$message.warning(`请先完成第${multipleSelection[i].tableIndex + 1}行数据的测算，在点击保存`)
          }
          return
        }
      }
      const res = await batchSave(multipleSelection)
      if (res.data.code === 0) {
        this.$message.success("保存成功")
      } else {
        this.$message.warning(res.data.msg)
      }
    },
    calculateData(oldData, newData) {
      for (let i = 0; i < oldData.length; i++) {
        for (let j = 0; j < newData.length; j++) {
          if (newData[j].skuCode === oldData[i].skuCode) {
            // this.$set(oldData[i], "floors", newData[j].floors);
            // this.$set(oldData[i], "horizontalNumber", newData[j].horizontalNumber);
            // this.$set(oldData[i], "verticalNumber", newData[j].verticalNumber);
            // this.$set(oldData[i], "palletNumber", newData[j].palletNumber);
            // this.$set(oldData[i], "qty", newData[j].qty);
            // this.$set(oldData[i], "purchasePrice", newData[j].purchasePrice);
            // this.$set(oldData[i], "oceanFreight", newData[j].oceanFreight);
            // this.$set(oldData[i], "targetPrice", newData[j].targetPrice)
            oldData[i].floors = newData[j].floors
            oldData[i].horizontalNumber = newData[j].horizontalNumber
            oldData[i].verticalNumber = newData[j].verticalNumber
            oldData[i].palletNumber = newData[j].palletNumber
            oldData[i].qty = newData[j].qty
            oldData[i].purchasePrice = newData[j].purchasePrice
            oldData[i].oceanFreight = newData[j].oceanFreight
            oldData[i].targetPrice = newData[j].targetPrice
          }
        }
      }
      // console.log(111, oldData )
      // var result = [], chunkSize = 30;
      // for (var i = 0; i < this.addmeasuremen_result.length; i += chunkSize) {
      //   result.push(this.addmeasuremen_result.slice(i, i + chunkSize));
      // }
      // this.AlltableData = Object.freeze(result)
      // this.tableData = this.AlltableData[--this.currentPage1]
    },
    showImport() {
      this.$refs.commonImport.syncFn()
    },
    importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImport.openFullScreen()
      let formdata = new FormData()
      formdata.append("file", file.raw)
      // formdata.append("spuCode", this.searchForm.spu);
      calculateHandelImport(formdata).then(({ data }) => {
        if (data.code == 0) {
          const status = data.data.some((item) => item.errorMsg)
          if (!status) {
            this.calculateData(this.addmeasuremen_result, data.data)
            this.$refs.commonImport.syncFn()
            this.excelDangerStatus = false
            this.$message.success("导入成功")
          } else {
            this.excelDangerStatus = true
            this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
          }
        } else if (data.code == 1) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("导入失败")
        }
        this.$refs.commonImport.closeFullScreen()
      })
    },
    async exportdangerExcel(file) {
      let formdata = new FormData()
      formdata.append("file", file.raw)
      formdata.append("spuCode", this.searchForm.spu)
      formdata.append("skuCode", this.searchForm.sku)
      let res = await exportErrorExcel(formdata)
        .then((res) => {
          downloadBlob(res.data, "异常文件excel.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    cellClick(row, event, column) {
      if (event.label !== "操作" && !row.isShowInput) {
        row.isShowInput = true
        this.$nextTick(() => {
          const elInput = column.getElementsByClassName("el-input__inner")
          if (elInput && elInput.length) {
            elInput[0].focus()
          }
        })
      } else if (event.label !== "操作" && row.isShowInput) {
        const elInput = column.getElementsByClassName("el-input__inner")
        if (elInput && elInput.length) {
          elInput[0].focus()
        }
      }
    }
  },
  components: {
    commonImport
  }
}
</script>

<style lang="scss">
// @import "./prdcreate.scss";
#addmeasuremen {
  .checked_all {
    .el-checkbox__label {
      font-size: 13px;
    }
  }

  .matchRule_tips {
    color: red;
    font-size: 12px;
    text-align: center;
    margin: 5px 0;
    position: absolute;
    top: 10px;
    left: 100px;
  }

  .matchRule_btn {
    text-align: center;
    margin: 5px 0;
    position: absolute;
    top: 4px;
    right: 10px;
  }

  .addmeasuremen-form-item {
    display: flex;
    flex: 1;
    padding: 0 10px;
    border-right: 1px solid #e7ebef;
    // border-bottom: 1px solid #e7ebef;
    margin-bottom: 0;

    .el-form-item__label {
      flex-shrink: 0;
    }

    .el-form-item__content {
      flex: 1;
    }

    .el-select {
      width: 100%;
    }

    .el-autocomplete {
      width: 100%;
    }
  }
}

#addmeasuremen .noInputContent {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c1c1c1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#addmeasuremen .inputActive {
  color: #000;
}

#addmeasuremen .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}

.addmeasuremen_save {
  position: absolute;
  top: 8px;
  right: 25px;
}

.addmeasuremen_import {
  position: absolute;
  top: 8px;
  right: 180px;
}

.addmeasuremen_cale {
  position: absolute;
  top: 8px;
  right: 90px;
}

.addmeasuremen_price {
  position: absolute;
  top: 8px;
  right: 270px;
}

.addmeasuremen_back {
  position: absolute;
  top: 8px;
  right: 385px;
}

.addmeasuremen_el-input-number {
  width: 100%;
}
</style>
