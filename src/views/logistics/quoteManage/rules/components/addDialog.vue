<template>
  <el-dialog v-if="showDialog" :title="title" :visible.sync="showDialog" width="660px">
    <div>
      <el-form :model="form" ref="formRef" :inline="true" :rules="rules">
        <el-row>
          <el-col span="12">
            <el-form-item prop="enable" label="规则状态">
              <el-switch
                v-model="form.enable"
                active-text="启用"
                inactive-text="禁用"
                :active-value="1"
                :inactive-value="0"
                size="small"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item prop="portOfOrigin" label="起运港口">
              <el-select
                clearable
                v-model="form.portOfOrigin"
                filterable
                :multiple="!isEdit"
                :collapse-tags="!isEdit"
                placeholder="起运港口"
                size="small"
              >
                <el-option
                  v-for="item in departureHarbourOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <el-form-item prop="destinationPort" label="目的港口">
              <el-select clearable v-model="form.destinationPort" filterable placeholder="目的港口" size="small">
                <el-option
                  v-for="item in intoHarbourOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item prop="logisticsProviderUserId" label="投标物流商">
              <el-select
                v-model="form.logisticsProviderUserId"
                filterable
                clearable
                :multiple="!isEdit"
                :collapse-tags="!isEdit"
                placeholder="投标物流商"
                size="small"
              >
                <el-option
                  v-for="item in logisticsProviderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getTenderLogisticsApi, saveRulesApi } from "@/api/logistics/logisticsProviderTendering.js"
import { getDictByType } from "@/util/auth"

export default {
  name: "releaseRulesAddDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {},
      rules: {
        enable: [{ required: true, message: "请选择规则状态" }],
        portOfOrigin: [{ required: true, message: "请选择起运港口" }],
        destinationPort: [{ required: true, message: "请选择目的港口" }],
        logisticsProviderUserId: [{ required: true, message: "请选择投标物流商" }]
      },
      intoHarbourOptions: [],
      departureHarbourOptions: [],
      logisticsProviderOptions: []
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
    openDialog(row) {
      this.init()
      if (row) {
        // 编辑
        this.form = {
          id: row.id,
          enable: row.enable,
          portOfOrigin: row.portOfOrigin,
          destinationPort: row.destinationPort,
          logisticsProviderUserId: row.logisticsProviderUserId
        }
      } else {
        // 新增
        this.form = {
          id: null,
          enable: 1,
          portOfOrigin: [],
          destinationPort: "",
          logisticsProviderUserId: []
        }
      }

      this.showDialog = true
    },
    async init() {
      //目的港
      this.intoHarbourOptions = await getDictByType("into_harbour")
      //起运港
      this.departureHarbourOptions = await getDictByType("departure_harbour")
      // 投标物流商
      getTenderLogisticsApi().then((res) => {
        this.logisticsProviderOptions = res.data.data.map((item) => {
          return {
            label: item.displayname,
            value: item.userId
          }
        })
      })
    },
    submit() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const form = { ...this.form }
          form.portOfOrigin = Array.isArray(form.portOfOrigin) ? form.portOfOrigin.join(",") : form.portOfOrigin
          form.logisticsProviderUserId = Array.isArray(form.logisticsProviderUserId)
            ? form.logisticsProviderUserId.join(",")
            : form.logisticsProviderUserId
          const { data } = await saveRulesApi(form)
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
