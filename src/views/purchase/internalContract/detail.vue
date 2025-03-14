<template>
  <div id="nonTaxContract">
    <div class="down-button">
      <!-- <el-button size="small" type="primary" @click="downWord()">下载</el-button> -->
      <!-- <el-button size="small" type="primary" @click="contractPrint()">打印</el-button> -->
    </div>
    <div class="non-tax-w">
      <div class="contract-common contract-common-padding" id="printPage">
        <p class="titleOne">{{ contractData.inOrgName }}</p>
        <p class="titleTwo">PURCHASE ORDER</p>

        <div class="four-all" style="width: 200px">
          <div class="four-allP">DATE. {{ contractData.contractDateStr }}</div>
          <div class="four-allP">PO NO. {{ contractData.poNo }}</div>
          <div class="four-allP">Amazon PO NO.</div>
          <!-- <div class="four-allP">NO. {{ contractData.contractNo }}</div> -->
        </div>

        <div class="two-all" style="margin-top: 150px">
          <table class="table-center" style="border: none">
            <thead>
              <tr class="table-head" style="border: none; background: none">
                <td width="50%" style="text-align: left; font-weight: bold; border: none">BUYER</td>
                <td width="50%" style="text-align: left; font-weight: bold; border: none">SUPPLIER</td>
              </tr>
            </thead>
            <tbody>
              <tr style="border: none">
                <td style="text-align: left; font-weight: bold; border: none">{{ contractData.inOrgName }}</td>
                <td style="text-align: left; font-weight: bold; border: none">{{ contractData.outOrgName }}</td>
              </tr>
              <tr style="border: none">
                <td style="text-align: left; font-weight: bold; border: none">{{ contractData.inOrgAddress }}</td>
                <td style="text-align: left; font-weight: bold; border: none">{{ contractData.outOrgAddress }}</td>
              </tr>
              <tr style="border: none">
                <td style="text-align: left; font-weight: bold; border: none">
                  Contact: {{ contractData.buyerContact }}
                </td>
                <td style="text-align: left; font-weight: bold; border: none">
                  Contact: {{ contractData.supplierContact }}
                </td>
              </tr>
              <tr style="border: none">
                <td style="text-align: left; font-weight: bold; border: none">Email: {{ contractData.buyerEmail }}</td>
                <td style="text-align: left; font-weight: bold; border: none">
                  Email: {{ contractData.supplierEmail }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="block">
          <table class="table-center">
            <thead>
              <tr class="table-head">
                <td width="12%">NO</td>
                <td width="12%">ITEM NO</td>
                <td width="10%">DESCRIPTION</td>
                <td width="10%">SPECIFICATIONS</td>
                <td width="12%">QTY (PCS)</td>
                <td width="12%">UNIT PRICE Including Tax (USD)</td>
                <td width="10%">AMOUNT Including Tax(USD)</td>
                <!-- <td width="10%">CARGO READ DATE</td>
                <td width="10%">REMARK</td> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in contractData.list" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.skuCode }}</td>
                <td>{{ item.skuName }}</td>
                <td>{{ item.spec }}</td>
                <td>{{ item.purchaseQuantity }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.amount }}</td>
                <!-- <td>{{}}</td>
                <td>{{}}</td> -->
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td>TOTAL</td>
                <td></td>
                <td>{{ contractData.totalQuantity }}</td>
                <td></td>
                <td>${{ contractData.totalMoney }}</td>
                <!-- <td></td>
                <td></td> -->
              </tr>
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

        <div class="eight-all">
          <div>A.TERM OF DELIVERY : {{ contractData.termOfDelivery }}</div>
          <div>B.PAYMENT TERMS : {{ contractData.paymentTerms }}</div>
          <div>C.COUNTRY OF ORIGIN: {{ contractData.countryOfOrigin }}</div>
          <div>D.ORDER REQUIREMENT: {{ contractData.purchaseDateStr }}</div>
          <div v-for="item in contractData.ors" :key="item.index" style="margin-left: 50px">
            {{ item.index + 1 }}.{{ item.content }}
          </div>
        </div>

        <div class="three-all" style="margin-top: 50px">
          <table class="table-center" style="border: none">
            <thead style="border: none">
              <tr class="table-head" style="border: none; background: none">
                <td width="50%" style="text-align: left; font-weight: bold; border: none; padding: 5px 10px">
                  THE BUYER
                </td>
                <td width="50%" style="text-align: left; font-weight: bold; border: none; padding: 5px 10px">
                  THE SELLER
                </td>
              </tr>
            </thead>
            <tbody>
              <tr style="border: none">
                <td style="text-align: left; font-weight: bold; border: none; padding: 5px 10px">
                  {{ contractData.inOrgName }}
                </td>
                <td style="text-align: left; font-weight: bold; border: none; padding: 5px 10px">
                  {{ contractData.outOrgName }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getContract } from "@/api/purchase/internalContract/contract"
import { getTokenUrlFile } from "@/util/auth"

export default {
  data() {
    return {
      partyA: "",
      contractNo: this.$route.query.contractNo,
      contractData: {}
    }
  },
  mounted: function () {
    this.getData()
  },
  methods: {
    getData() {
      getContract({ contractNo: this.contractNo }).then((response) => {
        // debugger;
        if (response.data.code == 0) {
          this.contractData = response.data.data
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
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    padding: 50px 0 0 0;
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
    right: 0;
  }
}
</style>
