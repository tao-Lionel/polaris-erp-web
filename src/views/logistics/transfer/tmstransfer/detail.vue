<template>
  <div id="transfer_detail" v-loading.fullscreen.lock="loading" element-loading-text="正在处理中">
    <basic-container class>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '调拨单',
          list: []
        }"
      >
      </detail-template>

      <el-form ref="tmsTransferForm" :model="tmsTransfer" :rules="tmsTransferFormRules" status-icon>
        <!-- 基本信息 -->
        <detail-wrapper :options="{ title: '基本信息' }">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="100px" label="单据日期:">
                <span>{{ tmsTransfer.createTime }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="90px" label="制单人:">
                <span>{{ tmsTransfer.createByName ? tmsTransfer.createByName : userInfo.displayname }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="80px" label="销售组：" prop="salesGroupId">
                <el-select
                  v-model="tmsTransfer.salesGroupId"
                  size="small"
                  clearable
                  placeholder="请选择"
                  @change="handleSelectSalesGroup"
                  :disabled="tmsTransfer.transferStatus != 1"
                >
                  <el-option
                    v-for="item in salesGroupOptions"
                    :key="item.groupId"
                    :label="item.name"
                    :value="item.groupId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="100px" label="法人主体：" prop="corporationId">
                <el-select
                  v-model="tmsTransfer.corporationId"
                  size="small"
                  clearable
                  placeholder="请选择"
                  :disabled="tmsTransfer.transferStatus != 1"
                  @change="handleChange"
                >
                  <el-option
                    v-for="item in corporationOptions"
                    :key="item.corporationId"
                    :label="item.corporationName"
                    :value="item.corporationId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>

        <!-- 发货信息 -->
        <detail-wrapper :options="{ title: '发货信息' }">
          <el-row>
            <el-col :span="8">
              <el-form-item label="发货仓" label-width="90px" prop="warehouseOutId">
                <el-select
                  size="mini"
                  v-model="tmsTransfer.warehouseOutId"
                  filterable
                  clearable
                  placeholder="请选择"
                  @change="handleSelectWarehouseOut"
                  :disabled="tmsTransfer.transferStatus != 1"
                >
                  <el-option
                    v-for="item in warehouseOutOptions"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="border-bottom: none" label="目的仓" label-width="90px" prop="warehouseInId">
                <el-select
                  size="mini"
                  v-model="tmsTransfer.warehouseInId"
                  filterable
                  clearable
                  placeholder="请选择"
                  @change="handleSelectWarehouseIn"
                  :disabled="tmsTransfer.transferStatus != 1"
                >
                  <el-option
                    v-for="item in warehouseInOptions"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运输方式" label-width="90px" prop="transportModeId">
                <el-select
                  size="mini"
                  v-model="tmsTransfer.transportModeId"
                  filterable
                  clearable
                  placeholder="请选择"
                  @change="handleSelectTransportMode"
                  :disabled="tmsTransfer.transferStatus != 1"
                >
                  <el-option
                    v-for="item in transportModeOptions"
                    :key="item.transportModeId"
                    :label="item.transportModeName"
                    :value="item.transportModeId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :style="filterBottomBorder()">
            <el-col :span="8">
              <el-form-item label="国家" label-width="90px" prop="countryId">
                <el-select
                  v-model="tmsTransfer.countryId"
                  size="mini"
                  filterable
                  clearable
                  placeholder="请选择"
                  :disabled="true"
                >
                  <el-option
                    v-for="item in bsecountryOptions"
                    :key="item.countryId"
                    :label="item.countryShortName"
                    :value="item.countryId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="仓库地址" label-width="90px" prop="warehouseInAddress">
                <el-input
                  v-model="tmsTransfer.warehouseInAddress"
                  size="mini"
                  v-search-input-trim
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="90px" label="柜型" prop="transportCabinetTypeId">
                <el-select
                  v-model="tmsTransfer.transportCabinetTypeId"
                  size="mini"
                  filterable
                  clearable
                  placeholder="请选择"
                  :disabled="
                    !(tmsTransfer.involveCabinetFlag && tmsTransfer.involveCabinetFlag === 1) ||
                    tmsTransfer.transferStatus != 1
                  "
                >
                  <el-option
                    v-for="item in transportCabinetTypeOptions"
                    :key="item.transportCabinetTypeId"
                    :label="item.cabinetTypeName"
                    :value="item.transportCabinetTypeId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label-width="90px"
                label="仓库代码"
                prop="warehouseCodeId"
                v-if="tmsTransfer.transferType == 2 || tmsTransfer.transferType == 3"
              >
                <el-select
                  size="mini"
                  v-model="tmsTransfer.warehouseCodeId"
                  filterable
                  clearable
                  placeholder="请选择"
                  @change="handleSelectWarehouseFba"
                  :disabled="!tmsTransfer.warehouseInId || tmsTransfer.transferStatus != 1"
                >
                  <el-option
                    v-for="item in warehouseFbaOptions"
                    :key="item.warehouseCodeId"
                    :label="item.warehouseCode"
                    :value="item.warehouseCodeId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>

        <!-- 其他信息 -->
        <detail-wrapper :options="{ title: '其他信息' }" class="other-info-style">
          <el-form-item label-width="90px" label="店铺" prop="storeId" v-if="tmsTransfer.transferType != 5">
            <el-select
              v-model="tmsTransfer.storeId"
              size="mini"
              filterable
              clearable
              placeholder="请选择"
              @change="handleSelectStore"
              :disabled="tmsTransfer.transferStatus != 1"
            >
              <el-option
                v-for="item in storeOptions"
                :key="item.storeId"
                :label="item.storeAccountDetail"
                :value="item.storeId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label-width="90px"
            label="Shipmentid"
            prop="shipmentid"
            v-if="tmsTransfer.transferType != 5 && (tmsTransfer.transferType == 2 || tmsTransfer.transferType == 3)"
          >
            <el-input
              v-model="tmsTransfer.shipmentid"
              size="mini"
              v-search-input-trim
              :disabled="tmsTransfer.transferStatus != 1"
              maxlength="50"
            ></el-input>
          </el-form-item>

          <el-form-item
            label-width="90px"
            label="Referenceid"
            prop="referenceid"
            v-if="tmsTransfer.transferType != 5 && (tmsTransfer.transferType == 2 || tmsTransfer.transferType == 3)"
          >
            <el-input
              v-model="tmsTransfer.referenceid"
              size="mini"
              v-search-input-trim
              :disabled="tmsTransfer.transferStatus != 1"
              maxlength="50"
            ></el-input>
          </el-form-item>

          <el-form-item style="border-right: none" label-width="90px" label="库内操作" prop="operationOption">
            <el-select
              v-model="tmsTransfer.operationOption"
              size="mini"
              filterable
              clearable
              placeholder="请选择"
              :disabled="tmsTransfer.transferStatus != 1"
            >
              <el-option v-for="item in operationOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <div class="zip-remark">
            <el-form-item
              style="border-bottom: none"
              label="调拨附件(仅支持.rar、.zip、.gz、.pdf格式文件)"
              class="zip-form-lable"
              prop="transferAttach"
            >
              <el-upload
                :disabled="tmsTransfer.transferStatus != 1"
                class="upload-inq inline-class"
                :class="{ 'is-dot': tmsTransfer.transferAttach }"
                ref="upload"
                accept="application/x-zip-compressed,application/x-rar-compressed,application/x-gz-compressed,.pdf"
                action="String"
                :auto-upload="false"
                :on-change="signFileChange"
                :show-file-list="false"
              >
                <el-button size="small" :disabled="tmsTransfer.transferStatus != 1">点击上传附件</el-button>
                <el-input hidden v-model="tmsTransfer.transferAttach" style="display: none" />
              </el-upload>

              <i class="icon-xiazai y-icon-edit" @click="download(tmsTransfer.transferAttach)"></i>
            </el-form-item>
            <el-form-item
              style="border-bottom: none; border-right: none"
              label-width="90px"
              class="remark-form-lable"
              label="备注"
              prop="remarks"
            >
              <el-input
                v-model="tmsTransfer.remarks"
                size="mini"
                type="textarea"
                :rows="2"
                v-search-input-trim
                placeholder="限制100字符以内"
                maxlength="100"
                :disabled="tmsTransfer.transferStatus != 1"
              ></el-input>
            </el-form-item>
          </div>
        </detail-wrapper>

        <!-- 产品信息 -->
        <div class="border-rang" style="margin: 20px 0">
          <div class="title-wrapper">
            <p class="title-name">产品信息</p>
            <span style="font-size: 16px" class="color-red margin-left-30"
              >(总体积:{{ tmsTransfer.volumeTotal }}m³/ 总重量：{{ tmsTransfer.weightTotal }}KG)</span
            >
            <el-button
              type="primary"
              size="mini"
              @click="selectProduct()"
              :disabled="tmsTransfer.transferStatus != 1"
              style="float: right; margin-top: -5px"
              >选择产品</el-button
            >
          </div>
          <avue-crud
            style="padding: 4px"
            v-merge-header-row="mergeData"
            class="app-container"
            :data="tmsTransfer.tableData"
            :option="handleTableOption"
          >
            <!-- 调拨数量 -->
            <template slot="transferQuantity" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].transferQuantity'"
                :rules="tmsTransferFormRules.transferQuantity"
              >
                <el-input
                  size="mini"
                  v-model="scope.row.transferQuantity"
                  @blur="calutorTransferBoxs(scope.row)"
                  :disabled="tmsTransfer.transferStatus != 1"
                ></el-input>
              </el-form-item>
            </template>

            <!-- 调拨箱数 -->
            <template slot="transferBoxs" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].transferBoxs'"
                :rules="tmsTransferFormRules.transferBoxs"
              >
                <el-input
                  size="mini"
                  v-model="scope.row.transferBoxs"
                  @blur="calutorVolumeAndWeighTotal(scope.row)"
                  :disabled="tmsTransfer.transferStatus != 1"
                ></el-input>
              </el-form-item>
            </template>

            <!-- 条码 -->
            <template slot="isBarcode" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].isBarcode'"
                :rules="tmsTransferFormRules.isBarcode"
              >
                <el-select
                  v-model="scope.row.isBarcode"
                  filterable
                  placeholder="请选择"
                  size="mini"
                  :popper-append-to-body="true"
                  :disabled="tmsTransfer.transferStatus != 1"
                >
                  <el-option
                    v-for="item in isBarcodeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>

            <!-- 自定义操作 -->
            <template slot="oprateHandle" slot-scope="scope">
              <div v-if="tmsTransfer.transferStatus == 1">
                <i class="icon-shanchu y-icon-delect" @click="handleDelRow(scope.row, scope.row.$index)"></i>
              </div>
              <div v-else>
                <i class="icon-shanchu y-icon-delect"></i>
              </div>
            </template>
          </avue-crud>
        </div>
      </el-form>

      <!-- 操作按钮 -->
      <div style="float: right">
        <el-button
          type="primary"
          @click="handleSave(false)"
          size="small"
          v-if="permissions.transfer_tmstransfer_save && tmsTransfer.transferStatus == 1"
          >保 存</el-button
        >
        <el-button
          type="primary"
          @click="handleSave(true)"
          size="small"
          v-if="permissions.transfer_tmstransfer_save_and_submit && tmsTransfer.transferStatus == 1"
          >保存并提交审核</el-button
        >
      </div>

      <!--查看送货产品详情-->
      <el-dialog title="选择产品" :visible.sync="productDialog" width="60%" height="60%" center>
        <avue-crud
          ref="productCrud"
          :page="page"
          :data="productData"
          :option="productTableOption"
          @refresh-change="refreshChange"
          @search-change="searchChange"
          @search-reset="searchReset"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="selectionChange"
        >
          <!-- 搜索条件 -->
          <template slot-scope="scope" slot="search">
            <el-form :model="searchForm" :inline="true" ref="searchForm" style="float: left">
              <el-form-item prop="platformSkuCode">
                <avue-crud-input
                  v-model="searchForm.platformSkuCode"
                  size="small"
                  placeholder="输入平台SKU查询，多个逗号隔开"
                ></avue-crud-input>
              </el-form-item>
            </el-form>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="productDialog = false">取 消</el-button>
          <el-button type="primary" size="small" @click="confirmProduct">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { uploadFile, addObj, getObj } from "@/api/logistics/transfer/tmstransfer"
