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
      default: "350px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    // chartData: {
    //   type: Object,
    //   required: true
    // },
    xData: {
      type: Array,
      required: true
    },
    legenData: {
      type: Array,
      required: true
    },
    seriesData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    }
  },
  watch: {},
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener("resize", this.__resizeHandler)
    }

    // 监听侧边栏的变化
    // this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    // this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener("transitionend", this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === "width") {
        this.__resizeHandler()
      }
    },
    setOptions(xData, legenData, seriesData) {
      this.chart.clear()
      this.chart.setOption({
        title: {
          text: "经营分析折线图"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: legenData //['税后净利润','营业利润','销售成本','销售额','备用']
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData //['周一','周二','周三','周四','周五','周六','周日']
        },
        yAxis: {
          type: "value"
        },
        series: seriesData
      })
    },
    initChart() {
      // console.log(this.xData)
      this.chart = echarts.init(this.$el, "macarons")
      this.setOptions(this.xData, this.legenData, this.seriesData)
    }
  }
}
</script>
