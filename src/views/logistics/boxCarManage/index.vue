<template>
  <div class="execution" id="boxCarManage">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" size="small" v-if="permissions.logistics_boxCarManage_add" @click="handleAdd"
            >新 增</el-button
          >
          <el-button
            type="primary"
            size="small"
            v-if="permissions.logistics_boxCarManage_batch_enabled"
            @click="handleBeforeBatchConfirm(false)"
            >批量启用</el-button
          >
          <el-button
            type="primary"
            size="small"
            v-if="permissions.logistics_boxCarManage_batch_disabled"
            @click="handleBeforeBatchConfirm(true)"
            >批量禁用</el-button
          >
          <export-btn
            v-if="permissions.logistics_boxCarManage_export"
            pageName="箱型车型管理"
            pageUrl="/boxCarManage/listPage"
            moduleName="warehouse"
            :columns="tableOption.column"
            :pageReq="{ filtering: exportFiltering }"
          ></export-btn>
        </template>

        <template slot="search">
          <el-form
            @submit.prevent.native="searchChange"
            :model="searchForm"
            :inline="true"
            ref="searchForm"
            style="float: left"
          >
            <el-form-item prop="boxCarType">
              <el-select v-model="searchForm.boxCarType" clearable size="small" placeholder="类型">
                <el-option
                  v-for="item in boxCarTypeList"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="name">
              <el-input v-model="searchForm.name" size="small" placeholder="名称" v-search-input clearable></el-input>
            </el-form-item>

            <el-form-item prop="disabled">
              <el-select v-model="searchForm.disabled" clearable size="small" placeholder="状态">
                <el-option label="启用" :value="0"></el-option>
                <el-option label="禁用" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>

        <template slot="applicationSite" slot-scope="scope">
          <span style="word-break: normal">{{ scope.row.applicationSite }}</span>
        </template>
        <!-- <template slot="disabled" slot-scope="scope">
          <span>{{ scope.row.disabled == 0 ? "启用" : "禁用" }}</span>
        </template>
        <template slot="boxCarType" slot-scope="scope">
          <span>{{ getBoxCarType(scope.row.boxCarType) }}</span>
        </template> -->

        <template slot="operation" slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            class="button-css"
            v-if="permissions.logistics_boxCarManage_edit"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
        </template>
      </avue-crud>

      <el-dialog :title="title" center width="30%" id="boxOrCarDialog" :visible.sync="dialogVisible">
        <div style="padding: 20px">
          <el-form ref="addOrUpdateForm" :inline="true" :rules="rules" :model="addForm" status-icon>
            <el-form-item label-width="150px" label="状态" prop="disabled">
              <el-select v-model="addForm.disabled" placeholder="请选择">
                <el-option label="启用" :value="0"></el-option>
                <el-option label="禁用" :value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="150px" label="类型" prop="boxCarType">
              <el-select v-model="addForm.boxCarType" placeholder="请选择" :disabled="submitType == 'edit'">
                <el-option
                  v-for="item in boxCarTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="150px" label="编码" prop="code">
              <el-input v-model="addForm.code" :disabled="submitType == 'edit'"></el-input>
            </el-form-item>
            <el-form-item label-width="150px" label="名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>

            <el-form-item label-width="150px" label="适用站点" prop="applicationSite">
              <el-select
                v-model="addForm.applicationSite"
                multiple
                clearable
                filterable
                placeholder="请选择"
                :disabled="submitType == 'edit'"
              >
                <el-option v-for="item in sit" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="150px" label="最大重量（kg）" prop="maxWeight">
              <el-input-number
                style="width: 100%"
                :controls="false"
                v-model="addForm.maxWeight"
                :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item label-width="150px" label="最大体积（m³）" prop="maxVolume">
              <el-input-number
                style="width: 100%"
                :controls="false"
                v-model="addForm.maxVolume"
                :min="0"
              ></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleCancel">取 消</el-button>
          <el-button size="small" type="primary" @click="addOrUpdateSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { listPage, disabledByIds, enabledByIds, add, update } from "@/api/logistics/boxCarManage/index.js"
import { tableOption } from "./index.js"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { mapGetters } from "vuex"
import { setFiltering } from "@/util/auth"
import { getObjByType } from "@/api/admin/dict.js"
import { getSitInfoEnName } from "@/api/baseSetup/bseplatformsit"

