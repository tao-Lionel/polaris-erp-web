const fs = require("fs").promises
const path = require("path")
const routes = require("./router.js")

async function getDialogTitle() {
  // 递归遍历文件夹，获取所有 .vue 文件路径
  async function getVueFiles(dirPath, arrayOfFiles = []) {
    const files = await fs.readdir(dirPath)

    for (let file of files) {
      const filePath = path.join(dirPath, file)
      const stat = await fs.stat(filePath)

      if (stat.isDirectory()) {
        await getVueFiles(filePath, arrayOfFiles)
      } else if (file.endsWith(".vue")) {
        arrayOfFiles.push(filePath)
      }
    }

    return arrayOfFiles
  }

  // 从 .vue 文件中提取 el-dialog 的 title 属性
  async function extractElDialogTitles(filePath) {
    const content = await fs.readFile(filePath, "utf-8")
    const regex = /<el-dialog[^>]*title="([^"]*)"/g
    let match
    let titles = []

    while ((match = regex.exec(content)) !== null) {
      titles.push(match[1])
    }

    return titles
  }

  // 遍历文件夹中的 .vue 文件，提取 el-dialog title 并输出到一个文件
  async function readVueFilesAndExtractTitles(dirPath, outputFilePath) {
    try {
      const vueFiles = await getVueFiles(dirPath)
      let outputData = ""

      for (const filePath of vueFiles) {
        const fileTitles = await extractElDialogTitles(filePath)
        let relativePath = path.relative(dirPath, filePath)
        relativePath = relativePath.replace(/\\/g, "/") // 替换反斜杠为正斜杠
        relativePath = relativePath.replace(/\.vue$/, "") // 去掉 .vue 扩展名
        relativePath = relativePath.replace(/\/components\/[a-zA-z]+$/g, "") // 移除路径中的 "components/xxxx"

        const fileName = path.basename(filePath, ".vue")

        fileTitles.forEach((title) => {
          const outputLine = `views/${relativePath}/${title}\n`
          outputData += outputLine // 将每一行结果添加到输出字符串
        })
      }

      // 将结果写入文件
      await fs.writeFile(outputFilePath, outputData, "utf-8")
      console.log(`Results have been written to ${outputFilePath}`)
      return outputData
    } catch (err) {
      console.error("Error:", err)
    }
  }

  // 调用函数，传递目标文件夹路径和输出文件路径
  const directoryPath = "../views" // 修改为你的文件夹路径
  const outputFilePath = "dialog_titles_output.txt" // 输出文件路径
  readVueFilesAndExtractTitles(directoryPath, outputFilePath)
}

//--------------读取菜单文件内容----------------------------//

// 读取菜单文件内容
async function readMenu() {
  // 读取文件
  try {
    const menuData = await fs.readFile("./menu.txt", "utf8")
    return menuData
  } catch (error) {
    console.error("读取文件失败:", error)
  }
}

// //------------------转换菜单中的path------------------------//

async function transformPath(data) {
  // 递归函数，将子节点的 path 拼接上父节点的 path
  function concatenatePaths(data, parentPath = "") {
    return data.map((item) => {
      // 拼接当前节点的 path
      const fullPath = parentPath ? `${parentPath}/${item.path}` : item.path

      // 如果有 children，则递归处理子节点
      if (item.children && item.children.length > 0) {
        item.children = concatenatePaths(item.children, fullPath)
      }

      // 更新当前节点的 path 为拼接后的路径
      item.path = fullPath

      return item
    })
  }

  // 调用函数处理
  const arr = await concatenatePaths(data)
  return arr
}

// 根据menu 获取一个由 {component：path } 组成的对象，用来和dialog 映射
function getMenuComponentPath(data, obj) {
  data.forEach((item) => {
    obj[item.component] = item.path

    if (item.children) {
      getMenuComponentPath(item.children, obj)
    }
  })

  return obj
}

function mappingDialog(arr, obj) {
  const result = arr.map((item) => {
    for (const key in obj) {
      if (item.startsWith(key)) {
        return item.replace(key, obj[key])
      }
    }
    return item // 如果没有匹配，返回原始项
  })

  return result
}

async function readFileIntoArray(filePath) {
  try {
    // 读取文件内容
    const data = await fs.readFile(filePath, "utf8")

    // 按行分割成数组
    const array = data.split("\n").filter((line) => line.trim() !== "")

    return array
  } catch (error) {
    console.error("读取文件失败:", error)
  }
}

function getMenuRoute(a, b) {
  // 遍历 b 数组
  b.forEach((bItem) => {
    const parentPath = bItem.children[0].meta?.parentPath // 获取 meta.parentPath
    a.forEach((aItem) => {
      // 检查 a 中的 children
      aItem.children.forEach((child) => {
        if (child.path === parentPath) {
          if (bItem.children.length > 0) {
            bItem.children.forEach((item) => {
              child.children.push(item)
            })
          }
        }
      })
    })
  })

  return a
}

function getMenuDialog(a, b) {
  b.forEach((bItem) => {
    a.forEach((aItem) => {
      aItem.children.forEach((child) => {
        if (bItem.startsWith(child.path)) {
          let arr = bItem.split("/")
          let name = ""
          arr.forEach((s) => {
            const regex = /[\u4e00-\u9fa5]/
            if (regex.test(s)) {
              name += s
            }
          })

          child.children.push({
            name: name ? name : arr[arr.length - 1],
            path: bItem
          })
        }
      })
    })
  })

  return a
}

// 写入最终结果到文件
async function writeToFile(data, outputFilePath) {
  try {
    // 将对象转换为 JSON 格式的字符串
    const jsonData = JSON.stringify(data, null, 2)

    // 将结果写入到指定文件
    await fs.writeFile(outputFilePath, jsonData, "utf-8")
    console.log(`Results have been written to ${outputFilePath}`)
  } catch (err) {
    console.error("Error writing to file:", err)
  }
}

// 替换一些特殊的弹窗路径
function replaceSpecialPaths(arr) {
  const replacements = {
    "views/baseSetup/logisticsChannelMapping/channelSetting": "views/baseSetup/logisticsChannelMapping/list",
    "views/baseSetup/logisticsChannelMapping": "views/baseSetup/logisticsChannelMapping/list"
  }

  const replacedArr = arr.map((item) => {
    // 检查每个 key 是否存在于 replacements 中
    for (const key of Object.keys(replacements)) {
      if (item.startsWith(key)) {
        // 替换匹配的部分
        return item.replace(key, replacements[key])
      }
    }
    // 如果没有匹配，则返回原始项
    return item
  })

  return replacedArr
}

async function outputRes() {
  // 获取文件夹中的.vue 文件，提取 el-dialog title
  await getDialogTitle()
  // console.log(dialogDataArr)
  const arr = await readFileIntoArray(path.resolve(__dirname, "./dialog_titles_output.txt"))

  const menuData = await readMenu()
  // console.log(menuData)
  const processedData = await transformPath(JSON.parse(menuData))
  // console.log(processedData)
  const componentPathObj = getMenuComponentPath(processedData, {})
  // console.log(componentPathObj)
  const dialogRes = mappingDialog(replaceSpecialPaths(arr), componentPathObj)

  const routesPath = await transformPath(routes)

  const menuAndRoute = getMenuRoute(processedData, routesPath)

  const menuAndDialog = getMenuDialog(menuAndRoute, dialogRes)
  await writeToFile(menuAndDialog, "result_json.txt")
}

outputRes()
