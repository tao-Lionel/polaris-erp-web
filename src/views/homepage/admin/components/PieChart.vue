<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts"
require("echarts/theme/macarons") // echarts theme
import { debounce } from "@/util/util.js"

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
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          left: "center",
          bottom: "10",
          data: ["品牌一部", "品牌二部", "品牌三部", "品牌四部", "品牌五部"]
        },
        calculable: true,
        series: [
          {
            name: "WEEKLY WRITE ARTICLES",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "38%"],
            data: [
              { value: 320, name: "品牌一部" },
              { value: 240, name: "品牌二部" },
              { value: 149, name: "品牌三部" },
              { value: 100, name: "品牌四部" },
              { value: 59, name: "品牌五部" }
            ],
            animationEasing: "cubicInOut",
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
