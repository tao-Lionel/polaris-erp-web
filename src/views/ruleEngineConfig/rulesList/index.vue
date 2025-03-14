<template>
  <div class="rulesList" id="rulesList">
    <div class="scene-content">
      <i class="el-icon-menu" style="color: #fff; background-color: orange; border-radius: 3px"></i>
      <!-- 产品核价
      <i class="el-icon-arrow-right"></i> -->
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
            @selection-change="selectionChange"
            @current-change="currentChange"
          >
            <template slot="menuLeft">
              <el-button type="primary" size="small" @click="handleAdd" v-if="permissions.baseSetup_rule_rule_add"
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
                    <el-option label="正常" value="VALID"> </el-option>
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
            <template slot-scope="scope" slot="versions">
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
              <br v-if="scope.row.createName" />
              {{ scope.row.createTime }}
            </template>

            <template slot-scope="{ row }" slot="opeSlot">
              <el-button class="opt-button" type="text" @click="handleExecute(row)">测试</el-button>
              <el-button
                class="opt-button"
                type="text"
                @click="handleDetails(row)"
                v-if="permissions.baseSetup_rule_rule_detail"
                >详情</el-button
              >
              <el-dropdown trigger="click" @command="handleCommand($event, row)">
                <a class="brandSolt_ope">更多</a>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="version" v-if="permissions.baseSetup_rule_rule_version"
                    >历史版本</el-dropdown-item
                  >
                  <!-- <el-dropdown-item command="authority">权限</el-dropdown-item> -->
                  <el-dropdown-item
                    command="off"
                    v-if="permissions.baseSetup_rule_rule_invalid && row.status === 'VALID'"
                    >停用</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="on"
                    v-if="permissions.baseSetup_rule_rule_valid && row.status === 'INVALID'"
                    >启用</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </avue-crud>
        </div>
      </div>

      <el-dialog
        title="历史版本"
        :visible.sync="versionVisible"
        width="60%"
        @closed="currentVersionsList = []"
        @opened="opened"
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

      <Execute ref="execute" :type="'rule'" />
    </basic-container>
  </div>
</template>

<script>
import { tableOption, versionsTableOption } from "./index.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getRulePage, updateStatus, listPageByQuery } from "@/api/ruleEngineConfig/rulesList.js"
import { getSceneClassificationPage, getClassDisplayJson } from "@/api/ruleEngineConfig/classification.js"
import { getStore, setStore } from "@/util/store"
import Execute from "../components/execute.vue"
import { setFiltering } from "@/util/auth"

export default {
  name: "rulesList",
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
        status: "VALID",
        classId: "",
        sceneId: ""
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
      ruleInfoForm: {
        name: "",
        code: "",
        desc: ""
      },
      ruleInfoFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }]
      },
      versionVisible: false,
      authorityVisible: false,
      sceneClassificationList: [],
      leftSceneClassificationList: [],
      floatLeftSceneClassificationList: [],
      firstSceneId: 1, /// 场景值id，
      sceneIdList: [],
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
  components: { Execute },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },

    async sceneId(val) {
      console.log("val", val)
      if (val) {
        this.getList({
          sceneId: val
        })
      }
      this.getLeftSideSceneClassification()
    },
    "$route.query.refresh"(newValue) {
      console.log("监听", newValue)
    }
  },
  created() {},
  async mounted() {
    getClassDisplayJson({
      classId: "-1",
      onlyNextLevel: true
    }).then((res) => {
      if (res.data.code === 0) {
        this.sceneIdList = res.data.data
        if (this.sceneIdList.length == 1) {
          this.sceneId = this.sceneIdList[0].id
        }
      }
    })

    const sceneIdInfo = getStore({ name: "currentSceneId" })
    if (sceneIdInfo) {
      this.sceneId = sceneIdInfo.sceneId
    } else {
      // this.getList()
    }
  },
  async activated() {
    this.getList()
    await this.getLeftSideSceneClassification()
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.$refs.tree.getCurrentKey())
    })
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    nodeExpand() {
      console.log("时间")
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
      console.log("场景更更换", val)
      setStore({
        name: "currentSceneId",
        content: {
          sceneId: val
        }
      })
    },
    async getVersionList() {
      const { data } = await getRulePage({
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
    getClassificationPage(page) {
      getSceneClassificationPage({
        page: 1,
        pageSize: 9999
      }).then((res) => {
        console.log("2222222=========", res.data.data.records)
        this.sceneClassificationList = this.buildTree(res.data.data.records)
      })
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
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.getList()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    versionsCurrentChange(val) {
      this.versionsPage.currentPage = val
      this.getVersionList()
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
      console.log(this.selectRows)
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    async getList(opt) {
      const postData = deepCloneIgnoreNull({
        // ...this.searchForm,
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
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
      listPageByQuery(postData).then((res) => {
        this.tableData = res.data.data.records
        this.page.currentPage = res.data.data.page
        this.page.pageSize = res.data.data.size
        this.page.total = res.data.data.total
      })
    },

    handleAdd() {
      console.log("adddd", this.searchForm.classId)
      this.$router.push({
        path: "/baseSetup/ruleEngineConfig/rulesList/addRule",
        query: {
          sceneId: this.sceneId,
          defaultClassId: this.searchForm.classId
        }
      })
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
    handleExecute(row) {
      this.$refs.execute.openDialog(row)
    },

    handleNextStepAdd() {},

    handleDetails(row) {
      console.log("详情", row)
      this.$router.push({
        path: "/baseSetup/ruleEngineConfig/rulesList/checkRule",
        query: {
          id: row.id,
          sceneId: this.sceneId
        }
      })
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
            const { data } = await updateStatus({
              id: row.id,
              status: "INVALID"
            })
            if (data.code == 0) {
              this.$message({
                type: "success",
                message: "停用成功!"
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
            const { data } = await updateStatus({
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
    handleClickVersion(row) {
      this.versionVisible = false
      this.$router.push({
        path: "/baseSetup/ruleEngineConfig/rulesList/checkRule",
        query: {
          id: row.id,
          sceneId: this.sceneId
        }
      })
    },
    opened() {
      this.versionsPage.currentPage = 1
      this.getVersionList()
    }
  }
}
</script>

<style lang="scss" scoped>
#rulesList {
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
  .rule-item {
    margin: 20px 0;
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
}
::v-deep .rule-item .el-form-item__content {
  margin-left: 10px !important;
}
::v-deep .scene-title .el-input .el-input__inner {
  border: none;
}
::v-deep .el-tree-node__content {
  height: 32px;
}
</style>
