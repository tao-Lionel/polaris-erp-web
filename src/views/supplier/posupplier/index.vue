<template>
  <div class="execution common" id="posupplier-wrapper">
    <basic-container>
      <div v-show="paramSupplierNo && paramSupplierNo !== '' && paramSupplierNo !== null">
        <div style="width: 100%">
          <el-button
            type="text"
            class="color-change font-size-20"
            v-if="permissions.posupplier_base_history"
            @click="showHistory(0)"
            >查看历史</el-button
          >
        </div>

        <div class="posupplier-info">
          <!-- 地址 -->
          <div class="posupplier-info-box">
            <div class="posupplier-info-title">
              <strong>地址</strong>
            </div>

            <ul class="posupplier-info-content">
              <li>
                <span class="span-nowrap">供应商编码:</span>
                <span>{{ posupplier.supplierNo }}</span>
              </li>
              <li>
                <span class="span-nowrap">供应商名称:</span>
                <span>{{ posupplier.supplierName }}</span>
              </li>
              <li>
                <span class="span-nowrap">通讯地址:</span>
                <span>{{ posupplier.postalAdress }}</span>
              </li>
              <li>
                <span class="span-nowrap">公司网址:</span>
                <span>{{ posupplier.sitPage }}</span>
              </li>
              <li>
                <span class="span-nowrap">供应商简称:</span>
                <span>{{ posupplier.abbreviation }}</span>
              </li>
            </ul>
          </div>

          <!-- <el-form label-width="95px" status-icon>
              <el-form-item  label="供应商编码:" label-position="left" class="margin_top-20">{{posupplier.supplierNo}}</el-form-item>
              <el-form-item  label="供应商名称:" label-position="left" class="margin_top-20">{{posupplier.supplierName}}</el-form-item>
              <el-form-item  label="通讯地址:" label-position="left" class="margin_top-20">{{posupplier.postalAdress}}</el-form-item>
              <el-form-item  label="公司网址:" label-position="left" class="margin_top-20">{{posupplier.sitPage}}</el-form-item>
            </el-form>-->
          <!-- 注册 -->
          <div class="posupplier-info-box">
            <div class="posupplier-info-title">
              <strong>注册</strong>
            </div>

            <ul class="posupplier-info-content">
              <li>
                <span class="span-nowrap">法人代表:</span>
                <span>{{ posupplier.legalName }}</span>
              </li>
              <li>
                <span class="span-nowrap">营业执照号:</span>
                <span>{{ posupplier.licenseNo }}</span>

                <el-popover placement="right" trigger="click">
                  <img style="max-width: 600px" :src="posupplier.uploadFileUrl" />
                  <el-button
                    style="padding: 0; margin: 0 5px; width: 25px"
                    type="text"
                    size="mini"
                    slot="reference"
                    class="color-grey"
                    :disabled="showAttach"
                  >
                    <i v-if="!showAttach" class="icon-chakan y-reviews"></i>
                  </el-button>
                </el-popover>
              </li>
              <li>
                <span class="span-nowrap">注册时间:</span>
                <span>{{ posupplier.registDate }}</span>
              </li>
              <li>
                <span class="span-nowrap">营业期限:</span>
                <span
                  >{{ dataFormat(posupplier.businessTermStart) }} 至 {{ dataFormat(posupplier.businessTermEnd) }}</span
                >
              </li>
              <li>
                <span class="span-nowrap">注册地址:</span>
                <span>{{ posupplier.registAdress }}</span>
              </li>
              <li>
                <span class="span-nowrap">注册资金:</span>
                <span>{{ posupplier.registCapital }}</span>
              </li>
            </ul>
          </div>
          <!-- 管理 -->
          <div class="posupplier-info-box">
            <div class="posupplier-info-title">
              <strong>管理</strong>
            </div>

            <ul class="posupplier-info-content">
              <li>
                <span class="span-nowrap">行业:</span>
                <span>{{ posupplier.industry }}</span>
              </li>
              <li>
                <span class="span-nowrap">公司性质:</span>
                <span>{{ posupplier.businessType }}</span>
              </li>
              <li>
                <span class="span-nowrap">公司规模:</span>
                <span>{{ posupplier.companyScale }}</span>
              </li>
              <li>
                <span class="span-nowrap">供应商等级:</span>
                <el-select style="width: 100%" v-model="posupplier.creditLevel" size="mini" :disabled="true">
                  <el-option
                    v-for="item in supplierLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <span class="span-nowrap">付款方式:</span>
                <el-select style="width: 100%" v-model="posupplier.settleaccountTypeId" size="mini" :disabled="true">
                  <el-option
                    v-for="item in settleaccountOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="posupplier-last-box">
        <div class="posupplier-last-header">
          <div>
            <strong class="margin-right_15">最近一次编辑</strong>
            <span>(</span>
            <span>
              <span>提交人：</span>
              <span class="margin-right_15">{{ operationUser }};</span>
              <span v-show="handleStatus !== ''">处理状态：</span>
              <span v-show="handleStatus !== ''" class="y-reviews"
                ><a href="javascript:void(0)" @click="showOperateLog()">{{ handleStatus }}</a></span
              >
            </span>
            <span>)</span>
          </div>

          <div class="text-right">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              v-if="permissions.posupplier_base_save"
              @click="saveSupplier()"
              >保 存</el-button
            >
            <el-button
              size="small"
              type="primary"
              icon="el-icon-upload"
              v-if="permissions.posupplier_base_submit"
              @click="submitSupplier()"
              >提 交</el-button
            >
            <el-button
              type="warning"
              size="small"
              icon="el-icon-back"
              v-if="permissions.posupplier_base_submit"
              @click="cancelSubmitSupplier()"
              >撤 提</el-button
            >
            <el-button
              type="primary"
              size="small"
              icon="el-icon-check"
              v-if="permissions.posupplier_base_audit"
              @click="auditDialog()"
              >审 核</el-button
            >
            <el-button
              type="warning"
              size="small"
              icon="el-icon-edit"
              v-if="permissions.posupplier_base_edit"
              @click="editSupplier()"
              >编 辑</el-button
            >
          </div>
        </div>

        <div class="posupplier-eidt-box">
          <div class="flow-left">
            <el-form :model="editsupplier" ref="editsupplier001" status-icon class="margin_top-20">
              <el-form-item label="供应商编码:" prop="supplierNo" label-position="left">
                <el-input
                  size="small"
                  v-model="editsupplier.supplierNo"
                  placeholder="系统自动生成"
                  :disabled="true"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="供应商名称:"
                prop="supplierName"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-input
                  size="small"
                  v-model.trim="editsupplier.supplierName"
                  placeholder="不得超过255位字符"
                  maxlength="255"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
              <el-form-item label="供应商简称:" prop="abbreviation" label-position="left">
                <el-input
                  size="small"
                  v-model.trim="editsupplier.abbreviation"
                  placeholder="不得超过50位字符"
                  maxlength="50"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
              <el-form-item label="公司网址:" prop="sitPage" label-position="left">
                <el-input
                  size="small"
                  v-model.trim="editsupplier.sitPage"
                  placeholder="不得超过50位字符"
                  maxlength="50"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="国家:"
                prop="countryCode"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-select
                  size="small"
                  v-model="editsupplier.countryCode"
                  clearable
                  filterable
                  placeholder="国家"
                  :disabled="editFlag"
                  @change="changeCountry"
                >
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.value"
                    :label="item.countryShortName"
                    :value="item.countryCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="区域:"
                prop="deliveryRegionCode"
                label-position="left"
                :rules="
                  editsupplier.countryCode === 'US'
                    ? { required: true, message: '必填字段', trigger: 'blur' }
                    : [{ required: false }]
                "
              >
                <el-select
                  v-model="editsupplier.deliveryRegionCode"
                  size="small"
                  filterable
                  clearable
                  :disabled="editFlag"
                  placeholder="区域"
                >
                  <el-option
                    v-for="item in regionOptions"
                    :key="item.mappingCode"
                    :label="item.mappingName"
                    :value="item.mappingCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="供应商地址:"
                prop="postalAdress"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-input
                  size="small"
                  v-model.trim="editsupplier.postalAdress"
                  placeholder="不得超过200位字符"
                  maxlength="200"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
              <a @click="addAddress">添加国家区域地址</a>
              <!-- <el-form-item
                label="供应商法人主体:"
                prop="a"
                label-position="left"
                v-if="false"
                :rules="{ required: true, message: '必填字段', trigger: 'change' }"
              >
                <el-select v-model="editsupplier.a" size="small" :disabled="editFlag">
                  <el-option
                    v-for="item in frArr"
                    :key="item.corporationId"
                    :label="item.corporationName"
                    :value="item.corporationId"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item
                label="卖方抬头:"
                prop="contractHeader"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-input
                  size="small"
                  v-model.trim="editsupplier.contractHeader"
                  placeholder="不得超过255位字符"
                  maxlength="255"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
              <el-form-item label="供应商战略合同:" prop="strategyContractTerm" label-position="left">
                <el-date-picker
                  size="small"
                  v-model="editsupplier.strategyContractTerm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :disabled="editFlag"
                ></el-date-picker>

                <s-upload
                  :updateFileId="editsupplier.supplierStrategyContract"
                  accept=".pdf"
                  :disabled="editFlag"
                  :maxMB="20"
                  @uploadSuccess="uploadSuccess"
                >
                </s-upload>
              </el-form-item>
              <el-form-item label="供应商战略合同编号:" prop="supplierStrategyContractNo" label-position="left">
                <el-input
                  size="small"
                  v-model.trim="editsupplier.supplierStrategyContractNo"
                  placeholder="不得超过255位字符"
                  maxlength="255"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="flow-left">
            <el-form :model="editsupplier" ref="editsupplier002" status-icon class="margin_top-20">
              <el-form-item
                label="法人代表:"
                prop="legalName"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-input
                  size="small"
                  v-model.trim="editsupplier.legalName"
                  placeholder=" 不得超过20位字符"
                  maxlength="20"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
              <el-form-item label="营业执照号:" prop="licenseNo" label-position="left">
                <!-- :rules="{ required: true, message: '必填字段', trigger: 'blur' }" -->
                <el-input
                  size="small"
                  v-model.trim="editsupplier.licenseNo"
                  placeholder="不得超过50位字符"
                  maxlength="50"
                  :disabled="onlyOnesShow"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <div class="posupplier-upload-box">
                  <!-- ----{{editsupplier.uploadFileUrl}}--- -->

                  <el-upload
                    class="upload-demo"
                    v-model="editsupplier.uploaFile"
                    ref="upload"
                    action="String"
                    accept="image/jpeg, image/png, image/jpg"
                    :before-upload="onBeforeUploadImage"
                    :http-request="UploadOpeningCertifPublic"
                    :file-list="fileList"
                    :disabled="onlyOnesShow"
                    :show-file-list="false"
                  >
                    <el-badge
                      :is-dot="editsupplier.uploadFileUrl !== '' && editsupplier.uploadFileUrl !== null"
                      class="item"
                    >
                      <el-button type="text" class="color-grey" :disabled="onlyOnesShow"
                        >点击上传（仅1张且小于5M图片）</el-button
                      >
                    </el-badge>
                  </el-upload>

                  <el-popover v-if="editsupplier.uploadFileUrl" placement="right" trigger="click">
                    <img style="max-width: 600px" :src="editsupplier.uploadFileUrl" />

                    <el-button type="text" slot="reference" class="color-grey" :disabled="showEditAttach"
                      ><i class="icon-chakan y-reviews"></i
                    ></el-button>
                  </el-popover>
                </div>
              </el-form-item>
              <el-form-item
                label="注册时间:"
                prop="registDate"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-date-picker
                  size="small"
                  v-model="editsupplier.registDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  placeholder="请输入注册时间"
                  :disabled="editFlag"
                ></el-date-picker>
              </el-form-item>

              <el-form-item
                label="营业期限:"
                prop="businessTerm"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-date-picker
                  size="small"
                  v-model="editsupplier.businessTerm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :disabled="editFlag"
                  :picker-options="pickerOptions1"
                ></el-date-picker>
              </el-form-item>

              <el-form-item
                label="注册地址:"
                prop="registAdress"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-input
                  size="small"
                  v-model.trim="editsupplier.registAdress"
                  placeholder="不得超过200位字符"
                  maxlength="200"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
              <el-form-item label="注册资金:" prop="registCapital" label-position="left">
                <el-input
                  size="small"
                  v-model.trim="editsupplier.registCapital"
                  placeholder="请输入注册资金"
                  maxlength="20"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="flow-left">
            <el-form :model="editsupplier" ref="editsupplier003" status-icon class="margin_top-20">
              <el-form-item
                label="行业:"
                prop="industry"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-input
                  size="small"
                  v-model.trim="editsupplier.industry"
                  placeholder="不得超过20个字符"
                  maxlength="20"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="供货来源:"
                prop="supplierSource"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'change' }"
              >
                <el-select v-model="editsupplier.supplierSource" size="small" :disabled="editFlag" clearable>
                  <el-option
                    v-for="item in supplierTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                label="公司性质:"
                prop="businessType"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-input
                  size="small"
                  v-model.trim="editsupplier.businessType"
                  placeholder="不得超过20个字符"
                  maxlength="20"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="公司规模:"
                prop="companyScale"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
              >
                <el-input
                  size="small"
                  v-model.trim="editsupplier.companyScale"
                  placeholder="不得超过20个字符"
                  maxlength="20"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="供应商等级:"
                prop="creditLevel"
                label-position="left"
                placeholder="请选择"
                :rules="{ required: true, message: '必填字段', trigger: 'change' }"
              >
                <el-select v-model="editsupplier.creditLevel" size="small" :disabled="editFlag">
                  <el-option
                    v-for="item in supplierLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="付款方式:"
                prop="settleaccountTypeId"
                placeholder="请选择"
                :rules="{ required: true, message: '必填字段', trigger: 'change' }"
              >
                <el-select v-model="editsupplier.settleaccountTypeId" size="small" :disabled="editFlag">
                  <el-option
                    v-for="item in settleaccountOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="供应商类型:"
                prop="isCorporationType"
                :rules="{ required: true, message: '必填字段', trigger: 'change' }"
              >
                <el-radio-group v-model="editsupplier.isCorporationType" @input="modifyType">
                  <el-radio :label="1">内部供应商</el-radio>
                  <el-radio :label="2">外部供应商</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="对应内部组织:"
                prop="corporationId"
                label-position="left"
                v-if="editsupplier.isCorporationType === 1"
                :rules="{ required: true, message: '必填字段', trigger: 'change' }"
              >
                <el-select v-model="editsupplier.corporationId" size="small" clearable :disabled="editFlag">
                  <el-option
                    v-for="item in frArr"
                    :key="item.corporationId"
                    :label="item.corporationName"
                    :value="item.corporationId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="使用组织:"
                prop="corporationIdList"
                label-position="left"
                :rules="{ required: true, message: '必填字段', trigger: 'change' }"
              >
                <el-select
                  v-model="editsupplier.corporationIdList"
                  size="small"
                  multiple
                  collapse-tags
                  :disabled="editFlag"
                >
                  <el-option
                    v-for="item in frArr"
                    :key="item.corporationId"
                    :label="item.corporationName"
                    :value="item.corporationId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <!-- 历史查看 -->
      <el-dialog title="查看历史" :visible.sync="historyDataDialog" width="520px" top="5vh" class="view-history">
        <el-row>
          <el-col :span="24">
            <!-- <div class="grid-content"> -->
            <div style="text-align: center; line-height: 50px; font-size: 18px; font-weight: bold">
              <el-button
                type="text"
                @click="showHistory(-1)"
                size="medium"
                icon="el-icon-arrow-left"
                style="color: #606266"
              ></el-button>
              <span style="margin-left: 20px; margin-right: 20px; font-size: 18px">
                <strong>{{ dataFormat(historyData.updateTime) }}&nbsp;通过</strong>
              </span>
              <el-button
                type="text"
                @click="showHistory(1)"
                size="medium"
                icon="el-icon-arrow-right"
                style="color: #606266"
              ></el-button>
            </div>
            <!-- </div> -->
          </el-col>
        </el-row>

        <div class="grid-content">
          <el-form status-icon>
            <div class="margin-lr-20">
              <el-form-item label="供应商编码:" label-position="left" class="pre-wrap-mark">{{
                historyData.supplierNo
              }}</el-form-item>
              <el-form-item label="供应商名称:" label-position="left">{{ historyData.supplierName }}</el-form-item>
              <el-form-item label="通讯地址:" label-position="left" class="pre-wrap-mark">{{
                historyData.postalAdress
              }}</el-form-item>
              <el-form-item label="公司网址:" label-position="left" class="pre-wrap-mark">{{
                historyData.sitPage
              }}</el-form-item>
            </div>

            <div class="cus-block-line">
              <el-form-item label="法人代表:" label-position="left">{{ historyData.legalName }}</el-form-item>
              <el-form-item label="营业执照号:" label-position="left">
                {{ historyData.licenseNo }}
                <el-popover placement="right" width="500" trigger="click">
                  <img style="width: 100%" :src="historyData.uploadFileUrl" />
                  <!-- <el-button
                        type="text"
                        slot="reference"
                        class="color-grey"
                        :disabled="showAttach"
                      >查看</el-button> -->
                  <i class="icon-chakan y-reviews" :disabled="showAttach" slot="reference"></i>
                </el-popover>
              </el-form-item>
              <el-form-item label="注册时间:" label-position="left">{{ historyData.registDate }}</el-form-item>
              <el-form-item label="营业期限:" label-position="left"
                >{{ dataFormat(historyData.businessTermStart) }} 至
                {{ dataFormat(historyData.businessTermEnd) }}</el-form-item
              >
              <el-form-item class="pre-wrap-mark" label="注册地址:" label-position="left">{{
                historyData.registAdress
              }}</el-form-item>
              <el-form-item label="注册资金:" label-position="left">{{ historyData.registCapital }}</el-form-item>
            </div>

            <div class="cus-block-line">
              <el-form-item class="pre-wrap-mark" label="行业:" label-position="left">{{
                historyData.industry
              }}</el-form-item>
              <el-form-item class="pre-wrap-mark" label="公司性质:" label-position="left">{{
                historyData.businessType
              }}</el-form-item>
              <el-form-item class="pre-wrap-mark" label="公司规模:" label-position="left">{{
                historyData.companyScale
              }}</el-form-item>
              <el-form-item label="供应商等级:" label-position="left">
                <el-select v-model="historyData.creditLevel" size="small" :disabled="true">
                  <el-option
                    v-for="item in supplierLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="付款方式:" label-position="left">
                <el-select v-model="historyData.settleaccountTypeId" size="mini" :disabled="true">
                  <el-option
                    v-for="item in settleaccountOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
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

        <!-- <el-row>
            <el-col :span="24">
              <div class="bg-purple bd-radius">
                <div class="showHistoryTitilDiv">
                  <div class="text-right">
                    <span>提交人：</span>
                    <span class="margin-right-30">{{historyData.createByName}}</span>
                    <span>审核人：</span>
                    <span class="margin-right-30">{{historyData.updateByName}}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row> -->
      </el-dialog>
      <!-- 审核 -->
      <el-dialog title="财务审核" :visible.sync="centerDialogVisible" width="30%" center>
        <div>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="拒绝的时候请输入原因,最大为180字符."
            maxlength="180"
            v-model="auditText"
          ></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="auditSupplier(0)">拒 绝</el-button>
          <el-button size="small" type="primary" @click="auditSupplier(2)">通 过</el-button>
        </span>
      </el-dialog>
      <!-- 操作日志 -->
      <pooperatelog ref="pooperatelog"></pooperatelog>
    </basic-container>
    <addressDialog ref="addressDialogRef" @updateFormData="updateFormData"></addressDialog>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  getHistoryObj,
  audit,
  showHistory,
  cancelSubmit
} from "@/api/supplier/posupplier"
import { fetchList as getSettleaccounttype } from "@/api/purchase/posettleaccounttype"
import { getAll } from "@/api/baseSetup/bsecorporation"
import { uploadImage } from "@/api/supplier/posupplieraccounthistory"
import { remote } from "@/api/admin/dict.js"
import { getTokenUrl, getDictByType } from "@/util/auth"
import { mapGetters } from "vuex"
import pooperatelog from "@/views/supplier/log/index"
import sUpload from "./components/upload"
import { getCountry } from "@/api/baseSetup/bsecountry"
import addressDialog from "./components/addressDialog.vue"

