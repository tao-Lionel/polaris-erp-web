<template>
  <div class="ruleEngineAction">
    <p class="ruleEngineAction-title">设定动作</p>
    <template v-if="ruleType === 'SPLIT_ORDER'">
      <el-form-item label="执行动作:" prop="action">
        <el-radio-group v-model="actionData.action">
          <el-radio label="1">按产品自动拆分订单</el-radio>
          <!-- <el-radio :label="6">禁止拆单</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <div style="display: flex">
        <el-form-item label="拆分方式:" prop="splitMethod">
          <el-select
            style="width: 250px"
            v-model="actionData.splitMethod"
            :placeholder="'请选择拆分方式'"
            filterable
            clearable
            :disabled="isDisabled"
            @change="baseInsert"
          >
            <el-option :label="item.label" :value="item.value" v-for="item in actionWay" :key="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label-width="100px" label="拆分产品:" prop="stock">
          <el-input
            style="width: 300px"
            v-model="actionData.a"
            type="textarea"
            placeholder="拆分产品编号，支持输入数字、英文字母、中划线和空格，多个规则换行输入"
            :rows="3"
          ></el-input>
        </el-form-item>
      </div>
    </template>
    <template v-else-if="ruleType === 'SET_WAREHOUSE'">
      <el-form-item label-width="60px">
        <el-checkbox v-model="actionData.platformAdvanceWarehouse" label="1">
          按平台指定的建议发货仓，匹配订单实际的发货仓库
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <template #label> <span style="font-size: 16px; font-weight: bold">自定义仓库:</span> </template>
      </el-form-item>

      <el-form-item label="发货仓库:">
        <el-button type="primary" :disabled="isDisabled" @click="handleDeliveryWarehouse('planA')"
          >点击拖拽选择</el-button
        >
      </el-form-item>
      <el-form-item
        :label="`备选仓库${index + 1}:`"
        v-for="(item, index) in partitionAlternativeWarehouse"
        :key="index"
      >
        <el-button type="primary" :disabled="isDisabled" @click="handleDeliveryWarehouse('planB', index)"
          >点击拖拽选择</el-button
        >
        <el-button type="primary" :disabled="isDisabled" v-if="index == 0" @click="handleCreateDeliveryWarehouse()">
          新增备选仓库</el-button
        >
        <el-button type="primary" v-if="index !== 0 && !isDisabled" @click="handleDeleteDeliveryWarehouse(index)">
          删除备选仓库</el-button
        >
      </el-form-item>
      <div class="sorting">
        <div class="sorting-box">
          <span class="info">发货仓库排序：</span>
          <div class="warehouse-sorting">
            <p style="padding: 3px 0" v-for="(item, index) in selectedDeliveryWarehouse" :key="item.warehouseId">
              <el-tag class="tag-item">{{ index + 1 }}、 {{ item.warehouseName }}</el-tag>
            </p>
          </div>
        </div>

        <div class="sorting-box" v-for="(item, index) in partitionAlternativeWarehouse" :key="index">
          <span class="info"
            >备选仓库{{ item.areaIndex + 1 }}排序：
            <p style="color: #aaa; margin: 8px 10px 0 10px; font-size: 12px" v-if="index == 0">
              当发货仓库缺货时，按照备选仓库优先级，重新分配可配货仓库
            </p>
          </span>
          <div class="warehouse-sorting">
            <p style="padding: 3px 0" v-for="(it, ind) in item.alternativeWarehouseId" :key="it">
              <el-tag class="tag-item">{{ ind + 1 }}、 {{ it.warehouseName }}</el-tag>
            </p>
          </div>
        </div>
      </div>
      <div style="padding: 10px 0 0 85px; box-sizing: border-box">
        <el-checkbox v-model="actionData.checkQuantityFlag">匹配仓库校验库存，库存不足则不匹配仓库</el-checkbox>
      </div>
    </template>
    <template v-else-if="ruleType === 'LOGISTICS_CHANNEL_MATCHING'">
      <div>
        <el-form-item label="物流渠道:" prop="logisticsChannel">
          <el-select
            style="width: 300px"
            v-model="actionData.logisticsChannel"
            :placeholder="'请选择物流渠道'"
            filterable
            :disabled="isDisabled"
            clearable
          >
            <el-option
              :label="item.bseChannelName"
              :value="item.bseChannelCode"
              v-for="item in logisticsChannel"
              :key="item.bseChannelCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </template>
    <template
      v-if="ruleType === 'COMFIRM_ORDER' || ruleType === 'MARK_PENDING_CONFIRMATION' || ruleType === 'CRAETE_FO'"
    >
      <el-form-item label="执行动作:" prop="excuteFlags">
        <el-radio-group v-model="actionData.excuteFlags">
          <el-radio :label="true">自动执行</el-radio>
          <!-- <el-radio :label="6">禁止拆单</el-radio> -->
        </el-radio-group>
      </el-form-item>
    </template>
    <template v-if="ruleType === 'DISTRIBUTE_TO_THIRD_PARTY_WAREHOUSES'">
      <div style="display: flex">
        <el-form-item label="发货单创建后" prop="delayedMinute">
          <el-input-number
            placeholder="请输入"
            min="0"
            :precision="0"
            :controls="false"
            v-model="actionData.delayedMinute"
            :disabled="isDisabled"
          ></el-input-number>
          <span style="margin-left: 10px">分钟执行</span>
        </el-form-item>
      </div>
    </template>
    <template v-else-if="ruleType === 'REVIEW_ORDER'">
      <el-form-item label="执行动作:" prop="label">
        <p style="margin-bottom: 5px; font-size: 12px">
          自动审核发货订单<span style="margin-left: 10px; color: #aaa">推送至仓库配货、发货</span>
        </p>
        <div style="display: flex">
          <p style="margin-right: 10px; font-size: 12px">打标签</p>
          <el-select
            style="width: 300px"
            v-model="actionData.label"
            :placeholder="'请选择备选仓库'"
            filterable
            clearable
            @change="baseInsert"
          >
            <el-option :label="item.label" :value="item.value" v-for="item in options" :key="item.value"> </el-option>
          </el-select>
          <p style="margin-left: 10px; color: #aaa; font-size: 12px">订单打指定标签</p>
        </div>
      </el-form-item>
    </template>
    <template v-if="ruleType == 'AUTOMATIC_SKU_MATCHING'">
      <el-form-item label="执行动作:" prop="action">
        <el-radio-group v-model="actionData.action">
          <el-radio label="1">自动匹配SKU</el-radio>
        </el-radio-group>
      </el-form-item>
      <div style="padding: 10px 0 0 85px; box-sizing: border-box">
        <el-table :data="autoMatchTableData" border stripe style="width: 100%">
          <el-table-column prop="condition" label="条件" width="180"> </el-table-column>
          <el-table-column prop="descriptions" label="说明" width="180"> </el-table-column>
          <el-table-column prop="priority" label="优先级">
            <template slot-scope="scope">
              <el-input-number
                :precision="0"
                :controls="false"
                :min="0"
                v-if="scope.$index == 0"
                v-model="scope.row.saleSkuPriority"
                placeholder="请输入"
                @change="changePriority($event, 'saleSkuPriority')"
              ></el-input-number>
              <el-input-number
                :precision="0"
                :min="0"
                :controls="false"
                v-if="scope.$index == 1"
                v-model="scope.row.stockAgePriority"
                @change="changePriority($event, 'stockAgePriority')"
                placeholder="请输入"
              ></el-input-number>
              <!-- <el-input-number
                :precision="0"
                :min="0"
                :controls="false"
                v-if="scope.$index == 2"
                v-model="scope.row.companyStockAgePriority"
                @change="changePriority($event, 'companyStockAgePriority')"
                placeholder="请输入"
              ></el-input-number>
              <el-input-number
                :precision="0"
                :controls="false"
                :min="0"
                v-if="scope.$index == 3"
                v-model="scope.row.platformSiteStockAgePriority"
                @change="changePriority($event, 'platformSiteStockAgePriority')"
                placeholder="请输入"
              ></el-input-number> -->
              <el-input-number
                :precision="0"
                :controls="false"
                :min="0"
                v-if="scope.$index == 2"
                v-model="scope.row.warehouseNearbyPriority"
                placeholder="请输入"
                @change="changePriority($event, 'warehouseNearbyPriority')"
              ></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template v-if="ruleType == 'PLATFORM_DELIVERY'">
      <el-form-item label="" prop="action">
        <el-radio-group v-model="actionData.action">
          <el-radio label="1">发货单虚假发货时，回传平台发货</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="">
        <p style="color: #d9001b; font-size: 12px">
          提示：
          <br />
          如果有配置自动回传平台发货规则，则发货单状态为“虚假发货成功”时，回传平台发货；
          <br />
          如果未配置自动回传平台发货规则，则发货单状态为“已发货”时，回传平台发货
        </p>
      </el-form-item>
    </template>

    <el-dialog :title="dialogTitle" :modal="false" :visible.sync="dialogVisible" width="660px" center @open="open">
      <div style="padding: 0 30px">
        <div class="search-box">
          <span class="search-item">可选仓库</span>
          <el-input
            class="search-item"
            style="width: 350px"
            v-model="warehouseNameKeyword"
            clearable
            placeholder="支持多个，英文逗号分隔"
          ></el-input>
          <el-button class="search-item" type="primary" @click="handleSearch">搜索</el-button>
        </div>

        <div class="warhorse-box">
          <div class="warhorse-box-item">
            <p>可选仓库</p>
            <div class="choses-box-warehouse">
              <VueDraggable
                animation="150"
                :group="{ name: 'people', pull: 'clone', put: false }"
                :sort="false"
                class="flex flex-col gap-2 p-4 w-300px bg-gray-500/5 rounded"
                v-model="selectableWarehouses"
              >
                <div
                  v-for="item in selectableWarehouses"
                  :key="item.warehouseId"
                  class="cursor-move h-30 bg-gray-500/5 rounded p-3"
                >
                  <el-tag class="tag-item"> {{ item.warehouseName }}</el-tag>
                </div>
              </VueDraggable>
            </div>
          </div>

          <div class="warhorse-box-item">
            <p>已选仓库</p>
            <div class="copy-warehouse">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入批量复制的仓库名称，逗号或换行分割"
                v-model="copyWarehouse"
                @change="changeCopyWarehouse"
              ></el-input>
            </div>

            <div class="choses-box-warehouse" style="height: 290px" v-if="this.type === 'planA'">
              <VueDraggable
                style="min-height: 350px"
                v-model="currentSelectedDeliveryWarehouse"
                :animation="150"
                group="people"
                class="flex flex-col gap-2 p-4 w-300px m-auto bg-gray-500/5 rounded overflow-auto"
                @update="onUpdate"
                @add="onAdd"
                @remove="remove"
              >
                <div
                  v-for="(item, index) in currentSelectedDeliveryWarehouse"
                  :key="item.warehouseId"
                  class="cursor-move h-30 bg-gray-500/5 rounded p-3"
                >
                  <el-tag
                    closable
                    :key="item.warehouseId"
                    class="tag-item"
                    @close="removeSelected(index)"
                    :data-warehouseId="`${item.warehouseId}`"
                    :data-warehouseName="`${item.warehouseName}`"
                  >
                    {{ index + 1 }}、 {{ item.warehouseName }}</el-tag
                  >
                </div>
              </VueDraggable>
            </div>
            <div class="choses-box-warehouse" style="height: 290px" v-else>
              <VueDraggable
                style="min-height: 350px"
                v-model="currentTemporaryWarehouse"
                :animation="150"
                group="people"
                class="flex flex-col gap-2 p-4 w-300px m-auto bg-gray-500/5 rounded overflow-auto"
                @update="onUpdate"
                @add="onAdd"
                @remove="remove"
              >
                <div
                  v-for="(item, index) in currentTemporaryWarehouse"
                  :key="item.warehouseId"
                  class="cursor-move h-30 bg-gray-500/5 rounded p-3"
                >
                  <el-tag closable @close="removeAlternative(index)" class="tag-item">
                    {{ index + 1 }}、 {{ item.warehouseName }}</el-tag
                  >
                </div>
              </VueDraggable>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer dialog-btn">
        <el-button @click="deselectOption">取 消</el-button>
        <el-button type="primary" @click="confirmSelection">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { getPrdCalculateRuleDetail } from "@/api/baseSetup/bseplatformtype"

