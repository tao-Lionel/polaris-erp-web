<template>
  <div id="nonTaxContract">
    <div class="down-button">
      <!-- <el-button size="small" type="primary" @click="downWord()">下载</el-button> -->
      <!-- <el-button size="small" type="primary" @click="contractPrint()">打印</el-button> -->
    </div>
    <div class="non-tax-w">
      <div class="contract-common contract-common-padding" id="printPage">
        <p class="titleOne">{{ contractData.supplierName }}</p>
        <p class="titleTwo">{{ contractData.statementTimeStr }}</p>

        <div class="two-all" style="margin-top: 30px">
          <table class="table-center" style="border: none">
            <tbody>
              <tr class="table-head" style="border: none; background: none">
                <td width="50%" style="text-align: left; font-weight: bold; border: none">
                  客户名称：{{ contractData.firstContract.corporationName }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="block">
          <table class="table-center">
            <thead>
              <tr class="table-head">
                <td width="5%">项号</td>
                <td width="10%">采购单号</td>
                <td width="10%">采购发票号</td>
                <td width="10%">柜号</td>
                <td width="10%">商品编号</td>
                <td width="10%">产品名称</td>
                <td width="10%">产品长宽高（cm）</td>
                <td width="8%">数量</td>
                <td width="10%">单位</td>
                <td width="10%">单价</td>
                <td width="10%">总价（USD）</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in contractData.details" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.purchaseOrderNo }}</td>
                <td>{{ item.inv }}</td>
                <td>{{ item.cabinetCode }}</td>
                <td>{{ item.skuCode }}</td>
                <td>{{ item.skuName }}</td>
                <td>{{ item.specification }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ item.unitPrice }}</td>
                <td>{{ item.amount }}</td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>TOTAL</td>
                <td></td>
                <td></td>
                <td></td>
                <td>总金额：</td>
                <td>{{ contractData.totalAmount }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="three-all" style="margin-top: 50px">
          <table class="table-center" style="border: none">
            <tbody style="border: none">
              <tr class="table-head" style="border: none; background: none">
                <td width="50%" style="text-align: left; font-weight: bold; border: none; padding: 5px 10px">
                  供方签名盖章：
                </td>
                <td width="50%" style="text-align: left; font-weight: bold; border: none; padding: 5px 10px">
                  购方签名盖章：
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr style="border: none">
                <td style="text-align: left; font-weight: bold; border: none; padding: 5px 10px">
                  日期：{{ contractData.statementTime }}
                </td>
                <td style="text-align: left; font-weight: bold; border: none; padding: 5px 10px">
                  日期：{{ contractData.statementTime }}
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
import { getStatementInfo } from "@/api/purchase/statement"
import { getTokenUrlFile } from "@/util/auth"

export default {
  data() {
    return {
      partyA: "甜秘密创新有限公司",
      statementNo: this.$route.query.statementNo,
      contractData: {
        firstContract: {}
      }
    }
  },
  mounted: function () {
    this.getData()
  },
  methods: {
    getData() {
      getStatementInfo({ statementNo: this.statementNo }).then((response) => {
        if (response.data.code == 0) {
          this.contractData = response.data.data
          if (this.contractData.statementTime) {
            let date = this.contractData.statementTime.split("-")
            date.pop()
            this.contractData.statementTimeStr = date.join("-")
          }
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
