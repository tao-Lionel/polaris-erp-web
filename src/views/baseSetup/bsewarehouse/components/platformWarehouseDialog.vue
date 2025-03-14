<template>
  <el-dialog title="设置平台仓库映射" :visible.sync="showDialog" width="660px">
    <div style="display: flex; padding: 10px">
      <div>内部仓库编码：{{ selectData.warehouseCode }}</div>
      <div style="margin-left: 30px">仓库名称：{{ selectData.warehouseName }}</div>
    </div>
    <el-form ref="form" :model="form">
      <avue-crud ref="crud" :data="form.tableData" :option="tableOptions">
        <template slot="storeId" slot-scope="{ row }">
          <el-form-item :prop="`tableData.${row.$index}.storeId`" label="" :rules="rules.storeId">
            <el-select v-model="row.storeId" size="small" clearable filterable placeholder="请选择店铺">
              <el-option
                v-for="item in storeOptions"
                :key="item.storeId"
                :label="item.storeAccount"
                :value="item.storeId"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>

        <template slot="bsePlatformWarehouseCode" slot-scope="{ row }">
          <el-form-item
            :prop="`tableData.${row.$index}.bsePlatformWarehouseCode`"
            label=""
            :rules="rules.bsePlatformWarehouseCode"
          >
            <el-input
              v-model="row.bsePlatformWarehouseCode"
              size="small"
              placeholder="请输入平台仓库编码"
              clearable
            ></el-input>
          </el-form-item>
        </template>

        <template slot="operate" slot-scope="{ row }">
          <div>
            <el-button
              v-if="row.$index === form.tableData.length - 1"
              type="text"
              style="padding: 10px 0"
              @click="addCost(row)"
              >添加</el-button
            >
            <el-button type="text" style="padding: 10px 0" @click="deleteCost(row)"> 删除 </el-button>
          </div>
        </template>
      </avue-crud>
    </el-form>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getStoreListApi } from "@/api/baseSetup/bsestore"
import { addBatchPlatformWarehouseApi } from "@/api/baseSetup/bsewarehouse"

export default {
  name: "platformWarehouseDialog",
  components: {},
  data() {
    return {
      rules: {
        storeId: { required: true, message: "请选择店铺", trigger: "blur" },
        bsePlatformWarehouseCode: { required: true, message: "请输入平台仓库编码", trigger: "blur" }
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
          { label: "店铺", prop: "storeId", sortable: false, solt: true },
          { label: "平台仓库编码", prop: "bsePlatformWarehouseCode", sortable: false, solt: true },
          { label: "操作", sortable: false, prop: "operate", solt: true, width: "120px", copy: false }
        ]
      },
      selectData: {},
      storeOptions: []
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    isEdit() {
      return this.selectData.storeIds && this.selectData.platformTypeWarehouseCodes
    }
  },
  methods: {
    async openDialog(selectData) {
      await this.getStoreList()
      this.showDialog = true

      let tableData = []
      this.selectData = selectData

      console.log("this.isEdit", this.isEdit)
      if (this.isEdit) {
        this.selectData.storeIds.split(",").forEach((item, index) => {
          tableData.push({
            storeId: Number(item),
            bsePlatformWarehouseCode: this.selectData.platformTypeWarehouseCodes.split(",")[index]
          })
        })
      } else {
        tableData.push({
          storeId: "",
          bsePlatformWarehouseCode: ""
        })
      }
      this.form = {
        tableData
      }
    },
    async getStoreList() {
      const { data } = await getStoreListApi()
      this.storeOptions = data.data
    },

    // 添加
    addCost(row) {
      this.form.tableData.push({
        storeId: "",
        bsePlatformWarehouseCode: ""
      })
    },
    // 删除
    deleteCost(row) {
      if (this.form.tableData.length === 1) {
        this.$message.warning("至少选择一条数据")
        return
      }
      this.form.tableData.splice(row.$index, 1)
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.form.tableData.length > 1) {
            let obj = {}
            for (let item of this.form.tableData) {
              if (obj[item.storeId]) {
                this.$message.warning("同个店铺，只能设置一个平台仓库编码")
                return
              }
              obj[item.storeId] = true
            }
          }

          const platformWarehouseArr = this.form.tableData.map((item) => {
            return {
              bsePlatformWarehouseCode: item.bsePlatformWarehouseCode,
              storeId: item.storeId
            }
          })

          const params = {
            warehouseCode: this.selectData.warehouseCode,
            flag: this.isEdit ? 1 : 0, // 0 新增 1 编辑
            bsePlatformWarehouseAddBatchTmpDtos: platformWarehouseArr
          }

          console.log("params===", params)

          const { data } = await addBatchPlatformWarehouseApi(params)
          if (data.code === 0) {
            this.$message({
              type: "success",
              message: "操作成功!"
            })
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
