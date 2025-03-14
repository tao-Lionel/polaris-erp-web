<template>
  <div class="execution" id="bsewarehouseDIV">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @search-reset="searchReset"
        @search-change="handleFilter"
        @selection-change="selectionChange"
        @current-change="currentChange"
        @size-change="sizeChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.baseSetup_bsewarehouse_add">
            新 增
          </el-button>
          <el-button type="primary" @click="handleEdit" size="small" v-if="permissions.baseSetup_bsewarehouse_edit">
            编 辑
          </el-button>
          <el-button type="primary" @click="handleUse" size="small" v-if="permissions.baseSetup_bsewarehouse_use">
            启 用
          </el-button>
          <el-button type="primary" @click="handleNotUse" size="small" v-if="permissions.baseSetup_bsewarehouse_notuse">
            禁 用
          </el-button>
          <el-button type="primary" @click="handleSetSecret" size="small" v-if="permissions.baseSetup_bsewarehouse_set">
            设置AppSecret
          </el-button>
          <el-button
            v-if="permissions.baseSetup_bsewarehouse_set_pla_warehouse"
            type="primary"
            @click="handleSetPlatformWarehouse"
            size="small"
          >
            设置平台仓库映射
          </el-button>
          <export-btn
            v-if="permissions.baseSetup_bsewarehouse_export"
            pageName="仓库"
            pageUrl="/bsewarehouse/page"
            moduleName="baseSetup"
            :columns="exportColumns"
            :pageReq="setSearch()"
          ></export-btn>
        </template>
        <!-- 自定义搜索条件 -->
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="search" :inline="true" ref="searchForm" style="float: left">
            <el-form-item>
              <el-input v-model="search.warehouseCode" size="small" placeholder="内部仓库编码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="search.warehouseName" size="small" placeholder="仓库名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select
                size="small"
                v-model="search.warehouseTypeId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="仓库类型,多选"
              >
                <el-option
                  v-for="item in bseWarehouseTypeOptions"
                  :key="item.value"
                  :label="item.warehouseTypeName"
                  :value="item.warehouseTypeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="search.providerWarehouseCode" size="small" placeholder="服务商仓库编码"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- 高级搜索 -->
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="search" :inline="true" ref="searchFormAdvance">
            <el-form-item>
              <el-select v-model="search.platformTypeCode" size="small" clearable filterable placeholder="平台">
                <el-option
                  v-for="(item, index) in platformOptions"
                  :key="index"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="search.storeId"
                size="small"
                clearable
                filterable
                multiple
                placeholder="店铺,支持多选"
              >
                <el-option
                  v-for="item in storeOptions"
                  :key="item.storeId"
                  :label="item.storeAccount"
                  :value="item.storeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="search.platformTypeWarehouseCode" size="small" placeholder="平台仓库编码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select
                size="small"
                v-model="search.warehouseProviderId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="仓库服务商,支持多选"
              >
                <el-option
                  v-for="item in bseWarehouseProviderOptions"
                  :key="item.value"
                  :label="item.providerName"
                  :value="item.warehouseProviderId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select size="small" v-model="search.corporationCode" clearable filterable placeholder="使用组织">
                <el-option v-for="item in corporationOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select size="small" v-model="search.supportRefund" clearable placeholder="是否支持退件">
                <el-option
                  v-for="item in supportRefundOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                size="small"
                v-model="search.countryId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="国家/地区,支持多选"
                @change="handleCountryChange"
              >
                <el-option
                  v-for="item in bsecountryOptions"
                  :key="item.value"
                  :label="item.countryShortName"
                  :value="item.countryId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="area">
              <el-select v-model="search.area" size="small" filterable clearable placeholder="区域">
                <el-option
                  v-for="item in regionOptions"
                  :key="item.mappingCode"
                  :label="item.mappingName"
                  :value="item.mappingCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select size="small" v-model="search.funcState" clearable placeholder="仓库状态">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <!-- 列表字段 -->
        <template slot="downloadTransportCarrierNames" slot-scope="scope">
          <a v-if="scope.row.transportCarrierNames" @click="transportCarrierReview(scope.row)">{{
            scope.row.transportCarrierNames.length
          }}</a>
        </template>
        <!-- 使用组织 -->
        <template slot="corporationList" slot-scope="{ row }">
          <div
            style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%"
            :title="row.corporationList?.map((item) => item.corporationName)?.join(',')"
          >
            {{ row.corporationList?.map((item) => item.corporationName)?.join(",") }}
          </div>
        </template>
      </avue-crud>

      <el-dialog
        class="set_dialog"
        title="设置AppSecret"
        center
        :visible.sync="setAppSecretDialogVisible"
        width="660px"
      >
        <el-table :data="secretTableData" style="width: 100%">
          <el-table-column prop="warehouseCode" label="内部仓库编码" width="180"></el-table-column>
          <el-table-column prop="warehouseName" label="仓库名称" width="180"></el-table-column>
          <el-table-column prop="warehouseTypeId" label="仓库类型" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.warehouseTypeName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="warehouseProviderId" label="仓库服务商" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.providerName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="warehouseOutAppId" label="AppId" width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.warehouseOutAppId" required></el-input>
              <el-button
                style="margin: 10px 0"
                type="primary"
                v-if="!scope.$index && secretTableData.length !== 1"
                @click="batSetAppId"
                >批量填充</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="warehouseOutAppSecret" label="AppSecret" width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.warehouseOutAppSecret"></el-input>
              <el-button
                style="margin: 10px 0"
                type="primary"
                v-if="!scope.$index && secretTableData.length !== 1"
                @click="batSetAppSecret"
                >批量填充</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="setAppSecretDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="setAppSecret">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 列表物流商查看 -->
      <el-dialog
        class="transportCarrier_dialog"
        title="查看物流商"
        center
        :visible.sync="transportCarrierDialogVisible"
        width="330px"
      >
        <el-table :data="transportCarrierTableData" style="width: 100%" :index="indexMethod">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="carrier" label="物流商"></el-table-column>
        </el-table>
      </el-dialog>
    </basic-container>

    <platformWarehouseDialog ref="platformWarehouseDialogRef" @updateList="updateList"></platformWarehouseDialog>
    <addDialog ref="addWarehouseDialogRef" @updateList="updateList"></addDialog>
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  putObj,
  delObj,
  useObj,
  notuseObj,
  getSelectedWarehouse,
  saveAppIdAndAppSecret
} from "@/api/baseSetup/bsewarehouse"
import { getBseWarehouseType } from "@/api/baseSetup/bsewarehousetype"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAll as getBsetransportcarrierAll } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getAll as getBseWarehouseProvider } from "@/api/baseSetup/bsewarehouseprovider"
import { tableOption, exportColumns } from "@/const/crud/baseSetup/bsewarehouse"
import { mapGetters } from "vuex"
import { getAllCorporation } from "@/api/baseSetup/bsestore"
import platformWarehouseDialog from "./components/platformWarehouseDialog"
import { getStoreListApi } from "@/api/baseSetup/bsestore"
import addDialog from "./components/addDialog"
import { deepClone } from "@/components/avue/utils/util"
import { getDictByType } from "@/util/auth"

