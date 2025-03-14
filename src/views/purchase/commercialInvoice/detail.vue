<template>
  <div id="nonTaxContract">
    <div class="down-button">
      <!-- <el-button size="small" type="primary" @click="downWord()">下载</el-button> -->
      <!-- <el-button size="small" type="primary" @click="contractPrint()">打印</el-button> -->
    </div>
    <div class="non-tax-w">
      <div class="contract-common contract-common-padding" id="printPage">
        <p class="titleOne">{{ contractData.firstContract.supplierName }}</p>
        <p class="titleTwo">{{ contractData.supplierAddress }}</p>
        <p class="titleThree">COMMERCIAL INVOICE</p>

        <div class="two-all" style="margin-top: 0px">
          <table class="table-center" style="border: none">
            <!-- <thead>
              <tr class="table-head" style="border:none;background:none;">
                <td width="50%" style="text-align:left;font-weight:bold;border:none;">BUYER</td>
                <td width="50%" style="text-align:left;font-weight:bold;border:none;">SUPPLIER</td>
              </tr>
            </thead> -->
            <tbody>
              <tr style="border: none">
                <td style="text-align: left; font-weight: bold; border: none">
                  {{ contractData.firstContract.corporationName }}
                </td>
              </tr>
              <tr style="border: none">
                <td style="text-align: left; font-weight: bold; border: none">
                  {{ contractData.firstContract.corporationAddress }}
                </td>
                <td style="text-align: left; font-weight: bold; border: none">{{ contractData.invoiceTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="block">
          <table class="table-center">
            <thead>
              <tr class="table-head">
                <td width="12%">Item No.</td>
                <td width="12%">INV</td>
                <td width="10%">Goods Description</td>
                <td width="12%">Quantity</td>
                <td width="12%">Unit</td>
                <td width="10%">Unit Price</td>
                <td width="10%">Total Amount（USD）</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in contractData.details" :key="index">
                <td>{{ item.skuCode }}</td>
                <td>{{ item.inv }}</td>
                <td>{{ item.skuName }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ item.unitPrice }}</td>
                <td>{{ item.amount }}</td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td>TOTAL</td>
                <td>{{ contractData.totalQuantity }}</td>
                <td>{{ contractData.details[0].unit }}</td>
                <td></td>
                <td>${{ contractData.totalAmount }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="eight-all">
          <div>TERM OF DELIVERY :{{ contractData.firstContract.termOfDelivery }}</div>
          <div>PAYMENT TERMS : {{ contractData.firstContract.paymentTerms }}</div>
          <div>COUNTRY OF ORIGIN:{{ contractData.firstContract.countryOfOrigin }}</div>
        </div>

        <!-- <div class="three-all" style="margin-top:50px;">
          <table class="table-center" style="border:none;">
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
          </table>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { getInvoiceInfo } from "@/api/purchase/commercialInvoice"
import { getTokenUrlFile } from "@/util/auth"

export default {
  data() {
    return {
      partyA: "甜秘密创新有限公司",
      contractNo: this.$route.query.invoiceNo,
      addressA: "深圳市龙岗区平湖街道华南大道华南国际印刷纸品包装物流区（一期）P11栋126号第一层",
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
      contractData: {
        firstContract: {},
        details: [{ unit: "" }]
      }
    }
  },
  mounted: function () {
    this.getData()
  },
  methods: {
    getData() {
      getInvoiceInfo({ invoiceNo: this.contractNo }).then((response) => {
        // debugger;
        if (response.data.code == 0) {
          this.contractData = response.data.data
        } else {
          this.$message.error("合同信息获取失败!")
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
    padding: 40px 0 0 0;
  }
  .titleTwo {
    font-size: 20px;
    font-weight: normal;
    text-align: center;
    padding: 10px 0 0 0;
  }
  .titleThree {
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    padding: 10px 0 50px 0;
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
      line-height: 24px;
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
    right: 0;
  }
}
</style>
