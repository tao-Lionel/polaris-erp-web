<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-button v-if="permissions.logistics_tender_add" size="small" type="primary" @click="handleAdd(null)">
            新增
          </el-button>
          <el-button
            v-if="permissions.logistics_tender_import_require"
            size="small"
            type="primary"
            @click="handleImportRequire"
          >
            批量导入需求
          </el-button>
          <el-button v-if="permissions.logistics_tender_publish" size="small" type="primary" @click="handlePublish">
            批量发布
          </el-button>
          <el-button v-if="permissions.logistics_tender_open" size="small" type="primary" @click="handleOpening">
            批量开标
          </el-button>
          <el-button v-if="permissions.logistics_tender_export" size="small" type="primary" @click="handleExport">
            导出数据
          </el-button>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="inviteTenderCode">
              <el-input
                v-model="searchForm.inviteTenderCode"
                placeholder="招标需求单号,支持多个"
                clearable
                v-search-input
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item prop="inviteTenderStatusArray">
              <el-select
                v-model="searchForm.inviteTenderStatusArray"
                size="small"
                placeholder="需求状态"
                filterable
                clearable
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in inviteTenderStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="countryOfOrigin">
              <el-select v-model="searchForm.countryOfOrigin" clearable filterable placeholder="起运国家" size="small">
                <el-option
                  v-for="item in countryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="destinationCountry">
              <el-select
                v-model="searchForm.destinationCountry"
                clearable
                filterable
                placeholder="目的国家"
                size="small"
              >
                <el-option
                  v-for="item in countryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="portOfOrigin">
              <el-select clearable v-model="searchForm.portOfOrigin" filterable placeholder="起运港口" size="small">
                <el-option
                  v-for="item in departureHarbourOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="destinationPort">
              <el-select clearable v-model="searchForm.destinationPort" filterable placeholder="目的港口" size="small">
                <el-option
                  v-for="item in intoHarbourOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchAdvancedFormRef">
            <el-form-item prop="shippingLine">
              <el-select v-model="searchForm.shippingLine" filterable clearable placeholder="船司" size="small">
                <el-option
                  v-for="item in shipOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="planDeliveryTime">
              <el-date-picker
                v-model="searchForm.planDeliveryTime"
                type="daterange"
                start-placeholder="计划发运开始日期"
                end-placeholder="计划发运结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                size="small"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="tenderTime">
              <el-date-picker
                v-model="searchForm.tenderTime"
                type="daterange"
                start-placeholder="招标开始日期"
                end-placeholder="招标结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                size="small"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="tenderUserIdArray">
              <el-select
                v-model="searchForm.tenderUserIdArray"
                filterable
                clearable
                multiple
                collapse-tags
                placeholder="投标物流商"
                size="small"
              >
                <el-option
                  v-for="item in logisticsProviderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="isCapacityNumSatisfy">
              <el-select
                v-model="searchForm.isCapacityNumSatisfy"
                filterable
                clearable
                placeholder="舱位是否满足"
                size="small"
              >
                <el-option
                  v-for="item in isCapacityNumSatisfyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="isEmergency">
              <el-select v-model="searchForm.isEmergency" filterable clearable placeholder="是否加急" size="small">
                <el-option label="加急" :value="true"></el-option>
                <el-option label="不加急" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <avue-crud-search-item
              ref="searchCrudItemRef"
              :searchFields="searchFields"
              @updateField="updateField"
            ></avue-crud-search-item>
          </el-form>
        </template>

        <!-- 招标需求单号 -->
        <template slot="inviteTenderCode" slot-scope="scope">
          <copy-text hoverToShow>
            <a v-if="permissions.logistics_tender_detail" @click="handleDetail(scope.row)">{{
              scope.row.inviteTenderCode
            }}</a>
          </copy-text>
          <el-tag v-if="scope.row.isEmergency === 1" type="danger" size="mini">加急</el-tag>
        </template>

        <!-- 需求状态 -->
        <template slot="inviteTenderStatus" slot-scope="scope">
          <div :style="{ color: inviteTenderStatusStyle[scope.row.inviteTenderStatus] }">
            {{ scope.row.inviteTenderStatusName }}
          </div>
        </template>

        <!-- 计划发运时间 -->
        <template slot="plannedShipmentStartDate" slot-scope="scope">
          <span
            >{{ scope.row.plannedShipmentStartDate }} 至 <br />
            {{ scope.row.plannedShipmentEndDate }}</span
          >
        </template>

        <!-- 船司 -->
        <template slot="shippingLine" slot-scope="scope">
          <!-- 优先展示中标物流商投标的船司 -->
          <div>{{ scope.row.tenderShippingLine || scope.row.shippingLineList[0] }}</div>
          <a
            v-if="scope.row?.shippingLineList?.length > 1"
            @click="handleDetail(scope.row)"
            style="display: flex; justify-content: center; margin-top: 5px"
          >
            <span style="font-weight: bold; color: black">……</span>
          </a>
        </template>

        <!-- 招标时间 -->
        <template slot="tenderStartTime" slot-scope="scope">
          <span>
            {{ scope.row.tenderStartTime }} 至 <br />
            {{ scope.row.tenderEndTime }}
          </span>
        </template>

        <!-- 报价有效期 -->
        <!-- <template slot="priceValidityStartTime" slot-scope="scope">
          <span>
            {{ scope.row.priceValidityStartTime ? scope.row.priceValidityStartTime + " 至 " : "" }} <br />
            {{ scope.row.priceValidityEndTime }}
          </span>
        </template> -->

        <!-- 投标物流商 -->
        <template slot="tenderRecordCreateName" slot-scope="scope">
          <div>{{ scope.row.tenderRecordCreateName }}</div>
          <a
            v-if="permissions.logistics_tender_detail && scope.row?.wmsTenderRecordVos?.length > 1"
            @click="handleDetail(scope.row)"
            style="display: flex; justify-content: center; margin-top: 5px"
          >
            <span style="font-weight: bold; color: black">……</span>
          </a>
        </template>

        <!-- 创建人 -->
        <template slot="inviteTenderCreateName" slot-scope="scope">
          <div>{{ scope.row.inviteTenderCreateName }}</div>
          <div>{{ scope.row.inviteTenderCreateTime }}</div>
        </template>

        <!-- 更新人 -->
        <template slot="inviteTenderUpdateName" slot-scope="scope">
          <div>{{ scope.row.inviteTenderUpdateName }}</div>
          <div>{{ scope.row.inviteTenderUpdateTime }}</div>
        </template>

        <!-- 操作按钮 -->
        <template slot="operation" slot-scope="scope">
          <avue-crud-ctrl :list="getCtrlList(scope.row)"></avue-crud-ctrl>
        </template>
      </avue-crud>
    </basic-container>

    <addDialog ref="addDialogRef" @updateList="updateList"></addDialog>
    <detailDialog ref="detailDialogRef"></detailDialog>
    <confirmWinningBidDialog ref="confirmWinningBidDialogRef" @updateList="updateList"></confirmWinningBidDialog>

    <newCommonImport
      ref="newCommonImportRef"
      :downloadUrl="newDownloadUrl"
      :previewUrl="newPreviewUrl"
      :uploadUrl="newUploadUrl"
      :downloadTitle="newDownloadTitle"
      @import="getList"
    >
    </newCommonImport>

    <cancelDialog ref="cancelDialogRef" @updateList="updateList"></cancelDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption } from "./list.js"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getDictByType, downloadBlob } from "@/util/auth"
