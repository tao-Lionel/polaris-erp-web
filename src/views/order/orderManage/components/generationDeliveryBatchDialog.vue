<template>
  <div>
    <!-- DI、PO生成发货批次单 -->
    <el-dialog
      title="生成发货批次单"
      v-if="showDialog"
      :visible.sync="showDialog"
      width="90%"
      top="10vh"
      @close="closeDialog"
      class="dialogShowScroll"
      :class="isFullScreen ? 'full-screen' : 'no-full-screen'"
    >
      <div>
        <div style="display: flex; justify-content: space-between">
          <div>
            <div v-show="totalCount > 0">
              总条数
              <span style="font-size: 16px"> {{ totalCount }} </span> 条，成功
              <span style="color: #67c23a; font-size: 16px">
                {{ successCount }}
              </span>
              条，失败
              <span style="color: #f56c6c; font-size: 16px">
                {{ errorCount }}
              </span>
              条

              <span v-if="errorData.length > 0"> (失败的shipment ID: {{ errorData.join(",") }} ) </span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; margin: 0 10px 10px 0">
            <el-tooltip effect="dark" :content="isFullScreen ? '缩小' : '放大'" placement="top">
              <div class="fullScreenIcon">
                <i :class="isFullScreen ? 'icon-tuichuquanping' : 'icon-quanping'" @click="handleScreen"></i>
              </div>
            </el-tooltip>

            <el-button type="primary" size="small" @click="handleMergePallet('merge')">合并散托到已有托</el-button>
            <el-button type="primary" size="small" @click="handleMergePallet('new')">合并散托到新托</el-button>
            <el-dropdown split-button type="primary" size="small" @click="batchDownload('empty')">
              下载空模板
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="batchDownload('info')">下载带信息模板</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-upload
              ref="upload"
              :show-file-list="false"
              list-type="text"
              :accept="accept"
              action="String"
              :before-upload="onBeforeUpload"
              :http-request="onHttpRequest"
            >
              <el-button type="primary" size="small">上传数据</el-button>
            </el-upload>
          </div>
        </div>

        <!-- TO B -->
        <avue-crud
          v-if="deliveryBusinessType === 'TOB'"
          :data="visibleTableData"
          :option="generationDeliveryBatchTableOption"
          :span-method="spanMethod"
          ref="crudToB"
          @selection-change="selectionChange"
          @selection-row="selectionRow"
          @selection-all="selectionAll"
          :span-selection="spanSelection"
        >
          <template slot-scope="{ row }" slot="requestPickUpTime">
            <el-select v-model="row.requestPickUpTime" size="mini" placeholder="请选择提货时间" clearable>
              <el-option
                v-for="item in row.requireDeliveryVOList"
                :key="item.requireTime"
                :label="item.requireTime"
                :value="item.requireTime"
                :class="{ 'high-light': item.onTimeFlag }"
              >
              </el-option>
            </el-select>
          </template>
          <!-- <template slot-scope="{ row }" slot="transportCarrier">
          <el-select
            v-model="row.transportCarrier"
            size="mini"
            placeholder="请选择物流商"
            clearable
            @change="changeTransportCarrier($event, row)"
          >
            <el-option
              v-for="item in row.bseTransportCarriers"
              :key="item.transportCarrierCode"
              :label="item.carrierName"
              :value="item.transportCarrierCode"
            >
            </el-option>
          </el-select>
        </template> -->
          <!-- <template slot-scope="{ row }" slot="logisticsChannel">
          <el-select v-model="row.logisticsChannel" size="mini" placeholder="请选择物流渠道" clearable>
            <el-option
              v-for="item in row.bseChannels"
              :key="item.bseChannelCode"
              :label="item.bseChannelName"
              :value="item.bseChannelCode"
            >
            </el-option>
          </el-select>
        </template> -->
          <template slot-scope="{ row }" slot="operation">
            <a
              v-if="row.hasHiddenDetails || row.hasHiddenCartons || row.hasHiddenPallets"
              class="operation"
              @click="toggleDetails(row)"
            >
              {{ row.showAllDetails ? "收起" : "显示更多" }}
            </a>
          </template>
        </avue-crud>

        <!-- To C -->
        <avue-crud
          v-if="deliveryBusinessType === 'TOC'"
          :data="tableData"
          :option="generationDeliveryBatchTableOptionToC"
          :span-method="spanMethodToC"
        >
          <template slot-scope="{ row }" slot="transportCarrier">
            <el-select
              v-model="row.transportCarrier"
              size="mini"
              placeholder="请选择物流商"
              clearable
              @change="changeTransportCarrier($event, row)"
            >
              <el-option
                v-for="item in row.bseTransportCarriers"
                :key="item.transportCarrierCode"
                :label="item.carrierName"
                :value="item.transportCarrierCode"
              >
              </el-option>
            </el-select>
          </template>
          <template slot-scope="{ row }" slot="logisticsChannel">
            <el-select v-model="row.logisticsChannel" size="mini" placeholder="请选择物流渠道" clearable>
              <el-option
                v-for="item in row.bseChannels"
                :key="item.bseChannelCode"
                :label="item.bseChannelName"
                :value="item.bseChannelCode"
              >
              </el-option>
            </el-select>
          </template>
        </avue-crud>
      </div>
      <span slot="footer">
        <el-button size="small" @click="showDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  generationDeliveryBatchTableOption,
  generationDeliveryBatchTableOptionToC
} from "@/const/crud/order/orderManage/orderManage"
import {
  saveDeliveryBatchApi,
  saveDeliveryBatchUpLoadShowApi,
  saveDeliveryBatchDownLoadApi
} from "@/api/order/orderManage"
import { downloadBlob, getFileExtension } from "@/util/auth"
import { downloadTemplate } from "@/api/order/invoiceManage"
import { deepClone } from "@/util/util"

