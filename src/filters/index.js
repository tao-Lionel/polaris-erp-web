function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + "s"
}

export function dateFormat(date, formateStr) {
  /**
   * 日期格式化
   * date为日期，如new Date()
   * formateStr 为格式，如yyyy-MM-dd、yy-M-dd
   *
   * 0，默认转出格式：2019-05-09 11:24:22
   * 1，支持 2019-05-09
   * 2，支持 2019/05/09
   *
   * 使用案例：dateFormat(new Date(),'yy/M/dd')
   */

  let format = formateStr || "yyyy-MM-dd hh:mm:ss"
  if (date != "Invalid Date") {
    const o = {
      "M+": date.getMonth() + 1, // month
      "d+": date.getDate(), // day
      "h+": date.getHours(), // hour
      "m+": date.getMinutes(), // minute
      "s+": date.getSeconds(), // second
      "q+": Math.floor((date.getMonth() + 3) / 3), // quarter
      S: date.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
      }
    }
    return format
  }
  return ""
}

export function timeAgo(time) {
  /**
   * time 为时间戳 如：1557374103416
   * 计算当前时间与目标时间两个时间之差
   * 返回具体时间，如：1 days、10 天
   * 使用案例：timeAgo(1557173821956)
   */

  const between = Date.now() / 1000 - Number(time) / 1000
  if (between < 3600) {
    return pluralize(~~(between / 60), " minute")
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), " hour")
  } else {
    return pluralize(~~(between / 86400), " day")
  }
}

export function parseTime(time, cFormat) {
  /**
   * date 为日期，如new Date()
   * formateStr 为格式
   * 可返回任意组合格式的日期、时间、周几
   * 使用案例：
   * parseTime(new Date(),'{y}-{m}')  //返回 2019-05
   * parseTime(new Date(),'{m}-{d}-{a}')   //返回 05-09-四，a为周四
   * parseTime(new Date(),'{m}/{d}/{a}')   //返回 05/09/四，a为周四
   *
   *
   */
  if (arguments.length === 0) {
    return null
  }

  if ((time + "").length === 10) {
    time = +time * 1000
  }

  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}"
  let date
  if (typeof time === "object") {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === "a") return ["一", "二", "三", "四", "五", "六", "日"][value - 1]
    if (result.length > 0 && value < 10) {
      value = "0" + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return "刚刚"
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前"
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前"
  } else if (diff < 3600 * 24 * 2) {
    return "1天前"
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + "月" + d.getDate() + "日" + d.getHours() + "时" + d.getMinutes() + "分"
  }
}

/* 数字 格式化 */
export function nFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
    }
  }
  return num.toString()
}

export function html2Text(val) {
  const div = document.createElement("div")
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","))
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ""
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length)
}
