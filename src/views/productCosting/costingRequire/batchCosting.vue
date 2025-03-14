<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="batchCostingTableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
        :cell-class-name="getCellClass"
      >
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px">
            <span>生成进度(已处理/总数)：</span>
            <span> {{ processedCount }} / {{ generatingTotal }}</span>
            <el-progress
              style="width: 400px; display: flex; align-items: center"
              :percentage="percentage"
              stroke-width="8"
            ></el-progress>
          </div>

          <el-tabs v-model="costingStatus" @tab-click="changeTabStatus">
            <el-tab-pane :label="`全部(${totalCount})`" name="TOTAL"></el-tab-pane>
            <el-tab-pane :label="`生成成功(${successCount})`" name="SUCCESS"></el-tab-pane>
            <el-tab-pane :label="`生成失败(${failCount})`" name="FAIL"></el-tab-pane>
          </el-tabs>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="platform">
              <el-form-item prop="site">
                <el-select
                  v-model="searchForm.site"
                  size="small"
                  filterable
                  placeholder="站点,支持多选"
                  clearable
                  multiple
                >
                  <el-option v-for="item in siteOptions" :key="item.value" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-select
                v-model="searchForm.platform"
                size="small"
                placeholder="平台,支持多选"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in platformOptions"
                  :key="item.platformTypeCode"
                  :label="item.platformTypeName"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="standardSkuCode">
              <el-input
                v-model="searchForm.standardSkuCode"
                size="small"
                placeholder="标准SKU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="categoryGrouping">
              <el-select
                v-model="searchForm.categoryGrouping"
                size="small"
                filterable
                placeholder="品类分组,支持多选"
                clearable
                multiple
              >
                <el-option
                  v-for="item in categoryGroupingOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <!-- 生成状态 -->
        <template slot="pricingGenerateStatus" slot-scope="scope">
          <span :style="{ color: pricingGenerateStatusColor[scope.row?.pricingGenerateStatus] }">
            {{ scope.row?.pricingGenerateStatusName }}
          </span>
        </template>

        <!-- 备注 -->
        <template slot="remarkString" slot-scope="scope">
          <el-popover v-if="scope.row.remarkString !== '-'" placement="top-start" width="200" trigger="hover">
            <copy-text hoverToShow slot="reference">
              {{ scope.row.remarkString }}
            </copy-text>

            <div>{{ scope.row.remarkString }}</div>
          </el-popover>
          <div v-else>{{ scope.row.remarkString }}</div>
        </template>

        <template slot="salePrice" slot-scope="scope">
          <el-input
            v-model="scope.row.salePrice"
            size="small"
            placeholder="含税售价"
            clearable
            :disabled="!scope.row.disabledByCalculationType"
            @change="handleSalePriceChange($event, scope.row)"
          ></el-input>
        </template>

        <template slot="supplyPrice" slot-scope="scope">
          <el-input
            v-model="scope.row.supplyPrice"
            size="small"
            placeholder="供货价"
            clearable
            :disabled="!scope.row.disabledByCalculationType"
            @change="handleSupplyPriceChange($event, scope.row)"
          ></el-input>
        </template>

        <template slot="promotionExpenses" slot-scope="scope">
          <el-input
            v-model="scope.row.promotionExpenses"
            size="small"
            placeholder="推广费比"
            clearable
            @change="handlePromotionRatioChange($event, scope.row)"
          >
            <template slot="suffix"> % </template>
          </el-input>
        </template>
        <template slot="profit" slot-scope="scope">
          <el-input
            v-model="scope.row.profit"
            size="small"
            placeholder="税前利润率"
            clearable
            :disabled="scope.row.disabledByCalculationType"
            @change="handleProfitChange($event, scope.row)"
          >
            <template slot="suffix"> % </template>
          </el-input>
        </template>
        <template slot="ppmInput" slot-scope="scope">
          <el-input
            v-model="scope.row.ppmInput"
            size="small"
            placeholder="PPM"
            clearable
            :disabled="scope.row.disablePPM"
            @change="handlePPMChange($event, scope.row)"
          >
            <template slot="suffix"> % </template>
          </el-input>
        </template>

        <!-- 核价类型 -->
        <template slot="pricingCalculationType" slot-scope="scope">
          <el-radio-group
            v-model="scope.row.pricingCalculationType"
            size="small"
            @change="handlePricingCalculationTypeChange($event, scope.row)"
          >
            <el-radio-button v-for="item in pricingCalculationTypeOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </template>
        <!-- 核价逻辑 -->
        <template slot="pricingCalculationMethod" slot-scope="scope">
          <el-radio-group
            v-model="scope.row.pricingCalculationMethod"
            size="small"
            @change="handlePricingCalculationMethodChange($event, scope.row)"
          >
            <el-radio-button v-for="item in pricingCalculationMethodOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </template>
        <!-- 采购供应商 -->
        <template slot="purchaseSupplierCode" slot-scope="scope">
          <el-select
            v-model="scope.row.purchaseSupplierCode"
            size="small"
            filterable
            placeholder="采购供应商"
            clearable
            @change="handlePurchaseSupplierCodeChange($event, scope.row)"
            @visible-change="handleVisibleChange($event, scope.row)"
          >
            <!-- 添加当前供应商作为默认选项 -->
            <el-option
              v-if="scope.row.purchaseSupplierCode && !supplierOptions.length"
              :value="scope.row.purchaseSupplierCode"
              :label="scope.row.purchaseSupplierName"
            ></el-option>

            <el-option
              v-for="item in supplierOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <!-- 使用海外仓 -->
        <template slot="useOverseasWarehouse" slot-scope="scope">
          <el-switch
            v-model="scope.row.useOverseasWarehouse"
            active-value="Y"
            inactive-value="N"
            @change="handleUseOverseasWarehouseChange($event, scope.row)"
          >
          </el-switch>
        </template>
        <!-- 使用平台仓 -->
        <template slot="usePlatformWarehouse" slot-scope="scope">
          <el-switch
            v-model="scope.row.usePlatformWarehouse"
            active-value="Y"
            inactive-value="N"
            @change="handleUsePlatformWarehouseChange($event, scope.row)"
          >
          </el-switch>
        </template>
        <template slot="operation" slot-scope="scope">
          <a @click="handleDetail(scope.row)">详情</a>
        </template>
      </avue-crud>

      <div style="display: flex; justify-content: flex-start; margin: 10px 20px 0 0">
        <el-button @click="handleClose">关 闭</el-button>
        <el-button type="primary" :loading="loading" @click="handleBatchSubmit">提 交</el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { batchCostingTableOption, pricingGenerateStatusColor } from "./list"