export default {
  name: "DiGenerationDeliveryDialog",
  components: {},
  data() {
    return {
      rules: {
        // transportCarrier: { required: true, message: "请选择物流商", trigger: "blur" }
        // logisticsChannel: { required: true, message: "请选择物流渠道", trigger: "blur" },
        requestPickUpTime: { required: true, message: "请选择提货时间", trigger: "blur" }
      },
      showDialog: false,
      tableData: [],
      generationDeliveryBatchTableOption,
      generationDeliveryBatchTableOptionToC,
      accept: ".xls,.xlsx",
      successCount: 0,
      errorCount: 0,
      totalCount: 0,
      deliveryBusinessType: "", // 业务类型
      maxVisiblePallets: 2,
      maxVisibleCartons: 2,
      maxVisibleDetails: 2, // 默认显示的明细数量
      hierarchyLevels: {
        PALLET: "pallet",
        CARTON: "carton",
        DETAIL: "detail"
      },
      errorData: [],
      isFullScreen: true,
      selectRows: [],
      mergePalletData: [],
      originalTableData: [], // 原始数据
      cancelSelect: [], // 取消选中的数据
      newOriginalTableData: []
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    visibleTableData() {
      return this.tableData.filter((row) => !row.hidden)
    }
  },
  methods: {
    openDialog(deliveryBusinessType, results) {
      this.showDialog = true
      this.successCount = 0
      this.errorCount = 0
      this.totalCount = 0
      this.tableData = []
      this.errorData = []
      this.isFullScreen = true
      this.deliveryBusinessType = deliveryBusinessType
      this.originalTableData = results
      this.newOriginalTableData = deepClone(results)
      this.tableData = this.flattenData(results)
      console.log("this.tableData============", this.tableData)
      this.setDialogBodyHeight()
    },

    // 扁平化数据
    flattenData(results) {
      try {
        const tableData = []

        results.forEach((shipment) => {
          const shipmentRows = []
          const shipmentStartIndex = shipmentRows.length

          // 计算整个 shipment 的隐藏状态
          const shipmentHasHiddenPallets = shipment.pallets.length > this.maxVisiblePallets

          // 计算是否有任何托盘的箱子数量超过限制
          const shipmentHasHiddenCartons = shipment.pallets.some(
            (pallet) => pallet.cartons.length > this.maxVisibleCartons
          )

          // 计算是否有任何箱子的产品明细数量超过限制
          const shipmentHasHiddenDetails = shipment.pallets.some((pallet) =>
            pallet.cartons.some((carton) => carton.productDetails.length > this.maxVisibleDetails)
          )

          shipment.pallets.forEach((pallet, palletIndex) => {
            const isPalletVisible = palletIndex < this.maxVisiblePallets
            const palletStartIndex = shipmentRows.length

            // 计算当前托盘的隐藏状态
            const palletHasHiddenCartons = pallet.cartons.length > this.maxVisibleCartons

            pallet.cartons.forEach((carton, cartonIndex) => {
              const isCartonVisible = isPalletVisible && cartonIndex < this.maxVisibleCartons
              const cartonStartIndex = shipmentRows.length

              // 计算当前箱子的隐藏状态
              const cartonHasHiddenDetails = carton.productDetails.length > this.maxVisibleDetails

              carton.productDetails.forEach((detail, detailIndex) => {
                const isDetailVisible = isCartonVisible && detailIndex < this.maxVisibleDetails

                const row = {
                  // 基础数据
                  shipmentId: shipment.shipmentId,
                  oldShipmentId: shipment?.oldShipmentId || [],
                  groupKeyString: shipment.groupKeyString,
                  requestPickUpTime: shipment.requestPickUpTime || shipment.requestPickUpDate,
                  warehouseId: shipment.warehouseId,
                  warehouseCode: shipment.warehouseCode,
                  warehouseName: shipment.warehouseName,
                  totalPalletCount: shipment.totalPalletCount,
                  totalCartonCount: shipment.totalCartonCount,
                  logisticsChannel: shipment.logisticsChannel,
                  bseTransportCarriers: shipment.bseTransportCarriers,
                  requireDeliveryVOList: shipment.requireDeliveryVOList,
                  transportCarrier: shipment.transportCarrier,
                  pallets: shipment.pallets,
                  bseChannels: [],

                  // 托盘和箱号信息
                  palletCode: pallet.palletCode,
                  cartonCount: pallet.cartonCount,
                  cartonCode: carton.cartonCode,
                  ...detail,

                  // 索引信息
                  palletIndex,
                  cartonIndex,
                  detailIndex,

                  // 隐藏状态标记
                  hidden:
                    !isPalletVisible ||
                    (!isCartonVisible && cartonIndex >= this.maxVisibleCartons) ||
                    (!isDetailVisible && detailIndex >= this.maxVisibleDetails),
                  showAllDetails: false,

                  // 是否有隐藏项 - 使用整个 shipment 的状态
                  hasHiddenPallets: shipmentHasHiddenPallets,
                  hasHiddenCartons: shipmentHasHiddenCartons,
                  hasHiddenDetails: shipmentHasHiddenDetails,

                  // 当前项的具体隐藏状态
                  currentPalletHasHiddenCartons: palletHasHiddenCartons,
                  currentCartonHasHiddenDetails: cartonHasHiddenDetails,

                  // 初始化合并单元格为0
                  shipmentRowSpan: 0,
                  palletRowSpan: 0,
                  cartonRowSpan: 0
                }

                // 设置第一行的合并标记
                if (shipmentRows.length === shipmentStartIndex) {
                  row.shipmentRowSpan = 1
                }
                if (shipmentRows.length === palletStartIndex) {
                  row.palletRowSpan = 1
                }
                if (shipmentRows.length === cartonStartIndex) {
                  row.cartonRowSpan = 1
                }

                shipmentRows.push(row)
              })
            })
          })

          const processedShipmentRows = this.calculateRowSpans(shipmentRows)
          tableData.push(...processedShipmentRows)
        })

        return tableData
      } catch (error) {
        console.error("Error in flattenData:", error)
        return []
      }
    },

    // 计算合并行
    calculateRowSpans(rows) {
      // 重置所有行的合并状态
      rows.forEach((row) => {
        row.shipmentRowSpan = 0
        row.palletRowSpan = 0
        row.cartonRowSpan = 0
      })

      const visibleRows = rows.filter((row) => !row.hidden)
      if (visibleRows.length === 0) return rows

      // 处理 shipment 级别的合并
      let currentShipmentId = null
      let shipmentCount = 0
      let shipmentStartRow = null

      // 处理托盘和箱号的合并
      let currentPalletCode = null
      let palletCount = 0
      let palletStartRow = null

      visibleRows.forEach((row, index) => {
        // 处理 shipment 合并
        if (row.shipmentId !== currentShipmentId) {
          if (shipmentStartRow) {
            shipmentStartRow.shipmentRowSpan = shipmentCount
          }
          currentShipmentId = row.shipmentId
          shipmentCount = 1
          shipmentStartRow = row
        } else {
          shipmentCount++
        }

        // 处理托盘合并
        if (row.palletCode !== currentPalletCode) {
          if (palletStartRow) {
            palletStartRow.palletRowSpan = palletCount
          }
          currentPalletCode = row.palletCode
          palletCount = 1
          palletStartRow = row

          // 处理箱号合并 - 为新托盘的第一个箱号设置初始值
          row.cartonRowSpan = 1
        } else {
          palletCount++

          // 处理箱号合并 - 只在同一托盘内比较
          if (row.cartonCode === visibleRows[index - 1].cartonCode) {
            // 如果当前行的箱号与前一行相同，则前一行增加合并数
            let prevRow = visibleRows[index - 1]
            if (prevRow.palletCode === row.palletCode) {
              if (prevRow.cartonRowSpan) {
                prevRow.cartonRowSpan++
              }
            } else {
              // 不同托盘的情况下，设置当前行的合并值为1
              row.cartonRowSpan = 1
            }
          } else {
            // 箱号不同，设置新的合并值
            row.cartonRowSpan = 1
          }
        }

        // 处理最后一行
        if (index === visibleRows.length - 1) {
          if (shipmentStartRow) {
            shipmentStartRow.shipmentRowSpan = shipmentCount
          }
          if (palletStartRow) {
            palletStartRow.palletRowSpan = palletCount
          }
        }
      })

      return rows
    },

    // 修改切换显示/隐藏的方法
    toggleDetails(row) {
      const newShowState = !row.showAllDetails
      const shipmentRows = this.tableData.filter((r) => r.shipmentId === row.shipmentId)
      const shipmentStartIndex = this.tableData.findIndex((r) => r.shipmentId === row.shipmentId)

      // 根据层级更新显示状态
      if (row.hasHiddenPallets) {
        // 更新所有托盘的显示状态
        shipmentRows.forEach((r) => {
          r.showAllDetails = newShowState
          // 如果是展开状态，则显示所有行；如果是收起状态，则只显示限制数量内的行
          r.hidden =
            !newShowState &&
            (r.palletIndex >= this.maxVisiblePallets ||
              r.cartonIndex >= this.maxVisibleCartons ||
              r.detailIndex >= this.maxVisibleDetails)
        })
      } else if (row.currentPalletHasHiddenCartons || row.hasHiddenCartons) {
        // 更新当前托盘下的所有行
        const currentPalletRows = shipmentRows.filter((r) => {
          // 找到同一个shipmentId下，有隐藏箱子的托盘的所有行
          return r.shipmentId === row.shipmentId && (r.currentPalletHasHiddenCartons || r.hasHiddenCartons)
        })

        currentPalletRows.forEach((r) => {
          r.showAllDetails = newShowState
          // 如果是展开状态，则显示所有行；如果是收起状态，则只显示限制数量内的行
          r.hidden =
            !newShowState && (r.cartonIndex >= this.maxVisibleCartons || r.detailIndex >= this.maxVisibleDetails)
        })
      } else if (row.currentCartonHasHiddenDetails || row.hasHiddenDetails) {
        // 更新所有可展开的箱子下的行
        const currentCartonRows = shipmentRows.filter((r) => {
          // 找到同一个shipmentId下，有隐藏明细的箱子的所有行
          return r.shipmentId === row.shipmentId && (r.currentCartonHasHiddenDetails || r.hasHiddenDetails)
        })
        currentCartonRows.forEach((r) => {
          r.showAllDetails = newShowState
          // 如果是展开状态，则显示所有行；如果是收起状态，则只显示限制数量内的行
          r.hidden = !newShowState && r.detailIndex >= this.maxVisibleDetails
        })
      }

      // 重新计算当前 shipment 的行合并
      const currentShipmentRows = this.tableData.slice(shipmentStartIndex, shipmentStartIndex + shipmentRows.length)
      const updatedShipmentRows = this.calculateRowSpans(currentShipmentRows)

      // 更新原数组中对应的行
      updatedShipmentRows.forEach((row, index) => {
        Object.assign(this.tableData[shipmentStartIndex + index], row)
      })

      this.$forceUpdate()
    },

    // 合并行
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        [
          "warehouseName",
          "totalPalletCount",
          "totalCartonCount",
          // "transportCarrier",
          // "logisticsChannel",
          "shipmentId",
          "requestPickUpTime",
          "operation"
        ].includes(column.property) ||
        columnIndex === 0
      ) {
        return [row.shipmentRowSpan, 1]
      } else if (column.property === "palletCode" || column.property === "cartonCount") {
        return [row.palletRowSpan, 1]
      } else if (column.property === "cartonCode") {
        return [row.cartonRowSpan, 1]
      }
      return [1, 1]
    },

    spanMethodToC({ row, column, rowIndex, columnIndex }) {
      if (["warehouseName", "transportCarrier", "logisticsChannel"].includes(column.property)) {
        return [row.shipmentRowSpan, 1]
      }
      return [1, 1]
    },

    // 共用的数据转换
    transformTableDataToShipments(isDownload = false, submitData = []) {
      const paramsArr = []

      // 按 shipmentId 对数据进行分组
      const shipmentGroups = {}
      const data = isDownload ? this.tableData : submitData
      data.forEach((item) => {
        if (!shipmentGroups[item.shipmentId]) {
          shipmentGroups[item.shipmentId] = []
        }
        shipmentGroups[item.shipmentId].push(item)
      })

      // 处理每个 shipment 组
      Object.values(shipmentGroups).forEach((shipmentItems) => {
        const firstItem = shipmentItems[0]
        const currentShipment = {
          warehouseCode: firstItem.warehouseCode,
          warehouseName: firstItem.warehouseName,
          totalPalletCount: firstItem.totalPalletCount,
          totalCartonCount: firstItem.totalCartonCount,
          logisticsChannel: firstItem.logisticsChannel,
          transportCarrier: firstItem.transportCarrier,
          shipmentId: firstItem.shipmentId,
          requestPickUpTime: firstItem.requestPickUpTime,
          onTimeFlag: firstItem.requireDeliveryVOList.find((item) => item.requireTime === firstItem.requestPickUpTime)
            ?.onTimeFlag,
          [isDownload ? "palletCmds" : "pallets"]: []
        }

        // 按托盘号分组
        const palletGroups = {}
        shipmentItems.forEach((item) => {
          if (!palletGroups[item.palletCode]) {
            palletGroups[item.palletCode] = []
          }
          palletGroups[item.palletCode].push(item)
        })

        // 处理每个托盘组
        Object.entries(palletGroups).forEach(([palletCode, palletItems]) => {
          const currentPallet = {
            customPalletCode: palletCode,
            customCartons: []
          }

          // 按箱号分组，但只在当前托盘内
          const cartonGroups = {}
          palletItems.forEach((item) => {
            if (!cartonGroups[item.cartonCode]) {
              cartonGroups[item.cartonCode] = []
            }
            cartonGroups[item.cartonCode].push(item)
          })

          // 处理每个箱号组
          Object.entries(cartonGroups).forEach(([cartonCode, cartonItems]) => {
            const currentCarton = {
              customCartonCode: cartonCode,
              customCartonDetails: []
            }

            // 处理每个明细
            cartonItems.forEach((item) => {
              const detail = {
                sourceCode: item.sourceCode,
                detailLineNo: item.detailLineNo,
                asin: item.asin,
                palletSpec: item.palletSpec
              }

              if (isDownload) {
                Object.assign(detail, {
                  skuCode: item.skuCode,
                  skuName: item.skuName,
                  quantity: item.expectedQuantity,
                  soOrderCode: item.soOrderCode,
                  validQuantity: item.validQuantity,
                  deliveryQuantity: item.deliveryQuantity,
                  palletNumber: item.palletNumber,
                  skuCode: item.sku,
                  palletSpec: item.palletSpec
                })
              } else {
                detail.quantity = item.deliveryQuantity
              }

              currentCarton.customCartonDetails.push(detail)
            })

            currentPallet.customCartons.push(currentCarton)
          })

          currentShipment[isDownload ? "palletCmds" : "pallets"].push(currentPallet)
        })

        paramsArr.push(currentShipment)
      })

      return paramsArr
    },

    async submit() {
      if (!this.selectRows.length) {
        this.$message.warning("请至少选择一行数据")
        return
      }

      // 只提交选中的行
      const submitData = this.tableData.filter((item) =>
        this.selectRows.some((row) => row.shipmentId === item.shipmentId)
      )

      let paramsArr = this.transformTableDataToShipments(false, submitData)

      // 校验必填字段
      if (this.deliveryBusinessType === "TOB") {
        // const isEmpty = paramsArr.every((item) => {
        //   // return !item.transportCarrier && !item.logisticsChannel && !item.requestPickUpTime
        //   return !item.requestPickUpTime
        // })

        // if (isEmpty) {
        //   this.$message.error("请输入提货时间")
        //   return
        // }

        for (let item of paramsArr) {
          // if (item.transportCarrier || item.logisticsChannel || item.requestPickUpTime) {
          // if (!item.transportCarrier) {
          //   this.$message.error(`请输入物流商`)
          //   return
          // }
          // if (!item.logisticsChannel) {
          //   this.$message.error(`请输入物流渠道`)
          //   return
          // }
          if (!item.requestPickUpTime) {
            this.$message.error(`请输入提货时间`)
            return
          }
        }

        // 只传填了数据的行
        // paramsArr = paramsArr.filter((item) => {
        //   return item.requestPickUpTime
        //   // return item.transportCarrier && item.logisticsChannel && item.requestPickUpTime
        // })
      } else {
        const isEmpty = paramsArr.every((item) => {
          return !item.transportCarrier && !item.logisticsChannel
        })

        if (isEmpty) {
          this.$message.error("请至少填写一条信息")
          return
        }

        for (let item of paramsArr) {
          if (item.transportCarrier || item.logisticsChannel) {
            if (!item.transportCarrier) {
              this.$message.error(`请输入物流商`)
              return
            }
            if (!item.logisticsChannel) {
              this.$message.error(`请输入物流渠道`)
              return
            }
          }
        }

        // 只传填了数据的行
        paramsArr = paramsArr.filter((item) => {
          return item.transportCarrier && item.logisticsChannel
        })
      }

      console.log("paramsArr=====", paramsArr)

      try {
        this.totalCount = paramsArr.length
        for (let i = 0; i < paramsArr.length; i++) {
          const item = paramsArr[i]
          try {
            await saveDeliveryBatchApi(item)
              .then(() => {
                if (this.totalCount > this.successCount) {
                  this.successCount++
                }
                console.log(`第 ${i + 1}/${paramsArr.length} 个发货单生成成功`)
              })
              .catch(() => {
                if (this.totalCount > this.errorCount) {
                  this.errorCount++
                  this.errorData.push(item.shipmentId)
                }

                console.log(`第 ${i + 1}/${paramsArr.length} 个发货单生成失败`)
              })
          } catch (error) {
            if (this.totalCount > this.errorCount) {
              this.errorCount++
            }
            throw error
          }
        }

        if (this.errorCount === 0) {
          this.$message.success("全部生成发货单成功")
          this.showDialog = false
          this.$emit("updateList")
        }
      } catch (error) {
        this.$message.error("生成发货单失败")
        console.log("error", error)
      }
    },
    closeDialog() {
      // 关闭时清空选择的行
      this.$refs?.crudToB.selectClear()
    },
    async batchDownload(type) {
      if (type === "empty") {
        // 下载空模板
        const { data } = await downloadTemplate({
          templateName: "订单创建Shipment模板.xlsx"
        })
        downloadBlob(data, "生成发货批次单模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
      } else {
        // 按原始数据结构分组
        const paramsArr = this.transformTableDataToShipments(true)

        const { data } = await saveDeliveryBatchDownLoadApi({ createCmds: paramsArr })
        downloadBlob(data, "生成发货批次单.xlsx", "application/vnd.ms-excel;charset=utf-8")
        this.$message.success("下载成功")
      }
    },

    // 上传前校验
    onBeforeUpload(file) {
      const fileName = getFileExtension(file.name)
      const localFileType = this.accept.replace(/\./g, "").split(",")
      if (!localFileType.includes(fileName)) {
        this.$message.warning("请选择EXCEL文件上传!!")
        return false
      }
      const maxSize = 6
      if (file.size / 1024 / 1024 > maxSize) {
        this.$message.warning(`文件限制为${maxSize}M以内!!`)
        return false
      }
    },

    // 上传
    async onHttpRequest(param) {
      const formData = new FormData()
      formData.append("file", param.file)
      const { data } = await saveDeliveryBatchUpLoadShowApi(formData)

      if (data.code === 0) {
        this.$message.success("上传成功")
        this.tableData = this.flattenData(data.data)
      }
    },

    // 物流商改变
    changeTransportCarrier(val, row) {
      this.$set(row, "logisticsChannel", "")
      const bseChannels = row.bseTransportCarriers.find((item) => item.transportCarrierCode === val)?.bseChannels
      this.$set(row, "bseChannels", bseChannels)
    },

    handleScreen() {
      this.isFullScreen = !this.isFullScreen
      this.setDialogBodyHeight()
    },

    // 设置表格高度
    setDialogBodyHeight() {
      this.$nextTick(() => {
        this.generationDeliveryBatchTableOption.fixHeight =
          document.querySelector(".el-dialog__body")?.offsetHeight - 95 || 400
      })
    },

    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    // 单选行事件
    selectionRow(selection, row) {
      // 判断是否选中
      const isSelect = selection.length && selection.indexOf(row) !== -1
      if (!isSelect) {
        // 取消选中
        this.cancelSelect.push(row)
      } else {
        // 选中后 过滤选中的数据
        this.cancelSelect = this.cancelSelect.filter((item) => item.shipmentId !== row.shipmentId)
      }
    },
    // 全选事件
    selectionAll(selection) {
      // 清空cancelSelect
      this.cancelSelect = []
      // 合并行后，表格的全选的数据需要特殊处理
      this.selectRows = this.spanSelection(selection)
      // 更新tableSelect
      this.$refs.crudToB.updateTableSelect(this.selectRows)
    },
    // 合并行后，表格的全选的数据需要特殊处理
    spanSelection(list) {
      // 根据 shipmentId  从 list 中移除取消选中的数据
      list = list.filter((item) => !this.cancelSelect.some((cancelItem) => cancelItem.shipmentId === item.shipmentId))
      // 创建一个选中的 shipmentId 集合
      const selectedShipmentIds = new Set(list.map((item) => item.shipmentId))

      // 1. 按 shipmentId 分组，但只处理实际选中的行
      const groups = this.tableData.reduce((acc, item) => {
        // 只处理选中的 shipmentId
        if (selectedShipmentIds.has(item.shipmentId)) {
          if (!acc[item.shipmentId]) {
            acc[item.shipmentId] = []
          }
          acc[item.shipmentId].push(item)
        }
        return acc
      }, {})

      // 2. 处理每个分组，只返回 shipment 级别的数据
      const result = Object.values(groups)
        .map((group) => {
          // 找到 shipment 父元素（优先使用有 shipmentRowSpan 的行）
          const shipmentParent = group.find((item) => item.shipmentRowSpan > 0) || group[0]
          if (!shipmentParent) return null

          // 返回基础 shipment 对象
          return {
            ...shipmentParent
          }
        })
        .filter(Boolean) // 移除空值

      return result
    },

    // 获取合并打托、需要删除的shipmentId
    getShipmentIds(selectRows) {
      const shipmentIds = selectRows.map((item) => item.shipmentId)
      const oldShipmentIds = selectRows.map((item) => item.oldShipmentId)
      const newAndOldShipmentIds = [...new Set([...shipmentIds, ...oldShipmentIds.flat()])]
      console.log("newAndOldShipmentIds", newAndOldShipmentIds)
      return newAndOldShipmentIds
    },

    // 根据selectRows 在originalTableData中找到要合并打托的数据
    getMergePalletData(selectRows) {
      let originalData = []
      const arr = this.getShipmentIds(selectRows)
      arr.forEach((item) => {
        const shipmentItem = this.originalTableData.find((row) => row.shipmentId === item)
        if (shipmentItem) {
          originalData.push(shipmentItem)
        }
      })

      return originalData
    },

    // 判断是否是同一groupKeyString
    isSameGroupKeyString(selectRows) {
      const groupKeyString = selectRows[0].groupKeyString
      return selectRows.every((row) => row.groupKeyString === groupKeyString)
    },

    // 合并打托
    handleMergePallet(type) {
      if (this.selectRows.length <= 1) {
        this.$message.warning("请至少选择两行数据")
        return
      }

      if (!this.isSameGroupKeyString(this.selectRows)) {
        this.$message.warning("同一个仓库、平台订单号、产品才能进行合并打托！")
        return
      }

      let mergeIndex = null

      //合并散托到已有托
      if (type === "merge") {
        // 托盘号大于0的为完整托盘
        const fullPallet = []
        this.selectRows.forEach((item) => {
          if (Number(item.palletCode) > 0) {
            fullPallet.push(item)
          }
        })

        if (fullPallet.length !== 1) {
          this.$message.warning("请选择一个完整托盘(托盘号大于0)")
          return
        }

        // mergeIndex = this.tableData.findIndex((item) => item.shipmentId === fullPallet[0].shipmentId)
        mergeIndex = this.newOriginalTableData.findIndex((item) => item.shipmentId === fullPallet[0].shipmentId)

        this.mergePalletData = this.getMergePalletData(this.selectRows)
        console.log("mergePalletData====", this.mergePalletData)

        this.handleSubmitMergePallet(fullPallet[0].shipmentId, type, mergeIndex)
      } else if (type === "new") {
        // 合并散托到新托
        const fullPallet = this.selectRows.find((item) => Number(item.palletCode) > 0)
        if (fullPallet) {
          this.$message.warning("不能选择完整托盘(托盘号大于0)")
          return
        }
        //  mergeIndex = this.tableData.findIndex((item) => item.shipmentId === this.selectRows[0].shipmentId)
        mergeIndex = this.newOriginalTableData.findIndex((item) => item.shipmentId === this.selectRows[0].shipmentId)

        // 获取tableData中托盘号大于0的shipmentId
        const palletShipmentIds = this.tableData
          .filter((item) => Number(item.palletCode) > 0)
          .map((item) => item.shipmentId)
        // 找到最大的shipmentId
        const maxShipmentId = palletShipmentIds.length > 0 ? Math.max(1, ...palletShipmentIds) : 0

        this.mergePalletData = this.getMergePalletData(this.selectRows)
        console.log("mergePalletData====", this.mergePalletData)

        this.handleSubmitMergePallet(maxShipmentId + 1, type, mergeIndex)
      }
    },
    handleSubmitMergePallet(shipmentId, type, mergeIndex) {
      try {
        const mergedData = this.createMergedShipmentData(shipmentId, type)
        this.updateTableData(mergedData, mergeIndex)
        this.handleMergeSuccess()
      } catch (e) {
        console.log("合并打托失败", e)
        this.$message.error("合并打托失败")
      }
    },

    // 创建合并后的发货数据
    createMergedShipmentData(shipmentId, type) {
      // 获取旧的 shipmentId 列表
      const oldShipmentId = this.mergePalletData.map((item) => item.shipmentId)

      // 获取目标托盘的现有数据
      const existingPallets = this.tableData.find((item) => item.shipmentId === shipmentId)?.pallets || []
      console.log("existingPallets=====", existingPallets)

      // 创建基础合并数据结构
      const mergedData = {
        ...this.mergePalletData[0],
        shipmentId,
        oldShipmentId,
        pallets: [...existingPallets]
      }

      // 合并托盘数据
      mergedData.pallets = this.mergePalletsByType(type, mergedData.pallets)

      // 更新托盘和箱子相关的计数
      this.updatePalletAndCartonCounts(mergedData)

      return mergedData
    },

    // 根据合并类型处理托盘数据
    mergePalletsByType(type, existingPallets) {
      if (type === "merge") {
        // 获取散托数据
        const loosePallets = this.selectRows.filter((item) => Number(item.palletCode) <= 0)

        // 只合并散托数据
        this.mergePalletData.forEach((shipment) => {
          if (shipment.pallets?.length && loosePallets.some((item) => item.shipmentId === shipment.shipmentId)) {
            existingPallets.push(...shipment.pallets)
          }
        })
      } else {
        // 合并所有托盘数据
        this.mergePalletData.forEach((shipment) => {
          if (shipment.pallets?.length) {
            existingPallets.push(...shipment.pallets)
          }
        })
      }

      // 合并相同托盘号的箱子并重新编号
      const mergedPallets = this.mergePallets(existingPallets)
      return this.reorderPalletCodes(mergedPallets)
    },

    // 更新托盘和箱子的计数
    updatePalletAndCartonCounts(mergedData) {
      // 计算总托数
      const uniquePalletCodes = new Set(mergedData.pallets.map((item) => item.palletCode))
      mergedData.totalPalletCount = uniquePalletCodes.size

      // 计算总箱数
      mergedData.totalCartonCount = mergedData.pallets.reduce((sum, pallet) => sum + pallet.cartonCount, 0)
    },

    // 更新表格数据
    updateTableData(mergedData, mergeIndex) {
      console.log("mergedData==================", mergedData)
      // 获取需要删除的 shipmentId 列表
      const shipmentIdsToRemove = this.getShipmentIds(this.selectRows)
      console.log("shipmentIdsToRemove=========", shipmentIdsToRemove)

      this.tableData = []
      // 从源数据中移除旧数据
      this.newOriginalTableData = this.newOriginalTableData.filter(
        (row) => !shipmentIdsToRemove.includes(row.shipmentId)
      )
      this.$nextTick(() => {
        // this.newOriginalTableData.push(mergedData)
        // 插入合并数据
        this.newOriginalTableData.splice(mergeIndex, 0, mergedData)
        this.tableData = this.flattenData(this.newOriginalTableData)
      })

      // // 从表格中移除旧数据
      // this.tableData = this.tableData.filter((row) => !shipmentIdsToRemove.includes(row.shipmentId))

      // // 插入新的合并数据
      // const flattenedData = this.flattenData([mergedData])
      // let newTableData = deepClone(this.tableData)
      // this.tableData = []

      // this.$nextTick(() => {
      //   // newTableData.splice(mergeIndex, 0, ...flattenedData)
      //   newTableData.push(...flattenedData)
      //   this.tableData = newTableData
      // })
    },

    // 处理合并成功后的操作
    handleMergeSuccess() {
      // 清除选择
      this.$refs.crudToB.selectClear()
      this.$message.success("合并打托成功")

      // 强制更新视图
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },

    // 计算托盘号
    reorderPalletCodes(pallets) {
      // 创建新旧编号的映射
      const codeMapping = new Map()
      let nextCode = 1

      console.log("pallets====", pallets)

      // 第一次遍历：为非0的编号创建映射
      pallets.forEach((pallet) => {
        const code = pallet.palletCode
        if (code !== "0" && !codeMapping.has(code)) {
          codeMapping.set(code, String(nextCode++))
        }
      })

      // 第二次遍历：处理0的编号
      let lastZeroCode = null
      pallets.forEach((pallet) => {
        if (pallet.palletCode === "0") {
          if (lastZeroCode === null) {
            lastZeroCode = String(nextCode++)
          }
          codeMapping.set("0", lastZeroCode)
        }
      })

      // 应用新编号
      return pallets.map((pallet) => ({
        ...pallet,
        palletCode: codeMapping.get(pallet.palletCode)
      }))
    },

    // 合并箱子
    mergePallets(pallets) {
      // 使用 Map 按 palletCode 分组
      const palletMap = new Map()

      pallets.forEach((pallet) => {
        if (!palletMap.has(pallet.palletCode)) {
          // 如果是新的 palletCode，创建新对象
          palletMap.set(pallet.palletCode, {
            palletCode: pallet.palletCode,
            cartonCount: pallet.cartonCount,
            cartons: [...pallet.cartons]
          })
        } else {
          // 如果已存在相同的 palletCode，合并 cartons
          const existingPallet = palletMap.get(pallet.palletCode)
          existingPallet.cartons.push(...pallet.cartons)
          // 更新 cartonCount
          existingPallet.cartonCount = existingPallet.cartons.length
        }
      })

      // 将 Map 转换为数组
      const mergedPallets = Array.from(palletMap.values())

      // 对每个托盘的箱子重新编号
      return mergedPallets.map((pallet) => ({
        ...pallet,
        cartons: this.reorderCartonCodes(pallet.cartons),
        cartonCount: pallet.cartons.length // 确保 cartonCount 与实际箱子数量一致
      }))
    },

    // 重排箱号
    reorderCartonCodes(cartons) {
      // 为每个箱子分配新的编号，从1开始
      return cartons.map((carton, index) => ({
        ...carton,
        cartonCode: String(index + 1) // 转为字符串格式
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__body {
    overflow-y: auto;
    height: calc(100% - 130px);
  }
}
.operation {
  line-height: 20px !important;
  font-size: 12px !important;
}
.high-light {
  background: #93d671;
}
.fullScreenIcon {
  cursor: pointer;
  i {
    margin-right: 20px;
  }
}
.full-screen {
  ::v-deep .el-dialog {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
  }
}
.no-full-screen {
  ::v-deep .el-dialog {
    height: 80vh !important;
  }
}
</style>
