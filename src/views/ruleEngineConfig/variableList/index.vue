<template>
  <div class="variableList" id="variableList">
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
          >
            <template slot="menuLeft">
              <el-button
                type="primary"
                size="small"
                @click="handleAddOrEdit('new')"
                v-if="permissions.baseSetup_ruleEngine_variable_add"
                >添加</el-button
              >
            </template>

            <template slot-scope="scope" slot="search">
              <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
                <el-form-item prop="name">
                  <el-input v-model="searchForm.name" size="small" placeholder="名称" v-search-input></el-input>
                </el-form-item>

                <el-form-item prop="variablesType">
                  <el-select
                    v-model="searchForm.variablesType"
                    size="small"
                    clearable
                    filterable
                    placeholder="变量类型"
                  >
                    <el-option
                      v-for="item in searchOptionsList.variablesType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item prop="generalValueType">
                  <el-select
                    v-model="searchForm.generalValueType"
                    size="small"
                    clearable
                    filterable
                    placeholder="值类型"
                  >
                    <el-option
                      v-for="item in searchOptionsList.valueType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="status">
                  <el-select v-model="searchForm.status" size="small" clearable filterable placeholder="状态">
                    <el-option label="正常" value="VALID"> </el-option>
                    <el-option label="停用" value="INVALID"> </el-option>
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
              <span
                ><el-tag
                  class="versions-tag-item"
                  effect="plain"
                  size="small"
                  type="success"
                  v-if="scope.row.prdVersion"
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
              <br />
              {{ scope.row.createTime }}
            </template>

            <template slot-scope="{ row }" slot="opeSlot">
              <el-button
                type="text"
                @click="handleAddOrEdit('detail', row)"
                v-if="permissions.baseSetup_ruleEngine_variable_detail"
                >详情</el-button
              >
              <el-dropdown trigger="click" @command="handleCommand($event, row)">
                <a class="brandSolt_ope">更多</a>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="version" v-if="permissions.baseSetup_ruleEngine_variable_version"
                    >历史版本</el-dropdown-item
                  >
                  <!-- <el-dropdown-item command="authority">权限</el-dropdown-item> -->
                  <el-dropdown-item
                    command="off"
                    v-if="permissions.baseSetup_ruleEngine_variable_invalid && row.status === 'VALID'"
                    >停用</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="on"
                    v-if="permissions.baseSetup_ruleEngine_variable_valid && row.status === 'INVALID'"
                    >启用</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </avue-crud>

          <el-dialog
            :title="title"
            :visible.sync="addOrEditVisible"
            width="40%"
            :before-close="handleClose"
            :close-on-click-modal="false"
            @opened="openedAdd"
          >
            <template slot="title">
              <span style="font-weight: bold">{{ title }}</span>
              <el-tag type="warning" size="small" style="margin-left: 5px" v-if="!addForm.isPrd && addForm.testVersion"
                >测试{{ addForm.testVersion }}.0</el-tag
              >
              <el-tag type="success" size="small" style="margin-left: 5px" v-if="addForm.isPrd && addForm.prdVersion"
                >线上{{ addForm.prdVersion }}.0</el-tag
              >
            </template>
            <div style="padding: 20px">
              <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="140px" label-position="right">
                <el-form-item label="名称：" prop="name">
                  <el-input
                    :disabled="dialogEditStatus"
                    size="small"
                    placeholder="支持输入中英文、数字"
                    v-model="addForm.name"
                  ></el-input>
                </el-form-item>
                <el-form-item label="分类：" prop="classId">
                  <el-cascader
                    style="width: 100%"
                    v-model="addForm.classIdArr"
                    :options="sceneClassificationList"
                    :props="{ checkStrictly: true, label: 'label', value: 'id' }"
                    clearable
                    :disabled="dialogEditStatus"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="值类型：" prop="generalValueType">
                  <el-select
                    v-model="addForm.generalValueType"
                    placeholder="请选择活动"
                    size="small"
                    :disabled="dialogEditStatus || editFlag"
                  >
                    <el-option
                      v-for="(item, index) in searchOptionsList.valueType"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="变量类型：" prop="variablesType">
                  <el-select
                    v-model="addForm.variablesType"
                    placeholder="请选择活动"
                    size="small"
                    :disabled="dialogEditStatus || editFlag"
                  >
                    <el-option
                      v-for="(item, index) in searchOptionsList.variablesType"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="变量值：" prop="value">
                  <el-input :disabled="dialogEditStatus" size="small" v-model="addForm.value"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    :disabled="dialogEditStatus"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="addForm.remark"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="addOrEditVisible = false">取 消</el-button>
              <template v-if="!dialogEditStatus">
                <el-button
                  size="small"
                  type="primary"
                  v-if="permissions.baseSetup_ruleEngine_variable_publish"
                  @click="handleAddValue(true)"
                  >发 布</el-button
                >
                <el-button
                  size="small"
                  type="primary"
                  v-if="permissions.baseSetup_ruleEngine_variable_saveDraft"
                  @click="handleAddValue(false)"
                  >保存草稿</el-button
                >
              </template>
              <template v-else>
                <el-button
                  size="small"
                  type="primary"
                  v-if="permissions.baseSetup_ruleEngine_variable_copy"
                  @click="handleAgain(addForm.id)"
                  >复制变量</el-button
                >

                <el-button
                  size="small"
                  type="primary"
                  v-if="permissions.baseSetup_ruleEngine_variable_edit && addForm.isLatest"
                  @click="handleAddOrEdit('edit', row)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="primary"
                  v-if="permissions.baseSetup_ruleEngine_variable_oldEnabled && !addForm.isLatest"
                  @click="handleAddOrEdit('edit', row)"
                  >旧版启用</el-button
                >
              </template>
            </span>
          </el-dialog>

          <el-dialog
            title="历史版本"
            :visible.sync="versionVisible"
            width="60%"
            @opened="open"
            close-on-press-escape
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
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { tableOption, versionsTableOption } from "./index.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import {
  listPageByQuery,
  getVariablesPage,
  addVariables,
  updateVariables,
  getVariablesDetail,
  updateVariablesStatus,
  copyGeneralVariables,
  listVariablesTypeAndValueType
} from "@/api/ruleEngineConfig/variables.js"
import { getSceneClassificationPage, getClassDisplayJson } from "@/api/ruleEngineConfig/classification.js"
import { getStore, setStore } from "@/util/store"
import { setFiltering } from "@/util/auth"
import { cloneDeep } from "lodash"

