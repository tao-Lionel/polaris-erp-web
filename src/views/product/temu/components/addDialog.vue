<template>
  <el-dialog title="新增" :visible.sync="showDialog" width="500px">
    <div>
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="店铺名称" prop="storeId">
          <el-select size="small" v-model="form.storeId" clearable filterable placeholder="请选择店铺名称">
            <el-option
              v-for="item in storeIdOptions"
              :key="item.storeId"
              :label="item.storeAccount"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接SKU" prop="linkSku">
          <el-input size="small" v-model="form.linkSku" placeholder="请输入链接SKU"></el-input>
        </el-form-item>
        <el-form-item label="币别" prop="currency">
          <el-select size="small" v-model="form.currency" clearable filterable placeholder="请选择币别">
            <el-option
              v-for="item in currencyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供货价" prop="cost">
          <el-input-number
            v-model="form.cost"
            size="small"
            :controls="false"
            precision="2"
            placeholder="请输入供货价"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getStore } from "@/api/order/orderManage"
import { addTemuApi } from "@/api/product/temu"
import { getAll as getCurrencyAllApi } from "@/api/baseSetup/bsecurrency"

export default {
  name: "temuAddDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      rules: {
        storeId: { required: true, message: "请选择店铺", trigger: "blur" },
        linkSku: { required: true, message: "请输入链接SKU", trigger: "blur" },
        cost: { required: true, message: "请输入供货价", trigger: "blur" },
        currency: { required: true, message: "请选择币别", trigger: "blur" }
      },
      form: {},
      storeIdOptions: [],
      row: {},
      currencyOptions: []
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog(row) {
      this.showDialog = true
      this.row = row
      this.getStoreAll()
      this.getCurrencyAll()
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
    // 获取店铺
    async getStoreAll() {
      const { data } = await getStore([])
      this.storeIdOptions = data.filter((item) => item.state === "0" && item.platformTypeCode === "TEMU")
    },
    submit() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const { data } = await addTemuApi([this.form])
          if (data.code === 0) {
            this.$message.success("新增成功")
            this.$emit("updateList")
            this.cancel()
          }
        }
      })
    },
    cancel() {
      this.$refs.formRef.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
