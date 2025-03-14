<template>
  <div
    class="execution"
    id="bseskurelatemanage"
    v-loading.fullscreen.lock="importLoading"
    element-loading-text="正在处理中"
  >
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.bseskurelatemanage_add"
            >新 增</el-button
          >
          <el-button type="primary" @click="handleEdit" size="small" v-if="permissions.bseskurelatemanage_edit"
            >修 改</el-button
          >
          <el-button type="primary" v-if="permissions.bseskurelatemanage_enable" @click="handleEnable(0)" size="small"
            >启 用</el-button
          >
          <el-button type="primary" v-if="permissions.bseskurelatemanage_prohibit" @click="handleEnable(1)" size="small"
            >禁 用</el-button
          >
          <el-button type="primary" @click="showDailog" size="small" v-if="permissions.bseskurelatemanage_import"
            >导 入</el-button
          >
          <el-button type="primary" @click="showPriorityDailog" size="small">批量修改优先级</el-button>
          <el-button type="primary" @click="handleExport" size="small" v-if="permissions.bseskurelatemanage_export"
            >导 出</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="linkSpu">
              <el-input
                v-model="searchForm.linkSpu"
                size="small"
                placeholder="链接SPU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item class="needChangeSelect">
              <el-input placeholder="请输入内容" v-model="selectValue" clearable size="small">
                <el-select v-model="selectLabel" slot="prepend" placeholder="请选择">
                  <el-option
                    v-for="item in searchName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item prop="state">
              <el-select v-model="searchForm.state" size="small" clearable placeholder="启用/禁用">
                <el-option v-for="item in stateFlagOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="platformTypeId">
              <el-select
                v-model="searchForm.platformTypeId"
                size="small"
                clearable
                collapse-tags
                filterable
                placeholder="平台"
                @change="changePlatform"
              >
                <el-option
                  v-for="item in plaTypeOption"
                  :key="item.platformTypeId"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="bsePlatformSitId">
              <el-select v-model="searchForm.bsePlatformSitId" size="small" clearable filterable placeholder="站点">
                <el-option
                  v-for="item in sitCountryOptions"
                  :key="item.bsePlatformSitId"
                  :label="item.sitEnName"
                  :value="item.bsePlatformSitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="commodityType">
              <el-select v-model="searchForm.commodityType" size="small" clearable filterable placeholder="工厂SKU类型">
                <el-option
                  v-for="item in commodityTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <avue-crud-search-item
              ref="searchCrudItemRef"
              :searchFields="searchFields"
              @updateField="updateField"
            ></avue-crud-search-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="operationLog">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.relateId)"></i>
        </template>
        <template slot-scope="scope" slot="bundleFlag">
          <span v-if="scope.row.bundleFlag">组合商品</span>
          <span v-else>单品</span>
        </template>
        <!-- 创建人/创建时间 -->
        <template slot-scope="{ row }" slot="createUser">
          <div>{{ row.createUser }}</div>
          <div>{{ row.createTime }}</div>
        </template>
        <!-- 更新人/更新时间 -->
        <template slot-scope="{ row }" slot="updateUser">
          <div>{{ row.updateUser }}</div>
          <div>{{ row.updateTime }}</div>
        </template>
      </avue-crud>

      <!--新增/编辑-->
      <div>
        <el-dialog
          :title="handleAddOrUpdateTile"
          :visible.sync="addOrUpdateDialog"
          width="660px"
          @close="formReset"
          center
        >
          <el-form
            ref="addOrUpdateForm"
            label-width="120px"
            :inline="true"
            :model="addOrUpdateForm"
            :rules="addOrUpdateRules"
            size="small"
            status-icon
          >
            <el-form-item label="平台" prop="platformTypeId">
              <el-select
                v-model="addOrUpdateForm.platformTypeId"
                size="small"
                filterable
                placeholder="请选择"
                @change="changePlatform"
              >
                <el-option
                  v-for="item in plaTypeOption"
                  :key="item.platformTypeId"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="站点" prop="bsePlatformSitId">
              <el-select
                v-model="addOrUpdateForm.bsePlatformSitId"
                size="small"
                filterable
                placeholder="请选择"
                @change="changePlatformSit"
              >
                <el-option
                  v-for="item in sitCountryOptions"
                  :key="item.bsePlatformSitId"
                  :label="item.sitEnName"
                  :value="item.bsePlatformSitId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="店铺名称" prop="storeId">
              <el-select v-model="addOrUpdateForm.storeId" size="small" filterable placeholder="请选择">
                <el-option
                  v-for="item in baseStoreOptions"
                  :key="item.storeId"
                  :label="item.storeAccount"
                  :value="item.storeId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="链接SPU" prop="linkSpu">
              <el-input v-model="addOrUpdateForm.linkSpu" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>

            <el-form-item label="链接SKU" prop="linkSku">
              <el-input v-model="addOrUpdateForm.linkSku" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>

            <el-form-item
              label="平台销售SKU / ASIN"
              label-width="150"
              prop="sellerSku"
              v-if="platformTypeCode === 'AMAZONVC' || platformTypeCode === 'AMAZON'"
            >
              <el-input v-model="addOrUpdateForm.sellerSku" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="工厂SKU类型" prop="bundleFlag">
              <el-radio-group v-model="addOrUpdateForm.bundleFlag">
                <!-- <el-radio-button :label="false">单品</el-radio-button> -->
                <el-radio-button :label="true">组合商品</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="工厂SKU" prop="skuCode">
              <el-select
                v-model="addOrUpdateForm.skuCode"
                popper-class="y-form-select"
                filterable
                remote
                placement="top"
                size="mini"
                reserve-keyword
                placeholder="请检索输入"
                :remote-method="fetchSuggestions"
                :loading="loadingSkuQuery"
                @change="handleSelectSkuCode"
              >
                <el-option
                  v-for="item in skuList"
                  :key="item.skuId"
                  :label="item.skuCode"
                  :value="item.skuCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="优先级" prop="priority">
              <el-input-number
                class="basekulate"
                placeholder="请输入"
                style="width: 100%"
                v-model="addOrUpdateForm.priority"
                size="small"
                :controls="false"
                :min="1"
                :precision="0"
              ></el-input-number>
            </el-form-item>

            <!-- <el-form-item label="销售组">
              <el-input v-model="addOrUpdateForm.salesGroupName" size="small" :disabled="true"></el-input>
            </el-form-item> -->
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="addOrUpdateDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitForm('addOrUpdateForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <commonImport
        ref="commonImport"
        :excelStatus="false"
        :excelDangerStatus="excelDangerStatus"
        :downloadUrl="downloadUrl"
        :fileSuffix="fileSuffix"
        @import="importExcelBtn"
        @export="exportdangerExcel"
        @initStatus="initStatus"
      >
      </commonImport>

      <commonImport
        ref="priorityImport"
        :excelStatus="false"
        :excelDangerStatus="excelPriorityStatus"
        :downloadUrl="downloadUrl"
        :fileSuffix="fileSuffix"
        @import="importPriorityBtn"
        @export="exportdangerPriority"
        @initStatus="initStatus"
      >
      </commonImport>

      <!-- 错误信息 -->
      <el-dialog title="错误信息" :visible.sync="errDialog" width="660px" max-height="400" center>
        <el-table :data="errData" border style="width: 100%">
          <el-table-column prop="skuCode" label="工厂SKU" width="180"> </el-table-column>
          <el-table-column prop="errorMsg" label="错误信息"> </el-table-column>
        </el-table>
      </el-dialog>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchListV2,
  fetchList,
  handleSaveOrUpdate,
  stateModify,
  handleExport,
  handleImport,
  exportErrorExcel,
  batchUpdatePriority
} from "@/api/baseSetup/bseskurelatemanage/bseskurelatemanage"
import { tableOption, addOrUpdateRules } from "@/const/crud/baseSetup/bseskurelatemanage/bseskurelatemanage"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import { getAll as getAllStore } from "@/api/baseSetup/bsestore"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getByLikeSkuCodeAndCreateAuditComplete } from "@/api/product/prdsku"
import { getNormalBundleLikeCode } from "@/api/product/prdcombproduct"
import { preventShake } from "@/util/tool"
import { getUrlConcatToken, downloadBlob } from "@/util/auth"
import commonImport from "@/views/cockpit/commonImport"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "bseskurelatemanage",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        sellerSku: "",
        skuCode: "",
        state: "",
        platformTypeId: null,
        bsePlatformSitId: null,
        createName: null,
        linkSpu: "",
        commodityType: ""
      },
      createTime: [],
      //确定的搜索条件
      searchFormConfirm: {},
      //禁用下拉数据
      stateFlagOptions: [
        { value: "0", label: "启用" },
        { value: "1", label: "禁用" }
      ],
      plaTypeOption: [],
      baseStoreOptions: [],
      sitCountryOptions: [],
      commodityTypeOptions: [
        { label: "单品", value: 0 },
        { label: "组合商品", value: 1 },
        { label: "所有", value: 2 }
      ],
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],
      //新增 修改相关
      handleAddOrUpdateTile: "新增",
      addOrUpdateDialog: false,
      addOrUpdateRules: addOrUpdateRules,
      addOrUpdateForm: {
        relateId: null,
        platformTypeId: null,
        storeSitManageId: null,
        storeId: null,
        bsePlatformSitId: null,
        sellerSku: "",
        skuId: null,
        skuCode: "",
        priority: "",
        bundleFlag: true
        // salesGroupName: "",
      },
      loadingSkuQuery: false,
      skuList: [],
      importLoading: false,
      downloadUrl: "/baseSetup/bseskurelatemanage/downloadImportBseSkuRelateManageTemplate",
      fileSuffix: ".xlsx",
      excelDangerStatus: false,
      platformTypeCode: "",
      excelPriorityStatus: false,
      errDialog: false,
      errData: [],
      searchName: [
        { label: "链接SKU", value: "linkSku" },
        { label: "链接SKU/ASIN", value: "sellerSku" },
        { label: "工厂SKU", value: "skuCode" }
      ],
      selectValue: "",
      selectLabel: "linkSku",
      searchFields: [
        { label: "创建人", value: "createName", type: "input", default: true },
        { label: "更新人", value: "updateName", type: "input" },
        { label: "创建时间", value: "createTime", type: "datetimerange" },
        { label: "更新时间", value: "updateTime", type: "datetimerange" }
      ]
    }
  },
  created() {},
  mounted: function () {
    this.initInfo()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    operationlog,
    commonImport
  },
  methods: {
    /**  刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**  搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      page = page || { currentPage: 1 }

      if (this.selectLabel && this.selectValue) {
        this.searchFormConfirm[this.selectLabel] = this.selectValue
      }

      this.getList(page, params)
    },
    searchReset() {
      this.createTime = []
      this.selectValue = ""
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
      this.$refs.searchCrudItemRef.resetField()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    getList(page, params) {
      // this.page.currentPage=page.currentPage;
      fetchListV2(
        Object.assign(
          {
            page: page.currentPage,
            pageSize: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    initInfo() {
      //平台
      getPlaTypeAll().then((res) => {
        this.plaTypeOption = res.data.data
      })
    },
    //根据平台查询站点
    getPlatformSit(val) {
      let param = {
        platformTypeId: val
      }
      getSitInfoByPlatformId(param).then((res) => {
        this.sitCountryOptions = res.data.data
      })
    },
    //选中平台-获取平台下的所有站点
    changePlatform(val) {
      //清空站点值
      this.plaTypeOption.forEach((item) => {
        if (item.platformTypeId === val) {
          this.platformTypeCode = item.platformTypeCode
        }
      })
      this.addOrUpdateForm.sellerSku = ""
      this.addOrUpdateForm.bsePlatformSitId = ""
      this.getPlatformSit(val)
    },
    //查询站点下的店铺
    getStoreInfo(val) {
      let param = {
        bsePlatformSitId: val
      }
      getAllStore(param).then((res) => {
        this.baseStoreOptions = res.data.data
      })
    },
    //选中站点-过滤出店铺
    changePlatformSit(val) {
      this.addOrUpdateForm.storeId = ""
      this.getStoreInfo(val)
    },
    //sku检索输入
    fetchSuggestions(queryString) {
      let queryParams = {
        isHideLoading: true,
        skuCode: queryString ? queryString.trim() : queryString,
        codes: "1000"
      }
      this.loadingSkuQuery = true
      if (this.addOrUpdateForm.bundleFlag == false) {
        getByLikeSkuCodeAndCreateAuditComplete(queryParams).then((response) => {
          this.loadingSkuQuery = false
          this.skuList = response.data.data
        })
      } else {
        getNormalBundleLikeCode({ code: queryString }).then((res) => {
          this.loadingSkuQuery = false
          this.skuList = res.data.map((item) => {
            return {
              skuCode: item.code,
              skuId: item.id,
              skuName: item.name
            }
          })
        })
      }
    },
    //选中sku
    handleSelectSkuCode(item) {
      var skuInfo = this.skuList.filter((sku) => {
        return sku.skuCode === item
      })
      if (skuInfo.length === 0) {
        return
      }
      this.addOrUpdateForm.skuId = skuInfo[0].skuId
      this.addOrUpdateForm.skuCode = skuInfo[0].skuCode
      // this.addOrUpdateForm.salesGroupName = skuInfo[0].salesGroupName
    },
    formReset() {
      this.$refs["addOrUpdateForm"].resetFields()
      this.addOrUpdateForm = {
        relateId: null,
        platformTypeId: null,
        storeSitManageId: null,
        storeId: null,
        bsePlatformSitId: null,
        sellerSku: "",
        skuId: null,
        skuCode: "",
        priority: "",
        bundleFlag: false
        // salesGroupName: "",
      }
      this.sitCountryOptions = []
      this.baseStoreOptions = []
    },
    /** 新增 */
    handleAdd() {
      this.addOrUpdateDialog = true
      this.handleAddOrUpdateTile = "新增"
    },
    /**修改 */
    handleEdit() {
      for (let item of this.selectRows) {
        // 只能修改组合商品
        if (!item.bundleFlag) {
          this.$message.warning("只允许修改组合商品")
          return
        }
      }

      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("请勾选一条数据")
        return
      }
      let row = this.selectRows[0]
      if (row.state == "1") {
        this.$message.warning("该数据已禁用，不能修改")
        return
      }
      this.addOrUpdateForm = {
        relateId: row.relateId,
        platformTypeId: row.platformTypeId,
        storeSitManageId: row.storeSitManageId,
        storeId: row.storeId,
        bsePlatformSitId: row.bsePlatformSitId,
        sellerSku: row.sellerSku,
        skuId: row.skuId,
        skuCode: row.skuCode,
        priority: row.priority,
        bundleFlag: row.bundleFlag,
        linkSpu: row.linkSpu,
        linkSku: row.linkSku
        // salesGroupName: row.salesGroupName,
      }
      this.plaTypeOption.forEach((item) => {
        if (row.platformTypeId === item.platformTypeId) {
          this.platformTypeCode = item.platformTypeCode
        }
      })
      //获取平台下的站点
      this.getPlatformSit(this.addOrUpdateForm.platformTypeId)
      //获取站点下的店铺
      this.getStoreInfo(this.addOrUpdateForm.bsePlatformSitId)
      this.addOrUpdateDialog = true
      this.handleAddOrUpdateTile = "修改"
    },
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          preventShake.preventShake((bool) => {
            if (bool) {
              if (_this.platformTypeCode !== "AMAZONVC" && _this.platformTypeCode !== "AMAZON") {
                _this.addOrUpdateForm.sellerSku = _this.addOrUpdateForm.linkSku
              }
              handleSaveOrUpdate(_this.addOrUpdateForm)
                .then((response) => {
                  if (response.data.code == 0) {
                    _this.$message.success(_this.handleAddOrUpdateTile + "成功")
                    _this.clearSelectClear()
                    _this.refreshChange()
                    _this.addOrUpdateDialog = false
                  } else if (response.data.code == 1) {
                    _this.$message.warning(response.data.msg)
                    return
                  } else {
                    _this.$message.error("操作失败")
                    return
                  }
                })
                .catch(() => {
                  _this.$message.error("操作失败")
                  return
                })
            }
          })
        }
      })
    },
    //启用 禁用
    handleEnable(state) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }

      var ids = []
      var numberList = []
      this.selectRows.forEach((item) => {
        ids.push(item.relateId)
        if (state == item.state) {
          numberList.push(item.sellerSku)
        }
      })
      const msg = state === 0 ? "启用" : "禁用"
      if (numberList.length > 0) {
        this.$message.warning("平台销售SKU:" + numberList + "已" + msg + ",无须重复" + msg)
        return
      }

      const saveObj = {
        relateIdList: ids,
        stateModify: state
      }
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          stateModify(saveObj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success(msg + "成功")
                _this.clearSelectClear()
                _this.refreshChange()
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error(msg + "失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error(msg + "失败")
              return
            })
        }
      })
    },
    handleImport(file, fileList) {
      if (file.size / 1024 / 1024 > 6) {
        this.$message.warning("不允许上传大于6M文件")
        return
      }
      let formdata = new FormData()
      formdata.append("file", file.raw)

      var _this = this
      this.loading = true
      this.importLoading = true
      handleImport(formdata)
        .then((res) => {
          _this.loading = false
          _this.importLoading = false
          if (res.data.code == 0) {
            _this.clearSelectClear()
            _this.refreshChange()
            _this.$message.success("导入成功")
            _this.uploadDeclareCustomNo = ""
          } else if (res.data.code == 1) {
            _this.$message.error(res.data.msg)
          } else {
            _this.$message.error("导入失败")
          }
        })
        .catch(() => {
          _this.$message.error("导入失败")
          return
        })
    },
    handleExport() {
      handleExport(this.searchFormConfirm)
        .then((res) => {
          console.log(res.data)
          downloadBlob(res.data, "sku关系导出.xls", "application/vnd.ms-excel;charset=utf-8")
          this.$notify({
            title: "成功",
            message: "正在导出（注意：最多可导出6W条数据）",
            type: "success",
            duration: 2000
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    showDailog() {
      this.$refs.commonImport.syncFn()
    },

    importExcelBtn(file) {
      if (file != null) {
        this.$refs.commonImport.openFullScreen()
        var _this = this
        this.loading = true
        let formdata = new FormData()
        formdata.append("file", file.raw)
        handleImport(formdata).then((res) => {
          _this.loading = false
          if (res.data.code == 0) {
            const status = res.data.data.some((item) => item.errorMsg)
            if (!status) {
              _this.clearSelectClear()
              _this.refreshChange()
              _this.$message.success("导入成功")
              _this.$refs.commonImport.syncFn()
            } else {
              _this.errData = res.data.data.filter((item) => item.errorMsg)
              _this.$message.error("导入的excel表格数据有误!")
              _this.errDialog = true
            }
          } else if (res.data.code == 1) {
            _this.$message.warning(res.data.msg)
          } else {
            _this.$message.error("导入失败")
          }
          _this.$refs.commonImport.closeFullScreen()
        })
      }
    },
    initStatus(val) {
      this.excelDangerStatus = val
    },
    async exportdangerExcel(file) {
      let formdata = new FormData()
      formdata.append("file", file.raw)
      let res = await exportErrorExcel(formdata)
        .then((res) => {
          downloadBlob(res.data, "异常文件excel.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    showPriorityDailog() {
      this.$refs.priorityImport.syncFn()
    },
    importPriorityBtn(file) {
      if (file != null) {
        this.$refs.priorityImport.openFullScreen()
        var _this = this
        this.loading = true
        let formdata = new FormData()
        formdata.append("file", file.raw)
        batchUpdatePriority(formdata).then((res) => {
          _this.loading = false
          if (res.data.code == 0) {
            const status = res.data.data.some((item) => item.errorMsg)
            if (!status) {
              _this.clearSelectClear()
              _this.refreshChange()
              _this.$message.success("导入成功")
              _this.$refs.priorityImport.syncFn()
            } else {
              _this.errData = res.data.data.filter((item) => item.errorMsg)
              _this.$message.error("导入的excel表格数据有误!")
              _this.errDialog = true
            }
          } else if (res.data.code == 1) {
            _this.$message.warning(res.data.msg)
          } else {
            _this.$message.error("导入失败")
          }
          _this.$refs.priorityImport.closeFullScreen()
        })
      }
    },

    showOperateLog(id) {
      this.$refs.operationlog.showOperateLogDialog(id, 8)
    },
    updateField(obj) {
      let beginCreateTime,
        endCreateTime,
        beginUpdateTime,
        endUpdateTime = undefined

      if (obj.createTime) {
        beginCreateTime = obj.createTime[0]
        endCreateTime = obj.createTime[1]
      } else {
        beginCreateTime = undefined
        endCreateTime = undefined
      }

      if (obj.updateTime) {
        beginUpdateTime = obj.updateTime[0]
        endUpdateTime = obj.updateTime[1]
      } else {
        beginUpdateTime = undefined
        endUpdateTime = undefined
      }

      Object.assign(this.searchForm, obj, { beginCreateTime, endCreateTime, beginUpdateTime, endUpdateTime })
    }
  }
}
</script>

<style lang="scss" scoped>
#bseskurelatemanage {
  #multi-el-button {
    margin-left: 10px;
    margin-right: 10px;
  }

  .basekulate {
    ::v-deep .el-input__inner {
      text-align: left;
    }
  }
}
</style>
