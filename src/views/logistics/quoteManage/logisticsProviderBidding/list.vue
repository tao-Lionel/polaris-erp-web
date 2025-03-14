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
          <div style="margin-bottom: 5px; font-size: 14px">
            尊敬的物流商伙伴<br />
            近期我司部分航线计划发运，现向各位发出招标需求。如您能满足我司的要求，欢迎您参与投标，期待与您的合作！<br />
            以下是我司发布的招标需求，请在<span style="color: red">【招标时间】截止前</span>
            投标。我司会在招标截止时间后1~2个工作日公布中标结果，并安排专人与物流商沟通后续的发运事项，最终解释权归我司所有！
          </div>
          <el-button
            v-if="permissions.logistics_bidding_batch_bidding"
            size="small"
            type="primary"
            @click="handleBatchBid"
            >批量投标
          </el-button>
          <el-button v-if="permissions.logistics_bidding_export" size="small" type="primary" @click="handleExport">
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
            <el-form-item prop="confirmFlag">
              <el-select v-model="searchForm.confirmFlag" filterable clearable placeholder="是否中标" size="small">
                <el-option
                  v-for="item in tenderRecordStatusOptions"
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
            <a v-if="permissions.logistics_bidding_detail" @click="handleDetail(scope.row)">{{
              scope.row.inviteTenderCode
            }}</a>
          </copy-text>
          <el-tag v-if="scope.row.isEmergency === 1" type="danger" size="mini">加急</el-tag>
        </template>

        <!-- 需求状态 -->
        <template slot="inviteTenderStatusNameForBidder" slot-scope="scope">
          <div :style="{ color: inviteTenderStatusStyle[scope.row.inviteTenderStatusForBidder] }">
            {{ scope.row.inviteTenderStatusNameForBidder }}
          </div>
        </template>

        <!-- 计划发运时间 -->
        <template slot="plannedShipmentStartDate" slot-scope="scope">
          <span>{{ scope.row.plannedShipmentStartDate }} 至 <br />{{ scope.row.plannedShipmentEndDate }}</span>
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
          <span>{{ scope.row.tenderStartTime }} 至 <br />{{ scope.row.tenderEndTime }}</span>
        </template>

        <!-- 价格有效时间 -->
        <!-- <template slot="priceValidityStartTime" slot-scope="scope">
          <span>
            {{ scope.row.priceValidityStartTime ? scope.row.priceValidityStartTime + " 至 " : "" }} <br />
            {{ scope.row.priceValidityEndTime }}
          </span>
        </template> -->

        <!-- 中标舱位量 -->
        <template slot="requiredCapacity" slot-scope="scope">
          <!-- 已开标时再展示中标舱位量 -->
          <div v-if="scope.row.inviteTenderStatus === 'OPENED'">
            <span v-if="scope.row?.wmsTenderRecordVos && scope.row.wmsTenderRecordVos.length > 0">
              {{ scope.row.requiredCapacity }}
            </span>
            <span v-else style="color: #f56c6c">未投标</span>
          </div>
          <div v-else>待开标</div>
        </template>

        <!-- 是否中标 -->
        <template slot="tenderRecordStatus" slot-scope="scope">
          <!-- 已开标时再展示是否中标 -->
          <div v-if="scope.row.inviteTenderStatus === 'OPENED'">
            <!-- 用户未参与投标，招标信息开标以后,是否中标应该显示为未投标 -->
            <div v-if="scope.row?.wmsTenderRecordVos && scope.row.wmsTenderRecordVos.length > 0">
              <span v-show="scope.row.tenderRecordStatus === 'N'" style="color: #f56c6c">否</span>
              <span v-show="scope.row.tenderRecordStatus === 'Y'" style="color: #67c23a">是</span>
            </div>
            <div v-else style="color: #f56c6c">未投标</div>
          </div>
          <div v-else>待开标</div>
        </template>

        <template slot="operation" slot-scope="scope">
          <avue-crud-ctrl :list="getCtrlList(scope.row)"></avue-crud-ctrl>
        </template>
      </avue-crud>
    </basic-container>

    <newCommonImport
      ref="newCommonImportRef"
      :downloadUrl="newDownloadUrl"
      :previewUrl="newPreviewUrl"
      :uploadUrl="newUploadUrl"
      :downloadTitle="newDownloadTitle"
      @import="getList"
    >
    </newCommonImport>

    <bidDialog ref="bidDialogRef" @updateList="updateList"></bidDialog>
    <detailDialog ref="detailDialogRef"></detailDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption } from "./list.js"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getDictByType, downloadBlob } from "@/util/auth"
import newCommonImport from "@/views/cockpit/newCommonImport.vue"
import bidDialog from "./components/bidDialog.vue"
import detailDialog from "./components/detailDialog.vue"
import { getPageApi, exportTenderApi } from "@/api/logistics/logisticsProviderBidding.js"
import { getServiceScopeApi } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier.js"
import { checkCanBidApi, updateTenderStatusApi } from "@/api/logistics/logisticsProviderTendering.js"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"

