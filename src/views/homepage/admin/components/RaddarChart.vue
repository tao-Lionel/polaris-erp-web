<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts"
require("echarts/theme/macarons") // echarts theme
import { debounce } from "@/util/util.js"

const animationDuration = 3000

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener("resize", this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener("resize", this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons")

      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: "66%",
          center: ["50%", "42%"],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: "rgba(127,95,132,.3)",
              opacity: 1,
              shadowBlur: 45,
              shadowColor: "rgba(0,0,0,.5)",
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: "采购", max: 10000 },
            { name: "中转仓", max: 20000 },
            { name: "头程", max: 20000 },
            { name: "海外", max: 20000 },
            { name: "FBA", max: 20000 },
            { name: "销售", max: 20000 }
          ]
        },
        legend: {
          left: "center",
          bottom: "10",
          data: ["阈值", "计划", "实际"]
        },
        series: [
          {
            type: "radar",
            symbolSize: 0,
            areaStyle: {
              normal: {
                shadowBlur: 13,
                shadowColor: "rgba(0,0,0,.2)",
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                opacity: 1
              }
            },
            data: [
              {
                value: [5000, 7000, 12000, 11000, 15000, 14000],
                name: "阈值"
              },
              {
                value: [4000, 9000, 15000, 15000, 13000, 11000],
                name: "计划"
              },
              {
                value: [5500, 11000, 12000, 15000, 12000, 12000],
                name: "实际"
              }
            ],
            animationDuration: animationDuration
          }
        ]
      })
    }
  }
}
</script>