export default {
  name: "boxCarManage",
  data() {
    return {
      searchForm: {
        boxCarType: "",
        name: "",
        disabled: 0
      },
      operatorParams: {
        boxCarType: "LIKE",
        name: "LIKE"
      },

      selectList: [],
      auditTextarea: "",
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,

      dialogVisible: false,
      addForm: {
        name: "",
        code: "",
        maxWeight: undefined,
        maxVolume: undefined,
        applicationSite: "",
        disabled: 0,
        boxCarType: ""
      },
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "编码不能为空", trigger: "blur" }],
        applicationSite: [{ required: true, message: "适用站点不能为空", trigger: "blur" }],
        disabled: [{ required: true, message: "状态", trigger: "change" }],
        boxCarType: [{ required: true, message: "箱型类型不能为空", trigger: "blur" }]
      },
      sit: [],
      submitType: "add",
      title: "新增"
    }
  },
  components: {},
  created() {
    getObjByType("box_car_type_manage").then((res) => {
      if (res.data.code === 0) {
        this.boxCarTypeList = res.data.data
      }
    })
    this.getSitAll()
    this.getList()
  },
  mounted() {},
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
    handleEdit(row) {
      this.submitType = "edit"
      this.title = "编辑"

      const { id, name, maxWeight, maxVolume, applicationSite, disabled, boxCarType, code } = row
      this.addForm = {
        id,
        name,
        maxWeight,
        maxVolume,
        applicationSite: applicationSite.split(",").filter(Boolean),
        disabled,
        boxCarType,
        code
      }
      this.dialogVisible = true
    },
    handleCancel() {
      this.dialogVisible = false
      this.$refs.addOrUpdateForm.resetFields()
    },
    addOrUpdateSubmit() {
      this.$refs.addOrUpdateForm.validate((vaild) => {
        if (!vaild) return
        const actionApi = this.submitType === "add" ? add : update
        actionApi(this.addForm).then((res) => {
          if (res.data.code === 0) {
            this.submitType === "add" ? this.$message.success("新增成功") : this.$message.success("编辑成功")
            this.dialogVisible = false
            this.getList()
            this.$refs.addOrUpdateForm.resetFields()
          }
        })
      })
    },
    // 获取所有站点
    async getSitAll() {
      const { data } = await getSitInfoEnName()
      if (data.code === 0) {
        this.sit = data.data
      }
    },
    handleBeforeBatchConfirm(disabled) {
      if (!this.selectList || this.selectList.length == 0) {
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
          h("span", { style: "color: red" }, this.selectList.length),
          h("span", null, ` 条数据，确定批量${actionText}箱型/车型吗？`)
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then((action) => {
        disabled ? this.handleBatchDisabled() : this.handleBatchEnabled()
      })
    },
    handleBatchEnabled() {
      if (this.selectList.length === 0) {
        this.$message.warning("请选择要启用的数据")
        return
      }
      enabledByIds({ ids: this.selectList.map((item) => item.id) }).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("启用成功")
          this.getList()
        }
      })
    },
    handleBatchDisabled() {
      if (this.selectList.length === 0) {
        this.$message.warning("请选择要禁用的数据")
        return
      }
      disabledByIds({ ids: this.selectList.map((item) => item.id) }).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("禁用成功")
          this.getList()
        }
      })
    },
    refreshChange(params) {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, params)
    },
    searchChange(params, page) {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(page, params)
    },
    searchReset() {
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    sizeChange(val) {
      this.page.pageSize = val
    },
    currentChange(val) {
      console.log("v", val)
      this.page.currentPage = val
      this.getList()
    },
    async getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1,
          pageSize: this.page.pageSize
        }
      }

      page.currentPage = this.page.currentPage
      const { data } = await listPage(
        Object.assign(
          {
            page: page.currentPage,
            pageSize: page.pageSize
          },
          {
            filtering: setFiltering(
              {
                ...this.searchForm
              },
              this.operatorParams
            )
          }
        )
      )

      if (data.code == 0) {
        this.tableData = data.data.records
        this.page.total = data.data.total
      }
    },

    selectionChange(list) {
      this.selectList = list
    },

    handleAdd() {
      this.title = "新增"
      this.dialogVisible = true
      this.submitType = "add"
      this.addForm = {
        name: "",
        maxWeight: undefined,
        maxVolume: undefined,
        applicationSite: "",
        disabled: 0,
        boxCarType: ""
      }
    },
    getBoxCarType(value) {
      const item = this.boxCarTypeList.find((item) => item.value === value)
      return item ? item.label : ""
    }
  }
}
</script>

<style lang="scss" scoped>
#boxCarManage {
  .el-dialog__header {
    line-height: 30px;
  }
  .el-textarea__inner {
    height: 90px;
  }
  .el-dialog__footer {
    padding: 0px 20px 20px 20px;
    border-top: 0px;
    clear: both;
    background: #fff;
  }
}
</style>

<style lang="scss">
#boxOrCarDialog .el-input__inner {
  text-align: left !important;
}
</style>
