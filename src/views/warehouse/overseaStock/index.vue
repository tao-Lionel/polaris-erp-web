<template>
  <div class="execution" id="overseaStock">
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
          <el-dropdown trigger="click">
            <el-button type="primary" size="mini">导出</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="exportAllData">导出数据</el-dropdown-item>
              <el-dropdown-item @click.native="exportSelectedData">导出勾选数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button style="margin-left: 10px" type="primary" @click="asyncOverseaStock" size="small"
            >手动同步海外仓库存</el-button
          >
        </template>

        <template slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="overseaSkuCode">
              <el-input
                v-model="searchForm.overseaSkuCode"
                size="small"
                placeholder="海外仓SKU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="bseSkuCode">
              <el-input v-model="searchForm.bseSkuCode" size="small" placeholder="工厂SKU" v-search-input></el-input>
            </el-form-item>

            <el-form-item prop="overseaSkuName">
              <el-input
                v-model="searchForm.overseaSkuName"
                size="small"
                placeholder="仓库产品名称"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="bseWarehouseId">
              <el-select
                v-model="searchForm.bseWarehouseId"
                size="small"
                clearable
                filterable
                placeholder="仓储方"
                @change="handlechange"
              >
                <el-option
                  v-for="item in warehouseOption"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-button native-type="submit" v-show="false" @click="searchChange" /> -->
          </el-form>
        </template>

        <template slot-scope="scope" slot="operationLog">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.bseWarehouseSkuId)"></i>
        </template>
      </avue-crud>

      <commonImport ref="commonImport" :downloadUrl="downloadUrl" :fileSuffix="fileSuffix" @import="importExcelBtn">
      </commonImport>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>
