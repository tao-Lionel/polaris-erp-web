<template>
  <div id="print">
    <div class="box">
      <div id="printPage">
        <el-row>
          <el-col :span="24" style="margin-bottom: 30px">
            <p class="title">{{ supplierName }}送货单</p>
          </el-col>
        </el-row>
        <div class="prin-top">
          <div style="flex: 1">
            <p>
              <strong>单据日期:</strong><span class="margin-left-5">{{ dataFormat(billData) }}</span>
            </p>
            <p>
              <strong>单据编号:</strong><span class="margin-left-5">{{ deliveryNo }}</span>
            </p>
            <p>
              <strong>币别:</strong><span class="margin-left-5">{{ currency }}</span>
            </p>
            <p>
              <strong>客户名称:</strong><span class="margin-left-5">{{ corporationName }}</span>
            </p>
            <p>
              <strong>交货地址:</strong><span class="margin-left-5">{{ deliveryAddress }}</span>
            </p>
          </div>
          <div>
            <p>
              <strong>合同编号:</strong><span class="margin-left-5">{{ poContractNo }}</span>
            </p>
            <p>
              <strong>送货日期:</strong><span class="margin-left-5">{{ dataFormat(deliveryDate) }}</span>
            </p>
            <!-- <img :src="barCodeUrl" style="max-width:300px;"> -->
          </div>
        </div>
        <!-- <el-row>
            <el-col :span="16">
              <strong>单据日期:</strong><span class="margin-left-5">{{dataFormat(billData)}}</span>
            </el-col>
            <el-col :span="8">
              <strong>单据编号:</strong><span class="margin-left-5">{{deliveryNo}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <strong>客户名称:</strong><span class="margin-left-5">{{corporationName}}</span>
            </el-col>
            <el-col :span="3">
              <strong>币别:</strong>
              <span style="margin-left: 40px;">{{currency}}</span>
            </el-col>
            <el-col :span="5">
              <strong>合同编号:</strong><span class="margin-left-5">{{poContractNo}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <strong>交货地址:</strong><span class="margin-left-5">{{deliveryAddress}}</span>
            </el-col>
            <el-col :span="4">
              <strong>送货日期:</strong><span class="margin-left-5">{{dataFormat(deliveryDate)}}</span>
            </el-col>
            <el-col :span="4">
              <img :src="barCodeUrl" style="width:150px;">
            </el-col>
          </el-row> -->
        <el-row>
          <el-col :span="24">
            <div class="block">
              <table border="1" class="table-center">
                <thead>
                  <tr>
                    <td width="5%">序号</td>
                    <td width="7.5%">采购单号</td>
                    <td width="7.5%">SKU</td>
                    <td width="7.5%">产品名称</td>
                    <!-- <td width="5%">单位</td> -->
                    <!-- <td width="7.5%">平台SKU</td> -->
                    <td width="7.5%">平台</td>
                    <td width="7.5%">站点</td>
                    <td width="7.5%">送货数量</td>
                    <td width="7.5%">产品毛重(kg)</td>
                    <td width="5%">箱数</td>
                    <td width="8%">包装长*宽*高(cm)</td>
                    <td width="10%">说明</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="goods.length == 0">
                    <td>&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr v-for="(item, index) in goods" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.purchaseOrderNo }}</td>
                    <td>{{ item.skuCode }}</td>
                    <td>{{ item.skuName }}</td>
                    <!-- <td>{{ item.unit }}</td> -->
                    <!-- <td>{{ item.platformSkuCode }}</td> -->
                    <td>{{ item.platformCode }}</td>
                    <td>{{ item.sitCode }}</td>
                    <td>{{ item.deliveryQuantity }}</td>
                    <!-- <td>{{ item.skuGrossWeight }}</td> -->
                    <td>{{ item.boxGrossWeight }}</td>
                    <td>{{ item.boxCount }}</td>
                    <!-- <td>{{ item.packageLength }}*{{ item.packageWidth }}*{{ item.packageHeight }}</td> -->
                    <td>{{ item.boxLength }}*{{ item.boxWidth }}*{{ item.boxHeight }}</td>
                    <td>{{ item.remarks }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <strong>送货方</strong>
          </el-col>
          <el-col :span="6">
            <strong>签收方</strong>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <span>送货单位:</span><span class="margin-left-5">{{ supplierName }}</span
            ><span style="margin-left: 100px">（盖章）</span>
          </el-col>
          <el-col :span="6"> <span>签收人:</span><span class="margin-left-5"></span> </el-col>
        </el-row>
        <el-row>
          <el-col :span="18"> <span>经办人:</span><span class="margin-left-5"></span> </el-col>
          <el-col :span="6">
            <span>联系人:</span><span class="margin-left-5">{{ signer }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <span>通讯地址:</span><span class="margin-left-5">{{ postalAdress }}</span>
          </el-col>
          <el-col :span="6">
            <span>联系电话:</span><span class="margin-left-5">{{ signCellphone }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { getHistoryData } from "@/api/purchase/delivery/podeliverydetail.js"
import { getTokenUrl } from "@/util/auth"
import { dateFtt } from "@/components/avue/utils/dateUtil"
export default {
  props: {
    gycode: [String, Number]
  },
  data() {
    return {
      supplierName: "广州市甜秘密",
      deliveryNo: "",
      poContractNo: "ht056623",
      currency: "CSN",
      billData: "1998-08-01",
      corporationName: "广州甜秘密",
      deliveryAddress: "中国广州",
      deliveryDate: "2019-05-06",
      signer: "",
      signCellphone: "",
      //contractNo: this.$route.query.paramcontractNo,
      barCodeUrl: "",
      postalAdress: "",
      goods: []
    }
  },
  mounted: function () {
    this.deliveryNo = this.gycode
    this.getData()
  },
  methods: {
    getData() {
      getHistoryData(this.deliveryNo).then((response) => {
        if (response.data.code == 0) {
          var entity = response.data.data
          this.supplierName = entity.supplierName
          this.billData = entity.createTime
          //this.deliveryNo
          this.corporationName = entity.corporationName
          this.currency = entity.currency
          this.poContractNo = entity.poContractNo
          this.deliveryAddress = entity.deliveryAddress
          this.deliveryDate = entity.deliveryDate
          this.barCodeUrl = getTokenUrl(entity.barCodeUrl)
          this.postalAdress = entity.postalAdress
          this.signer = entity.signer
          this.signCellphone = entity.signCellphone
          //debugger;
          this.goods = entity.detailList
        }
      })
    },

    contractPrint() {
      this.$print(window.document.getElementById("printPage"))
    },
    dataFormat(time) {
      if (this.isNulls(time)) {
        return
      }
      return dateFtt("yyyy-MM-dd", new Date(time))
      // time = new Date(time);
      // return `${time.getFullYear()}-${time.getMonth() + 1 >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)}-${time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()}`;
    },

    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss">
@import "./print.scss";
</style>
