<template>
  <div id="inquiry_order_detail">
    <basic-container>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '询价单',
          list: [
            { label: '询价单号', value: inquiryForm.inquiryOrderNo },
            { label: '单据日期', value: inquiryForm.createTime },
            { label: '询价人', value: inquiryForm.inquirerName || userInfo.displayname }
          ]
        }"
      >
      </detail-template>

      <el-form ref="inquiryForm" :model="inquiryForm" :label-position="labelPosition">
        <!-- 询价对象 -->
        <detail-wrapper :options="{ title: '询价对象' }">
          <el-row>
            <el-col :span="8">
              <el-form-item
                label-width="92px"
                label="供应商名称"
                prop="supplierNo"
                :rules="inquiryFormRules.supplierNo"
              >
                <el-select
                  v-model="inquiryForm.supplierNo"
                  size="small"
                  :disabled="isLook"
                  filterable
                  @change="supplierHandleSelect"
                >
                  <el-option
                    v-for="item in supplierOptions"
                    :key="item.supplierNo"
                    :label="item.supplierName"
                    :value="item.supplierNo"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="75px" label="报价人:" prop="bidder" :rules="inquiryFormRules.bidder">
                <avue-crud-input
                  :maxlength="20"
                  v-model="inquiryForm.bidder"
                  size="small"
                  onlyTrim
                  :disabled="isLook"
                ></avue-crud-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label-width="100px"
                label="报价人电话:"
                prop="bidderPhone"
                :rules="inquiryFormRules.bidderPhone"
              >
                <avue-crud-input
                  v-model="inquiryForm.bidderPhone"
                  placeholder="请输入11位手机号码"
                  size="small"
                  :maxlength="11"
                  onlyTrim
                  :disabled="isLook"
                ></avue-crud-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label-width="100px"
                label="价格模式:"
                prop="priceModel"
                :rules="inquiryFormRules.priceModel"
              >
                <el-select
                  v-model="inquiryForm.priceModel"
                  placeholder="请选择价格模式"
                  size="small"
                  :disabled="isLook"
                >
                  <el-option
                    v-for="item in priceModelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="100px" label="币种:" prop="currency" :rules="inquiryFormRules.currency">
                <el-select v-model="inquiryForm.currency" placeholder="请选择币种" size="small" :disabled="isLook">
                  <el-option
                    v-for="item in currencyOptions"
                    :key="item.currency"
                    :label="item.currency"
                    :value="item.currency"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="iod-address">
            <p class="iod-address-title">通讯地址:</p>
            <p class="iod-address-name address-con">{{ inquiryForm.postalAdress }}</p>
          </div>
        </detail-wrapper>
        <!-- <div class="iod-target-top border-rang">
            <p class="iod-target target-title">询价对象</p>


          </div> -->

        <!-- 列表 -->
        <detail-wrapper :options="{ title: '询价产品', openPadding: true }" style="position: relative">
          <el-button v-if="submitShow" class="import_supplierProduct" size="mini" type="primary" @click="showImport"
            >导入询价单产品</el-button
          >
          <avue-crud
            class="close-table-select"
            :page="pages"
            :data="inquiryForm.tableData"
            :option="handleTableOption"
            @row-click="rowClick"
            @on-load="getDetailList"
          >
            <!-- 序号 -->
            <template slot="id" slot-scope="scope">
              <p>{{ scope.row.$_id }}</p>
            </template>
            <!-- sku -->
            <template slot="skuCode" slot-scope="scope">
              <!-- <el-form-item :prop="'tableData[' + scope.row.$index + '].skuCode'" :rules="createPoinOrderRules.skuCode">
                <el-select v-model="scope.row.skuCode" popper-class="y-form-select" filterable remote placement="top"
                  size="mini" reserve-keyword placeholder="请检索输入" :remote-method="fetchSuggestions"
                  @change="handleSelectSkuCode" @focus="setCurrentIndex(scope.row.$index)" :disabled="isLook">
                  <el-option v-for="item in skuList" :key="item.skuId" :label="item.skuCode"
                    :value="item.skuCode"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item :prop="'tableData[' + scope.row.$index + '].skuCode'" :rules="createPoinOrderRules.skuCode">
                <el-button type="text" @click="choiceSku(scope.row)" :disabled="isLook">{{
                  scope.row.skuCode ? scope.row.skuCode : "点击选择sku"
                }}</el-button>
              </el-form-item>
            </template>
            <!-- 询价数量 -->
            <template slot="inquiryQuantity" slot-scope="scope">
              <!-- <el-form :ref="'inquiryQuantityRef'+scope.row.$index" :model="scope.row"> -->
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].inquiryQuantity'"
                :rules="createPoinOrderRules.inquiryQuantity"
              >
                <avue-crud-input
                  size="mini"
                  :maxlength="9"
                  clearable
                  v-model="scope.row.inquiryQuantity"
                  :disabled="isLook"
                ></avue-crud-input>
              </el-form-item>
              <!-- </el-form> -->
            </template>

            <!-- 币别 -->
            <!-- <template slot="currency" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].currency'"
                :rules="createPoinOrderRules.currency"
              >
                <el-select
                  name="popo"
                  v-model="scope.row.currency"
                  filterable
                  placeholder="请选择"
                  @change="changeCurrency"
                  size="mini"
                  :disabled="isLook"
                  @focus="setCurrentIndex(scope.row.$index)"
                >
                  <el-option
                    v-for="item in currencyOptions"
                    :key="item.currency"
                    :label="item.currency"
                    :value="item.currency"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template> -->

            <template slot="startPriceValidity" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].startPriceValidity'"
                :rules="rules.startPriceValidity"
              >
                <div style="display: flex">
                  <el-date-picker
                    style="width: 200px"
                    size="mini"
                    :value-format="'yyyy-MM-dd'"
                    v-model="scope.row.startPriceValidity"
                    type="date"
                    placeholder="开始时间"
                    clearable
                    :disabled="isLook"
                  >
                  </el-date-picker>
                  -
                  <el-date-picker
                    style="width: 200px"
                    size="mini"
                    :value-format="'yyyy-MM-dd'"
                    v-model="scope.row.endPriceValidity"
                    type="date"
                    placeholder="结束时间"
                    clearable
                    :disabled="isLook"
                  >
                  </el-date-picker>
                </div>
              </el-form-item>
            </template>

            <!-- MOQ -->
            <template slot="moq" slot-scope="scope">
              <el-form-item :prop="'tableData[' + scope.row.$index + '].moq'" :rules="createPoinOrderRules.moq">
                <el-input size="mini" clearable v-model="scope.row.moq" :disabled="isLook"></el-input>
              </el-form-item>
            </template>

            <!-- 交易税别 -->
            <template slot="taxType" slot-scope="scope">
              <!-- <el-form :ref="'taxTypeRef'+scope.row.$index" :model="scope.row"> -->

              <el-form-item
                :show-message="!(scope.row.isDisabledTaxType || isLook)"
                :prop="'tableData[' + scope.row.$index + '].taxType'"
                :rules="scope.row.isDisabledTaxType || isLook ? {} : createPoinOrderRules.taxType"
              >
                <el-select
                  v-model="scope.row.taxType"
                  filterable
                  placeholder="请选择"
                  @change="changeTaxType"
                  size="mini"
                  :disabled="scope.row.isDisabledTaxType || isLook"
                  @focus="setCurrentIndex(scope.row.$index)"
                >
                  <el-option
                    v-for="item in taxTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- </el-form> -->
            </template>

            <!-- 含税单价 -->
            <template slot="taxPrice" slot-scope="scope">
              <!-- <el-form :ref="'taxPriceRef'+scope.row.$index" :model="scope.row"> -->
              <el-form-item
                :show-message="!(scope.row.isDisabledTaxColumn || isLook)"
                :prop="'tableData[' + scope.row.$index + '].taxPrice'"
                :rules="scope.row.isDisabledTaxColumn || isLook ? {} : createPoinOrderRules.taxPrice"
              >
                <!-- @change="computePrice" -->
                <avue-crud-input
                  size="mini"
                  clearable
                  v-model="scope.row.taxPrice"
                  :disabled="scope.row.isDisabledTaxColumn || isLook"
                  @change="computePrice"
                ></avue-crud-input>
              </el-form-item>
              <!-- </el-form> -->
            </template>

            <!-- 交易税率 -->
            <template slot="taxRate" slot-scope="scope">
              <!-- <el-form :model="scope.row"> -->
              <el-form-item
                :show-message="!(scope.row.isDisabledTaxColumn || isLook)"
                :prop="'tableData[' + scope.row.$index + '].taxRate'"
                :rules="scope.row.isDisabledTaxColumn || isLook ? {} : createPoinOrderRules.taxRate"
              >
                <avue-crud-input
                  size="mini"
                  clearable
                  v-model="scope.row.taxRate"
                  :disabled="scope.row.isDisabledTaxColumn || isLook"
                  @change="computePrice"
                ></avue-crud-input>
              </el-form-item>
              <!-- </el-form> -->
            </template>

            <!-- 非税单价 -->
            <template slot="noneTaxPrice" slot-scope="scope">
              <!-- <el-form :ref="'noneTaxPriceRef'+scope.row.$index" :model="scope.row"> -->
              <el-form-item
                :show-message="!(scope.row.isDisabledNoneTaxColumn || isLook)"
                :prop="'tableData[' + scope.row.$index + '].noneTaxPrice'"
                :rules="scope.row.isDisabledNoneTaxColumn || isLook ? {} : createPoinOrderRules.noneTaxPrice"
              >
                <el-input
                  size="mini"
                  clearable
                  v-model="scope.row.noneTaxPrice"
                  :disabled="scope.row.isDisabledNoneTaxColumn || isLook"
                ></el-input>
              </el-form-item>
              <!-- </el-form> -->
            </template>

            <!-- 采购周期（d） -->
            <template slot="period" slot-scope="scope">
              <!-- <el-form :ref="'periodRef'+scope.row.$index" :model="scope.row"> -->
              <el-form-item :prop="'tableData[' + scope.row.$index + '].period'" :rules="createPoinOrderRules.period">
                <el-input size="mini" clearable v-model="scope.row.period" :disabled="isLook"></el-input>
              </el-form-item>
              <!-- </el-form> -->
            </template>

            <!-- 自定义操作 -->
            <template slot="oprateHandle" slot-scope="scope">
              <!-- <el-button
                  type="text"
                  @click="handleAddRow"
                  class="y-buttom"
                  size="mini"
                  v-if="scope.row.$index === tableData.length-1"
                  :disabled="isLook"
                >新增</el-button>
              <el-button
                  type="text"
                  @click="handleDelRow(scope.row, scope.row.$index)"
                  class="y-buttom"
                  size="mini"
                  v-if="tableData.length > 1"
                  :disabled="isLook"
                >删除</el-button> -->

              <div class="table-opration">
                <i
                  class="icon-shanchu y-icon-delect"
                  v-if="inquiryResponseList.length > 1"
                  @click="handleDelRow(scope.row.$_id, scope.row.$index)"
                  v-show="!isLook"
                ></i>
                <i
                  class="icon-xinzeng y-icon-add"
                  v-if="scope.row.$_id === inquiryResponseList.length"
                  @click="handleAddRow"
                  v-show="!isLook"
                ></i>
              </div>
            </template>
          </avue-crud>
        </detail-wrapper>

        <!-- 其他信息 -->
        <detail-wrapper :options="{ title: '其他信息' }">
          <el-row>
            <!-- <el-col :span="8">
              <el-form-item label-width="92px" label="交货地址:" prop="deliveryAddress"
                :rules="inquiryFormRules.deliveryAddress">
                <avue-crud-input size="small" :autosize="{ minRows: 1, maxRows: 3 }" v-model="inquiryForm.deliveryAddress"
                  placeholder="不得超过200个字符" :maxlength="200" :disabled="isLook"></avue-crud-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="92px" label="交货方式:" prop="deliveryType" :rules="inquiryFormRules.deliveryType">
                <avue-crud-input v-model="inquiryForm.deliveryType" placeholder="不得超过50个字符" :maxlength="50" size="small"
                  :disabled="isLook"></avue-crud-input>
              </el-form-item>
            </el-col> -->
            <!-- :rules="inquiryFormRules.inquiryEvidence" -->
            <el-col :span="8">
              <el-form-item
                label-width="75px"
                style="white-space: nowrap"
                label="询价凭证:"
                class="iod-inquiryEvidence"
                prop="inquiryEvidence"
                :rules="{ required: true, message: '询价凭证不能为空', trigger: 'change' }"
              >
                <el-button style="padding: 0" size="small" type="text" @click="handleUploadInquiryEvidence">
                  点击上传供应商有效报价单
                </el-button>
                <!-- <el-upload
                  class="upload-inq inline-class"
                  :class="{ 'is-dot': inquiryForm.inquiryEvidence }"
                  ref="upload"
                  accept="image/jpeg, image/jpg, image/png, application/pdf"
                  action="String"
                  :auto-upload="false"
                  :on-change="signFileChange"
                  :show-file-list="false"
                >
                  <el-button style="padding: 0" size="small" type="text">点击上传供应商有效报价单</el-button>
                  <avue-crud-input hidden v-model="inquiryForm.inquiryEvidence" style="display: none" />
                </el-upload> -->
                <!-- <span style="display: inline-block" v-if="inquiryForm.inquiryEvidence">
                  <i
                    class="icon-xiazai y-icon-edit"
                    style="margin-left: 15px"
                    @click="download(inquiryForm.inquiryEvidence)"
                  ></i>
                  <i class="icon-chakan y-icon-edit" @click="preViewMethods(inquiryForm.inquiryEvidence)"></i>
                </span> -->

                <div>
                  <div v-for="item in inquiryEvidencesFiles" :key="item.fileId">
                    <span>{{ item.fileName }}</span>
                    <span style="display: inline-block" v-if="inquiryForm.inquiryEvidence">
                      <i class="icon-xiazai y-icon-edit" style="margin-left: 15px" @click="download(item.fileId)"></i>
                      <i class="icon-chakan y-icon-edit" @click="preViewMethods(item.fileId)"></i>
                      <i v-if="!isLook" class="icon-shanchu y-icon-edit" @click="handleDeleteFile(item.fileId)"></i>
                    </span>
                  </div>
                </div>

                <!-- <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 20px; padding: 6px 20px"
                  v-if="isLook"
                  @click="saveInquiryEvidence"
                  >保存</el-button
                > -->
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '备注', openPadding: true }">
          <!-- <el-form-item> -->
          <el-input
            clearable
            class="rm-border"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="inquiryForm.remark"
            placeholder="不得超过200个字符"
            :maxlength="200"
            :disabled="isLook"
          ></el-input>
          <!-- </el-form-item> -->
        </detail-wrapper>

        <!-- <p>报价有效期：系统所有报价单均自生效起至下次报价</p> -->
        <!-- <div class="border-rang" id="iod-other"> -->
        <!-- <p class="iod-target target-title">其他信息</p> -->

        <!-- <div class> -->
        <!-- 2 -->
        <!-- <div class="flex-spance-between target-edit"> -->

        <!-- </div>


            </div>
          </div> -->
        <detail-wrapper v-if="isLook" :options="{ title: '操作日志', openPadding: true }">
          日志
          <avue-crud :data="tableDataOperationLog" :option="operationLogTableOption"> </avue-crud>
        </detail-wrapper>
      </el-form>

      <!-- 操作按钮 -->
      <div style="display: flex; justify-content: center">
        <!-- @click="handleSubmit(0)" -->
        <el-button
          type="primary"
          size="small"
          @click="handleSubmit(0)"
          v-if="permissions.generator_poinquiryorder_submit && submitShow"
          >保 存
        </el-button>
        <el-button
          type="primary"
          @click="handleSubmit(1)"
          size="small"
          v-if="permissions.generator_poinquiryorder_submit && submitShow"
          >提交审核</el-button
        >
        <el-button
          type="primary"
          @click="cancelSubmit"
          size="small"
          v-if="permissions.generator_poinquiryorder_revoke && cancelSubmitShow"
          >撤销提交</el-button
        >
      </div>

      <!-- 查看图片 -->
      <imgdialog ref="imgdialog"></imgdialog>

      <commonImport
        ref="commonImport"
        :downloadUrl="downloadUrl"
        :fileSuffix="fileSuffix"
        :excelStatus="false"
        :excelDangerStatus="excelDangerStatus"
        @import="importExcelBtn"
        @export="exportdangerExcel"
      >
      </commonImport>

      <!-- 导入询价单结果弹窗 -->
      <el-dialog title="导入询价单结果" :visible.sync="showStatus" width="50%">
        <div style="font-size: 16px; margin-bottom: 10px">
          <span>成功{{ resultSuccessCount }}条</span
          ><span style="margin-left: 20px; color: red">失败{{ resultFailCount }}条</span>
        </div>
        <avue-crud
          ref="resultCrud"
          :page="resultPage"
          :data="resultShowData"
          :option="resultOption"
          @current-change="currentChange"
          id="resultCrudIndex"
        >
        </avue-crud>
      </el-dialog>

      <!-- 添加商品弹窗 -->
      <el-dialog
        title="选择商品"
        :visible.sync="addSkuStatus"
        width="80%"
        @close="addCancel"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <avue-crud
          ref="addSkuCrud"
          :page="addPage"
          :data="addSkuData"
          :option="addSkuOption"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="loads"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
        >
          <template slot="search">
            <div style="display: flex; align-items: center">
              <el-form-item class="rig-ali" prop="categoryId">
                <el-cascader
                  expand-trigger="hover"
                  v-model="categoryId"
                  :show-all-levels="false"
                  :options="treeCategoryData"
                  @change="handleChange"
                  clearable
                  size="small"
                ></el-cascader>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="addOrderSearchForm.skuCode"
                  clearable
                  placeholder="请输入SKU"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="addOrderSearchForm.skuName"
                  clearable
                  placeholder="请输入商品名称"
                  size="small"
                ></el-input>
              </el-form-item>
            </div>
          </template>
        </avue-crud>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="addCancel">取消</el-button>
          <el-button
            size="small"
            style="padding: 9px 30px"
            type="primary"
            :disabled="!selectRows.length"
            @click="addSave"
          >
            确认
          </el-button>
        </div>
      </el-dialog>
    </basic-container>
    <batchUploadFile ref="batchUploadFileRef" @updateInquiryEvidenceFile="updateInquiryEvidenceFile"></batchUploadFile>
  </div>