export default {
  name: "variableList",
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
        variablesType: "",
        sourceType: "",
        status: "VALID",
        sceneId: "",
        classId: ""
      },
      operatorParams: {
        name: "LIKE",
        variablesType: "EQUAL",
        sourceType: "EQUAL",
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

      title: "添加变量",
      addOrEditVisible: false,

      addForm: {
        code: "",
        name: "",
        sceneId: "",
        classIdArr: [], // 分类的绑定数据[1,1,1]
        generalValueType: "",
        variablesType: "",
        value: "",
        remark: "",
        version: ""
      },
      addFormRules: {
        // code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              // 检查是否包含空格
              if (/\s/.test(value)) {
                callback(new Error("名称中不能包含空格"))
              } else if (/[()]/.test(value)) {
                callback(new Error("名称中不能包含英文括号(),请使用中文括号"))
              } else {
                callback() // 校验通过
              }
            },
            trigger: "change" // 校验在 input 内容变化时触发
          }
        ],
        classId: [{ required: true, message: "请选择分类", trigger: "blur" }],
        generalValueType: [{ required: true, message: "请选择值类型", trigger: "blur" }],
        variablesType: [{ required: true, message: "请选择变量类型", trigger: "blur" }]
        // value: [{ required: true, message: "请输入值", trigger: "blur" }]
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
      searchOptionsList: {},
      currentCode: ""
    }
  },
  components: {},
  created() {},
  async mounted() {
    // this.sceneId = 1
    this.getListVariablesTypeAndValueType()

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
          this.handleAddOrEdit("detail", this.tableData[0])
        }
      }
    }, 150)
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
      console.log("changjing", val)
      if (val) {
        this.getList({
          sceneId: val
        })
      }
      this.getLeftSideSceneClassification()
    },
    addOrEditVisible(val) {
      if (!val) {
        this.addForm = this.clearValues(this.addForm)
      }
    }
  },
  async activated() {
    await this.getLeftSideSceneClassification()
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.$refs.tree.getCurrentKey())
    })
  },
  methods: {
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
    changeSceneId(val) {
      console.log("场景更更换", val)
      setStore({
        name: "currentSceneId",
        content: {
          sceneId: val
        }
      })
    },
    async getListVariablesTypeAndValueType() {
      const { data } = await listVariablesTypeAndValueType()
      if (data.code == 0) {
        this.searchOptionsList = data.data
      }
    },
    openedAdd() {
      if (this.title !== "添加变量") return
      this.addForm.classIdArr = this.findPathByValue(this.sceneClassificationList, this.searchForm.classId)
    },
    async open() {
      this.versionsPage.currentPage = 1
      this.getVersionList()
    },
    async getVersionList(code) {
      getVariablesPage({
        // isHistory: true,
        code: this.currentCode,
        page: this.versionsPage.currentPage,
        pageSize: 10
      }).then((res) => {
        console.log(" res版本数据", res.data)
        if (res.data.code == 0) {
          this.currentVersionsList = res.data.data.records
          this.versionsPage.currentPage = res.data.data.current
          this.versionsPage.total = res.data.data.total
        }
      })
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

    buildTree(data) {
      const map = {}
      data.forEach((item) => {
        item.children = []
        map[item.id] = item
      })

      const tree = []

      data.forEach((item) => {
        if (item.parentId !== -1 && item.parentId !== null) {
          // 找到父节点并将当前项加入父节点的 children
          if (map[item.parentId]) {
            map[item.parentId].children.push(item)
          }
        } else {
          // 如果没有 parentId 或 parentId 为 -1，将其加入树的顶层
          tree.push(item)
        }
      })

      // 移除空的 children 数组
      function removeEmptyChildren(nodes) {
        nodes.forEach((node) => {
          if (node.children.length === 0) {
            delete node.children
          } else {
            removeEmptyChildren(node.children)
          }
        })
      }

      removeEmptyChildren(tree)
      return tree
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
    versionsCurrentChange(val) {
      this.versionsPage.currentPage = val
      this.getVersionList()
    },
    searchReset() {
      console.log("chognzhi")
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
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
      const { data } = await listPageByQuery(postData)
      if (data.code === 0) {
        this.tableData = data.data.records
        this.page.currentPage = data.data.page
        this.page.pageSize = data.data.size
        this.page.total = data.data.total
      }
    },

    async handleAddOrEdit(type, row) {
      if (type === "new") {
        this.title = "添加变量"
        this.editFlag = false
        this.addForm = {
          code: "",
          name: "",
          classId: "",
          classIdArr: [],
          generalValueType: "",
          variablesType: "",
          value: "",
          remark: "",
          version: ""
        }
        this.dialogEditStatus = false
      } else if (type == "detail") {
        this.currentRow = row
        this.editFlag = true
        this.title = "查看变量"
        this.dialogEditStatus = true
        const { data } = await getVariablesDetail({
          id: row.id
        })
        console.log("data===>", data)
        const { code, name, sceneId, classId, variablesType, generalValueType, value, remark, version, id } = data.data
        this.currentDetail = data.data
        this.addForm = {
          ...row,
          code,
          name,
          sceneId: sceneId,
          classId: classId,
          classIdArr: this.findPathByValue(this.sceneClassificationList, classId),
          variablesType,
          generalValueType,
          value: value === "nil" ? "" : value,
          remark,
          version,
          id
        }
        // =====================
      } else if (type == "edit") {
        console.log("’zouzhe", this.currentRow)
        this.title = "编辑变量"
        this.editFlag = true
        this.dialogEditStatus = false
        const { code, name, sceneId, classId, variablesType, generalValueType, value, remark, version, id } =
          this.currentRow
        this.addForm = {
          code,
          name,
          sceneId,
          classId: classId,
          classIdArr: this.findPathByValue(this.sceneClassificationList, classId),
          variablesType,
          generalValueType,
          value: value === "nil" ? "" : value,
          remark,
          version,
          id
        }
      }

      this.addOrEditVisible = true
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
    async handleAddValue(isPrd) {
      console.log("this.form", this.addForm)
      await this.$refs["addForm"].validate()

      if (this.editFlag) {
        const postData = cloneDeep({ ...this.addForm, isPrd, sceneId: this.sceneId })
        delete postData.classIdArr
        if (postData.value == "") {
          postData.value = null
        }
        const { data } = await updateVariables(postData)
        if (data.code == 0) {
          this.$message.success("修改成功")
          this.page.page = 1
          this.getList()
          this.addOrEditVisible = false
        }
      } else {
        const postData = deepCloneIgnoreNull({ ...this.addForm, isPrd, sceneId: this.sceneId })
        delete postData.classIdArr
        const { data } = await addVariables({ ...postData, code: this.addForm.name })
        if (data.code == 0) {
          this.$message.success("添加成功")
          this.page.page = 1
          this.getList()
          this.addOrEditVisible = false
        }
      }
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
            const { data } = await updateVariablesStatus({
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
            const { data } = await updateVariablesStatus({
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
    handleClickVersion(versionRow) {
      this.currentRow = versionRow
      this.title = "查看变量"
      this.dialogEditStatus = true
      this.addOrEditVisible = true
      this.editFlag = true
      const {
        code,
        name,
        sceneId,
        classId,
        variablesType,
        generalValueType,
        value,
        remark,
        version,
        id,
        isPrd,
        testVersion,
        prdVersion
      } = versionRow
      this.addForm = {
        code,
        name,
        sceneId,
        classId,
        classIdArr: this.findPathByValue(this.sceneClassificationList, classId),
        variablesType,
        generalValueType,
        value: value === "nil" ? "" : value,
        remark,
        version,
        id,
        isPrd,
        testVersion,
        prdVersion
      }
    },
    handleAgain(id) {
      console.log("重新应用", this.currentRow)
      const { name, code, classId, variablesType, generalValueType, value, remark } = this.currentRow
      this.addForm = {
        name,
        code,
        classId,
        classIdArr: this.findPathByValue(this.sceneClassificationList, classId),
        variablesType,
        generalValueType,
        value,
        remark
      }
      this.title = "复制变量"
      this.addOrEditVisible = true
      this.dialogEditStatus = false
      this.editFlag = false
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
#variableList {
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
