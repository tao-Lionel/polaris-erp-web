<template>
  <div class="variableList" id="variableList">
    <div class="scene-content">
      <i class="el-icon-menu" style="color: #fff; background-color: orange; border-radius: 3px"></i>

      <el-select class="scene-title" size="small" v-model="sceneId" placeholder="请选择" @change="changeSceneId">
        <el-option v-for="item in sceneIdList" :key="item.value" :label="item.label" :value="item.id"> </el-option>
      </el-select>
    </div>
    <basic-container>
      <avue-crud
        ref="crud"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" size="small" @click="handleAdd" v-if="permissions.baseSetup_rule_class_add"
            >添加</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="name">
              <el-input v-model="searchForm.name" size="small" placeholder="名称" v-search-input></el-input>
            </el-form-item>

            <!-- <el-form-item prop="code">
              <avue-crud-input
                v-model="searchForm.code"
                size="small"
                placeholder="编码"
                v-search-input
              ></avue-crud-input>
            </el-form-item> -->
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

        <template slot-scope="scope" slot="opeSlot">
          <el-button type="text" @click="handlePermission(scope.row)" v-if="permissions.baseSetup_rule_class_permission"
            >权限</el-button
          >

          <el-button type="text" @click="handleAddOrEdit(scope.row)" v-if="permissions.baseSetup_rule_class_edit"
            >编辑</el-button
          >
          <el-button type="text" @click="handleAddLevel(scope.row)" v-if="permissions.baseSetup_rule_class_addNext"
            >新增下级</el-button
          >
          <el-button
            type="text"
            @click="handleDelete(scope.row)"
            style="color: #f56c6c"
            v-if="permissions.baseSetup_rule_class_delete"
            >删除</el-button
          >
        </template>
      </avue-crud>

      <el-dialog :title="title" :visible.sync="addOrEditVisible" width="50%" :before-close="handleClose">
        <template slot="title">
          <span style="font-weight: bold">{{ title }}</span>
        </template>
        <div class="add-content">
          <el-form ref="addForm" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="名称" prop="name">
              <el-input size="small" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="上级分类" :prop="isEdit && !isAdd ? 'id' : 'parentId'">
              <el-cascader
                :disabled="!isAdd"
                clearable
                size="small"
                style="width: 100%"
                v-model="upperLevelCategory"
                :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'id', label: 'name' }"
                :options="cascaderOptions"
                @change="handleChange"
              ></el-cascader>
              <!-- allLis -->
            </el-form-item>
            <el-form-item label="状态">
              <el-select size="small" v-model="form.status" placeholder="">
                <el-option label="正常" value="VALID"></el-option>
                <el-option label="停用" value="INVALID"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="addOrEditVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmAdd">提 交</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="权限设置"
        :visible.sync="permissionVisible"
        width="60%"
        :close-on-click-modal="false"
        @open="open"
      >
        <div>
          <div>
            <div>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <el-checkbox-group v-model="permissionForm.roleIds" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(item, index) in roleList" :key="index" :label="item.roleId">{{
                  item.roleName
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="role-selected">
              <p>已选角色</p>
              <transition-group name="tag-fade" tag="div">
                <el-tag class="selected-tag-item" v-for="item in permissionForm.roleIds" :key="item">{{
                  getLabels(item)
                }}</el-tag>
              </transition-group>
            </div>
          </div>

          <div>
            <span slot="footer" class="dialog-footer" style="display: flex; justify-content: center; padding: 10px 0">
              <el-button size="small" @click="handleCancel">取 消</el-button>
              <el-button size="small" type="primary" @click="handleSubmitPermission">提 交</el-button>
            </span>
          </div>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  getSceneClassificationPage,
  addClassification,
  updateClassification,
  deleteClassificationById,
  saveRoleIdsByClassId,
  getListRoleIdsByClassId,
  getClassDisplayJson
} from "@/api/ruleEngineConfig/classification.js"
import { tableOption } from "./index.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { deptRoleList } from "@/api/admin/role.js"
import { cloneDeep } from "lodash"
import { getStore, setStore } from "@/util/store"
import { filter } from "lodash"
import { setFiltering } from "@/util/auth"