export default {
  name: "bsewarehouse",
  components: { platformWarehouseDialog, addDialog },
  data() {
    return {
      exportColumns,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectList: [],
      //搜索对象
      search: {
        warehouseCode: null,
        warehouseOutCode: null,
        warehouseName: "",
        warehouseTypeId: [],
        warehouseProviderId: [],
        supportRefund: "",
        countryId: [],
        funcState: "",
        storeId: [],
        corporationCode: "",
        area: ""
      },
      options: [
        {
          value: "1",
          label: "启用"
        },
        {
          value: "0",
          label: "禁用"
        }
      ],
      supportRefundOptions: [
        {
          label: "不支持",
          value: "0"
        },
        {
          label: "支持",
          value: "1"
        }
      ],
      bseWarehouseTypeOptions: [],
      bseWarehouseProviderOptions: [],
      bsecountryOptions: [],
      setAppSecretDialogVisible: false,
      secretTableData: [],
      warehouseIds: [],
      platformOptions: [],
      transportCarrierOptions: [],
      transportCarrierDialogVisible: false,
      transportCarrierTableData: [],
      corporationOptions: [],
      storeOptions: [],
      regionOptions: [],
      warehouseRegion: []
    }
  },
  created() {},
  mounted: async function () {
    this.getList(this.page)
    this.getBseWarehouseType()
    this.getCountry()
    this.getBseWarehouseProvider()
    this.getPlaTypeAll()
    this.getBsetransportcarrierAll()
    this.getCorporationList()
    this.getStoreList()
    this.warehouseRegion = await getDictByType("warehouse_region")
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    setSearch() {
      const search = deepClone(this.search)
      for (let item of Object.keys(search)) {
        if (Array.isArray(search[item])) {
          search[item] = search[item].join(",")
        }
      }
      return search
    },
    handleCountryChange() {
      this.regionOptions = []
      this.search.area = ""
      this.getRegionOptions()
    },

    getRegionOptions() {
      let countryCodes = []
      this.search.countryId.forEach((countryId) => {
        const countryCode = this.bsecountryOptions.find((item) => item.countryId === countryId)?.countryCode
        countryCodes.push(countryCode)
      })

      countryCodes.forEach((countryCode) => {
        let dictMappings = this.warehouseRegion.find((item) => item.value === countryCode)?.dictMappings
        if (dictMappings) {
          this.regionOptions.push(...dictMappings)
        }
      })
    },

    setSearch() {
      const search = deepClone(this.search)
      for (let item of Object.keys(search)) {
        if (Array.isArray(search[item])) {
          search[item] = search[item].join(",")
        }
      }
      return search
    },
    async getStoreList() {
      const { data } = await getStoreListApi()
      this.storeOptions = data.data
    },
    transportCarrierReview(row) {
      this.transportCarrierTableData = row.transportCarrierNames.map((item) => {
        return { carrier: item }
      })
      this.transportCarrierDialogVisible = true
    },
    handleTransportCarrierChange(value) {
      this.transportCarrierIds = value
    },
    batSetAppId() {
      this.secretTableData.forEach((item) => {
        this.$set(item, "warehouseOutAppId", this.secretTableData[0].warehouseOutAppId)
      })
    },
    batSetAppSecret() {
      this.secretTableData.forEach((item) => {
        this.$set(item, "warehouseOutAppSecret", this.secretTableData[0].warehouseOutAppSecret)
      })
    },
    getList(page, params) {
      fetchList(
        Object.assign(
          {
            page: page.currentPage,
            pageSize: page.pageSize
          },
          params
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    /**
     * 搜索前查询条件处理
     */
    handleSearch() {
      let query = {}
      if (this.search.warehouseName) {
        query.warehouseName = this.search.warehouseName
      }
      if (this.search.warehouseTypeId) {
        query.warehouseTypeId = this.search.warehouseTypeId.join(",")
      }
      if (this.search.warehouseProviderId) {
        query.warehouseProviderId = this.search.warehouseProviderId.join(",")
      }
      if (this.search.supportRefund) {
        query.supportRefund = this.search.supportRefund
      }
      if (this.search.countryId) {
        query.countryId = this.search.countryId.join(",")
      }
      if (this.search.funcState) {
        query.funcState = this.search.funcState
      }
      if (this.search.warehouseCode) {
        query.warehouseCode = this.search.warehouseCode
      }
      if (this.search.providerWarehouseCode) {
        query.providerWarehouseCode = this.search.providerWarehouseCode
      }
      if (this.search.platformTypeWarehouseCode) {
        query.platformTypeWarehouseCode = this.search.platformTypeWarehouseCode
      }
      if (this.search.platformTypeCode) {
        query.platformTypeCode = this.search.platformTypeCode
      }
      if (this.search.corporationCode) {
        query.corporationCode = this.search.corporationCode
      }
      if (this.search.storeId) {
        query.storeId = this.search.storeId.join(",")
      }
      if (this.search.area) {
        query.area = this.search.area
      }
      this.getList(this.page, query)
    },
    /**
     * 重置搜索条件
     */
    searchReset() {
      this.search = {
        platformTypeCode: "",
        warehouseCode: "",
        platformTypeWarehouseCode: "",
        warehouseName: "",
        warehouseTypeId: [],
        warehouseProviderId: [],
        supportRefund: "",
        countryId: [],
        funcState: "",
        area: ""
      }
    },
    /**
     * 重新搜索条件
     */
    handleFilter(param) {
      this.page.currentPage = 1
      this.handleSearch()
      this.clearSelectClear()
    },
    /**
     * 选中数据
     */
    selectionChange(tableData) {
      this.selectList = tableData
    },
    /**
     * 清除选中
     */
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    /**
     * 当前第几页
     */
    currentChange(val) {
      this.page.currentPage = val
      this.handleSearch()
    },
    /**
     * 每页显示几条
     */
    sizeChange(val) {
      this.page.pageSize = val
      this.handleSearch()
    },
    getPlaTypeAll() {
      getPlaTypeAll().then((response) => {
        this.platformOptions = response.data.data
      })
    },
    /**
     * 查询仓库类型
     */
    getBseWarehouseType() {
      getBseWarehouseType().then((response) => {
        this.bseWarehouseTypeOptions = response.data.data
      })
    },
    /**
     * 查询国家地区
     */
    getCountry() {
      getCountry().then((response) => {
        this.bsecountryOptions = response.data.data
      })
    },
    /**
     * 查询仓库服务商
     */
    getBseWarehouseProvider() {
      getBseWarehouseProvider().then((response) => {
        this.bseWarehouseProviderOptions = response.data.data
      })
    },

    //查询物流商
    getBsetransportcarrierAll() {
      let query = {}
      getBsetransportcarrierAll(query).then((response) => {
        let data = response.data.data
        if (data && data.length > 0) {
          this.transportCarrierOptions = data
        }
      })
    },
    async setAppSecret() {
      let i = 0
      let flag = true
      this.secretTableData.forEach((item) => {
        if (item.warehouseTypeId == 4 && !(item.warehouseOutAppId && item.warehouseOutAppSecret)) {
          flag = false
          return this.$message.error("仓库类型为:海外仓 时,必须填写AppId和AppSecret")
        }
        return flag
      })
      if (flag) {
        this.secretTableData.forEach((item) => {
          item.warehouseId = this.warehouseIds[i]
          i++
        })
        let res = await saveAppIdAndAppSecret({ listDto: this.secretTableData })
        if (res.data.code == 0) {
          this.$message.success("操作成功")
          this.setAppSecretDialogVisible = false
          this.refreshChange()
        } else {
          this.$message.error(res.data.msg)
          this.setAppSecretDialogVisible = false
        }
      }
    },
    async handleSetSecret() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      let warehouseIds = []
      this.warehouseIds = []
      this.selectList.forEach((item) => {
        warehouseIds.push(item.warehouseId)
      })
      warehouseIds.reverse()
      this.warehouseIds = warehouseIds
      let res = await getSelectedWarehouse({ ids: warehouseIds })
      this.secretTableData = res.data.data
      this.setAppSecretDialogVisible = true
    },
    /**
     * @title 打开新增窗口
     *
     **/
    handleAdd() {
      this.$refs.addWarehouseDialogRef.openDialog(
        this.bseWarehouseTypeOptions,
        this.bseWarehouseProviderOptions,
        this.transportCarrierOptions,
        this.supportRefundOptions,
        this.bsecountryOptions,
        this.corporationOptions,
        null
      )
    },
    handleEdit() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return
      }
      let data = this.selectList[0]

      this.$refs.addWarehouseDialogRef.openDialog(
        this.bseWarehouseTypeOptions,
        this.bseWarehouseProviderOptions,
        this.transportCarrierOptions,
        this.supportRefundOptions,
        this.bsecountryOptions,
        this.corporationOptions,
        data
      )
    },
    /**
     * 启用
     */
    handleUse() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      let isOperate = true
      let tip = ""
      let warehouseIds = []
      this.selectList.forEach((item) => {
        if (item.funcState == 1 && isOperate) {
          tip = "仓库：" + item.warehouseName + "，已启用，不需要再启用"
          isOperate = false
        } else if (isOperate) {
          warehouseIds.push(item.warehouseId)
        }
      })
      if (!isOperate) {
        this.$message.error(tip)
        return
      }
      this.$confirm("是否确认启用选中仓库?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          useObj(warehouseIds.join(","))
            .then((response) => {
              if (response.data.code == 0) {
                this.clearSelectClear()
                this.handleSearch()
                this.$notify({
                  title: "成功",
                  message: "操作成功",
                  type: "success",
                  duration: 2000
                })
              } else if (response.data.code == 1) {
                this.$message.error(response.data.msg)
                return
              } else {
                this.$message.error("操作失败")
                return
              }
            })
            .catch(() => {
              this.$message.error("操作失败")
              return
            })
        })
        .catch((error) => {})
    },
    /**
     * 禁用
     */
    handleNotUse() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      let isOperate = true
      let tip = ""
      let warehouseIds = []
      this.selectList.forEach((item) => {
        if (item.funcState == 0 && isOperate) {
          tip = "仓库：" + item.warehouseName + "，已禁用，不需要再禁用"
          isOperate = false
        } else if (isOperate) {
          warehouseIds.push(item.warehouseId)
        }
      })
      if (!isOperate) {
        this.$message.error(tip)
        return
      }
      this.$confirm("是否确认禁用选中仓库?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          notuseObj(warehouseIds.join(","))
            .then((response) => {
              if (response.data.code == 0) {
                this.clearSelectClear()
                this.handleSearch()
                this.$notify({
                  title: "成功",
                  message: "操作成功",
                  type: "success",
                  duration: 2000
                })
              } else if (response.data.code == 1) {
                this.$message.error(response.data.msg)
                return
              } else {
                this.$message.error("操作失败")
                return
              }
            })
            .catch(() => {
              this.$message.error("操作失败")
              return
            })
        })
        .catch((error) => {})
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    // 设置平台仓库映射
    handleSetPlatformWarehouse() {
      if (!this.selectList || this.selectList.length === 0) {
        this.$message.warning("请勾选数据")
        return
      } else if (this.selectList.length !== 1) {
        this.$message.warning("请勾选单条数据")
        return
      }
      this.$refs.platformWarehouseDialogRef.openDialog(this.selectList[0])
    },
    updateList() {
      this.$refs.crud.selectClear()
      this.getList(this.page)
    },
    // 获取使用组织
    async getCorporationList() {
      const { data } = await getAllCorporation({})
      this.corporationOptions = data.data.data.map((item) => {
        return {
          value: item.corporationCode,
          label: item.corporationName
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
