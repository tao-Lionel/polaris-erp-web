<template>
  <div class="execution" id="functionList">
    <div class="scene-content">
      <i class="el-icon-menu" style="color: #fff; background-color: orange; border-radius: 3px"></i>
      <el-select class="scene-title" size="small" v-model="sceneId" placeholder="请选择" @change="changeSceneId">
        <el-option v-for="item in sceneIdList" :key="item.value" :label="item.label" :value="item.id"> </el-option>
      </el-select>
    </div>
    <basic-container>
      <div class="rules-box">
        <div class="classify">
          <p style="padding: 5px 0">分类</p>
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
            @refresh-change="refreshChange"
            @search-change="searchChange"
            @search-reset="searchReset"
            @size-change="sizeChange"
            @current-change="currentChange"
            @selection-change="selectionChange"
          >
            <template slot="menuLeft">
              <el-button type="primary" size="small" @click="handleAdd" v-if="permissions.baseSetup_rule_function_add"
                >添加</el-button
              >
            </template>

            <template slot-scope="scope" slot="search">
              <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
                <!-- <el-form-item prop="code">
                  <avue-crud-input
                    v-model="searchForm.code"
                    size="small"
                    placeholder="编码"
                    v-search-input
                  ></avue-crud-input>
                </el-form-item> -->
                <el-form-item prop="name">
                  <el-input v-model="searchForm.name" size="small" placeholder="名称" v-search-input></el-input>
                </el-form-item>

                <el-form-item prop="status">
                  <el-select v-model="searchForm.status" size="small" clearable filterable placeholder="状态">
                    <el-option label="正常" value="VALID"></el-option>
                    <el-option label="停用" value="INVALID"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
            <template slot-scope="scope" slot="status">
              <span>
                <div class="dot" :class="scope.row.status == 'VALID' ? 'dot-green' : 'dot-red'"></div>
                <span>{{ scope.row.status == "VALID" ? "正常" : "停用" }}</span>
              </span>
            </template>
            <template slot-scope="scope" slot="classIdName">
              <span>
                {{ findLabelById(scope.row.classId) }}
              </span>
            </template>
            <template slot-scope="scope" slot="version">
              <span>
                <el-tag class="versions-tag-item" effect="plain" size="small" type="success" v-if="scope.row.prdVersion"
                  >线上{{ scope.row.prdVersion }}.0</el-tag
                >
                <el-tag
                  class="versions-tag-item"
                  effect="plain"
                  size="small"
                  type="warning"
                  v-if="scope.row.testVersion"
                  >测试{{ scope.row.testVersion }}.0</el-tag
                ></span
              >
            </template>
            <template slot-scope="scope" slot="createTime">
              {{ scope.row.createName }}
              <br v-if="scope.row.createName" />
              {{ scope.row.createTime }}
            </template>

            <template slot-scope="{ row }" slot="opeSlot">
              <el-button class="opt-button" type="text" @click="handleExecute(row)">测试</el-button>
              <el-button
                class="opt-button"
                type="text"
                @click="handleDetail(row)"
                v-if="permissions.baseSetup_rule_function_detail"
                >详情</el-button
              >
              <el-dropdown trigger="click" @command="handleCommand($event, row)">
                <a class="brandSolt_ope">更多</a>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="version" v-if="permissions.baseSetup_rule_function_version"
                    >历史版本</el-dropdown-item
                  >
                  <!-- <el-dropdown-item command="authority">权限</el-dropdown-item> -->
                  <el-dropdown-item
                    command="off"
                    v-if="permissions.baseSetup_rule_function_invalid && row.status === 'VALID'"
                    >停用</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="on"
                    v-if="permissions.baseSetup_rule_function_valid && row.status === 'INVALID'"
                    >启用</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </avue-crud>

          <add-function
            v-model="addOrEditVisible"
            :sceneClassificationList="sceneClassificationList"
            :addForm="addForm"
            @success="getList"
            :detailsData="detailsData"
            :isEdit="isEdit"
            :sceneId="sceneId"
            :copyFlag="copyFlag"
            :classId="searchForm.classId"
          ></add-function>

          <el-dialog title="查看函数" :visible.sync="detailVisible" width="60%" :before-close="handleClose">
            <template slot="title">
              <span style="font-weight: bold">查看函数</span>
              <el-tag
                type="warning"
                size="small"
                style="margin-left: 5px"
                v-if="!detailsData.isPrd && detailsData.testVersion"
                >测试{{ detailsData.testVersion }}.0</el-tag
              >
              <el-tag
                type="success"
                size="small"
                style="margin-left: 5px"
                v-if="detailsData.isPrd && detailsData.prdVersion"
                >线上{{ detailsData.prdVersion }}.0</el-tag
              >
            </template>
            <div style="padding: 20px 30px">
              <el-form ref="form" label-width="120px">
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item label="名称："> {{ detailsData.name }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="编码：">{{ detailsData.code }} </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item label="分类：">{{ detailsData.classIdName }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="备注："> {{ detailsData.remark }}</el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="12">
                  <el-col :span="24">
                    <p>执行内容:</p>
                    <div style="display: flex; flex-wrap: wrap; margin-top: 20px; align-items: center">
                      <span class="exec-item" :key="index" v-for="(item, index) in detailsData.executionData">
                        <el-tag
                          type="info"
                          size="small"
                          style="margin: 0 8px"
                          v-if="item.type !== 'symbol' && item.code"
                          >{{ getLabel(item.code) }}</el-tag
                        >
                        <span v-else-if="item.color" :style="`color: ${item.color}`">{{ item.text }}</span>
                        <span v-else>{{ item.text }}</span>
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="detailVisible = false">取 消</el-button>
              <el-button size="small" type="primary" v-if="permissions.baseSetup_rule_function_copy" @click="handleCopy"
                >复制函数</el-button
              >
              <el-button
                size="small"
                type="primary"
                v-if="permissions.baseSetup_rule_function_edit && detailsData.isLatest"
                @click="handleEdit"
                >编 辑</el-button
              >
              <el-button
                size="small"
                type="primary"
                v-if="permissions.baseSetup_rule_function_oldEnabled && !detailsData.isLatest"
                @click="handleEdit"
                >旧版启用</el-button
              >
            </span>
          </el-dialog>
        </div>
      </div>

      <el-dialog
        title="历史版本"
        :visible.sync="versionVisible"
        width="60%"
        @opened="open"
        @closed="currentVersionsList = []"
        top="10vh"
      >
        <div>
          <avue-crud
            ref="crud"
            :page="versionsPage"
            :data="currentVersionsList"
            :option="versionsTableOption"
            @current-change="versionsCurrentChange"
          >
            <template slot-scope="scope" slot="version">
              <el-tag
                type="warning"
                size="small"
                style="margin-left: 5px"
                v-if="!scope.row.isPrd && scope.row.testVersion"
                >测试{{ scope.row.testVersion }}.0</el-tag
              >
              <el-tag
                type="success"
                size="small"
                style="margin-left: 5px"
                v-if="scope.row.isPrd && scope.row.prdVersion"
                >线上{{ scope.row.prdVersion }}.0</el-tag
              >
            </template>
            <template slot-scope="scope" slot="createName">
              <span>{{ scope.row.createName }}</span>
              <br v-if="scope.row.createName" />
              <span>{{ scope.row.createTime }}</span>
            </template>
            <template slot-scope="scope" slot="updateName">
              <span v-if="scope.row.updateName">{{ scope.row.updateName }}</span>
              <br v-if="scope.row.updateName" />
              <span>{{ scope.row.updateTime }}</span>
            </template>

            <template slot-scope="{ row }" slot="opeSlot">
              <el-button @click="handleClickVersion(row)" type="text" size="small">查看</el-button>
            </template>
          </avue-crud>
        </div>
        <div>
          <span slot="footer" class="dialog-footer" style="display: flex; justify-content: center; padding: 10px 0">
            <el-button size="small" @click="versionVisible = false">关闭</el-button>
          </span>
        </div>
      </el-dialog>

      <Execute ref="execute" :type="'function'" />
    </basic-container>
  </div>
</template>

<script>
import { tableOption, versionsTableOption } from "./index.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import AddFunction from "./addFunction.vue"
import {
  listPageByQuery,
  getFunctionPage,
  addFunction,
  getFunctionDetail,
  updateFunctionStatus,
  copyGeneralFunction,
  listFunctionEditorInfoBySceneId
} from "@/api/ruleEngineConfig/functionList.js"
import { getSceneClassificationPage, getClassDisplayJson } from "@/api/ruleEngineConfig/classification.js"
import { getStore, setStore } from "@/util/store"
import Execute from "../components/execute.vue"
import { setFiltering } from "@/util/auth"

export default {
  name: "functionList",
  data() {
    return {
      filterText: "",

      defaultProps: {
        children: "children",
        label: "label"
      },
      exchangeStatus: false,
      exchangeData: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        name: "",
        code: "",
        status: "VALID", //VALID
        sceneId: "",
        classId: ""
      },
      operatorParams: {
        name: "LIKE",
        code: "LIKE",
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
      versionsTableOption: versionsTableOption,
      selectRows: [],
      title: "添加变量",
      addOrEditVisible: false, // 控制 Dialog 是否显示
      detailVisible: false,

      // 分类列表
      sceneClassificationList: [],
      leftSceneClassificationList: [],
      floatLeftSceneClassificationList: [],
      addForm: {
        code: "",
        name: "",
        sceneId: "",
        sceneIdArr: [],
        remark: ""
      },
      versionVisible: false,
      detailsData: {},
      isEdit: false,
      sceneIdList: [], // 场景 顶层
      sceneId: "",
      currentRow: {},
      currentVersionsList: [],

      versionsPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      currentCode: "",
      copyFlag: false, // 是否复制
      colors: ["red", "blue", "green", "orange", "purple", "pink"],
      editorInfoData: [] // 回显用的全部下拉数据
    }
  },
  components: {
    AddFunction,
    Execute
  },
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
    setTimeout(async () => {
      const { keyWord } = this.$route.query
      if (keyWord) {
        this.searchForm.name = keyWord
        await this.getList()
        if (this.tableData.length == 1) {
          this.handleDetail(this.tableData[0])
        }
      }
    }, 150)
  },
  async activated() {
    await this.getLeftSideSceneClassification()
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.$refs.tree.getCurrentKey())
    })
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    async sceneId(val) {
      console.log(val)
      if (val) {
        this.getList({
          sceneId: val
        })
      }
      this.getLeftSideSceneClassification()
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    async getAllEditorInfo() {
      const { data } = await listFunctionEditorInfoBySceneId({ sceneId: this.sceneId })
      if (data.code == 0) {
        this.editorInfoData = data.data.all
      }
    },
    async getLeftSideSceneClassification() {
      if (!this.sceneId) return
      const { data } = await getClassDisplayJson({
        classId: this.sceneId,
        onlyNextLevel: false
      })
      if (data.code == 0) {
        this.sceneClassificationList = this.removeEmptyChildrenNodes(data.data)
        this.leftSceneClassificationList = [{ id: "", label: "全部分类" }, ...this.sceneClassificationList]
        this.floatLeftSceneClassificationList = this.flattenChildren(data.data)
      }
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
    changeSceneId(val) {
      setStore({
        name: "currentSceneId",
        content: {
          sceneId: val
        }
      })
    },
    async open() {
      this.versionsPage.currentPage = 1
      this.getVersionList()
    },

    async getVersionList(code) {
      const { data } = await getFunctionPage({
        // isHistory: true,
        code: this.currentCode,
        page: this.versionsPage.currentPage,
        pageSize: 10
      })
      if (data.code == 0) {
        this.currentVersionsList = data.data.records
        this.versionsPage.currentPage = data.data.current
        this.versionsPage.total = data.data.total
      }
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
    getLabel(value) {
      return this.editorInfoData.find((item) => item.code === value)?.name || ""
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
    handleCommand(command, row) {
      switch (command) {
        case "version":
          this.versionVisible = true
          this.currentCode = row.code
          this.getVersionList()
          break
        case "authority":
          this.authorityVisible = true
          break
        case "off":
          this.$confirm("", "确认停用？", {
            confirmButtonText: "停用",
            cancelButtonText: "取消",
            type: "danger",
            center: true,
            showClose: false,
            confirmButtonClass: "el-button--danger",
            customClass: "confirm-popup-title" // 自定义类名
          }).then(async () => {
            const { data } = await updateFunctionStatus({
              id: row.id,
              status: "INVALID"
            })
            if (data.code == 0) {
              this.$message({
                type: "success",
                message: "关闭成功!"
              })
              this.getList()
            }
          })

          break
        case "on":
          this.$confirm("", "确认启用？", {
            confirmButtonText: "启用",
            cancelButtonText: "取消",
            type: "danger",
            center: true,
            showClose: false,
            confirmButtonClass: "el-button--primary"
          }).then(async () => {
            const { data } = await updateFunctionStatus({
              id: row.id,
              status: "VALID"
            })
            if (data.code == 0) {
              this.$message({
                type: "success",
                message: "启用成功!"
              })
              this.getList()
            }
          })
          break
      }
    },
    removeEmptyChildren(nodes) {
      return nodes.map((node) => {
        // 如果节点有子节点，递归处理子节点
        if (node.children && node.children.length > 0) {
          node.children = this.removeEmptyChildren(node.children)
        }
        // 只保留有子节点的节点或没有 `children` 字段的节点
        if (!node.children || node.children.length === 0) {
          delete node.children
        }
        return node
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    versionsCurrentChange(val) {
      this.versionsPage.currentPage = val
      this.getVersionList()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.getList()
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      this.searchForm.classId = ""
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      // this.$refs.crud.toggleSelection()
    },
    async getList(opt) {
      const { currentPage, pageSize } = this.page
      const postData = deepCloneIgnoreNull({
        // ...this.searchForm,
        page: currentPage,
        pageSize,
        // sceneId: this.sceneId,
        ...opt,
        filtering: setFiltering(
          {
            ...this.searchForm,
            sceneId: this.sceneId
          },
          this.operatorParams
        )
      })
      const res = await listPageByQuery(postData)
      this.tableData = res.data.data.records
      this.page.currentPage = res.data.data.page
      this.page.pageSize = res.data.data.size
      this.page.total = res.data.data.total
    },

    handleAdd() {
      this.addOrEditVisible = true
      this.isEdit = false
    },

    formReset() {
      //方法2
      // this.$nextTick(function () {
      //   this.$refs["addOrUpdateForm"].resetFields()
      //   this.addOrUpdateForm = {
      //     isAdd: true,
      //     currency: null,
      //     currencyName: null,
      //     exchangeRate: null,
      //     averageExchangeRate: null
      //   }
      // })
    },
    async handleDetail(row) {
      this.currentRow = row
      this.detailVisible = true
      await this.getAllEditorInfo()
      const { data } = await getFunctionDetail({ id: row.id })
      // data.data.executionData = JSON.parse(data.data.contentArray)

      // 调用函数
      data.data.executionData = this.assignBracketColors(JSON.parse(data.data.contentArray), this.colors)

      const { sceneId, classId } = data.data
      this.detailsData = {
        sceneId,
        classId,
        ...data.data,
        classIdName: this.findPathByValue(this.sceneClassificationList, classId)
      }
    },
    assignBracketColors(data, colors) {
      const stack = [] // 用于存储括号的索引及其颜色
      let colorIndex = 0

      return data.map((item) => {
        if (item.text === "(" || item.text === "[" || item.text === "{") {
          // 左括号入栈，并分配颜色
          const color = colors[colorIndex % colors.length]
          stack.push({ text: item.text, color })
          colorIndex++
          return { ...item, color }
        } else if (item.text === ")" || item.text === "]" || item.text === "}") {
          // 右括号出栈，获取对应的颜色
          const matching = stack.pop()
          const color = matching ? matching.color : "black" // 防止意外错误，默认黑色
          return { ...item, color }
        }
        // 非括号内容保持不变
        return item
      })
    },
    handleEdit() {
      this.isEdit = true
      this.detailVisible = false
      this.addOrEditVisible = true
    },
    async handleCopy() {
      // const {classId,name,code,remark,content,contentArray} = this.currentRow
      this.copyFlag = true
      this.isEdit = false
      this.detailVisible = false
      this.addOrEditVisible = true
      // const { data } = await copyGeneralFunction({ id: this.currentRow.id })
      // if (data.code === 0) {
      //   this.$message({
      //     type: "success",
      //     message: "重新应用成功"
      //   })
      //   this.detailVisible = false
      //   this.getList()
      // }
    },
    handleClickVersion(row) {
      this.title = "查看函数"
      this.detailVisible = true
      const { id, name, code, remark, contentArray, classId } = row
      this.detailsData = {
        ...row,
        id,
        name,
        code,
        remark,
        contentArray,
        executionData: this.assignBracketColors(JSON.parse(contentArray), this.colors),
        classId,
        classIdName: this.findPathByValue(this.sceneClassificationList, classId)
      }
    },
    findPathByValue(tree, targetValue) {
      // 用于递归查找路径的辅助函数
      const dfs = (node, path) => {
        // 将当前节点的 label 添加到路径中
        path.push(node.label)

        // 如果找到目标 id，返回路径
        if (node.id === targetValue) {
          return path
        }

        // 遍历子节点进行递归查找
        if (node.children) {
          for (let child of node.children) {
            const result = dfs(child, [...path])
            if (result) return result // 如果找到路径，则返回结果
          }
        }
        return null
      }

      for (let root of tree) {
        const result = dfs(root, [])
        if (result) return result.join("/") // 拼接路径为字符串并返回
      }
      return ""
    },
    handleExecute(row) {
      this.$refs.execute.openDialog(row)
    }
  }
}
</script>

<style lang="scss" scoped>
#functionList {
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
  .opt-button {
    padding: 2px 4px;
    margin-left: 0px;
  }
  .exec-item {
    margin: 4px 1px;
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