export default {
  name: "variableList",
  data() {
    return {
      exchangeStatus: false,
      exchangeData: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        name: "",
        status: "VALID",
        parentId: ""
      },
      operatorParams: {
        name: "LIKE",
        status: "EQUAL"
      },
      //确定的搜索条件
      tableData: [],
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        pageSize: 9999 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],

      title: "添加分类",
      addOrEditVisible: false,

      form: {
        name: "",
        parentId: "",
        status: ""
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
        // parentId: [{ required: true, message: "请选择上级分类", trigger: "blur" }],
        // id: [{ required: true, message: "请选择上级分类", trigger: "blur" }]
      },
      allList: [],
      // 上一级分类选中
      upperLevelCategory: [],
      isEdit: false,
      isAdd: false, // 是否新增下级
      permissionVisible: false,
      roleList: [],
      currentClassId: "",
      permissionForm: {
        classId: "",
        roleIds: []
      },
      isIndeterminate: true,
      checkAll: false,
      sceneIdList: [], // 场景 顶层
      sceneId: ""
    }
  },
  components: {},
  created() {},
  watch: {
    upperLevelCategory(val) {},
    async sceneId(val) {
      if (val) {
        this.getList({
          sceneId: val
        })
      }
      // this.allList = this.removeEmptyChildrenNodes(
      //   await this.getClassDisplayJson({
      //     classId: val,
      //     onlyNextLevel: true
      //   })
      // )
    }
  },
  async mounted() {
    this.getRoleList()
    this.sceneIdList = await this.getClassDisplayJson({
      classId: "-1",
      onlyNextLevel: true
    })
    if (this.sceneIdList.length == 1) {
      this.sceneId = this.sceneIdList[0].id
    } else {
      this.getList()
    }
    const sceneIdInfo = getStore({ name: "currentSceneId" })
    if (sceneIdInfo) {
      this.sceneId = sceneIdInfo.sceneId
    }

    // this.allList = this.removeEmptyChildrenNodes(
    //   await this.getClassDisplayJson({
    //     classId: this.sceneId,
    //     onlyNextLevel: true
    //   })
    // )
  },
  computed: {
    ...mapGetters(["permissions"]),
    cascaderOptions() {
      return this.removeEmptyChildrenNodes([
        // { name: this.sceneIdList.find((item) => item.id === this.sceneId)?.label, id: this.sceneId },
        ...this.tableData
      ])
    }
  },
  methods: {
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
      return new Promise(async (resolve, reject) => {
        const { data } = await getClassDisplayJson(opt)
        if (data.code == 0) {
          resolve(data.data)
        } else {
          reject([])
        }
      })
    },

    handleCheckAllChange(val) {
      this.permissionForm.roleIds = val ? this.roleList.map((item) => item.roleId) : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.roleList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length
    },
    getLabels(id) {
      return this.roleList.find((item) => id === item.roleId)?.roleName
    },
    roleChange(val) {},
    getRoleList() {
      deptRoleList().then(({ data }) => {
        if (data.code === 0) {
          this.roleList = data.data.map((item) => {
            return {
              key: item.id,
              ...item
            }
          })
        }
      })
    },

    getList(opt) {
      const postData = deepCloneIgnoreNull({
        // ...this.searchForm,
        page: 1,
        pageSize: 9999,
        ...opt,
        sceneId: this.sceneId,
        filtering: setFiltering(
          {
            ...this.searchForm,
            sceneId: this.sceneId
          },
          this.operatorParams
        )
      })
      getSceneClassificationPage(postData).then((res) => {
        this.tableData = this.buildTree(res.data.data.records.filter((item) => item.id !== this.sceneId))
        this.page.page = res.data.data.current
        this.page.size = res.data.data.size
        this.page.total = res.data.data.total
      })
    },
    getAllList() {
      getSceneClassificationPage({
        pageSize: 9999,
        page: 1,
        // sceneId: this.sceneId
        filtering: setFiltering(
          {
            ...this.searchForm,
            sceneId: this.sceneId
          },
          this.operatorParams
        )
      }).then(({ data }) => {
        // this.allList = this.removeEmptyChildrenNodes([...this.buildTree(data.data.records)])
      })
    },
    buildTree(data) {
      const map = {} // 用于快速查找父节点
      data.forEach((item) => {
        item.children = []
        map[item.id] = item // 以 id 作为键，存储每个节点
      })

      const tree = [] // 最终的树形结构

      data.forEach((item) => {
        // 如果存在 parentId 且 parentId 在 map 中找到对应的父节点
        if (item.parentId && map[item.parentId]) {
          map[item.parentId].children.push(item)
        } else {
          // 如果未找到对应的父节点或 parentId 为 null，将该节点视为顶层节点
          tree.push(item)
        }
      })

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
      this.getList({
        page: 1
      })
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

    handleAdd() {
      this.title = "添加分类"
      this.addOrEditVisible = true
      this.isEdit = false
      this.isAdd = true
      this.form = { name: "", parentId: "", status: "VALID" }
      this.upperLevelCategory = []
    },
    handlePermission(row) {
      this.permissionVisible = true
      this.permissionForm.classId = row.id
    },
    async handleSubmitPermission() {
      const postData = cloneDeep({ ...this.permissionForm, sceneId: this.sceneId })
      const { data } = await saveRoleIdsByClassId(postData)
      if (data.code === 0) {
        this.$message.success("保存成功")
        this.getList()
        this.permissionVisible = false
        this.permissionForm.classId = ""
        this.permissionForm.roleIds = []
      }
    },
    handleCancel() {
      this.permissionVisible = false
      this.permissionForm.classId = ""
      this.permissionForm.roleIds = []
    },
    async open() {
      const { data } = await getListRoleIdsByClassId({
        classId: this.permissionForm.classId
      })
      if (data.code === 0) {
        this.permissionForm.roleIds = data.data ??= []
      }
    },
    handleAddOrEdit(row) {
      this.title = "编辑分类"
      this.addOrEditVisible = true
      this.isEdit = true
      this.isAdd = true
      const { name, parentId, status, id } = row
      this.form = { name, id, status }
      this.upperLevelCategory = this.findPathByValue(this.tableData, row.id)
    },
    handleAddLevel(row) {
      this.title = "新增下级"
      this.isAdd = false
      this.isEdit = false
      this.addOrEditVisible = true
      const { parentId, sceneClassificationStatus, id } = row
      this.form = { name: "", parentId: id, status: "VALID" }
      this.upperLevelCategory = this.findPathByValue(this.tableData, row.id)
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
    async handleDelete(row) {
      this.$confirm("删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      })
        .then(async () => {
          const { data } = await deleteClassificationById(row.id)
          if (data.code === 0) {
            this.$message.success("删除成功")
            this.getList({
              page: 1
            })
            // this.getAllList()
          }
        })
        .catch((action) => {})
      return
    },
    formReset() {},
    handleChange(val) {
      if (val.length > 0) {
        this.form.parentId = val[val.length - 1]
      }
    },
    async confirmAdd() {
      const postData = deepCloneIgnoreNull({
        ...this.form,
        sceneId: this.sceneId,
        parentId: this.form.parentId ? this.form.parentId : this.sceneId
      })
      await this.$refs.addForm.validate()

      if (this.isEdit) {
        const { data } = await updateClassification(postData)
        if (data.code == 0) {
          this.$message.success("更新成功")
          this.getList({
            page: 1
          })
          this.addOrEditVisible = false
          // this.getAllList()
        }
      } else {
        const { data } = await addClassification(postData)
        if (data.code == 0) {
          this.$message.success("添加成功")
          this.getList({
            page: 1
          })
          // this.getAllList()
          this.addOrEditVisible = false
        }
      }
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
  .add-content {
    padding: 20px;
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
  .role-selected {
    border: 1px solid #c0c4cc;
    margin-top: 20px;
    padding: 10px;
    border-radius: 4px;
    .selected-tag-item {
      margin: 5px;
    }
  }
}
/* 定义动画名称 */
.tag-fade-enter-active,
.tag-fade-leave-active {
  transition: all 0.3s ease;
}

.tag-fade-enter, .tag-fade-leave-to /* .tag-fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: scale(0.9);
}
::v-deep .el-form-item__content {
  margin-left: 0 !important;
}
::v-deep .add-content .el-form-item {
  margin-bottom: 15px !important;
}
::v-deep .is-center .cell:has(.el-table__expand-icon) {
  display: flex;
}
::v-deep .is-center .cell:has(.el-table__indent) {
  display: flex;
}
::v-deep .el-table .el-button.el-button--text {
  padding: 4px 2px !important;
}
::v-deep .scene-title .el-input .el-input__inner {
  border: none;
}
</style>
