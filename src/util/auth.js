import Cookies from "js-cookie"
import { getObjByType } from "@/api/admin/dict"

const TokenKey = "x-access-token"

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTokenUrl(url) {
  const regxp = /access_token/gi
  if (regxp.test(url)) return url
  url = "/api/download" + (url[0] === "/" ? url : "/" + url)
  var token = getToken()
  if (url.indexOf("?") > 0) {
    url = url + "&access_token=" + token
  } else {
    url = url + "?access_token=" + token
  }
  return encodeURI(url)
}

/**url拼接token */
export function getUrlConcatToken(url) {
  var token = getToken()
  if (url.indexOf("?") > 0) {
    url = url + "&access_token=" + token
  } else {
    url = url + "?access_token=" + token
  }
  return encodeURI(url)
}

export function getTokenUrlFile(url) {
  const regxp = /access_token/gi
  if (regxp.test(url)) return url
  url = url[0] === "/" ? url : "/" + url
  var token = getToken()
  if (url.indexOf("?") > 0) {
    url = url + "&access_token=" + token
  } else {
    url = url + "?access_token=" + token
  }
  return encodeURI(url)
}

// 通过文件流下载文件
/**
 * @param {*} content 文件流
 * @param {*} fileName 文件名
 * @param {*} contentType 文件类型
 **/
export function downloadBlob(content, fileName, contentType) {
  const a = document.createElement("a")
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

export function newGetTokenUrl(url) {
  const regxp = /access_token/gi
  if (regxp.test(url)) return url
  url = "/api" + (url[0] === "/" ? url : "/" + url)
  var token = getToken()
  if (url.indexOf("?") > 0) {
    url = url + "&access_token=" + token
  } else {
    url = url + "?access_token=" + token
  }
  return encodeURI(url)
}

// 通过url下载文件
/**
 * @param {*} url 文件url
 * @param {*} fileName 文件名
 */
export function downloadFileByUrl(url, fileName) {
  const x = new XMLHttpRequest()
  x.open("GET", getTokenUrl(url), true)
  x.responseType = "blob"
  x.onload = function (e) {
    const blobUrl = window.URL.createObjectURL(x.response)
    const a = document.createElement("a")
    a.href = blobUrl
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(blobUrl)
  }
  x.send()
}

// 根据type获取字典
/**
 * @param {*} type
 * @returns 字典
 */
export async function getDictByType(type) {
  const { data } = await getObjByType(type)
  if (data.code === 0) {
    return data.data
  }
}

// 获取文件扩展名
/**
 * @param {*} filename 文件名
 * @returns 文件扩展名
 */
export function getFileExtension(filename) {
  const lastDotIndex = filename.lastIndexOf(".")
  if (lastDotIndex === -1) return "" // 没有扩展名
  return filename.substring(lastDotIndex + 1).toLowerCase()
}

/**
 * 处理搜索参数，过滤空值并格式化为统一格式
 * @param {Object} obj - 原始搜索参数对象
 * @param {Object} operatorParams - 特殊参数对象
 * IN("包含", "%s in (%s)", Integer.MAX_VALUE),
    EQUAL("等于", "%s in (%s)", Integer.MAX_VALUE),
    GREATER_THAN("大于", "%s > ?", 1),
    LESS_THAN("小于", "%s < ?", 1),
    NOT_EQUAL("不等于", "%s != ?", 1),
    LIKE("%模糊搜索%", "%s like concat('%%',?,'%%')", 1),
    LIKE_RIGHT("模糊搜索%", "%s like concat(?,'%%')", 1),
    LIKE_LEFT("%模糊搜索", "%s like concat('%%',?)", 1),
    EMPTY("空值", "%s = ''", 1),
    BETWEEN("区间", "%s between ? and ?", 2);
 *
 * @param {String} linkOperator - 链接操作符 默认LIKE 可选LIKE_RIGHT LIKE_LEFT
 * @returns {Array} 处理后的参数数组，每项包含 field 和 value
 */
export function setFiltering(obj, operatorParams = {}, linkOperator = "LIKE") {
  return Object.keys(obj)
    .filter((key) => {
      const value = obj[key]
      // 跳过空值、undefined、null
      if (value === undefined || value === null || value === "") {
        return false
      }
      // 过滤空数组
      if (Array.isArray(value) && value.length === 0) return false
      return true
    })
    .map((key) => {
      const value = obj[key]
      let operator = "IN"
      // 如果是string，并且没有逗号，operator则为LIKE
      if (typeof value === "string" && !value.includes(",")) {
        operator = linkOperator
      }
      return {
        field: key,
        operator: operatorParams[key] || operator,
        value: Array.isArray(value)
          ? value
          : typeof value === "string" && value.includes(",")
          ? value.split(",")
          : [value]
      }
    })
}

// 处理排序
export function setOrderBy(column, orderBy) {
  if (!column?.prop || !column?.order) {
    return orderBy
  }
  const orderMap = { descending: "desc", ascending: "asc" }

  return [{ field: column.prop, order: orderMap[column.order] }]
}

// 下载文件时询问保存地址
export async function saveFileAs(data, fileName, mimeType) {
  try {
    // 确保浏览器支持 showSaveFilePicker
    if (!window.showSaveFilePicker) {
      throw new Error("Your browser does not support the File System Access API.")
    }

    // 设置文件类型
    const fileTypes = {
      "image/png": ".png",
      "image/jpeg": ".jpg",
      "application/pdf": ".pdf",
      "text/csv": ".csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
      "application/zip": ".zip"
    }

    const extension = fileTypes[mimeType] || ""

    // 调用文件选择器
    const handle = await showSaveFilePicker({
      suggestedName: fileName + extension,
      types: [
        {
          description: "Files",
          accept: { [mimeType]: [extension] }
        }
      ]
    })

    // 获取文件流
    const writable = await handle.createWritable()

    // 如果是 Blob 类型，直接写入
    if (data instanceof Blob) {
      await writable.write(data)
    } else if (typeof data === "string") {
      // 纯文本 / Base64 转换
      await writable.write(new Blob([data], { type: mimeType }))
    } else {
      throw new Error("Unsupported data type. Use Blob or string.")
    }

    // 关闭文件
    await writable.close()
    console.log("File saved successfully!")
  } catch (error) {
    console.error("Error saving file:", error)
  }
}
