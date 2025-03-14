<template>
  <el-dialog :title="isEdit ? '编辑' : '新增'" :visible.sync="showDialog">
    <div>
      <el-form ref="form" :model="form">
        <div style="color: red; margin: 10px 0">注意：安全库存天数，必须大于7天</div>
        <avue-crud ref="crud" :data="form.tableData" :option="tableOptions">
          <template slot="skuCode" slot-scope="{ row }">
            <el-form-item :prop="`tableData.${row.$index}.skuCode`" label="" :rules="rules.skuCode">
              <el-select
                v-model="row.skuCode"
                popper-class="y-form-select"
                filterable
                remote
                placement="top"
                size="small"
                reserve-keyword
                placeholder="请输入标准SKU"
                :loading="loadingSkuQuery"
                :remote-method="fetchSuggestions"
              >
                <el-option
                  v-for="item in skuCodeList"
                  :key="item.skuId"
                  :label="item.skuCode"
                  :value="item.skuCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>

          <template slot="safeDayNum" slot-scope="{ row }">
            <el-form-item :prop="`tableData.${row.$index}.safeDayNum`" label="" :rules="rules.safeDayNum">
              <el-input-number
                v-model="row.safeDayNum"
                size="small"
                placeholder="请输入安全库存天数"
                :controls="false"
                :precision="0"
              ></el-input-number>
            </el-form-item>
          </template>

          <template v-if="!isEdit" slot="operate" slot-scope="{ row }">
            <div>
              <el-button
                v-if="row.$index === form.tableData.length - 1"
                type="text"
                style="padding: 10px 0"
                @click="addCost(row)"
              >
                添加
              </el-button>
              <el-button
                v-show="row.$index !== form.tableData.length - 1"
                type="text"
                style="padding: 10px 0"
                @click="deleteCost(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </avue-crud>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveSafetyStockApi } from "@/api/warehouse/safetyStock"
import { getByLikeSkuCode } from "@/api/product/prdsku"

export default {
  name: "safetyStockAddDialog",
  components: {},
  data() {
    return {
      rules: {
        skuCode: { required: true, message: "请输入标准SKU", trigger: "blur" },
        safeDayNum: { required: true, message: "请输入安全库存天数", trigger: "blur" }
      },
      showDialog: false,
      form: {
        tableData: []
      },
      tableOptions: {
        border: true,
        menu: false,
        cancelFixedTop: true,
        header: false,
        fixed: false,
        searchShow: false, //搜索栏开关
        searchAdvanced: false, //高级搜索栏开关，默认关闭
        index: false,
        indexLabel: "序号",
        selection: false,
        stripe: true,
        align: "center",
        editBtn: false,
        delBtn: false,
        addBtn: false,
        searchLabelPosition: "right",
        dic: [],
        column: [
          { label: "标准SKU", prop: "skuCode", sortable: false, solt: true, copy: false, required: true },
          { label: "安全库存天数", prop: "safeDayNum", sortable: false, solt: true, copy: false, required: true },
          { label: "操作", sortable: false, prop: "operate", solt: true, width: "120px", copy: false }
        ]
      },
      row: {},
      skuCodeList: [],
      loadingSkuQuery: false,
      isEdit: false
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog(row) {
      if (row) {
        this.isEdit = true
      } else {
        this.isEdit = false
      }
      this.row = row
      this.skuCodeList = []
      if (row) {
        this.form = {
          tableData: [
            {
              skuCode: row.skuCode,
              safeDayNum: row.safeDayNum
            }
          ]
        }
      } else {
        this.form = {
          tableData: [
            {
              skuCode: "",
              safeDayNum: undefined
            }
          ]
        }
      }
      this.showDialog = true
    },
    // 添加
    addCost(row) {
      this.form.tableData.push({
        skuCode: "",
        safeDayNum: undefined
      })
    },
    // 删除
    deleteCost(row) {
      if (this.form.tableData.length === 1) {
        this.$message.warning("至少保留一条数据")
        return
      }
      this.form.tableData.splice(row.$index, 1)
    },
    // 模糊搜索,请求数据
    async fetchSuggestions(queryString) {
      let queryParams = {
        skuCode: queryString.trim()
      }
      this.loadingSkuQuery = true
      const { data } = await getByLikeSkuCode(queryParams)
      if (data.code === 0) {
        this.skuCodeList = data.data
      }
      this.loadingSkuQuery = false
    },
    // 提交
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log("this.form", this.form)
          const params = this.form.tableData.map((item) => {
            return {
              safeDayNum: item.safeDayNum,
              skuCode: item.skuCode
            }
          })

          for (let item of params) {
            if (item.safeDayNum < 8) {
              this.$message.warning("安全库存天数，必须大于7天")
              return
            }
          }

          const { data } = await saveSafetyStockApi(params)
          if (data.data && data.data.length) {
            this.$message.warning(`SKU：${data.data.join(",")} 不存在`)
          } else {
            this.$message.success("操作成功")
          }
          this.$emit("updateList")
          this.showDialog = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