<script>
// import { getAll as getAllwarehouseProvider } from '@/api/baseSetup/bsewarehouseprovider'
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { fetchList, selectedExport, allExport, syncOversea } from "@/api/warehouse/overseaStock"
import { tableOption } from "@/const/crud/warehouse/overseaStock"
import { getByLikeSkuCodeAndCreateAuditComplete } from "@/api/product/prdsku"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import commonImport from "@/views/cockpit/commonImport"
import { preventShake } from "@/util/tool"
import { downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "warehouseforsku",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        warehouseSku: "",
        bseSkuCode: "",
        overseaSkuName: "",
        bseWarehouseId: null
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
      selectRows: [],

      handleAddOrUpdateTile: "",
      addOrUpdateDialog: false,
      addOrUpdateForm: {
        warehouseProviderId: null,
        warehouseSku: "",
        skuCode: ""
      },

      //禁用下拉数据
      delFlagOptions: [
        { value: "0", label: "启用" },
        { value: "1", label: "禁用" }
      ],
      //查询sku相关
      loadingSkuQuery: false,
      skuList: [],

      addOrUpdateDisabled: false,
      warehouseOption: [],
      bseWarehouseSkuId: null,
      downloadUrl: "/yiyuan/warehouseSku/template_warehouse_sku.xlsx",
      fileSuffix: ".xlsx"
    }
  },
  components: {
    operationlog,
    commonImport
  },
  created() {},
  mounted: function () {
    this.loadAll()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    asyncOverseaStock() {
      if (!this.searchForm.bseWarehouseId) {
        this.$message.warning("请选择仓储方")
        return
      }
      syncOversea(this.searchForm.bseWarehouseId).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.refreshChange()
          console.log(res.data.data)
        } else {
          this.$message.error(res.data.msg)
          this.refreshChange()
        }
      })
    },
    exportSelectedData() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      let idList = this.selectRows.map((item) => item.id)

      selectedExport({ idList }).then((res) => {
        if (res.status === 200) {
          this.$notify({
            title: "成功",
            message: "正在导出（注意：最多可导出6W条数据）",
            type: "success",
            duration: 2000
          })
          downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        }
      })
    },
    exportAllData() {
      allExport().then((res) => {
        if (res.status === 200) {
          this.$notify({
            title: "成功",
            message: "正在导出（注意：最多可导出6W条数据）",
            type: "success",
            duration: 2000
          })
          downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        }
      })
    },

    //导入采购主体
    importWarehouseForSku() {
      this.$refs.commonImport.syncFn()
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
    importExcelBtn(file) {
      if (file != null) {
        this.$refs.commonImport.openFullScreen()
        var _this = this
        this.loading = true
        let formdata = new FormData()
        formdata.append("file", file.raw)
        handleImport(formdata)
          .then((res) => {
            _this.loading = false
            if (res.data.code == 0) {
              _this.clearSelectClear()
              _this.refreshChange()
              _this.$message.success("导入成功")
              _this.$refs.commonImport.syncFn()
            } else if (res.data.code == 1) {
              _this.$message.warning(res.data.msg)
            } else {
              _this.$message.error("导入失败")
            }
            _this.$refs.commonImport.closeFullScreen()
          })
          .catch(() => {
            _this.$message.error("导入失败")
            _this.$refs.commonImport.closeFullScreen()
            return
          })
      }
    },
    handlechange(value) {},
    //dialog样式修改后添加
    dialogResult(dialogFlage) {
      if (dialogFlage) {
        this.auditType = 1
      } else {
        this.auditType = 2
      }
      this.handleAuditSave()
    },

    /**刷新回调 */
    refreshChange(params) {
      this.getList(this.page, params)
    },
    /** 搜索回调*/
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      page = page || { currentPage: 1 }
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
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
      fetchList(
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

    /** 打开新增窗口*/
    handleAdd: function () {
      this.handleAddOrUpdateTile = "新增"
      this.addOrUpdateDialog = true

      this.addOrUpdateDisabled = false
    },
    /**修改 */
    async handleEdit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("请选择一条数据进行修改")
        return
      }
      this.bseWarehouseSkuId = this.selectRows[0].bseWarehouseSkuId
      //是否已审核
      // let existsPSku = this.getPSkuByApproveStatusOk()

      // 获取已禁用平台sku
      // existsPSku = this.getPSkuByDelFlagFall()
      // if (existsPSku && existsPSku.length > 0) {
      //   this.$message.warning('平台sku:' + existsPSku + '，已禁用，不能修改')
      //   return
      // }

      let row = this.selectRows[0]
      let res = await getWarehouseSkuInfo({ bseWarehouseSkuId: row.bseWarehouseSkuId })
      let data = res.data.data
      console.log(res.data.data)

      this.addOrUpdateForm = {
        warehouseProviderId: data.bseWarehouseProviderId,
        warehouseSku: data.bseWarehouseSkuCode,
        skuCode: data.skuCode,
        bseWarehouseSkuId: this.bseWarehouseSkuId
      }

      // this.addOrUpdateDisabled = false
      this.handleAddOrUpdateTile = "修改"
      this.addOrUpdateDialog = true
    },

    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          preventShake.preventShake((bool) => {
            if (bool) {
              saveAndUpdateMsg(_this.addOrUpdateForm)
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
    inputBlur() {
      if (!this.addOrUpdateDialog) {
        this.formReset()
      }
    },
    formReset() {
      this.$nextTick(function () {
        this.$refs["addOrUpdateForm"].resetFields()
        this.addOrUpdateForm = {
          warehouseProviderId: null,
          warehouseSku: "",
          skuCode: ""
        }
      })
    },
    //获取已审核平台sku
    getPSkuByApproveStatusOk() {
      let existsPSku = []
      var data = this.selectRows.filter((obj) => {
        if (obj.approveStatus == 2) {
          existsPSku.push(obj.platformSkuCode)
          return obj
        }
      })
      return existsPSku
    },
    //获取已禁用平台sku
    getPSkuByDelFlagFall() {
      let existsPSku = []
      var data = this.selectRows.filter((obj) => {
        if (obj.delFlag == 1) {
          existsPSku.push(obj.platformSkuCode)
          return obj
        }
      })
      return existsPSku
    },

    /**启用 禁用 */
    handleEnable(state) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }

      var ids = []
      var numberList = []
      this.selectRows.forEach((item) => {
        ids.push(item.bseWarehouseSkuId)
        if (state == item.delFlag) {
          numberList.push(item.bseWarehouseSkuCode)
        }
      })
      const msg = state === 0 ? "启用" : "禁用"
      if (numberList.length > 0) {
        this.$message.warning("仓库SKU:" + numberList + "已" + msg + ",无须重复" + msg)
        return
      }

      const saveObj = {
        warehouseSkuIds: ids.join(","),
        status: state
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
    /**导出 */
    async handleExport() {
      // let par = ''
      // if (this.selectRows.length > 0) {
      //   var keys = []
      //   this.selectRows.forEach(row => {
      //     keys.push(row.bsePlatformSkuId)
      //   })
      //   par += '&bsePlatformSkuIds=' + keys.join(",")
      // } else {
      //   Object.keys(this.searchFormConfirm).forEach(key => {
      //     if (this.searchFormConfirm[key]) {
      //       par += '&' + key + '=' + this.searchFormConfirm[key]
      //     }
      //   })
      // }
      let page = {
        current: this.page.currentPage,
        size: this.page.pageSize
      }
      let res = await exportMsg({ ...page, ...this.searchFormConfirm })
      console.log(res)
      if (res.status == 200) {
        this.$notify({
          title: "成功",
          message: "正在导出（注意：最多可导出6W条数据）",
          type: "success",
          duration: 2000
        })
        downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
      }
    },
    //sku检索输入
    fetchSuggestions(queryString) {
      let queryParams = {
        isHideLoading: true,
        skuCode: queryString ? queryString.trim() : queryString,
        codes: "1000"
      }
      this.loadingSkuQuery = true
      getByLikeSkuCodeAndCreateAuditComplete(queryParams).then((response) => {
        this.loadingSkuQuery = false
        this.skuList = response.data.data
      })
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
      this.addOrUpdateForm.salesGroupId = skuInfo[0].salesGroupId
      this.addOrUpdateForm.salesGroupName = skuInfo[0].salesGroupName
    },
    visibleChange(result) {
      if (!result) {
        this.skuList = []
      }
    },
    //加载基础数据等...
    loadAll() {
      let queryParams = {
        funcState: "1",
        delFlag: "0"
      }
      getAllWarehouse(queryParams).then((response) => {
        let data = response.data.data
        if (data && data.length > 0) {
          this.warehouseOption = data
        }
        console.log(this.warehouseOption)
      })
    },
    showOperateLog(id) {
      this.$refs.operationlog.showOperateLogDialog(id, 5)
    },
    //查看店铺信息
    showbaseStore(row) {
      if (!row) {
        this.$message("数据不存在")
        return
      }
      this.storeList = []
      var param = {
        bsePlatformSkuId: row.bsePlatformSkuId
      }
      getStoreInfoByPSkuId(param).then((res) => {
        this.storeList = res.data.data
      })
      this.storeModal = true
    }
  }
}
</script>

<style lang="scss">
#overseaStock {
  .add_dialog .el-form-item__label {
    width: 124px;
  }
}
</style>
