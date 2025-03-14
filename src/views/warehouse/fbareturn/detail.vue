<template>
  <div id="wms_fba_return_detail">
    <basic-container>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: 'FBA退货单',
          list: [
            { label: '退货单号', value: returnForm.returnOrderNo },
            { label: '单据日期', value: returnForm.createTime },
            { label: '制单人', value: returnForm.createName }
          ]
        }"
      >
      </detail-template>

      <el-form ref="returnForm" :model="returnForm" :label-position="labelPosition">
        <!-- 发货信息 -->
        <detail-wrapper :options="{ title: '退货对象' }">
          <el-row>
            <el-col :span="5">
              <el-form-item
                label-width="72px"
                label="退货仓"
                prop="warehouseName"
                :rules="returnFormRules.warehouseName"
              >
                <el-select
                  v-model="returnForm.warehouseName"
                  popper-class="y-form-select"
                  placeholder="请检索输入"
                  filterable
                  size="small"
                  remote
                  reserve-keyword
                  @change="warehouseHandleSelect"
                  :remote-method="warehouseQuerySearch"
                  :disabled="isLook"
                >
                  <el-option
                    v-for="item in warehouseData"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item
                label-width="100px"
                label="运输方式:"
                prop="transportModeName"
                :rules="returnFormRules.transportModeName"
              >
                <el-select
                  v-model="returnForm.transportModeName"
                  popper-class="y-form-select"
                  placeholder="请选择"
                  filterable
                  size="small"
                  remote
                  reserve-keyword
                  @change="transportHandleSelect"
                  :disabled="isLook"
                >
                  <el-option
                    v-for="item in transportModeData"
                    :key="item.transportModeId"
                    :label="item.transportModeName"
                    :value="item.transportModeId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item
                label-width="100px"
                label="FBA移除号:"
                prop="fbaRemoveNo"
                :rules="returnFormRules.fbaRemoveNo"
              >
                <avue-crud-input
                  :maxlength="30"
                  v-model="returnForm.fbaRemoveNo"
                  size="small"
                  onlyTrim
                  :disabled="isLook"
                ></avue-crud-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item
                label-width="100px"
                label="处理方式:"
                prop="handleModeName"
                :rules="returnFormRules.handleModeName"
              >
                <el-select
                  v-model="returnForm.handleModeName"
                  popper-class="y-form-select"
                  placeholder="请选择"
                  filterable
                  size="small"
                  remote
                  reserve-keyword
                  @change="handleModeHandleSelect"
                  :disabled="isLook"
                >
                  <el-option
                    v-for="item in handleModeData"
                    :key="item.businessTypeId"
                    :label="item.businessTypeDescribe"
                    :value="item.businessTypeId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!-- 销售组 -->
            <el-col :span="4">
              <el-form-item
                label-width="100px"
                label="销售组:"
                prop="salesGroupId"
                :rules="returnFormRules.salesGroupId"
              >
                <el-select
                  v-model="returnForm.salesGroupId"
                  popper-class="y-form-select"
                  placeholder="请选择"
                  filterable
                  size="small"
                  remote
                  reserve-keyword
                  @change="salesGroupHandleSelect"
                  :disabled="isLook"
                >
                  <el-option
                    v-for="item in salesGroupData"
                    :key="item.groupId"
                    :label="item.name"
                    :value="item.groupId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="5">
              <el-form-item label-width="72px" label="站点:" prop="sitName" :rules="returnFormRules.sitName">
                <el-select
                  v-model="returnForm.sitName"
                  popper-class="y-form-select"
                  placeholder="请选择"
                  filterable
                  size="small"
                  reserve-keyword
                  @change="bsePlatformSitHandleSelect"
                  :disabled="isLook"
                >
                  <el-option
                    v-for="item in bsePlatformSitData"
                    :key="item.bsePlatformSitId"
                    :label="item.sitName"
                    :value="item.bsePlatformSitId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="72px" label="店铺:" prop="storeAccount" :rules="returnFormRules.storeAccount">
                <el-select
                  v-model="returnForm.storeAccount"
                  popper-class="y-form-select"
                  placeholder="请选择"
                  filterable
                  size="small"
                  reserve-keyword
                  @change="storeHandleSelect"
                  :disabled="isLook"
                >
                  <el-option
                    v-for="item in storeData"
                    :key="item.storeId"
                    :label="item.storeAccount"
                    :value="item.storeId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '退货原因', openPadding: true }">
          <!-- <el-form-item> -->
          <el-input
            clearable
            class="rm-border"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="returnForm.returnReason"
            placeholder="不得超过80个字符"
            :maxlength="80"
            :disabled="isLook"
          ></el-input>
          <!-- </el-form-item> -->
        </detail-wrapper>

        <!-- 列表 -->
        <detail-wrapper :options="{ title: '产品信息', openPadding: true }">
          <el-button type="primary" @click="showDailog" size="small" style="margin-bottom: 10px">批量导入</el-button>
          <avue-crud
            class="close-table-select"
            :data="returnForm.tableData"
            :option="handleTableOption"
            @row-click="rowClick"
          >
            <!-- fnsku -->
            <template slot="platformSkuCode" slot-scope="scope">
              <!-- <el-form :ref="'skuCodeRef'+scope.row.$index" :model="scope.row"> -->
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].platformSkuCode'"
                :rules="createPoinOrderRules.platformSkuCode"
              >
                <el-select
                  v-model="scope.row.platformSkuCode"
                  popper-class="y-form-select"
                  filterable
                  remote
                  placement="top"
                  size="mini"
                  reserve-keyword
                  placeholder="请检索输入"
                  :remote-method="fetchSuggestions"
                  @change="handleSelectPlatSku"
                  @focus="setCurrentIndex(scope.row.$index)"
                  :disabled="isLook"
                >
                  <el-option
                    v-for="item in bsePlatformSkuList"
                    :key="item.bsePlatformSkuId"
                    :label="item.platformSkuCode"
                    :value="item.bsePlatformSkuId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- </el-form> -->
            </template>
            <!-- 退货数量 -->
            <template slot="returnQuantity" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].returnQuantity'"
                :rules="createPoinOrderRules.returnQuantity"
              >
                <avue-crud-input
                  size="mini"
                  :maxlength="9"
                  clearable
                  v-model="scope.row.returnQuantity"
                  :disabled="isLook"
                ></avue-crud-input>
              </el-form-item>
            </template>

            <!-- 物流跟踪号 -->
            <template slot="logisticsTrackNo" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].logisticsTrackNo'"
                :rules="createPoinOrderRules.logisticsTrackNo"
              >
                <avue-crud-input
                  size="mini"
                  :maxlength="50"
                  clearable
                  v-model="scope.row.logisticsTrackNo"
                  :disabled="isLook"
                ></avue-crud-input>
              </el-form-item>
            </template>

            <!-- 销售状态 -->
            <template slot="saleStatus" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].saleStatus'"
                :rules="createPoinOrderRules.saleStatus"
              >
                <el-select
                  v-model="scope.row.saleStatus"
                  filterable
                  placeholder="请选择"
                  size="mini"
                  :disabled="isLook"
                  @focus="setCurrentIndex(scope.row.$index)"
                >
                  <el-option
                    v-for="item in saleStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- </el-form> -->
            </template>

            <!-- 自定义操作 -->
            <template slot="oprateHandle" slot-scope="scope">
              <div class="table-opration">
                <i
                  class="icon-shanchu y-icon-delect"
                  v-if="returnForm.tableData.length > 1"
                  @click="handleDelRow(scope.row, scope.row.$index)"
                  v-show="!isLook"
                ></i>
                <i
                  class="icon-xinzeng y-icon-add"
                  v-if="scope.row.$index === returnForm.tableData.length - 1"
                  @click="handleAddRow"
                  v-show="!isLook"
                ></i>
              </div>
            </template>
          </avue-crud>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '备注', openPadding: true }">
          <!-- <el-form-item> -->
          <el-input
            clearable
            class="rm-border"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="returnForm.remark"
            placeholder="不得超过80个字符"
            :maxlength="80"
            :disabled="isLook"
          ></el-input>
          <!-- </el-form-item> -->
        </detail-wrapper>
      </el-form>

      <!-- 操作按钮 -->
      <el-row class="y-submit-save">
        <el-col :span="24">
          <div class="text-align-right">
            <el-button
              type="primary"
              @click="handleSubmit(0)"
              size="small"
              v-if="permissions.warehouse_wmsfbareturn_save && !isLook"
              >保 存</el-button
            >
            <el-button
              type="primary"
              @click="handleSubmit(1)"
              size="small"
              v-if="permissions.warehouse_wmsfbareturn_submit && !isLook"
              >提 交</el-button
            >
          </div>
        </el-col>
      </el-row>

      <commonImport ref="commonImport" :downloadUrl="downloadUrl" :fileSuffix="fileSuffix" @import="importExcelBtn"
        >as
      </commonImport>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  getPlatformSkuData,
  handleImport
} from "@/api/warehouse/fbareturn/wmsfbareturndetail"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { getAll as getAllBsestore } from "@/api/baseSetup/bsestore"
import { tableOption, returnFormRules, createPoinOrderRules } from "@/const/crud/warehouse/fbareturn/wmsfbareturndetail"
import { getAll as getBsetransportmodesAll } from "@/api/baseSetup/bsetransportmodes"
import { getBussinessType } from "@/api/warehouse/wmsbusinesstype"
import { getGroupAllByParams, getGroupAllByParamsSpecial } from "@/api/adminUser/adminGroup"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import commonImport from "@/views/cockpit/commonImport"
export default {
  name: "wmsfbareturndetail",
  data() {
    return {
      downloadUrl: "/yiyuan/template/FBA退货批量导入模板.xlsx",
      fileSuffix: ".xlsx",
      isLook: false,
      //右对齐
      labelPosition: "right",
      returnFormRules: returnFormRules,
      createPoinOrderRules: createPoinOrderRules,
      handleTableOption: tableOption,
      warehouseData: [],
      transportModeData: [],
      handleModeData: [],
      bsePlatformSkuList: [],
      salesGroupData: [],
      bsePlatformSitData: [],
      storeData: [],
      saleStatusOptions: [
        {
          label: "在售",
          value: 0
        },
        {
          label: "停售",
          value: 1
        }
      ],
      //选择的行
      tableIndex: 0,
      returnForm: {
        returnOrderNo: this.$route.query.returnOrderNo,
        createTime: "",
        createName: "",
        warehouseName: "",
        warehouseId: "",
        transportModeName: "",
        transportModeId: "",
        fbaRemoveNo: "",
        handleModeName: "",
        handleMode: "",
        salesGroupId: "",
        salesGroupName: "",
        returnReason: "",
        remark: "",
        submitType: "",
        bsePlatformSitId: "",
        storeId: "",
        sitName: "",
        storeAccount: "",
        tableData: [
          {
            bsePlatformSkuId: "",
            platformSkuCode: "",
            skuCode: "",
            skuName: "",
            modelName: "",
            returnQuantity: "",
            saleStatus: "",
            logisticsTrackNo: ""
          },
          {
            bsePlatformSkuId: "",
            platformSkuCode: "",
            skuCode: "",
            skuName: "",
            modelName: "",
            returnQuantity: "",
            saleStatus: "",
            logisticsTrackNo: ""
          },
          {
            bsePlatformSkuId: "",
            platformSkuCode: "",
            skuCode: "",
            skuName: "",
            modelName: "",
            returnQuantity: "",
            saleStatus: "",
            logisticsTrackNo: ""
          }
        ]
      }
    }
  },
  created() {
    getBsetransportmodesAll().then((resp) => {
      this.transportModeData = resp.data.data
    })

    getBussinessType({ type: 4 }).then((resp) => {
      this.handleModeData = resp.data.data.records
      getBussinessType({ type: 5 }).then((resp) => {
        this.handleModeData = this.handleModeData.concat(resp.data.data.records)
      })
    })

    var params = {
      groupFunctionName: "销售类"
    }
    //加载销售组
    getGroupAllByParamsSpecial(params).then((response) => {
      var data = response.data.data
      if (data && data.length > 0) {
        this.salesGroupData = data
      }
    })

    getSitInfoByPlatformId({ platformTypeId: 1 }).then(({ data }) => {
      if (data.code == 0) {
        this.bsePlatformSitData = data.data
      }
    })
    this.getReturnDataInfo()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    commonImport
  },
  methods: {
    bsePlatformSitHandleSelect() {
      this.returnForm.bsePlatformSitId = this.returnForm.sitName
      if (!this.returnForm.bsePlatformSitId) {
        this.storeData = []
        return
      }
      this.clearData()
      getAllBsestore({ platformTypeId: 1, bsePlatformSitId: this.returnForm.bsePlatformSitId }).then(({ data }) => {
        if (data.code == 0) {
          this.storeData = data.data
          this.returnForm.storeId = ""
          this.returnForm.storeAccount = ""
        } else {
          this.storeData = []
          this.returnForm.storeId = ""
          this.returnForm.storeAccount = ""
        }
      })
    },
    storeHandleSelect() {
      this.returnForm.storeId = this.returnForm.storeAccount
      this.clearData()
    },
    importExcelBtn(file) {
      if (!this.returnForm.salesGroupId) {
        this.$message.error("请选择销售组!")
        return
      }
      if (!this.returnForm.bsePlatformSitId) {
        this.$message.error("请选择站点!")
        return
      }
      if (!this.returnForm.storeId) {
        this.$message.error("请选择店铺!")
        return
      }
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImport.openFullScreen()
      let formdata = new FormData()
      formdata.append("file", file.raw)
      formdata.append("salesGroupId", this.returnForm.salesGroupId)
      formdata.append("bsePlatformSitId", this.returnForm.bsePlatformSitId)
      formdata.append("storeId", this.returnForm.storeId)
      handleImport(formdata).then(({ data }) => {
        if (data.code == 0) {
          this.$set(this.returnForm, "tableData", data.data)
          this.$refs.commonImport.syncFn()
          this.$message.success("导入成功")
        } else if (data.code == 1) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("导入失败")
        }
        this.$refs.commonImport.closeFullScreen()
      })
    },
    showDailog() {
      if (!this.returnForm.salesGroupId) {
        this.$message.error("请选择销售组!")
        return
      }
      if (!this.returnForm.bsePlatformSitId) {
        this.$message.error("请选择站点!")
        return
      }
      if (!this.returnForm.storeId) {
        this.$message.error("请选择店铺!")
        return
      }
      this.$refs.commonImport.syncFn()
    },
    //加载数据
    getReturnDataInfo() {
      if (this.isNulls(this.returnForm.returnOrderNo)) {
        return
      }
      getObj(this.returnForm.returnOrderNo).then((resp) => {
        if (resp.data.code == 0) {
          var returnData = resp.data.data
          this.returnForm.createTime = returnData.createTime
          this.returnForm.createName = returnData.createName
          this.returnForm.warehouseName = returnData.warehouseName
          this.returnForm.warehouseId = returnData.warehouseId
          this.returnForm.transportModeId = returnData.transportModeId
          this.returnForm.transportModeName = returnData.transportModeName
          this.returnForm.fbaRemoveNo = returnData.fbaRemoveNo
          this.returnForm.handleMode = returnData.handleMode
          this.returnForm.handleModeName = returnData.handleModeName
          this.returnForm.salesGroupId = returnData.salesGroupId
          this.returnForm.bsePlatformSitId = returnData.bsePlatformSitId
          this.returnForm.storeId = returnData.storeId
          this.returnForm.sitName = returnData.sitName
          this.returnForm.storeAccount = returnData.storeAccount
          this.returnForm.returnReason = returnData.returnReason
          this.returnForm.remark = returnData.remark
          this.returnForm.status = returnData.status

          getAllBsestore({ platformTypeId: 1, bsePlatformSitId: this.returnForm.bsePlatformSitId }).then(({ data }) => {
            if (data.code == 0) {
              this.storeData = data.data
            } else {
              this.storeData = []
            }
          })
          this.$set(this.returnForm, "tableData", returnData.detailList)
          if (this.returnForm.status != 0) {
            this.isLook = true
          }
        } else {
          this.$message.error(resp.data.msg)
        }
      })
    },
    //选中行事件
    rowClick: function (row, column, event) {
      this.setCurrentIndex(row.$index)
    },
    setCurrentIndex(currentIndex) {
      //当前选中行
      this.tableIndex = currentIndex
    },
    //删除一行
    handleDelRow(row, index) {
      if (this.isLook) {
        return
      }
      if (this.returnForm.tableData.length > 1) {
        this.returnForm.tableData.splice(index, 1)
      } else {
        this.$message.warning("询价产品不能少于1个")
        return
      }
    },
    //新增一行
    handleAddRow() {
      if (this.isLook) {
        return
      }
      if (this.returnForm.tableData.length <= 200) {
        let currency = this.returnForm.tableData[0].currency

        this.$set(this.returnForm.tableData, this.returnForm.tableData.length, {
          bsePlatformSkuId: "",
          platformSkuCode: "",
          skuCode: "",
          skuName: "",
          modelName: "",
          returnQuantity: "",
          saleStatus: "",
          logisticsTrackNo: ""
        })
      } else {
        this.$message.warning("产品不能多于200个")
        return
      }
    },
    //远程查询仓库信息
    warehouseQuerySearch(param) {
      param = param ? param.trim() : param
      if (param == "") {
        this.warehouseData = []
        return
      }
      var obj = {
        warehouseName: param,
        isFba: false,
        funcState: 1, //启用
        isHideLoading: true
      }
      getAllWarehouse(obj).then((response) => {
        if (response.data.code == 0 && response.data.data.length > 0) {
          this.warehouseData = response.data.data
        } else {
          this.warehouseData = []
        }
      })
    },
    //仓库选择
    warehouseHandleSelect(id) {
      this.returnForm.warehouseId = id
    },
    //运输方式选择
    transportHandleSelect(id) {
      this.returnForm.transportModeId = id
    },
    //处理方式
    handleModeHandleSelect(id) {
      this.returnForm.handleMode = id
    },
    //销售组变更需要清空已经选择的平台sku
    salesGroupHandleSelect() {
      this.clearData()
    },

    clearData() {
      this.bsePlatformSkuList = []
      this.returnForm.tableData = []
      this.returnForm.tableData = [
        {
          bsePlatformSkuId: "",
          platformSkuCode: "",
          skuCode: "",
          skuName: "",
          modelName: "",
          returnQuantity: "",
          saleStatus: "",
          logisticsTrackNo: ""
        },
        {
          bsePlatformSkuId: "",
          platformSkuCode: "",
          skuCode: "",
          skuName: "",
          modelName: "",
          returnQuantity: "",
          saleStatus: "",
          logisticsTrackNo: ""
        },
        {
          bsePlatformSkuId: "",
          platformSkuCode: "",
          skuCode: "",
          skuName: "",
          modelName: "",
          returnQuantity: "",
          saleStatus: "",
          logisticsTrackNo: ""
        }
      ]
    },

    //搜索平台SKU
    fetchSuggestions(queryString) {
      this.bsePlatformSkuList = []
      if (this.returnForm.salesGroupId == "") {
        this.$message.error("请选择销售组!")
        return
      }
      if (!this.returnForm.bsePlatformSitId) {
        this.$message.error("请选择站点!")
        return
      }
      if (!this.returnForm.storeId) {
        this.$message.error("请选择店铺!")
        return
      }
      queryString = queryString ? queryString.trim() : queryString
      if (queryString == "") {
        this.bsePlatformSkuList = []
        return
      }
      var params = {
        salesGroupId: this.returnForm.salesGroupId,
        bsePlatformSitId: this.returnForm.bsePlatformSitId,
        storeId: this.returnForm.storeId,
        platformSku: queryString,
        isHideLoading: true
      }
      //查询平台SKU信息
      getPlatformSkuData(params).then((response) => {
        if (response.data.code == 0 && response.data.data.length > 0) {
          this.bsePlatformSkuList = response.data.data
        } else {
          this.bsePlatformSkuList = []
        }
      })
    },

    handleSelectPlatSku(id) {
      var item = this.bsePlatformSkuList.filter((info) => {
        return info.bsePlatformSkuId === id
      })
      var row = {
        bsePlatformSkuId: item[0].bsePlatformSkuId,
        platformSkuCode: item[0].platformSkuCode,
        skuCode: item[0].skuCode,
        modelName: item[0].modelName,
        skuName: item[0].skuName
      }
      this.$set(this.returnForm.tableData, this.tableIndex, row)
    },

    //保存数据
    handleSubmit(type) {
      var data = this.returnForm.tableData.filter((row) => {
        return row.bsePlatformSkuId && row.bsePlatformSkuId != ""
      })

      if (data.length == 0) {
        this.returnForm.tableData = [this.returnForm.tableData[0]]
      } else {
        this.returnForm.tableData = data
      }

      this.$nextTick(function () {
        //校验
        if (this.saveClickValidate()) {
          const tip = type === 0 ? "保存" : "提交"
          var _this = this

          //验证明细
          let msg = _this.checkTableRows()
          if (msg) {
            this.$message.warning(msg)
            return
          }
          this.returnForm.status = type
          var saveData = Object.assign(this.returnForm, {
            wmsFbaReturnDetailList: this.returnForm.tableData
          })

          addObj(saveData).then((resp) => {
            if (resp.data.code == 0) {
              var returndata = resp.data.data
              this.returnForm.returnOrderNo = returndata.returnOrderNo
              this.returnForm.createTime = returndata.createTime
              this.returnForm.createName = returndata.createName

              this.$message.success(tip + "成功!")
              if (returndata.status != 0) {
                this.isLook = true
                if (this.$parent.$refs.tagNavigate) {
                  this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
                }
              }
            } else {
              this.$$message.error(resp.data.msg)
            }
          })
        }
      })
    },
    saveClickValidate() {
      let flag = true

      this.$refs["returnForm"].validate((valid, rules) => {
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
      //验证是否选择中sku
      let letRowIsNull = this.returnForm.tableData.filter((row, index) => {
        return row.bsePlatformSkuId && row.bsePlatformSkuId != ""
      })
      if (letRowIsNull.length == 0) {
        return "请选择平台SKU"
      }
      var checkRepeatArr = []
      var checkFlag = false

      try {
        debugger
        letRowIsNull.forEach((row) => {
          var splicing = "平台skuid" + row.bsePlatformSkuId + "物流追踪号" + row.logisticsTrackNo
          checkRepeatArr.forEach((item) => {
            debugger
            if (splicing == item) {
              checkFlag = true
              throw new Error("跳出循环")
            }
          })
          checkRepeatArr.push(splicing)
        })
      } catch (e) {}

      if (checkFlag) {
        return "【平台SKU+物流追踪号】需要具有唯一性"
      }
    },

    /**
     * 检查字符串是否为空
     */
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped></style>
