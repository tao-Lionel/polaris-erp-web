<template>
  <div id="busAna">
    <basic-container>
      <div class="searchDiv">
        <el-form :inline="true" :model="searchForm" size="mini" class="search-form-inline">
          <el-form-item label="经营表">
            <el-select v-model="searchForm.reType" placeholder="请选择" @change="changeReType">
              <el-option label="月报" value="month"></el-option>
              <el-option label="季报" value="quarter"></el-option>
              <el-option label="年报" value="year"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.date" filterable placeholder="请选择">
              <el-option
                v-for="(item, index) in dateArr"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
              <!-- <el-option label="2019年1月" value="201901"></el-option>
          <el-option label="2019年2月" value="201902"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="销售组">
            <el-select v-model="searchForm.group" filterable placeholder="请选择" clearable multiple collapse-tags>
              <el-option
                v-for="(item, index) in groupArr"
                :key="index"
                :label="item.name"
                :value="item.groupId"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="店铺">
        <el-select v-model="searchForm.account" placeholder="全部店铺">
          <el-option label="店铺1" value="1"></el-option>
          <el-option label="店铺2" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="searchForm.sit" placeholder="全部站点">
          <el-option label="站点1" value="1"></el-option>
          <el-option label="站点2" value="2"></el-option>
        </el-select>
      </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="searchClick">查询</el-button>
            <el-button @click="resetClick">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="echartDiv">
        <line-chart ref="lineChart" :xData="xData" :legenData="legenData" :seriesData="seriesData" />
      </div>
      <div class="tableDiv">
        <el-button type="primary" size="small" @click="handleExport" v-if="permissions.business_analysis_export"
          >导出</el-button
        >
        <table-compent :tableOption="tableOption" ref="tableCompent" headerTitle="经营分析总览"></table-compent>
      </div>
    </basic-container>
  </div>
</template>

<script>
import LineChart from "./components/LineChart"
import tableCompent from "./components/tableCompent"
import { series, getDateByMonthOrYear, initDateCurr } from "@/const/crud/cockpit/analysis/businessAnalysis"
import { gainAnalysisLine, gainTableData } from "@/api/cockpit/analysis/businessAnalysis"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { deepClone } from "../../../components/avue/utils/util"
import { getUserTableAuth } from "@/api/cockpit/analysis/businessAnalysis"
import { option } from "@/const/crud/cockpit/analysis/components/tableCompent"
import { getUrlConcatToken } from "@/util/auth"
export default {
  name: "DashboardAdmin",
  components: {
    LineChart,
    tableCompent
  },
  mounted() {
    this.seriesData = series
    this.initData()
    this.searchClick()
  },
  created() {},
  activated() {
    this.$refs.lineChart.__resizeHandler()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      // layout: testLayout//联动布局数据
      xData: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      legenData: ["税后净利润", "营业利润", "销售成本", "销售额"],
      seriesData: [],
      searchForm: {
        reType: "",
        date: "",
        group: []
      },
      searchFormTemp: {},
      dateArr: getDateByMonthOrYear("month"),
      groupArr: [],
      tableOption: {
        expandAll: false,
        columns: [
          {
            text: "项目",
            value: "itemName"
          },
          {
            text: "行次",
            value: "itemId",
            type: "dic"
          },
          {
            text: "全部",
            value: "itemSumFee"
          }
        ],
        data: []
      }
    }
  },
  methods: {
    initData() {
      this.dateArr = getDateByMonthOrYear("month")
      this.searchForm.reType = "month"
      this.searchForm.date = initDateCurr()
      //获取当前用户销售组
      getUserTableAuth().then((res) => {
        let datas = res.data.data
        datas.forEach((obj, index) => {
          this.groupArr.push({
            name: obj.groupName,
            groupId: obj.groupId.substring(4)
          })
          this.tableOption.columns.push({
            text: obj.groupName,
            value: obj.groupId
          })
        })
      })
    },
    initOption() {
      this.tableOption = {
        expandAll: false,
        columns: [
          {
            text: "项目",
            value: "itemName"
          },
          {
            text: "行次",
            value: "itemId",
            type: "dic"
          },
          {
            text: "全部",
            value: "itemSumFee"
          }
        ],
        data: []
      }
    },
    changeReType(val) {
      this.searchForm.date = ""
      this.dateArr = getDateByMonthOrYear(val)
      this.searchForm.date = this.dateArr[0].value
      if (val == "month") {
        this.xData = [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月"
        ]
      } else if (val == "quarter") {
        this.xData = ["第一季度", "第二季度", "第三季度", "第四季度"]
      } else if (val == "year") {
        var d = new Date()
        var y = d.getFullYear()
        console.log(y)
        this.xData = []
        for (var i = 0; i <= y - 2019; i++) {
          this.xData.push(2019 + i)
        }
      }
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    searchClick() {
      //查询
      this.searchFormTemp = deepCloneIgnoreNull(this.searchForm)
      this.gainAnalysisLine(this.searchFormTemp)
      this.gianTableData(this.searchFormTemp)
    },
    /**
     * 经营分析折线图
     */
    gainAnalysisLine(form) {
      // this.seriesData = [];
      // this.$refs.lineChart.setOptions(this.xData,this.legenData,this.seriesData)
      this.legenData = []
      this.seriesData = []
      gainAnalysisLine(Object.assign(form)).then((res) => {
        let resT = res.data.data
        if (resT != null) {
          resT.forEach((r) => {
            this.legenData.push(r.name)
            let s = series.filter((s) => s.name == r.name)
            s[0].data = r.profits
            this.seriesData.push(s[0])
          })
          this.$refs.lineChart.setOptions(this.xData, this.legenData, this.seriesData)
        } else {
          this.seriesData = []
          this.$refs.lineChart.setOptions(this.xData, [], [])
        }
        // console.log(this.xData,this.legenData,this.seriesData)
      })
    },
    gianTableData(form) {
      gainTableData(Object.assign(form)).then((res) => {
        let tableData = res.data.data
        this.$refs.tableCompent.setTableData(tableData, deepCloneIgnoreNull(this.searchForm))
      })
    },
    resetClick() {
      //重置请求参数
      this.searchForm = {
        reType: "",
        date: "",
        group: []
      }
      this.dateArr = getDateByMonthOrYear("month")
      this.xData = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
      this.searchForm.reType = "month"
      this.searchForm.date = initDateCurr()
      this.searchFormTemp = {}
    },
    //导出报表
    handleExport() {
      var search = deepCloneIgnoreNull(this.searchForm)
      let par = ""
      Object.keys(search).forEach((key) => {
        if (search[key]) {
          par += "&" + key + "=" + search[key]
        }
      })
      window.location = getUrlConcatToken(`/api/cockpit/analysis/handleExport`) + par
    }
  }
}
</script>
<style lang="scss">
@import "./businessAnalysis.scss";
</style>