</template>

<script>
import {
  saveObj,
  getObj,
  uploadDesignFile,
  cancelSubmit,
  batchImportPreview,
  uploadImgAndPdf,
  previewImgAndPdf,
  downloadImgAndPdf,
  updateInquiryEvidence
} from "@/api/purchase/inquiryorder/poinquiryorder"
import {
  handleTableOption,
  inquiryFormRules,
  createPoinOrderRules,
  numberToString,
  addSkuOption,
  resultOption,
  operationLogTableOption
} from "@/const/crud/purchase/inquiryorder/poinquiryorder"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { fetchList } from "@/api/product/prdarchives_detail"
import { getAll } from "@/api/baseSetup/bsecurrency"
import { getSupplierLikeName, getAll as getAllSupplier } from "@/api/supplier/posupplier"
import { getByLikeSkuCodeAndAuditOk } from "@/api/product/prdsku"
import imgdialog from "./imgDialog"
import { mapGetters } from "vuex"
import commonImport from "@/views/cockpit/commonImport"
import { getDictByType } from "@/util/auth"
import { fetchList as getLogPage } from "@/api/posupplier/log/pooperatelog"
import batchUploadFile from "./batchUploadFile.vue"
import { getFileListByIdListApi } from "@/api/common/index"

export default {
  name: "inquiry_order_detail",
  data() {
    return {
      downloadUrl: "purchase/poinquiryorder/inquiryProductDownload",
      fileSuffix: ".xlsx",
      excelDangerStatus: false,
      //是否只能查看
      isLook: false,
      //右对齐
      labelPosition: "right",
      handleTableOption: handleTableOption,
      supplierData: [],
      //供应商是否具备税务资质
      taxQualification: false,
      currencyOptions: [],
      //选择的行
      tableIndex: 0,
      createPoinOrderRules: createPoinOrderRules,

      //用来存储询价详情所有数据
      inquiryForm: {
        inquirerName: "",
        supplierNo: "",
        inquiryEvidence: "",
        fileName: "",
        uploadNum: 0,
        tableData: [
          {
            isDisabledTaxColumn: true,
            skuId: "",
            skuCode: "",
            skuName: "",
            modelName: "",
            specification: "",
            legalRefundRate: "",
            taxType: "",
            isDisabledTaxType: true,
            currency: "",
            isDisabledNoneTaxColumn: false,
            taxPrice: "",
            taxRate: "",
            inquiryQuantity: "",
            noneTaxPrice: ""
          }
        ],
        inquiryEvidences: []
      },
      inquiryFormRules: inquiryFormRules,
      //按钮根据单据状态设置是否显示
      saveShow: false,
      submitShow: false,
      cancelSubmitShow: false,
      dialogVisibleImg: false,
      imgURL: null,

      skuList: [],
      // 交易税别
      taxTypeOptions: [
        { value: "1", label: "含税" },
        { value: "2", label: "非税" }
      ],
      imageData: "",
      pdfData: "",
      supplierOptions: [],
      pages: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页显示多少条
        pageSizes: [50]
      },
      inquiryResponseList: [
        {
          isDisabledTaxColumn: true,
          skuId: "",
          skuCode: "",
          skuName: "",
          modelName: "",
          specification: "",
          legalRefundRate: "",
          taxType: "",
          isDisabledTaxType: true,
          currency: "",
          isDisabledNoneTaxColumn: false,
          taxPrice: "",
          taxRate: "",
          inquiryQuantity: "",
          noneTaxPrice: ""
        }
      ],
      addSkuStatus: false,
      addPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 30 // 每页显示多少条
      },
      addOrderSearchForm: {},
      addSkuData: [],
      selectRows: [],
      addSkuOption: addSkuOption,
      categoryId: [],
      treeCategoryData: [],
      initIndex: "",
      initId: "",
      showStatus: false,
      resultAllData: [],
      resultShowData: [],
      resultOption: resultOption,
      resultPage: {
        pageSizes: [100],
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 100 // 每页显示多少条
      },
      resultSuccessCount: 0,
      resultFailCount: 0,
      priceModelOptions: [],
      inquiryEvidencesFiles: [],
      rules: {
        startPriceValidity: [
          {
            validator: (rule, value, callback) => {
              const row = rule.fullField.match(/\d+/g)?.[0] // 获取行索引
              const startDate = this.inquiryForm.tableData[row]?.startPriceValidity
              const endDate = this.inquiryForm.tableData[row]?.endPriceValidity

              if (!startDate || !endDate) {
                return callback(new Error("价格有效期开始和结束时间不能为空"))
              }

              if (new Date(startDate) > new Date(endDate)) {
                return callback(new Error("开始时间不能晚于结束时间"))
              }

              callback() // 校验通过
            },
            trigger: "blur"
          }
        ]
      },
      tableDataOperationLog: [],
      operationLogTableOption: operationLogTableOption,
      type: ""
    }
  },
  created() {
    //清除缓存
    // if(this.$parent.$refs.tagNavigate){
    //     this.$parent.$refs.tagNavigate.clearTagCache(this.$route.fullPath);
    // }
    //请求币别接口
    getAll().then((response) => {
      if (response.data.code === 0) {
        this.currencyOptions = response.data.data
      }
    })

    getAllSupplier().then((res) => {
      if (res.data.code === 0) {
        this.supplierOptions = res.data.data
      }
    })

    fetchTreeList().then((response) => {
      this.treeCategoryData = response.data.data
    })

    //获取参数
    const inquiryOrderNo = this.$route.params.inquiryOrderNo
    console.log("🥶 ---> created ---> inquiryOrderNo👉", inquiryOrderNo)
    const { type } = this.$route.query
    this.type = type
    if (inquiryOrderNo && inquiryOrderNo != -1) {
      //编辑
      getObj(inquiryOrderNo)
        .then((res) => {
          if (res.data.code == 0) {
            var bean = res.data.data
            this.inquiryForm = bean

            bean.inquiryResponseList.forEach((item) => {
              item.skuCode = numberToString(item.skuCode)
              item.inquiryQuantity = numberToString(item.inquiryQuantity)
              item.currency = numberToString(item.currency)
              item.taxType = numberToString(item.taxType)
              item.taxPrice = numberToString(item.taxPrice)
              item.taxRate = numberToString(item.taxRate)
              item.noneTaxPrice = item.noneTaxPrice === 0 ? item.noneTaxPrice + "" : numberToString(item.noneTaxPrice)
              item.period = numberToString(item.period)
            })
            // taxPrice
            let inquiryResponseList = bean.inquiryResponseList.slice(0, this.pages.pageSize)
            this.pages.total = bean.inquiryResponseList.length
            this.inquiryResponseList = bean.inquiryResponseList
            console.log(1111, inquiryResponseList)
            this.$set(this.inquiryForm, "tableData", inquiryResponseList)
            //状态为0才可修改
            this.isLook = bean.approveStatus !== 0
            //供应商是否有资质
            this.taxQualification = bean.taxQualification
            this.handleRowToDisabled()
            this.inquiryForm.postalAdress = bean.postalAdress
            if (bean.inquiryEvidence) {
              this.inquiryForm.uploadNum = 1
              this.getFileList(bean.inquiryEvidence)
            }
            //按钮控制
            if (bean.approveStatus == 0 || bean.approveStatus == 3) {
              this.saveShow = true
              this.submitShow = true
            } else if (bean.approveStatus == 1) {
              this.cancelSubmitShow = true
            }
          }
          if (type == "edit") {
            this.isLook = false
          }
        })
        .catch(() => {
          this.$message.error("加载数据失败")
          return
        })

      this.getLog(inquiryOrderNo)
    } else {
      //新增
      //按钮控制
      this.saveShow = true
      this.submitShow = true
    }

    this.getPriceModelAll()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions", "userInfo"])
  },
  components: {
    imgdialog,
    commonImport,
    batchUploadFile
  },
  methods: {
    async getLog(id) {
      const { data } = await getLogPage({
        relateId: id,
        logType: 9,
        current: 1,
        size: 9999
      })
      if (data.code === 0) {
        this.tableDataOperationLog = data.data.records
      }
    },
    choiceSku(row) {
      this.initIndex = row.$index
      this.initId = row.$_id
      this.addSkuStatus = true
    },
    handleChange() {
      this.addOrderSearchForm.category = this.categoryId.length ? [this.categoryId[this.categoryId.length - 1]] : []
    },
    selectionChange(val) {
      this.selectRows = val
    },
    refreshChange() {
      this.getlist()
    },
    sizeChange(val) {
      this.addPage.pageSize = val
    },
    loads(val) {
      this.addPage.currentPage = val.currentPage
      this.getlist()
    },
    searchChange() {
      this.addPage.currentPage = 1
      this.getlist()
    },
    searchReset() {
      this.addPage.currentPage = 1
      this.categoryId = []
      this.addOrderSearchForm = {}
      this.getlist()
    },
    getlist() {
      fetchList(
        Object.assign(
          {
            current: this.addPage.currentPage,
            size: this.addPage.pageSize
          },
          this.addOrderSearchForm
        )
      ).then((res) => {
        this.addSkuStatus = true
        this.addSkuData = res.data.data.records
        this.addPage.total = res.data.data.total
        this.$refs.addSkuCrud.selectClear()
      })
    },
    async deleteSku() {
      try {
        const data = await this.$confirm("移除后数据不可恢复，是否继续？", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        for (let i = 0; i < this.detailListRows.length; i++) {
          for (let j = 0; j < this.detailList.length; j++) {
            if (this.detailListRows[i].skuCode === this.detailList[j].skuCode) {
              this.detailList.splice(j, 1)
            }
          }
        }
        this.$message.success(`移除成功`)
      } catch (err) {
        console.log("取消", err)
      }
    },
    addSave() {
      if (this.selectRows.length > 1) {
        this.$message.warning("只能选择一个商品！")
        return
      }
      console.log(this.initId, this.initIndex, this.inquiryResponseList)
      const status = this.inquiryResponseList.some((item) => item.skuCode === this.selectRows[0].skuCode)
      if (status) {
        this.$message.warning(`SKU：${this.selectRows[0].skuCode}，已经存在，不允许再次选择`)
        return
      }

      this.inquiryResponseList[this.initId - 1].skuId = this.selectRows[0].skuId
      this.inquiryResponseList[this.initId - 1].skuCode = this.selectRows[0].skuCode
      this.inquiryResponseList[this.initId - 1].skuName = this.selectRows[0].skuName
      this.inquiryResponseList[this.initId - 1].modelName = this.selectRows[0].productSize

      this.inquiryForm.tableData[this.initIndex].skuId = this.selectRows[0].skuId
      this.inquiryForm.tableData[this.initIndex].skuCode = this.selectRows[0].skuCode
      this.inquiryForm.tableData[this.initIndex].skuName = this.selectRows[0].skuName
      this.inquiryForm.tableData[this.initIndex].modelName = this.selectRows[0].productSize

      this.addOrderSearchForm = {}
      this.$refs.addSkuCrud.selectClear()
      this.addSkuStatus = false
      this.$message.success("添加成功")
    },
    addCancel() {
      this.addOrderSearchForm = {}
      this.$refs.addSkuCrud.selectClear()
      this.addSkuStatus = false
    },
    getDetailList(page) {
      if (this.inquiryResponseList.length) {
        this.pages.currentPage = page.currentPage
        let tableDom = document.getElementsByClassName("el-table__body-wrapper")[0]
        if (tableDom) {
          tableDom.scrollTo(0, 0)
        }
        let inquiryResponseList = this.inquiryResponseList.slice(
          (page.currentPage - 1) * page.pageSize,
          page.currentPage * page.pageSize
        )
        this.$set(this.inquiryForm, "tableData", inquiryResponseList)
        this.handleRowToDisabled()
      }
    },
    saveInquiryEvidence() {
      if (!this.inquiryForm.inquiryEvidence) {
        this.$message.warning("请上传供应商有效报价单！")
        return
      }
      const params = {
        inquiryEvidence: this.inquiryForm.inquiryEvidence,
        inquiryOrderNo: this.inquiryForm.inquiryOrderNo
      }
      updateInquiryEvidence(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("供应商有效报价单修改成功")
        }
      })
    },
    showImport() {
      this.$refs.commonImport.syncFn()
    },
    importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImport.openFullScreen()
      let formdata = new FormData()
      formdata.append("file", file.raw)
      batchImportPreview(formdata).then(({ data }) => {
        let successArr = data.filter((item) => !item.errorMsg)
        let failArr = data.filter((item) => item.errorMsg)
        successArr.forEach((item) => {
          item.skuCode = item.sku
          item.noneTaxPrice = item.purchasePrice
          if (item.skuLength && item.skuWidth && item.skuHeight) {
            item.modelName = `${item.skuLength}*${item.skuWidth}*${item.skuHeight}`
          }
        })
        const importTableData = successArr.map((item) => {
          return Object.assign(
            {
              isDisabledTaxColumn: true,
              skuId: "",
              skuCode: "",
              skuName: "",
              modelName: "",
              specification: "",
              legalRefundRate: "",
              taxType: "2",
              isDisabledTaxType: true,
              currency: "",
              isDisabledNoneTaxColumn: false,
              taxPrice: "",
              taxRate: "",
              inquiryQuantity: "",
              noneTaxPrice: ""
            },
            item
          )
        })

        let inquiryResponseList = importTableData.slice(0, this.pages.pageSize)
        this.pages.total = importTableData.length
        this.inquiryResponseList = importTableData
        this.$set(this.inquiryForm, "tableData", inquiryResponseList)

        this.$message[failArr.length ? "warning" : "success"](`成功导入${successArr.length}条，失败${failArr.length}条`)
        this.resultSuccessCount = successArr.length
        this.resultFailCount = failArr.length
        this.resultPage.total = failArr.length
        this.resultAllData = failArr
        this.resultShowData = failArr.slice(
          (this.resultPage.currentPage - 1) * this.resultPage.pageSize,
          this.resultPage.currentPage * this.resultPage.pageSize
        )
        this.showStatus = true
        this.$refs.commonImport.syncFn()
        this.$refs.commonImport.closeFullScreen()
      })
    },
    currentChange(val) {
      this.resultShowData = this.resultAllData.slice(
        (val - 1) * this.resultPage.pageSize,
        val * this.resultPage.pageSize
      )
    },
    //选中行事件
    rowClick: function (row, column, event) {
      this.setCurrentIndex(row.$index)
    },
    setCurrentIndex(currentIndex) {
      //当前选中行
      this.tableIndex = currentIndex
      // document.getElementsByClassName('el-table')[0].classList.remove('el-table--scrollable-x')
    },
    //供应商请求
    supplierQuerySearch(queryString) {
      queryString = queryString ? queryString.trim() : queryString
      if (queryString == "") {
        this.supplierData = []
        return
      }
      queryString = queryString.length <= 60 ? queryString : queryString.substring(0, 60)
      var queryParams = {
        isHideLoading: true,
        supplierName: queryString
      }

      getSupplierLikeName(queryParams).then((response) => {
        this.supplierData = response.data.data
      })
    },
    //供应商选中事件
    supplierHandleSelect(id) {
      let supp = this.supplierOptions.filter((o) => {
        return o.supplierNo == id
      })

      if (supp.length == 0) {
        return
      }
      this.inquiryForm.postalAdress = supp[0].postalAdress
      this.inquiryForm.supplierName = supp[0].supplierName
      this.taxQualification = supp[0].taxQualification
      //控制交易税别列是否只读
      this.handleRowToDisabled()
    },
    //控制交易税别列是否只读
    handleRowToDisabled() {
      var data = this.inquiryForm.tableData.filter((row) => {
        //有含税非税控制权限
        let result = row.currency == "CNY" && this.taxQualification
        row = Object.assign(row, {
          isDisabledTaxType: !result,
          taxType: result ? row.taxType : "2",
          taxPrice: result ? row.taxPrice : null,
          taxRate: result ? row.taxRate : null
        })
        //含税
        let disable = row.taxType == "1"
        row = Object.assign(row, {
          isDisabledTaxColumn: !disable
          //isDisabledNoneTaxColumn: disable
        })
        return row
      })
      this.inquiryForm.tableData = data
    },
    //选中币别
    changeCurrency(item) {
      //是否可以编辑
      let result = item == "CNY" && this.taxQualification
      var row = Object.assign(this.inquiryForm.tableData[this.tableIndex], {
        isDisabledTaxType: !result,
        taxType: result ? this.inquiryForm.tableData[this.tableIndex].taxType : "2",
        taxPrice: result ? this.inquiryForm.tableData[this.tableIndex].taxPrice : null,
        taxRate: result ? this.inquiryForm.tableData[this.tableIndex].taxRate : null
      })
      this.$set(this.inquiryForm.tableData, this.tableIndex, row)
      if (!result) {
        //通过含税非税控制后面的单元格
        this.changeTaxType("2")
      }
    },
    //选中含税(1)或非税(2)
    changeTaxType(item) {
      const result = item == 1
      var row = Object.assign(this.inquiryForm.tableData[this.tableIndex], {
        isDisabledTaxColumn: !result,
        taxPrice: result ? this.inquiryForm.tableData[this.tableIndex].taxPrice : null,
        taxRate: result ? this.inquiryForm.tableData[this.tableIndex].taxRate : null,
        noneTaxPrice: result ? null : this.inquiryForm.tableData[this.tableIndex].noneTaxPrice
        //isDisabledNoneTaxColumn: result
      })
      this.$set(this.inquiryForm.tableData, this.tableIndex, row)
    },
    //计算 非税价=含税价/（1+交易税率）
    computePrice(value) {
      var row = this.inquiryForm.tableData[this.tableIndex]
      //含税单价
      let taxPrice = row.taxPrice
      //交易税率
      let taxRate = row.taxRate
      if (!taxPrice || !taxRate) {
        row.noneTaxPrice = ""
      } else {
        row.noneTaxPrice = (taxPrice / (taxRate / 100 + 1)).toFixed(2)
        if (row.noneTaxPrice == "NaN") {
          row.noneTaxPrice = ""
        }
      }
      this.$set(this.inquiryForm.tableData, this.tableIndex, row)
    },
    //sku检索输入
    fetchSuggestions(queryString, currentIndex) {
      // if (!this.inquiryForm.supplierNo) {
      //   this.$message.warning("请先选择供应商")
      //   return
      // }
      var row = Object.assign(
        {
          skuId: null,
          skuCode: queryString,
          skuName: null,
          modelName: null,
          specification: null,
          inquiryQuantity: null,
          currency: "CNY",
          taxPrice: null,
          taxRate: null,
          noneTaxPrice: null,
          period: "",
          legalRefundRate: null,
          //税率是否只读
          isDisabledTaxColumn: true,
          //交易税别是否只读
          isDisabledTaxType: true
        },
        this.inquiryForm.tableData[this.tableIndex]
      )

      this.$set(this.inquiryForm.tableData, this.tableIndex, row)

      let queryParams = {
        skuCode: queryString ? queryString.trim() : queryString
        // supplierNo: this.inquiryForm.supplierNo,
        // isHideLoading: true,
        // codes: '6000'
      }

      getByLikeSkuCodeAndAuditOk(queryParams).then((response) => {
        let restaurants = response.data.data
        this.skuList = restaurants
        // cb(restaurants)
      })
    },
    //选中sku
    handleSelectSkuCode(item) {
      //判断当前明细是否已经存在该sku
      var flag = true
      for (let index = 0; index < this.inquiryForm.tableData.length; index++) {
        const element = this.inquiryForm.tableData[index]
        if (this.tableIndex != index && item == element.skuCode) {
          flag = false
          break
        }
      }
      if (flag) {
        var skuInfo = this.skuList.filter((sku) => {
          return sku.skuCode === item
        })
        if (skuInfo.length === 0) {
          return
        }
        var row = Object.assign(this.inquiryForm.tableData[this.tableIndex], {
          skuId: skuInfo[0].skuId,
          skuCode: skuInfo[0].skuCode,
          skuName: skuInfo[0].skuName,
          modelName: skuInfo[0].modelName,
          specification: skuInfo[0].specification,
          legalRefundRate: skuInfo[0].legalRefundRate,
          period: skuInfo[0].period
        })
        this.$set(this.inquiryForm.tableData, this.tableIndex, row)
      } else {
        this.$message.error("SKU:" + item + "已经存在，不允许再次选择")
        this.$set(this.inquiryForm.tableData, this.tableIndex, {
          skuId: null,
          skuCode: null,
          skuName: null,
          modelName: null,
          specification: null,
          legalRefundRate: null
        })
        return
      }
    },
    //判断是否选择了SKU
    checkInputSelectedSKU(row, index) {
      if (!this.skuList || this.skuList.length == 0) {
        this.inquiryForm.tableData[index].skuCode = null
      }
      let selectedSku = this.skuList.filter((sku) => {
        return sku.skuCode == row.skuCode
      })
      if (!selectedSku || selectedSku.length == 0) {
        this.inquiryForm.tableData[index].skuCode = null
      }
    },

    //新增一行
    handleAddRow() {
      if (this.inquiryForm.tableData.length <= 200) {
        let currency = this.inquiryForm.tableData[0].currency

        // this.inquiryForm.tableData.push({
        //    isDisabledTaxColumn: true,
        //     skuId: "",
        //     skuCode: "",
        //     skuName: "",
        //     modelName: "",
        //     specification: "",
        //     legalRefundRate: "",
        //     taxType: 2,
        //     isDisabledTaxType: true,
        //     currency: "",
        //     isDisabledNoneTaxColumn: false,
        //     taxPrice: '',
        //     taxRate: '',
        //     inquiryQuantity: "",
        //     noneTaxPrice:''
        // });

        let obj = {
          isDisabledTaxColumn: true,
          skuId: "",
          skuCode: "",
          skuName: "",
          modelName: "",
          specification: "",
          legalRefundRate: "",
          taxType: "2",
          isDisabledTaxType: true,
          currency: "",
          isDisabledNoneTaxColumn: false,
          taxPrice: "",
          taxRate: "",
          inquiryQuantity: "",
          noneTaxPrice: ""
        }

        // this.$set(
        //   this.inquiryForm.tableData,
        //   this.inquiryForm.tableData.length,
        //   obj
        // )
        this.inquiryResponseList.push(obj)
        let currentPage = Math.ceil(this.inquiryResponseList.length / this.pages.pageSize)
        this.pages.currentPage = currentPage
        let inquiryResponseList = this.inquiryResponseList.slice(
          (this.pages.currentPage - 1) * this.pages.pageSize,
          this.pages.currentPage * this.pages.pageSize
        )
        this.pages.total = this.inquiryResponseList.length
        this.$set(this.inquiryForm, "tableData", inquiryResponseList)
      } else {
        this.$message.warning("询价产品不能多于200个")
        return
      }
    },
    //删除一行
    handleDelRow(id, index) {
      this.inquiryResponseList.splice(id - 1, 1)
      for (let i = 0; i < this.inquiryResponseList.length; i++) {
        this.inquiryResponseList[i].$_id = i + 1
      }
      let inquiryResponseList = this.inquiryResponseList.slice(
        (this.pages.currentPage - 1) * this.pages.pageSize,
        this.pages.currentPage * this.pages.pageSize
      )
      this.pages.total = this.inquiryResponseList.length
      this.$set(this.inquiryForm, "tableData", inquiryResponseList)

      // if (this.inquiryForm.tableData.length > 1) {
      //   this.inquiryForm.tableData.splice(index, 1)
      // } else {
      //   this.$message.warning("询价产品不能少于1个")
      //   return
      // }
    },

    //验证明细
    checkTableRows() {
      //验证是否选择中sku
      let letRowIsNull = this.inquiryForm.tableData.filter((row, index) => {
        return !row.skuId || row.skuId == ""
      })
      if (letRowIsNull.length > 0) {
        return "请选择SKU"
      }
      var fallSku = []
      //验证如果含税 含税单价和交易税率是否填写
      this.inquiryForm.tableData.filter((row, index) => {
        if (row.taxType == 1) {
          if (!row.taxPrice) {
            fallSku.push(row.skuName)
          }
        }
      })
      if (fallSku.length > 0) {
        return "请填写SKU:" + fallSku.join(",") + "，的含税单价"
      }
      //验证附件是否上传
      if (!this.inquiryForm.inquiryEvidence || this.inquiryForm.inquiryEvidence == "") {
        return "请上传询价凭证"
      }
    },
    saveClickValidate() {
      let flag = true

      this.$refs["inquiryForm"].validate((valid, rules) => {
        if (!valid) {
          flag = valid
          Object.keys(rules).forEach((item, index) => {
            if (index === 0) {
              this.$message.error(rules[item][0].message)
            }
          })
        }
      })

      /*
      this.inquiryForm.tableData.forEach((val, index) => {
        this.$refs["inquiryQuantityRef" + index].validate(valid => {
          if (!valid) {
            flag = valid;
          }
        });
        this.$refs["noneTaxPriceRef" + index].validate(valid => {
          if (!valid) {
            flag = valid;
          }
        });

        this.$refs["periodRef" + index].validate(valid => {
          if (!valid) {
            flag = valid;
          }
        });
        this.$refs["skuCodeRef" + index].validate(valid => {
          if (!valid) {
            flag = valid;
          }
        });
        this.$refs["currencyRef" + index].validate(valid => {
          if (!valid) {
            flag = valid;
          }
        });
      });
*/
      return flag
    },
    //保存(0)、提交(1)
    handleSubmit(type) {
      //清空没有选择sku的行,要再验证通过后删除，否则会报错
      var data = this.inquiryResponseList.filter((row, index) => {
        return row.skuId && row.skuId != ""
      })
      this.inquiryResponseList = data.length > 0 ? data : this.inquiryResponseList
      if (data.length == 0) {
        this.inquiryForm.tableData = [
          {
            isDisabledTaxColumn: true,
            skuId: "",
            skuCode: "",
            skuName: "",
            modelName: "",
            specification: "",
            legalRefundRate: "",
            taxType: "2",
            isDisabledTaxType: true,
            currency: "",
            isDisabledNoneTaxColumn: false,
            taxPrice: "",
            taxRate: "",
            inquiryQuantity: "",
            noneTaxPrice: ""
          }
        ]
        // this.inquiryForm.tableData=[];
        // this.$set(this.inquiryForm.tableData, 0, [this.inquiryForm.tableData[0]])
      } else {
        let inquiryResponseList = this.inquiryResponseList.slice(
          (this.pages.currentPage - 1) * this.pages.pageSize,
          this.pages.currentPage * this.pages.pageSize
        )
        this.pages.total = this.inquiryResponseList.length
        this.$set(this.inquiryForm, "tableData", inquiryResponseList)
        // this.$set(this.inquiryForm.tableData, data)
      }

      this.$nextTick(function () {
        if (this.saveClickValidate()) {
          const tip = type === 0 ? "保存" : "提交"
          var _this = this

          //验证明细
          let msg = _this.checkTableRows()
          if (msg) {
            this.$message.warning(msg)
            return
          }
          this.inquiryForm.submitType = type
          var saveData = Object.assign(this.inquiryForm, {
            inquiryReceiveList: this.inquiryResponseList
          })

          saveObj(saveData)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success(tip + "成功")
                if (_this.$parent.$refs.tagNavigate) {
                  _this.$parent.$refs.tagNavigate.clearTagCache(_this.$route.meta.parentPath)
                  _this.$parent.$refs.tagNavigate.closeTag(_this.$route.fullPath, _this.$route.meta.parentPath, true)
                }
              } else if (response.data.code == 1) {
                _this.$message.error(response.data.msg)
                return
              } else {
                _this.$message.error(tip + "失败")
                return
              }
            })
            .catch(() => {
              this.$message.error(tip + "失败")
              return
            })
        }
      })
    },
    //撤销提交
    cancelSubmit() {
      var _this = this

      cancelSubmit({ inquiryOrderNo: this.inquiryForm.inquiryOrderNo })
        .then((response) => {
          if (response.data.code == 0) {
            _this.$message.success("撤销提交成功")
            if (_this.$parent.$refs.tagNavigate) {
              _this.$parent.$refs.tagNavigate.clearTagCache(_this.$route.meta.parentPath)
              _this.$parent.$refs.tagNavigate.closeTag(_this.$route.fullPath, _this.$route.meta.parentPath, true)
            }
          } else if (response.data.code == 1) {
            _this.$message.error(response.data.msg)
            return
          } else {
            _this.$message.error("撤销提交失败")
            return
          }
        })
        .catch(() => {
          _this.$message.error("撤销提交失败")
          return
        })
    },
    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    signFileChange(file, fileList) {
      if (file.size / 1024 / 1024 > 10) {
        this.$message.warning("不允许上传大于10M文件")
        return
      }
      console.log(file)
      const fileType = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      const status = fileType.some((item) => item === file.raw.type)
      if (!status) {
        this.$message.warning("请选择图片或者PDF文件")
        return
      }

      let formdata = new FormData()
      formdata.append("applicationName", "")
      formdata.append("file", file.raw)

      uploadImgAndPdf(formdata)
        .then((res) => {
          if (res.data.code == 0) {
            this.inquiryForm.inquiryEvidence = res.data.data.id
            // this.inquiryForm.fileName = file.name
            this.inquiryForm.uploadNum = 1
            this.imageData = ""
            this.pdfData = ""
            this.$message.success("上传成功")
          } else if (res.data.code == 1) {
            this.inquiryForm.uploadNum = 0
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.inquiryForm.uploadNum = 0
          this.$message.error("上传失败")
          return
        })
    },
    // 下载
    download(fileId) {
      if (!fileId) {
        this.$message.warning("未上传文件")
        return
      }
      downloadImgAndPdf({ fileId: fileId }).then((res) => {
        const blobUrl = window.URL.createObjectURL(res.data)
        const filename = res.headers["content-disposition"].split("=")[1]
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(blobUrl)
      })
    },
    //预览
    preViewMethods(id) {
      if (!id) {
        this.$message.warning("未上传文件")
        return
      }
      if (this.imageData) {
        this.$refs.imgdialog.showImgUrl(this.imageData)
        return
      }
      if (this.pdfData) {
        window.open(this.pdfData)
        return
      }
      previewImgAndPdf({ fileId: id }).then((res) => {
        if (res.data.type === "application/pdf") {
          const blob = new Blob([res.data], { type: "application/pdf" })
          this.pdfData = URL.createObjectURL(blob)
          window.open(this.pdfData)
        } else {
          const href = window.URL.createObjectURL(res.data)
          this.imageData = href
          this.$refs.imgdialog.showImgUrl(href)
        }
      })
    },
    // 获取价格模式
    async getPriceModelAll() {
      this.priceModelOptions = await getDictByType("price_model")
    },
    handleUploadInquiryEvidence() {
      this.$refs.batchUploadFileRef.openDialog()
    },
    updateInquiryEvidenceFile(files) {
      this.inquiryEvidencesFiles.push(...files)
      this.updateInquiryEvidences()
    },
    handleDeleteFile(fileId) {
      this.inquiryEvidencesFiles = this.inquiryEvidencesFiles.filter((item) => item.fileId !== fileId)
      this.updateInquiryEvidences()
    },
    updateInquiryEvidences() {
      this.inquiryForm.inquiryEvidences = this.inquiryEvidencesFiles.map((item) => item.fileUrl)
      this.inquiryForm.inquiryEvidence = this.inquiryEvidencesFiles.map((item) => item.fileId)?.join(",") || []
    },
    async getFileList(inquiryEvidence) {
      const formData = new FormData()
      formData.append("fileIdList", inquiryEvidence)
      const { data } = await getFileListByIdListApi(formData)
      if (data.code === 0) {
        this.inquiryEvidencesFiles = data.data
      }
    }
  }
}
</script>