import { getPlayTypeAll } from "@/api/order/orderManage"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getDictByType, setFiltering } from "@/util/auth"
import {
  getProductPricingSuccessPageApi,
  getProductPricingCalculateApi,
  batchSubmitPricingDemandApi,
  getProductPricingDemandByIdApi,
  getSupplierBySkuApi,
  getProductPricingSyncCalculateApi
} from "@/api/product/pricing"
import WebSocketService from "@/util/webSocket.js"
import { getStore as getSession } from "@/util/store"

export default {
  name: "batchCosting",
  components: {},
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      searchForm: {
        platform: "",
        site: "",
        standardSkuCode: "",
        categoryGrouping: [],
        batchNo: null,
        pricingGenerateStatus: ""
      },
      batchCostingTableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      platformOptions: [],
      siteOptions: [],
      supplierOptions: [],
      pricingCalculationTypeOptions: [],
      pricingCalculationMethodOptions: [],
      loading: false,
      categoryGroupingOptions: [],
      pricingGenerateStatusColor,
      wsService: null, // WebSocket 服务实例
      serverSessionId: "",
      percentage: 0, //进度条
      generatingFlag: false, //是否正在生成
      costingStatus: "TOTAL",
      generatingTotal: 0,
      successCount: 0,
      failCount: 0,
      messageQueue: [], // 存储 WebSocket 消息的队列
      isProcessingList: false, // 标记是否正在处理 getList
      processedCount: 0, // 用于进度条计算
      currentRequestId: 0, // 添加请求标识符
      totalCount: 0,
      shouldRerender: true // 添加控制重新渲染的标志
    }
  },
  created() {},
  mounted: async function () {
    console.log("mounted======")
    this.reinitialize()
  },
  activated() {
    console.log("this.shouldRerender", this.shouldRerender)
    if (!this.shouldRerender) {
      // 如果需要重新渲染，则重新初始化
      this.reinitialize()
    } else {
      if (this.serverSessionId) {
        this.getList(true)
      }
    }
  },
  beforeDestroy() {
    console.log("beforeDestroy")
    this.cleanupComponent()
  },
  deactivated() {
    console.log("销毁")
  },
  methods: {
    reinitialize() {
      this.shouldRerender = true
      this.$nextTick(async () => {
        const [calculationTypes, calculationMethods, categoryGroupingOptions] = await Promise.all([
          getDictByType("pricing_calculation_type"),
          getDictByType("pricing_calculation_method"),
          getDictByType("costing_category_grouping")
        ])

        this.pricingCalculationTypeOptions = calculationTypes
        this.pricingCalculationMethodOptions = calculationMethods
        this.categoryGroupingOptions = categoryGroupingOptions

        await Promise.all([this.getPlatform(), this.getAllCountry()])
        this.initWebSocket()
      })
    },

    initWebSocket() {
      this.tableData = []
      // 初始化 WebSocket 服务并连接
      this.wsService = new WebSocketService(`${process.env.VUE_APP_WEBSOCKET_URL}/ws/chat`, {
        autoReconnect: false, // 启用自动重连
        maxRetries: 3, // 最大重试3次
        reconnectInterval: 5000, // 5秒重连间隔
        heartbeatInterval: 15000, // 15秒心跳间隔
        heartbeatTimeout: 60000, // 60秒心跳超时
        messageTimeout: 120000 // 2分钟消息超时
      })

      // 监听网络状态变化
      this.wsService.onNetworkStatus((status) => {
        switch (status.status) {
          case "CONNECTED":
            this.$message.success("网络连接已恢复")
            this.$message.closeAll()
            break

          case "DISCONNECTED":
            this.$message({
              message: "网络连接已断开",
              type: "warning",
              duration: 3000,
              showClose: true
            })
            break

          case "RECONNECTING":
            this.$message({
              message: `正在尝试重新连接(${status.retryCount}/${this.wsService.maxRetries})...`,
              type: "info",
              duration: 3000,
              showClose: true
            })
            break

          case "ERROR":
            let errorMessage = "网络连接异常"
            switch (status.type) {
              case "HEARTBEAT_TIMEOUT":
                errorMessage = "心跳检测超时，正在重新连接..."
                break
              case "MESSAGE_TIMEOUT":
                errorMessage = "长时间未收到消息，正在重新连接..."
                break
              case "MAX_RETRIES_REACHED":
                errorMessage = "重连次数已达上限，请刷新页面重试"
                break
              case "CONNECTION_ERROR":
                errorMessage = "网络连接失败，请检查网络设置"
                break
            }

            this.$message({
              message: errorMessage,
              type: "error",
              duration: 3000,
              showClose: true
            })
            break
        }
      })

      // 设置接收到消息后的回调
      this.wsService.onMessage((message) => {
        this.generatingFlag = true
        if (this.isProcessingList) {
          // 如果正在处理 getList, 将消息加入队列
          this.messageQueue.push(message)
        } else {
          // 否则直接处理消息
          this.processWebSocketMessage(message)
        }
      })

      // 设置连接成功后的回调
      this.wsService.onOpen(() => {
        console.log("WebSocket 连接成功")
        // this.wsService.sendMessage("Hello WebSocket") // 连接成功后发送消息
      })

      // 设置连接关闭后的回调
      this.wsService.onClose(() => {
        console.log("WebSocket 连接关闭")
        this.generatingFlag = false
      })

      // 设置错误处理的回调
      this.wsService.onError((error) => {
        console.error("WebSocket 错误", error)
      })

      // 连接 WebSocket
      this.wsService.connect()
    },

    // 处理 WebSocket 消息
    processWebSocketMessage(message) {
      try {
        const data = JSON.parse(message)
        if (data?.server_session_id) {
          this.serverSessionId = data.server_session_id
          this.syncCalc()
        } else if (data?.data) {
          this.searchForm.batchNo = data?.data
        } else {
          this.page.total = data.total
          this.generatingTotal = data.generatingTotal
          if (data.records.length > 0) {
            const records = this.setPricingData(data.records)
            const { pricingGenerateStatus } = records?.[0]

            // 更新成功和失败的计数
            this.successCount = pricingGenerateStatus === "SUCCESS" ? ++this.successCount : this.successCount
            this.failCount = pricingGenerateStatus === "FAIL" ? ++this.failCount : this.failCount
            this.totalCount = this.successCount + this.failCount

            // 使用 processedCount 来计算进度
            this.processedCount++
            // 更新进度条
            this.percentage = ((this.processedCount / this.generatingTotal) * 100).toFixed(0)

            // 根据当前选中的tab和记录状态决定是否添加到tableData
            const shouldAddRecord =
              this.costingStatus === "TOTAL" ||
              (this.costingStatus === "SUCCESS" && pricingGenerateStatus === "SUCCESS") ||
              (this.costingStatus === "FAIL" && pricingGenerateStatus === "FAIL")

            if (shouldAddRecord) {
              // 检查是否存在相同记录
              const exists = this.tableData.some((item) => item.pricingDemandId === records[0].pricingDemandId)
              if (!exists) {
                // 只有当前页未满时才添加数据
                const currentPageSize = this.page.pageSize
                if (this.tableData.length < currentPageSize) {
                  this.tableData.push(records?.[0])
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("JSON 解析失败", error)
      }
    },

    // 异步核价计算
    async syncCalc() {
      const filtering = getSession({ name: "syncCalcFiltering" })
      this.wsService.sendMessage(JSON.stringify({ filtering, severSessionId: this.serverSessionId }))

      // 获取核价需求列表
      // const { data } = await getProductPricingSyncCalculateApi({ filtering, severSessionId: this.serverSessionId })
      // if (data.code === 0) {
      //   this.searchForm.batchNo = data.data
      // } else {
      //   this.$message.error("异步核价计算失败")
      // }
    },

    // 获取国家
    async getAllCountry() {
      const { data } = await getCountry()
      this.siteOptions = data.data.map((item) => ({
        label: item.countryShortName,
        value: item.countryCode
      }))
    },
    // 获取平台
    async getPlatform() {
      const { data } = await getPlayTypeAll()
      this.platformOptions = data.data
    },

    setPricingData(arr) {
      return arr.map((item) => {
        item.promotionExpenses = this.handlePercent(item.promotionExpenses)
        item.profit = this.handlePercent(item.profit)
        item.ppmInput = this.handlePercent(item.ppm)
        item.nonTaxPrice = item.nonTaxPrice?.toFixed(2)
        item.fobCost = item.fobCost?.toFixed(2)
        item.remarkString = item.remark || "-"

        // 正算时 计算税前利润率
        if (item.pricingCalculationType === "PROFIT_CALCULATION") {
          item.profit = this.handleProfit(item.preTaxProfit, item.calSupplyPrice)
        } else {
          // 反算时 使用计算后的供货价和含税售价
          item.supplyPrice = item.calSupplyPrice?.toFixed(2)
          item.salePrice = item.calSalePrice?.toFixed(2)
        }

        Object.assign(item, this.setWarehouseServiceFlags(item.pricingWarehouseServiceMethod))
        this.setPricingCalculationType(item.pricingCalculationType, item, false)
        this.setPricingCalculationMethod(item.pricingCalculationMethod, item, false)
        return item
      })
    },

    //加载列表数据
    async getList(isRefresh = false) {
      this.isProcessingList = true
      const requestId = ++this.currentRequestId // 生成新的请求标识符

      try {
        if (this.costingStatus === "TOTAL") {
          this.searchForm.pricingGenerateStatus = ["SUCCESS", "FAIL"]
        }
        const params = {
          page: this.page.currentPage,
          pageSize: this.page.pageSize,
          filtering: setFiltering(this.searchForm, { pricingGenerateStatus: "IN" })
        }

        const { data } = await getProductPricingSuccessPageApi(params)

        // 如果这不是最新请求，则忽略响应
        if (requestId !== this.currentRequestId) {
          console.log("忽略过期的请求响应")
          return
        }

        if (data.code === 0) {
          const records = this.setPricingData(data.data.records)

          console.log("this.generatingFlag", this.generatingFlag)

          if (!this.generatingFlag) {
            // 如果已经生成完成了，则更新状态
            const { FAIL, SUCCESS, TOTAL } = data.data.customAggregateRecord
            this.successCount = SUCCESS
            this.failCount = FAIL
            this.totalCount = TOTAL
          }

          if (isRefresh) {
            this.tableData = records
            this.page.total = data.data.total
          }
          // else {
          //   // 先去重
          //   const newRecords = records.filter(
          //     (newItem) =>
          //       !this.tableData.some((existingItem) => existingItem.pricingDemandId === newItem.pricingDemandId)
          //   )
          //   this.tableData.unshift(...newRecords)
          // }
          // 处理队列中的消息
          while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift()
            this.processWebSocketMessage(message)
          }
        }
      } finally {
        if (requestId === this.currentRequestId) {
          this.isProcessingList = false
        }
      }
    },

    //刷新回调
    refreshChange() {
      this.getList(true)
    },
    //搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList(true)
    },
    //重置搜索条件
    searchReset() {
      console.log("重置")
      this.$refs?.searchFormRef?.resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList(true)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList(true)
    },
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    clearSelectClear() {
      this.$refs.crud?.selectClear()
    },
    // 详情
    handleDetail(row) {
      this.$router.push({
        path: `/productCosting/costingRequire/costing`,
        query: {
          id: row.pricingDemandId
        }
      })
    },
    // 处理百分比 乘100
    handlePercent(value) {
      return value || value === 0 ? (value * 100).toFixed(2) : null
    },
    // 处理百分比 除100  计算时保留4位小数
    handlePercentDivide(value) {
      return value || value === 0 ? (value / 100).toFixed(4) : null
    },
    // 计算税前利润率 税前利润/供货价
    handleProfit(value, supplyPrice) {
      if (value === undefined || value === null || !supplyPrice) return null
      return ((value / supplyPrice) * 100).toFixed(2)
    },

    // 核价计算
    async pricingCalculate(obj, row) {
      const params = {
        site: row.site,
        pricingDemandId: row.pricingDemandId,
        platform: row.platform,
        standardSkuCode: row.standardSkuCode,
        skuCode: row.skuCode,
        orderBusinessType: row.orderBusinessType,
        logisticsDeliveryMode: row.logisticsDeliveryMode,
        purchaseSupplierCode: row.purchaseSupplierCode,
        salePrice: row.salePrice,
        pricingCalculationType: row.pricingCalculationType,
        supplyPrice: row.supplyPrice,
        pricingCalculationMethod: row.pricingCalculationMethod,
        pricingWarehouseServiceMethod: row.pricingWarehouseServiceMethod,
        promotionExpenses: this.handlePercentDivide(row.promotionExpenses),
        profit: this.handlePercentDivide(row.profit),
        ppmInput: this.handlePercentDivide(row.ppmInput),
        ...obj
      }
      try {
        const { data } = await getProductPricingCalculateApi(params)
        if (data.code === 0) {
          this.$message.success("核价计算成功")
          this.getCostingDemand(row.pricingDemandId, row)
        }
      } catch (error) {
        console.log("核价计算失败", error)
      }
    },

    // 设置平台仓和海外仓
    setWarehouseServiceFlags(warehouseMethod) {
      const flags = {
        useOverseasWarehouse: "N",
        usePlatformWarehouse: "N"
      }
      switch (warehouseMethod) {
        case "ALL":
          flags.useOverseasWarehouse = "Y"
          flags.usePlatformWarehouse = "Y"
          break
        case "WAREHOUSE":
          flags.useOverseasWarehouse = "Y"
          break
        case "PLATFORM":
          flags.usePlatformWarehouse = "Y"
          break
      }
      return flags
    },

    // 处理正算反算
    setPricingCalculationType(val, row, flag = true) {
      if (val === "PROFIT_CALCULATION") {
        // 选中正算利润：禁用税前利润率，并（flag为true时）清空值
        flag && this.$set(row, "profit", null)
        this.$set(row, "disabledByCalculationType", true)
      } else if (val === "SELL_PRICE_CALCULATION") {
        // 选中反算售价：禁用含税售价和供货价，并（flag为true时）清空值
        flag && this.$set(row, "salePrice", null)
        flag && this.$set(row, "supplyPrice", null)
        this.$set(row, "disabledByCalculationType", false)
      }
    },

    // 处理核价逻辑
    setPricingCalculationMethod(val, row, flag = true) {
      if (val === "FREIGHT") {
        // 选中运费 清空（flag为true时）PPM，并禁用
        flag && this.$set(row, "ppmInput", null)
        this.$set(row, "disablePPM", true)
      } else if (val === "PPM") {
        // 选中【PPM逻辑】时，字段【PPM】可编辑；
        this.$set(row, "disablePPM", false)
      }
    },

    // 获取核价需求
    async getCostingDemand(pricingDemandId, row) {
      const { data } = await getProductPricingDemandByIdApi(pricingDemandId)
      if (data.code === 0) {
        const newData = { ...data.data }

        // 找到当前行在tableData中的索引
        const index = this.tableData.findIndex((item) => item.pricingDemandId === row.pricingDemandId)
        if (index !== -1) {
          Object.assign(newData, this.setWarehouseServiceFlags(newData.pricingWarehouseServiceMethod))

          // 不改变含税售价、供货价
          newData.salePrice = this.tableData[index].salePrice
          newData.supplyPrice = this.tableData[index].supplyPrice
          newData.promotionExpenses = this.tableData[index].promotionExpenses
          newData.profit = this.tableData[index].profit
          newData.ppmInput = this.tableData[index].ppmInput
          newData.nonTaxPrice = data.data.nonTaxPrice?.toFixed(2)
          newData.fobCost = data.data.fobCost?.toFixed(2)

          // newData.promotionExpenses = data.data.promotionExpenses
          //   ? this.handlePercent(data.data.promotionExpenses)
          //   : null
          // newData.profit = this.handlePercent(data.data.profit)
          // newData.ppmInput = this.handlePercent(data.data.ppm)

          // 正算时 计算税前利润率
          if (row.pricingCalculationType === "PROFIT_CALCULATION") {
            newData.profit = this.handleProfit(data.data.preTaxProfit, data.data.calSupplyPrice)
          } else {
            // 反算时 使用计算后的供货价和含税售价
            newData.supplyPrice = data.data.calSupplyPrice?.toFixed(2)
            newData.salePrice = data.data.calSalePrice?.toFixed(2)
          }
          // 使用Object.assign更新当前行数据，保持响应式
          Object.assign(this.tableData[index], newData)

          // this.setPricingCalculationType(this.tableData[index].pricingCalculationType, this.tableData[index])
          // this.setPricingCalculationMethod(this.tableData[index].pricingCalculationMethod, this.tableData[index])
        }
      }
    },

    validateNumber(val, row, key) {
      if (!val) return
      // 推广费比、税前利润率、PPM只允许输入6位整数+2位小数
      if (key === "promotionExpenses" || key === "profit" || key === "ppmInput") {
        const regex = /^\d{1,6}(\.\d{0,2})?$/
        if (!regex.test(val)) {
          this.$message.warning("请输入最多6位整数，2位小数的数字")
          row[key] = null
          return false
        }
      } else {
        const newVal = parseFloat(val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0"))
        if (newVal || newVal === 0) {
          row[key] = newVal
        } else {
          row[key] = null
        }
      }
      return true
    },
    // 含税售价
    handleSalePriceChange(val, row) {
      console.log(val, row)
      if (!this.validateNumber(val, row, "salePrice")) return
      this.pricingCalculate({ salePrice: row.salePrice }, row)
    },
    // 供货价
    handleSupplyPriceChange(val, row) {
      if (!this.validateNumber(val, row, "supplyPrice")) return
      this.pricingCalculate({ supplyPrice: row.supplyPrice }, row)
    },
    // 推广费比
    handlePromotionRatioChange(val, row) {
      if (!this.validateNumber(val, row, "promotionExpenses")) return
      this.pricingCalculate({ promotionExpenses: this.handlePercentDivide(val) }, row)
    },
    // 税前利润率
    handleProfitChange(val, row) {
      if (!this.validateNumber(val, row, "profit")) return
      this.pricingCalculate({ profit: this.handlePercentDivide(val) }, row)
    },
    // PPM
    handlePPMChange(val, row) {
      if (!this.validateNumber(val, row, "ppmInput")) return
      this.pricingCalculate({ ppmInput: this.handlePercentDivide(val) }, row)
    },
    // 核价类型
    async handlePricingCalculationTypeChange(val, row) {
      this.setPricingCalculationType(val, row)
      // 添加延时
      await new Promise((resolve) => setTimeout(resolve, 300))
      await this.pricingCalculate({ pricingCalculationType: val }, row)
    },
    // 核价逻辑
    async handlePricingCalculationMethodChange(val, row) {
      this.setPricingCalculationMethod(val, row)
      // 添加延时
      await new Promise((resolve) => setTimeout(resolve, 300))
      await this.pricingCalculate({ pricingCalculationMethod: val }, row)
    },
    // 采购供应商
    handlePurchaseSupplierCodeChange(val, row) {
      this.pricingCalculate({ purchaseSupplierCode: val }, row)
    },
    // 供应商下拉框显示隐藏
    handleVisibleChange(val, row) {
      console.log("供应商下拉框显示隐藏", val)
      if (val) {
        this.getSupplierBySku(row)
      }
    },
    //获取供应商
    async getSupplierBySku(row) {
      this.supplierOptions = []
      const { data } = await getSupplierBySkuApi({ skuCode: row.skuCode })
      if (data.code === 0) {
        this.supplierOptions = data.data?.supplierVoList?.map((item) => ({
          value: item.supplierNo,
          label: item.supplierName
        }))
      }
    },
    // 使用海外仓
    handleUseOverseasWarehouseChange(val, row) {
      let data = ""
      if (val === "Y") {
        if (row.usePlatformWarehouse === "Y") {
          data = "ALL"
        } else {
          data = "WAREHOUSE"
        }
      } else if (row.usePlatformWarehouse === "Y") {
        data = "PLATFORM"
      }

      this.pricingCalculate({ pricingWarehouseServiceMethod: data }, row)
    },
    // 使用平台仓
    handleUsePlatformWarehouseChange(val, row) {
      let data = ""
      if (val === "Y") {
        if (row.useOverseasWarehouse === "Y") {
          data = "ALL"
        } else {
          data = "PLATFORM"
        }
      } else if (row.useOverseasWarehouse === "Y") {
        data = "WAREHOUSE"
      }

      this.pricingCalculate({ pricingWarehouseServiceMethod: data }, row)
    },
    // 提交
    async handleBatchSubmit() {
      if (this.selectList.length === 0) {
        this.$message.warning("请选择数据")
        return
      }
      const pricingDemandId = this.selectList.map((item) => item.pricingDemandId)

      this.loading = true
      try {
        const { data } = await batchSubmitPricingDemandApi(pricingDemandId)
        if (data.code === 0) {
          this.$message.success("提交成功")
          this.searchReset()
          this.clearSelectClear()
          this.page.currentPage = 1
          // 还在生成中的情况不请求接口更新数据
          if (this.generatingFlag) {
            this.tableData = this.tableData.filter((item) => !pricingDemandId.includes(item.pricingDemandId))
            this.page.total -= pricingDemandId.length
          } else {
            await this.getList(true)
          }

          // 没有生成中的数据，且没有数据，则跳转列表页
          if (this.generatingFlag === false && this.tableData.length === 0) {
            this.handleClose()
          }
        }
      } catch (error) {
        // this.$message.error("计算失败")
      } finally {
        this.loading = false
      }
    },
    handleClose() {
      // 清除所有状态
      this.cleanupComponent()

      // 设置重新渲染标志
      this.shouldRerender = false

      this.$router.$avueRouter.closeTag()
      this.$nextTick(() => {
        this.$router.replace({ path: "/product/pricing/productCosting/costingRequire/list" })
      })
    },
    cleanupComponent() {
      this.searchReset()
      this.wsService?.close()
      this.$refs?.crud?.selectClear()
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      }
      this.selectList = []
      this.tableData = []
      this.loading = false
      this.wsService = null // WebSocket 服务实例
      this.serverSessionId = ""
      this.percentage = 0 //进度条
      this.generatingFlag = false //是否正在生成
      this.costingStatus = "TOTAL"
      this.generatingTotal = 0
      this.successCount = 0
      this.failCount = 0
      this.messageQueue = [] // 存储 WebSocket 消息的队列
      this.isProcessingList = false // 标记是否正在处理 getList
      this.processedCount = 0 // 用于进度条计算
      this.currentRequestId = 0 // 添加请求标识符
      this.totalCount = 0
      this.shouldRerender = true // 添加控制重新渲染的标志
    },
    getCellClass({ row }) {
      if (row.pricingGenerateStatus === "FAIL") {
        return "isFail"
      }
    },
    changeTabStatus() {
      this.searchForm.pricingGenerateStatus = this.costingStatus === "TOTAL" ? "" : this.costingStatus
      this.page.currentPage = 1
      // 清空现有数据
      this.tableData = []
      this.getList(true)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__suffix {
  display: flex;
  align-items: center;
}
::v-deep .isFail {
  background-color: #fef0f0 !important;
}
</style>