import { getBsePlatformSkuWmsStockPage as getProductList } from "@/api/warehouse/wmsstock"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAll as getBsewarehousecodeAll } from "@/api/baseSetup/bsewarehousecode"
import { getAll as getBsetransportmodesAll } from "@/api/baseSetup/bsetransportmodes"
import { getAll as getBsetransportcabinettypeAll } from "@/api/baseSetup/bsetransportcabinettype"
import { getAll as getBsestoreAll } from "@/api/baseSetup/bsestore"
import { numberToString } from "@/const/crud/purchase/inquiryorder/poinquiryorder"

import {
  handleTableOption,
  isBarcodeOptions,
  operationOptions,
  productTableOption
} from "@/const/crud/logistics/transfer/tmstransfer"
import { getAll as getBsecorporationAll } from "@/api/baseSetup/bsecorporation"
import { formatDate } from "@/filters/index"
import { mapGetters } from "vuex"
import { getTokenUrl } from "@/util/auth"
import { isNulls } from "@/util/util"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
let oldSalesGroupId = null
let oldWarehouseOutId = null
let oldStoreId = null
export default {
  name: "transfer_detail",
  data() {
    //目的仓验证
    var validateWarehouseInId = (rule, value, callback) => {
      if (this.tmsTransfer.warehouseOutId && value && this.tmsTransfer.warehouseOutId == value) {
        callback(new Error(""))
      } else {
        callback()
      }
    }
    //调拨到FBA验证
    var validateFba = (rule, value, callback) => {
      if ((this.tmsTransfer.transferType == 2 || this.tmsTransfer.transferType == 3) && !value) {
        callback(new Error(""))
      } else {
        callback()
      }
    }
    //柜型验证
    var validateTransportCabinetType = (rule, value, callback) => {
      if (this.tmsTransfer.involveCabinetFlag === 1 && !value) {
        callback(new Error(""))
      } else {
        callback()
      }
    }
    //店铺验证
    var validateStore = (rule, value, callback) => {
      if (this.tmsTransfer.transferType != 5 && !value) {
        callback(new Error(""))
      } else {
        callback()
      }
    }
    //调拨附件
    var validateAttach = (rule, value, callback) => {
      if (this.tmsTransfer.operationOption && this.tmsTransfer.operationOption != 1 && !value) {
        callback(new Error(""))
      } else {
        callback()
      }
    }
    /**是否是整数 */
    var validateNumber = (rule, value, callback) => {
      var reg = /^[0-9]*[1-9][0-9]*$/
      // console.log(value)
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("只能输入正整数"))
      }
    }
    return {
      corporationOptions: [],
      mergeData: [{ index: 9, col: 4 }],
      loading: false,
      tmsTransfer: {
        transferNo: this.$route.query.transferNo,
        warehouseOutId: "",
        warehouseInId: "",
        countryId: "",
        warehouseInAddress: "",
        corporationId: null,
        transportModeId: "",
        transportCarrierId: "",
        transportCabinetTypeId: "",
        transferStatus: 1,
        transferType: this.$route.query.transferType,
        transferAttach: "",
        declareType: "",
        operationOption: 2,
        salesGroupId: "",
        volumeTotal: "0",
        weightTotal: "0",
        remarks: "",
        createBy: "",
        createByName: "",
        createTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
        storeId: "",
        warehouseCodeId: "",
        shipmentid: "",
        referenceid: "",
        involveCabinetFlag: "",
        tableData: []
      },
      salesGroupOptions: [],
      bsecountryOptions: [],
      warehouseOutOptions: [],
      warehouseInOptions: [],
      warehouseFbaOptions: [],
      transportModeOptions: [],
      transportCabinetTypeOptions: [],
      transportCabinetTypeOptionsAll: [],
      storeOptions: [],
      operationOptions: operationOptions,
      isBarcodeOptions: isBarcodeOptions,
      handleTableOption: deepClone(handleTableOption),
      tmsTransferFormRules: {
        salesGroupId: [{ required: true, message: "请先选择销售组", trigger: "change" }],
        corporationId: [
          {
            required: true,
            message: "请先选择法人主体",
            trigger: "change"
          }
        ],
        warehouseOutId: [{ required: true, message: "请先选择发货仓", trigger: "change" }],
        warehouseInId: [
          { required: true, message: "请先选择目的仓", trigger: "change" },
          { validator: validateWarehouseInId, message: "目的仓与发货仓不能相同", trigger: "change" }
        ],
        warehouseCodeId: [{ validator: validateFba, message: "请先选择仓库代码", trigger: "change" }],
        transportCabinetTypeId: [
          { validator: validateTransportCabinetType, message: "请先选择柜型", trigger: "change" }
        ],
        storeId: [{ required: true, validator: validateStore, message: "请先选择店铺", trigger: "change" }],
        shipmentid: [
          { validator: validateFba, message: "请输入Shipmentid", trigger: "blur" },
          { max: 50, message: "Shipmentid不得超过50个字符", trigger: "blur" }
        ],
        referenceid: [
          { validator: validateFba, message: "请输入Referenceid", trigger: "blur" },
          { max: 50, message: "Referenceid不得超过50个字符", trigger: "blur" }
        ],
        operationOption: [{ required: true, message: "请先选择库内操作", trigger: "change" }],
        transferAttach: [{ validator: validateAttach, message: "请上传调拨附件", trigger: "blur" }],
        transferQuantity: [
          { required: true, message: "调拨数量不能为空", trigger: "blur" },
          { validator: validateNumber, message: "只能输入正整数", trigger: "blur" }
        ],
        transferBoxs: [
          { required: true, message: "箱数不能为空", trigger: "blur" },
          { validator: validateNumber, message: "只能输入正整数", trigger: "blur" }
        ],
        isBarcode: [{ required: true, message: "请选择条码", trigger: "blur" }]
      },
      productDialog: false,
      productTableOption: deepClone(productTableOption),
      productData: [],
      selectList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      //搜索条件，和前端控件绑定
      searchForm: {
        platformSkuCode: ""
      },
      //确定的搜索条件
      searchFormConfirm: {}
    }
  },
  created() {
    // if (this.$parent.$refs.tagNavigate) {
    //   this.$parent.$refs.tagNavigate.clearTagCache(this.$route.fullPath)
    // }
  },
  mounted: function () {
    this.loadAll()
  },
  computed: {
    ...mapGetters(["permissions", "userInfo"])
  },
  methods: {
    handleChange(item) {
      console.log(item)
    },
    filterBottomBorder() {
      const { transferType } = this.$route.query
      if (transferType == 1 || transferType == 5 || transferType == 4) {
        return {
          "border-bottom": "none"
        }
      }
    },
    //页面初始化
    loadAll: function () {
      //库位显示与隐藏
      if (this.tmsTransfer.transferType == 3 || this.tmsTransfer.transferType == 4) {
        this.handleTableOption.column[16].hidden = true
        this.productTableOption.column[3].hidden = true
      } else {
        this.handleTableOption.column[16].hidden = false
        this.productTableOption.column[3].hidden = false
      }
      // console.log(this.handleTableOption)
      // console.log(this.productTableOption)
      //加载销售组
      this.getGroupAll()
      //加载国家
      this.getCountry()
      //加载运输方式
      this.getBsetransportmodesAll()
      //加载仓库
      this.getAllWarehouse()
      //加载法人主体
      this.getBsecorporation()
      //加载店铺
      if (this.tmsTransfer.transferType != 5) {
        this.getBsestoreAll()
      }
      if (this.tmsTransfer.transferNo) {
        getObj(this.tmsTransfer.transferNo).then((response) => {
          if (response.data.code == 0 && response.data.data) {
            const data = response.data.data

            this.tmsTransfer = data
            var date = new Date(data.createTime)
            this.$set(this.tmsTransfer, "createTime", formatDate(date, "yyyy-MM-dd hh:mm:ss"))
            this.$set(this.tmsTransfer, "warehouseCodeId", data.tmsTransferFba.warehouseCodeId)
            this.$set(this.tmsTransfer, "shipmentid", data.tmsTransferFba.shipmentid)
            this.$set(this.tmsTransfer, "referenceid", data.tmsTransferFba.referenceid)
            this.$set(this.tmsTransfer, "storeId", data.tmsTransferFba.storeId)
            this.$set(this.tmsTransfer, "countryId", data.warehouseIn.countryId)
            this.$set(this.tmsTransfer, "corporationId", data.corporationId)
            oldSalesGroupId = data.salesGroupId
            oldWarehouseOutId = data.warehouseOutId
            oldStoreId = data.tmsTransferFba.storeId
            if (data.involveCabinetFlag === 1) {
              this.getBsetransportcabinettypeAll()
            } else {
              this.$set(this.tmsTransfer, "transportCabinetTypeId", "")
            }
            if (data.tmsTransferFba.warehouseCodeId) {
              this.getBsewarehousecodeAll()
            }
            console.log(data.tmsTransferDetailList)
            this.$set(this.tmsTransfer, "tableData", data.tmsTransferDetailList)
            this.countVolumeAndWeighTotal(data.tmsTransferDetailList)
          } else {
            this.$message.warning("调拨单信息查询失败")
            return
          }
        })
      }
    },
    //获取法人主体
    getBsecorporation: function () {
      var query = {}
      getBsecorporationAll(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.corporationOptions = data
        }
      })
    },
    //销售组变更事件
    handleSelectSalesGroup: function (item) {
      if (oldSalesGroupId) {
        if (this.tmsTransfer.tableData.length > 0) {
          this.$set(this.tmsTransfer, "salesGroupId", oldSalesGroupId)
          this.$message.warning("请先清除掉选择的产品信息再切换销售组")
          return false
        }
      }
      oldSalesGroupId = item
      if (this.tmsTransfer.tableData.length > 0) {
        this.$message.warning("请先清除掉选择的产品信息再切换销售组")
        return false
      }
    },
    //发货仓变更事件
    handleSelectWarehouseOut: function (item) {
      if (oldWarehouseOutId) {
        if (this.tmsTransfer.tableData.length > 0) {
          this.$set(this.tmsTransfer, "warehouseOutId", oldWarehouseOutId)
          this.$message.warning("请先清除掉选择的产品信息再切换发货仓")
          return false
        }
      }
      oldWarehouseOutId = item
      if (this.tmsTransfer.tableData.length > 0) {
        this.$message.warning("请先清除掉选择的产品信息再切换发货仓")
        return false
      }
    },
    //店铺变更事件
    handleSelectStore: function (item) {
      if (oldStoreId) {
        if (this.tmsTransfer.tableData.length > 0) {
          this.$set(this.tmsTransfer, "storeId", oldStoreId)
          this.$message.warning("请先清除掉选择的产品信息再切换店铺")
          return
        }
      }
      oldStoreId = item
      if (this.tmsTransfer.tableData.length > 0) {
        this.$message.warning("请先清除掉选择的产品信息再切换店铺")
      }
    },
    //目的仓变更事件
    handleSelectWarehouseIn: function (item) {
      //目的仓
      let options = this.warehouseInOptions.filter((obj) => {
        return obj.warehouseId == item
      })
      //仓库代码初始化
      this.warehouseFbaOptions = []
      this.$set(this.tmsTransfer, "warehouseCodeId", "")
      if (options.length == 1) {
        //目的仓
        let opt = options[0]
        //目的仓为FBA仓是需要填写仓库代码
        if (this.tmsTransfer.transferType == 2 || this.tmsTransfer.transferType == 3) {
          this.getBsewarehousecodeAll()
        }
        //国家
        this.$set(this.tmsTransfer, "countryId", opt.countryId)
        //地址
        if (this.tmsTransfer.transferType != 2 && this.tmsTransfer.transferType != 3) {
          this.$set(this.tmsTransfer, "warehouseInAddress", opt.warehouseAddress)
        } else {
          this.$set(this.tmsTransfer, "warehouseInAddress", "")
        }
      } else {
        this.$set(this.tmsTransfer, "countryId", "")
        this.$set(this.tmsTransfer, "warehouseInAddress", "")
      }
    },
    //仓库代码变更事件
    handleSelectWarehouseFba: function (item) {
      let options = this.warehouseFbaOptions.filter((obj) => {
        return obj.warehouseCodeId == item
      })
      if (options.length == 1) {
        let opt = options[0]
        this.$set(this.tmsTransfer, "warehouseInAddress", opt.warehouseAddress)
      } else {
        this.$set(this.tmsTransfer, "warehouseInAddress", "")
      }
    },
    //运输方式变更事件
    handleSelectTransportMode: function (item) {
      //置空柜型
      this.$set(this.tmsTransfer, "transportCabinetTypeId", "")
      let options = this.transportModeOptions.filter((obj) => {
        return obj.transportModeId == item
      })
      if (options.length == 1) {
        let opt = options[0]
        this.$set(this.tmsTransfer, "involveCabinetFlag", opt.involveCabinetFlag)
        //如果选择运输方式涉及组柜，则需选择柜型
        if (opt.involveCabinetFlag === 1) {
          this.transportCabinetTypeOptions = []
          if (!this.transportCabinetTypeOptionsAll || this.transportCabinetTypeOptionsAll.length == 0) {
            this.getBsetransportcabinettypeAll()
          } else {
            //当前运输方式柜型
            this.transportCabinetTypeOptions = deepClone(this.transportCabinetTypeOptionsAll).filter((obj) => {
              return obj.transportModeId == item
            })
          }
        }
      } else {
        this.$set(this.tmsTransfer, "involveCabinetFlag", "")
      }
    },
    //删除一行
    handleDelRow(row, index) {
      this.tmsTransfer.tableData.splice(index, 1)
      this.countVolumeAndWeighTotal(this.tmsTransfer.tableData)
    },
    //计算调拨箱数
    calutorTransferBoxs(row) {
      const reg = /^[0-9]*[1-9][0-9]*$/
      if (reg.test(row.transferQuantity)) {
        if (parseInt(row.transferQuantity) > parseInt(row.availableQuantity)) {
          this.$message.warning("调拨数量大于可调数量，最大可调数量：" + row.availableQuantity)
        }
        if (row.transferQuantity) {
          //调拨箱数
          row.transferBoxs = Math.ceil(row.transferQuantity / row.boxs)
          this.calutorVolumeAndWeighTotal(row)
        }
      }
    },
    //计算总体积和总重量
    calutorVolumeAndWeighTotal(row) {
      var reg = /^[0-9]*[1-9][0-9]*$/
      if (reg.test(row.transferQuantity) && reg.test(row.transferBoxs)) {
        this.countVolumeAndWeighTotal(this.tmsTransfer.tableData)
      }
    },
    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    signFileChange(file, fileList) {
      const isIMAGE =
        file.name.indexOf(".zip") != -1 ||
        file.name.indexOf(".rar") != -1 ||
        file.name.indexOf(".gz") != -1 ||
        file.name.indexOf(".pdf") != -1
      const isLt1M = file.size / 1024 / 1024 < 30
      if (!isIMAGE) {
        this.$message.warning("请选择.rar、.zip、.gz、.pdf格式文件")
        return
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 30MB!")
        return
      }
      if (file.name.length > 44) {
        this.$notify.error({
          title: "错误",
          message: "文件名长度超过40个字符!"
        })
        return false
      }

      let formdata = new FormData()
      formdata.append("listId", "-1")
      formdata.append("file", file.raw)

      uploadFile(formdata).then((res) => {
        if (res.data.code == 0) {
          this.tmsTransfer.transferAttach = res.data.data
          this.$message.success("上传成功")
        } else if (res.data.code == 1) {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 下载
    download(url) {
      if (!url) {
        this.$message.warning("未上传调拨附件")
        return
      }
      window.location = getTokenUrl(url)
    },
    //选择产品
    selectProduct() {
      if (!this.tmsTransfer.salesGroupId) {
        this.$message.warning("请先选择销售组")
        return
      }
      if (!this.tmsTransfer.warehouseOutId) {
        this.$message.warning("请先选择发货仓")
        return
      }
      if (this.tmsTransfer.transferType != 5 && !this.tmsTransfer.storeId) {
        this.$message.warning("请先选择店铺")
        return
      }
      // this.selectList = []
      this.productData = []
      this.productDialog = true
      if (this.selectList.length > 0) {
        this.clearSelectClear()
      }
      this.searchChange(this.searchFormConfirm, this.page)
    },
    handleSave(isSubmit) {
      if (this.tmsTransfer.transferNo && this.tmsTransfer.transferStatus != 1) {
        this.$message.warning("只有草稿状态的调拨单才能保存或提交审核")
        return
      }
      if (this.tmsTransfer.tableData.length <= 0) {
        this.$message.warning("请先选择调拨产品")
        return
      }
      if (this.saveClickValidate() && this.checkTableRows()) {
        const tip = isSubmit ? "保存并提交审核" : "保存"
        var _this = this
        _this.loading = true
        this.$set(this.tmsTransfer, "shipmentid", this.tmsTransfer.shipmentid.trim())
        this.$set(this.tmsTransfer, "referenceid", this.tmsTransfer.referenceid.trim())
        const tmsTransfer = _this.tmsTransfer
        console.log(tmsTransfer)
        // tmsTransfer.createTime = ''
        var saveData = Object.assign(tmsTransfer, {
          tmsTransferDetailList: _this.tmsTransfer.tableData,
          tmsTransferFba: {
            transferNo: _this.tmsTransfer.transferNo,
            storeId: _this.tmsTransfer.storeId,
            warehouseCodeId: _this.tmsTransfer.warehouseCodeId,
            shipmentid: _this.tmsTransfer.shipmentid,
            referenceid: _this.tmsTransfer.referenceid,
            corporationId: _this.tmsTransfer.corporationId
          }
        })
        addObj(saveData, isSubmit).then((response) => {
          _this.loading = false
          if (response.data.code == 0) {
            _this.$message.success(tip + "成功")
            _this.tmsTransfer.transferNo = response.data.data.transferNo
            _this.tmsTransfer.transferStatus = response.data.data.transferStatus
            // _this.tmsTransfer.createTime = response.data.data.createTime
            //清除列表前端缓存
            if (_this.$parent.$refs.tagNavigate) {
              _this.$parent.$refs.tagNavigate.clearTagCache(_this.$route.meta.parentPath)
              // _this.$parent.$refs.tagNavigate.closeTag(
              //   _this.$route.fullPath,
              //   _this.$route.meta.parentPath,
              //   true
              // );
            }
          } else if (response.data.code == 1) {
            _this.$message.error(response.data.msg)
            return
          } else {
            _this.$message.error(tip + "失败")
            return
          }
        })
      }
    },
    //保存前检验数据
    saveClickValidate(data) {
      let flag = true
      this.$refs["tmsTransferForm"].validate((valid, rules) => {
        if (!valid) {
          flag = valid
          Object.keys(rules).forEach((item, index) => {
            if (index === 0) {
              this.$message.error(rules[item][0].message)
            }
          })
        }
      })
      return flag
    },
    //验证明细
    checkTableRows() {
      this.tmsTransfer.corporationId = ""
      let flag = true
      let options = this.tmsTransfer.tableData.filter((obj) => {
        if (
          parseInt(obj.transferQuantity) > parseInt(obj.availableQuantity) ||
          parseInt(obj.transferBoxs) > parseInt(obj.transferQuantity)
        ) {
          return true
        }

        if (
          obj.taxType == "1" &&
          !isNulls(this.tmsTransfer.corporationId) &&
          this.tmsTransfer.corporationId != obj.corporationId
        ) {
          return true
        }
        if (obj.taxType == "1") {
          this.tmsTransfer.corporationId = obj.corporationId
        }
      })

      if (options.length > 0) {
        let opt = options[0]
        if (parseInt(opt.transferQuantity) > parseInt(opt.availableQuantity)) {
          this.$message.error(
            "平台SKU：" + opt.platformSkuCode + "调拨数量大于可调数量，最大可调数量：" + opt.availableQuantity
          )
          return false
        }
        if (parseInt(opt.transferBoxs) > parseInt(opt.transferQuantity)) {
          this.$message.error("平台SKU：" + opt.platformSkuCode + "调拨箱数大于调拨数量")
          return false
        }
        if (
          opt.taxType == "1" &&
          this.tmsTransfer.corporationId != "" &&
          this.tmsTransfer.corporationId != opt.corporationId
        ) {
          this.tmsTransfer.corporationId = ""
          this.$message.error("存在多个含税数据对应的法人主体不一致")
          return false
        }
      }
      if (isNulls(this.tmsTransfer.corporationId)) {
        this.tmsTransfer.corporationId = this.tmsTransfer.tableData[0].corporationId
      }
      return flag
    },
    //查询销售组
    getGroupAll: function () {
      var flag = true
      if (this.$route.query.transferNo) {
        flag = false
      }
      var params = {
        groupFunctionName: "销售类",
        authority: flag
      }
      //加载请购组
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.salesGroupOptions = data
          if (this.salesGroupOptions.length > 0 && !this.$route.query.transferNo) {
            this.$set(this.tmsTransfer, "salesGroupId", this.salesGroupOptions[0].groupId)
            oldSalesGroupId = this.salesGroupOptions[0].groupId
          }
        }
      })
    },
    //查询仓库
    getAllWarehouse: function () {
      var query = {
        funcState: "1",
        delFlag: ""
      }
      if (this.$route.query.transferNo) {
        query = {}
      }
      this.warehouseOutOptions = []
      this.warehouseInOptions = []
      getAllWarehouse(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.warehouseOptions = data
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
            if (this.tmsTransfer.transferType == 1) {
              //国内调海外
              if (element.warehouseTypeCode == "GN") {
                this.warehouseOutOptions.push(element)
              }
              if (element.warehouseTypeCode == "HW" && element.providerCode != "FBA") {
                this.warehouseInOptions.push(element)
              }
            } else if (this.tmsTransfer.transferType == 2) {
              //国内调FBA
              if (element.warehouseTypeCode == "GN") {
                this.warehouseOutOptions.push(element)
              }
              if (element.warehouseTypeCode == "HW" && element.providerCode == "FBA") {
                this.warehouseInOptions.push(element)
              }
            } else if (this.tmsTransfer.transferType == 3) {
              //海外调FBA
              if (element.warehouseTypeCode == "HW" && element.providerCode != "FBA") {
                this.warehouseOutOptions.push(element)
              }
              if (element.warehouseTypeCode == "HW" && element.providerCode == "FBA") {
                this.warehouseInOptions.push(element)
              }
            } else if (this.tmsTransfer.transferType == 4) {
              //海外互转
              if (element.warehouseTypeCode == "HW" && element.providerCode != "FBA") {
                this.warehouseOutOptions.push(element)
              }
              if (element.warehouseTypeCode == "HW" && element.providerCode != "FBA") {
                this.warehouseInOptions.push(element)
              }
            } else if (this.tmsTransfer.transferType == 5) {
              //国内互转
              if (element.warehouseTypeCode == "GN") {
                this.warehouseOutOptions.push(element)
              }
              if (element.warehouseTypeCode == "GN") {
                this.warehouseInOptions.push(element)
              }
            }
          }
        }
      })
    },
    //查询国家地区
    getCountry: function () {
      getCountry().then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.bsecountryOptions = data
        }
      })
    },
    //查询仓库代码
    getBsewarehousecodeAll: function () {
      var isUse = true
      if (this.$route.query.transferNo) {
        isUse = false
      }
      var query = {
        warehouseId: this.tmsTransfer.warehouseInId,
        isUse: isUse
      }
      getBsewarehousecodeAll(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.warehouseFbaOptions = data
        }
      })
    },
    //查询运输方式
    getBsetransportmodesAll: function () {
      var isUse = true
      if (this.$route.query.transferNo) {
        isUse = false
      }
      var params = {
        isUse: isUse
      }
      getBsetransportmodesAll(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.transportModeOptions = data
        }
      })
    },
    //查询柜型
    getBsetransportcabinettypeAll: function () {
      var query = {}
      if (this.$route.query.transferNo) {
        query = {}
      } else {
        query = {
          delFlag: "0"
        }
      }
      this.transportCabinetTypeOptions = []
      getBsetransportcabinettypeAll(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.transportCabinetTypeOptionsAll = data
          //当前运输方式柜型
          this.transportCabinetTypeOptions = deepClone(data).filter((obj) => {
            return obj.transportModeId == this.tmsTransfer.transportModeId
          })
        }
      })
    },
    //查询店铺
    getBsestoreAll: function () {
      var isUse = true
      var authority = true
      var state = "0"
      if (this.$route.query.transferNo) {
        isUse = false
        authority = false
        state = ""
      }
      var params = {
        isUse: isUse,
        authority: authority,
        state: state
      }
      getBsestoreAll(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.storeOptions = data
        }
      })
    },
    //选择产品table加载
    getList(page, params) {
      this.searchFormConfirm.warehouseId = this.tmsTransfer.warehouseOutId
      this.searchFormConfirm.groupId = this.tmsTransfer.salesGroupId
      this.searchFormConfirm.storeId = this.tmsTransfer.storeId
      if (this.tmsTransfer.transferType == 2 || this.tmsTransfer.transferType == 3) {
        this.searchFormConfirm.platformTypeCode = "AMAZON"
      } else {
        this.searchFormConfirm.platformTypeCode = ""
      }
      this.tableLoading = true
      this.page.currentPage = page.currentPage
      getProductList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.productData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    //刷新回调
    refreshChange() {
      this.getList(this.page)
    },
    //搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(page, params)
    },
    //搜索重置
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, this.searchFormConfirm)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, this.searchFormConfirm)
    },
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    //清除选中
    clearSelectClear() {
      this.$refs.productCrud.selectClear()
    },
    //确定选中产品
    confirmProduct() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请勾选数据")
        return
      }
      //确定平台---若已经选择过产品，则为选择过产品平台；若选择过产品，则为本次选择第一个产品平台
      var platformTypeCode = ""
      if (this.tmsTransfer.tableData && this.tmsTransfer.tableData.length > 0) {
        platformTypeCode = this.tmsTransfer.tableData[0].platformTypeCode
      } else {
        platformTypeCode = this.selectList[0].platformTypeCode
      }

      //验证
      var flag = true
      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index]
        if (element.availableQuantity <= 0) {
          this.$message.warning(
            "平台SKU:" + element.platformSkuCode + "(" + (element.taxType == 1 ? "含税" : "非税") + ")，没有可调数量"
          )
          flag = false
          return false
        }
        //平台SKU
        if (platformTypeCode != element.platformTypeCode) {
          if (this.tmsTransfer.tableData && this.tmsTransfer.tableData.length > 0) {
            this.$message.warning(
              "平台SKU:" +
                element.platformSkuCode +
                "(" +
                (element.taxType == 1 ? "含税" : "非税") +
                ")，平台为：" +
                element.platformTypeCode +
                ",与已选择产品平台为：" +
                platformTypeCode +
                "，平台不相同"
            )
          } else {
            this.$message.warning(
              "平台SKU:" +
                element.platformSkuCode +
                "(" +
                (element.taxType == 1 ? "含税" : "非税") +
                ")，平台为：" +
                element.platformTypeCode +
                ",与平台SKU:" +
                this.selectList[0].platformSkuCode +
                "(" +
                (this.selectList[0].taxType == 1 ? "含税" : "非税") +
                ")，平台为：" +
                this.selectList[0].platformTypeCode +
                "，平台不相同"
            )
          }
          flag = false
          return false
        }
        let options = this.tmsTransfer.tableData.filter((obj) => {
          return (
            obj.bsePlatformSkuId == element.bsePlatformSkuId &&
            obj.taxType == element.taxType &&
            obj.stockLocationId == element.stockLocationId &&
            obj.corporationId == element.corporationId
          )
        })
        if (options.length == 1) {
          let opt = options[0]
          var taxType = opt.taxType == 1 ? "含税" : "非税"
          if (this.tmsTransfer.transferType != 3 && this.tmsTransfer.transferType != 4) {
            taxType = taxType + "，库位：" + opt.locationCode
          }
          this.$message.warning(
            opt.corporationName + "平台SKU:" + opt.platformSkuCode + "(" + taxType + ")，已存在，不允许重复"
          )
          flag = false
          return false
        }
      }
      if (!flag) {
        return
      }

      for (let index = 0; index < this.selectList.length; index++) {
        let element = deepClone(this.selectList[index])

        // element={
        // transferQuantity : numberToString(element.availableQuantity),
        // transferBoxs : numberToString(Math.ceil(element.availableQuantity/element.boxs)),
        // transferBoxsOld : numberToString(element.transferBoxs),
        // isBarcode : 1
        // }

        element.transferQuantity = numberToString(element.availableQuantity)
        element.transferBoxs = numberToString(Math.ceil(element.availableQuantity / element.boxs))
        element.transferBoxsOld = numberToString(element.transferBoxs)
        element.isBarcode = 1

        this.$set(this.tmsTransfer.tableData, this.tmsTransfer.tableData.length, element)
        // this.tmsTransfer.tableData.push(element);

        element = null
      }
      // console.log(this.tmsTransfer.tableData)
      this.productDialog = false
      // this.clearSelectClear();
      this.countVolumeAndWeighTotal(this.tmsTransfer.tableData)
    },
    countVolumeAndWeighTotal(data) {
      var reg = /^[0-9]*[1-9][0-9]*$/
      var volumeTotal = 0
      var weightTotal = 0
      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          if (
            element.transferQuantity &&
            element.transferBoxs &&
            reg.test(element.transferQuantity) &&
            reg.test(element.transferBoxs)
          ) {
            volumeTotal = volumeTotal + element.volume * element.transferBoxs
            weightTotal = weightTotal + (element.boxWeight * element.transferBoxs) / 1000
          }
        }
      }
      this.$set(this.tmsTransfer, "volumeTotal", volumeTotal.toFixed(6))
      this.$set(this.tmsTransfer, "weightTotal", weightTotal.toFixed(5))
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
