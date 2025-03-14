<template>
  <el-dialog :title="title" :visible.sync="showDialog" width="900px" @close="cancel">
    <div>
      <el-form :model="form" ref="formRef" :inline="true" size="small" :rules="rules">
        <detail-wrapper :options="{ title: '招标信息' }">
          <el-row>
            <el-col span="8">
              <el-form-item prop="isEmergency" label="是否加急">
                <el-select v-model="form.isEmergency" clearable filterable placeholder="是否加急">
                  <el-option label="加急" :value="1"></el-option>
                  <el-option label="不加急" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item prop="countryOfOrigin" label="起运国家">
                <el-select v-model="form.countryOfOrigin" clearable filterable placeholder="起运国家">
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item prop="destinationCountry" label="目的国家">
                <el-select v-model="form.destinationCountry" clearable filterable placeholder="目的国家">
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="8">
              <el-form-item prop="portOfOrigin" label="起运港口">
                <el-select clearable v-model="form.portOfOrigin" filterable placeholder="起运港口">
                  <el-option
                    v-for="item in departureHarbourOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item prop="destinationPort" label="目的港口">
                <el-select clearable v-model="form.destinationPort" filterable placeholder="目的港口">
                  <el-option
                    v-for="item in intoHarbourOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item prop="shippingLine" label="船司">
                <el-select v-model="form.shippingLine" filterable clearable multiple placeholder="船司">
                  <el-option
                    v-for="item in shipOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="8">
              <el-form-item prop="containerType" label="箱型">
                <el-select v-model="form.containerType" filterable clearable placeholder="箱型">
                  <el-option
                    v-for="item in containerModelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item prop="inviteTenderRequiredCapacity" label="需求舱位量">
                <el-input
                  v-model="form.inviteTenderRequiredCapacity"
                  placeholder="请输入需求舱位量"
                  size="small"
                  @change="validateNumber($event, 'inviteTenderRequiredCapacity')"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col span="8">
              <el-form-item prop="emergencyRequiredCapacity" label="紧急舱位量">
                <el-input
                  v-model="form.emergencyRequiredCapacity"
                  placeholder="请输入紧急舱位量"
                  size="small"
                  @change="validateNumber($event, 'emergencyRequiredCapacity')"
                ></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-form-item prop="planDeliveryTime" label="计划发运时间">
              <el-date-picker
                v-model="form.planDeliveryTime"
                type="datetimerange"
                start-placeholder="计划发运开始日期"
                end-placeholder="计划发运结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item prop="tenderTime" label="招标时间">
              <el-date-picker
                v-model="form.tenderTime"
                type="datetimerange"
                start-placeholder="招标开始日期"
                end-placeholder="招标结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row v-if="form.isEmergency === 1">
            <el-form-item prop="expectedArrivalTime" label="期望到港时间">
              <el-date-picker
                v-model="form.expectedArrivalTime"
                type="datetime"
                placeholder="期望到港时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                clearable
              >
              </el-date-picker>
            </el-form-item>
          </el-row>
        </detail-wrapper>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button size="small" type="primary" @click="submit('release')">发布需求</el-button>
      <el-button size="small" type="primary" @click="submit('save')">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDictByType } from "@/util/auth"
import { addAndEditApi } from "@/api/logistics/logisticsProviderTendering.js"

let form = {
  id: "",
  countryOfOrigin: "",
  destinationCountry: "",
  portOfOrigin: "",
  destinationPort: "",
  planDeliveryTime: [],
  containerType: "",
  shippingLine: "",
  tenderTime: [],
  inviteTenderRequiredCapacity: "",
  emergencyRequiredCapacity: 0,
  isEmergency: undefined,
  expectedArrivalTime: ""
}

export default {
  name: "logisticsProviderTenderingAddDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {},
      rules: {
        countryOfOrigin: [{ required: true, message: "请选择起运国家", trigger: "blur" }],
        destinationCountry: [{ required: true, message: "请选择目的国家", trigger: "blur" }],
        portOfOrigin: [{ required: true, message: "请选择起运港口", trigger: "blur" }],
        destinationPort: [{ required: true, message: "请选择目的港口", trigger: "blur" }],
        planDeliveryTime: [{ required: true, message: "请选择计划发运时间", trigger: "blur" }],
        shippingLine: [{ required: true, message: "请选择船司", trigger: "blur" }],
        containerType: [{ required: true, message: "请选择箱型", trigger: "blur" }],
        tenderTime: [{ required: true, message: "请选择招标时间", trigger: "blur" }],
        inviteTenderRequiredCapacity: [{ required: true, message: "请输入需求仓位量", trigger: "blur" }],
        isEmergency: [{ required: true, message: "请选择是否加急", trigger: "blur" }],
        expectedArrivalTime: [{ required: true, message: "请选择期望到港时间", trigger: "blur" }]
      },
      countryOptions: [],
      intoHarbourOptions: [],
      departureHarbourOptions: [],
      shipOptions: [],
      containerModelOptions: []
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
    openDialog(row, obj) {
      this.showDialog = true
      this.countryOptions = obj.countryOptions
      this.intoHarbourOptions = obj.intoHarbourOptions
      this.departureHarbourOptions = obj.departureHarbourOptions
      this.shipOptions = obj.shipOptions
      this.init()
      if (row) {
        this.form = {
          id: row.id,
          countryOfOrigin: row.countryOfOrigin,
          destinationCountry: row.destinationCountry,
          portOfOrigin: row.portOfOrigin,
          destinationPort: row.destinationPort,
          planDeliveryTime: [row.plannedShipmentStartDate, row.plannedShipmentEndDate],
          containerType: row.containerType,
          shippingLine: row.shippingLineList,
          tenderTime: [row.tenderStartTime, row.tenderEndTime],
          inviteTenderRequiredCapacity: row.inviteTenderRequiredCapacity,
          isEmergency: row.isEmergency,
          expectedArrivalTime: row.expectedArrivalTime
          // emergencyRequiredCapacity: row.emergencyRequiredCapacity
        }
      } else {
        this.form = { ...form }
      }
    },
    async init() {
      // 箱型
      this.containerModelOptions = await getDictByType("container_model")
    },
    submit(type) {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const formData = { ...this.form }

          formData.plannedShipmentStartDate = this.form?.planDeliveryTime?.[0]
          formData.plannedShipmentEndDate = this.form?.planDeliveryTime?.[1]

          formData.tenderStartTime = this.form?.tenderTime?.[0]
          formData.tenderEndTime = this.form?.tenderTime?.[1]

          formData.shippingLine = this.form.shippingLine.join(",")

          if (type === "release") {
            formData.directPublishFlag = true
          } else {
            formData.directPublishFlag = false
          }

          const { data } = await addAndEditApi(formData)
          if (data.code === 0) {
            this.$message.success("操作成功")
            this.close()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    cancel() {
      this.$refs.formRef.resetFields()
      this.$emit("updateList")
    },
    close() {
      this.showDialog = false
    },
    validateNumber(val, key) {
      if (!val) return
      const newVal = parseFloat(val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0"))
      if (newVal || newVal === 0) {
        this.form[key] = newVal
      } else {
        this.form[key] = null
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
