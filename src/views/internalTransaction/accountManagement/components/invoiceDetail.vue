<template>
  <div>
    <div class="contract">
      <p class="contract-titleOne f-bold text-center f-24" style="margin-bottom: 10px">{{ vo.saleEnName }}</p>
      <p class="f-bold text-center f-24">{{ vo.saleAddress }}</p>
      <p class="contract-titleTwo f-bold text-center f-24">COMMERCIAL INVOICE</p>

      <div class="contract-head">
        <table>
          <tbody>
            <tr>
              <td class="text-left f-bold">To：</td>
              <td class="text-left f-bold">{{ vo.purchaseEnName }}</td>
              <td class="text-left f-bold">Invoice No.：</td>
              <td class="text-left f-bold">{{ vo.invoiceNo }}</td>
            </tr>
            <tr>
              <td></td>
              <td class="text-left f-bold">{{ vo.purchaseAddress }}</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td class="text-left f-bold">Ship to：</td>
              <td class="text-left f-bold">{{ vo.shipTo }}</td>
              <td class="text-left f-bold">Date:</td>
              <td class="text-left f-bold">{{ vo.invoiceDateStr }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <table class="text-center contract-table-main">
          <thead>
            <tr class="bg-grey">
              <td width="14%" class="f-bold">HS Code</td>
              <td width="14%" class="f-bold">Item No.</td>
              <td width="16%" class="f-bold">Goods Description</td>
              <td width="14%" class="f-bold">Quantity</td>
              <td width="14%" class="f-bold"></td>
              <td width="14%" class="f-bold">Unit Price</td>
              <td width="14%" class="f-bold">Amount</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in vo.detail" :key="index">
              <td>{{ item.hsCode }}</td>
              <td>{{ item.skuCode }}</td>
              <td>{{ item.skuEnName }}</td>
              <td>{{ item.quantity }}</td>
              <td>PCS</td>
              <td>${{ item.unitPrice }}</td>
              <td>${{ item.amount }}</td>
            </tr>

            <tr>
              <td></td>
              <td class="f-bold">TOTAL</td>
              <td></td>
              <td class="f-bold">{{ vo.totalQuantity }}</td>
              <td class="f-bold">PCS</td>
              <td></td>
              <td class="f-bold">${{ vo.totalAmount }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="contract-content f-bold">
        <div>Terms of Delivery: DDP U.S.</div>
        <div>Payment Term: 60 days NET.</div>
        <div>Country of origin: {{ vo.countryOfOrigin }}</div>
        <div>Payment Instruction: {{ vo.originCountry }}</div>
        <div>Bank Name: {{ vo.saleBankName }}</div>
        <div>Bank Account: {{ vo.bankAccount }}</div>
        <div>SWIFT code: {{ vo.swiftCode }}</div>
      </div>

      <div class="contract-head">
        <div class="contract-head-item f-bold f-12">Signed by</div>
        <div style="width: 200px; height: 1px; background-color: black; margin: 5px 0"></div>
        <div class="contract-head-item f-bold f-12">Authorized Signature</div>
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
      contractNo: this.$route.query.contractNo,
      vo: {}
    }
  },
  mounted: function () {
    this.getData()
  },
  methods: {
    async getData() {
      const { data } = await getContract({ contractNo: this.contractNo })
      if (data.code == 0) {
        this.vo = data.data
      }
    },
    myFixed(value) {
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
.contract {
  font-size: 14px;
  padding: 0px 24px 32px 24px;
  background: #ffffff;
  width: 75%;
  margin: 20px auto;
  min-width: 210mm;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  &-titleOne {
    padding: 50px 0 0 0;
  }
  &-titleTwo {
    padding: 20px 0 50px 0;
  }
  &-head {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 50px;

    &-item {
      font-size: 14px;
      line-height: 22px;
      width: 200px;
    }
  }
  &-buy-sell {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    table,
    tr,
    td {
      border: 1px solid black;
    }
    td {
      padding: 5px 10px;
    }
  }
  &-table-main {
    table,
    tr,
    td {
      border: 1px solid black;
    }
    td {
      padding: 5px 10px;
    }
  }
  &-content {
    margin-top: 50px;
    font-size: 16px;
    div {
      line-height: 30px;
    }
  }

  .f-bold {
    font-weight: bold;
  }
  .text-center {
    text-align: center;
  }
  .text-left {
    text-align: left;
  }
  .border-none {
    border: none;
  }
  .border-solid {
    border: 1px solid black;
  }
  .p-5-10 {
    padding: 5px 10px;
  }

  .bg-grey {
    background-color: #fafafa;
  }
  .f-24 {
    font-size: 24px;
  }
  .f-12 {
    font-size: 12px;
  }
}

@media screen and (max-width: 1440px) {
  .contract {
    width: 90%;
  }
}
</style>
