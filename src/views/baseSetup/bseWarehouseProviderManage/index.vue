<template>
  <div class="execution" id="bseWarehouseProviderManage">
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
          <el-button type="primary" size="small" @click="handleAdd" v-if="permissions.providerManage_add"
            >新 增</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="handleBatchEnableOrDisable(false)"
            v-if="permissions.providerManage_enable"
            >批量启用</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="handleBatchEnableOrDisable(true)"
            v-if="permissions.providerManage_disenable"
            >批量禁用</el-button
          >
          <export-btn
            v-if="permissions.providerManage_export"
            pageName="仓库服务商管理"
            pageUrl="/bseCarrierBoxCarTypeInfo/listPage"
            moduleName="baseSetup"
            :columns="tableOption.column"
            :pageReq="{ filtering: exportFiltering }"
          ></export-btn>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="carrierCode">
              <el-input
                v-model="searchForm.carrierCode"
                size="small"
                placeholder="仓库服务商编码,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="carrierName">
              <el-input
                v-model="searchForm.carrierName"
                size="small"
                placeholder="仓库服务商名称,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="">
              <el-select v-model="searchForm.boxCarType" size="small" clearable filterable placeholder="适用箱型">
                <el-option v-for="item in boxCarTypeList" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="disabled">
              <el-select v-model="searchForm.disabled" size="small" clearable filterable placeholder="状态">
                <el-option
                  v-for="item in disabledTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="{ row }" slot="boxCarType">{{ getNameByCode(boxCarTypeList, row.boxCarType) }} </template>
        <template slot-scope="{ row }" slot="btnGroup">
          <a style="margin-left: 10px" @click="handleEdit(row)" v-if="permissions.providerManage_edit"> 编辑 </a>
        </template>
      </avue-crud>

      <!--新增/编辑-->
      <div>
        <el-dialog
          class="add_dialog"
          :title="handleAddOrUpdateTile"
          :visible.sync="addOrUpdateDialog"
          width="30%"
          @close="formReset"
          center
        >
          <el-form ref="addOrUpdateForm" :model="addOrUpdateForm" :rules="addOrUpdateRules" size="small" status-icon>
            <el-form-item label="仓库服务商编码" label-width="160px" prop="carrierCode">
              <el-input
                v-model="addOrUpdateForm.carrierCode"
                size="small"
                maxlength="50"
                :disabled="dialogType == 'edit'"
                @blur="inputBlur"
                v-search-input-trim
              ></el-input>
            </el-form-item>
            <el-form-item label="仓库服务商名称" label-width="160px" prop="carrierName">
              <el-input
                v-model="addOrUpdateForm.carrierName"
                size="small"
                maxlength="50"
                @blur="inputBlur"
                v-search-input-trim
              ></el-input>
            </el-form-item>

            <el-form-item label="适用箱型/车型" label-width="160px" prop="boxCarType">
              <el-select
                v-model="addOrUpdateForm.boxCarType"
                size="small"
                clearable
                multiple
                filterable
                placeholder=""
                @change="boxCarTypeChange"
                :disabled="dialogType == 'edit'"
              >
                <el-option v-for="item in boxCarTypeList" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否海外" label-width="160px" prop="isOverseas">
              <el-select v-model="addOrUpdateForm.isOverseas" size="small" clearable filterable placeholder="是否海外">
                <el-option label="是" value="1"> </el-option>
                <el-option label="否" value="0"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" label-width="160px" prop="disabled">
              <el-select v-model="addOrUpdateForm.disabled" size="small" clearable filterable placeholder="状态">
                <el-option
                  v-for="item in disabledTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="addOrUpdateDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitForm('addOrUpdateForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { tableOption, addOrUpdateRules } from "./index.js"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { listPage, disabledByIds, enabledByIds, add, update } from "@/api/baseSetup/bseWarehouseProviderManage.js"
import { setFiltering, setOrderBy } from "@/util/auth"
import { listPage as boxCarListPage } from "@/api/logistics/boxCarManage/index.js"

export default {
  name: "bseWarehouseProviderManage",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        carrierCode: "",
        carrierName: "",
        boxCarType: "",
        disabled: "",
        isOverseas: ""
      },
      operatorParams: {
        carrierCode: "IN"
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
      //新增 修改相关
      handleAddOrUpdateTile: "新增",
      dialogType: "add",
      addOrUpdateDialog: false,
      addOrUpdateRules: addOrUpdateRules,
      addOrUpdateForm: {
        disabled: "",
        carrierCode: "",
        carrierName: "",
        boxCarType: [],
        boxCarTypeName: []
      },
      //审核状态
      disabledTypeOptions: [
        { value: true, label: "禁用" },
        { value: false, label: "启用" }
      ],

      auditDialog: false,
      auditType: "1",
      auditTextarea: null,
      setPlatTransportDialog: false,

      salesSiteOptions: [],
      transportCarrierId: null,
      setWareTransportDialog: false,

      overseaCarrierOption: [],
      orderBy: [
        {
          field: "updateTime",
          order: "desc"
        }
      ],
      boxCarTypeList: []
    }
  },
  components: {},
  created() {
    this.init()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"]),
    exportFiltering() {
      return setFiltering(
        {
          ...this.searchForm
        },
        this.operatorParams
      )
    }
  },
  methods: {
    init() {
      this.getBoxCarList()
    },
    getBoxCarList() {
      boxCarListPage({
        page: 1,
        pageSize: 9999
      }).then(({ data }) => {
        if (data.code == 0) {
          // this.boxCarTypeList = data.data.records
          this.boxCarTypeList = data.data.records.filter(
            (record, index, self) => self.findIndex((r) => r.code === record.code) === index
          )
        }
      })
    },

    //根据所选平台,获取对应站点
    getSite(val) {
      console.log("val", val)
      // this.salesSiteOption = []
      return getSitInfoByPlatformId({ platformTypeId: val })
        .then((res) => {
          if (res.data.code === 0) {
            let options = []
            res.data.data.forEach((item) => {
              options.push({
                value: item.bsePlatformSitId,
                label: item.sitEnName
              })
            })
            return options
          }
        })
        .catch((err) => {
          this.$message.error(err)
          return []
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
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      page = page || { currentPage: 1 }
      this.getList(page, params)
    },
    searchReset() {
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    sizeChange(val) {
      this.page.pageSize = val
    },
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      this.$refs.crud.toggleSelection()
    },
    getList(page, params) {
      listPage(
        Object.assign(
          {
            page: page?.currentPage || 1,
            pageSize: page?.pageSize || 20
          },
          // params,
          // this.searchFormConfirm,
          {
            filtering: setFiltering(
              {
                ...this.searchForm
              },
              this.operatorParams
            ),
            orderBy: setOrderBy(null, this.orderBy)
          }
        )
      ).then((response) => {
        this.tableData = response.data.data.records.map((item) => {
          return {
            ...item,
            disabledStr: item.disabled == true ? "禁用" : "正常"
          }
        })
        this.page.total = response.data.data.total
      })
    },

    /** 打开新增窗口**/
    handleAdd() {
      this.handleAddOrUpdateTile = "新增"
      this.dialogType = "add"
      this.addOrUpdateDialog = true
    },
    handleEdit(row) {
      this.handleAddOrUpdateTile = "编辑"
      this.dialogType = "edit"
      this.addOrUpdateDialog = true
      this.addOrUpdateForm.id = row.id
      const { id, carrierCode, carrierName, boxCarType, disabled, isOverseas } = row
      this.addOrUpdateForm = { id, carrierCode, carrierName, boxCarType: boxCarType.split(","), disabled, isOverseas }
    },
    handleBatchEnableOrDisable(disabled) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      const title = disabled ? "批量禁用" : "批量启用"
      const actionText = disabled ? "禁用" : "启用"
      const h = this.$createElement
      this.$msgbox({
        title: title,
        message: h("p", null, [
          h("span", null, "您勾选了 "),
          h("span", { style: "color: red" }, this.selectRows.length),
          h("span", null, ` 条数据，确定批量${actionText}仓库服务商吗？`)
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then((action) => {
        this.BatchEnableOrDisable(disabled)
      })
    },
    BatchEnableOrDisable(disabled) {
      const API = disabled ? disabledByIds : enabledByIds
      API({
        ids: this.selectRows.map((item) => item.id)
      }).then(({ data }) => {
        console.log("data", data)
        if (data.code == 0) {
          this.$message.success(disabled ? "禁用成功" : "启用成功")
          this.getList(this.page)
        }
      })
    },

    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.handleAddOrUpdateTile == "新增") {
            const { data } = await add(this.addOrUpdateForm)
            if (data.code == 0) {
              this.$message.success("新增成功")
              this.addOrUpdateDialog = false
              this.getList()
            }
          } else {
            const { data } = await update(this.addOrUpdateForm)
            if (data.code == 0) {
              this.$message.success("编辑成功")
              this.addOrUpdateDialog = false
              this.getList()
            }
          }
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
          disabled: "",
          carrierCode: "",
          carrierName: "",
          boxCarType: [],
          boxCarTypeName: []
        }
      })
    },
    boxCarTypeChange(val) {
      this.addOrUpdateForm.boxCarTypeName = this.boxCarTypeList
        .filter((item) => val.includes(item.code))
        .map((item) => item.name)
    },
    getNameByCode(data, code) {
      return data.find((item) => item.code === code)?.name || ""
    }
  }
}
</script>

<style lang="scss">
#bseWarehouseProviderManage {
  .add_dialog .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
