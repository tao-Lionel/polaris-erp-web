import request from "@/router/axios"

/**
 *
 * 规则分类列表
 */
export function getSceneClassificationPage(obj) {
  return request({
    url: "/baseSetup/generalRule/sceneClassification/listPage",
    method: "post",
    data: obj
  })
}

/**
 * 场景分类-增加记录
 */
export function addClassification(obj) {
  return request({
    url: "/baseSetup/generalRule/sceneClassification/add",
    method: "post",
    data: obj
  })
}

/**
 * 场景分类-根据id修改记录
 */
export function updateClassification(obj) {
  return request({
    url: "/baseSetup/generalRule/sceneClassification/update",
    method: "post",
    data: obj
  })
}

/**
 * 场景分类-根据id删除记录
 */
export function deleteClassificationById(id) {
  return request({
    url: `/baseSetup/generalRule/sceneClassification/deleteById?id=${id}`,
    method: "post"
  })
}

/**
 * 场景分类-根据classId获取显示JSON
 */
export function getClassDisplayJson(obj) {
  return request({
    url: `/baseSetup/generalRule/sceneClassification/getDisplayJson`,
    method: "post",
    data: obj
  })
}

/**
 * 场景分类-根据classId保存roleIds
 */
export function saveRoleIdsByClassId(obj) {
  return request({
    url: `/baseSetup/generalRule/sceneClassification/saveRoleIdsByClassId`,
    method: "post",
    data: obj
  })
}

/**
 * 场景分类-根据classId获取roleIds
 */
export function getListRoleIdsByClassId(obj) {
  return request({
    url: `/baseSetup/generalRule/sceneClassification/listRoleIdsByClassId`,
    method: "post",
    data: obj
  })
}