import { deepClone } from "../../../../util/util"
import { VueDraggable } from "vue-draggable-plus"
import { getAllWarehouse } from "@/api/order/orderRule"
import { handleAbnormal } from "@/api/logistics/transfer/tmstransfercost"

export default {
  name: "ruleEngineAction",
  props: {
    ruleType: {
      type: String,
      default: ""
    },
    actionData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    actionWay: {
      type: Array,
      default: function () {
        return []
      }
    },
    actionWarehouse: {
      type: Array,
      default: function () {
        return []
      }
    },
    logisticsChannel: {
      type: Array,
      default: function () {
        return []
      }
    },
    isDisabled: false
  },
  data() {
    return {
      options: [],
      alternativeWarehouse: "",
      deliveryWarehouse: "",
      autoMatchTableData: [
        {
          condition: "销售SKU关系优先级",
          descriptions: "优先匹配优先级高、可用库存满足的SKU",
          saleSkuPriority: 99
        },
        {
          condition: "仓库库龄",
          descriptions: "优先匹配仓库库龄长的SKU",
          stockAgePriority: 99
        },
        // {
        //   condition: "公司库龄",
        //   descriptions: "优先匹配公司库龄长的SKU",
        //   companyStockAgePriority: 99
        // },
        // {
        //   condition: "平台站点库龄",
        //   descriptions: "优先匹配平台站点库龄长的SKU",
        //   platformSiteStockAgePriority: 99
        // },
        {
          condition: "就近仓库发货",
          descriptions: "根据仓库优先级匹配仓库",
          warehouseNearbyPriority: 99
        }
      ],
      dialogVisible: false,
      warehouseNameKeyword: "",
      selectableWarehouses: [], // 可选的仓库列表
      selectedDeliveryWarehouse: [], // 已选发货仓库列表
      currentSelectedDeliveryWarehouse: [], //弹窗编辑的发货仓库
      oldCurrentSelectedDeliveryWarehouse: [], //  旧的已选发货仓库数据
      dialogTitle: "",
      type: "planA",
      partitionAlternativeWarehouse: [
        {
          areaIndex: 0, // 备选仓库排序
          alternativeWarehouseId: []
        }
      ], // 备选仓库数据集合
      copyWarehouse: "",
      alternativeIndex: 0, // 备选仓库索引
      currentTemporaryWarehouse: [], // 当前暂存仓库 作为备选仓库中转选择使用
      currentTemporaryIndex: 0, // 当前暂存仓库索引
      notRepeatWarehouse: new Set([]), // 用来 去重已选仓库
      oldCurrentTemporaryWarehouse: [], // 用来存储旧的当前数据，用来复制仓库时处理有相同数据的情况还原数据
      editInitAlternativeWarehouse: [], //编辑备选仓库数据 用于取消编辑还原
      editInitDeliveryWarehouse: [], //编辑发货仓库数据 用于取消编辑还原
      // 用于比对的数据
      comparisonDeliveryWarehouse: [],
      comparisonAlternativeWarehouse: []
    }
  },
  watch: {
    actionData(val) {
      console.log("val", val)
      this.getWarehouseName()
      if (val.priorityMatching) {
        Object.keys(val.priorityMatching).forEach((key) => {
          const item = this.autoMatchTableData.find((item) => item.hasOwnProperty(key))
          if (item) {
            item[key] = val.priorityMatching[key] || 99
          }
        })
      }
      // actionWarehouse
      this.selectedDeliveryWarehouse = val.deliveryWarehouseId
        .map((id) => {
          const warehouse = this.actionWarehouse.find((wh) => wh.warehouseId === id)
          return warehouse ? { warehouseId: warehouse.warehouseId, warehouseName: warehouse.warehouseName } : null
        })
        .filter((item) => item !== null)

      if (val.partitionAlternativeWarehouse) {
        val.partitionAlternativeWarehouse.forEach((item) => {
          item.alternativeWarehouseId = item.alternativeWarehouseId
            .map((it) => {
              const warehouse = this.actionWarehouse.find((wh) => wh.warehouseId === it)
              if (warehouse) {
                return {
                  warehouseId: warehouse.warehouseId,
                  warehouseName: warehouse.warehouseName
                }
              } else {
                return null
              }
            })
            .filter((item) => item !== null)
        })
        this.partitionAlternativeWarehouse = val.partitionAlternativeWarehouse
      }
    },
    selectedDeliveryWarehouse: {
      handler(newVal, oldVal) {
        this.actionData.deliveryWarehouseId = newVal.map(({ warehouseId }) => warehouseId)
      },
      deep: true
    },
    // 多个备选仓 数据处理
    partitionAlternativeWarehouse: {
      handler(newVal, oldVal) {
        this.actionData.partitionAlternativeWarehouse = newVal.map((item) => {
          return {
            areaIndex: item.areaIndex,
            alternativeWarehouseId: item.alternativeWarehouseId.map((item) => item.warehouseId)
          }
        })
      },
      deep: true
    },
    currentTemporaryWarehouse: {
      handler(newVal, oldVal) {
        this.oldCurrentTemporaryWarehouse = newVal
      },
      deep: true
    },
    currentSelectedDeliveryWarehouse: {
      handler(newVal, oldVal) {
        this.oldCurrentSelectedDeliveryWarehouse = newVal
      },
      deep: true
    },
    dialogVisible(val) {
      if (!val) {
        this.copyWarehouse = ""
      }
    }
  },
  created() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    VueDraggable
  },
  methods: {
    getWarehouseName() {
      this.alternativeWarehouse = ""
      this.deliveryWarehouse = ""
      let alternativeWarehouseArr = []
      let deliveryWarehouseArr = []
      // this.actionData.alternativeWarehouseId.forEach((item) => {
      //   let arr = this.actionWarehouse.filter((items) => items.warehouseId === item)
      //   alternativeWarehouseArr = [...alternativeWarehouseArr, ...arr]
      // })
      this.alternativeWarehouse = alternativeWarehouseArr.map((item) => item.warehouseName).join("，")
      this.actionData.deliveryWarehouseId.forEach((item) => {
        let arr = this.actionWarehouse.filter((items) => items.warehouseId === item)
        deliveryWarehouseArr = [...deliveryWarehouseArr, ...arr]
      })
      this.deliveryWarehouse = deliveryWarehouseArr.map((item) => item.warehouseName).join("，")
    },
    changePriority(val, keyName) {
      if (val) {
        if (this.containsValue(this.actionData.priorityMatching, val)) {
          this.$message.warning("自动匹配SKU优先级不能重复")
        }
        this.actionData.priorityMatching[keyName] = val
      } else {
        this.actionData.priorityMatching[keyName] = 0
      }
    },
    containsValue(obj, value) {
      // 检查对象的每个属性
      for (let key in obj) {
        // 如果属性的值等于要查找的值，返回 true
        if (obj[key] === value) {
          return true
        }
        // 如果属性的值是对象，递归检查其属性
        if (obj[key] !== null && typeof obj[key] === "object") {
          if (containsValue(obj[key], value)) {
            return true
          }
        }
      }
      // 如果没有找到匹配的值，返回 false
      return false
    },
    open() {
      this.getWarehouseList()
      // 存储打开时原始的数据用于回显
      this.editInitAlternativeWarehouse = [
        ...this.partitionAlternativeWarehouse[this.currentTemporaryIndex].alternativeWarehouseId
      ]

      this.editInitDeliveryWarehouse = [...this.selectedDeliveryWarehouse]
    },
    handleSearch() {
      this.getWarehouseList()
    },
    async getWarehouseList() {
      let params = {
        warehouseName: this.warehouseNameKeyword
      }

      if (this.warehouseNameKeyword == "") {
        delete params.warehouseName
      }
      const { data } = await getAllWarehouse(params)
      this.selectableWarehouses = data.data
        .filter((item) => item.funcState === "1")
        .map(({ warehouseName, warehouseId }) => ({ warehouseName, warehouseId }))
    },
    // 批量复制粘贴匹配 获取对应仓库列表
    async getCopyWarehouseNameList(str) {
      let params = {
        warehouseName: str
      }

      if (str.trim() == "") {
        delete params.warehouseName
      }
      const { data } = await getAllWarehouse(params)
      this.selectableWarehouses = data.data
        .filter((item) => item.funcState === "1")
        .map(({ warehouseName, warehouseId }) => ({ warehouseName, warehouseId }))
    },
    handleDeliveryWarehouse(type, ind) {
      if (ind !== undefined) {
        this.alternativeIndex = ind
      }
      this.type = type
      if (type == "planA") {
        this.dialogTitle = "发货仓库"
        this.currentSelectedDeliveryWarehouse = this.selectedDeliveryWarehouse
      } else {
        this.dialogTitle = "备选仓库"
        // 点击打开拖拽框 数据回显
        this.currentTemporaryIndex = ind
        this.currentTemporaryWarehouse = this.partitionAlternativeWarehouse[ind].alternativeWarehouseId
      }
      // 储存发货仓旧的数据用来比对
      this.comparisonDeliveryWarehouse = this.selectedDeliveryWarehouse.map((item) => item.warehouseId)
      this.comparisonAlternativeWarehouse = this.partitionAlternativeWarehouse.flatMap((item) =>
        item.alternativeWarehouseId.map((warehouse) => warehouse.warehouseId)
      )
      this.dialogVisible = true
    },
    handleCreateDeliveryWarehouse() {
      this.partitionAlternativeWarehouse.push({
        areaIndex: this.partitionAlternativeWarehouse.length, // 备选仓库排序
        alternativeWarehouseId: []
      })
    },
    handleDeleteDeliveryWarehouse(index) {
      this.partitionAlternativeWarehouse.splice(index, 1)
    },
    onUpdate(event) {
      this.filterArray()
      if (this.areWarehousesDistinct(event.data, event.from == event.to)) {
        this.checkDataForDuplicatesAndHandleDuplicates(event)
      } else {
        this.comparisonDeliveryWarehouse = this.currentSelectedDeliveryWarehouse.map((item) => item.warehouseId)
        if (this.type == "planB") {
          this.comparisonAlternativeWarehouse = [
            ...this.partitionAlternativeWarehouse
              .filter((fItem, index) => index === this.currentTemporaryIndex)
              .flatMap((item) => item.alternativeWarehouseId.map((warehouse) => warehouse.warehouseId)),
            ...this.currentTemporaryWarehouse.map((item) => item.warehouseId)
          ]
        }
      }
    },
    onAdd(event) {
      this.filterArray()
      if (this.areWarehousesDistinct(event.data)) {
        this.checkDataForDuplicatesAndHandleDuplicates(event)
      } else {
        this.comparisonDeliveryWarehouse = this.currentSelectedDeliveryWarehouse.map((item) => item.warehouseId)
        if (this.type == "planB") {
          this.comparisonAlternativeWarehouse = [
            ...this.partitionAlternativeWarehouse
              .filter((fItem, index) => index === this.currentTemporaryIndex)
              .flatMap((item) => item.alternativeWarehouseId.map((warehouse) => warehouse.warehouseId)),
            ...this.currentTemporaryWarehouse.map((item) => item.warehouseId)
          ]
        }
      }
    },
    remove(event) {
      this.filterArray()
      if (this.areWarehousesDistinct(event.data)) {
        this.checkDataForDuplicatesAndHandleDuplicates(event)
      } else {
        this.comparisonDeliveryWarehouse = this.currentSelectedDeliveryWarehouse.map((item) => item.warehouseId)
        if (this.type == "planB") {
          this.comparisonAlternativeWarehouse = [
            ...this.partitionAlternativeWarehouse
              .filter((fItem, index) => index === this.currentTemporaryIndex)
              .flatMap((item) => item.alternativeWarehouseId.map((warehouse) => warehouse.warehouseId)),
            ...this.currentTemporaryWarehouse.map((item) => item.warehouseId)
          ]
        }
      }
    },
    //   判断数据是否有重复，并处理重复的数据
    checkDataForDuplicatesAndHandleDuplicates(event) {
      this.$message.warning("发货仓库和备选仓库不能存在相同仓库，请重新选择！")
      if (this.type == "planB") {
        this.currentTemporaryWarehouse.splice(event.newIndex, 1)
      } else {
        this.currentSelectedDeliveryWarehouse.splice(event.newIndex, 1)
      }
    },
    filterArray() {
      // 过滤重复值
      this.selectedDeliveryWarehouse = this.selectedDeliveryWarehouse.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.warehouseId === item.warehouseId && t.warehouseName === item.warehouseName)
      )
      this.currentTemporaryWarehouse = this.currentTemporaryWarehouse.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.warehouseId === item.warehouseId && t.warehouseName === item.warehouseName)
      )
    },
    areWarehousesDistinct(data = null, onlyMove = false) {
      if (onlyMove) return false
      const mergedSet1 = new Set([...this.comparisonDeliveryWarehouse, ...this.comparisonAlternativeWarehouse])
      if (!Array.isArray(data)) {
        if (mergedSet1.has(data.warehouseId)) {
          return true
        }
      } else {
        return data.some((item) => mergedSet1.has(item.warehouseId))
      }

      return false
    },
    removeSelected(index) {
      this.currentSelectedDeliveryWarehouse.splice(index, 1)
    },
    removeAlternative(index) {
      this.currentTemporaryWarehouse.splice(index, 1)
    },
    changeCopyWarehouse(val) {
      // 1. 将传入的字符串根据逗号和换行符切割，并按顺序保存
      const result = val
        .replace(/[,|\n]/g, " ")
        .split(" ")
        .filter(Boolean) // 过滤掉空白项

      const matchWarehouseArray = result
        .map((name) => {
          // 2. 在 selectableWarehouses 中寻找匹配的仓库
          return this.selectableWarehouses.find((warehouse) => warehouse.warehouseName === name)
        })
        .filter(Boolean) // 过滤掉未找到匹配仓库的 null/undefined 项

      // 3. 根据 type 进行不同的处理
      if (this.type === "planA") {
        // 发货仓库处理
        this.currentSelectedDeliveryWarehouse = this.mergeAndUniqueWarehouses(
          this.currentSelectedDeliveryWarehouse,
          matchWarehouseArray
        )
        this.comparisonDeliveryWarehouse = this.currentSelectedDeliveryWarehouse.map((item) => item.warehouseId)
      } else {
        // 备选仓库处理
        this.currentTemporaryWarehouse = this.mergeAndUniqueWarehouses(
          this.currentTemporaryWarehouse,
          matchWarehouseArray
        )

        // 4. 检查发货仓库和备选仓库是否存在相同的仓库
        if (this.areWarehousesDistinct(matchWarehouseArray)) {
          this.$message.warning("发货仓库和备选仓库不能存在相同仓库，请重新选择！")
          // 回滚到上一次有效的备选仓库
          this.currentTemporaryWarehouse = this.oldCurrentTemporaryWarehouse
        } else {
          this.comparisonAlternativeWarehouse = [
            ...this.partitionAlternativeWarehouse
              .filter((fItem, index) => index === this.currentTemporaryIndex)
              .flatMap((item) => item.alternativeWarehouseId.map((warehouse) => warehouse.warehouseId)),
            ...this.currentTemporaryWarehouse.map((item) => item.warehouseId)
          ]
        }
      }
    },
    mergeAndUniqueWarehouses(arr1, arr2) {
      const uniqueWarehouses = new Map()

      arr1.forEach((warehouse) => {
        uniqueWarehouses.set(warehouse.warehouseId, warehouse)
      })

      arr2.forEach((warehouse) => {
        uniqueWarehouses.set(warehouse.warehouseId, warehouse)
      })
      // 返回合并后的唯一仓库数组
      return Array.from(uniqueWarehouses.values())
    },
    confirmSelection() {
      if (this.type == "planB") {
        this.$set(
          this.partitionAlternativeWarehouse[this.currentTemporaryIndex],
          "alternativeWarehouseId",
          this.currentTemporaryWarehouse
        )
      } else {
        // this.$set(this, "selectedDeliveryWarehouse",)
        this.selectedDeliveryWarehouse = this.currentSelectedDeliveryWarehouse
      }
      // this.partitionAlternativeWarehouse[this.currentTemporaryIndex].alternativeWarehouseId =
      //   this.currentTemporaryWarehouse
      this.dialogVisible = false
    },
    deselectOption() {
      if (this.type == "planB") {
        this.$set(
          this.partitionAlternativeWarehouse[this.currentTemporaryIndex],
          "alternativeWarehouseId",
          this.editInitAlternativeWarehouse
        )
      } else {
        // editInitDeliveryWarehouse
        this.selectedDeliveryWarehouse = this.editInitDeliveryWarehouse
      }

      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.ruleEngineAction {
  width: 650px;
  padding: 10px 0 10px;
  bottom: 80px;
  border-top: 1px solid #efefef;
  background: #fff;
  // position: fixed;
  z-index: 100;
  font-size: 13px;
  // max-height: 300px;
  .ruleEngineAction-title {
    font-size: 14px;
    font-weight: bold;
    position: relative;
    margin-left: 10px;
    margin-bottom: 10px;
    &:before {
      content: "";
      position: absolute;
      left: -10px;
      top: 3px;
      bottom: 3px;
      width: 2px;
      background: blue;
    }
  }
  .dialog-btn {
    display: flex;
    justify-content: center;
  }
  .search-box {
    display: flex;
    justify-content: flex-start;
    .search-item {
      margin-right: 15px;
    }
  }
  .warhorse-box {
    display: flex;
    .warhorse-box-item {
      display: flex;
      flex-direction: column;
      margin: 0 10px;
    }
    .warhorse-box-item:nth-child(1) {
      margin-right: 30px;
    }
    .copy-warehouse {
      height: 60px;
    }
    .choses-box-warehouse {
      height: 350px;
      width: 250px;
      overflow-y: auto;
      border: 1px solid #ccc; /* 添加一个边框以更好地展示滚动条 */
      scrollbar-color: #888 #f1f1f1; /* 滑块颜色 轨道颜色 */
      scrollbar-width: thin; /* 滚动条宽度，可以是auto, thin, none */
      padding: 5px;
      .tag-item {
        margin: 3px 0;
        cursor: move;
      }
    }
  }
  ::-webkit-scrollbar {
    opacity: 1;
  }
  .sorting {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 每行两个元素 */
    gap: 10px; /* 元素之间的间距 */
    padding-left: 85px;
    .sorting-box {
      display: flex;
      .info {
        width: 100px;
      }
      .info:nth-child(1) {
        padding-left: 85px;
      }
    }
    .warehouse-sorting {
      padding: 5px;
      min-height: 100px;
      max-height: 300px;
      width: 250px;
      overflow-y: auto;
      border: 1px solid #ccc;
    }
  }

  .warehouse-sorting,
 /* 整个滚动条 */
 .choses-box-warehouse {
    /* 整个滚动条 */
    &::-webkit-scrollbar {
      width: 8px; /* 滚动条的宽度 */
      height: 8px; /* 滚动条的高度（对于水平滚动条） */
    }

    /* 滚动条的轨道 */
    &::-webkit-scrollbar-track {
      background: #f1f1f1; /* 轨道的背景色 */
    }

    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      background: #939393; /* 滑块的背景色 */
      border-radius: 4px; /* 滑块的圆角 */
    }

    /* 滚动条滑块在悬停时 */
    &::-webkit-scrollbar-thumb:hover {
      background: #939393; /* 滑块在悬停时的背景色 */
    }
  }
}
</style>
