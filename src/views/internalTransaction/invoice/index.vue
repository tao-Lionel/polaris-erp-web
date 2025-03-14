<template>
  <div id="nonTaxContract">
    <div class="down-button">
      <!-- <el-button size="small" type="primary" @click="downWord()">下载</el-button> -->
      <!-- <el-button size="small" type="primary" @click="contractPrint()">打印</el-button> -->
    </div>
    <div class="non-tax-w">
      <div class="contract-common contract-common-padding" id="printPage">
        <p class="titleOne">INVOICE</p>

        <div class="four-all" style="">
          <div class="four-allP">
            <span>Invoice date </span>
            <span style="float: right">09/20/2023</span>
          </div>
          <div class="four-allP">
            <span>Invoice NO</span>
            <span style="float: right">{{ "WCFP-231016-0001" }}</span>
          </div>
          <div class="four-allP">
            <span>Payment terms </span>
            <span style="float: right">{{ "90 NET" }}</span>
          </div>
        </div>

        <div class="two-all" style="margin-top: 100px">
          <table class="table-center" style="border: none">
            <thead>
              <tr class="table-head" style="border: none; background: none">
                <td width="50%" style="text-align: left; font-weight: bold; border: none">Issuer</td>
                <td width="50%" style="text-align: left; font-weight: bold; border: none">To</td>
              </tr>
            </thead>
            <tbody>
              <tr style="border: none">
                <td style="text-align: left; font-weight: bold; border: none">{{ contractData.corporationName }}</td>
                <td style="text-align: left; font-weight: bold; border: none">{{ contractData.supplierName }}</td>
              </tr>
              <tr style="border: none">
                <td style="text-align: left; font-weight: bold; border: none">{{ contractData.corporationAddress }}</td>
                <td style="text-align: left; font-weight: bold; border: none">{{ contractData.postalAddress }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="block">
          <table class="table-center">
            <thead>
              <tr class="table-head">
                <td width="12%">NO</td>
                <td width="12%">PO number</td>
                <td width="10%">SKU</td>
                <td width="12%">Description</td>
                <td width="12%">Unit cost</td>
                <td width="10%">Quantity</td>
                <td width="10%">Total amount</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in goods" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.skuCode }}</td>
                <td>{{ item.skuName }}</td>
                <td>{{ item.purchaseQuantity }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.amount }}</td>
                <td></td>
              </tr>

              <!-- <tr>
                <td></td>
                <td></td>
                <td>TOTAL</td>
                <td>{{contractData.totalQuantity}}</td>
                <td></td>
                <td>${{contractData.totalMoney}}</td>
                <td></td>
                <td></td>
              </tr> -->
            </tbody>
          </table>
        </div>

        <div class="block" v-if="false">
          <table class="table-center">
            <thead>
              <tr class="table-head">
                <td width="12%">采购单号</td>
                <td width="12%">交货日期</td>
                <td width="10%">SKU</td>
                <td width="12%">货物名称</td>
                <td width="12%">型号</td>
                <td width="10%">数量</td>
                <td width="10%">单位</td>
                <td width="12%">不含税单价</td>
                <td width="12%">金额</td>
              </tr>
            </thead>
            <tbody>
              <!-- <tr v-if="goods.length == 0">
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr> -->

              <tr v-for="(item, index) in goods" :key="index">
                <td>{{ item.purchaseOrderNo }}</td>
                <td>{{ item.planDeliveryStr }}</td>
                <td>{{ item.skuCode }}</td>
                <td>{{ item.skuName }}</td>
                <td>{{ item.modelName }}</td>
                <td>{{ item.purchaseQuantity }}</td>
                <td>{{ item.unitName }}</td>
                <td>{{ myFixed(item.price) }}</td>
                <td>{{ myFixed(item.money) }}</td>
              </tr>
              <tr>
                <td colspan="8" class="text-left">合计（大写）: {{ allMoneyCN }}({{ currencyName }})</td>
                <td>{{ currencySymbol }}{{ myFixed(allMoney) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="eight-all" v-if="false">
          <div>A.TERM OF DELIVERY : {{ contractData.termOfDelivery }}</div>
          <div>B.PAYMENT TERMS : {{ contractData.paymentTerms }}</div>
          <div>C.COUNTRY OF ORIGIN: {{ contractData.countryOfOrigin }}</div>
          <div>D.ORDER REQUIREMENT: {{ contractData.purchaseDateStr }}</div>
          <div style="margin-left: 50px">1.{{ contractData.orderRequirement1 }}</div>
          <div style="margin-left: 50px">2.{{ contractData.orderRequirement2 }}</div>
          <div style="margin-left: 50px">3.{{ contractData.orderRequirement3 }}</div>
          <div style="margin-left: 50px">4.{{ contractData.orderRequirement4 }}</div>
          <div>E.{{ contractData.ordinances }}</div>
        </div>

        <div class="three-all" style="margin-top: 50px">
          <!-- <table class="table-center" style="border:none;">
            <thead style="border:none;">
              <tr class="table-head" style="border:none;background:none;">
                <td width="50%" style="text-align:left;font-weight:bold;border:none;padding:5px 10px;">THE BUYER</td>
                <td width="50%" style="text-align:left;font-weight:bold;border:none;padding:5px 10px;">THE SELLER</td>
              </tr>
            </thead>
            <tbody>
              <tr style="border:none;">
                <td style="text-align:left;font-weight:bold;border:none;padding:5px 10px;">{{ contractData.corporationName }}</td>
                <td style="text-align:left;font-weight:bold;border:none;padding:5px 10px;">{{ contractData.supplierName }}</td>
              </tr>
            </tbody>
          </table> -->
          <div style="margin-bottom: 20px; font-size: 18px">Totals</div>
          <div style="width: 400px">
            <div>
              <span>Line items</span>
              <span style="float: right">36,000.00 USD</span>
            </div>
            <div style="margin: 10px 0">
              <span>Miscellaneous charges</span>
              <span style="float: right">0 USD</span>
            </div>
            <div>
              <span>Total invoice amount</span>
              <span style="float: right">36,000.00 USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { showContract } from "@/api/purchase/contract/pocontractTemplate.js"
import { getTokenUrlFile } from "@/util/auth"

export default {
  data() {
    return {
      partyA: "甜秘密创新有限公司",
      contractNo: this.$route.query.paramcontractNo,
      addressA: "",
      signDate: "",
      partyB: "",
      addressB: "",
      goods: [],
      legalA: "",
      legalB: "",
      allMoney: "",
      allMoneyCN: "",
      currencyName: "",
      currencySymbol: "",
      downloadUrl: "",
      settleaccountName: "",
      contractData: {}
    }
  },
  mounted: function () {
    // this.getData()
  },
  methods: {
    getData() {
      showContract(this.contractNo).then((response) => {
        // debugger;
        if (response.data.code == 0) {
          var list = response.data.data
          var contractData = list[0]
          this.contractData = contractData
          //法人主体
          this.partyA = contractData.corporationName
          //法人地址
          this.addressA = contractData.corporationAddress
          //签订日期
          this.signDate = contractData.contractDateStr
          //供应商
          this.partyB = contractData.supplierName
          //供应商地址
          this.addressB = contractData.postalAdress
          //合计金额
          this.allMoney = contractData.allMoney
          //合计大写
          this.allMoneyCN = contractData.allMoneyCN
          //币别名称
          this.currencyName = contractData.currencyName
          //币别符号
          this.currencySymbol = contractData.currencySymbol
          //结算方式
          this.settleaccountName = contractData.settleaccountName
          //遍历详情信息
          this.goods = list[0].list
          console.log(this.goods)
        } else {
          his.$message.error("合同信息获取失败!")
        }
      })
    },
    downWord() {
      this.downloadUrl = getTokenUrlFile("/api/purchase/pocontract/download/" + this.contractNo)
      window.location.href = this.downloadUrl
    },
    contractPrint() {
      this.$print(window.document.getElementById("printPage"))
    },
    myFixed(value) {
      // debugger;
      if (this.isNulls(value)) {
        return
      }
      return (parseFloat(value) + 0.0).toFixed(2)
    },
    /**
     * 检查字符串是否为空
     */
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./index.scss";

#nonTaxContract {
  .titleOne {
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    padding: 40px 0 40px 0;
  }
  .titleTwo {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    padding: 20px 0 50px 0;
  }
  .four-allP {
    text-align: left;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
  }
  .eight-all {
    margin-top: 50px;
    font-size: 16px;
    font-weight: bold;
    div {
      line-height: 30px;
    }
  }

  .down-button {
    margin-left: 30px;
  }

  .non-tax-w {
    width: 75%;
    margin: 20px auto;
    min-width: 210mm;
  }

  @media screen and (max-width: 1440px) {
    .non-tax-w {
      width: 90%;
    }
  }

  .my_no_table {
    table,
    tr,
    td {
      border: 1px solid white;
    }
  }
  .contract-common-padding td {
    padding: 5px 10px;
  }
  .contract-common-padding {
    position: relative;
  }
  .four-all {
    position: absolute;
    left: 20px;
    width: 300px;
  }
}
</style>
