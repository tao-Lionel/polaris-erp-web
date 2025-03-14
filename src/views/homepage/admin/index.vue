<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 24 }"
        :lg="{ span: 12 }"
        :xl="{ span: 12 }"
        style="padding-right: 8px; margin-bottom: 30px"
      >
        <transaction-table />
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 12 }"
        :lg="{ span: 6 }"
        :xl="{ span: 6 }"
        style="margin-bottom: 30px"
      >
        <todo-list />
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 12 }"
        :lg="{ span: 6 }"
        :xl="{ span: 6 }"
        style="margin-bottom: 30px"
      >
        <box-card />
      </el-col>
    </el-row>

    <!-- 联动布局 -->
    <!-- <grid-layout
      :layout.sync="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        :x="layout[0].x"
        :y="layout[0].y"
        :w="layout[0].w"
        :h="layout[0].h"
        :i="layout[0].i"
      >
        <panel-group @handleSetLineChartData="handleSetLineChartData"/>
      </grid-item>
      <grid-item
        :x="layout[1].x"
        :y="layout[1].y"
        :w="layout[1].w"
        :h="layout[1].h"
        :i="layout[1].i"
      >
        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <line-chart :chart-data="lineChartData"/>
        </el-row>
      </grid-item>

      <grid-item
        :x="layout[2].x"
        :y="layout[2].y"
        :w="layout[2].w"
        :h="layout[2].h"
        :i="layout[2].i"
      >
        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="chart-wrapper">
              <raddar-chart/>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="chart-wrapper">
              <pie-chart/>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="chart-wrapper">
              <bar-chart/>
            </div>
          </el-col>
        </el-row>
      </grid-item>

      <grid-item
        :x="layout[3].x"
        :y="layout[3].y"
        :w="layout[3].w"
        :h="layout[3].h"
        :i="layout[3].i"
      >
        <el-row :gutter="8">
          <el-col
            :xs="{span: 24}"
            :sm="{span: 24}"
            :md="{span: 24}"
            :lg="{span: 12}"
            :xl="{span: 12}"
            style="padding-right:8px;margin-bottom:30px;"
          >
            <transaction-table/>
          </el-col>
          <el-col
            :xs="{span: 24}"
            :sm="{span: 12}"
            :md="{span: 12}"
            :lg="{span: 6}"
            :xl="{span: 6}"
            style="margin-bottom:30px;"
          >
            <todo-list/>
          </el-col>
          <el-col
            :xs="{span: 24}"
            :sm="{span: 12}"
            :md="{span: 12}"
            :lg="{span: 6}"
            :xl="{span: 6}"
            style="margin-bottom:30px;"
          >
            <box-card/>
          </el-col>
        </el-row>
      </grid-item>
    </grid-layout> -->
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup"
import LineChart from "./components/LineChart"
import RaddarChart from "./components/RaddarChart"
import PieChart from "./components/PieChart"
import BarChart from "./components/BarChart"
import TransactionTable from "./components/TransactionTable"
import TodoList from "./components/TodoList"
import BoxCard from "./components/BoxCard"
// var testLayout = [
//   { x: 0, y: 0, w: 12, h: 4, i: "0" },
//   { x: 0, y: 4, w: 12, h: 10, i: "1" },
//   { x: 0, y: 12, w: 12, h: 9, i: "2" },
//   { x: 0, y: 28, w: 12, h: 14, i: "3" }
// ];
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
      // layout: testLayout//联动布局数据
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
