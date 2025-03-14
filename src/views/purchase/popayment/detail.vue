<template>
  <!-- 这是采购付款单 -->
  <div id="popaymentDetail">
    <basic-container>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '采购付款单',
          list: [
            { label: '单据编号', value: detailInfo.poPaymentNo },
            { label: '单据时间', value: detailInfo.createTime },
            { label: '请款人', value: detailInfo.requestName },
            { label: '付款人', value: detailInfo.createName || '无' }
          ]
        }"
      >
      </detail-template>

      <el-form :inline="true" ref="detailInfo" :model="detailInfo" class="form">
        <!-- 收付款单位 -->
        <detail-wrapper :options="{ title: '收付款单位' }">
          <el-row>
            <el-col :span="12">
              <el-form-item label="收款单位（供应商）:" label-width="190px">
                <span>{{ detailInfo.supplierName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款单位（法人主体）:" label-width="190px">
                <span>{{ detailInfo.corporationName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>

        <!-- 付款信息 -->
        <detail-wrapper :options="{ title: '付款信息', openPadding: true }">
          <el-table stripe :data="detailDate">
            <el-table-column label="对方收款账号">
              <template slot-scope="scope">
                <span>{{ detailInfo.accountNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="开户名称">
              <template slot-scope="scope">
                <span>{{ detailInfo.accountName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="平台">
              <template slot-scope="scope">
                <span>{{ detailInfo.platform }}</span>
              </template>
            </el-table-column>
            <el-table-column label="站点">
              <template slot-scope="scope">
                <span>{{ detailInfo.site }}</span>
              </template>
            </el-table-column>
            <el-table-column label="开户行">
              <template slot-scope="scope">
                <span>{{ detailInfo.openingBank }}</span>
              </template>
            </el-table-column>
            <el-table-column label="付款金额">
              <template slot-scope="scope">
                <span>{{ detailInfo.requestAccount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="币别">
              <template slot-scope="scope">
                <span>{{ detailInfo.currency }}</span>
              </template>
            </el-table-column>
            <el-table-column label="付款账号">
              <template slot-scope="scope">
                <el-select v-model="detailInfo.paymentAccount" :disabled="detailInfo.status != 1" size="small">
                  <el-option
                    v-for="item in paymentAccountList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="支付状态">
              <template slot-scope="scope">
                <span>{{ detailInfo.status == 1 ? "未付款" : "已付款" }}</span>
              </template>
            </el-table-column>
          </el-table>
        </detail-wrapper>
      </el-form>
      <el-form :inline="true" :model="formDetail">
        <!-- 实付信息 -->
        <detail-wrapper :options="{ title: '收付款单位' }">
          <el-row>
            <el-col :span="8">
              <el-form-item label="实付金额:">
                <span>{{ detailInfo.actualAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实付币别:">
                <span>{{ detailInfo.actualCurrency }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水单文件:">
                <i
                  v-if="detailInfo.paymentAttach"
                  @click="preViewMethods(detailInfo.paymentAttach)"
                  class="icon-chakan y-reviews"
                ></i>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>
      </el-form>

      <detail-wrapper :options="{ title: '请款备注', openPadding: true }">
        <el-input
          :v-model="detailInfo.remark"
          type="textarea"
          maxlength="200"
          :disabled="detailInfo.status != 1"
          placeholder="不得超过200字符"
        >
        </el-input>
      </detail-wrapper>

      <div class="button-group-right">
        <el-button
          v-if="detailInfo.status == 1 && permissions.popayment_pay"
          type="primary"
          size="small"
          @click="clickPay"
          >支付</el-button
        >
      </div>

      <!-- 支付 -->
      <el-dialog class="payment-dialog" v-bind:title="paymentTitle" :visible.sync="paymentDialog" width="520px" center>
        <el-form ref="paymentDialogForm" :model="paymentDialogForm" status-icon :rules="rules">
          <el-form-item label="实付金额" prop="actualAmount">
            <el-input :maxlength="12" clearable v-model="paymentDialogForm.actualAmount" size="small"></el-input>
          </el-form-item>

          <el-form-item prop="actualCurrency" label="币别">
            <el-select
              size="small"
              v-model="paymentDialogForm.actualCurrency"
              collapse-tags
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in currencyOptions"
                :key="item.currency"
                :label="item.currency"
                :value="item.currency"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="水单文件" prop="paymentAttach">
            <!-- <el-input v-model="paymentDialogForm.paymentAttach" size="small"></el-input> -->
            <el-upload
              style="display: inline-block"
              ref="upload"
              accept="image/jpeg, image/jpg, image/png, image/bmp"
              action="String"
              :auto-upload="false"
              :on-change="signFileChange"
              :show-file-list="false"
            >
              <el-button size="small" type="text">上传水单文件</el-button>
              <avue-crud-input hidden v-model="paymentDialogForm.paymentAttach" style="display: none" />
            </el-upload>
            <span v-if="paymentDialogForm.paymentAttach">
              <i class="icon-chakan y-icon-edit" @click="preViewMethods(paymentDialogForm.paymentAttach)"></i>
            </span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="sureToPay">确定</el-button>
        </span>
      </el-dialog>
      <!-- 查看图片 -->
      <!-- bug:::网页返回，图片弹框不销毁 -->
      <imgdialog ref="imgdialog"></imgdialog>
    </basic-container>
  </div>
</template>
<script>
import { listDetail, uploadImage, payment } from "@/api/purchase/payment/popayment"
import { getAll } from "@/api/baseSetup/bsecurrency"
import imgdialog from "../inquiryorder/imgDialog.vue"
import { remote } from "@/api/admin/dict.js"
import { truncate } from "fs"
import { mapGetters } from "vuex"
export default {
  name: "porequest",
  data() {
    var validatePass = (rule, value, callback) => {
      if (isNaN(value / 1) || value < 0) {
        this.paymentDialogForm.actualAmount = ""
        callback(new Error("请输入不为负的数字"))
      } else {
        this.paymentDialogForm.actualAmount = (value * 1).toFixed(2)
        callback()
      }
    }
    return {
      detailInfo: {},
      detailDate: [{}],
      formDetail: {},
      value: new Date(2016, 9, 10, 18, 40),
      poPaymentNo: this.$route.query.poPaymentNo,
      paymentDialog: false,
      paymentTitle: "支付",
      paymentDialogForm: {
        actualAmount: "",
        actualCurrency: "",
        paymentAttach: ""
      },
      currencyOptions: [],
      paymentAccountList: [],
      rules: {
        actualAmount: [
          { required: true, message: "实付金额不能为空", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ]
      }
    }
  },
  created: function () {
    this.loadAll()
    this.getCurrencyAll()
    this.getPaymentAccountList()
  },
  components: {
    imgdialog
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    /**
     * 查询国家地区
     */
    getCurrencyAll() {
      getAll().then((response) => {
        this.currencyOptions = response.data.data
      })
    },
    //获取付款账号
    getPaymentAccountList() {
      remote("payment_account").then((response) => {
        if (response.data.code == 0) {
          this.paymentAccountList = response.data.data
        }
        if (this.paymentAccountList == null || this.paymentAccountList.length == 0) {
          this.$message.error("付款账号获取失败，请检查是否维护!")
        }
      })
    },
    loadAll() {
      listDetail(this.poPaymentNo)
        .then((response) => {
          if (response.data.code == 0) {
            this.detailInfo = response.data.data
            this.paymentDialogForm.actualAmount = this.detailInfo.requestAccount
            this.paymentDialogForm.actualCurrency = this.detailInfo.currency
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
            return
          } else {
            this.$message.error("操作失败")
            return
          }
        })
        .catch(() => {
          this.$message.error("操作失败")
          return
        })
    },
    headerDisplay({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 2) {
        return { background: "##fafafa" }
      }
    },
    //支付
    clickPay() {
      if (this.detailInfo.paymentAccount === "" || this.detailInfo.paymentAccount == null) {
        this.$message.error("未选择付款账号")
        return
      }
      this.paymentDialog = true
    },
    //弹框确定
    sureToPay() {
      if (this.paymentDialogForm.actualAmount === "" || this.paymentDialogForm.actualAmount == null) {
        this.$message.error("未填写实付金额")
        return
      }
      if (this.paymentDialogForm.actualCurrency === "" || this.paymentDialogForm.actualCurrency == null) {
        this.$message.error("未选择实付币别")
        return
      }
      // if (this.paymentDialogForm.paymentAttach === "" || this.paymentDialogForm.paymentAttach == null) {
      //   this.$message.error("未选择水单文件")
      //   return
      // }

      let param = {
        poPaymentNo: this.detailInfo.poPaymentNo,
        paymentAccount: this.detailInfo.paymentAccount,
        actualAmount: this.paymentDialogForm.actualAmount,
        actualCurrency: this.paymentDialogForm.actualCurrency,
        paymentAttach: this.paymentDialogForm.paymentAttach,
        remark: this.detailInfo.remark
      }

      payment(param)
        .then((res) => {
          if (res.data.code == 0) {
            // console.dir(res)
            this.$message.success("支付成功")
            this.paymentDialog = false
            // 跳转回父级并关闭当前页面
            this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
            this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath)
            this.$router.push("/finance/popayment")
          } else if (res.data.code == 1) {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message.error("支付失败")
          // this.paymentDialog = false;
          return
        })
    },
    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    signFileChange(file, fileList) {
      if (file.size / 1024 / 1024 > 5) {
        this.$message.warning("不允许上传大于5M文件")
        return
      }
      if (!/^image\/(jpeg|png|jpg)$/.test(file.raw.type)) {
        this.$message.warning("请选择图片")
        return
      }

      let formdata = new FormData()
      formdata.append("file", file.raw)

      uploadImage(formdata)
        .then((res) => {
          if (res.data.code == 0) {
            // console.dir(res)
            this.paymentDialogForm.paymentAttach = res.data.data
            this.$message.success("上传成功")
          } else if (res.data.code == 1) {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message.error("上传失败")
          return
        })
    },
    //预览
    preViewMethods(url) {
      if (!url) {
        this.$message.warning("未上传文件")
        return
      }
      this.$refs.imgdialog.showImgUrl(url)
    }
  }
  // beforeDestroy(){
  // console.log(this.$refs.imgdialog.dialogVisibleImg)
  // this.$refs.imgdialog.dialogVisibleImg = false
  // }
}
</script>

<style lang="scss">
#popaymentDetail {
  overflow: hidden;

  .margin-top-20 {
    margin-top: 20px;
  }

  .table-hr-bg {
    .el-table th {
      background-color: #fafafa;
    }
  }

  .float-right-box {
    overflow: hidden;
    line-height: 40px;

    .float-right {
      float: right;
      margin-left: 20px;
    }
  }

  // .el-form-item{
  //     margin-top: 20px;
  //     margin-bottom: 0px;
  //     margin-right: 30px;
  // }
  .button-group-right {
    float: right;
    margin: 20px;
  }

  .payment-dialog .el-form-item__label {
    width: 124px;
  }
}
</style>
