<template>
  <div class="summariesList" id="summariesList">
    <div class="scene-content">
      <i class="el-icon-menu" style="color: #fff; background-color: orange; border-radius: 3px"></i>

      <el-select class="scene-title" size="small" v-model="sceneId" placeholder="请选择" @change="changeSceneId">
        <el-option v-for="item in sceneIdList" :key="item.value" :label="item.label" :value="item.id"> </el-option>
      </el-select>
    </div>
    <basic-container>
      <div class="rules-box">
        <div class="classify">
          <p style="padding: 5px 0">分类汇总</p>
          <el-input size="small" placeholder="输入关键字进行过滤" v-model="filterText" clearable> </el-input>

          <el-tree
            highlight-current
            class="filter-tree"
            :data="leftSceneClassificationList"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            ref="tree"
            :node-key="'id'"
            @node-click="nodeClick"
          >
          </el-tree>
        </div>
        <div class="table-box">
          <avue-crud
            ref="crud"
            :page="page"
            :data="tableData"
            :option="tableOption"
            :rowKey="'code'"
            @refresh-change="refreshChange"
            @search-change="searchChange"
            @search-reset="searchReset"
            @size-change="sizeChange"
            @current-change="currentChange"
          >
            <template slot-scope="scope" slot="search">
              <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
                <el-form-item prop="name">
                  <el-input v-model="searchForm.name" size="small" placeholder="名称" v-search-input></el-input>
                </el-form-item>
              </el-form>
            </template>

            <template slot-scope="scope" slot="classIdName">
              <span>
                {{ findLabelById(scope.row.classId) }}
              </span>
            </template>

            <template slot-scope="scope" slot="typeName">
              <span>
                <el-tag type="" size="mini" effect="plain" v-if="scope.row.typeName == '变量'">{{
                  scope.row.typeName
                }}</el-tag>
                <el-tag type="success" size="mini" effect="plain" v-else-if="scope.row.typeName == '函数'">{{
                  scope.row.typeName
                }}</el-tag>
                <el-tag type="warning" size="mini" effect="plain" v-else>{{ scope.row.typeName }}</el-tag>
              </span>
            </template>

            <template slot-scope="scope" slot="createTime">
              {{ scope.row.createName }}
              <br />
              {{ scope.row.createTime }}
            </template>
            <template slot-scope="scope" slot="updateTime">
              {{ scope.row.updateName }}
              <br />
              {{ scope.row.updateTime }}
            </template>
            <template slot-scope="{ row }" slot="opeSlot">
              <el-button
                class="opt-button"
                size="small"
                type="text"
                v-if="permissions.baseSetup_rule_summaries_detail"
                @click="handleDetail(row)"
                >查看</el-button
              >
            </template>
          </avue-crud>
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { tableOption } from "./index.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { getVariablesPage, addVariables, updateVariables } from "@/api/ruleEngineConfig/variables.js"
import { listPageByQuery } from "@/api/ruleEngineConfig/summaries.js"
import { getSceneClassificationPage, getClassDisplayJson } from "@/api/ruleEngineConfig/classification.js"
import { getStore, setStore } from "@/util/store"
import { setFiltering } from "@/util/auth"
import { cloneDeep } from "lodash"

