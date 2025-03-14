import request from "@/router/axios"

export function fetchList(query) {
  return request({
    url: "/cockpit/cocfeemaintain/page",
    method: "get",
    params: query
  })
}

export function handleImport(obj) {
  return request({
    url: "/cockpit/cocfeemaintain/handleImport",
    method: "post",
    data: obj
  })
}

export function checkTemplate(filename) {
  return request({
    url: "/cockpit/commonCockpit/checkTemplate/" + filename,
    method: "get"
  })
}