<style lang="scss">
#inquiry_order_detail {
  // .el-input {
  //   width: 60%;
  // }
  // .text-align-right {
  //   text-align: right;
  // }
  // .inline-class {
  //   display: inline-block;
  // }
  // .el-form-item{
  //   margin-bottom: 0;
  // }

  // .iod-header {
  //   margin-bottom: 20px;
  //   white-space: nowrap;
  //   padding: 14px 18px;
  //   background: #f6f9fb;
  //   border: 1px solid #e7ebef;
  // }

  // .iod-header-content {
  //   padding: 0 20px 0 50px;
  //   width: 100%;
  // }

  // .iod-target {
  //   font-weight: bold;
  // }
  // .target-title{ padding: 14px 18px;background: #f6f9fb;border-bottom: 1px solid #e7ebef;}
  .import_supplierProduct {
    position: absolute;
    top: 8px;
    left: 100px;
  }
  .target-edit {
    padding: 20px 20px 0;

    > div {
      flex: 1;
    }

    > div:nth-child(2) {
      margin: 0 20px;
    }

    .el-form-item__label {
      line-height: 28px;
    }

    .el-select,
    .el-input {
      width: 100%;
    }
  }

  #iod-other {
    .el-form-item__content {
      margin: 0;
    }
  }

  // .iod-address {
  //   padding: 14px 18px;
  // }
  // .iod-address-title {
  //   line-height: 32px;
  // }
  // .iod-address-name {
  //   border-radius: 5px;
  // }
  .iod-inquiryEvidence {
    label {
      width: 100%;
      text-align: left;
    }
  }

  .upload-inq {
    position: relative;
    // width: 100%;
    // overflow: hidden;
  }

  .is-dot::before {
    display: block;
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    overflow: hidden;
    background: #f56c6c;
    position: absolute;
    top: 8px;
    right: 0;
  }

  .address-con {
    padding: 12px 18px;
    background: #f6f9fb;
    border-bottom: 1px solid #e7ebef;
    position: relative;
    vertical-align: middle;
  }
  #resultCrudIndex {
    .el-row-text {
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical; //垂直方向排列
    }
  }
}
</style>
