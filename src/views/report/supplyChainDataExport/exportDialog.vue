<template>
  <el-dialog :title="title" :visible="value" width="50%" @close="handleClose" @closed="closed">
    <basic-container>
      <div style="padding: 30px">
        <el-form ref="exportDialog" :model="exportForm" :rules="exportFormRules" status-icon>
          <el-form-item :label="item.name" v-for="(item, index) in paramsData" :key="index">
            <el-date-picker
              v-if="item.type === 'date'"
              :type="item.format === 'yyyy-MM' ? 'month' : 'date'"
              placeholder="请选择"
              :format="item.format ? item.format : 'yyyy-MM'"
              :value-format="item.format ? item.format : 'yyyy-MM'"
              v-model="param[item.code]"
              clearable
            >
            </el-date-picker>
            <el-input
              v-if="item.type === 'text'"
              placeholder="请输入内容"
              v-search-input
              clearable
              v-model="param[item.code]"
            ></el-input>

            <el-select
              v-if="item.type === 'select'"
              v-model="param[item.code]"
              size="small"
              clearable
              filterable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option v-for="it in item.selectList" :key="it.code" :label="it.name" :value="it.code"> </el-option>
            </el-select>

            <el-date-picker
              v-if="item.type === 'dateRange'"
              v-model="param[item.code]"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="flex-remark" style="text-align: center; margin-top: 20px">
        <el-button size="small" style="padding: 9px 30px" @click="handleClose">取消</el-button>
        <el-button size="small" style="padding: 9px 30px" type="primary" @click="addSave">确认</el-button>
      </div>
    </basic-container>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import { exportData, getSelectInfo } from "@/api/financialStatements/supplyChainDataExport"
import { downloadBlob } from "@/util/auth"
import _ from "lodash"
import { getStore as getSession } from "@/util/store"

export default {
  name: "addRemarkDialog",
  props: {
    value: {
      default: false,
      required: true,
      type: Boolean
    },
    title: {
      default: "",
      required: true
    },
    paramsData: {
      default: () => []
    },
    moduleId: {
      default: () => ""
    },
    exportModel: {
      default: () => "SYNC"
    }
  },

  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      param: {},
      downloadTitle: "",
      skipWatch: false
    }
  },
  watch: {
    paramsData(val, oldVal) {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()

      // 如果当前月份是1月，则上个月为去年的12月
      const lastMonthDate = new Date(year, month - 1)
      const lastMonth = lastMonthDate.getMonth() + 1 // 月份从0开始
      const lastMonthString = lastMonth < 10 ? "0" + lastMonth : lastMonth // 补0
      const formattedLastMonth = `${lastMonthDate.getFullYear()}-${lastMonthString}`
      if (val.length > 0) {
        console.log("执行了几次", val, oldVal)

        val.forEach(async (element) => {
          if (element.type == "date") {
            if (element.format == "yyyy-MM") {
              this.$set(this.param, element.code, formattedLastMonth)
            } else {
              this.$set(this.param, element.code, "")
            }
          } else {
            this.$set(this.param, element.code, "")
          }

          if (element.type == "select") {
            // 请求下拉列表回来
            if (!element.selectList) {
              getSelectInfo({
                id: this.moduleId,
                code: element.code
              }).then((res) => {
                if (res.data.code == 0) {
                  if (res.data.data.length > 0) {
                    this.$set(element, "selectList", res.data.data)
                  }
                }
              })
            }
          }
        })
      }
    },
    exportModel(val) {
      console.log("val", val)
    }
  },
  methods: {
    handleClose() {
      this.$emit("input", false)
    },
    closed() {
      this.param = {}
      this.$emit("handleClose")
    },
    async addSave() {
      this.downloadTitle = this.param.month
        ? `${this.param.month}${this.title}`
        : `${this.getCurrentDateFormatted()}${this.title}`

      const res = await exportData({
        id: this.moduleId,
        param: this.transformObject(this.param),
        exportModel: this.exportModel
      })

      if (res.status == 200) {
        if (res.data.isSuccess) {
          let count = getSession({ name: "downloadCount" })
          this.$store.commit("SET_DOWNLOAD_COUNT", Number(count) + 1)
          this.$message.success(`由于导出数据量较大，请点击右上角【下载列表】图标进行查看！`)
          this.handleClose()
        } else {
          downloadBlob(
            res.data,
            `${this.downloadTitle}.xls`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          )
          this.$message.success("操作成功")
          this.handleClose()
        }
      }
    },
    transformObject(obj) {
      return Object.keys(obj)
        .map((key) => {
          if (_.isArray(obj[key])) {
            return {
              code: key,
              value: obj[key].join(",")
            }
          }
          return {
            code: key,
            value: obj[key]
          }
        })
        .filter((item) => item.value !== "")
    },
    getCurrentDateFormatted() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0") // 月份从0开始计数，所以要加1
      const day = String(today.getDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }
  }
}
</script>

<style lang="scss" scoped></style>
