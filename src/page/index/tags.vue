<template>
  <div class="avue-tags" v-if="showTag">
    <!-- tag盒子 -->
    <div class="tags-box" ref="tagBox">
      <el-tabs v-model="active" type="card" :closable="tagLen !== 1" @tab-click="openTag" @edit="menuTag">
        <el-tab-pane :key="item.value" v-for="item in tagList" :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>
      <el-dropdown class="tags-menu pull-right">
        <el-button size="mini">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="refreshCurTag">刷新</el-dropdown-item>
          <el-dropdown-item @click.native="closeOthersTags">关闭其他</el-dropdown-item>
          <el-dropdown-item @click.native="closeAllTags">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex"
import { deepClone } from "../../components/avue/utils/util"
import { getStore, setStore } from "@/util/store"
export default {
  name: "tags",
  data() {
    return {
      active: ""
    }
  },
  mounted() {
    this.setActive()
  },
  watch: {
    tag() {
      this.setActive()
    }
  },
  updated() {
    let actTag = getStore({ name: "actTag", type: "session" })
    if (actTag.list.length >= actTag.len) {
      //达到设置数量时清除
      this.clearClosedTagsCache()
    }
  },
  computed: {
    ...mapGetters(["tagWel", "tagList", "tag"]),
    ...mapState({
      showTag: (state) => state.common.showTag
    }),
    tagLen() {
      return this.tagList.length || 0
    }
  },
  methods: {
    //激活当前选项
    setActive() {
      this.active = this.tag.value
    },
    menuTag(value, action) {
      if (action === "remove") {
        let { tag, key } = this.findTag(value)
        this.$store.commit("DEL_TAG", tag)
        if (tag.value === this.tag.value) {
          tag = this.tagList[key === 0 ? key : key - 1] //如果关闭本标签让前推一个
          this.openTag(tag)
        }
        /*先注释掉，采用全局无条件按路由缓存，不做单独的缓存
        if (oldTag.isLocalStore) {
          console.log("移除缓存" + oldTag.value);
          sessionStorage.removeItem(oldTag.value);
        }*/

        //清理已关闭的标签缓存
        let actTag = getStore({ name: "actTag", type: "session" })
        actTag.list = actTag.list.filter((val) => val !== value)
        setStore({ name: "actTag", type: "session", content: actTag })
        this.clearClosedTagsCache()
      }
    },
    clearClosedTagsCache(keysList) {
      let needRemoveList = []
      this.$parent.$children.forEach((ele) => {
        if (
          ele.$vnode.key &&
          (!this.tagList.some((tag) => {
            return tag.value === ele.$vnode.key
          }) ||
            (keysList && keysList.length > 0 && keysList.indexOf(ele.$vnode.key) != -1))
        ) {
          needRemoveList.push(ele)
        }
      })
      this.clearKeepaliveCache(needRemoveList)
    },

    closeTag(tagValue, parentTagValue, needRefreshParent) {
      let { tag, key } = this.findTag(tagValue)
      this.$store.commit("DEL_TAG", tag)

      if (parentTagValue) {
        //清理已关闭的标签缓存
        if (needRefreshParent) {
          this.clearClosedTagsCache([parentTagValue])
        } else {
          this.clearClosedTagsCache()
        }
        let { tag, key } = this.findTag(parentTagValue)
        this.openTag(tag)
      } else {
        if (tag.value === this.tag.value) {
          tag = this.tagList[key === 0 ? key : key - 1] //如果关闭本标签让前推一个
          this.openTag(tag)
        }
        //清理已关闭的标签缓存
        this.clearClosedTagsCache()
      }
    },
    /*
      清空指定页签的缓存
    */
    clearTagCache(key) {
      let needRemoveList = []
      this.$parent.$children.forEach((ele) => {
        if (ele.$vnode.key && ele.$vnode.key === key) {
          needRemoveList.push(ele)
        }
      })
      this.clearKeepaliveCache(needRemoveList)
    },

    /*
      清理指定组件缓存
    */
    clearKeepaliveCache(needRemoveList) {
      if (needRemoveList && needRemoveList.length > 0) {
        needRemoveList.forEach((ele) => {
          if (ele.$vnode && ele.$vnode.data.keepAlive) {
            if (ele.$vnode.parent && ele.$vnode.parent.componentInstance && ele.$vnode.parent.componentInstance.cache) {
              if (ele.$vnode.componentOptions) {
                var key = ele.$vnode.key
                var cache = ele.$vnode.parent.componentInstance.cache
                var keys = ele.$vnode.parent.componentInstance.keys
                if (cache[key]) {
                  if (keys.length) {
                    var index = keys.indexOf(key)
                    if (index > -1) {
                      keys.splice(index, 1)
                    }
                  }
                  delete cache[key]
                  ele.$destroy()
                }
              }
            }
          }
        })
      }
    },

    openTag(item) {
      //  点击切换
      let tag
      if (item.name) {
        tag = this.findTag(item.name).tag
      } else {
        tag = item
      }
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: tag.label,
          src: tag.value
        }),
        query: tag.query
      })
    },
    findTag(value) {
      let tag, key
      this.tagList.map((item, index) => {
        if (item.value === value) {
          tag = item
          key = index
        }
      })
      return { tag: tag, key: key }
    },
    //刷新当前tags
    refreshCurTag() {
      this.clearTagCache(this.tag.value)

      const fullPath = this.tag.value
      this.$nextTick(() => {
        this.$router.replace({
          path: "/refresh" + fullPath
        })
      })
    },
    //关闭其他TAGS
    closeOthersTags() {
      //var tagsList = deepClone(this.tagList);
      this.$store.commit("DEL_TAG_OTHER")
      /*先注释掉，采用全局无条件按路由缓存，不做单独的缓存
      tagsList.forEach(element => {
        if (element.isLocalStore) {
          console.log("移除缓存" + element.value);
          sessionStorage.removeItem(element.value);
        }
      });*/
      //清理已关闭的标签缓存
      this.cleanOtherOrAll(this.$route.fullPath)
      this.clearClosedTagsCache()
    },
    //关闭所有TAGS
    closeAllTags() {
      //var tagsList = deepClone(this.tagList);
      let path = this.$router.$avueRouter.getPath({
        src: this.tagWel.value
      })
      this.$store.commit("DEL_ALL_TAG")
      this.$router.push({
        path: path,
        query: this.tagWel.query
      })
      /*先注释掉，采用全局无条件按路由缓存，不做单独的缓存
      tagsList.forEach(element => {
        if (element.isLocalStore) {
          console.log("移除缓存" + element.value);
          sessionStorage.removeItem(element.value);
        }
      });
      console.log(tagsList);
      */
      this.cleanOtherOrAll(path)
      //清理已关闭的标签缓存
      this.clearClosedTagsCache()
    },
    cleanOtherOrAll(url) {
      let actTag = getStore({ name: "actTag", type: "session" })
      if (actTag && actTag.list) {
        delete actTag.list
        actTag.list = [url]
      }
      setStore({ name: "actTag", type: "session", content: actTag })
    }
  }
}
</script>
