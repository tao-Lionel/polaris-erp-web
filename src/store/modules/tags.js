import { getStore, setStore } from "@/util/store"
import { diff } from "@/util/util"
import website from "@/const/website"

const isFirstPage = website.isFirstPage
const tagWel = website.fistPage
const tagObj = {
  label: "", // 标题名称
  value: "", // 标题的路径
  params: "", // 标题的路径参数
  query: "", // 标题的参数
  group: [] // 分组
}

// 处理首个标签
function setFistTag(list) {
  if (list.length == 1) {
    list[0].close = false
  } else {
    list.forEach((ele) => {
      if (ele.value === tagWel.value && isFirstPage === false) {
        ele.close = false
      } else {
        ele.close = true
      }
    })
  }
}

const navs = {
  state: {
    tagList: getStore({ name: "tagList" }) || [],
    tag: getStore({ name: "tag" }) || tagObj,
    tagWel: tagWel
  },
  actions: {},
  mutations: {
    ADD_TAG: (state, action) => {
      /*0,
      state.tag = action
      setStore({ name: 'tag', content: state.tag, type: 'session' })
      if (state.tagList.some(ele => diff(ele, action))) return;//列表中存在，直接返回,不存在往下走
  
      state.tagList.push(action)
      setFistTag(state.tagList)
      setStore({ name: 'tagList', content: state.tagList, type: 'session' })
      */
      /*
1,
      state.tag = action
      let newState = [];
      state.tagList.forEach((item, index) => {//处理重复
        let hadFlag=newState.filter(val=>{
          return val.label===item.label
        })
          if(hadFlag.length<1){
            newState.push(item);
          }
      })

      newState.forEach((val,key)=>{
        if(val.label===action.label){
          newState[key]=action;
        }
      })

     state.tagList = newState;
      setStore({ name: 'tag', content: state.tag, type: 'session' })
      if (state.tagList.some(ele => diff(ele, action))) return;//列表中存在，直接返回,不存在往下走

      state.tagList.push(action)
      setFistTag(state.tagList)
      setStore({ name: 'tagList', content: newState, type: 'session' })

*/

      /**
       * 2,
       */

      let len = 15 //tag数量
      let willRemoveTags = null
      let localActTag = getStore({ name: "actTag", type: "session" })
      let activityTag = localActTag ? localActTag.list : []
      activityTag = activityTag.filter((val) => val !== action.value)
      activityTag.push(action.value)
      if (activityTag.length >= len) {
        willRemoveTags = activityTag.filter((val, index) => index < activityTag.length - len) //需要移除的列表
        activityTag = activityTag.slice(-len) //不需要移除的保存一份,下次查询使用
      }
      state.tagList = state.tagList.filter((val) => {
        if (willRemoveTags) {
          return val.value !== willRemoveTags[0]
        } else {
          return val
        }
      })
      let content = {
        len,
        list: activityTag
      }
      setStore({ name: "actTag", type: "session", content: content })
      // ------------------以上控制tag数量-------------------------

      state.tag = action
      setStore({ name: "tag", content: state.tag, type: "session" })
      if (state.tagList.some((ele) => diff(ele, action))) return //列表中存在，直接返回,不存在往下走

      state.tagList.push(action)
      setFistTag(state.tagList)
      setStore({ name: "tagList", content: state.tagList, type: "session" })
    },
    DEL_TAG: (state, action) => {
      state.tagList = state.tagList.filter((item) => {
        return !diff(item, action)
      })
      setFistTag(state.tagList)
      setStore({ name: "tagList", content: state.tagList, type: "session" })
    },
    DEL_ALL_TAG: (state) => {
      state.tagList = [state.tagWel]
      setStore({ name: "tagList", content: state.tagList, type: "session" })
    },
    DEL_TAG_OTHER: (state) => {
      state.tagList = state.tagList.filter((item) => item.value === state.tag.value)
      setFistTag(state.tagList)
      setStore({ name: "tagList", content: state.tagList, type: "session" })
    }
  }
}
export default navs
