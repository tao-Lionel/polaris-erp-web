<template>
  <el-dialog :title="isEdit ? '编辑' : '新增'" :visible.sync="showDialog" width="80%">
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

          <template slot="platform" slot-scope="{ row }">
            <el-form-item :prop="`tableData.${row.$index}.platform`" label="" :rules="rules.platform">
              <el-select
                v-model="row.platform"
                filterable
                size="small"
                placeholder="请选择平台"
                @change="changePlatform($event, row)"
              >
                <el-option
                  v-for="item in platformList"
                  :key="item.platformTypeCode"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>

          <template slot="site" slot-scope="{ row }">
            <el-form-item :prop="`tableData.${row.$index}.site`" label="" :rules="rules.site">
              <el-select v-model="row.site" filterable size="small" placeholder="请选择站点" :disabled="!row.platform">
                <el-option
                  v-for="item in row.siteList"
                  :key="item.sitEnName"
                  :label="item.sitEnName"
                  :value="item.sitEnName"
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
import { saveSafetyStockApi } from "@/api/warehouse/platformSafetyStock"
import { getByLikeSkuCode } from "@/api/product/prdsku"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getSit } from "@/api/order/orderManage"

export default {
  name: "safetyStockAddDialog",
  components: {},
  data() {
    return {
      rules: {
        skuCode: { required: true, message: "请输入标准SKU", trigger: "blur" },
        platform: { required: true, message: "请选择平台", trigger: "blur" },
        site: { required: true, message: "请选择站点", trigger: "blur" },
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
          { label: "平台", prop: "platform", sortable: false, solt: true, copy: false, required: true },
          { label: "站点", prop: "site", sortable: false, solt: true, copy: false, required: true },
          { label: "安全库存天数", prop: "safeDayNum", sortable: false, solt: true, copy: false, required: true },
          { label: "操作", sortable: false, prop: "operate", solt: true, width: "120px", copy: false }
        ]
      },
      row: {},
      skuCodeList: [],
      loadingSkuQuery: false,
      isEdit: false,
      platformList: []
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog(row) {
      this.getPlatformList()
      if (row) {
        this.isEdit = true
      } else {
        this.isEdit = false
      }
      this.row = row
      this.skuCodeList = []
      this.platformList = []
      if (row) {
        this.form = {
          tableData: [
            {
              skuCode: row.skuCode,
              safeDayNum: row.safeDayNum,
              platform: row.platform,
              site: row.site
            }
          ]
        }
      } else {
        this.form = {
          tableData: [
            {
              skuCode: "",
              safeDayNum: undefined,
              platform: "",
              site: ""
            }
          ]
        }
      }
      this.showDialog = true
    },
    async getPlatformList() {
      const { data } = await getPlaTypeAll()
      if (data.code == 0) {
        this.platformList = data.data
      }
    },
    async changePlatform(val, row) {
      this.$set(row, "site", "")
      const { data } = await getSit([val])
      console.log("data", data)
      this.$set(row, "siteList", data)
    },
    // 添加
    addCost(row) {
      this.form.tableData.push({
        skuCode: "",
        safeDayNum: undefined,
        platform: "",
        site: ""
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
              skuCode: item.skuCode,
              platform: item.platform,
              site: item.site
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
