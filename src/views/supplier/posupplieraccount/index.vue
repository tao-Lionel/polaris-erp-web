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
  <div class="execution common" id="posupplieraccount">
    <basic-container>
      <div class="posupplieraccount-box">
        <div class="public-account">
          <!-- <el-row :span="6" class="margin_botton-0">
              <el-button type="text" class="color-warning font-size-20" @click="showHistory(0)">查看历史</el-button>
            </el-row> -->

          <div class="pba-title">
            <strong>对公账户</strong>
            <i class="el-icon-time pointer" @click="showHistory(0)"> 查看历史</i>
          </div>

          <!-- class="work-break-form" -->
          <el-form ref="poSupplierAccountForm1" :model="poSupplierAccount1" status-icon class="pre-work">
            <el-form-item label="账户名称: " label-position="left">{{ poSupplierAccount1.accountName }}</el-form-item>
            <el-form-item label="银行账号: " label-position="left" class="item-overflow">{{
              poSupplierAccount1.accountNo
            }}</el-form-item>
            <el-form-item label="开户行: " label-position="left">{{ poSupplierAccount1.openingBank }}</el-form-item>
            <el-form-item label="开户行地址: " label-position="left">{{
              poSupplierAccount1.openingAdress
            }}</el-form-item>
            <el-form-item label="开户证明: " label-position="left">
              <el-popover placement="right" trigger="click">
                <img style="max-width: 600px" :src="poSupplierAccount1.openingCertifUrl" />
                <el-button
                  type="text"
                  slot="reference"
                  class="color-grey"
                  style="padding: 0"
                  :disabled="poSupplierAccount1.showOpeningCertif"
                  ><i class="icon-chakan y-reviews" style="position: relative; top: 2px"></i
                ></el-button>
              </el-popover>
            </el-form-item>
          </el-form>
        </div>

        <div class="hk-account">
          <div class="pba-title">
            <strong>香港账户</strong>
            <i class="el-icon-time pointer" @click="showHistory(1)"> 查看历史</i>
          </div>

          <el-form ref="poSupplierAccountForm2" :model="poSupplierAccount2" status-icon class="pre-work">
            <el-form-item label="账户名称: " label-position="left">{{ poSupplierAccount2.accountName }}</el-form-item>
            <el-form-item label="银行账号: " label-position="left" class="item-overflow">{{
              poSupplierAccount2.accountNo
            }}</el-form-item>
            <el-form-item label="开户行: " label-position="left">{{ poSupplierAccount2.openingBank }}</el-form-item>
            <el-form-item label="开户行地址: " label-position="left">{{
              poSupplierAccount2.openingAdress
            }}</el-form-item>
            <el-form-item label="SWIFT地址: " label-position="left">{{ poSupplierAccount2.swiftAdress }}</el-form-item>
            <el-form-item label="开户证明: " label-position="left">
              <el-popover placement="right" trigger="click">
                <img style="max-width: 600px" :src="poSupplierAccount2.openingCertifUrl" />
                <el-button
                  style="padding: 0"
                  type="text"
                  slot="reference"
                  :disabled="poSupplierAccount2.showOpeningCertif"
                  ><i class="icon-chakan y-reviews" style="position: relative; top: 2px"></i
                ></el-button>
              </el-popover>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <br />

      <div class="posupplieraccount-box posu-edit">
        <div class="public-account" style="background: #fff">
          <div class="pba-title">
            <strong>编辑 (对公)</strong>
            <span
              >处理状态：<a @click="showOperateLog(0)">{{ poSupplierAccountHistory1.approveStatusName }}</a></span
            >
            <div class="text-right">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="handleSave(0)"
                v-if="permissions.posupplier_account_save"
                >保 存</el-button
              >
              <el-button
                size="small"
                type="primary"
                icon="el-icon-upload"
                @click="handleSubmit(0)"
                v-if="permissions.posupplier_account_submit"
                >提 交</el-button
              >
              <el-button
                type="warning"
                size="small"
                icon="el-icon-back"
                @click="handleWithdraw(0)"
                v-if="permissions.posupplier_account_withdraw"
                >撤 提</el-button
              >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-check"
                @click="handleAudit(0)"
                v-if="permissions.posupplier_account_audit"
                >审 核</el-button
              >
              <el-button
                type="warning"
                size="small"
                icon="el-icon-edit"
                @click="handleChange(0)"
                v-if="permissions.posupplier_account_change"
                >编 辑</el-button
              >
            </div>
          </div>

          <el-form
            ref="poSupplierAccountHistoryForm1"
            :model="poSupplierAccountHistory1"
            :rules="editFormRules1"
            status-icon
          >
            <el-form-item label="账户名称: " prop="accountName">
              <el-input
                size="small"
                :disabled="poSupplierAccountHistory1.editFlag"
                v-model="poSupplierAccountHistory1.accountName"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="银行账号: " prop="accountNo">
              <el-input
                size="small"
                :disabled="poSupplierAccountHistory1.editFlag"
                v-model="poSupplierAccountHistory1.accountNo"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="开户行: " prop="openingBank">
              <el-input
                size="small"
                :disabled="poSupplierAccountHistory1.editFlag"
                v-model="poSupplierAccountHistory1.openingBank"
                clearable
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="" prop="openingBank" class="showopeningBankBefore">
                      <el-tooltip 
                        :content="poSupplierAccount1.openingBank" 
                        placement="bottom" 
                        effect="light">
                        <el-button 
                        type="text" 
                        class="color-warning" 
                        :disabled="poSupplierAccountHistory1.showBefore">点击查看变更前</el-button>
                      </el-tooltip>
                </el-form-item>-->
            <el-form-item label="开户行地址: " prop="openingAdress">
              <el-input
                size="small"
                :disabled="poSupplierAccountHistory1.editFlag"
                v-model="poSupplierAccountHistory1.openingAdress"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item class="edit-upload" label="开户证明: " prop="">
              <el-upload
                :disabled="poSupplierAccountHistory1.editFlag"
                class="upload-img"
                v-model="poSupplierAccountHistory1.openingCertif"
                ref="upload"
                action="String"
                accept="image/jpeg, image/png, image/jpg"
                :before-upload="onBeforeUploadImage"
                :http-request="UploadOpeningCertifPublic"
                :file-list="fileList"
                :show-file-list="false"
              >
                <el-button type="text" :disabled="poSupplierAccountHistory1.editFlag"
                  >点击上传（仅限上传1张,且不超过5M）</el-button
                >
              </el-upload>

              <el-popover placement="right" trigger="click">
                <img style="max-width: 600px" :src="poSupplierAccountHistory1.openingCertifUrl" />
                <el-button type="text" slot="reference" :disabled="poSupplierAccountHistory1.showOpeningCertif"
                  ><i class="icon-chakan y-reviews"></i
                ></el-button>
              </el-popover>
            </el-form-item>
            <p class="upload-tip">　如果是第一次编辑无需填写以下内容</p>

            <!-- <el-form-item label="*如果是第一次编辑无需填写一下内容" class="color-grey" label-width="290px"></el-form-item> -->
            <el-form-item label="变更证明: " prop="changeCertif">
              <div class="change-uplaod">
                <el-upload
                  :disabled="poSupplierAccountHistory1.notChangeFlag"
                  class="upload-demo"
                  v-model="poSupplierAccountHistory1.changeCertif"
                  ref="upload"
                  action="String"
                  accept="image/jpeg, image/png, image/jpg"
                  :before-upload="onBeforeUploadImage"
                  :http-request="UploadChangeCertifPublic"
                  :file-list="fileList"
                  :show-file-list="false"
                >
                  <el-button type="text" :disabled="poSupplierAccountHistory1.notChangeFlag"
                    >点击上传（仅限上传1张,且不超过5M）</el-button
                  >
                </el-upload>
                <el-popover placement="right" trigger="click">
                  <img style="max-width: 600px" :src="poSupplierAccountHistory1.changeCertifUrl" />
                  <el-button
                    type="text"
                    slot="reference"
                    class="color-grey"
                    :disabled="poSupplierAccountHistory1.showChangeCertif"
                    ><i class="icon-chakan y-reviews"></i
                  ></el-button>
                </el-popover>
              </div>
            </el-form-item>
            <el-form-item label="变更原因" prop="changeReason">
              <el-input
                size="small"
                type="textarea"
                placeholder="不得超过200个字符"
                :disabled="poSupplierAccountHistory1.notChangeFlag"
                v-model="poSupplierAccountHistory1.changeReason"
                clearable
              ></el-input>
            </el-form-item>
            <!-- <div class="float-left">
                  <span class="color-grey">处理状态：</span>
                  <span class="color-warning">{{poSupplierAccountHistory1.approveStatusName}}</span>
                </div> -->
          </el-form>
        </div>
        <div class="hk-account" style="background: #fff">
          <div class="pba-title">
            <strong>编辑 (香港)</strong>
            <span
              >处理状态：<a @click="showOperateLog(1)">{{ poSupplierAccountHistory2.approveStatusName }}</a></span
            >
            <div class="text-right">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="handleSave(1)"
                v-if="permissions.posupplier_account_save"
                >保 存</el-button
              >
              <el-button
                size="small"
                type="primary"
                icon="el-icon-upload"
                @click="handleSubmit(1)"
                v-if="permissions.posupplier_account_submit"
                >提 交</el-button
              >
              <el-button
                type="warning"
                size="small"
                icon="el-icon-back"
                @click="handleWithdraw(1)"
                v-if="permissions.posupplier_account_withdraw"
                >撤 提</el-button
              >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-check"
                @click="handleAudit(1)"
                v-if="permissions.posupplier_account_audit"
                >审 核</el-button
              >
              <el-button
                type="warning"
                size="small"
                icon="el-icon-edit"
                @click="handleChange(1)"
                v-if="permissions.posupplier_account_change"
                >变 更</el-button
              >
            </div>
          </div>

          <el-form
            ref="poSupplierAccountHistoryForm2"
            :model="poSupplierAccountHistory2"
            :rules="editFormRules2"
            status-icon
          >
            <el-form-item label="账户名称: " prop="accountName">
              <el-input
                size="small"
                :disabled="poSupplierAccountHistory2.editFlag"
                v-model="poSupplierAccountHistory2.accountName"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="银行账号: " prop="accountNo">
              <el-input
                size="small"
                :disabled="poSupplierAccountHistory2.editFlag"
                v-model="poSupplierAccountHistory2.accountNo"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="开户行: " prop="openingBank">
              <el-input
                size="small"
                :disabled="poSupplierAccountHistory2.editFlag"
                v-model="poSupplierAccountHistory2.openingBank"
                clearable
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="" prop="openingBank" class="showopeningBankBefore">
                    <el-tooltip 
                      :content="poSupplierAccount2.openingBank" 
                      placement="bottom" 
                      effect="light">
                      <el-button 
                      type="text" 
                      class="color-warning" 
                      :disabled="poSupplierAccountHistory2.showBefore">点击查看变更前</el-button>
                    </el-tooltip>
                </el-form-item>-->
            <el-form-item label="开户行地址: " prop="openingAdress">
              <el-input
                size="small"
                :disabled="poSupplierAccountHistory2.editFlag"
                v-model="poSupplierAccountHistory2.openingAdress"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="SWIFT地址: " prop="swiftAdress">
              <el-input
                size="small"
                :disabled="poSupplierAccountHistory2.editFlag"
                v-model="poSupplierAccountHistory2.swiftAdress"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="开户证明: " class="edit-upload" prop="">
              <el-upload
                class="upload-img"
                :disabled="poSupplierAccountHistory2.editFlag"
                v-model="poSupplierAccountHistory2.openingCertif"
                ref="upload"
                action="String"
                accept="image/jpeg, image/png, image/jpg"
                :before-upload="onBeforeUploadImage"
                :http-request="UploadOpeningCertifPrivate"
                :file-list="fileList"
                :show-file-list="false"
              >
                <el-button type="text" :disabled="poSupplierAccountHistory2.editFlag"
                  >点击上传（仅限上传1张,且不超过5M）</el-button
                >
              </el-upload>
              <el-popover placement="right" trigger="click">
                <img style="max-width: 600px" :src="poSupplierAccountHistory2.openingCertifUrl" />
                <el-button
                  type="text"
                  slot="reference"
                  class="color-grey"
                  :disabled="poSupplierAccountHistory2.showOpeningCertif"
                  ><i class="icon-chakan y-reviews" style="position: relative; top: 2px"></i
                ></el-button>
              </el-popover>
            </el-form-item>
            <p class="upload-tip">　如果是第一次编辑无需填写以下内容</p>
            <!-- <el-form-item label="*如果是第一次编辑无需填写一下内容" class="color-grey" label-width="290px"></el-form-item> -->
            <el-form-item label="变更证明: " prop="changeCertif">
              <div class="change-uplaod">
                <el-upload
                  :disabled="poSupplierAccountHistory2.notChangeFlag"
                  class="upload-demo"
                  v-model="poSupplierAccountHistory2.changeCertif"
                  ref="upload"
                  action="String"
                  accept="image/jpeg, image/png, image/jpg"
                  :before-upload="onBeforeUploadImage"
                  :http-request="UploadChangeCertifPrivate"
                  :file-list="fileList"
                  :show-file-list="false"
                >
                  <el-button type="text" :disabled="poSupplierAccountHistory2.notChangeFlag"
                    >点击上传（仅限上传1张,且不超过5M）</el-button
                  >
                </el-upload>

                <el-popover placement="right" trigger="click">
                  <img style="max-width: 600px" :src="poSupplierAccountHistory2.changeCertifUrl" />
                  <el-button
                    type="text"
                    slot="reference"
                    class="color-grey"
                    :disabled="poSupplierAccountHistory2.showChangeCertif"
                    ><i class="icon-chakan y-reviews" style="position: relative; top: 2px"></i
                  ></el-button>
                </el-popover>
              </div>
            </el-form-item>
            <el-form-item label="变更原因" prop="changeReason">
              <el-input
                type="textarea"
                size="small"
                placeholder="不得超过200个字符"
                :disabled="poSupplierAccountHistory2.notChangeFlag"
                v-model="poSupplierAccountHistory2.changeReason"
                clearable
              ></el-input>
            </el-form-item>
            <!-- <div class="float-left">
                  <span class="color-grey">处理状态：</span>
                  <span class="color-warning">{{poSupplierAccountHistory2.approveStatusName}}</span>
                </div> -->
          </el-form>
        </div>
      </div>

      <!-- 审核 -->
      <el-dialog v-bind:title="auditTitle" :visible.sync="auditDialog" width="30%" center>
        <el-radio v-model="auditResult" label="1">同意</el-radio>
        <el-radio v-model="auditResult" label="2" style="margin-left: 30%">拒绝</el-radio>
        <div style="width: 100%; height: 20px"></div>
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="100"
          placeholder="请填写相关信息反馈给开发人员，不得超过100个字符。"
          v-model="refuseReason"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="auditConfrim()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 对公账户查看历史 -->
      <el-dialog v-bind:title="historyDataTitle" :visible.sync="historyDataDialog1" width="40%" center>
        <div style="text-align: center; line-height: 50px; font-size: 20px; font-weight: bold">
          <el-button
            type="text"
            @click="changHistoryData(0)"
            size="medium"
            icon="el-icon-arrow-left"
            style="color: #606266"
          ></el-button>
          <span style="margin-left: 10px; margin-right: 10px; font-size: 20px">
            <strong>{{ historyData.updateTime }}通过</strong>
          </span>
          <el-button
            type="text"
            @click="changHistoryData(1)"
            size="medium"
            icon="el-icon-arrow-right"
            style="color: #606266"
          ></el-button>
        </div>

        <!-- <div class="showHistoryTitilDiv">
                <div class="text-right">
                  <span>提交人：</span>
                  <span class="margin-right-30">{{historyData.createByName}}</span>
                  <span>审核人：</span>
                  <span class="margin-right-30">{{historyData.updateByName}}</span>
                </div>
              </div> -->

        <div class="grid-content">
          <el-form ref="poSupplierAccountForm1" :model="historyData" status-icon class="pre-work">
            <div class="margin-lr-20">
              <el-form-item label="账户名称:" label-position="left">{{ historyData.accountName }}</el-form-item>
              <el-form-item label="银行账号:" label-position="left" class="item-overflow">{{
                historyData.accountNo
              }}</el-form-item>
              <el-form-item label="开户行:" label-position="left">{{ historyData.openingBank }}</el-form-item>
              <el-form-item label="开户行地址:" label-position="left">{{ historyData.openingAdress }}</el-form-item>
              <el-form-item label="开户证明:" label-position="left">
                <el-popover placement="right" trigger="click">
                  <img :src="historyData.openingCertifUrl" style="max-width: 400px" />
                  <!-- <el-button type="text" slot="reference" class="color-grey">查看</el-button> -->
                  <i class="icon-chakan y-reviews" slot="reference"></i>
                </el-popover>
              </el-form-item>
            </div>

            <div class="cus-block-line">
              <el-form-item>
                <span>提交人：</span>
                <span class="margin-right-30">{{ historyData.createByName }}</span>
                <span>审核人：</span>
                <span class="margin-right-30">{{ historyData.updateByName }}</span>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-dialog>

      <!-- 香港账户查看历史 -->
      <el-dialog v-bind:title="historyDataTitle" :visible.sync="historyDataDialog2" width="40%" center>
        <div style="text-align: center; line-height: 50px; font-size: 20px; font-weight: bold">
          <el-button
            type="text"
            @click="changHistoryData(0)"
            size="medium"
            icon="el-icon-arrow-left"
            style="color: #606266"
          ></el-button>
          <span style="margin-left: 10px; margin-right: 10px; font-size: 20px">
            <strong>{{ historyData.updateTime }}通过</strong>
          </span>
          <el-button
            type="text"
            @click="changHistoryData(1)"
            size="medium"
            icon="el-icon-arrow-right"
            style="color: #606266"
          ></el-button>
        </div>
        <!-- <div class="showHistoryTitilDiv">
                <div class="text-right">
                  <span>提交人：</span>
                  <span class="margin-right-30">{{historyData.createByName}}</span>
                  <span>审核人：</span>
                  <span class="margin-right-30">{{historyData.updateByName}}</span>
                </div>
              </div> -->
        <div class="grid-content">
          <el-form ref="poSupplierAccountForm1" :model="historyData" status-icon>
            <div class="margin-lr-20">
              <el-form-item label="账户名称:" label-position="left">{{ historyData.accountName }}</el-form-item>
              <el-form-item label="银行账号:" label-position="left" class="item-overflow">{{
                historyData.accountNo
              }}</el-form-item>
              <el-form-item label="开户行:" label-position="left">{{ historyData.openingBank }}</el-form-item>
              <el-form-item label="开户行地址:" label-position="left">{{ historyData.openingAdress }}</el-form-item>
              <el-form-item label="SWIFT地址:" label-position="left">{{ historyData.swiftAdress }}</el-form-item>
              <el-form-item label="开户证明:" label-position="left">
                <el-popover placement="right" trigger="click">
                  <img :src="historyData.openingCertifUrl" style="max-width: 400px" />
                  <!-- <el-button type="text" slot="reference" class="color-grey">查看</el-button> -->
                  <i class="icon-chakan y-reviews" slot="reference"></i>
                </el-popover>
              </el-form-item>
            </div>
            <div class="cus-block-line">
              <el-form-item>
                <span>提交人：</span>
                <span class="margin-right-30">{{ historyData.createByName }}</span>
                <span>审核人：</span>
                <span class="margin-right-30">{{ historyData.updateByName }}</span>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-dialog>

      <!-- 操作日志 -->
      <pooperatelog ref="pooperatelog"></pooperatelog>
    </basic-container>
  </div>
