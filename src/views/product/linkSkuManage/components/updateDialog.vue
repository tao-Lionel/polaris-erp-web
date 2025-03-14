<template>
  <el-dialog :title="title" :visible.sync="showDialog" width="400px" max-height="400" center>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item v-if="type === 1" label="是否审核" prop="auditStatus">
        <el-select size="small" v-model="form.auditStatus" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="type === 2" label="是否同步库存到平台" prop="syncPlatformStock">
        <el-select size="small" v-model="form.syncPlatformStock" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="type === 3" label="级别" prop="linkSkuLevel">
        <el-select size="small" v-model="form.linkSkuLevel" clearable filterable placeholder="请选择">
          <el-option
            v-for="item in linkSkuLevelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="type === 4" label="是否可售" prop="saleStatus">
        <el-select size="small" v-model="form.saleStatus" placeholder="请选择">
          <el-option
            v-for="item in saleStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="type === 5" label="产品状态" prop="productStatus">
        <el-select size="small" v-model="form.productStatus" placeholder="请选择">
          <el-option
            v-for="item in productStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="type === 6" label="是否重点SKU" prop="focusStatus">
        <el-select size="small" v-model="form.focusStatus" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="type === 7" label="开售时间" prop="saleStartTime">
        <el-date-picker
          v-model="form.saleStartTime"
          size="small"
          type="datetime"
          :clearable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开售时间"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button type="primary" size="small" @click="submitForm()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import { getObjByType } from "@/api/admin/dict"
import { batchUpdateApi, updateOtherInfoApi } from "@/api/product/linkSkuMange"
import { getDictByType } from "@/util/auth"

export default {
  name: "updateDialog",
  components: {},
  props: {},
  data() {
    return {
      showDialog: false,
      rules: {
        linkSkuLevel: [{ required: true, message: "请选择", trigger: "blur" }],
        syncPlatformStock: [{ required: true, message: "请选择", trigger: "blur" }],
        auditStatus: [{ required: true, message: "请选择", trigger: "blur" }],
        saleStatus: [{ required: true, message: "请选择", trigger: "blur" }],
        productStatus: [{ required: true, message: "请选择", trigger: "blur" }],
        focusStatus: [{ required: true, message: "请选择", trigger: "blur" }],
        saleStartTime: [{ required: true, message: "请选择开售时间", trigger: "blur" }]
      },
      form: {},
      linkSkuLevelOptions: [],
      options: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
      saleStatusOptions: [],
      productStatusOptions: [],
      type: 1,
      ids: [],
      title: ""
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    // type: 1批量审核、2同步库存、3产品定级、4销售状态、5产品状态、6是否重点SKU、7开售时间

    openDialog(type, selectList) {
      this.showDialog = true
      this.ids = selectList.map((item) => item.id)
      this.type = type
      this.form = {}
      this.title =
        type === 1
          ? "批量审核"
          : type === 2
          ? "同步库存"
          : type === 3
          ? "产品定级"
          : type === 4
          ? "销售状态"
          : type === 5
          ? "产品状态"
          : type === 6
          ? "是否重点SKU"
          : "开售时间"
      this.init()
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    async init() {
      // 产品状态
      getObjByType("link_sku_product_status").then((res) => {
        this.productStatusOptions = res.data.data
      })
      // 产品定级
      getObjByType("link_sku_product_level").then((res) => {
        this.linkSkuLevelOptions = res.data.data
      }) // 销售状态
      this.saleStatusOptions = await getDictByType("link_sku_sale_status")
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = {}
          if (this.type === 7) {
            res = await updateOtherInfoApi({ ...this.form, ids: this.ids })
          } else {
            res = await batchUpdateApi({ ...this.form, idList: this.ids })
          }
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.$emit("updateDate")
            this.showDialog = false
          } else {
            this.$message.error("操作失败")
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
