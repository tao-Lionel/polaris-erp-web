<template>
  <el-dialog title="投标" :visible.sync="showDialog" width="1000px" @close="cancel">
    <el-form>
      <detail-wrapper :options="{ title: '招标信息' }" class="detail">
        <el-row>
          <el-col span="6">
            <span>起运国家：</span>
            <span>{{ detail.countryOfOriginName }}</span>
          </el-col>
          <el-col span="6">
            <span>目的国家：</span>
            <span>{{ detail.destinationCountryName }}</span>
          </el-col>
          <el-col span="6">
            <span>起运港口：</span>
            <span>{{ detail.portOfOriginName }}</span>
          </el-col>
          <el-col span="6">
            <span>目的港口：</span>
            <span>{{ detail.destinationPortName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <span>计划发运时间：</span>
            <span>{{ detail.plannedShipmentStartDate }} 至 {{ detail.plannedShipmentEndDate }}</span>
          </el-col>
          <el-col span="6">
            <span>箱型：</span>
            <span>{{ detail.containerTypeName }}</span>
          </el-col>
          <el-col span="6">
            <span>需求舱位量：</span>
            <span>{{ detail.inviteTenderRequiredCapacity }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <span>招标时间：</span>
            <span>{{ detail.tenderStartTime }} 至 {{ detail.tenderEndTime }}</span>
          </el-col>
          <el-col span="12">
            <span>是否加急：</span>
            <span>{{ detail.isEmergency ? "加急" : "不加急" }}</span>
          </el-col>
        </el-row>
        <el-row v-if="detail.isEmergency === 1">
          <el-col span="12">
            <span>期望到港时间：</span>
            <span>{{ detail.expectedArrivalTime }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="24">
            <span>船司：</span>
            <span>{{ detail.shippingLine }}</span>
          </el-col>
        </el-row>
      </detail-wrapper>
    </el-form>

    <detail-wrapper :options="{ title: '应标信息', customContentStyle: { padding: '10px' } }">
      <avue-crud :data="tableData" :option="bidTableOption">
        <!-- 海运费 -->
        <template slot="oceanFreight" slot-scope="{ row }">
          <div class="custom-form-item">
            <el-input
              v-model="row.oceanFreight"
              placeholder="请输入海运费"
              clearable
              @change="validateNumber($event, row, 'oceanFreight')"
              size="small"
              class="custom-input"
            >
              <el-select
                v-model="row.currency"
                slot="append"
                placeholder="币种"
                class="custom-select"
                disabled
                size="small"
              >
                <el-option
                  v-for="item in currencyArr"
                  :key="item.currency"
                  :label="item.currency"
                  :value="item.currency"
                >
                </el-option>
              </el-select>
            </el-input>
          </div>
        </template>
        <!-- 剩余舱位量 -->
        <template slot="remainingCapacity" slot-scope="{ row }">
          <el-input
            v-model="row.remainingCapacity"
            placeholder="剩余舱位量"
            size="small"
            clearable
            @change="validateNumber($event, row, 'remainingCapacity')"
          ></el-input>
        </template>
        <!-- 报价清单 -->
        <template slot="uploadedFileUrl" slot-scope="{ row }">
          <div style="display: flex; flex-direction: flex-start">
            <upload
              ref="uploadRef"
              :fileUrl.sync="row.uploadedFileUrl"
              @uploadSuccess="uploadSuccess($event, row)"
              style="width: 100px"
            ></upload>
            <a @click="handleDownloadTemplate" style="font-size: 12px; margin-top: 2px">下载模板</a>
          </div>
        </template>
        <!-- 价格有效时间 -->
        <!-- <template slot="priceValidityPeriodTime" slot-scope="{ row }">
          <el-date-picker
            v-model="row.priceValidityPeriodTime"
            type="datetimerange"
            start-placeholder="价格有效开始时间"
            end-placeholder="价格有效结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="small"
            clearable
          >
          </el-date-picker>
        </template> -->
      </avue-crud>
    </detail-wrapper>
    <span slot="footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fetchList as getCurrencyApi } from "@/api/baseSetup/bsecurrency"
import upload from "./upload.vue"
import { submitTenderBatchApi, getDetailApi, downloadTemplateApi } from "@/api/logistics/logisticsProviderBidding.js"
import { downloadBlob } from "@/util/auth"
import { bidTableOption } from "../list"

let form = {
  inviteTenderId: "",
  inviteTenderCode: "",
  // priceValidityPeriodTime: [],
  oceanFreight: undefined,
  currency: "USD",
  remainingCapacity: "",
  uploadedFileUrl: ""
}

export default {
  name: "bidDialog",
  components: { upload },
  data() {
    const validateQuoteFile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请上传报价清单"))
      } else {
        callback()
      }
    }

    return {
      showDialog: false,
      form: {},
      detail: {},
      currencyArr: [],
      rules: {
        oceanFreight: [{ required: true, message: "请选择海运费", trigger: "blur" }],
        remainingCapacity: [{ required: true, message: "请选择剩余舱位量", trigger: "blur" }],
        // priceValidityPeriodTime: [{ required: true, message: "价格有效时间", trigger: "blur" }],
        uploadedFileUrl: [{ validator: validateQuoteFile, trigger: "change", required: true }]
      },
      bidTableOption,
      tableData: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    async openDialog(id) {
      this.showDialog = true
      // this.form = { ...form }
      // this.form.inviteTenderId = id
      this.tableData = []
      await this.getDetail(id)
      this.getCurrency()
    },
    async getDetail(id) {
      const { data } = await getDetailApi(id)
      if (data.code !== 0) return
      this.detail = data.data

      const { wmsTenderRecordVos: records, shippingLineList } = data.data
      this.tableData = []

      // 创建基础投标记录对象
      const createBaseBidRecord = (shippingLine) => ({
        tenderShippingLine: shippingLine,
        inviteTenderId: id,
        inviteTenderCode: this.detail.inviteTenderCode,
        // priceValidityPeriodTime: [],
        oceanFreight: undefined,
        currency: "USD",
        remainingCapacity: "",
        uploadedFileUrl: ""
      })

      // 转换已存在的投标记录
      if (records?.length) {
        // 添加已有的投标记录
        this.tableData.push(
          ...records.map((record) => ({
            ...createBaseBidRecord(record.tenderShippingLine),
            // priceValidityPeriodTime: [record.priceValidityStartTime, record.priceValidityEndTime],
            oceanFreight: record.oceanFreight,
            remainingCapacity: record.remainingCapacity,
            uploadedFileUrl: record.uploadedFileUrl
          }))
        )

        // 添加未投标的航线记录
        const unbidLines = shippingLineList.filter((line) => {
          return !records.some((record) => record.tenderShippingLine === line)
        })

        this.tableData.push(...unbidLines.map(createBaseBidRecord))
      } else {
        // 如果没有投标记录，为所有航线创建空记录
        this.tableData = shippingLineList.map(createBaseBidRecord)
      }
    },
    getCurrency() {
      const params = {
        size: -1,
        current: -1
      }
      getCurrencyApi(params).then((res) => {
        if (res.data.code === 0) {
          this.currencyArr = res.data.data.records
        }
      })
    },
    validateNumber(val, row, key) {
      if (!val) return
      const newVal = parseFloat(val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0"))
      if (newVal || newVal === 0) {
        row[key] = newVal
      } else {
        row[key] = null
      }
    },
    uploadSuccess(file, row) {
      row.uploadedFileUrl = file.fileUrl
    },
    async submit() {
      console.log("this.tableData", this.tableData)

      const isEmpty = this.tableData.every((item) => {
        return (
          !item.oceanFreight && !item.remainingCapacity && !item.uploadedFileUrl
          // && (!item.priceValidityPeriodTime || !item.priceValidityPeriodTime.length)
        )
      })

      if (isEmpty) {
        this.$message.error("请至少填写一条投标信息")
        return
      }

      for (let item of this.tableData) {
        // item.priceValidityStartTime = item?.priceValidityPeriodTime?.[0]
        // item.priceValidityEndTime = item?.priceValidityPeriodTime?.[1]

        if (
          item.oceanFreight ||
          item.remainingCapacity ||
          item.uploadedFileUrl
          // ||
          // (item.priceValidityPeriodTime && item.priceValidityPeriodTime.length)
        ) {
          if (!item.oceanFreight) {
            this.$message.error(`${item.tenderShippingLine} 请输入海运费`)
            return
          }
          if (!item.remainingCapacity) {
            this.$message.error(`${item.tenderShippingLine} 请输入剩余舱位量`)
            return
          }
          if (!item.uploadedFileUrl) {
            this.$message.error(`${item.tenderShippingLine} 请上传报价清单`)
            return
          }
          // if (!item.priceValidityPeriodTime || !item.priceValidityPeriodTime.length) {
          //   this.$message.error(`${item.tenderShippingLine} 请选择价格有效时间`)
          //   return
          // }
        }
      }

      // 只传填了数据的行
      const params = this.tableData.filter((item) => {
        return (
          item.oceanFreight && item.remainingCapacity && item.uploadedFileUrl
          // &&
          // item.priceValidityEndTime &&
          // item.priceValidityStartTime.length
        )
      })

      const { data } = await submitTenderBatchApi(params)
      if (data.code === 0) {
        this.$message.success("投标成功")
        this.close()
      }
    },
    cancel() {
      this.$refs.uploadRef?.clearFiles()
      this.$emit("updateList")
    },
    close() {
      this.showDialog = false
    },
    // 下载模板
    async handleDownloadTemplate() {
      const { data } = await downloadTemplateApi({ templateName: "物流商投标模板.xlsx" })
      downloadBlob(data, "XXXX公司X月X日报价单.xlsx", "application/vnd.ms-excel;charset=utf-8")
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  ::v-deep .el-col {
    padding: 10px;
  }
}

::v-deep .el-table {
  width: 100%;
  .el-table__body-wrapper {
    overflow-x: auto;
  }
}

.custom-form-item {
  .custom-input {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }
  .custom-select {
    ::v-deep .el-input__inner {
      width: 60px;
    }

    ::v-deep .el-input--suffix .el-input__inner {
      padding-right: 15px;
    }

    ::v-deep .el-input__suffix {
      left: 35px;
    }
  }
}
</style>