</template>

<script>
import { getObjBySupplierNo } from "@/api/supplier/posupplieraccount"
import {
  getObjMaxBySupplierNo,
  getHistoryList,
  addObj,
  putObj,
  submitObj,
  withdrawObj,
  auditObj,
  uploadImage
} from "@/api/supplier/posupplieraccounthistory"
import { getTokenUrl } from "@/util/auth"
import { formatDate } from "@/filters/index"
import { mapGetters } from "vuex"
import pooperatelog from "@/views/supplier/log/index"
export default {
  name: "posupplieraccount",
  props: {
    gycode: [String, Number]
  },
  components: {
    pooperatelog
  },
  data() {
    var valiMustFillPublic = (rule, value, callback) => {
      if (!this.poSupplierAccountHistory1.notChangeFlag && !value) {
        callback(new Error(""))
      } else {
        callback()
      }
    }
    var valiMustFillPrivate = (rule, value, callback) => {
      if (!this.poSupplierAccountHistory2.notChangeFlag && !value) {
        callback(new Error(""))
      } else {
        callback()
      }
    }
    return {
      supplierNo: "",
      fileServerUrl: "",
      // supplierNo: '001',
      auditTitle: "财务审核",
      auditDialog: false,
      auditBillId: "",
      auditResult: "", //1同意,2拒绝
      refuseReason: "",
      formData: {},
      fileList: [],
      historyDataTitle: "历史查看",
      historyDataDialog1: false,
      historyDataDialog2: false,
      historyDataList: [],
      historyData: {},
      poSupplierAccount1: {
        supplierNo: "",
        supplierAccountType: "",
        accountName: "",
        accountNo: "",
        openingBank: "",
        openingAdress: "",
        openingCertif: "",
        openingCertifUrl: "",
        swiftAdress: "",
        showOpeningCertif: true
      },
      poSupplierAccount2: {
        supplierNo: "",
        supplierAccountType: "",
        accountName: "",
        accountNo: "",
        openingBank: "",
        openingAdress: "",
        openingCertif: "",
        openingCertifUrl: "",
        swiftAdress: "",
        showOpeningCertif: true
      },
      poSupplierAccountHistory1: {
        supplierAccountHistoryId: "",
        supplierNo: "",
        supplierAccountType: "",
        accountName: "",
        accountNo: "",
        openingBank: "",
        openingAdress: "",
        openingCertif: "",
        openingCertifUrl: "",
        swiftAdress: "",
        changeCertif: "",
        changeCertifUrl: "",
        changeReason: "",
        approveStatus: 0,
        approveStatusName: "未处理",
        editFlag: false,
        notChangeFlag: true,
        showOpeningCertif: true,
        showChangeCertif: true,
        showBefore: true
      },
      poSupplierAccountHistory2: {
        supplierAccountHistoryId: "",
        supplierNo: "",
        supplierAccountType: "",
        accountName: "",
        accountNo: "",
        openingBank: "",
        openingAdress: "",
        openingCertif: "",
        openingCertifUrl: "",
        swiftAdress: "",
        changeCertif: "",
        changeCertifUrl: "",
        changeReason: "",
        approveStatus: 0,
        approveStatusName: "未处理",
        editFlag: false,
        notChangeFlag: true,
        showOpeningCertif: true,
        showChangeCertif: true,
        showBefore: true
      },
      editFormRules1: {
        accountName: [
          { required: true, message: "请输入账户名称", trigger: "blur" },
          { max: 100, message: "账户名称不得超过100个字符", trigger: "blur" }
        ],
        accountNo: [
          { required: true, message: "请输入银行账号", trigger: "blur" },
          { max: 50, message: "银行账号不得超过50个字符", trigger: "blur" }
        ],
        openingBank: [
          { required: true, message: "请输入开户行", trigger: "blur" },
          { max: 100, message: "开户行不得超过100个字符", trigger: "blur" }
        ],
        openingAdress: [
          { required: true, message: "请输入开户行地址", trigger: "blur" },
          { max: 200, message: "开户行地址不得超过200个字符", trigger: "blur" }
        ],
        openingCertif: [{ required: true, message: "请上传开户证明", trigger: "blur" }],
        // changeCertif: [
        //   {validator: valiMustFillPublic, message:'请上传变更证明', trigger: 'blur' },
        // ],
        changeReason: [
          {
            validator: valiMustFillPublic,
            message: "请输入变更原因",
            trigger: "blur"
          },
          { max: 200, message: "变更原因不得超过200个字符", trigger: "blur" }
        ]
      },
      editFormRules2: {
        accountName: [
          { required: true, message: "请输入账户名称", trigger: "blur" },
          { max: 50, message: "账户名称不得超过50个字符", trigger: "blur" }
        ],
        accountNo: [
          { required: true, message: "请输入银行账号", trigger: "blur" },
          { max: 50, message: "银行账号不得超过50个字符", trigger: "blur" }
        ],
        openingBank: [
          { required: true, message: "请输入开户行", trigger: "blur" },
          { max: 100, message: "开户行不得超过100个字符", trigger: "blur" }
        ],
        openingAdress: [
          { required: true, message: "请输入开户行地址", trigger: "blur" },
          { max: 200, message: "开户行地址不得超过200个字符", trigger: "blur" }
        ],
        swiftAdress: [
          { required: true, message: "请输入SWIFT地址", trigger: "blur" },
          { max: 200, message: "SWIFT地址不得超过200个字符", trigger: "blur" }
        ],
        openingCertif: [{ required: true, message: "请上传开户证明", trigger: "blur" }],
        // changeCertif: [
        //   {validator: valiMustFillPrivate, message:'请上传变更证明', trigger: 'blur' },
        // ],
        changeReason: [
          {
            validator: valiMustFillPrivate,
            message: "请输入变更原因",
            trigger: "blur"
          },
          { max: 200, message: "变更原因不得超过200个字符", trigger: "blur" }
        ]
      }
    }
  },
  created() {},
  mounted: function () {
    this.loadAccountDetail()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    /**
     * 加载账号数据
     */
    loadAccountDetail: function () {
      if (this.$route.query.paramSupplierNo) {
        this.supplierNo = this.$route.query.paramSupplierNo
      } else if (this.gycode) {
        this.supplierNo = this.gycode
      } else {
        this.$message.error("请先完善[基本信息]")
        return
      }
      //加载对外账号
      getObjBySupplierNo(this.supplierNo).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            var element = data[index]
            if (element.supplierAccountType == 0) {
              this.poSupplierAccount1 = element
              if (this.poSupplierAccount1.openingCertif) {
                this.poSupplierAccount1.openingCertifUrl = getTokenUrl(this.poSupplierAccount1.openingCertif)
                this.poSupplierAccount1.showOpeningCertif = false
              } else {
                this.poSupplierAccount1.showOpeningCertif = true
              }
            } else if (element.supplierAccountType == 1) {
              this.poSupplierAccount2 = element
              if (this.poSupplierAccount2.openingCertif) {
                this.poSupplierAccount2.openingCertifUrl = getTokenUrl(this.poSupplierAccount2.openingCertif)
                this.poSupplierAccount2.showOpeningCertif = false
              } else {
                this.poSupplierAccount2.showOpeningCertif = true
              }
            }
          }
        }
      })
      //加载编辑账号
      getObjMaxBySupplierNo(this.supplierNo).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            var element = data[index]
            if (element.supplierAccountType == 0) {
              this.poSupplierAccountHistory1 = element
              this.poSupplierAccountHistory1.notChangeFlag = true
              if (this.poSupplierAccountHistory1.approveStatus == 0) {
                this.poSupplierAccountHistory1.approveStatusName = "未处理"
                this.poSupplierAccountHistory1.editFlag = false
              } else if (this.poSupplierAccountHistory1.approveStatus == 1) {
                this.poSupplierAccountHistory1.approveStatusName = "审核中"
                this.poSupplierAccountHistory1.editFlag = true
              } else if (this.poSupplierAccountHistory1.approveStatus == 2) {
                this.poSupplierAccountHistory1.approveStatusName = "审核通过"
                this.poSupplierAccountHistory1.editFlag = true
              }
              if (this.poSupplierAccountHistory1.openingCertif) {
                this.poSupplierAccountHistory1.openingCertifUrl = getTokenUrl(
                  this.poSupplierAccountHistory1.openingCertif
                )
                this.poSupplierAccountHistory1.showOpeningCertif = false
              } else {
                this.poSupplierAccountHistory1.showOpeningCertif = true
              }
              if (this.poSupplierAccountHistory1.changeCertif) {
                this.poSupplierAccountHistory1.changeCertifUrl = getTokenUrl(
                  this.poSupplierAccountHistory1.changeCertif
                )
                this.poSupplierAccountHistory1.showChangeCertif = false
                if (this.poSupplierAccountHistory1.approveStatus == 0) {
                  this.poSupplierAccountHistory1.notChangeFlag = false
                }
                this.poSupplierAccountHistory1.showBefore = false
              } else {
                this.poSupplierAccountHistory1.showChangeCertif = true
              }
            } else if (element.supplierAccountType == 1) {
              this.poSupplierAccountHistory2 = element
              this.poSupplierAccountHistory2.notChangeFlag = true
              if (this.poSupplierAccountHistory2.approveStatus == 0) {
                this.poSupplierAccountHistory2.approveStatusName = "未处理"
                this.poSupplierAccountHistory2.editFlag = false
              } else if (this.poSupplierAccountHistory2.approveStatus == 1) {
                this.poSupplierAccountHistory2.approveStatusName = "审核中"
                this.poSupplierAccountHistory2.editFlag = true
              } else if (this.poSupplierAccountHistory2.approveStatus == 2) {
                this.poSupplierAccountHistory2.approveStatusName = "审核通过"
                this.poSupplierAccountHistory2.editFlag = true
              }
              if (this.poSupplierAccountHistory2.openingCertif) {
                this.poSupplierAccountHistory2.openingCertifUrl = getTokenUrl(
                  this.poSupplierAccountHistory2.openingCertif
                )
                this.poSupplierAccountHistory2.showOpeningCertif = false
              } else {
                this.poSupplierAccountHistory2.showOpeningCertif = true
              }
              if (this.poSupplierAccountHistory2.changeCertif) {
                this.poSupplierAccountHistory2.changeCertifUrl = getTokenUrl(
                  this.poSupplierAccountHistory2.changeCertif
                )
                this.poSupplierAccountHistory2.showChangeCertif = false
                if (this.poSupplierAccountHistory2.approveStatus == 0) {
                  this.poSupplierAccountHistory2.notChangeFlag = false
                }
                this.poSupplierAccountHistory2.showBefore = false
              } else {
                this.poSupplierAccountHistory2.showChangeCertif = true
              }
            }
          }
        }
      })
    },
    /**
     * 保存
     */
    handleSave: function (supplierAccountType) {
      var poSupplierAccountHistory = {}
      var formName = ""
      //对公用户
      if (supplierAccountType == 0) {
        formName = "poSupplierAccountHistoryForm1"
        poSupplierAccountHistory = this.poSupplierAccountHistory1
      } else {
        //香港账号
        formName = "poSupplierAccountHistoryForm2"
        poSupplierAccountHistory = this.poSupplierAccountHistory2
      }

      if (poSupplierAccountHistory.approveStatus != 0) {
        this.$message.warning("只有处理状态为：未处理的，才能保存")
        return
      }

      // 暂时不限制开户和变更证明
      // if (!poSupplierAccountHistory.openingCertif) {
      //   this.$message.warning("请先上传开户证明");
      //   return;
      // }
      // if (
      //   !poSupplierAccountHistory.notChangeFlag &&
      //   !poSupplierAccountHistory.changeCertif
      // ) {
      //   this.$message.warning("请先上传变更证明");
      //   return;
      // }

      //完善账号信息
      poSupplierAccountHistory.supplierAccountType = supplierAccountType
      poSupplierAccountHistory.supplierNo = this.supplierNo

      //验证保存
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //新增
          if (!poSupplierAccountHistory.supplierAccountHistoryId) {
            addObj(poSupplierAccountHistory)
              .then((response) => {
                if (response.data.code == 0) {
                  this.loadAccountDetail()
                  this.$notify({
                    title: "成功",
                    message: "保存成功",
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
          } else {
            //修改
            putObj(poSupplierAccountHistory)
              .then((response) => {
                if (response.data.code == 0) {
                  this.loadAccountDetail()
                  this.$notify({
                    title: "成功",
                    message: "保存成功",
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
          }
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    /**
     * 提交
     */
    handleSubmit: function (supplierAccountType) {
      var poSupplierAccountHistory = {}
      var formName = ""
      //对公用户
      if (supplierAccountType == 0) {
        formName = "poSupplierAccountHistoryForm1"
        poSupplierAccountHistory = this.poSupplierAccountHistory1
      } else {
        //香港账号
        formName = "poSupplierAccountHistoryForm2"
        poSupplierAccountHistory = this.poSupplierAccountHistory2
      }

      if (poSupplierAccountHistory.approveStatus != 0) {
        this.$message.warning("只有处理状态为：未处理，才能提交")
        return
      }
      if (!poSupplierAccountHistory.openingCertif) {
        this.$message.warning("请先上传开户证明")
        return
      }
      if (!poSupplierAccountHistory.notChangeFlag && !poSupplierAccountHistory.changeCertif) {
        this.$message.warning("请先上传变更证明")
        return
      }

      //完善账号信息
      poSupplierAccountHistory.supplierAccountType = supplierAccountType
      poSupplierAccountHistory.supplierNo = this.supplierNo

      //验证保存
      this.$refs[formName].validate((valid) => {
        if (valid) {
          submitObj(poSupplierAccountHistory)
            .then((response) => {
              if (response.data.code == 0) {
                this.loadAccountDetail()
                this.$notify({
                  title: "成功",
                  message: "提交成功",
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
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    /**
     * 撤销提交
     */
    handleWithdraw: function (supplierAccountType) {
      var poSupplierAccountHistory = {}
      //对公用户
      if (supplierAccountType == 0) {
        poSupplierAccountHistory = this.poSupplierAccountHistory1
      } else {
        //香港账号
        poSupplierAccountHistory = this.poSupplierAccountHistory2
      }
      console.log(poSupplierAccountHistory)
      if (poSupplierAccountHistory.approveStatus != 1) {
        this.$message.warning("只有处理状态为：审核中，才能撤销提交")
        return
      }
      withdrawObj(poSupplierAccountHistory.supplierAccountHistoryId)
        .then((response) => {
          if (response.data.code == 0) {
            this.loadAccountDetail()
            this.$notify({
              title: "成功",
              message: "撤销提交成功",
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
    /**
     * 审核
     */
    handleAudit: function (supplierAccountType) {
      var poSupplierAccountHistory = {}

      if (supplierAccountType == 0) {
        //对公用户
        poSupplierAccountHistory = this.poSupplierAccountHistory1
      } else {
        //香港账号
        poSupplierAccountHistory = this.poSupplierAccountHistory2
      }

      if (poSupplierAccountHistory.approveStatus != 1) {
        this.$message.warning("只有处理状态为：审核中，才能审核")
        return
      }
      this.auditResult = ""
      this.refuseReason = ""
      this.auditBillId = poSupplierAccountHistory.supplierAccountHistoryId
      this.auditDialog = true
    },
    /**
     * 确认审核
     */
    auditConfrim: function () {
      if (!this.auditResult) {
        this.$message.warning("请先确认同意还是拒绝")
        return
      }
      if (this.auditResult == 2) {
        if (!this.refuseReason) {
          this.$message.error("请填写拒绝原因")
          return
        }
      }

      //审核参数
      var params = {
        supplierAccountHistoryId: this.auditBillId,
        auditResult: this.auditResult,
        refuseReason: this.refuseReason
      }

      auditObj(params)
        .then((response) => {
          if (response.data.code == 0) {
            this.loadAccountDetail()
            this.auditDialog = false
            this.$notify({
              title: "成功",
              message: "审核成功",
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
    /**
     * 变更--将审核状态的历史账号变为可编辑
     */
    handleChange: function (supplierAccountType) {
      //对公用户
      if (supplierAccountType == 0) {
        if (this.poSupplierAccountHistory1.approveStatus != 2) {
          this.$message.warning("只有处理状态为：已审核，才允许变更")
          return
        }
        this.poSupplierAccount1.supplierAccountHistoryId = this.poSupplierAccountHistory1.supplierAccountHistoryId
        this.poSupplierAccountHistory1.supplierAccountHistoryId = ""
        this.poSupplierAccountHistory1.approveStatus = 0
        this.poSupplierAccountHistory1.approveStatusName = "未处理"
        this.poSupplierAccountHistory1.editFlag = false
        this.poSupplierAccountHistory1.notChangeFlag = false
      } else {
        //香港账号
        if (this.poSupplierAccountHistory2.approveStatus != 2) {
          this.$message.warning("只有处理状态为：已审核，才允许变更")
          return
        }
        this.poSupplierAccount2.supplierAccountHistoryId = this.poSupplierAccountHistory2.supplierAccountHistoryId
        this.poSupplierAccountHistory2.supplierAccountHistoryId = ""
        this.poSupplierAccountHistory2.approveStatus = 0
        this.poSupplierAccountHistory2.approveStatusName = "未处理"
        this.poSupplierAccountHistory2.editFlag = false
        this.poSupplierAccountHistory2.notChangeFlag = false
      }
    },
    /**
     * 查看历史
     */
    showHistory: function (supplierAccountType) {
      this.historyDataList = []
      getHistoryList(this.supplierNo, supplierAccountType).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            var element = data[index]
            if (element.openingCertif) {
              element.openingCertifUrl = getTokenUrl(element.openingCertif)
            }
            var date = new Date(element.updateTime)
            element.updateTime = formatDate(date, "yyyy年MM月dd日")
            this.historyDataList.push(element)
          }
          this.historyData = this.historyDataList[0]
          this.historyData.index = 0
          if (supplierAccountType == 0) {
            this.historyDataDialog1 = true
          } else {
            this.historyDataDialog2 = true
          }
        } else {
          this.$message.warning("没有历史")
          return
        }
      })
    },
    /**
     * 切换历史记录
     */
    changHistoryData: function (type) {
      var index = this.historyData.index
      var count = this.historyDataList.length
      if (type == 0) {
        index = index - 1
      } else {
        index = index + 1
      }
      if (index == -1) {
        index = count - 1
      } else if (index == count) {
        index = 0
      }
      this.historyData = this.historyDataList[index]
      this.historyData.index = index
    },
    //查看日志
    showOperateLog(supplierAccountType) {
      var bill = ""

      if (supplierAccountType == 0) {
        //对公用户
        if (this.poSupplierAccountHistory1.supplierAccountHistoryId) {
          bill = this.poSupplierAccountHistory1.supplierAccountHistoryId
        } else {
          bill = this.poSupplierAccount1.supplierAccountHistoryId
        }
      } else {
        //香港账号
        if (this.poSupplierAccountHistory2.supplierAccountHistoryId) {
          bill = this.poSupplierAccountHistory2.supplierAccountHistoryId
        } else {
          bill = this.poSupplierAccount2.supplierAccountHistoryId
        }
      }
      this.$refs.pooperatelog.showOperateLogDialog(bill, 4)
    },
    /**
     * 图片上传所需要的方法
     */
    onBeforeUploadImage(file) {
      const isIMAGE = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png"
      const isLt1M = file.size / 1024 / 1024 < 5

      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!")
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 5MB!")
      }
      return isIMAGE && isLt1M
    },
    /**
     * 上传对公账户开户证明
     */
    UploadOpeningCertifPublic(param) {
      this.formData = new FormData()
      this.formData.append("file", param.file, param.file.name)
      this.$refs.upload.clearFiles()
      uploadImage(this.formData).then((data) => {
        const uTmp = getTokenUrl(data.data.data)
        this.poSupplierAccountHistory1.openingCertif = data.data.data
        this.poSupplierAccountHistory1.openingCertifUrl = uTmp
        this.poSupplierAccountHistory1.showOpeningCertif = false
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
      })
    },
    /**
     * 上传对公账户变更证明
     */
    UploadChangeCertifPublic(param) {
      this.formData = new FormData()
      this.formData.append("file", param.file, param.file.name)
      this.$refs.upload.clearFiles()
      uploadImage(this.formData).then((data) => {
        const uTmp = getTokenUrl(data.data.data)
        this.poSupplierAccountHistory1.changeCertif = data.data.data
        this.poSupplierAccountHistory1.changeCertifUrl = uTmp
        this.poSupplierAccountHistory1.showChangeCertif = false
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
      })
    },
    /**
     * 上传香港账户开户证明
     */
    UploadOpeningCertifPrivate(param) {
      this.formData = new FormData()
      this.formData.append("file", param.file, param.file.name)
      this.$refs.upload.clearFiles()
      uploadImage(this.formData).then((data) => {
        const uTmp = getTokenUrl(data.data.data)
        this.poSupplierAccountHistory2.openingCertif = data.data.data
        this.poSupplierAccountHistory2.openingCertifUrl = uTmp
        this.poSupplierAccountHistory2.showOpeningCertif = false
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
      })
    },
    /**
     * 上传香港账户开户证明
     */
    UploadChangeCertifPrivate(param) {
      this.formData = new FormData()
      this.formData.append("file", param.file, param.file.name)
      this.$refs.upload.clearFiles()
      uploadImage(this.formData).then((data) => {
        const uTmp = getTokenUrl(data.data.data)
        this.poSupplierAccountHistory2.changeCertif = data.data.data
        this.poSupplierAccountHistory2.changeCertifUrl = uTmp
        this.poSupplierAccountHistory2.showChangeCertif = false
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
@import "../common";
</style>
