<template>
  <div class="m-sign">
    <!--        test 222-->
    <el-form @submit.prevent.native>
      <el-form-item>
        <el-autocomplete
          v-model="signOrderNumber"
          clearable
          popper-class="m-auto-comp"
          class="m-auto-search"
          :autofocus="true"
          :trigger-on-focus="false"
          :fetch-suggestions="querySearchAsync"
          @select="selectTarget"
          style="width: 100%"
          placeholder="请输入送货单号"
        >
          <template slot="append">
            <i class="icon-saomiao" @click="scanBarCodeFn"></i>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>

    <div v-show="deliverInfo.deliveryNo" class="m-deliver-info">
      <div class="m-base">
        <p class="m-title">基本信息</p>
        <ul class="m-base-con">
          <li class="m-deli-no">
            <span>送货单号：{{ deliverInfo.deliveryNo }}</span>
            <span class="m-sign-tip">{{ isNoSign ? "未签收" : "已签收" }}</span>
          </li>
          <li>合&nbsp;&nbsp;同 &nbsp;号：{{ deliverInfo.poContractNo }}</li>
          <li>单据时间：{{ deliverInfo.createTime && deliverInfo.createTime.split(/\s/i)[0] }}</li>
          <li class="m-adr">
            <p class="m-adr-tit">客户名称：</p>
            <p>{{ deliverInfo.corporationName }}</p>
          </li>
          <li>交货地址：{{ deliverInfo.deliveryAddress }}</li>
        </ul>
      </div>
      <div class="m-base">
        <p class="m-title">产品详情</p>
        <el-table :data="deliverInfo.detailList">
          <el-table-column label="SKU" prop="skuCode"></el-table-column>
          <el-table-column label="单位" prop="unit"></el-table-column>
          <el-table-column label="平台SKU" prop="platformSkuCode"></el-table-column>
          <el-table-column label="数量" prop="deliveryQuantity"></el-table-column>
          <el-table-column label="箱数" prop="boxCount"></el-table-column>
        </el-table>
      </div>

      <div class="m-base">
        <p class="m-title">送货方</p>
        <ul class="m-base-con">
          <li>送货单位：{{ deliverInfo.supplierName }}</li>
          <!--                    <li>经 办 人：{{deliverInfo.signer}}</li>-->
          <li class="m-adr">
            <p class="m-adr-tit">通讯地址：</p>
            <p>{{ deliverInfo.postalAdress }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="m-sign-btn" v-show="deliverInfo.deliveryNo">
      <el-button @click="$router.push('/mobile')">取 消</el-button>
      <el-button v-if="permissions.warehouse_wmssign_sign && isNoSign" @click="sign" type="primary">签 收</el-button>
    </div>
  </div>
</template>

<script>
import { init_sdk } from "../../../../../util/wxConfig.js"
import { fetchList, getByDeliveryNo, addObj } from "@/api/warehouse/wmssign.js"
import { getHistoryData } from "@/api/purchase/delivery/podeliverydetail.js"
import { mapGetters } from "vuex"
import Toast from "vant/es/toast"

export default {
  name: "mSign",
  data: () => ({
    signOrderNumber: "",
    deliverInfo: {},
    isNoSign: false
  }),
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    search() {
      //查询
      this.getDeliverDetail(this.signOrderNumber)
    },
    querySearchAsync(queryString, cb) {
      //远程搜索
      fetchList({
        deliveryNo: queryString,
        current: 1,
        size: 10
      }).then((res) => {
        if (res.data.code === 0) {
          let list = res.data.data.records.map((item) => ({
            value: item.deliveryNo
          }))
          if (list.length === 1) {
            const v = list[0].value

            // this.deliveryNo = v;
            this.signOrderNumber = v
            this.getDeliverDetail(v)
            cb([])
          } else {
            cb(list)
          }
        }
      })
    },
    selectTarget(item) {
      // this.deliveryNo = item.value;
      this.signOrderNumber = item.value
      this.getDeliverDetail(item.value)
    },
    getDeliverDetail(str) {
      // 签收状态
      if (!str) {
        Toast("请输入送货单号")
        return
      }
      getByDeliveryNo({ deliveryNo: str }).then((res) => {
        if (res.data.code === 0) {
          this.isNoSign = res.data.data.status === 0
        }
      })
      //送货信息
      getHistoryData(str).then((res) => {
        this.deliverInfo = res.data.data
        console.log(this.deliverInfo)
      })
    },
    sign() {
      // 签收
      if (!this.signOrderNumber) {
        Toast("送货单号不能为空")
        return
      }
      addObj({ deliveryNo: this.signOrderNumber }).then((res) => {
        if (res.data.code === 0) {
          this.isNoSign = false
          return
        }
        Toast("签收失败")
      })
    },
    scanBarCodeFn() {
      let _this = this
      init_sdk("sdk1", function () {
        wx.scanQRCode({
          desc: "甜秘密创新",
          needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
          scanType: ["barCode"], // 可以指定扫二维码还是条形码（一维码），默认二者都有
          success: function (res) {
            _this.signOrderNumber = res.resultStr
            _this.getDeliverDetail(res.resultStr)
          },
          error: function (res) {
            if (res.errMsg.indexOf("function_not_exist") > 0) {
              Toast("版本过低请升级")
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import "./style";
</style>
