<template>
  <div id="maintainInternalTransactionCost">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        :tableLoading="tableLoading"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        @current-change="currentChange"
        class="handle-cell-hidden"
      >
        <template slot="menuLeft">
          <el-button type="primary" size="small" @click="editBatch">批量编辑</el-button>
        </template>

        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item class="form-label" label="" prop="month">
              <el-date-picker
                v-model="searchForm.month"
                type="month"
                placeholder="执行月份"
                value-format="yyyy-MM"
                size="small"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="sku" label="">
              <el-input
                v-search-input
                clearable
                style="max-width: 500px"
                v-model="searchForm.sku"
                placeholder="SKU"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-form-item prop="isExistPrice" label="有无价格">
              <el-radio-group v-model="searchForm.isExistPrice">
                <el-radio :label="2">全部</el-radio>
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>
      </avue-crud>

      <el-dialog title="批量编辑成本" :visible="visible" width="80%" @close="handleCancel">
        <div class="edit-cost">
          <el-form :model="formModel" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-table
              :data="formModel.editTableData"
              stripe
              border
              max-height="500"
              :header-cell-style="{
                color: '#2c2f2f',
                backgroundColor: '#f7f8fb',
                fontSize: '12px'
              }"
              style="width: 100%"
            >
              <el-table-column type="index" label="序号" width="50"> </el-table-column>
              <el-table-column prop="month" label="执行月份"> </el-table-column>
              <el-table-column prop="sku" label="SKU"> </el-table-column>
              <el-table-column prop="cost" label="成本单价（USD）">
                <template slot-scope="scope">
                  <el-form-item
                    style="padding: 10px 0"
                    label-width="0px"
                    :prop="`editTableData.${scope.$index}.cost`"
                    :rules="rules.cost"
                  >
                    <el-input
                      v-model="scope.row.cost"
                      placeholder="请输入"
                      @change="costChange($event, scope.row)"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>

        <span slot="footer" class="dialog-footer" style="display: flex; justify-content: center">
          <el-button style="padding: 9px 30px" size="small" @click="handleCancel">关 闭</el-button>
          <el-button style="padding: 9px 30px" size="small" type="primary" @click="handleSubmit">提 交</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { tableOption, editTableOption } from "./index"
import { mapGetters } from "vuex"
import { listPage, edit } from "@/api/purchase/maintainInternalTransactionCost"

export default {
  name: "maintainInternalTransactionCost",
  data() {
    return {
      selectRows: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        sku: "",
        month: "",
        isExistPrice: 2
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableOption: tableOption,
      visible: false,
      formModel: {
        editTableData: []
      },
      editTableOption: editTableOption,
      rules: {
        cost: [
          { required: true, message: "必填项", trigger: "blur" },
          { validator: this.validateFloat, message: "只能输入非负数", trigger: "blur" },
          { validator: this.validateFloatTen, message: "限制10位整数", trigger: "blur" },
          { validator: this.validateFloatFourDigit, message: "最多保留2位小数", trigger: "blur" }
        ]
      },
      tableLoading: false
    }
  },
  created() {
    this.searchForm.month = this.getLastMonth()
    this.getList()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {},
  methods: {
    async editBatch() {
      if (this.selectRows.length == 0) {
        this.$message({
          message: "请勾选需要操作的数据",
          type: "warning"
        })
        return
      }
      const flag = this.selectRows.every((item) => {
        return item.month !== this.getLastMonth()
      })
      console.log("flag", flag)
      if (flag) {
        this.$message({
          message: "仅支持编辑上月的成本",
          type: "warning"
        })

        return
      }
      this.visible = true

      this.formModel.editTableData = this.selectRows.map(({ month, sku, cost }) => ({
        month,
        sku,
        cost
      }))
      this.formModel.editTableData.forEach((ele) => {
        this.$set(ele, "cost", ele.cost)
      })
    },
    getLastMonth() {
      const date = new Date()
      date.setMonth(date.getMonth() - 1)

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0") // getMonth() 返回 0-11 之间的值

      return `${year}-${month}`
    },
    selectionChange(selected) {
      this.selectRows = selected
    },
    async getList() {
      const postData = JSON.parse(JSON.stringify(this.searchForm))
      if (postData.isExistPrice == 2) {
        delete postData.isExistPrice
      }
      const { data } = await listPage({
        ...postData,
        page: this.page.currentPage,
        pageSize: this.page.pageSize
      })
      if (data.code == 0) {
        this.tableData = data.data.records
        this.page.total = data.data.total
        this.page.currentPage = data.data.page
      }
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList()
    },
    /**
     * 搜索回调
     */
    searchChange() {
      this.page.currentPage = 1
      this.getList()
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    handleCancel() {
      this.visible = false
      this.$refs.ruleForm.resetFields()
    },

    costChange(val, row) {
      // this.$set(row, "cost", Number(val))
      console.log("row", row)
    },
    validateFloatTen(rule, value, callback) {
      // 正则表达式匹配最多10位整数，可选的小数部分
      var reg = /^(?:\d{1,10})(\.\d+)?$/

      // 验证输入是否符合正则表达式
      if (reg.test(value)) {
        callback() // 验证通过
      } else {
        // 如果输入的整数部分超过10位或者输入的是非数字字符，则验证失败
        callback(new Error("整数部分不能超过10位"))
      }
    },
    /**是否非负数 */
    validateFloat(rule, value, callback) {
      var reg = /^\d+(\.\d+)?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("只能输入非负数"))
      }
    },
    /**最多保留两位小数 */
    validateFloatFourDigit(rule, value, callback) {
      var reg = /^\d+(\.\d{1,2})?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("最多保留2位小数"))
      }
    },
    async handleSubmit() {
      const flag = await this.$refs.ruleForm.validate()
      console.log(flag)
      const { data } = await edit({
        cmdDto: this.formModel.editTableData
      })

      if (data.code === 0) {
        this.$message.success("提交成功")
        this.handleCancel()
        this.clearSelectClear()
        this.page.currentPage = data.data.page
        this.getList()
      }
    },
    clearSelectClear() {
      this.$refs.crud.selectClear()
    }
  }
}
</script>

<style lang="scss">
#maintainInternalTransactionCost {
  .edit-cost {
    .avue-crud__menu {
      min-height: 0px !important;
    }
    .el-form-item__error {
      bottom: -12px !important;
    }
  }
}
</style>
