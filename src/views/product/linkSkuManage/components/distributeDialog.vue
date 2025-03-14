<template>
  <div class="form">
    <el-dialog v-if="showDialog" title="分配运营" :visible.sync="showDialog" width="40%">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" inline>
        <el-form-item label="变更级别" prop="level">
          <el-radio-group v-model="form.level" size="small">
            <el-radio v-for="item in operatorLevelOptions" :key="item.value" :label="item.value" :value="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="变更负责人" prop="userId">
          <el-select
            v-model="form.userId"
            filterable
            clearable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            placeholder="请输入"
            size="small"
          >
            <el-option label="无" :value="-1"></el-option>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效时间" prop="validNow">
          <el-radio-group v-model="form.validNow" size="small">
            <el-radio :label="true">立即</el-radio>
            <el-radio :label="false">指定时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.validNow === false" prop="enableTime" label-width="110px" label=" ">
          <el-date-picker
            style="width: 190px"
            v-model="form.enableTime"
            size="small"
            type="date"
            placeholder="选择指定时间"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" size="small" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from "@/api/admin/user"
import { saveDistributeApi } from "@/api/product/linkSkuMange"
import { getDictByType } from "@/util/auth"

let form = {
  linkSkuIds: "",
  userId: "",
  level: "FIRST_LEVEL_RESPONSIBLE_PERSON",
  validNow: true,
  enableTime: undefined
}
export default {
  name: "distributeDialog",
  components: {},
  props: {},
  data() {
    return {
      showDialog: false,
      form: {},
      options: [],
      rules: {
        level: [{ required: true, message: "请选择变更级别", trigger: "blur" }],
        userId: [{ required: true, message: "请选择变更负责人", trigger: "blur" }],
        validNow: [{ required: true, message: "请选择生效时间", trigger: "blur" }],
        enableTime: [{ required: true, message: "请填写指定时间", trigger: "blur" }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime()
        }
      },
      operatorLevelOptions: []
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    async openDialog(linkSkuIds, row) {
      this.form = {
        ...form,
        linkSkuIds: linkSkuIds
      }
      this.showDialog = true
      this.remoteMethod(undefined)
      this.operatorLevelOptions = await getDictByType("operator_level")
    },
    async remoteMethod(query) {
      if (query !== "") {
        const { data } = await fetchList({
          current: 1,
          size: 9999,
          displayname: query
        })
        this.options = data.data.records.map((item) => {
          return { value: item.userId, label: item.displayname }
        })
      } else {
        this.options = []
      }
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log(this.form)
          const { data } = await saveDistributeApi(this.form)
          if (data.code === 0) {
            this.$message.success("操作成功")
            this.$emit("updateDate")
            this.showDialog = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
