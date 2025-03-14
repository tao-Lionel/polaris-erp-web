<template>
  <el-dialog title="作废" :visible.sync="showDialog" width="600px">
    <div>
      <el-form :model="form" ref="form" inline label-width="150px" label-suffix=":">
        <el-form-item label="招标需求单号">
          <div>{{ form.inviteTenderCode }}</div>
        </el-form-item>
        <el-form-item label="需求状态">
          <div>{{ form.inviteTenderStatusName }}</div>
        </el-form-item>
        <el-form-item
          label="作废原因"
          prop="remark"
          :rules="[{ required: true, message: '请输入作废原因', trigger: 'blur' }]"
        >
          <el-input v-model="form.remark" type="textarea" size="small" placeholder="作废原因"></el-input>
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
import { cancelTenderApi } from "@/api/logistics/logisticsProviderTendering.js"

export default {
  name: "cancelDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {
        orderNo: "",
        remark: ""
      }
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog({ inviteTenderCode, inviteTenderStatusName, id }) {
      this.showDialog = true
      this.form.remark = ""
      this.form.id = id
      this.form.inviteTenderCode = inviteTenderCode
      this.form.inviteTenderStatusName = inviteTenderStatusName
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const params = {
            id: this.form.id,
            remark: this.form.remark
          }
          const { data } = await cancelTenderApi(params)
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

<style lang="scss" scoped>
::v-deep {
  .el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
