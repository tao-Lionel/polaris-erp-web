<template>
  <el-dialog :title="title" :visible.sync="showDialog" width="400px">
    <div>
      <el-form :model="form" ref="form" :rules="rules" inline label-width="100px">
        <el-form-item label="工厂SKU" prop="skuCode">
          <el-select
            v-model="form.skuCode"
            filterable
            remote
            placement="top"
            size="small"
            reserve-keyword
            placeholder="请检索输入"
            :remote-method="fetchSuggestions"
            :loading="loadingSkuQuery"
            @change="handleSelectSkuCode"
          >
            <el-option
              v-for="item in skuList"
              :key="item.skuId"
              :label="item.skuCode"
              :value="item.skuCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="托盘尺寸" prop="palletSpec">
          <el-select v-model="form.palletSpec" size="small" placeholder="托盘尺寸" clearable>
            <el-option
              v-for="item in palletSpecList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打托数" prop="palletNumber">
          <el-input-number
            v-model="form.palletNumber"
            size="small"
            placeholder="打托数"
            clearable
            :controls="false"
            :precision="0"
            :min="0"
          ></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addPalletsManageApi, editPalletsManageApi } from "@/api/product/palletsManage"
import { getByLikeSkuCodeAndCreateAuditComplete } from "@/api/product/prdsku"
import { getDictByType } from "@/util/auth"

export default {
  name: "palletsManageAddDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {},
      rules: {
        skuCode: [{ required: true, message: "请输入工厂SKU", trigger: "blur" }],
        palletSpec: [{ required: true, message: "请输入托盘尺寸", trigger: "blur" }],
        palletNumber: [{ required: true, message: "请输入打托数", trigger: "blur" }]
      },
      loadingSkuQuery: false,
      skuList: [],
      palletSpecList: []
    }
  },
  computed: {
    isEdit() {
      return !!this.form.id
    },
    title() {
      return this.isEdit ? "编辑" : "新增"
    }
  },
  created() {},
  mounted: function () {},
  methods: {
    async openDialog(row) {
      this.palletSpecList = await getDictByType("product_pallet_spec")
      if (row?.id) {
        this.form = {
          id: row.id,
          palletSpec: row.palletSpec,
          palletNumber: row.palletNumber,
          skuCode: row.skuCode
        }
      } else {
        this.form = {
          id: undefined,
          palletSpec: "",
          palletNumber: "",
          skuCode: ""
        }
      }
      this.showDialog = true
    },
    //工厂sku检索输入
    fetchSuggestions(queryString) {
      let queryParams = {
        isHideLoading: true,
        skuCode: queryString ? queryString.trim() : queryString,
        codes: "1000"
      }
      this.loadingSkuQuery = true
      getByLikeSkuCodeAndCreateAuditComplete(queryParams).then((res) => {
        this.loadingSkuQuery = false
        this.skuList = res.data.data
      })
    },
    //选中sku
    handleSelectSkuCode(item) {
      let skuInfo = this.skuList.filter((sku) => {
        return sku.skuCode === item
      })
      if (skuInfo.length === 0) {
        return
      }
      this.form.skuId = skuInfo[0].skuId
      this.form.skuCode = skuInfo[0].skuCode
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let fnApi = this.isEdit ? editPalletsManageApi : addPalletsManageApi
          const { data } = await fnApi(this.form)
          if (data.code === 0) {
            this.$message.success("操作成功")
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
