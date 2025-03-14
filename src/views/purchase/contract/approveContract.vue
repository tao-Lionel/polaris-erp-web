<!--
  -    Copyright (c) 2018-2025, Aukey All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the trob4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: wangbin (AukeyIT@aukeys.com)
  -->

<template>
  <div id="approveContract">
    <div class="top">
      <div class="top-inner">
        <!--  class="top-left" -->
        <basic-container>
          <p class="iod-header-title">系统合同</p>
          <p class="top-p">供应商：{{ supplierName }}</p>
          <p class="top-p">法人主体：{{ corporationName }}</p>
          <p class="top-p">结算方式：{{ settleaccountName }}</p>
          <el-table id="approveTb" :data="tableData" border stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="purchaseOrderNo" label="采购单号" width="150">
              <template slot-scope="scope">
                <span class="el-row-text" :title="scope.row.purchaseOrderNo">{{ scope.row.purchaseOrderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="skuCode" label="SKU" width="150" class="el-row-text"></el-table-column>
            <el-table-column prop="skuName" label="货物名称" width="150">
              <template slot-scope="scope">
                <span class="el-row-text" :title="scope.row.skuName">{{ scope.row.skuName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="modelName" label="型号" width="100"></el-table-column>
            <el-table-column prop="specification" label="规格参数" width="150">
              <template slot-scope="scope">
                <span class="el-row-text" :title="scope.row.specification">{{ scope.row.specification }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="purchaseQuantity" label="数量"></el-table-column>
            <el-table-column prop="unitName" label="单位"></el-table-column>
            <el-table-column prop="price" :label="priceName"></el-table-column>
            <el-table-column prop="taxRate" v-if="taxType == 1" label="交易税率"></el-table-column>
            <el-table-column prop="sumPrice" label="金额"></el-table-column>
          </el-table>
          <!-- <div style="height:1000px;"></div> -->
        </basic-container>
        <!-- <basic-container class="top-right">
          <p class="iod-header-title">我司签章件</p>
          <div class="heigth_flow">
            <div v-if="pictures.length == 0">无签章件</div>
            <div v-for="(item,index) in pictures" :key="index" class="img-box">
              <img :src="item">
              <img>
            </div> -->

        <!-- <div class="img-box">
              <img src="/img/mock/card/card-1.jpg" />
              <img src="/img/mock/card/card-2.jpg" />
              <img src="/img/mock/card/card-3.jpg" />
              <img src="/img/mock/card/card-4.jpg" />
            </div> -->
        <!-- <div style="height:1000px;"></div> -->

        <!-- </div>
        </basic-container> -->
      </div>
    </div>
    <basic-container class="bottom">
      <div class="border-rang">
        <div class="title-wrapper">
          <span class="title">财务审核</span>
          <div style="float: right">
            <el-button size="small" @click="financialReject">拒绝</el-button>
            <el-button size="small" type="primary" @click="financialApprove">通过</el-button>
          </div>
        </div>
        <el-input
          v-model="rejectMsg"
          maxlength="200"
          :autosize="{ minRows: 4, maxRows: 4 }"
          type="textarea"
          placeholder="拒绝通过，必须填写拒绝原因，不得超过200个字符"
        ></el-input>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getApproveData, financialOperate, showPic } from "@/api/purchase/contract/pocontract"
import { mapGetters } from "vuex"
import { getTokenUrl } from "@/util/auth"
// import { getFileServerUrl } from "@/api/fileServerUrl/fileServerUrl.js";
export default {
  data() {
    return {
      priceName: "含税单价",
      rejectMsg: "",
      contractNo: this.$route.query.contractNo,
      tableData: [],
      pictures: [],
      // fileServerUrl: "",
      supplierName: "",
      corporationName: "",
      settleaccountName: "",
      taxType: 0
    }
  },
  created() {
    // getFileServerUrl().then(response => {
    //   this.fileServerUrl = response.data;
    // });
    getApproveData(this.contractNo).then((response) => {
      if (response.data.code == 0) {
        this.supplierName = response.data.data.supplierName
        this.corporationName = response.data.data.corporationName
        this.settleaccountName = response.data.data.settleaccountName
        this.taxType = response.data.data.taxType
        if (this.taxType == 1) {
          this.priceName = "含税单价"
        } else if (this.taxType == 2) {
          this.priceName = "非税单价"
        }
        this.tableData = response.data.data.approveDataTableList
        this.tableData.forEach((item) => {
          item.taxRate = item.taxRate * 100 + "%"
          item.price = this.myFixed(item.price)
          item.sumPrice = this.myFixed(item.sumPrice)
        })
      } else if (response.data.code == 1) {
        this.$message.error(response.data.msg)
        return
      } else {
        this.$message.error("读取数据失败")
        return
      }
    })
    this.getPic()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"]),
    key() {
      return this.$route.fullPath
    }
  },
  methods: {
    //财务审核
    financialApprove() {
      var obj = {
        contractNo: this.contractNo,
        type: 0
      }
      financialOperate(obj).then((response) => {
        if (response.data.code == 0) {
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000
          })
          //this.$router.$avueRouter.closeTag();
          if (this.$parent.$refs.tagNavigate) {
            this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
          }
          this.$router.push("/purchase/pocontract")
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("操作失败")
          return
        }
      })
    },
    //财务拒绝
    financialReject() {
      if (this.rejectMsg.trim() == "") {
        this.$message.warning("请填写拒绝信息")
        return
      }
      var obj = {
        contractNo: this.contractNo,
        rejectMsg: this.rejectMsg,
        type: 1
      }
      financialOperate(obj).then((response) => {
        if (response.data.code == 0) {
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000
          })
          if (this.$parent.$refs.tagNavigate) {
            this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
          }
          //this.$router.$avueRouter.closeTag();
          this.$router.push("/purchase/pocontract")
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("操作失败")
          return
        }
      })
    },
    getPic() {
      var obj = {
        contractNo: this.$route.query.contractNo,
        acctachType: 1
      }
      showPic(obj).then((response) => {
        if (response.data.code == 0 && response.data.data != null) {
          response.data.data.forEach((element) => {
            //var url = getTokenUrl(this.fileServerUrl + element.attachFile);
            var url = getTokenUrl(element.attachFile)
            this.pictures.push(url)
          })
        }
      })
    },
    /**
     * 检查字符串是否为空
     */
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    },
    myFixed(value) {
      if (this.isNulls(value)) {
        return
      }

      return (parseFloat(value) + 0.0).toFixed(2)
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
