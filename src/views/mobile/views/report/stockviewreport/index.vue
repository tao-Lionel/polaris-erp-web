<template>
  <div id="m_stockviewreport">
    <!-- 库存周转 -->
    <form class="search_form" @submit.native.prevent>
      <el-autocomplete
        ref="autoComplete"
        placement="bottom"
        popper-class="m-auto-comp"
        placeholder="SKU"
        prefix-icon="el-icon-search"
        clearable
        v-model="skuNo"
        :fetch-suggestions="querySearchAsync"
        :trigger-on-focus="false"
        value-key="skuCode"
        @select="handleSelect"
      ></el-autocomplete>
      <!--             <el-button native-type="submit" @click="searchChange" v-show="false"></el-button> -->
    </form>
    <ul class="list_class" v-show="showDetal">
      <li>
        <p class="re_no">SKU:{{ quantityNo.skuCode }}</p>
      </li>
      <li>
        <p>
          <span class="re_no">国内中转仓库存</span>
          <img class="span_right" src="./imgs/domestic.png" alt="国内中转仓库存" />
        </p>
        <!-- {{domesticQuantity}} -->
        <p>实际库存:{{ quantityNo.domesticQuantity }}</p>
      </li>
      <li>
        <p>
          <span class="re_no">海外中转仓库存</span>
          <img class="span_right" src="./imgs/overseas.png" alt="海外中转仓库存" />
        </p>
        <!-- overseasQuantity -->
        <p>实际库存:{{ quantityNo.overseasQuantity }}</p>
      </li>
      <li>
        <p>
          <span class="re_no">FBA库存</span>
          <img class="span_right" src="./imgs/fba.png" alt="FBA库存" />
        </p>
        <!-- fbaQuantity -->
        <p>实际库存:{{ quantityNo.fbaQuantity }}</p>
      </li>
      <li>
        <p>
          <span class="re_no">在途库存</span>
          <img class="span_right" src="./imgs/Onway.png" alt="在途库存" />
        </p>
        <p>采购在途:{{ quantityNo.purchaseOnwayQuantity }}</p>
        <!-- purchaseOnwayQuantity-->
        <p>国内在途:{{ quantityNo.domesticOnwayQuantity }}</p>
        <!-- domesticOnwayQuantity-->
        <p>海外在途:{{ quantityNo.overseasOnwayQuantity }}</p>
        <!-- overseasOnwayQuantity-->
      </li>
    </ul>
  </div>
</template>
<script>
import { fetchList } from "@/api/report/stockvieweveryday"
import { dateFormat } from "@/filters/"
import { deepClone } from "../../../../../components/avue/utils/util"
export default {
  name: "m_stock",
  data() {
    return {
      showDetal: false,
      skuNo: undefined,
      quantityNo: {},
      quantityList: [],
      showList: []
    }
  },
  methods: {
    searchChange(cb) {
      const dt = dateFormat(new Date(), "yyyy-MM-dd")
      let param = {
        searchDate: [dt, dt],
        skuCode: this.skuNo
      }
      fetchList(param).then((response) => {
        this.quantityList = response.data.data.records
        if (this.quantityList.length > 8) {
          this.quantityList = this.quantityList.slice(0, 8)
        }
        cb(this.quantityList)
      })
    },
    querySearchAsync(queryString, cb) {
      this.searchChange(cb)
    },
    handleSelect(item) {
      this.quantityNo = deepClone(item)
      // console.log(this.quantityNo)
      this.skuNo = this.quantityNo.skuCode
      this.showDetal = true
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/base";
#m_stockviewreport {
  //搜索框样式
  .search_form {
    height: pxToRem(130);
    background-color: #2a8efe;
    padding: 0 pxToRem(26);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }
  .popList {
    width: 100%;
    padding: pxToRem(26);
    box-sizing: border-box;
    background-color: #f9f;
    height: 200px;
    position: absolute;
    top: pxToRem(120);
    z-index: 20;
  }
  //列表样式
  .list_class {
    margin-top: pxToRem(130);
    background-color: #e5e8eb;
    padding: 0 pxToRem(30) pxToRem(30);
    li {
      margin-bottom: pxToRem(23);
      border-radius: pxToRem(10);
      padding: 0 pxToRem(30) pxToRem(40) pxToRem(30);
      background-color: #fff;
      P {
        color: rgba(51, 51, 51, 0.85);
        font-size: pxToRem(30);
        line-height: pxToRem(56);
      }
      .re_no {
        font-size: pxToRem(34);
        font-weight: bold;
        color: #333;
        line-height: pxToRem(110);
      }
      .span_right {
        float: right;
        margin-right: pxToRem(10);
        margin-top: pxToRem(30);
        width: pxToRem(22);
        height: pxToRem(26);
      }
    }
    li:nth-child(1) {
      padding: 0 pxToRem(20);
      margin-bottom: pxToRem(10);
      background-color: #e5e8eb;
      .re_no {
        line-height: pxToRem(80);
      }
    }
  }
}
/*.mobile{*/
/*    background: #e5e8eb;*/
/*}*/
/*.m-auto-comp{
        top: pxToRem(100)!important;
    }*/
</style>
