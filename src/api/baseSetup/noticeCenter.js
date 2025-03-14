import request from "@/router/axios"

// 获取公告列表
export function getAnnouncementListPageApi(obj) {
  return request({
    url: "/baseSetup/announcement/getAnnouncementListPage",
    method: "post",
    data: obj
  })
}

// 获取已发布公告
export function getPublishAnnouncementListPageApi(data) {
  return request({
    url: "/baseSetup/announcement/getPublishAnnouncementListPage",
    method: "post",
    data
  })
}

// 保存或修改公告
export function saveOrUpdateAnnouncementApi(data) {
  return request({
    url: "/baseSetup/announcement/saveOrUpdateAnnouncement",
    method: "post",
    data
  })
}

// 发布公告
export function publishAnnouncementApi(params) {
  return request({
    url: "/baseSetup/announcement/publishAnnouncement",
    method: "get",
    params
  })
}

// 撤销发布
export function unPublishAnnouncementApi(params) {
  return request({
    url: "/baseSetup/announcement/unPublishAnnouncement",
    method: "get",
    params
  })
}

// 获取公告详情
export function getAnnouncementDetailApi(params) {
  return request({
    url: "/baseSetup/announcement/getAnnouncementDetail",
    method: "get",
    params
  })
}

// 获取当前用户未读的三条公告弹窗展示
export function getAnnouncementAlertListApi(data) {
  return request({
    url: "/baseSetup/announcement/getAnnouncementAlertList",
    method: "post",
    data
  })
}

// 当前用户读公告
export function getAnnouncementReadApi(params) {
  return request({
    url: "/baseSetup/announcement/read",
    method: "get",
    params
  })
}

// 上传公告附件图片
export function uploadAnnouncementFileAPi(data) {
  return request({
    url: "/baseSetup/announcement/upload",
    method: "post",
    data
  })
}