export default {
  name: "posupplier",
  components: {
    pooperatelog,
    sUpload,
    addressDialog
  },
  data() {
    return {
      posupplier: {
        supplierNo: "",
        supplierName: "",
        postalAdress: "",
        sitPage: "",
        legalName: "",
        licenseNo: "",
        registDate: "",
        businessTermStart: "",
        businessTermEnd: "",
        registAdress: "",
        registCapital: "",
        industry: "",
        businessType: "",
        companyScale: "",
        creditLevel: "",
        licenseNoAttach: "",
        uploadFileUrl: "",
        showOpeningFile: true
      },
      editsupplier: {
        supplierHistoryId: "",
        supplierNo: "",
        supplierName: "",
        postalAdress: "",
        sitPage: "",
        legalName: "",
        licenseNo: "",
        registDate: "",
        businessTerm: [],
        businessTermStart: "",
        businessTermEnd: "",
        registAdress: "",
        registCapital: "",
        industry: "",
        businessType: "",
        companyScale: "",
        creditLevel: "",
        approveStatus: "",
        status: "",
        licenseNoAttach: "",
        uploaFile: "",
        uploadFileUrl: "",
        showOpeningFile: true,
        corporationIdList: [],
        corporationId: "",
        isCorporationType: 1,
        strategyContractTerm: [],
        strategyContractTermStart: "",
        strategyContractTermEnd: "",
        supplierStrategyContract: null,
        supplierStrategyContractNo: "",
        supplierSource: "",
        deliveryRegionCode: "",
        countryCode: "",
        deliveryInfos: []
      },
      historyData: {
        supplierNo: "",
        supplierName: "",
        postalAdress: "",
        sitPage: "",
        legalName: "",
        licenseNo: "",
        registDate: "",
        businessTermStart: "",
        businessTermEnd: "",
        registAdress: "",
        registCapital: "",
        industry: "",
        businessType: "",
        companyScale: "",
        creditLevel: "",
        licenseNoAttach: "",
        uploadFileUrl: "",
        showOpeningFile: true,
        createByName: "",
        updateTime: "",
        updateByName: ""
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: "永远-forever",
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              //date.setTime(date.getTime() - 3600 * 10000 * 24 * 7);
              end.setYear("9999")
              end.setMonth("01")
              end.setDate("01") //前端月份怎么默认加1
              picker.$emit("pick", [start, end])
            }
          }
        ]
      },
      fileList: [],
      supplierLevel: [],
      paramSupplierNo: this.$route.query.paramSupplierNo,
      editFlag: false,
      oldstatus: "",
      centerDialogVisible: false,
      historyDataDialog: false,
      showEditAttach: true,
      showAttach: true,
      onlyOnesShow: false,
      auditText: "",
      operationUser: "",
      handleStatus: "",
      historyLimit: 1,
      fileServerUrl: "",
      frArr: [],
      settleaccountOptions: [],
      supplierTypeOptions: [],
      countryOptions: [],
      regionOptions: [],
      warehouseRegion: [],
      addressList: []
    }
  },
  async created() {
    this.getSupplierLevel()
    getSettleaccounttype({
      current: -1,
      size: -1
    }).then((res) => {
      res.data.data.records.forEach((item) => {
        this.settleaccountOptions.push({
          label: item.settleaccountName,
          value: item.settleaccountTypeId
        })
      })
    })
    getAll().then((res) => {
      console.log(1111, res)
      if (res.data.code === 0) {
        this.frArr = res.data.data
      }
    })
  },
  mounted: async function () {
    await this.init()
    this.getRecord() //根据传来的编码查询
    this.operationUser = this.userInfo.username
  },
  computed: {
    ...mapGetters(["permissions", "userInfo"])
  },
  methods: {
    async init() {
      this.supplierTypeOptions = await getDictByType("supplier_source")
      /**
       * 查询国家地区
       */
      const { data } = await getCountry()
      this.countryOptions = data.data
      this.warehouseRegion = await getDictByType("warehouse_region")
    },
    modifyType(val) {
      if (val === 2) {
        this.editsupplier.corporationId = ""
      }
    },
    uploadChange(file, fileList) {
      this.fileList3 = fileList.slice(0)
    },
    saveSupplier() {
      if (this.editsupplier.approveStatus == 1 || this.editsupplier.approveStatus == 2) {
        this.$message.error("已经提交了的数据不能在进行保存!")
        return
      }
      var ckeck = true
      this.$refs["editsupplier001"].validate((valid) => {
        if (!valid) {
          ckeck = false
        }
      })
      this.$refs["editsupplier002"].validate((valid) => {
        if (!valid) {
          ckeck = false
        }
      })
      this.$refs["editsupplier003"].validate((valid) => {
        if (!valid) {
          ckeck = false
        }
      })
      if (ckeck) {
        this.editsupplier.approveStatus = 0
        this.editsupplier.businessTermStart = this.editsupplier.businessTerm[0]
        this.editsupplier.businessTermEnd = this.editsupplier.businessTerm[1]

        if (this.editsupplier.strategyContractTerm && this.editsupplier.strategyContractTerm.length > 0) {
          this.editsupplier.strategyContractTermStart = this.editsupplier.strategyContractTerm[0]
          this.editsupplier.strategyContractTermEnd = this.editsupplier.strategyContractTerm[1]
        }

        this.editsupplier.deliveryInfos = [
          {
            deliveryCountryCode: this.editsupplier.countryCode,
            deliveryRegionCode: this.editsupplier.deliveryRegionCode,
            postalAddress: this.editsupplier.postalAdress
          },
          ...this.addressList
        ]

        console.log("this.editsupplier", this.editsupplier)

        addObj(this.editsupplier)
          .then((response) => {
            if (response.data.code == 0) {
              this.$message.success("保存成功!")
              this.editsupplier.supplierHistoryId = response.data.data.supplierHistoryId
              this.operationUser = response.data.data.createByName
              //往父页面返回值
              this.$emit("save-success", response.data.data.supplierNo)
              this.showStatus(0)
              this.goBack()
            } else {
              this.$message.error(response.data.msg)
            }
          })
          .finally(() => {})
      }
    },
    goBack() {
      this.$router.$avueRouter.closeTag()
      this.$router.push({
        path: "/purchase/supplier/list"
      })
    },
    editSupplier() {
      //提交待审核的数据不能修改
      if (this.editsupplier.approveStatus == 1) {
        this.$message.error("提交待审核的数据不能修改!")
        return
      }
      if (this.editsupplier.approveStatus == 0) {
        this.$message.error("需要保存的数据，请直接点保存按钮!")
        return
      }
      this.oldstatus = this.editsupplier.approveStatus
      this.editsupplier.approveStatus = 0
      // this.editsupplier.supplierHistoryId = ""
      this.editFlag = false
      this.onlyOnesShow = false
      //营业执照被审核过一次后，就不能再修改
      if (!this.isNulls(this.posupplier.supplierNo)) {
        this.onlyOnesShow = true
      }
    },
    submitSupplier() {
      //提交数据
      if (this.editsupplier.approveStatus != "" || this.editsupplier.approveStatus !== 0) {
        this.$message.error("已经提交过的数据不需要再次提交!")
        return
      }
      // if (this.editsupplier.supplierHistoryId == "") {
      //   this.$message.error("请先保存再进行提交!");
      //   return;
      // }
      var ckeck = true
      this.$refs["editsupplier001"].validate((valid) => {
        if (!valid) {
          ckeck = false
        }
      })
      this.$refs["editsupplier002"].validate((valid) => {
        if (!valid) {
          ckeck = false
        }
      })
      this.$refs["editsupplier003"].validate((valid) => {
        if (!valid) {
          ckeck = false
        }
      })

      if (ckeck) {
        this.oldstatus = this.editsupplier.approveStatus
        this.editsupplier.approveStatus = 1
        this.editsupplier.businessTermStart = this.editsupplier.businessTerm[0]
        this.editsupplier.businessTermEnd = this.editsupplier.businessTerm[1]

        if (this.editsupplier.strategyContractTerm && this.editsupplier.strategyContractTerm.length > 0) {
          this.editsupplier.strategyContractTermStart = this.editsupplier.strategyContractTerm[0]
          this.editsupplier.strategyContractTermEnd = this.editsupplier.strategyContractTerm[1]
        }

        this.editsupplier.deliveryInfos = [
          {
            deliveryCountryCode: this.editsupplier.countryCode,
            deliveryRegionCode: this.editsupplier.deliveryRegionCode,
            postalAddress: this.editsupplier.postalAdress
          },
          ...this.addressList
        ]

        addObj(this.editsupplier)
          .then((response) => {
            if (response.data.code == 0) {
              // this.oldstatus = this.editsupplier.approveStatus;
              this.$message.success("提交成功!")
              this.editsupplier.supplierHistoryId = response.data.data.supplierHistoryId
              this.operationUser = response.data.data.createByName
              //往父页面返回值
              this.$emit("save-success", response.data.data.supplierNo)
              this.showStatus(1)
              //用户和操作状态修改
              this.editFlag = true
              this.onlyOnesShow = true
              this.goBack()
            } else {
              this.editsupplier.approveStatus = this.oldstatus
              // this.editsupplier.approveStatus = -1;
              this.$message.error(response.data.msg)
            }
          })
          .finally(() => {})
      }
    },
    //撤销提交
    cancelSubmitSupplier() {
      if (this.editsupplier.approveStatus != 1 || this.editsupplier.supplierHistoryId == "") {
        this.$message.error("数据状态不是已提交，不能进行撤销!")
        return
      }

      cancelSubmit(this.editsupplier.supplierHistoryId)
        .then((response) => {
          if (response.data.code == 0) {
            this.$message.success("撤销成功")
            this.editsupplier.approveStatus = 0
            this.showStatus(0)
            this.editFlag = false
            this.onlyOnesShow = false
            //营业执照被审核过一次后，就不能再修改
            if (!this.isNulls(this.posupplier.supplierNo)) {
              this.onlyOnesShow = true
            }
          } else {
            this.$message.error(response.data.msg)
          }
        })
        .finally(() => {})
    },
    //审核
    auditDialog() {
      if (this.editsupplier.supplierHistoryId == "" || this.editsupplier.approveStatus != 1) {
        this.$message.error("只有提交过的数据才能进行审查!")
        return
      }
      this.centerDialogVisible = true
    },
    auditSupplier(flag) {
      var refuseText = this.auditText.trim()
      if (flag == 0 && refuseText == "") {
        this.$message.error("请填写拒绝原因!")
        return
      }

      audit(this.editsupplier.supplierHistoryId, flag, refuseText)
        .then((response) => {
          //审核成功
          if (response.data.code == 0) {
            this.centerDialogVisible = false
            this.auditText = ""
            this.$message.success("操作成功!")
            //页面数据重新加载
            this.paramSupplierNo = this.editsupplier.supplierNo
            this.getRecord()
          }
        })
        .finally(() => {})
    },
    //获取数据
    getRecord() {
      if (this.paramSupplierNo) {
        getObj(this.paramSupplierNo).then((response) => {
          if (response.data.code == 0 && response.data.data != null) {
            this.posupplier = response.data.data

            this.posupplier.creditLevel = response.data.data.creditLevel + ""

            //图片查看
            if (response.data.data.licenseNoAttach != null && response.data.data.licenseNoAttach != "") {
              this.showAttach = false
              this.posupplier.uploadFileUrl = getTokenUrl(response.data.data.licenseNoAttach)
            }
          }

          getHistoryObj(this.paramSupplierNo).then((response) => {
            if (response.data.code == 0 && response.data.data != null) {
              var termTemp = new Array()
              termTemp[0] = response.data.data.businessTermStart
              termTemp[1] = response.data.data.businessTermEnd
              response.data.data.businessTerm = termTemp

              if (response.data.data.strategyContractTermStart && response.data.data.strategyContractTermEnd) {
                var strategyContractTermArr = new Array()
                strategyContractTermArr[0] = response.data.data.strategyContractTermStart
                strategyContractTermArr[1] = response.data.data.strategyContractTermEnd
                response.data.data.strategyContractTerm = strategyContractTermArr
              }

              this.editsupplier = response.data.data

              this.editsupplier.supplierStrategyContract = response.data.data.supplierStrategyContract
              this.editsupplier.supplierHistoryId = response.data.data.supplierHistoryId
              this.editsupplier.supplierHistoryId = response.data.data.supplierHistoryId

              if (response.data.data.deliveryInfos && response.data.data.deliveryInfos.length > 0) {
                this.editsupplier.countryCode = response.data.data.deliveryInfos?.[0].deliveryCountryCode
                this.$set(
                  this.editsupplier,
                  "deliveryRegionCode",
                  response.data.data.deliveryInfos?.[0].deliveryRegionCode
                )
                this.editsupplier.postalAdress = response.data.data.deliveryInfos?.[0].postalAddress
                response.data.data.deliveryInfos.shift() // 删除第一个
                this.editsupplier.deliveryInfos = response.data.data.deliveryInfos
                this.addressList = response.data.data.deliveryInfos
              }

              this.getRegionOptions()

              this.$set(this.editsupplier, "isCorporationType", this.editsupplier.corporationId ? 1 : 2)
              this.editsupplier.creditLevel = response.data.data.creditLevel + ""
              //状态和操作人
              this.operationUser = response.data.data.createByName
              // //营业期限
              // var termTemp =new Array();
              // termTemp[0] = response.data.data.businessTermStart;
              // termTemp[1] = response.data.data.businessTermEnd;
              // this.editsupplier.businessTerm[0] = response.data.data.businessTermStart;
              // this.editsupplier.businessTerm[1] = response.data.data.businessTermEnd;
              this.showStatus(response.data.data.approveStatus)
              //图片查看
              if (response.data.data.licenseNoAttach != null && response.data.data.licenseNoAttach != "") {
                this.showEditAttach = false
                this.editsupplier.uploadFileUrl = getTokenUrl(response.data.data.licenseNoAttach)
              }

              //已提交的展示为禁止输入
              if (this.editsupplier.approveStatus != 0) {
                this.editFlag = true
                this.onlyOnesShow = true
              }
              if (this.editsupplier.approveStatus == 0) {
                this.editFlag = false
                this.onlyOnesShow = false
              }

              //营业执照被审核过一次后，就不能再修改
              if (!this.isNulls(this.posupplier.supplierNo)) {
                this.onlyOnesShow = true
              }
            }
          })
        })
      }
    },
    //获取供应商等级
    getSupplierLevel() {
      remote("supplier_level").then((response) => {
        if (response.data.code == 0) {
          this.supplierLevel = response.data.data
        }
        if (this.supplierLevel == null || this.supplierLevel.length == 0) {
          this.$message.error("供应商等级获取失败，请检查是否维护!")
        }
      })
    },

    showStatus(type) {
      showEditAttach: false
      //debugger;
      if (type == 0) {
        this.handleStatus = "未处理"
      } else if (type == 1) {
        this.handleStatus = "审核中"
      } else if (type == 2) {
        this.handleStatus = "审核通过"
      }
    },

    /**
     * 图片上传所需要的方法
     */
    onBeforeUploadImage(file) {
      console.log(11111, file)
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
     * 上传图片
     */
    UploadOpeningCertifPublic(param) {
      this.formData = new FormData()
      this.formData.append("file", param.file, param.file.name)
      this.$refs.upload.clearFiles()
      uploadImage(this.formData).then((data) => {
        const uTmp = getTokenUrl(data.data.data)
        this.editsupplier.licenseNoAttach = data.data.data
        this.editsupplier.uploadFileUrl = uTmp
        this.showEditAttach = false
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
      })
    },
    //查看历史
    showHistory(count) {
      if (this.paramSupplierNo == null || this.paramSupplierNo == "") {
        this.$message.error("新建页面不能查看历史!")
        return
      }
      var start = this.historyLimit + count
      if (start < 1) {
        this.$message.error("已经是第一条了!")
        return
      }
      showHistory(this.paramSupplierNo, start).then((response) => {
        //debugger;
        if (response.data.code == 0) {
          if (response.data.data != null) {
            this.historyData = response.data.data
            this.historyData.creditLevel = response.data.data.creditLevel + ""

            //图片查看
            if (response.data.data.licenseNoAttach != null && response.data.data.licenseNoAttach != "") {
              this.historyData.uploadFileUrl = getTokenUrl(response.data.data.licenseNoAttach)
            }

            this.historyLimit = start
            this.historyDataDialog = true
          } else {
            this.$message.error("无历史数据了!")
          }
        } else {
          this.$message.error("查询异常!")
        }
      })
    },
    //查看日志
    showOperateLog() {
      this.$refs.pooperatelog.showOperateLogDialog(this.editsupplier.supplierHistoryId, 5)
    },
    dataFormat(time) {
      if (this.isNulls(time)) {
        return
      }
      time = new Date(time)
      return `${time.getFullYear()}-${time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1)}-${
        time.getDate() >= 10 ? time.getDate() : "0" + time.getDate()
      }`
    },
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    },
    // 上传文件成功的回调
    uploadSuccess(res) {
      console.log("res====", res)
      this.editsupplier.supplierStrategyContract = res.id
    },
    async changeCountry() {
      this.regionOptions = []
      this.editsupplier.deliveryRegionCode = ""
      this.getRegionOptions()
    },

    getRegionOptions() {
      const countryCode = this.countryOptions.find(
        (item) => item.countryCode === this.editsupplier.countryCode
      )?.countryCode
      this.regionOptions = this.warehouseRegion.find((item) => item.value === countryCode)?.dictMappings
    },
    addAddress() {
      this.$refs.addressDialogRef.openDialog(
        this.countryOptions,
        this.warehouseRegion,
        [...this.addressList],
        this.editFlag
      )
    },
    updateFormData(addressList) {
      console.log("addressList====", addressList)
      this.addressList = addressList
    }
  }
}
</script>

<style lang="scss">
@import "./style";
@import "../common";
</style>
