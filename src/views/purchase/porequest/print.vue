<template>
  <!-- 打印付款申请书 -->
  <div id="request_print">
    <div class="down-button">
      <el-button type="primary" size="small" @click="contractPrint()">打印</el-button>
    </div>
    <div id="printPageRequest">
      <p class="title"><span>付款申请书</span></p>
      <p class="top">年月日<span class="top_right">字 号</span></p>
      <table>
        <tr>
          <td width="15%"></td>
          <td width="15%"></td>
          <td width="15%"></td>
          <td width="15%"></td>
          <td width="40%"></td>
        </tr>
        <tr>
          <td><p>收款单位</p></td>
          <td colspan="3">
            <p :class="{ supplierName: supplierNameLen > 17 }">{{ printDate.supplierName }}</p>
          </td>
          <!-- <td colspan="3"><p :class="{'supplierName':supplierNameLen>1}">烦恼和烦恼风烦恼和烦恼风烦恼和烦恼风烦恼和烦恼风烦恼和烦恼风烦恼和烦恼风</p></td> -->
          <td class="all_right"><p>付 款 原 因</p></td>
        </tr>
        <tr>
          <td><p>账　　户</p></td>
          <td colspan="3">
            <p>{{ printDate.accountNo }}</p>
          </td>
          <td rowspan="5" style="border-top: 0px"></td>
        </tr>
        <tr>
          <td><p style="letter-spacing: 4px">开&nbsp;户&nbsp;行</p></td>
          <td colspan="3">
            <p :class="{ supplierName: printDate.openingBank ? printDate.openingBank.length > 17 : false }">
              {{ printDate.openingBank }}
            </p>
          </td>
        </tr>
        <tr>
          <td><p>金　　额</p></td>
          <td colspan="3">
            <p>{{ printDate.digitToChinese }}</p>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <p>附件<span class="td_right">张</span></p>
          </td>
          <td colspan="2">
            <p>{{ printDate.currencySymbol }} {{ printDate.money ? printDate.money.toFixed(2) : 0 }}</p>
          </td>
        </tr>
        <tr>
          <td colspan="2"><p>审　批</p></td>
          <td colspan="2"><p>财　务</p></td>
        </tr>
      </table>
      <ul class="ul_float">
        <li>会计主管</li>
        <li>记账</li>
        <li>复核</li>
        <li>出纳</li>
        <li>制单</li>
        <li>签收</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { printDocInfo } from "@/api/purchase/request/porequest"
export default {
  data() {
    return {
      requestAccountNo: this.$route.query.requestAccountNo,
      printDate: "",
      supplierNameLen: 0
    }
  },
  created() {
    printDocInfo({ requestAccountNo: this.requestAccountNo }).then((response) => {
      this.printDate = response.data.data
      this.supplierNameLen = this.printDate.supplierName.length
      // this.supplierNameLen = 18;
    })
  },
  methods: {
    contractPrint() {
      var dom = window.document.getElementById("printPageRequest")
      this.$print(dom)
    }
  }
}
</script>
<style lang="scss">
#request_print {
  background-color: #fff;
  .down-button {
    padding: 20px;
  }
  .avue-view {
    background: white;
  }
}
#printPageRequest {
  font-family: FangSong;
  padding: 20px;
  font-size: 14px;
  .title {
    font-size: 20px;
    text-align: center;
    letter-spacing: 24px;
    span {
      display: inline-block;
      &::after {
        display: block;
        content: "";
        border-top: 1px solid;
        border-bottom: 1px solid;
        height: 2px;
        margin: 5px 0 5px -20px;
      }
    }
  }
  .top {
    width: 100%;
    text-align: center;
    letter-spacing: 40px;
    padding-left: 200px;
    padding-bottom: 5px;
    box-sizing: border-box;
    font-size: 12px;
    .top_right {
      float: right;
      letter-spacing: 40px;
    }
  }
  table {
    width: 100%;
    td {
      border: 1px solid;
      p {
        line-height: 36px;
        letter-spacing: 5px;
        padding: 0 10px;
        font-size: 12px;
        font-weight: 200;
        .td_right {
          float: right;
          margin-right: 20px;
        }
      }
      .supplierName {
        line-height: 16px;
        letter-spacing: 2px;
      }
    }
    .all_right {
      border-bottom: 0px;
      p {
        text-align: center;
        line-height: 20px;
        margin-top: 15px;
      }
    }
    tr:last-child {
      height: 130px;
      p {
        width: 20px;
        height: 100%;
      }
    }
    tr:nth-child(1) {
      td {
        border: 0px;
      }
    }
  }
  .ul_float {
    width: 100%;
    list-style-type: none;
    overflow: hidden;
    padding: 5px 10px;
    li {
      float: left;
      width: 16.6%;
      font-size: 12px;
    }
  }
}
//测试纸张240*120 平时需要注释
// @media print {
//     @page {
//         size: 240mm 120mm; /* landscape */
//         /* you can also specify margins here: */
//         margin: 0mm;
//         // margin-right: 45mm; /* for compatibility with both A4 and Letter */
//     }
// }
</style>
