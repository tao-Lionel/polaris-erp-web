<template>
  <!-- 这是采购请款单 -->
  <div id="porequestDetail">
    <basic-container>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: `${command == 1 ? '采购请款单' : '采购预付单'}`,
          list: [
            { label: '单据编号', value: detailInfo.requestAccountNo },
            { label: '单据时间', value: detailInfo.createTime },
            { label: '请款人', value: detailInfo.createName },
            { label: '请款单位', value: detailInfo.purchaseGroupName }
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

        <!-- 请款明细 -->
        <detail-wrapper :options="{ title: '请款明细' }">
          <div style="padding: 5px" class="table-hr-bg">
            <div class="float-right-box">
              <p class="float-right">币别：{{ detailInfo.currency }}</p>
              <!-- <el-tooltip placement="top" class="float-right">
                                <div slot="content">多行信息<br/>第二行信息</div>
                                <p class="width-200">结算方式：{{detailInfo.settleaccountName}}</p>
                            </el-tooltip> -->
              <el-tooltip
                class="float-right"
                popper-class="my-popper"
                effect="light"
                :content="detailInfo.settleaccountName"
                placement="top-start"
              >
                <p class="width-200">结算方式：{{ detailInfo.settleaccountName }}</p>
              </el-tooltip>
            </div>

            <el-table stripe class="cancelFixedTop" :data="detailList" border max-height="500">
              <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
              <el-table-column prop="purchaseOrderNo" label="采购单号" width="150px"></el-table-column>
              <el-table-column prop="skuCode" label="SKU" width="150px"></el-table-column>
              <el-table-column prop="platformCode" label="平台"></el-table-column>
              <el-table-column prop="sitCode" label="站点"></el-table-column>
              <el-table-column prop="skuName" label="产品名称" width="150px"></el-table-column>
              <el-table-column prop="modelName" label="产品长宽高（cm）" width="130px"></el-table-column>
              <!-- <el-table-column prop="requestAccount" label="本次预付金额"></el-table-column> -->
              <el-table-column prop="requestAccount" label="本次请款金额" width="240px">
                <template slot-scope="scope">
                  <div class="flex-spance-between">
                    <!-- <span class="color-409eff pointer" @click="openPaymentDialog(scope.$index)">比例</span> -->
                    <el-input
                      :disabled="true"
                      size="small"
                      @focus="openPaymentDialog(scope.$index, true)"
                      @blur="requestAccountBlur(scope.$index)"
                      v-model="detailInfo.poRequestAccountDetailList[scope.$index].requestAccount"
                      placeholder="请输入内容"
                      style="flex: 1; margin: 0 10px"
                    ></el-input>
                    <el-button style="padding: 0" type="text" size="small" @click="openpurchaseDialog(scope.$index)">
                      查询
                    </el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="source" label="单号来源"></el-table-column>
              <el-table-column prop="cabinetCode" label="排柜号" width="150"></el-table-column>
              <el-table-column prop="poContractNo" label="合同编号" width="150"></el-table-column>
              <el-table-column prop="remark" label="请款备注" width="200px">
                <template slot-scope="scope">
                  <el-input
                    :disabled="disabled"
                    type="textarea"
                    clearable
                    :rows="2"
                    maxlength="100"
                    size="small"
                    autosize
                    v-model="detailInfo.poRequestAccountDetailList[scope.$index].remark"
                    placeholder="不超过100字符"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="" label="操作" width="80px">
                <template slot-scope="scope">
                  <!--  @click="handleDelRow(scope.row, scope.row.$index)" -->
                  <!-- <i class="icon-xinzeng y-icon-add" ></i> -->
                  <i v-if="disabled" class="icon-shanchu y-icon-delect"></i>
                  <i v-else class="icon-shanchu y-icon-delect" @click="deal(scope.$index)"></i>
                </template>
              </el-table-column>
            </el-table>

            <div style="text-align: right; margin: 10px 0">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[50]"
                :page-size="50"
                background
                layout="total, sizes, prev, pager, next"
                :total="detailInfo.poRequestAccountDetailList.length"
              >
              </el-pagination>
            </div>

            <div style="border-top: 1px solid #efefef">
              <el-form :inline="true" :model="formDetail">
                <!-- <el-form-item label="优惠金额:">
                  <el-input :disabled="disabled || (detailInfo.taxType == 1 ? true : false)" @blur="discountAmountBlur"
                    v-model="formDetail.discountAmount" size="small" style="max-width:100px;"></el-input>
                </el-form-item> -->
                <el-form-item label="期望付款时间:" required style="margin-top: 0">
                  <el-date-picker
                    :disabled="disabled"
                    type="date"
                    value-format="yyyy-MM-dd"
                    size="small"
                    v-model="formDetail.expectePaymentTime"
                    :picker-options="pickerOptions"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="应收账款使用金额">
                  <el-input :disabled="disabled" @blur="receiveAccountUsedBlur" v-model="formDetail.receiveAccountUsed"
                    size="small" style="max-width:100px;" placeholder="0"></el-input>
                </el-form-item>
                <el-form-item label="当前该币别应收账款余额:">
                  <a @click="getAvailableAccountInfo">{{ detailInfo.maxReceiveAvailableAccount ?
                    detailInfo.maxReceiveAvailableAccount : 0 }}</a>
                </el-form-item> -->
              </el-form>
            </div>
          </div>
        </detail-wrapper>

        <!-- 实请金额 -->
        <detail-wrapper :options="{ title: '实请金额', openPadding: true }">
          <el-table stripe class="cancelFixedTop" :data="detailDate" border>
            <el-table-column prop="" label="对方收款账号">
              <template slot-scope="scope">
                <!-- 
                            <el-autocomplete
                            :disabled="disabled"
                            size="small"
                            v-model="accountNo"
                            @select="handleSelect"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            ></el-autocomplete>  -->
                <!-- @clear='selectClear' -->
                <!-- clearable -->
                <el-select
                  size="small"
                  :disabled="disabled"
                  v-model="accountNo"
                  @change="handleSelect"
                  collapse-tags
                  filterable
                  clearable
                  placeholder="请输入内容"
                >
                  <el-option
                    v-for="item in accountNoList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.index"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="开户名称">
              <template slot-scope="scope">
                <span>{{
                  accountNoIndex === -1
                    ? detailInfo.accountName
                      ? detailInfo.accountName
                      : ""
                    : accountNoAllList[accountNoIndex].accountName
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="开户行">
              <template slot-scope="scope">
                <span>{{
                  accountNoIndex === -1
                    ? detailInfo.openingBank
                      ? detailInfo.openingBank
                      : ""
                    : accountNoAllList[accountNoIndex].openingBank
                }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="本次预付金额">
              <template slot-scope="scope">
                <span>{{ allMoney }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="实请金额(对方实收金额)">
              <template slot-scope="scope">
                <span>{{ allMoney.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="支付状态">
              <template slot-scope="scope">
                <span>{{ detailInfo.payStatus === 1 ? "已支付" : "未支付" }}</span>
              </template>
            </el-table-column>
          </el-table>
        </detail-wrapper>

        <!-- 请款备注 -->
        <detail-wrapper :options="{ title: '请款备注', openPadding: true }">
          <el-input
            :disabled="disabled"
            v-model="detailInfo.remark"
            type="textarea"
            maxlength="200"
            placeholder="不得超过200字符"
          >
          </el-input>
        </detail-wrapper>
      </el-form>

      <div class="button-group-right">
        <el-button v-if="permissions.purchase_porequest_save" @click="saveClick" :disabled="disabled"> 保存 </el-button>
        <el-button
          v-if="permissions.purchase_porequest_submit"
          type="primary"
          @click="submitClick"
          :disabled="disabled"
        >
          提交
        </el-button>
      </div>

      <!-- 请款比例弹框 -->
      <!-- <el-dialog class="payment-dialog" title="请款比例" :visible.sync="paymentDialog" width="400px" center>
                <el-input 
                :disabled="disabled"
                    v-if="requestList[currentIndex]" 
                    placeholder="请输入内容" 
                    v-model="percentage" 
                    size="small">
                    <template slot="append">%</template>
                </el-input>
                <el-input v-else placeholder="请输入内容" size="small">
                    <template slot="append">%</template>
                </el-input>
                
                <p class="color-ffb3b3 margin-top-20">当前请款的上限值为{{requestList[currentIndex]?requestList[currentIndex].maxRequestAccount:''}}{{detailInfo.currency}}</p>
                <p class="color-ffb3b3">
                    请款比例的上限值为
                    {{requestList[currentIndex]?(requestList[currentIndex].maxRequestAccount/requestList[currentIndex].purchaseAccount*100).toFixed(2)+'%':''}}
                </p>
                <span v-if="!disabled" slot="footer" class="dialog-footer">
                    <el-button 
                        type="primary"
                        size="small"
                        @click="percentageSure"
                        >确定</el-button>
                </span>
            </el-dialog> -->

      <!-- 采购记录弹框 -->
      <el-dialog class="purchase-dialog" title="采购记录" :visible.sync="purchaseDialog" width="600px" center>
        <div style="height: 70vh; overflow: auto">
          <p class="color-ffb3b3" style="padding-bottom: 10px">
            当前请款的上限值为{{ requestList[currentIndex] ? requestList[currentIndex].maxRequestAccount : ""
            }}{{ detailInfo.currency }}
          </p>
          <detail-wrapper :options="{ title: '信息概览', openPadding: true }">
            <el-table stripe border :data="purchaseDialogDate">
              <el-table-column label="采购数量">
                <template slot-scope="scope">
                  <span>{{ purchaseDialogInfo ? purchaseDialogInfo.purchaseTotalCount : "sdas" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="采购金额">
                <template slot-scope="scope">
                  <span>{{ purchaseDialogInfo ? purchaseDialogInfo.purchaseTotalMoney : "" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="已入库数量">
                <template slot-scope="scope">
                  <span>{{ purchaseDialogInfo ? purchaseDialogInfo.inboundTotalCount : "" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="已入库金额">
                <template slot-scope="scope">
                  <span>{{ purchaseDialogInfo ? purchaseDialogInfo.inboundTotalMoney : "" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="已退货数量">
                <template slot-scope="scope">
                  <span>{{ purchaseDialogInfo ? purchaseDialogInfo.returnTotalCount : "" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="已退货金额">
                <template slot-scope="scope">
                  <span>{{ purchaseDialogInfo ? purchaseDialogInfo.refundTotalMoney : "" }}</span>
                </template>
              </el-table-column>
            </el-table>
          </detail-wrapper>
          <detail-wrapper :options="{ title: '明细信息' }">
            <div class="padding-5">
              <strong>订单详情</strong>
              <el-table stripe border :data="purchaseDialogInfo.purchaseOrderList">
                <el-table-column prop="purchaseCount" label="采购数量"> </el-table-column>
                <el-table-column prop="purchasePrice" label="采购单价"> </el-table-column>
                <el-table-column prop="purchaseMoney" label="采购金额"> </el-table-column>
              </el-table>
            </div>
            <div class="padding-5">
              <strong>入库记录</strong>
              <el-table stripe border :data="purchaseDialogInfo.purchaseInboundList">
                <el-table-column prop="inboundNo" label="入库单号"> </el-table-column>
                <el-table-column prop="inboundCount" label="入库数量"> </el-table-column>
                <el-table-column prop="inboundPrice" label="入库单价"> </el-table-column>
                <el-table-column prop="inboundMoney" label="入库金额"> </el-table-column>
                <el-table-column prop="inboundTime" label="入库时间"> </el-table-column>
              </el-table>
            </div>
            <div class="padding-5">
              <strong>退货记录</strong>
              <el-table stripe border :data="purchaseDialogInfo.purchaseReturnList">
                <el-table-column prop="returnNo" label="退货单号"> </el-table-column>
                <el-table-column prop="returnCount" label="退货数量"> </el-table-column>
                <el-table-column prop="refundMoney" label="退款金额"> </el-table-column>
              </el-table>
            </div>
            <div class="padding-5">
              <strong>请款记录</strong>
              <el-table stripe border :data="purchaseDialogInfo.purchaseRequestList">
                <el-table-column prop="requestNo" label="请款单号"> </el-table-column>
                <el-table-column prop="requestMoney" label="请款金额"> </el-table-column>
                <el-table-column prop="requestStatus" label="请款状态">
                  <template slot-scope="scope">
                    <span>{{
                      typeof scope.row.requestStatus === "number" ? requestStatus[scope.row.requestStatus] : ""
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="payStatus" label="支付状态">
                  <template slot-scope="scope">
                    <span>{{ scope.row.payStatus == 0 ? "未支付" : "已支付" }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </detail-wrapper>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import {
  getInitData,
  getMaxRequestAccount,
  getPurchaseRecord,
  saveData,
  submitData,
  getAccountDetailInfo,
  getInitFinalData,
  getInitPreData
} from "@/api/purchase/request/porequest"
import { getObjBySupplierNo } from "@/api/supplier/posupplieraccount"
import { formatDate } from "@/filters/index"
import { mapGetters } from "vuex"
export default {
  name: "porequest",
  data() {
    return {
      time: formatDate(new Date(), "yyyy-MM-dd"),
      detailInfo: {
        poRequestAccountDetailList: []
      },
      purchaseDialogInfo: {},
      detailDate: [{}],
      purchaseDialogDate: [{}],
      formDetail: {
        receiveAccountUsed: 0,
        discountAmount: 0
      },
      value: new Date(2016, 9, 10, 18, 40),
      requestList: [], //maxRequestAccount 请款上限  purchaseAccount：采购金额  与detailInfo.poRequestAccountDetailList
      paymentDialog: false,
      purchaseDialog: false,
      currentIndex: -1,
      percentage: "",
      requestStatus: {
        0: "未处理",
        1: "采购审核",
        2: "财务审核",
        3: "审核完成"
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      //实请金额
      accountNoAllList: [],
      accountNoList: [],
      accountNo: "",
      accountNoIndex: -1,
      //对方实收金额
      allMoney: 0,
      disabled: false,
      currentPage4: 1,
      detailList: [],
      command: this.$route.query.command
    }
  },
  created() {
    this.loadAll()
  },
  computed: {
    ...mapGetters(["permissions", "userInfo"])
  },
  methods: {
    initData() {
      this.allMoney = this.detailInfo.actualRequestAccount ? this.detailInfo.actualRequestAccount : 0
      this.formDetail.receiveAccountUsed = this.detailInfo.receiveAccountUsed ? this.detailInfo.receiveAccountUsed : 0
      this.formDetail.discountAmount = this.detailInfo.discountAmount ? this.detailInfo.discountAmount : 0
      const date = this.detailInfo.expectePaymentTime ? this.detailInfo.expectePaymentTime : ""
      this.$set(this.formDetail, "expectePaymentTime", date)
      // this.accountNo = this.detailInfo.accountNo?this.detailInfo.accountNo:''
      this.disabled = this.detailInfo.status == 0 || this.detailInfo.status == null ? false : true
    },
    handleCurrentChange(val) {
      this.detailList = this.detailInfo.poRequestAccountDetailList.slice((val - 1) * 50, val * 50)
      document.getElementsByClassName("el-table__body-wrapper")[0].scrollTo(0, 0)
    },
    loadAll() {
      if (this.$route.query.purchaseOrderNos) {
        let param = {
          purchaseOrderNos: this.$route.query.purchaseOrderNos
          // "purchaseOrderNos":"CG19041500004"
        }
        if (this.command == 1) {
          getInitFinalData(param)
            .then((response) => {
              if (response.data.code == 0) {
                this.detailList = response.data.data.poRequestAccountDetailList.slice(0, 50)
                this.detailInfo = response.data.data
                this.getAccountNoList()
                this.initData()
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
        } else if (this.command == 2) {
          getInitPreData(param)
            .then((response) => {
              if (response.data.code == 0) {
                this.detailList = response.data.data.poRequestAccountDetailList.slice(0, 50)
                this.detailInfo = response.data.data
                this.getAccountNoList()
                this.initData()
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
        }
        // getInitData(param).then(response => {
        //   if (response.data.code == 0) {
        //     this.detailInfo = response.data.data
        //     this.getAccountNoList()
        //     this.initData()
        //   } else if (response.data.code == 1) {
        //     this.$message.error(response.data.msg)
        //     return
        //   } else {
        //     this.$message.error("操作失败")
        //     return
        //   }
        // }).catch(() => {
        //   this.$message.error("操作失败")
        //   return
        // })
      } else {
        let param = {
          requestAccountNo: this.$route.query.id
          // "requestAccountNo":"QK19041900008"
        }
        getAccountDetailInfo(param)
          .then((response) => {
            if (response.data.code == 0) {
              // for (var i = 0; i < 6; i++) {
              //   response.data.data.poRequestAccountDetailList = [...response.data.data.poRequestAccountDetailList, ...response.data.data.poRequestAccountDetailList]
              // }
              this.detailList = response.data.data.poRequestAccountDetailList.slice(0, 50)
              this.detailInfo = response.data.data
              this.getAccountNoList()
              this.initData()
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
      }
    },
    headerDisplay({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 2) {
        return { background: "##fafafa" }
      }
    },
    openPaymentDialog(index, flag) {
      this.currentIndex = index
      let param = {
        purchaseOrderNo: this.detailInfo.poRequestAccountDetailList[index].purchaseOrderNo,
        poDetailId: this.detailInfo.poRequestAccountDetailList[index].poDetailId,
        requestAccountNo: this.detailInfo.requestAccountNo
      }
      getMaxRequestAccount(param)
        .then((response) => {
          if (response.data.code == 0) {
            let data = {
              maxRequestAccount: response.data.data.maxRequestAccount,
              purchaseAccount: response.data.data.purchaseAccount
            }
            this.requestList[index] = data

            // if(!flag){
            //     this.percentage = this.detailInfo.poRequestAccountDetailList[this.currentIndex].requestAccount?(this.detailInfo.poRequestAccountDetailList[this.currentIndex].requestAccount/data.purchaseAccount*100).toFixed(2):''
            //   //  console.log(this.percentage)
            //     this.paymentDialog = true;
            // }
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
    openpurchaseDialog(index) {
      this.openPaymentDialog(index)
      let param = {
        purchaseOrderNo: this.detailInfo.poRequestAccountDetailList[index].purchaseOrderNo,
        skuId: this.detailInfo.poRequestAccountDetailList[index].skuId
      }
      getPurchaseRecord(param)
        .then((response) => {
          if (response.data.code == 0) {
            this.purchaseDialog = true
            this.purchaseDialogInfo = response.data.data
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
    //弹框百分比确定
    // percentageSure () {
    //     if(isNaN(this.percentage)){
    //         this.percentage = 0;
    //         this.$message.error("请填写正确的比例");
    //         return
    //     }
    //     let data = (this.requestList[this.currentIndex].purchaseAccount*1*this.percentage/100).toFixed(2)
    //     if(data > this.requestList[this.currentIndex].maxRequestAccount){
    //         this.$message.error("本次请款金额超过本次请款上限");
    //     }else{
    //         this.detailInfo.poRequestAccountDetailList[this.currentIndex].requestAccount = data
    //         this.paymentDialog = false
    //         this.getAllMoney()
    //     }
    // },
    requestAccountBlur(index) {
      this.currentIndex = index
      let data = this.detailInfo.poRequestAccountDetailList[this.currentIndex].requestAccount
      if (isNaN(data)) {
        this.detailInfo.poRequestAccountDetailList[this.currentIndex].requestAccount = 0
        this.$message.error("请填写正确的金额")
        this.getAllMoney()
        return
      }
      if (data > this.requestList[this.currentIndex].maxRequestAccount) {
        this.$message.error("本次请款金额超过本次请款上限")
        this.detailInfo.poRequestAccountDetailList[this.currentIndex].requestAccount = 0

        return
      }

      this.detailInfo.poRequestAccountDetailList[this.currentIndex].requestAccount = (
        this.detailInfo.poRequestAccountDetailList[this.currentIndex].requestAccount * 1
      ).toFixed(2)
      this.getAllMoney()
    },
    //删除行
    deal(index) {
      if (this.detailInfo.poRequestAccountDetailList.length > 1) {
        this.detailInfo.poRequestAccountDetailList.splice(index, 1)
        this.getAllMoney()
      } else {
        this.$message.error("撤销订单不能少于1行")
        return
      }
    },
    //应收账款使用金额失焦
    receiveAccountUsedBlur() {
      if (isNaN(this.formDetail.receiveAccountUsed) || this.formDetail.receiveAccountUsed < 0) {
        this.formDetail.receiveAccountUsed = 0
        this.$message.error("请填写正确的金额")
        this.getAllMoney()
        return
      }
      if (this.formDetail.receiveAccountUsed > this.detailInfo.maxReceiveAvailableAccount) {
        this.$message.error("填写应收账款使用金额超过当前该币别应收账款余额")
        this.formDetail.receiveAccountUsed = 0
        this.getAllMoney()
        return
      }
      this.formDetail.receiveAccountUsed = (this.formDetail.receiveAccountUsed * 1).toFixed(2)
      this.getAllMoney()
    },
    discountAmountBlur() {
      if (isNaN(this.formDetail.discountAmount) || this.formDetail.discountAmount < 0) {
        this.formDetail.discountAmount = 0
        this.$message.error("请填写正确的金额")
        this.getAllMoney()
        return
      }
      this.getAllMoney()
    },
    getAccountNoList() {
      // console.log("asdfkasm")
      getObjBySupplierNo(this.detailInfo.supplierNo)
        .then((response) => {
          if (response.data.code == 0) {
            let data = response.data.data
            this.accountNoAllList = data
            for (let i = 0; i < data.length; i++) {
              let li = {
                value: data[i].accountNo,
                index: i
              }

              // this.accountNoList[i] = li;
              this.accountNoList.push(li)
            }
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
            return
          } else {
            this.$message.error("操作失败")
            return
          }
          // 设置默认值
          this.$nextTick(() => {
            let tempId = this.detailInfo.accountNo ? this.detailInfo.accountNo : ""
            this.accountNoList.forEach((val) => {
              if (val.value == tempId) {
                this.accountNo = val.index
              }
            })
          })
        })
        .catch(() => {
          this.$message.error("操作失败")
          return
        })
    },
    querySearchAsync(queryString, cb) {
      cb(this.accountNoList)
      // console.log(queryString)
      // console.log(cb)
    },
    handleSelect() {
      // console.dir(1)
      // console.log(this.accountNo)
      // return
      if (!this.accountNo && this.accountNo !== 0) {
        this.accountNoIndex = -1
        return
      }
      this.accountNoIndex = this.accountNo
      console.log(this.accountNoIndex)
    },
    //计算对方实收金额
    getAllMoney() {
      let all = 0
      for (let i = 0; i < this.detailInfo.poRequestAccountDetailList.length; i++) {
        // console.log(i+""+this.detailInfo.poRequestAccountDetailList[i].requestAccount*1)
        all += this.detailInfo.poRequestAccountDetailList[i]?.requestAccount * 1
      }

      // console.log(all)
      // console.log(this.formDetail.discountAmount)
      // console.log(this.formDetail.receiveAccountUsed)
      this.allMoney = all - this.formDetail.discountAmount - this.formDetail.receiveAccountUsed
    },
    //点击保存
    saveClick() {
      let param = this.saveAndSubmit()
      if (param == "") {
        return
      }
      // console.dir(param)
      // return
      saveData(param)
        .then((response) => {
          if (response.data.code == 0) {
            this.detailInfo = ""
            this.detailInfo = response.data.data
            this.$notify({
              title: "保存成功",
              type: "success",
              duration: 2000
            })
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
    submitClick() {
      let param = this.saveAndSubmit()
      if (param == "") {
        return
      }
      submitData(param)
        .then((response) => {
          if (response.data.code == 0) {
            this.$message.success("提交成功")

            // 跳转回父级并关闭当前页面
            this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
            this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath)

            this.$router.push("/finance/porequest")
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
    //保存提交前的提示和数据封装
    saveAndSubmit() {
      if (this.allMoney < 0) {
        this.$message.error("实请金额不能为负数")
        return ""
      }
      if (!this.formDetail.expectePaymentTime) {
        this.$message.error("请选择期望付款日期")
        return ""
      }
      if (this.formDetail.receiveAccountUsed > this.detailInfo.maxReceiveAvailableAccount) {
        this.$message.error("请输入应收账款使用金额")
        return ""
      }
      // console.log(this.accountNo)
      if (this.accountNo === "") {
        // 该处不要用双==，0==''为true，编写代码的时候少用==判断
        this.$message.error("请选择收款账号")
        return ""
      }
      let supplierAccountType =
        this.accountNoIndex === -1
          ? (supplierAccountType = this.detailInfo.supplierAccountType)
          : this.accountNoAllList[this.accountNoIndex].supplierAccountType
      let list = []
      for (let i = 0; i < this.detailInfo.poRequestAccountDetailList.length; i++) {
        if (!this.detailInfo.poRequestAccountDetailList[i].requestAccount) {
          this.$message.error("请输入本次请款金额")
          return ""
        }
        let li = {
          purchaseOrderNo: this.detailInfo.poRequestAccountDetailList[i].purchaseOrderNo,
          remark: this.detailInfo.poRequestAccountDetailList[i].remark,
          skuCode: this.detailInfo.poRequestAccountDetailList[i].skuCode,
          skuId: this.detailInfo.poRequestAccountDetailList[i].skuId,
          requestAccount: this.detailInfo.poRequestAccountDetailList[i].requestAccount,
          poDetailId: this.detailInfo.poRequestAccountDetailList[i].poDetailId,
          poContractNo: this.detailInfo.poRequestAccountDetailList[i].poContractNo,
          source: this.detailInfo.poRequestAccountDetailList[i].source,
          relationNo: this.detailInfo.poRequestAccountDetailList[i].relationNo,
          returnStockDetailId: this.detailInfo.poRequestAccountDetailList[i].returnStockDetailId
        }
        list[i] = li
      }

      let param = {
        requestAccountNo: this.detailInfo.requestAccountNo,
        discountAmount: this.formDetail.discountAmount,
        expectePaymentTime: this.formDetail.expectePaymentTime,
        receiveAccountUsed: this.formDetail.receiveAccountUsed,
        supplierAccountType: 1,
        remark: this.detailInfo.remark,
        poRequestAccountDetailList: list,
        requestAccountType: this.detailInfo.requestAccountType
      }

      return param
    },

    getAvailableAccountInfo() {
      this.$router.push({
        path: "/finance/poreceiveaccountdetail",
        query: {
          supplierName: this.detailInfo.supplierName,
          corporationName: this.detailInfo.corporationName,
          currency: this.detailInfo.currency
        }
      })
    }
  }
}
</script>

<style lang="scss">
#porequestDetail {
  overflow: hidden;

  .margin-top-20 {
    margin-top: 20px;
  }

  .table-hr-bg {
    .el-table th {
      background-color: #fafafa;
    }

    .el-form-item {
      margin-top: 20px;
      margin-bottom: 0px;
      margin-right: 10px;
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

  .button-group-right {
    float: right;
    margin: 20px;
  }

  .color-ffb3b3 {
    color: #ffb3b3;
  }

  .padding-5 {
    padding: 5px;
  }

  .width-200 {
    display: inline-block;
    width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.my-popper {
  width: 200px !important;
}
</style>
