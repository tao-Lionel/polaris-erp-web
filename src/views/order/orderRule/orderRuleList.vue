<template>
  <div class="execution" id="bsecurrency">
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
          <el-button type="primary" v-if="permissions.oms_order_rule_add" size="small" @click="openToDetail"
            >新增规则</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.oms_order_rule_disable"
            :disabled="!selectRows.length"
            size="small"
            @click="prohibt(1)"
            >启用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.oms_order_rule_disable"
            :disabled="!selectRows.length"
            size="small"
            @click="prohibt(2)"
            >禁用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.oms_order_rule_delete"
            :disabled="!selectRows.length"
            size="small"
            @click="deleteRule"
            >删除</el-button
          >
          <el-button
            type="primary"
            size="small"
            :disabled="this.selectRows.length === 0"
            v-if="permissions.oms_order_rule_batch_edit"
            @click="batchEdit"
            >批量编辑</el-button
          >
          <!-- <el-button type="primary" v-if="permissions.baseSetup_bsecurrency_export" @click="exportDataRule()"
            size="small">导出数据</el-button> -->
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item prop="ruleName">
              <el-input
                v-model="searchForm.ruleName"
                placeholder="规则名称"
                clearable
                v-search-input
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="searchForm.ruleStatus" size="small" placeholder="启用/禁用" clearable>
                <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="searchForm.scene" size="small" placeholder="规则类型" clearable>
                <el-option v-for="item in ruleType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="priority" slot-scope="scope">
          <el-input
            v-model="scope.row.priority"
            placeholder="请输入优先级"
            @change="changePriority(scope.row)"
          ></el-input>
        </template>
        <template slot="ruleName" slot-scope="scope">
          <router-link
            class="el-row-text"
            :to="{
              path: '/order/orderRules/detail',
              query: { disabled: true, id: scope.row.id, scene: scope.row.scene }
            }"
            >{{ scope.row.ruleName }}</router-link
          >
        </template>
        <template slot-scope="scope" slot="ruleStatus">
          <el-tag :type="scope.row.ruleStatus === 1 ? 'success' : 'danger'">{{
            scope.row.ruleStatus === 1 ? "启用" : "禁用"
          }}</el-tag>
        </template>

        <template slot-scope="scope" slot="brandSolt">
          <a class="brandSolt_ope" v-if="permissions.oms_order_rule_modify" @click="openToDetail(scope.row)">编辑</a>
          <el-dropdown trigger="click" v-if="permissions.oms_order_rule_operate" @command="prohibtOrdelete">
            <a class="brandSolt_ope">操作</a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{ title: 'PROHIBT', id: scope.row.id, status: scope.row.ruleStatus }">{{
                scope.row.ruleStatus === 1 ? "禁用" : "启用"
              }}</el-dropdown-item>
              <el-dropdown-item :command="{ title: 'DELETE', id: scope.row.id }" style="color: red"
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {
  getQueryOrderRule,
  updateDelStatusById,
  updateRuleStatusById,
  updatePriority,
  getObjByType
} from "@/api/order/orderRule"
import { tableOption } from "@/const/crud/order/orderRule/orderRule"
// import { preventShake } from "@/util/tool"
import { getUrlConcatToken, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { map } from "lodash"
import { edit } from "@/api/purchase/maintainInternalTransactionCost/index"
export default {
  name: "orderRuleList",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        ruleStatus: "",
        ruleName: "",
        scene: ""
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
      status: [
        { label: "禁用", value: 2 },
        { label: "启用", value: 1 }
      ],
      ruleType: [],
      idsGroup: ""
    }
  },
  components: {},
  created() {
    // 获取规则类型
    getObjByType("rule_scene").then((res) => {
      if (res.data.code === 0) {
        let ruleType = []
        res.data.data.forEach((item) => {
          if (
            item.value !== "ORDER_ISSUANCE" &&
            item.value !== "REVIEW_ORDER" &&
            item.value !== "CONFIGURATION_ADDRESS"
          ) {
            ruleType.push(item)
          }
        })
        this.ruleType = ruleType
      }
    })
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    openToDetail(obj) {
      const path = obj.id ? `/order/orderRules/detail?id=${obj.id}&scene=${obj.scene}` : `/order/orderRules/detail`
      this.$router.push({ path })
    },
    // 删除数据
    async deleteRule(id) {
      try {
        const data = await this.$confirm("您确定删除这条数据吗", "删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        const param = typeof id === "number" ? [id] : this.selectRows.map((item) => item.id)
        const res = await updateDelStatusById(param)
        if (res.data.code === 0) {
          this.selectRows = []
          this.$refs.crud.selectClear()
          this.refreshChange()
          this.$message.success("删除成功")
        }
      } catch (err) {
        console.log("取消", err)
      }
    },
    // 禁用
    async prohibt(status, id) {
      try {
        const data = await this.$confirm(
          `您确认${status === 1 ? "启用" : "禁用"}吗？`,
          `${status === 1 ? "启用" : "禁用"}确认`,
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
        const param = {}
        let ids = ""
        if (typeof id === "number") {
          ids = [id]
          param.ruleStatus = status === 1 ? 2 : 1
        } else {
          ids = this.selectRows.map((item) => item.id)
          param.ruleStatus = status === 1 ? 1 : 2
        }
        param.ids = ids
        const res = await updateRuleStatusById(param)
        if (res.data.code === 0) {
          this.selectRows = []
          this.$refs.crud.selectClear()
          this.refreshChange()
          this.$message.success(param.ruleStatus === 1 ? "启用成功" : "禁用成功")
        }
      } catch (err) {}
    },
    prohibtOrdelete(obj) {
      obj.title === "DELETE" ? this.deleteRule(obj.id) : this.prohibt(obj.status, obj.id)
    },
    // 优先级改变
    async changePriority(obj) {
      let param = {
        id: obj.id,
        priority: obj.priority
      }
      let res = await updatePriority(param)
      if (res.data.code === 0) {
        this.refreshChange()
        this.$message.success("优先级修改成功")
      }
    },
    // 导出数据
    async exportDataRule() {
      let res = await exportData(this.searchFormConfirm)
        .then((res) => {
          downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
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
      console.log(params, page)
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      page = page || { currentPage: 1 }
      Object.assign(this.searchFormConfirm, params)
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
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
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    getList(page, params) {
      // this.page.currentPage=page.currentPage;
      getQueryOrderRule(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
            scene: "ALL"
          },
          params,
          this.searchFormConfirm
        )
      ).then((res) => {
        this.tableData = res.data.data ? res.data.data.records : []
        this.page.total = res.data.data ? res.data.data.total : 0
      })
    },
    /**导出 */
    handleExport() {
      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.currency)
        })
        par += "&selectCurrencyList=" + keys
      } else {
        Object.keys(this.searchFormConfirm).forEach((key) => {
          if (this.searchFormConfirm[key]) {
            par += "&" + key + "=" + this.searchFormConfirm[key]
          }
        })
      }
      this.$notify({
        title: "成功",
        message: "正在导出（注意：最多可导出6W条数据）",
        type: "success",
        duration: 2000
      })
      window.location = getUrlConcatToken(`/api/baseSetup/bsecurrency/handleExport`) + par
    },
    batchEdit() {
      console.log("批量； 编辑")
      console.log(this.selectRows.map((item) => item.id))
      if (this.selectRows.length === 0) return
      this.idsGroup = this.selectRows.map((item) => item.id).join(",")

      localStorage.setItem(
        "batchEditArray",
        JSON.stringify(
          this.selectRows.map((item) => {
            return {
              id: item.id,
              scene: item.scene
            }
          })
        )
      )
      this.$router.push({
        path: `/order/orderRules/detail`,
        query: {
          idsGroup: this.idsGroup,
          editIndex: 0
        }
      })
    }
  }
}
</script>

<style lang="scss">
#bsecurrency {
  .el-textarea__inner {
    height: 90px;
  }

  .mydialog-add .el-form-item__label {
    width: 124px;
  }

  .brandSolt_ope {
    margin-right: 15px;
    text-decoration: none;

    &:hover {
      color: #66b1ff;
    }
  }
}
</style>
