<template>
  <div>
    <basic-container id="adminOrganize">
      <el-row :span="24">
        <div style="padding: 20px">
          <el-col :xs="24" :sm="24" :md="5">
            <div style="margin-right: 20px" class="deptTree">
              <p class="ground-title"><b>结构组织</b>(不含业务小组)</p>
              <el-tree
                highlight-current
                :data="treeData"
                :props="defaultProps"
                node-key="id"
                @node-click="searchNodeData"
                :current-node-key="currentNode"
                :default-expanded-keys="aExpandedKeys"
                @node-expand="nodeExpand"
                @node-collapse="nodeCollapse"
                ref="tree"
              >
              </el-tree>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="19">
            <div style="text-align: left">
              <el-button size="mini" type="primary" v-if="permissions.sys_dept_add" @click="handleCreate"
                >新增</el-button
              >
              <el-button size="mini" type="primary" v-if="permissions.sys_dept_edit" @click="handleEditor"
                >编辑</el-button
              >
              <el-button size="mini" type="primary" v-if="permissions.sys_dept_del" @click="handleDelete"
                >删除</el-button
              >
            </div>
            <div class="content">
              <p v-if="nodeData.name"><label>组织名称:&emsp;</label>{{ nodeData.name }}</p>
              <p v-if="nodeData.name"><label>备注:&emsp;</label>{{ nodeData.remark }}</p>
              <p v-if="!nodeData || !nodeData.name">请选择组织节点</p>
            </div>
          </el-col>
        </div>
      </el-row>

      <!-- 新建窗口 -->
      <el-dialog title="新增" :visible.sync="createModal" width="500px" @close="closeForm('form')">
        <el-form ref="form" :model="form" label-width="100px" :inline="true">
          <el-form-item
            label="组织名称"
            prop="name"
            :rules="[
              { required: true, message: '组织名称不能为空', trigger: 'blur' },
              { max: 50, message: '组织名称不得超过50个字', trigger: 'blur' }
            ]"
          >
            <el-input v-model.trim="form.name" size="small" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="　层级关系">
            <el-radio-group v-model="oganizeRelation">
              <el-radio :label="0">同级</el-radio>
              <el-radio :label="1">子级</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
            :rules="[{ max: 100, message: '备注不得超过100个字', trigger: 'blur' }]"
          >
            <el-input type="textarea" v-model.trim="form.remark" maxlength="100"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="handleInsert">确 定</el-button>
          <el-button size="small" @click="createModal = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 编辑窗口 -->
      <el-dialog title="编辑" :visible.sync="editorModal" width="500px" @close="closeForm('editForm')">
        <el-form ref="editForm" :model="editForm" label-width="100px" :inline="true">
          <el-form-item
            label="组织名称"
            prop="name"
            :rules="[
              { required: true, message: '组织名称不能为空', trigger: 'blur' },
              { max: 50, message: '组织名称不得超过50个字', trigger: 'blur' }
            ]"
          >
            <el-input v-model.trim="editForm.name" size="small" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
            :rules="[{ max: 100, message: '备注不得超过100个字', trigger: 'blur' }]"
          >
            <el-input type="textarea" v-model.trim="editForm.remark" maxlength="100"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="handleUpdate">确 定</el-button>
          <el-button size="small" @click="editorModal = false">取 消</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  getTreeData,
  searchNodeData,
  insertNodeData,
  updateNodeData,
  deleteNodeData
} from "@/api/adminUser/adminOrganize"
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      treeData: [],
      nodeData: {},
      currentNode: "",
      //currentOpen:[],

      createModal: false,
      editorModal: false,
      deleteModal: false,
      defaultProps: {
        label: "name",
        children: "children"
      },
      oExpandedKey: {
        // key (from tree id) : expandedOrNot boolean
      },
      oTreeNodeChildren: {
        // id1 : [children] (from tree node id1)
        // id2 : [children] (from tree node id2)
      },
      aExpandedKeys: [],
      form: {
        name: "",
        parentId: "",
        remark: "",
        architectureId: ""
      },
      oganizeRelation: 1,
      editForm: {
        deptId: "",
        name: "",
        remark: ""
      }
    }
  },
  created() {
    this.getTreeData()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    nodeExpand(data) {
      console.info(data)
      let aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    nodeCollapse(data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
        this.oExpandedKey[oNode.id] = false
      })
      this.setExpandedKeys()
    },
    setExpandedKeys() {
      let oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (let sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey))
        }
      }
    },
    treeRecursion(aChildren, fnCallback) {
      if (aChildren) {
        for (let i = 0; i < aChildren.length; ++i) {
          let oNode = aChildren[i]
          fnCallback && fnCallback(oNode)
          this.treeRecursion(oNode.children, fnCallback)
        }
      }
    },
    // 关闭清空内容
    closeForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取树状数据
    getTreeData(pages, param) {
      getTreeData().then(({ data }) => {
        //this.nodeData = {};
        this.treeData = data.data
        // if(this.nodeData.deptId){
        //   console.info("jinrula")
        //   var temp =[];
        //   temp.push(this.nodeData.deptId);
        //   this.$refs.tree.setCheckedKeys(temp);
        // }
      })
    },

    // 获取节点数据
    searchNodeData(param) {
      searchNodeData(param.id).then(({ data }) => {
        this.nodeData = data.data
        this.currentNode = data.data.deptId
        //this.currentOpen.push(data.data.deptId);
      })
    },

    // 点击新建
    handleCreate() {
      if (this.nodeData.parentId) {
        this.form.name = ""
        this.form.remark = ""
        this.createModal = true
      } else {
        this.$notify({ type: "info", message: "请选择组织节点新建组织" })
      }
    },

    handleInsert() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.parentId = this.nodeData.deptId
          if (this.oganizeRelation == 0) {
            this.form.parentId = this.nodeData.parentId
          }
          this.form.architectureId = this.nodeData.architectureId

          insertNodeData(this.form)
            .then(({ data }) => {
              if (data.code === 0) {
                this.$notify({ type: "success", message: "添加成功" })
                this.createModal = false
                this.getTreeData()
                this.searchNodeData({ id: this.nodeData.deptId })
              } else if (data.code === 1) {
                this.$notify({ type: "error", message: data.msg })
              } else {
                this.$notify({ type: "error", message: "添加失败" })
              }
              this.createModal = false
            })
            .finally(() => {})
        } else {
          return false
        }
      })
    },

    // 点击编辑
    handleEditor() {
      if (this.nodeData.deptId) {
        this.editForm.deptId = this.nodeData.deptId
        this.editForm.name = this.nodeData.name
        this.editForm.remark = this.nodeData.remark
        this.editorModal = true
      } else {
        this.$notify({ type: "info", message: "请选择要操作的数据" })
      }
    },
    handleUpdate() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          updateNodeData(this.editForm)
            .then(({ data }) => {
              if (data.code === 0) {
                this.$notify({ type: "success", message: "修改成功" })

                this.getTreeData()
                this.searchNodeData({ id: this.editForm.deptId })
              } else if (data.code === 1) {
                this.$notify({ type: "error", message: data.msg })
              } else {
                this.$notify({ type: "error", message: "修改失败" })
              }
              this.editorModal = false
            })
            .finally(() => {})
        } else {
          return false
        }
      })
    },

    // 点击删除
    handleDelete() {
      if (this.nodeData.deptId) {
        this.$confirm(
          "确定要删除当前节点(节点名称:" + this.nodeData.name + ")及该节点下的所有子节点?, 是否继续?",
          "提示",
          { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
        )
          .then(() => {
            deleteNodeData(this.nodeData.deptId)
              .then(({ data }) => {
                if (data.code === 0) {
                  this.$notify({ type: "success", message: "删除成功" })
                  this.getTreeData()
                  this.nodeData = {}
                } else if (data.code === 1) {
                  this.$notify({ type: "error", message: data.msg })
                } else {
                  this.$notify({ type: "error", message: "删除失败" })
                }
              })
              .finally(() => {})
          })
          .catch((res) => {})
      } else {
        this.$notify({ type: "info", message: "请选择要操作的数据" })
      }
    }
  }
}
</script>

<style lang="scss">
#adminOrganize {
  .content {
    min-height: 300px;
    padding: 40px;
    margin: 20px 0;
    border: 1px solid #eee;
  }
  .content p {
    padding: 10px;
  }
  .content label {
    display: inline-block;
    min-width: 100px;
    text-align: right;
    font-weight: bold;
  }
  .deptTree .el-tree-node__label {
    width: 100%;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
