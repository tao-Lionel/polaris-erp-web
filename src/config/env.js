// 配置编译环境和线上环境之间的切换
const env = process.env
let baseUrl = ""
// 图表库为avue和trob2套地址  1037346_41ysdfvopg3
let iconfontVersion = ["font_1037346_28o5boczfve"]
let iconfontUrl = `//at.alicdn.com/t/c/$key.css`
let codeUrl = `/api/code`
let actUrl = `${window.origin}/api/act/modeler.html?modelId=`
if (env.NODE_ENV == "development") {
} else if (env.NODE_ENV == "production") {
} else if (env.NODE_ENV == "test") {
}
export { baseUrl, actUrl, iconfontUrl, iconfontVersion, codeUrl, env }
