<template>
  <div
    class="cus-detail"
    v-loading="loadingDetaill"
    element-loading-text="保存中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <basic-container class="totalLayout">
      <!-- <svg-icon icon-class="logistic" style="font-size:50px;">11111</svg-icon> -->
      <div class="detail-top">
        <el-button v-if="permissions.cusDeclare_export" type="primary" size="small" @click="exportExcel"
          >导出</el-button
        >

        <el-button
          v-if="permissions.cusDeclare_audit"
          type="primary"
          size="small"
          :loading="examineLoading"
          :disabled="declareObj.status != 0"
          @click="examine"
          >审核</el-button
        >

        <el-button
          v-if="permissions.cusDeclare_declare_customs"
          type="primary"
          size="small"
          :loading="declareFinshLoading"
          :disabled="declareObj.status != 1"
          @click="declareFinsh"
          >报关完成</el-button
        >
      </div>
      <div class="detail-container">
        <div class="detail-aside" ref="detailAside" :class="{ 'aside-active': !leftShow }">
          <!-- <transition name="aside-fade"> -->
          <div class="aside-left">
            <declare-common
              ref="commonDeclare"
              :displayAud="auditDisable"
              :declareCustom="commonDeclare"
              :rulesProp="rulesSelf"
              commonTitleFr="自主申报"
              @saveClick="saveCommon"
              v-if="vif && trFlag"
            ></declare-common>
            <declare-common
              ref="commonDeclare"
              :displayAud="auditDisable"
              :declareCustom="commonDeclare"
              :rulesProp="rulesTrade"
              commonTitleFr="自贸通申报"
              @saveClick="saveCommon"
              v-if="vif && !trFlag"
            ></declare-common>
          </div>
          <!-- </transition> -->

          <div class="aside-right" ref="asideRight">
            <el-button
              type="text"
              @click="leftAsideShow()"
              class="arrowBtn"
              icon="el-icon-d-arrow-right"
              v-show="!leftShow"
            ></el-button>
            <el-button
              type="text"
              @click="leftAsideShow()"
              class="arrowBtn"
              icon="el-icon-d-arrow-left"
              v-show="leftShow"
            ></el-button>
          </div>
        </div>
        <div class="detail-main" ref="detailMain" :class="{ 'mian-active': !leftShow }">
          <el-tabs v-model="activeName" type="card" style="min-width: 1080px">
            <el-tab-pane label="报关单" name="first">
              <div v-if="activeName == 'first'">
                <customs-declaration
                  :disableCD="auditDisable"
                  ref="customsDeclaration"
                  :numberNo="id"
                  v-if="vif"
                ></customs-declaration>
              </div>
            </el-tab-pane>
            <el-tab-pane label="合同" name="second">
              <div v-if="activeName == 'second'">
                <div v-if="trFlag">
                  <contract-self-declaration ref="declareContract" :numberNo="id"></contract-self-declaration>
                </div>
                <div v-else>
                  <contract-free-trade-customs-declaration
                    ref="declareContract"
                    :numberNo="id"
                  ></contract-free-trade-customs-declaration>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="发票" name="third">
              <div v-if="activeName == 'third'">
                <invoiceautonomy :numberNo="id" ref="invoiceDeclare" v-if="trFlag"></invoiceautonomy>
                <invoiceselftrade :numberNo="id" ref="invoiceDeclare" v-else></invoiceselftrade>
              </div>
            </el-tab-pane>

            <el-tab-pane label="装箱单" name="fourth">
              <div v-if="activeName == 'fourth'">
                <packingList-myself :numberNo="id" ref="packingDeclare" v-if="trFlag"></packingList-myself>
                <packingListFTA :numberNo="id" ref="packingDeclare" v-else></packingListFTA>
              </div>
            </el-tab-pane>

            <el-tab-pane label="申报要素" name="five">
              <div v-if="activeName == 'five'">
                <declarationElements ref="declarationElements" :numberNo="id" v-if="vif"></declarationElements>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 报关 -->
      <el-dialog title="报关完成" :visible.sync="declareAtCustomsDialog" width="30%">
        <el-form :model="declareAtCustomsForm" ref="declareAtCustomsForm" label-width="20%">
          <el-form-item prop="customsNumber" label="海关单号" :rules="ruleDeclare">
            <el-input
              v-model="declareAtCustomsForm.customsNumber"
              maxlength="18"
              size="small"
              placeholder=""
              v-search-input-trim
            ></el-input>
          </el-form-item>
          <el-form-item prop="attchmentFile" label="附件">
            <el-upload
              class="upload-demo inline-class"
              ref="upload"
              accept="application/pdf"
              action="String"
              :auto-upload="false"
              :on-change="signFileChange"
              :show-file-list="false"
            >
              <el-button size="small" type="text">点击上传</el-button>
            </el-upload>
            <span>{{ declareAtCustomsForm.attachmentFileName }}</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="declareFinshLoading" @click="handleDeclareAtCustoms">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import declareCommon from "./declareCommon"
