<template>
  <div id="firstlegCost">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="firstlegcostOption"
        @on-load="onload"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="costTypeStatus = true" size="small">添加</el-button>
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item prop="tmsLogisticsCostTypeName">
              <el-input
                v-model="searchForm.tmsLogisticsCostTypeName"
                v-search-input
                size="small"
                placeholder="类型姓名"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="tmsLogisticsCostTypeIsShare">
              <el-select v-model="searchForm.tmsLogisticsCostTypeIsShare" size="small" placeholder="是否分摊" clearable>
                <el-option v-for="item in shareType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="searchForm.status" size="small" placeholder="状态" clearable>
                <el-option v-for="item in costType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="tmsLogisticsCostTypeIsShare">
          <span>{{ scope.row.tmsLogisticsCostTypeIsShare === 1 ? "分摊" : "不分摊" }}</span>
        </template>
        <template slot-scope="scope" slot="brandSolt">
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
        </template>
      </avue-crud>
    </basic-container>

    <!-- 新增、编辑弹窗 -->
    <el-dialog
      :title="!submitForm.id ? '添加费用类型' : '编辑费用类型'"
      :visible.sync="costTypeStatus"
      width="25%"
      @close="costTypeCancel"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="submitForm" ref="submitForm" :inline="true" label-width="100px" :rules="rules">
        <el-form-item label="类型编码" prop="tmsLogisticsCostTypeCode" style="margin-bottom: 14px">
          <el-input
            v-model="submitForm.tmsLogisticsCostTypeCode"
            :disabled="submitForm.id !== ''"
            v-search-input
            size="small"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="类型名称" prop="tmsLogisticsCostTypeName" style="margin-bottom: 14px">
          <el-input
            v-model="submitForm.tmsLogisticsCostTypeName"
            v-search-input
            size="small"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态" style="margin-bottom: 14px">
          <el-select v-model="submitForm.status" size="small" placeholder="请选择" clearable>
            <el-option v-for="item in costType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="tmsLogisticsCostTypeIsShare" label="是否分摊" style="margin-bottom: 14px">
          <el-switch v-model="submitForm.tmsLogisticsCostTypeIsShare" active-text="是" inactive-text="否"> </el-switch>
        </el-form-item>
        <el-form-item
          v-if="submitForm.tmsLogisticsCostTypeIsShare"
          prop="tmsLogisticsCostTypeShareRule"
          label="分摊规则"
          style="margin-bottom: 14px"
        >
          <el-select v-model="submitForm.tmsLogisticsCostTypeShareRule" size="small" placeholder="请选择" clearable>
            <el-option v-for="item in shareRule" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="costTypeCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="costTypeConfirm">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { costTypeList, addCostType, updateCostType } from "@/api/financialStatements/index"
import { firstlegcostOption } from "@/const/crud/financialStatements/index"
import { getAll } from "@/api/baseSetup/bsecorporation"
import { getObjByType } from "@/api/admin/dict"