export default {
  name: "summariesList",
  data() {
    return {
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      //搜索条件，和前端控件绑定
      searchForm: {
        name: "",
        status: "VALID",
        sceneId: "",
        classId: ""
      },
      operatorParams: {
        name: "LIKE",
        status: "EQUAL",
        sceneId: "EQUAL",
        classId: "EQUAL"
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,

      title: "添加变量",

      addForm: {
        code: "",
        name: "",
        sceneId: "",
        classIdArr: [], // 分类的绑定数据[1,1,1]
        generalValueType: "",
        value: "",
        remark: "",
        version: ""
      },

      dialogEditStatus: false,
      versionVisible: false,
      authorityVisible: false,
      generalValueTypeList: [],
      // 分类列表
      sceneClassificationList: [],
      leftSceneClassificationList: [],
      floatLeftSceneClassificationList: [],
      editFlag: false,
      currentRow: {}, // 当前行
      currentDetail: {}, // 当前行
      sceneIdList: [], // 场景 顶层
      sceneId: "",
      currentVersionsList: [],
      versionsPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      currentCode: ""
    }
  },
  components: {},
  created() {},
  async mounted() {
    await this.getClassDisplayJson({
      classId: "-1",
      onlyNextLevel: true
    })

    const sceneIdInfo = getStore({ name: "currentSceneId" })
    if (sceneIdInfo) {
      this.sceneId = sceneIdInfo.sceneId
    } else {
      // this.getList()
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    "addForm.classIdArr": {
      handler(val) {
        console.log("val", val)
        if (val && val.length) {
          this.addForm.classId = val[val.length - 1]
        } else {
          this.addForm.classId = ""
        }
      }
    },
    async sceneId(val) {
      if (val) {
        this.getList({
          sceneId: val
        })
      }
      this.getLeftSideSceneClassification()
    }
  },
  async activated() {
    await this.getLeftSideSceneClassification()
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.$refs.tree.getCurrentKey())
    })
    this.getList()
  },
  methods: {
    async getLeftSideSceneClassification() {
      if (!this.sceneId) return
      const { data } = await getClassDisplayJson({
        classId: this.sceneId,
        onlyNextLevel: false
      })
      if (data.code == 0) {
        console.log("data", data)
        this.sceneClassificationList = this.removeEmptyChildrenNodes(data.data)
        this.leftSceneClassificationList = [{ id: "", label: "全部分类" }, ...this.sceneClassificationList]
        this.floatLeftSceneClassificationList = this.flattenChildren(data.data)
      }
    },
    changeSceneId(val) {
      console.log("场景更更换", val)
      setStore({
        name: "currentSceneId",
        content: {
          sceneId: val
        }
      })
    },

    openedAdd() {
      if (this.title !== "添加变量") return
      this.addForm.classIdArr = this.findPathByValue(this.sceneClassificationList, this.searchForm.classId)
    },
    async open() {
      this.versionsPage.currentPage = 1
    },

    removeEmptyChildrenNodes(tree) {
      return tree
        .map((node) => {
          // 深拷贝节点，避免修改原数据
          const newNode = { ...node }

          // 如果有子节点，递归移除空子节点
          if (newNode.children && newNode.children.length > 0) {
            newNode.children = this.removeEmptyChildrenNodes(newNode.children)
          }

          // 如果子节点为空，删除 children 属性
          if (!newNode.children || newNode.children.length === 0) {
            delete newNode.children
          }

          return newNode
        })
        .filter((node) => node.children || node.children === undefined) // 过滤掉所有 children 为空的节点
    },
    async getClassDisplayJson(opt) {
      const { data } = await getClassDisplayJson(opt)
      if (data.code == 0) {
        this.sceneIdList = data.data
        if (this.sceneIdList.length == 1) {
          this.sceneId = this.sceneIdList[0].id
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick(node) {
      if (node) {
        this.searchForm.classId = node.id
        this.page.currentPage = 1
        this.getList()
      }
    },

    // 递归查找路径函数
    findPathByValue(options, targetValue) {
      for (const item of options) {
        // 如果当前节点的值匹配目标值，直接返回包含该节点值的数组
        if (item.id === targetValue) return [item.id]

        // 继续递归查找子节点，但仅限于 children 不为空数组的情况
        if (item.children && item.children.length > 0) {
          const path = this.findPathByValue(item.children, targetValue)
          // 如果路径找到，返回包含当前节点值的完整路径
          if (path.length) return [item.id, ...path]
        }
      }
      // 未找到目标值时返回空数组
      return []
    },
    /**
     * 平铺全部数据
     */
    flattenChildren(data) {
      const result = []
      const traverse = (nodeArray) => {
        nodeArray.forEach((node) => {
          result.push({
            id: node.id,
            label: node.label,
            children: [] // 将 children 清空
          })
          if (Array.isArray(node.children) && node.children.length > 0) {
            traverse(node.children) // 递归处理子节点
          }
        })
      }

      traverse(data)
      return result
    },
    /**
     * 根据id查找label
     */
    findLabelById(targetId) {
      const item = this.floatLeftSceneClassificationList.find((node) => node.id === targetId)
      return item ? item.label : null
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.page = {
        total: 0,
        currentPage: 1,
        pageSize: 20
      }
      this.getList()
    },
    /**ß
     * 搜索回调
     */
    searchChange(params, page) {
      this.getList()
    },
    currentChange(val) {
      console.log("页码改变’, val", val)
      this.page.currentPage = val
      this.getList()
    },

    searchReset() {
      console.log("chognzhi")
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
      this.page.currentPage = 1
      this.page.pageSize = 20
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },

    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    async getList() {
      const { currentPage, pageSize } = this.page
      const postData = deepCloneIgnoreNull({
        // ...this.searchForm,
        page: currentPage,
        pageSize,
        // sceneId: this.sceneId,
        filtering: setFiltering(
          {
            ...this.searchForm,
            sceneId: this.sceneId
          },
          this.operatorParams
        )
      })
      if (!this.sceneId) return
      const { data } = await listPageByQuery(postData)
      if (data.code === 0) {
        this.tableData = []
        this.tableData = data.data.records
        this.page.currentPage = data.data.page
        this.page.pageSize = data.data.size
        this.page.total = data.data.total
      }
    },

    formReset() {},

    clearValues(obj) {
      // 遍历对象的所有属性
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key]

          // 根据值的类型清空
          if (typeof value === "string") {
            obj[key] = ""
          } else if (Array.isArray(value)) {
            obj[key] = []
          } else if (typeof value === "object" && value !== null) {
            obj[key] = clearValues(value) // 递归清空嵌套对象
          } else {
            obj[key] = null // 其他类型的值设置为 null
          }
        }
      }
      return obj
    },
    handleDetail(row) {
      const { type, id, classId, sceneId, name } = row
      console.log("type", type)
      if (type == "variables") {
        this.$router.push({
          path: "/baseSetup/ruleEngineConfig/variableList",
          query: {
            keyWord: name
          }
        })
      }
      if (type == "function") {
        this.$router.push({
          path: "/baseSetup/ruleEngineConfig/functionList",
          query: {
            keyWord: name
          }
        })
      }

      if (type == "rule") {
        this.$router.push({
          path: "/baseSetup/ruleEngineConfig/rulesList/checkRule",
          query: {
            id,
            sceneId
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#summariesList {
  .scene-content {
    background-color: #fff;
    margin: 0px 10px;
    padding: 8px 10px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    .scene-title {
      color: #000;
      margin: 0 8px;
    }
  }
  .versions-tag-item {
    margin: 0 2px;
  }
  .rules-box {
    display: flex;
    .classify {
      width: 200px;
      padding: 0 10px 0 0;
    }
    .table-box {
      flex: 1;
      overflow-x: auto;
    }
  }
  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%; /* 将方形变成圆形 */
    margin-right: 4px;
    &.dot-red {
      background-color: #f56c6c;
    }

    &.dot-green {
      background-color: #67c23a;
    }
  }
}
::v-deep .el-form-item__content {
  margin-left: 0px !important;
}
::v-deep .scene-title .el-input .el-input__inner {
  border: none;
}
::v-deep .el-tree-node__content {
  height: 32px;
}
</style>
