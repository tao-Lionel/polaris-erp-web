<template>
  <el-dialog title="锁定销量预测" :visible.sync="showLockingDialog" width="500px" center>
    <div v-show="!searchFormConfirm">
      您勾选了
      <span style="font-size: 18px; color: red">{{ this.selectList.length }}</span>
      条数据
    </div>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="锁定销量预测的月份" prop="date">
        <el-select size="small" v-model="form.date" clearable filterable multiple placeholder="请选择">
          <el-option v-for="item in dateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="submitForm()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import { getLock } from "@/api/dataAnalysis/salesForecast"

export default {
  name: "lockingDialog",
  components: {},
  props: {},
  data() {
    return {
      rules: {
        date: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      form: {
        date: ""
      },
      dateList: [],
      dynamicInformationArr: [],
      showLockingDialog: false,
      selectList: [],
      searchFormConfirm: null
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    openDialog(selectList, searchFormConfirm = null, list) {
      this.showLockingDialog = true
      this.selectList = selectList || []
      this.searchFormConfirm = searchFormConfirm
      this.dateList = []
      this.form.date = []

      if (searchFormConfirm) {
        if (searchFormConfirm.forecastBeginTime && searchFormConfirm.forecastEndTime) {
          // 获取开始和结束日期之间的所有月份
          let startDate = new Date(searchFormConfirm.forecastBeginTime)
          let endDate = new Date(searchFormConfirm.forecastEndTime)
          let dateList = []

          while (startDate <= endDate) {
            let year = startDate.getFullYear()
            let month = startDate.getMonth() + 1
            let monthStr = month < 10 ? "0" + month : month
            dateList.push({
              label: `${year}-${monthStr}`,
              value: `${year}-${monthStr}`
            })
            startDate.setMonth(startDate.getMonth() + 1)
          }

          this.dateList = dateList
          this.form.date = dateList.map((item) => item.value)
        } else if (list) {
          this.setDateList(list)
        }
      } else {
        this.setDateList(selectList[0])
      }
    },
    setDateList(list) {
      this.dateList = list.dynamicInformation
        .filter((item) => item.dayAndMonthKey !== "total")
        .map((item) => {
          return {
            label: item.dayAndMonthKey,
            value: item.dayAndMonthKey
          }
        })
    },

    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let queryPageDto = null
          let ids = []
          if (this.searchFormConfirm && !this.selectList?.length) {
            queryPageDto = this.searchFormConfirm
          } else {
            this.selectList.forEach((item) => {
              item.dynamicInformation.forEach((d) => {
                if (this.form.date.includes(d.dayAndMonthKey)) {
                  ids.push(d.id)
                }
              })
            })
          }

          await getLock({ ids, unlockDates: this.form.date, queryPageDto })
          this.$message.success("锁定成功")
          this.cancel()
          this.$emit("updateDate")
        }
      })
    },
    cancel() {
      console.log("取消")
      this.showLockingDialog = false
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped></style>