import { preventShake } from "@/util/tool"
import { getUrlConcatToken, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

export default {
  name: "bsecurrency",
  data() {
    return {
      searchForm: {
        tmsLogisticsCostTypeName: "",
        tmsLogisticsCostTypeIsShare: "",
        status: ""
      },
      searchFormConfirm: [],
      searchFormOperator: [
        // { key: 'tmsLogisticsCostTypeName', operator: 'like' }
      ],
      tableData: [],
      firstlegcostOption: firstlegcostOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      selectRows: [],

      shareRule: [],
      shareType: [],
      costType: [],
      costTypeStatus: false,
      submitForm: {
        id: "",
        tmsLogisticsCostTypeCode: "",
        tmsLogisticsCostTypeName: "",
        status: "",
        tmsLogisticsCostTypeIsShare: true,
        tmsLogisticsCostTypeShareRule: ""
      },
      rules: {
        tmsLogisticsCostTypeCode: [{ required: true, message: "类型编码不能为空", trigger: "blur" }],
        tmsLogisticsCostTypeName: [{ required: true, message: "类型名称不能为空", trigger: "blur" }],
        tmsLogisticsCostTypeIsShare: [{ required: true, message: "是否分摊不能为空", trigger: "blur" }],
        tmsLogisticsCostTypeShareRule: [{ required: true, message: "分摊规则不能为空", trigger: "blur" }]
      }
    }
  },
  components: {},
  created() {
    this.dataInit()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    // 数据初始化
    dataInit() {
      getAll().then((res) => {
        if (res.data.code === 0) {
          this.corporationArr = res.data.data
        }
      })
      getObjByType("share_rule").then((res) => {
        this.shareRule = res.data.data
      })
      getObjByType("share_type").then((res) => {
        this.shareType = res.data.data
      })
      getObjByType("tms_logistics_cost_type").then((res) => {
        this.costType = res.data.data
      })
      console.log(1111, this.submitForm)
    },

    edit(row) {
      this.submitForm = deepClone(row)
      this.submitForm.tmsLogisticsCostTypeIsShare = this.submitForm.tmsLogisticsCostTypeIsShare === 1 ? true : false
      this.costTypeStatus = true
      console.log(1111, this.submitForm)
    },

    costTypeConfirm() {
      this.$refs["submitForm"].validate((valid) => {
        if (valid) {
          let params = deepClone(this.submitForm)
          params.tmsLogisticsCostTypeIsShare = params.tmsLogisticsCostTypeIsShare ? 1 : 0
          if (params.tmsLogisticsCostTypeIsShare === 0) {
            params.tmsLogisticsCostTypeShareRule = ""
          }
          if (params.id) {
            updateCostType(params).then((res) => {
              if (res.data.code === 0) {
                this.$message.success("修改成功")
                this.costTypeCancel()
                this.getList()
              }
            })
          } else {
            addCostType(params).then((res) => {
              if (res.data.code === 0) {
                this.$message.success("添加成功")
                this.costTypeCancel()
                this.getList()
              }
            })
          }
        }
      })
    },
    costTypeCancel() {
      this.$refs["submitForm"].resetFields()
      ;(this.submitForm = {
        id: "",
        tmsLogisticsCostTypeCode: "",
        tmsLogisticsCostTypeName: "",
        status: "",
        tmsLogisticsCostTypeIsShare: true,
        tmsLogisticsCostTypeShareRule: ""
      }),
        (this.costTypeStatus = false)
    },

    // 刷新回调
    refreshChange() {
      this.getList(this.page)
    },
    // 处理搜索条件
    transformSearchForm() {
      let result = []
      for (let key in this.searchForm) {
        let value = this.searchForm[key]
        if (typeof value === "string" && value) {
          value = value.split(",")
        }
        if (typeof value === "number") {
          value = String(value).split(",")
        }
        if (value && value.length) {
          result.push({
            field: key,
            value: value
          })
        }
      }
      for (let i = 0; i < this.searchFormOperator.length; i++) {
        result.forEach((item) => {
          if (this.searchFormOperator[i].key === item.field) {
            item.operator = this.searchFormOperator[i].operator
          }
        })
      }
      return result
    },
    // 搜索回调
    searchChange() {
      this.page.currentPage = 1
      this.searchFormConfirm = this.transformSearchForm()
      this.getList()
    },
    searchReset() {
      this.searchForm = {}
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
      this.$refs.crud.toggleSelection()
    },
    onload(val) {
      this.page.currentPage = val.currentPage
      this.page.pageSize = val.pageSize
      this.getList()
    },
    getList() {
      costTypeList(
        Object.assign({
          page: this.page.currentPage,
          pageSize: this.page.pageSize,
          filtering: this.searchFormConfirm
        })
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    }
  }
}
</script>

<style lang="scss">
#receiptReturn > .basic-container > .el-card > .el-card__body {
  padding: 5px 20px;
}
</style>
