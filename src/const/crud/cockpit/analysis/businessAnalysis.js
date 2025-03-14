export const series = [
  {
    name: "税后净利润",
    type: "line",
    smooth: false,
    data: [1200, 132, 101, 134, 90, 230, 210],
    itemStyle: {
      color: "#c23531"
    }
  },
  {
    name: "营业利润",
    type: "line",
    smooth: false,
    data: [220, 182, 191, 234, 290, 330, 310],
    itemStyle: {
      color: "#2f4554"
    }
  },
  {
    name: "销售成本",
    type: "line",
    smooth: false,
    data: [150, 232, 201, 154, 190, 330, 410],
    itemStyle: {
      color: "#61a0a8"
    }
  },
  {
    name: "销售收入",
    type: "line",
    smooth: false,
    data: [320, 332, 301, 334, 390, 330, 320],
    itemStyle: {
      color: "#d48265"
    }
  }
  // {
  //     name:'备用',
  //     type:'line',
  //     smooth: false,
  //     stack: '总量',
  //     data:[820, 932, 901, 934, 1290, 1330, 1320],
  //     itemStyle:{
  //       color:"#91c7ae"
  //     }
  // }
]
export function initDateCurr() {
  let currentDate = new Date()
  let year = currentDate.getFullYear()
  let mon = currentDate.getMonth()
  if (mon == 0) {
    year = year - 1
    mon = 12
  }
  return year + (mon > 9 ? "" + mon : "0" + mon)
}
export function getDateByMonthOrYear(reType) {
  if (reType === "month") {
    return getDateMonth()
  } else if (reType === "quarter") {
    return getDateQuarter()
  } else if (reType === "year") {
    return getDateYear()
  }
}
//开始时间默认2019年
let intiYear = 2019
function getDateMonth() {
  //当前年的12个月 格式 yyyy年MM月
  let currentDate = new Date()
  let year = currentDate.getFullYear()
  let mon = currentDate.getMonth() + 1
  let temp = year
  let dateArr = []
  while (temp >= intiYear && temp <= year) {
    for (let i = 12; i >= 1; i--) {
      if (temp == year && mon <= i) {
        continue
      } else {
        let everMonth = {}
        everMonth.label = temp + "年" + i + "月"
        everMonth.value = temp + "" + (i > 9 ? "" + i : "0" + i)
        dateArr.push(everMonth)
      }
    }
    temp--
  }
  return dateArr
}
function getDateQuarter() {
  //开始时间默认2019年
  //当前年的四个季度 格式 yyyy年第几季度
  let currentDate = new Date()
  let year = currentDate.getFullYear()
  let mon = currentDate.getMonth() + 1
  let temp = year
  let dateArr = []
  let m1 = 0
  let m2 = 0
  while (temp >= intiYear && temp <= year) {
    for (let i = 4; i >= 1; i--) {
      m1 = (i - 1) * 3 + 1
      m2 = i * 3
      if (temp == year && mon <= m2) {
        continue
      } else {
        let everMonth = {}
        everMonth.label = temp + "年第" + i + "季度"
        everMonth.value = temp + "-" + (m1 > 9 ? "" + m1 : "0" + m1) + "," + temp + "-" + (m2 > 9 ? "" + m2 : "0" + m2)
        dateArr.push(everMonth)
      }
    }
    temp--
  }
  return dateArr
}

function getDateYear() {
  //获取年时间
  //开始时间默认2019年 格式yyyy年
  // let intiYear = 2019;
  let currentDate = new Date()
  let year = currentDate.getFullYear()
  let temp = year
  let dateArr = []
  while (temp >= intiYear && temp <= year) {
    dateArr.push({ label: temp + "年", value: temp })
    temp--
  }
  return dateArr
}
