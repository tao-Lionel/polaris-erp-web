<template>
  <div>
    <div class="contract">
      <p class="contract-titleOne f-bold text-center">{{ vo.purchaseEnName }}</p>
      <p class="contract-titleTwo f-bold text-center">PURCHASE ORDER</p>

      <div class="contract-head">
        <div class="contract-head-item f-bold">DATE. {{ vo.invoiceDate }}</div>
        <div class="contract-head-item f-bold">PO NO. {{ vo.settlementNo }}</div>
        <div class="contract-head-item f-bold">Amazon PO NO.</div>
        <div class="contract-head-item f-bold">Contact email address</div>
      </div>

      <div class="contract-buy-sell">
        <table class="text-center" style="width: 45%">
          <thead>
            <tr class="bg-grey">
              <td class="text-left f-bold">BUYER</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left f-bold">{{ vo.purchaseEnName }}</td>
            </tr>
            <tr>
              <td class="text-left f-bold">{{ vo.purchaseAddress }}</td>
            </tr>
          </tbody>
        </table>

        <table class="text-center" style="width: 45%">
          <thead>
            <tr class="bg-grey">
              <td class="text-left f-bold">SUPPLIER</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left f-bold">{{ vo.saleEnName }}</td>
            </tr>
            <tr>
              <td class="text-left f-bold">{{ vo.saleAddress }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <table class="text-center contract-table-main">
          <thead>
            <tr class="bg-grey">
              <td width="12%" class="f-bold">NO</td>
              <td width="12%" class="f-bold">ITEM NO</td>
              <td width="10%" class="f-bold">DESCRIPTION</td>
              <td width="12%" class="f-bold">QTY (PCS)</td>
              <td width="10%" class="f-bold">UNIT PRICE (USD)</td>
              <td width="12%" class="f-bold">AMOUNT (USD)</td>
              <td width="10%" class="f-bold">CARGO READ DATE</td>
              <td width="10%" class="f-bold">REMARK</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in vo.detail" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.skuCode }}</td>
              <td>{{ item.skuEnName }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.unitPrice }}</td>
              <td>{{ item.price }}</td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td></td>
              <td></td>
              <td class="f-bold">TOTAL</td>
              <td class="f-bold">{{ vo.totalQuantity }}</td>
              <td></td>
              <td class="f-bold">${{ vo.totalAmount }}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="contract-content">
        <div class="f-bold">A.TERM OF DELIVERY: DDP U.S.</div>
        <div class="f-bold">B.PAYMENT TERMS: 60 days NET.</div>
        <div class="f-bold">C.COUNTRY OF ORIGIN: INDONESIA</div>
        <div>
          <div class="f-bold">D.ORDER REQUIREMENT:</div>
          <div style="margin-left: 20px">
            1.Quality standard: according to the Purchase Order and production sheet standard signed by both parties;<br />
            2.In case of any dispute over acceptance, both parties agree to send the disputed goods to a qualified
            quality inspection agency to inspect the products according to the inspection standards and methods agreed
            by both parties. If the inspection results meet the quality standards agreed by both parties, the buyer
            shall bear the inspection and related expenses, otherwise, the seller shall bear them.
          </div>
        </div>
        <div>
          <span class="f-bold">E.</span>
          The purchase order will come into effect as of the date of signature or seal by both parties. During the
          validity period of the purchase order, changes to the terms of the purchase order shall be agreed by both
          parties by signature or seal.
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 50px">
        <div style="width: 45%">
          <div class="text-left f-bold p-5-10 bg-grey border-solid">THE BUYER</div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div style="height: 1px; background: black"></div>
          <div class="text-center f-bold border-none p-5-10">Sweet Night Technology Inc.</div>
        </div>
        <div style="width: 45%">
          <div class="text-left f-bold p-5-10 bg-grey border-solid">THE SELLER</div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div style="height: 1px; background: black"></div>
          <div class="text-center f-bold border-none p-5-10">SWEET NIGHT (HONGKONG) TECHNOLOGY COMPANY LIMITED</div>
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
    font-size: 24px;
    padding: 50px 0 0 0;
  }
  &-titleTwo {
    font-size: 24px;
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
    background-color: #bfbfbf;
  }
}

@media screen and (max-width: 1440px) {
  .contract {
    width: 90%;
  }
}
</style>
