<template>
  <div class="execution" id="stockchange">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @selection-change="selectionChange"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
      >
        <template slot="menuLeft">
          <el-button v-if="permissions.stock_change_import" type="primary" @click="batchImport" size="small">
            批量导入
          </el-button>
          <el-button type="primary" v-if="permissions.stock_change_export" @click="exportExcel" size="small"
            >导 出</el-button
          >
          <el-button
            @click="delRows"
            type="primary"
            size="small"
            style="margin-left: 10px"
            v-if="permissions.stock_change_del"
            >删除</el-button
          >
          <el-button
            type="primary"
            @click="approvalProcess(0, 'approve')"
            size="small"
            v-if="permissions.stock_change_approve"
            >提交</el-button
          >
          <el-button
            type="primary"
            @click="approvalProcess(1, 'reverse')"
            size="small"
            v-if="permissions.stock_change_approve"
            >撤销提交</el-button
          >
          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="运营审核"
            command="运营审核"
            v-if="permissions.stock_change_sup_approve"
            @command="handleCommand"
          >
            <el-dropdown-item command="运营反审核">运营反审核</el-dropdown-item>
          </el-dropdown-button>
          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="物流审核"
            command="物流审核"
            v-if="permissions.stock_change_qua_approve"
            @command="handleCommand"
          >
            <el-dropdown-item command="物流反审核">物流反审核</el-dropdown-item>
          </el-dropdown-button>
        </template>

        <!-- 操作日志 -->
        <template slot="operateLog" slot-scope="scope">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.changeNo)"></i>
        </template>
        <template slot="changeNo" slot-scope="scope">
          <copy-text hoverToShow>
            <a class="el-row-text" @click="showDetail(scope.row.changeNo)">{{ scope.row.changeNo }}</a>
          </copy-text>
        </template>
        <template slot="changeNumber" slot-scope="scope">
          <copy-text hoverToShow>
            <a @click="showOccupyDetail(scope.row.changeNo)">{{ scope.row.changeNumber }}</a>
          </copy-text>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="changeNo">
              <el-input
                clearable
                v-model="searchForm.changeNo"
                size="small"
                placeholder="单据编号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item class="form-label" prop="searchDate">
              <el-date-picker
                size="small"
                v-model="searchForm.searchDate"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
              ></el-date-picker>
            </el-form-item>

            <el-form-item prop="warehouseId">
              <el-select v-model="searchForm.warehouseId" size="small" filterable clearable placeholder="仓库" multiple>
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="dataStatus">
              <el-select
                v-model="searchForm.dataStatus"
                size="small"
                multiple
                collapse-tags
                filterable
                clearable
                placeholder="状态"
              >
                <el-option
                  v-for="item in dataStatusOptions"
                  :key="item.dataStatus"
                  :label="item.statusDescribe"
                  :value="item.dataStatus"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item prop="spuCode">
              <el-input
                v-model="searchForm.spuCode"
                size="small"
                placeholder="标准SPU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="skuCode">
              <el-input
                v-model="searchForm.skuCode"
                size="small"
                placeholder="工厂SKU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="corporationId">
              <el-select
                v-model="searchForm.corporationId"
                size="small"
                filterable
                clearable
                multiple
                placeholder="法人主体"
              >
                <el-option
                  v-for="item in corporationOptions"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inPlatform">
              <el-select
                v-model="searchForm.inPlatform"
                size="small"
                placeholder="转入平台"
                @visible-change="getInSite"
                clearable
                filterable
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in platform"
                  :key="item.platformTypeCode"
                  :label="item.platformTypeName"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inSite">
              <el-select
                v-model="searchForm.inSite"
                :disabled="!searchForm.inPlatform.length"
                size="small"
                clearable
                filterable
                placeholder="转入站点"
                @change="updateMarketId"
                multiple
                collapse-tags
              >
                <el-option v-for="item in inSit" :key="item.sitName" :label="item.sitName" :value="item.sitName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="outPlatform">
              <el-select
                v-model="searchForm.outPlatform"
                size="small"
                placeholder="转出平台"
                @visible-change="getOutSite"
                clearable
                filterable
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in platform"
                  :key="item.platformTypeCode"
                  :label="item.platformTypeName"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="outSite">
              <el-select
                v-model="searchForm.outSite"
                :disabled="!searchForm.outPlatform.length"
                size="small"
                clearable
                filterable
                placeholder="转出站点"
                @change="updateMarketId"
                multiple
                collapse-tags
              >
                <el-option v-for="item in outSit" :key="item.sitName" :label="item.sitName" :value="item.sitName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="sharedStock">
              <el-select v-model="searchForm.sharedStock" size="small" clearable filterable placeholder="是否共享库存">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="createBy">
              <el-select v-model="searchForm.createBy" size="small" placeholder="创建人" filterable clearable>
                <el-option v-for="item in userAll" :key="item.userId" :label="item.displayname" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="updateBy">
              <el-select v-model="searchForm.updateBy" size="small" placeholder="更新人" filterable clearable>
                <el-option v-for="item in userAll" :key="item.userId" :label="item.displayname" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="sharedStock" slot-scope="scope">
          <div>{{ scope.row.sharedStock === 1 ? "是" : "否" }}</div>
        </template>
      </avue-crud>
      <!-- 操作日志 -->
      <pooperatelog ref="pooperatelog"></pooperatelog>

      <el-dialog title="新增转货单" :visible.sync="createFormVisible" @closed="formReset('createForm')">
        <el-form :inline="true" :model="productSearchForm" ref="createForm" :rules="productRules">
          <el-row>
            <el-col :span="6">
              <el-form-item label="法人主体" prop="corporationId" style="margin-bottom: 10px">
                <el-select
                  v-model="productSearchForm.corporationId"
                  size="mini"
                  filterable
                  clearable
                  placeholder="请选择"
                  :disabled="changeProduct"
                  @change="changeCorporationId"
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
            <el-col :span="6">
              <el-form-item label="仓库" prop="warehouseId" style="margin-bottom: 10px">
                <el-select
                  v-model="productSearchForm.warehouseId"
                  size="mini"
                  filterable
                  clearable
                  placeholder="请选择"
                  :disabled="changeProduct"
                >
                  <el-option
                    v-for="item in warehouseByCorporationOptions"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option
                ></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="转出平台" prop="outPlatform" style="margin-bottom: 10px">
                <el-select
                  v-model="productSearchForm.outPlatform"
                  size="mini"
                  filterable
                  clearable
                  placeholder="请选择"
                  @change="changePlatform"
                  :disabled="changeProduct"
                >
                  <el-option v-for="item in plaTypeOption" :key="item.platformTypeId" :value="item.platformTypeCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="转出站点" prop="outSite" style="margin-bottom: 10px">
                <el-select
                  v-model="productSearchForm.outSite"
                  size="mini"
                  filterable
                  clearable
                  placeholder="请选择"
                  :disabled="changeProduct"
                >
                  <el-option
                    v-for="item in sitCountryOptions"
                    :key="item.bsePlatformSitId"
                    :value="item.sitEnName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="转入平台" prop="inPlatform" style="margin-bottom: 10px">
                <el-select
                  v-model="productSearchForm.inPlatform"
                  size="mini"
                  @change="changeInPlatform"
                  :disabled="changeProduct"
                >
                  <el-option v-for="item in plaTypeOption" :key="item.platformTypeId" :value="item.platformTypeCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="转入站点" prop="inSite" style="margin-bottom: 10px">
                <el-select v-model="productSearchForm.inSite" size="mini" :disabled="changeProduct">
                  <el-option
                    v-for="item in sitInCountryOptions"
                    :key="item.bsePlatformSitId"
                    :value="item.sitEnName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="addProductData" style="width: 100%; margin-top: 10px" border>
          <el-table-column label="标准SPU" prop=""></el-table-column>
          <el-table-column label="转出SKU" prop="outSkuCode"></el-table-column>
          <el-table-column label="产品名称" prop=""></el-table-column>
          <el-table-column label="可用库存" prop="availableQuantity"></el-table-column>
          <el-table-column label="转出数量" prop="changeNumber"></el-table-column>
          <el-table-column label="转出平台" prop="outPlatform"></el-table-column>
          <el-table-column label="转出站点" prop="outSite"></el-table-column>
          <el-table-column label="转入SKU" prop="inSkuCode">
            <template slot="header">
              <span class="needIn">转入SKU</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.inSkuCode" size="mini" placeholder="请输入SKU"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库内操作" prop="operaType" width="200">
            <template slot="header">
              <span class="needIn">库内操作</span>
              <el-button type="primary" style="display: inline; margin-left: 10px" @click="fillOperaType">
                批量填充
              </el-button>
            </template>
            <template slot-scope="scope">
              <el-select v-model="scope.row.operaType" size="mini">
                <el-option
                  v-for="item in operaTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" style="color: red" @click="delProduct(scope.row.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="productSubmitComfrim(0)">保 存</el-button>
          <el-button size="small" type="primary" @click="productSubmitComfrim(1)">提交审核</el-button>
          <el-button size="small" @click="comfrimCancel('createForm')">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog v-bind:title="confrimTitle" :visible.sync="confrimDialog" width="30%">
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="100"
          placeholder="拒绝时填写信息，不得超过100个字符。"
          v-model="rejMsg"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" size="small" @click="approvalProcess(null, 'reject')">拒 绝</el-button>
          <el-button type="primary" size="small" @click="approvalProcess(null, 'approve')">通 过</el-button>
        </span>
      </el-dialog>

      <el-dialog title="转货单详情" :visible.sync="detialFormVisible" width="800px">
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="10"
            ><span>转货单号: {{ wmsStockChangeVo.changeNo }}</span></el-col
          >
          <el-col :span="12"
            ><span>法人主体: {{ wmsStockChangeVo.corporationName }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="10"
            ><span>仓库: {{ wmsStockChangeVo.warehouseName }}</span></el-col
          >
          <el-col :span="12"
            ><span>标准SPU: {{ wmsStockChangeVo.spuCode }}</span></el-col
          >
        </el-row>
        <br />
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="10"
            ><span>转出SKU: {{ wmsStockChangeVo.outSkuCode }}</span></el-col
          >
          <el-col :span="12"
            ><span>转出产品名称: {{ wmsStockChangeVo.outSkuName }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="10"
            ><span>转出平台: {{ wmsStockChangeVo.outPlatform }}</span></el-col
          >
          <el-col :span="12"
            ><span>转出站点: {{ wmsStockChangeVo.outSite }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="10"
            ><span>转出数量: {{ wmsStockChangeVo.number }}</span></el-col
          >
        </el-row>
        <br />
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="10"
            ><span>转入SKU: {{ wmsStockChangeVo.inSkuCode }}</span></el-col
          >
          <el-col :span="12"
            ><span>转入产品名称: {{ wmsStockChangeVo.inSkuName }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="10"
            ><span>转入平台: {{ wmsStockChangeVo.inPlatform }}</span></el-col
          >
          <el-col :span="12"
            ><span>转入站点: {{ wmsStockChangeVo.inSite }}</span></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="10">
            <span>库内操作: {{ wmsStockChangeVo.operaName }}</span>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="detialFormVisible = false">关 闭</el-button>
        </div>
      </el-dialog>

      <el-dialog title="关联单据" :visible.sync="occupyDetailFormVisible" width="500px">
        <avue-crud :data="occupyDetailData" :option="occupyDetailFormOption"></avue-crud>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="occupyDetailFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </basic-container>

    <newCommonImport
      ref="newCommonImport"
      :downloadUrl="newDownloadUrl"
      :previewUrl="newPreviewUrl"
      :uploadUrl="newUploadUrl"
      :downloadTitle="newDownloadTitle"
      @import="importExcel"
    >
    </newCommonImport>
  </div>
</template>

<script>
import pooperatelog from "@/views/warehouse/wmsoperatelog"
import { getAllWarehouse, getWarehouseByCorpCodeApi } from "@/api/baseSetup/bsewarehouse"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { getPlatformSkuInfo } from "@/api/baseSetup/bseplatformsku/bseplatformsku"
import { getAll as getBsecorporationAll } from "@/api/baseSetup/bsecorporation"
import {
  fetchList,
  comfrimCreate,
  approvalProcess,
  showDetail,
  showOccupyDetail,
  delRows,
  productSubmit,
  getUser,
  approvalProcessV2
} from "@/api/warehouse/stockchange/wmsstockchange"
import { tableOption, occupyDetailFormOption, productRules } from "@/const/crud/warehouse/stockchange/wmsstockchange"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getUrlConcatToken } from "@/util/auth"
import { getStatusByFuncName } from "@/api/baseSetup/bsestatusorderrecord"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { getProductList } from "@/api/warehouse/otherinstock/wmsotherinstock"
import { getPlayTypeAll, getSit } from "@/api/order/orderManage"
import newCommonImport from "@/views/cockpit/newCommonImport"

export default {
  name: "wmsstockchange",
  components: {
    pooperatelog,
    newCommonImport
  },
  data() {
    var validateNumber = function (rules, value, callback) {
      if (!/^[0-9]*$/.test(value)) {
        callback(new Error("请检查:是否为数字"))
      } else {
        callback()
      }
    }
    return {
      newDownloadUrl: "/warehouse/basis/downloadTemplate",
      newPreviewUrl: "/warehouse/wmsstockchange/batchImportPreview",
      newUploadUrl: "/warehouse/wmsstockchange/batchImportData",
      newDownloadTitle: "转货管理导入模板",
      dataStatusOptions: [],
      outPlatformSkuInfo: [],
      inPlatformSkuInfo: [],
      occupyDetailFormOption: occupyDetailFormOption,
      rejMsg: "",
      confrimTitle: "",
      occupyDetailData: [],
      occupyDetailFormVisible: false,
      wmsStockChangeVo: [],
      detialFormVisible: false,
      confrimDialog: false,
      selectRows: [],
      order: "",
      basicInfoFormRules: {
        warehouseId: [{ required: true, message: "请先选择仓库", trigger: "change" }],
        outIds: [{ required: true, message: "请先填写转出Fnsku", trigger: "change" }],
        changeNumber: [
          { required: true, message: "请先填写数量", trigger: "change" },
          { validator: validateNumber, trigger: "blur" },
          { max: 6, message: "请检查数字是否过大", trigger: "blur" }
        ],
        inIds: [{ required: true, message: "请先填写收货Fnsku", trigger: "change" }],
        operaType: [{ required: true, message: "请先填写库内操作", trigger: "change" }]
      },
      wmsStockChange: {
        warehouseId: "",
        outIds: "",
        changeNumber: "",
        inIds: "",
        operaType: ""
      },
      createFormVisible: false,
      salesGroupOptions: [],
      warehouseOptions: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        changeNo: "",
        searchDate: [],
        warehouseId: "",
        outPlatformSkuCode: "",
        inPlatformSkuCode: "",
        outGroupId: [],
        inGroupId: [],
        corporationId: "",
        createBy: "",
        updateBy: "",
        outPlatform: [],
        outSite: [],
        inPlatform: [],
        inSite: [],
        sharedStock: ""
      },
      productSearchForm: {
        corporationId: "",
        warehouseId: "",
        outPlatform: "",
        outSite: "",
        inPlatform: "",
        inSite: "",
        spuCode: "",
        skuCode: "",
        skuName: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      corporationOptions: [],
      productRules: productRules,
      addProductData: [],
      plaTypeOption: [],
      sitCountryOptions: [],
      sitInCountryOptions: [],
      operaTypeOption: [
        { value: 0, label: "无" },
        { value: 1, label: "换条码" },
        { value: 2, label: "换箱唛" },
        { value: 3, label: "换条码换箱唛" }
      ],
      platform: [],
      outSit: [],
      inSit: [],
      userAll: [],
      warehouseByCorporationOptions: []
    }
  },
  watch: {
    "searchForm.inPlatform"(val) {
      if (!val.length) {
        this.searchForm.inSite = []
        this.inSit = []
      }
    },
    "searchForm.outPlatform"(val) {
      if (!val.length) {
        this.searchForm.outSite = []
        this.outSit = []
      }
    }
  },
  created() {
    this.initInfo()
    //加载销售组
    this.getGroupAll()
    //加载仓库
    this.getWarehouseList()
    //加载状态
    this.getStatusByFuncName()
    getPlayTypeAll().then((res) => {
      if (res.data.code == 0) {
        this.platform = res.data.data
      }
    })
    getUser().then((res) => {
      if (res.data.code === 0) {
        this.userAll = res.data.data
      }
    })
  },
  mounted: function () {
    this.getBsecorporationAll()
  },
  computed: {
    ...mapGetters(["permissions"]),
    changeProduct() {
      return this.addProductData.length > 0 ? true : false
    }
  },
  methods: {
    querySearch(queryString, cb) {
      this.searchForm.sku = queryString
      let params = {}
      params.skuCode = queryString
      getProductList(Object.assign(params)).then((res) => {
        console.log(res.data)
      })
      cb()
    },

    getInSite(status) {
      if (!status) {
        this.searchForm.inSite = []
        if (!this.searchForm.inPlatform.length) return
        getSit(this.searchForm.inPlatform).then((res) => {
          if (res.status === 200) {
            this.inSit = res.data
          }
        })
      }
    },
    getOutSite(status) {
      if (!status) {
        this.searchForm.outSite = []
        if (!this.searchForm.outPlatform.length) return
        getSit(this.searchForm.outPlatform).then((res) => {
          if (res.status === 200) {
            this.outSit = res.data
          }
        })
      }
    },

    fillOperaType() {
      if (this.addProductData.length) {
        if (this.addProductData[0].operaType != undefined) {
          this.addProductData.forEach((item) => {
            this.$set(item, "operaType", this.addProductData[0].operaType)
          })
        }
      }
    },
    delProduct(index) {
      this.addProductData.splice(index, 1)
    },
    async productSubmitComfrim(status) {
      console.log("warehouseId", this.searchForm.warehouseId, "corporationId", this.searchForm.corporationId)
      console.log("details", this.addProductData, "status", status)
      let res = await productSubmit({ dataStatus: status, datas: this.addProductData })
      console.log("res", res.data)
      if (res.data.code === 0) {
        this.$message.success("操作成功")
        this.createFormVisible = false
        this.refreshChange()
      } else {
        this.$message.error(res.data.msg)
      }
    },
    productSelectChange(tableData) {
      this.productSelectRows = tableData
    },

    initInfo() {
      getPlaTypeAll().then((res) => {
        this.plaTypeOption = res.data.data
      })
    },
    //根据平台查询站点
    getPlatformSit(val, status) {
      let param = {
        platformTypeId: val
      }
      getSitInfoByPlatformId(param).then((res) => {
        if (status === "in") {
          this.sitInCountryOptions = res.data.data
        } else {
          this.sitCountryOptions = res.data.data
        }
      })
    },
    //选中转出平台-获取平台下的所有站点
    changePlatform(val) {
      console.log(123, val)
      const obj = this.plaTypeOption.find((o) => o.platformTypeCode === val)
      const id = obj ? obj.platformTypeId : undefined
      //清空站点值
      this.sitCountryOptions = []
      this.getPlatformSit(id)
    },
    //选中转入平台-获取平台下的所有站点
    changeInPlatform(val) {
      console.log(123, val)
      const obj = this.plaTypeOption.find((o) => o.platformTypeCode === val)
      const id = obj ? obj.platformTypeId : undefined
      //清空站点值
      this.sitInCountryOptions = []
      this.getPlatformSit(id, "in")
    },

    //获取法人主体
    getBsecorporationAll: function () {
      var query = {}
      getBsecorporationAll(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.corporationOptions = data
        }
      })
    },

    /**
     * 查状态
     */
    getStatusByFuncName() {
      var query = {
        funcName: "stock_change_v3"
      }
      getStatusByFuncName(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.dataStatusOptions = data
        }
      })
    },
    fetchOutSuggestions(queryString) {
      this.outPlatformSkuInfo = []
      getPlatformSkuInfo({ platformSkuCode: queryString, isAuth: true }).then((response) => {
        if (response.data.code == 0) {
          response.data.data.forEach((item) => {
            var showCode = item.platformSkuCode + "(" + item.storeAccount + "," + item.countryCode + ")"
            this.outPlatformSkuInfo.push({
              showCode: showCode,
              ids: item.bsePlatformSkuId + "," + item.salesGroupId
            })
          })
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("查询失败")
          return
        }
      })
    },
    fetchInSuggestions(queryString) {
      this.inPlatformSkuInfo = []
      getPlatformSkuInfo({ platformSkuCode: queryString }).then((response) => {
        if (response.data.code == 0) {
          response.data.data.forEach((item) => {
            var showCode = item.platformSkuCode + "(" + item.storeAccount + "," + item.countryCode + ")"
            this.inPlatformSkuInfo.push({
              showCode: showCode,
              inIds: item.bsePlatformSkuId + "," + item.salesGroupId
            })
          })
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("查询失败")
          return
        }
      })
    },

    /**
     * 查看操作日志
     */
    showOperateLog: function (orderNo) {
      this.$refs.pooperatelog.showOperateLogDialog(orderNo, 4)
    },
    //删除
    delRows() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRows(this.selectRows).then((response) => {
            if (response.data.code == 0) {
              this.getList(this.page)
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              })
              this.getList(this.page)
              // 手动调用清除选择
              this.$refs.crud.selectClear()
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("删除失败")
              return
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    showOccupyDetail(changeNo) {
      this.occupyDetailData = []
      showOccupyDetail(changeNo).then((response) => {
        if (response.data.code == 0) {
          response.data.data.forEach((item) => {
            this.occupyDetailData.push(item)
          })
          this.occupyDetailFormVisible = true
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("查询失败")
          return
        }
      })
    },
    //详情
    showDetail(changeNo) {
      this.wmsStockChangeVo = []
      this.detialFormVisible = true
      showDetail({ changeNo }).then((response) => {
        if (response.data.code == 0) {
          this.wmsStockChangeVo = response.data.data
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("查询失败")
          return
        }
      })
    },
    //导出
    exportExcel() {
      if (!this.tableData || this.tableData.length == 0) {
        this.$message.error("没有可导出数据")
        return
      }
      var param = ""
      if (this.selectRows && this.selectRows.length > 0) {
        this.selectRows.forEach((item) => {
          param = param + "&selectNo=" + item.changeNo
        })
      }

      if (this.searchFormConfirm.changeNo) {
        param = param + "&changeNo=" + this.searchFormConfirm.changeNo
      }
      if (this.searchFormConfirm.searchDate) {
        this.searchFormConfirm.searchDate.forEach((item) => {
          param = param + "&searchDate=" + item
        })
      }
      if (this.searchFormConfirm.dataStatus) {
        this.searchFormConfirm.dataStatus.forEach((item) => {
          param = param + "&dataStatus=" + item
        })
      }
      if (this.searchFormConfirm.warehouseId) {
        this.searchFormConfirm.warehouseId.forEach((item) => {
          param = param + "&warehouseId=" + item
        })
      }
      if (this.searchFormConfirm.outPlatformSkuCode) {
        param = param + "&outPlatformSkuCode=" + this.searchFormConfirm.outPlatformSkuCode
      }
      if (this.searchFormConfirm.inPlatformSkuCode) {
        param = param + "&inPlatformSkuCode=" + this.searchFormConfirm.inPlatformSkuCode
      }
      if (this.searchFormConfirm.outGroupId) {
        this.searchFormConfirm.outGroupId.forEach((item) => {
          param = param + "&outGroupId=" + item
        })
      }
      if (this.searchFormConfirm.inGroupId) {
        this.searchFormConfirm.inGroupId.forEach((item) => {
          param = param + "&inGroupId=" + item
        })
      }
      window.location = getUrlConcatToken("/api/warehouse/wmsstockchange/exportExcel") + param
    },
    showConfrim(order, command) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }

      this.rejMsg = ""
      this.order = order
      this.confrimTitle = command
      this.confrimDialog = true
    },
    //拉下选择
    handleCommand(command) {
      if (command == "列表导出") {
        this.exportExcel("main")
      } else if (command == "明细导出") {
        this.exportExcel("detail")
      } else if (command == "运营审核") {
        this.showConfrim(1, command)
      } else if (command == "运营反审核") {
        this.approvalProcess(2, "reverse")
      } else if (command == "物流审核") {
        this.showConfrim(2, command)
      } else if (command == "物流反审核") {
        this.approvalProcess(3, "reverse")
      }
      //  else if (command == "销售审核") {
      //   this.showConfrim(3, command)
      // } else if (command == "销售反审核") {
      //   this.approvalProcess(4, "reverse")
      // }
    },
    //选中数据
    selectionChange(tableData) {
      this.selectRows = tableData
    },
    //提交或撤销提交
    approvalProcess(order, functionName) {
      if (order == null) {
        order = this.order
      }
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      if (functionName === "reject" && !this.rejMsg) {
        this.$message.warning("请填写拒绝原因")
        return
      }
      let changeNos = ""
      this.selectRows.forEach((item) => {
        changeNos += item.changeNo + ","
      })

      var approvalProcessVo = {
        changeNo: changeNos,
        rejMsg: this.rejMsg
      }
      // this.loading = true;
      approvalProcessV2(approvalProcessVo, order, functionName).then((response) => {
        if (response.data.code == 0) {
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 1000
          })
          this.confrimDialog = false
          this.getList(this.page)
          this.$refs.crud.selectClear()
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("操作失败")
          return
        }
      })
      // .finally(() => {
      //   this.loading = false;
      // });
    },
    formReset(formName) {
      this.$refs[formName].resetFields()
    },
    comfrimCancel(formName) {
      this.$refs[formName].resetFields()
      this.createFormVisible = false
    },
    //确认
    comfrimCreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          comfrimCreate(this.wmsStockChange).then((response) => {
            if (response.data.code == 0) {
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 2000
              })
              this.$refs[formName].resetFields()
              this.createFormVisible = false
              this.getList(this.page)
              this.$refs.crud.selectClear()
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("操作失败")
              return
            }
          })
          // .finally(() => {
          //   this.loading = false;
          // });
        } else {
          return false
        }
      })
    },
    //新建
    createStockChange() {
      this.$router.push({
        path: `/warehouse/stockchange/create`
      })
    },
    /**
     * 查询销售组
     */
    getGroupAll() {
      var params = {
        groupFunctionName: "销售类",
        authority: false
      }
      //加载请购组
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.salesGroupOptions = data
        }
      })
    },
    /**
     * 查询仓库
     */
    getWarehouseList() {
      var query = {
        funcState: "1",
        delFlag: "0",
        isFba: false
      }
      this.warehouseInOptions = []
      getAllWarehouse(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.warehouseOptions = data
          // for (let index = 0; index < data.length; index++) {
          //   const element = data[index]
          // }
        }
      })
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }
      this.page.currentPage = page.currentPage
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      this.searchForm = {
        changeNo: "",
        searchDate: [],
        warehouseId: "",
        outPlatformSkuCode: "",
        inPlatformSkuCode: "",
        outGroupId: [],
        inGroupId: [],
        corporationId: "",
        createBy: "",
        updateBy: "",
        outPlatform: [],
        outSite: [],
        inPlatform: [],
        inSite: [],
        sharedStock: ""
      }
      if (this.$refs["searchFormAdvance"]) {
        this.$refs["searchFormAdvance"].resetFields()
      }
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    // 改变法人主体
    changeCorporationId(val) {
      if (val) {
        let { corporationCode } = this.corporationOptions.find((item) => item.corporationId === val)
        // 获取仓库
        getWarehouseByCorpCodeApi(corporationCode, { funcState: 1 }).then((res) => {
          if (res.data.code === 0) {
            this.warehouseByCorporationOptions = res.data.data
          }
        })
      } else {
        this.warehouseByCorporationOptions = []
        this.productSearchForm.warehouseId = null
      }
    },
    // 导入成功才有的回调
    importExcel(file) {
      this.getList(this.page)
    },
    batchImport() {
      this.$refs.newCommonImport.syncFn({
        downloadParams: { templateName: "转货管理导入模板.xlsx" },
        uploadParams: { templateName: "转货管理导入模板.xlsx" }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#stockchange {
  .needIn {
    position: relative;

    &::before {
      content: "*";
      position: absolute;
      left: -7px;
      top: -4px;
      color: red;
    }
  }

  .st-dt-wrapper {
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }

  .st-dt-item {
    display: flex;
    border-bottom: 1px solid #ebeef5;
  }

  .st-dt-item:last-child {
    border-bottom: none;
  }

  .st-dt-item p:last-child {
    padding: 8px 10px;
  }

  .st-dt-name {
    width: 100px;
    border-right: 1px solid #ebeef5;
    padding: 8px 10px;
    text-align: right;
  }
}
</style>
