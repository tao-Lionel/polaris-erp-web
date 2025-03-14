<template>
  <el-dialog title="价格修改" :visible.sync="showDialog" width="80%">
    <div>
      <el-form ref="form" :model="form">
        <avue-crud ref="crud" :data="form.tableData" :option="tableOptions">
          <template slot="linkSku" slot-scope="{ row }">
            <el-form-item :prop="`tableData.${row.$index}.linkSku`" label="" :rules="rules.linkSku">
              <el-input v-model="row.linkSku" size="small" placeholder="请输入链接SKU" clearable></el-input>
            </el-form-item>
          </template>

          <template slot="currency" slot-scope="{ row }">
            <el-form-item :prop="`tableData.${row.$index}.currency`" label="" :rules="rules.currency">
              <el-select size="small" v-model="row.currency" clearable filterable placeholder="请选择币别">
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>

          <template slot="cost" slot-scope="{ row }">
            <div style="display: flex; align-items: center; flex-wrap: wrap; justify-content: space-between">
              <el-form-item :prop="`tableData.${row.$index}.cost`" label="" :rules="rules.cost" style="width: 70%">
                <el-input-number
                  v-model="row.cost"
                  size="small"
                  :controls="false"
                  precision="2"
                  placeholder="请输入供货价"
                ></el-input-number>
              </el-form-item>
              <a v-if="row.$index === 0" class="ml-10" @click="clickBatchFilling('cost', row)">批量填充</a>
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
import { editTemuApi } from "@/api/product/temu"
import { getAll as getCurrencyAllApi } from "@/api/baseSetup/bsecurrency"

export default {
  name: "temuEditDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      rules: {
        linkSku: { required: true, message: "请输入链接SKU", trigger: "blur" },
        cost: { required: true, message: "请输入供货价", trigger: "blur" },
        currency: { required: true, message: "请选择币别", trigger: "blur" }
      },
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
          { label: "店铺名称", prop: "storeAccount", sortable: false },
          { label: "币别", prop: "currency", sortable: false, solt: true },
          { label: "链接SKU", prop: "linkSku", sortable: false, solt: true },
          { label: "供货价", prop: "cost", sortable: false, solt: true, copy: false, width: 250 }
        ]
      },
      selectList: [],
      currencyOptions: []
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog(selectList) {
      this.selectList = selectList
      this.form.tableData = selectList.map((item) => {
        return {
          storeId: item.storeId,
          storeAccount: item.storeAccount,
          currency: item.currency,
          linkSku: item.linkSku,
          cost: item.cost
        }
      })
      this.getCurrencyAll()
      this.showDialog = true
    },
    // 获取币别
    async getCurrencyAll() {
      //获取币别下拉列表
      const { data } = await getCurrencyAllApi()
      if (data.code === 0) {
        this.currencyOptions = data.data.map((item) => {
          return {
            value: item.currency,
            label: item.currency
          }
        })
      }
    },
    // 批量填充
    clickBatchFilling(type, row) {
      this.form.tableData.forEach((element) => {
        element[type] = row[type]
      })
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { data } = await editTemuApi(this.form.tableData)
          if (data.code === 0) {
            this.$message.success("修改成功")
            this.$emit("updateList")
            this.showDialog = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