import addDialog from "./components/addDialog.vue"
import detailDialog from "./components/detailDialog.vue"
import confirmWinningBidDialog from "./components/confirmWinningBidDialog.vue"
import newCommonImport from "@/views/cockpit/newCommonImport.vue"
import {
  getPageApi,
  publishTenderApi,
  openTenderApi,
  exportInviteTenderApi,
  getTenderLogisticsApi,
  checkCanConfirmApi,
  updateTenderStatusApi
} from "@/api/logistics/logisticsProviderTendering.js"
import { getServiceScopeApi } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier.js"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import cancelDialog from "./components/cancelDialog.vue"

export default {
  name: "logisticsProviderTenderingList",
  components: {
    addDialog,
    newCommonImport,
    detailDialog,
    confirmWinningBidDialog,
    cancelDialog
  },
  data() {
    return {
      searchForm: {
        inviteTenderCode: undefined,
        inviteTenderStatus: undefined,
        inviteTenderStatusArray: [],
        shippingLine: undefined,
        planDeliveryTime: [],
        tenderTime: [],
        tenderUserId: undefined,
        tenderUserIdArray: [],
        countryOfOrigin: undefined,
        destinationCountry: undefined,
        portOfOrigin: undefined,
        destinationPort: undefined,
        isCapacityNumSatisfy: undefined,
        isEmergency: undefined
      },
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      countryOptions: [],
      departureHarbourOptions: [],
      intoHarbourOptions: [],
      searchFields: [
        { label: "创建人", value: "createUser", type: "input", default: true },
        { label: "创建时间", value: "createTime", type: "datetimerange" },
        { label: "更新人", value: "updateUser", type: "input" },
        { label: "更新时间", value: "updateTime", type: "datetimerange" }
      ],
      inviteTenderStatusOptions: [],
      shipOptions: [],
      logisticsProviderOptions: [],
      newDownloadUrl: "/warehouse/basis/downloadTemplate",
      newPreviewUrl: "/warehouse/basis/importDataPreview",
      newUploadUrl: "/warehouse/invitetender/importInviteTender",
      newDownloadTitle: "招标导入模板",
      inviteTenderStatusStyle: {
        OPENED: "#67C23A",
        AWAITING_OPENING: "#409EFF",
        AWAITING_CONFIRM: "#E6A23C",
        BIDDING: "#F56C6C",
        TO_BE_PUBLISHED: "#909399"
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  mounted: async function () {
    this.searchForm.inviteTenderCode = this.$route?.query?.inviteTenderCode
    this.updateTenderStatus()
    this.init()
    this.getList()
  },
  activated() {
    this.updateTenderStatus()
  },
  methods: {
    async init() {
      //加载所有国家
      getCountry().then((res) => {
        res.data.data.forEach((item) => {
          this.countryOptions.push({
            label: item.countryShortName,
            value: item.countryCode
          })
        })
      })
      // 需求状态
      this.inviteTenderStatusOptions = await getDictByType("invite_tender_status")
      this.inviteTenderStatusOptions?.sort((a, b) => a.sort - b.sort)
      //目的港
      this.intoHarbourOptions = await getDictByType("into_harbour")
      //起运港
      this.departureHarbourOptions = await getDictByType("departure_harbour")
      // 船司
      getServiceScopeApi().then((res) => {
        res.data.data.forEach((item) => {
          this.shipOptions.push({
            label: item,
            value: item
          })
        })
      })
      // 投标物流商
      getTenderLogisticsApi().then((res) => {
        this.logisticsProviderOptions = res.data.data.map((item) => {
          return {
            label: item.displayname,
            value: item.userId
          }
        })
      })
    },
    // 更新需求状态
    async updateTenderStatus() {
      await updateTenderStatusApi()
    },
    //加载列表数据
    async getList() {
      if (this.searchForm?.inviteTenderStatusArray?.length) {
        this.searchForm.inviteTenderStatus = this.searchForm.inviteTenderStatusArray.join(",")
      } else {
        this.searchForm.inviteTenderStatus = undefined
      }

      if (this.searchForm?.tenderUserIdArray?.length) {
        this.searchForm.tenderUserId = this.searchForm.tenderUserIdArray
      } else {
        this.searchForm.tenderUserId = undefined
      }

      const params = {
        page: {
          current: this.page.currentPage,
          size: this.page.pageSize
        },
        ...this.searchForm
      }
      const { data } = await getPageApi(params)

      if (data.code === 0) {
        // 如果有中标信息列表展示中标的物流商,否则展示投标时间最早的物流商
        this.tableData = data.data?.records?.map((item) => {
          let logisticsProvider = null

          // 如果有中标信息则展示中标的物流商
          if (item?.wmsTenderConfirmVos?.length > 0) {
            // 获取中标物流商信息
            const confirmedProviders =
              item.wmsTenderConfirmVos?.map((confirm) => ({
                ...item?.wmsTenderRecordVos.find((record) => record.id === confirm.tenderRecordId),
                requiredCapacity: confirm.requiredCapacity
              })) || []

            logisticsProvider = confirmedProviders[0]
          } else {
            // 投标时间最早的物流商
            logisticsProvider = item?.wmsTenderRecordVos?.reduce((min, current) => {
              const minDate = new Date(min.tenderRecordCreateTime)
              const currentDate = new Date(current.tenderRecordCreateTime)
              return currentDate < minDate ? current : min
            }, item?.wmsTenderRecordVos?.[0])
          }

          return {
            ...item,
            // priceValidityStartTime: logisticsProvider?.priceValidityStartTime,
            priceValidityEndTime: logisticsProvider?.priceValidityEndTime,
            oceanFreight: logisticsProvider?.oceanFreight,
            currency: logisticsProvider?.currency,
            remainingCapacity: logisticsProvider?.remainingCapacity,
            tenderRecordStatus: logisticsProvider?.tenderRecordStatus,
            tenderRecordCreateName: logisticsProvider?.tenderRecordCreateName,
            requiredCapacity: logisticsProvider?.requiredCapacity,
            tenderShippingLine: logisticsProvider?.tenderShippingLine
          }
        })

        this.page.total = data.data.total
      }
    },

    //刷新回调
    refreshChange() {
      this.getList()
    },
    //搜索回调
    searchChange() {
      this.page.currentPage = 1
      this.searchForm.plannedShipmentStartDate = this.searchForm?.planDeliveryTime?.[0]
      this.searchForm.plannedShipmentEndDate = this.searchForm?.planDeliveryTime?.[1]

      this.searchForm.tenderStartTime = this.searchForm?.tenderTime?.[0]
      this.searchForm.tenderEndTime = this.searchForm?.tenderTime?.[1]

      this.searchForm = deepCloneIgnoreNull(this.searchForm)

      this.getList()
      this.updateTenderStatus()
    },
    //重置搜索条件
    searchReset() {
      this.$refs.searchFormRef.resetFields()
      this.$refs.searchAdvancedFormRef?.resetFields()
      this.$refs.searchCrudItemRef.resetField()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    updateField(obj) {
      let createStartTime = obj.createTime?.[0]
      let createEndTime = obj.createTime?.[1]
      let updateStartTime = obj.updateTime?.[0]
      let updateEndTime = obj.updateTime?.[1]

      Object.assign(this.searchForm, obj, { createStartTime, createEndTime, updateStartTime, updateEndTime })
    },
    getCtrlList(row) {
      return [
        {
          title: "编辑",
          item: row,
          clickFn: (row) => {
            this.handleAdd(row)
          },
          show: this.permissions.logistics_tender_edit && row.inviteTenderStatus === "TO_BE_PUBLISHED" // 待发布才可以编辑
        },
        {
          title: "确定中标",
          item: row,
          clickFn: (row) => {
            this.handleConfirmWinningBid(row)
          },
          show:
            (this.permissions.logistics_tender_confirm_win && row.inviteTenderStatus === "AWAITING_CONFIRM") ||
            row.inviteTenderStatus === "AWAITING_OPENING" // 待定标/待开标才可操作
        },
        {
          title: "作废",
          item: row,
          clickFn: (row) => {
            this.$refs.cancelDialogRef.openDialog(row)
          },
          show: this.permissions.logistics_tender_confirm_invalid && row.inviteTenderStatus !== "INVALID"
        }
      ]
    },
    handleAdd(row) {
      this.$refs.addDialogRef.openDialog(row, {
        countryOptions: this.countryOptions, // 国家
        intoHarbourOptions: this.intoHarbourOptions, // 目的港
        departureHarbourOptions: this.departureHarbourOptions, // 起运港
        shipOptions: this.shipOptions //船司
      })
    },
    handleImportRequire() {
      this.$refs.newCommonImportRef.syncFn({
        downloadParams: { templateName: "招标导入模板.xlsx" },
        uploadParams: { templateName: "招标导入模板.xlsx" }
      })
    },
    handlePublish() {
      if (this.selectList.length <= 0) {
        this.$message.warning("请选择数据")
        return
      }
      // 待发布才可以发布
      for (let item of this.selectList) {
        if (item.inviteTenderStatus !== "TO_BE_PUBLISHED") {
          this.$message.warning("请选择待发布的招标需求")
          return
        }
      }
      this.$confirm(`您勾选了${this.selectList.length}条数据，发布招标需求之后不可撤回，您确定要发布吗?`, "批量发布", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const inviteTenderIds = this.selectList.map((item) => item.id)
          const { data } = await publishTenderApi(inviteTenderIds)

          if (data.code === 0) {
            this.$message.success("发布成功")
            this.updateList()
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((res) => {})
    },
    // 确定中标
    async handleConfirmWinningBid(row) {
      // 招标需求状态=待定标，且当前时间>招标截止时间，此时允许操作该功能
      const { data } = await checkCanConfirmApi(row.id)
      if (data.data) {
        this.$message.warning("还未到招标截止时间,不可操作")
        return
      }

      this.$refs.confirmWinningBidDialogRef.openDialog(row.id)
    },
    // 开标
    handleOpening() {
      if (this.selectList.length <= 0) {
        this.$message.warning("请选择数据")
        return
      }
      // 待开标才可以开标
      for (let item of this.selectList) {
        if (item.inviteTenderStatus !== "AWAITING_OPENING") {
          this.$message.warning("请选择待开标的招标需求")
          return
        }
      }
      this.$confirm(
        `您勾选了${this.selectList.length}条数据。<br/>
        开标前，请确认招标需求中，中标物流商都是正确的意向物流商。<br/>
        开标之后，中标结果将公布给您定标时选择的物流商。<br/>
        确认操作批量开标吗？`,
        "批量开标",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(async () => {
          const tenderInviteTenderIds = this.selectList.map((item) => item.id)
          const { data } = await openTenderApi(tenderInviteTenderIds)
          if (data.code === 0) {
            this.$message.success("开标成功")
            this.updateList()
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch((res) => {})
    },
    async handleExport() {
      const params = {
        page: {
          current: this.page.currentPage,
          size: this.page.pageSize
        },
        ...this.searchForm
      }
      const { data } = await exportInviteTenderApi(params)
      downloadBlob(data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
    },
    handleDetail(row) {
      this.$refs.detailDialogRef.openDialog(row.id)
    },
    updateList() {
      this.$refs.crud.selectClear()
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