import customsDeclaration from "./customsDeclaration"
import declarationElements from "./declarationElements"
import packingListFTA from "./packingListFTA"
import packingListMyself from "./packingListMyself"
import contractSelfDeclaration from "./contractSelfDeclaration"
import contractFreeTradeCustomsDeclaration from "./contractFreeTradeCustomsDeclaration"
import invoiceautonomy from "./invoiceautonomy"
import invoiceselftrade from "./invoiceselftrade"
import {
  getDeclareOne,
  saveDeclare,
  reviewDeclare,
  declareAtCustomsSave
} from "@/api/logistics/declareCustoms/customsList/customsList"
import {
  declareObjectTransfer,
  rulesSelf,
  rulesTrade
} from "@/const/crud/logistics/declareCustoms/declaredetail/detail"
import { getUrlConcatToken } from "@/util/auth"
import { mapGetters } from "vuex"
import { setTimeout } from "timers"
export default {
  name: "customedetail",
  components: {
    declareCommon,
    customsDeclaration,
    declarationElements,
    packingListFTA,
    packingListMyself,
    contractSelfDeclaration,
    contractFreeTradeCustomsDeclaration,
    invoiceautonomy,
    invoiceselftrade
  },
  created() {
    this.id = this.$route.params.id
    // this.id = 'GD201903260001';
    this.customsType = this.$route.params.customsType
    this.trFlag = this.customsType == "自主报关"
  },
  mounted() {
    this.inti()
  },
  data() {
    var validatePass = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z]{1,18}$/
      if (!reg.test(value)) {
        callback(new Error("18数字或字母"))
      } else {
        callback()
      }
    }
    return {
      id: null, //报关单号或报关ID(待定)
      customsType: null, //报关类型
      rulesTrade: rulesTrade,
      rulesSelf: rulesSelf,
      leftShow: true,
      activeName: "first",
      trFlag: false,
      declareObj: {
        contractNumber: "",
        declareCustomNo: ""
      },
      vif: false,
      commonDeclare: {}, //需要传入到自主申报保存模块的参数
      loadingDetaill: false, //加载
      examineLoading: false, //审核加载
      declareFinshLoading: false,
      auditDisable: false,
      declareAtCustomsDialog: false,
      declareAtCustomsForm: {
        customsNumber: "",
        file: {},
        attachmentFileName: "未选择任何文件"
      },
      ruleDeclare: [
        { required: true, message: "海关单号不能为空", trigger: "blur" },
        { validator: validatePass, trigger: "blur" }
      ]
    }
  },
  methods: {
    inti() {
      getDeclareOne(this.id).then((res) => {
        this.declareObj = res.data.data //获取报关单的全部信息
        if (this.declareObj.status != 0) {
          this.auditDisable = true
        }
        this.commonDeclare = declareObjectTransfer(this.declareObj)
        this.vif = true
      })
    },
    leftAsideShow() {
      this.leftShow = !this.leftShow
    },
    saveCommon(declareCustom) {
      this.loadingDetaill = true
      let formData = new FormData()
      formData.append("declareCustoms", JSON.stringify(declareCustom))
      saveDeclare(formData)
        .then((res) => {
          if (res.data.data) {
            this.$message({ message: "保存成功", type: "success" })
            if (this.activeName == "first") {
              this.$refs.customsDeclaration.getDeclareInfo()
            } else if (this.activeName == "second") {
              this.$refs.declareContract.getContractNumber()
            } else if (this.activeName == "third") {
              this.$refs.invoiceDeclare.getInvoice()
            } else if (this.activeName == "fourth") {
              this.$refs.packingDeclare.getPackageInfo()
            } else if (this.activeName == "five") {
              this.$refs.declarationElements.getDeclareElementInfo()
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .finally(() => {
          this.loadingDetaill = false
        })
    },
    exportExcel() {
      let type = null
      if (this.customsType == "自主报关") {
        type = 2
      } else if (this.customsType == "自贸通报关") {
        type = 1
      }
      if (!type) {
        this.$message.warning("未知报关类型!!")
        return
      }
      window.location =
        getUrlConcatToken(`/api/declarecustoms/cusdeclarecustoms/exportDeclare`) +
        "&declareCustoms=" +
        this.id +
        "&declareType=" +
        type
    },
    examine() {
      //审核
      this.examineLoading = true
      let _this = this
      let auditForm = {
        declareCustoms: this.id,
        status: 1,
        reason: null
      }
      reviewDeclare(Object.assign(auditForm))
        .then((res) => {
          setTimeout(() => {
            if (res.data.data) {
              //禁用按钮和输入框

              this.auditDisable = true
              this.$refs.commonDeclare.displayFn(this.auditDisable)
              this.activeName === "first" && this.$refs.customsDeclaration.disableCDFn(!this.auditDisable)
              this.declareObj.status = 1
              this.$message.success("审核成功")
            } else {
              this.$message.warning(res.data.msg)
            }
            this.examineLoading = false
          }, 1000)
        })
        .catch((err) => {
          this.$message.error("审核异常")
          console.log(err)
          this.examineLoading = false
          return
        })
    },
    declareFinsh() {
      this.declareAtCustomsDialog = true
    },
    //报关保存
    handleDeclareAtCustoms() {
      if (!this.declareAtCustomsForm.file.name) {
        this.$message.warning("请上传附件")
        return
      }
      this.$refs.declareAtCustomsForm.validate((val) => {
        if (!val) {
          return
        }
        const _this = this
        _this.declareFinshLoading = true
        let formData = new FormData()
        formData.append("declareCustoms", this.id)
        formData.append("customsNumber", _this.declareAtCustomsForm.customsNumber)
        formData.append("file", _this.declareAtCustomsForm.file.raw)
        declareAtCustomsSave(formData)
          .then((res) => {
            if (res.data.data) {
              _this.$message.success("报关成功")
              _this.declareAtCustomsDialog = false
              _this.auditDisable = true
              _this.declareObj.status = 2
              _this.$refs.commonDeclare.displayFn(_this.auditDisable)
              _this.$refs.customsDeclaration.disableCDFn(!_this.auditDisable)
            } else {
              _this.$message.warning(res.data.msg)
            }
          })
          .catch(() => {
            _this.$message.error("报关失败")
          })
          .finally(() => {
            _this.declareFinshLoading = false
          })
      })
    },
    //报关附件-文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    signFileChange(file, fileList) {
      if (file.size / 1024 / 1024 > 30) {
        this.$message.warning("不允许上传大于30M文件")
        return
      }
      this.declareAtCustomsForm.file = file
      this.declareAtCustomsForm.attachmentFileName = file.name
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  }
}
</script>
<style lang="scss">
@import "./detail.scss";
</style>