export default {
  name: "logisticsProviderBiddingList",
  components: {
    newCommonImport,
    bidDialog,
    detailDialog
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
        countryOfOrigin: undefined,
        destinationCountry: undefined,
        portOfOrigin: undefined,
        destinationPort: undefined,
        confirmFlag: undefined,
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
        { label: "创建时间", value: "createTime", type: "datetimerange", default: true },
        { label: "更新时间", value: "updateTime", type: "datetimerange" }
      ],
      inviteTenderStatusOptions: [],
      shipOptions: [],
      tenderRecordStatusOptions: [
        { label: "是", value: true },
        { label: "否", value: false }
      ],
      newDownloadUrl: "/warehouse/basis/downloadTemplate",
      newPreviewUrl: "/warehouse/basis/importDataPreview",
      newUploadUrl: "/warehouse/tender/importTender",
      newDownloadTitle: "批量投标模板",
      inviteTenderStatusStyle: {
        OPENED: "#67C23A",
        AWAITING_OPENING: "#409EFF",
        TENDERED: "#E6A23C",
        AWAITING_TENDER: "#F56C6C"
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  mounted: async function () {
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
      this.inviteTenderStatusOptions = await getDictByType("tender_record_status")
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
      const params = {
        page: {
          current: this.page.currentPage,
          size: this.page.pageSize
        },
        ...this.searchForm
      }

      const { data } = await getPageApi(params)

      if (data.code === 0) {
        this.tableData = data.data?.records?.map((item) => {
          // 获取中标物流商信息
          const confirmedProviders =
            item?.wmsTenderConfirmVos?.map((confirm) => {
              return {
                ...item?.wmsTenderRecordVos.find((record) => record.id === confirm.tenderRecordId),
                requiredCapacity: confirm.requiredCapacity,
                remark: confirm.remark
              }
            }) || []

          // 投标时间最早的物流商
          const minCreateTime = item?.wmsTenderRecordVos?.reduce((min, current) => {
            const minDate = new Date(min.tenderRecordCreateTime)
            const currentDate = new Date(current.tenderRecordCreateTime)
            return currentDate < minDate ? current : min
          }, item?.wmsTenderRecordVos?.[0])

          let obj = {}
          // 已开标就展示中标物流商信息，否则展示投标时间最早的物流商信息
          if (item.inviteTenderStatusForBidder === "OPENED") {
            obj = {
              // priceValidityStartTime: confirmedProviders?.[0]?.priceValidityStartTime,
              priceValidityEndTime: confirmedProviders?.[0]?.priceValidityEndTime,
              oceanFreight: confirmedProviders?.[0]?.oceanFreight,
              currency: confirmedProviders?.[0]?.currency,
              remainingCapacity: confirmedProviders?.[0]?.remainingCapacity,
              tenderRecordStatus: confirmedProviders?.[0]?.tenderRecordStatus || "N",
              tenderShippingLine: confirmedProviders?.[0]?.tenderShippingLine,
              requiredCapacity: confirmedProviders?.[0]?.requiredCapacity,
              remark: confirmedProviders?.[0]?.remark
            }
          } else {
            obj = {
              // priceValidityStartTime: minCreateTime?.priceValidityStartTime,
              priceValidityEndTime: minCreateTime?.priceValidityEndTime,
              oceanFreight: minCreateTime?.oceanFreight,
              currency: minCreateTime?.currency,
              remainingCapacity: minCreateTime?.remainingCapacity,
              tenderRecordStatus: minCreateTime?.tenderRecordStatus,
              tenderShippingLine: minCreateTime?.tenderShippingLine
            }
          }

          return {
            ...item,
            ...obj
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
          title: "投标",
          item: row,
          clickFn: (row) => {
            this.handleBidding(row)
          },
          show:
            (this.permissions.logistics_bidding_add && row.inviteTenderStatusForBidder === "AWAITING_TENDER") ||
            row.inviteTenderStatusForBidder === "TENDERED" // 待投标/已投标
        }
      ]
    },
    handleBatchBid() {
      // 招标需求状态=待投标/已投标，且当前时间＜招标截止时间
      this.$refs.newCommonImportRef.syncFn({
        downloadParams: { templateName: "批量投标模板.xlsx" },
        uploadParams: { templateName: "批量投标模板.xlsx" }
      })
    },
    async handleExport() {
      const params = {
        page: {
          current: this.page.currentPage,
          size: this.page.pageSize
        },
        ...this.searchForm
      }
      const { data } = await exportTenderApi(params)
      downloadBlob(data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
    },
    async handleBidding(row) {
      // 招标需求状态=待投标/已投标，且当前时间＜招标截止时间
      const { data } = await checkCanBidApi(row.id)

      if (data.data) {
        this.$message.warning("招标截止时间已到,不可操作")
        return
      }

      this.$refs.bidDialogRef.openDialog(row.id)
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
