<template>
  <div>
    <basic-container class="adminGroup">
      <el-row :span="24">
        <el-col :xs="24" :sm="24" :md="24">
          <avue-crud
            ref="crud"
            :data="list"
            :page="page"
            :option="option"
            v-model="form"
            @size-change="sizeChange"
            @on-load="searchRecord"
            @refresh-change="handleRefreshChange"
            @search-change="searchChange"
            @search-reset="searchReset"
          >
            <template slot="menuLeft">
              <el-button size="mini" v-if="permissions.sys_group_add" type="primary" @click="addGroup()"
                >新建小组</el-button
              >
            </template>
            <template slot="search">
              <el-form
                @submit.native.prevent
                :model="searchParams"
                ref="searchParams"
                :inline="true"
                class="demo-form-inline"
              >
                <el-form-item prop="name">
                  <el-input
                    v-model.trim="searchParams.name"
                    size="small"
                    placeholder="小组名称"
                    v-search-input
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="groupFunctionIdArray"
                    collapse-tags
                    size="small"
                    multiple
                    filterable
                    placeholder="所属职能类"
                  >
                    <el-option
                      v-for="item in groupFunctions"
                      :key="item.groupFunctionId"
                      :label="item.name"
                      :value="item.groupFunctionId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="deptIdArray"
                    collapse-tags
                    size="small"
                    multiple
                    filterable
                    placeholder="所属部门"
                  >
                    <el-option
                      v-for="item in depts"
                      :key="item.deptId"
                      :label="item.name"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
            <template slot="salesScope" slot-scope="scope">
              <i class="icon-chakan y-reviews" @click="viewGroup(scope.row)" v-if="scope.row.groupFunctionId === 1"></i>
            </template>
            <template slot="operate" slot-scope="scope">
              <!-- <button type="button" v-if="permissions.sys_group_edit" class="el-button el-button--text el-button--small" @click="updateGroup(scope.row)">
          <i class="el-icon-edit"></i><span>修 改</span>
        </button>
        <button type="button" v-if="permissions.sys_group_del" class="el-button el-button--text el-button--small" @click="deleteGroup(scope.row)">
          <i class="el-icon-delete"></i><span>删 除</span>
        </button> -->
              <i class="icon-bianji y-icon-edit" v-if="permissions.sys_group_edit" @click="updateGroup(scope.row)"></i>
              <i
                class="icon-shanchu y-icon-delect"
                v-if="permissions.sys_group_del"
                @click="deleteGroup(scope.row)"
              ></i>
            </template>
          </avue-crud>
        </el-col>
      </el-row>

      <el-dialog
        :title="dialogTitle"
        center
        :visible.sync="addOrUpdateGroupDialogVisible"
        width="420px"
        @close="addOrUpdateGroupDialogClose"
        class="addOrUpdateGroupDialog"
      >
        <el-form ref="addOrUpdateForm" :model="addOrUpdateForm" status-icon>
          <el-input v-model.trim="addOrUpdateForm.groupId" size="small" style="display: none"></el-input>
          <el-form-item
            label="组名:"
            prop="name"
            :rules="[
              { required: true, message: '小组名称不能为空', trigger: 'blur' },
              { max: 30, message: '小组名称不得超过30个字符', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model.trim="addOrUpdateForm.name"
              size="small"
              placeholder="请输入小组名称"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="所属职能类:"
            prop="groupFunctionId"
            :rules="[{ required: true, message: '请选择职能类', trigger: 'change' }]"
          >
            <el-select
              size="small"
              v-model="addOrUpdateForm.groupFunctionId"
              :disabled="groupFunctionSelectdisabled"
              filterable
            >
              <el-option
                v-for="item in groupFunctions"
                :key="item.groupFunctionId"
                :label="item.name"
                :value="item.groupFunctionId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="所属部门:　"
            prop="deptId"
            :rules="[{ required: true, message: '请选择部门', trigger: 'change' }]"
          >
            <el-select size="small" v-model="addOrUpdateForm.deptId" filterable>
              <el-option v-for="item in depts" :key="item.deptId" :label="item.name" :value="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="salesScope"
            label="销售范围"
            prop="salesScope"
            v-if="addOrUpdateForm.groupFunctionId === 1"
          >
            <el-form-item>
              <el-select v-model="platformList" @change="changePlat" placeholder="请选择平台范围" multiple clearable>
                <el-option
                  v-for="item in plaTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="siteList" placeholder="请选择站点范围" multiple clearable>
                <el-option
                  v-for="item in siteOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="brandList" placeholder="请选择品牌范围" multiple clearable>
                <el-option
                  v-for="item in brandOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <!-- <el-select v-model="addOrUpdateForm.categoryList" placeholder="请选择品类范围" multiple clearable></el-select> -->
              <!-- <el-cascader expand-trigger="hover" :props="{ multiple: true }" size="small" placeholder="请选择品类范围"
                v-model="categoryList" :show-all-levels="false" :options="treeCategoryData" collapse-tags clearable
                :disabled="isView"></el-cascader> -->
              <el-tree
                highlight-current
                :props="treeDataProps"
                :data="treeCategoryData"
                node-key="id"
                ref="catagoryTree"
                :default-checked-keys="categoryList"
                show-checkbox
              >
              </el-tree>
            </el-form-item>
          </el-form-item>
          <el-form-item label="备注:" prop="remarks">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              v-model.trim="addOrUpdateForm.remarks"
              maxlength="100"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="addOrUpdateGroupDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="addOrUpdateGroupSubmit('addOrUpdateForm')" :disabled="isView"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  searchRecord,
  searchCategory,
  searchDepartment,
  insertRecord,
  updateRecord,
  deleteRecord,
  checkUserForGroup,
  getGroupSalesScopeByGroupId,
  getSitlnfoByPlatformlds
} from "@/api/adminUser/adminGroup"
import { tableOption } from "@/const/crud/adminUser/adminGroup"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { fetchBrandAll } from "@/api/product/prdskubrand"
import { fetchTreeList } from "@/api/product/prdskucategory"

import { deleteEmptyProps, deleteEmptyArrayProps } from "@/util/util"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

export default {
  data() {
    return {
      list: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 20,
        isAsc: false
      },
      form: {
        name: "",
        groupFunctionIds: [],
        deptIds: []
      },
      option: tableOption,
      isAdd: true,
      isView: true,
      dialogTitle: "",
      addOrUpdateGroupDialogVisible: false,
      addOrUpdateForm: {
        groupId: "",
        name: "",
        groupFunctionId: "",
        deptId: "",
        platformList: [],
        siteList: [],
        brandList: [],
        categoryList: [],
        remarks: ""
      },
      groupFunctions: [],
      depts: [],
      searchParams: {
        name: "",
        groupFunctionIds: "",
        deptIds: ""
      },
      searchParamsConfirm: {
        name: "",
        groupFunctionIds: "",
        deptIds: ""
      },
      groupFunctionIdArray: [],
      deptIdArray: [],
      groupFunctionIdArrayConfirm: [],
      deptIdArrayConfirm: [],
      groupFunctionSelectdisabled: false,
      plaTypeOptions: [],
      siteOptions: [],
      brandOption: [],
      platformList: [],
      siteList: [],
      brandList: [],
      // categoryList: [],
      treeDataProps: {
        label: "name",
        children: "children"
      },
      treeCategoryData: [],
      // currentSelectNode: "",
      // currentNode: "",
      categoryList: []
    }
  },
  created() {
    this.init()
    searchCategory().then(({ data }) => {
      this.groupFunctions = data.data
    })
    searchDepartment().then(({ data }) => {
      this.depts = data.data
    })
  },
  watch: {
    platformList(val) {
      console.log(val)
      this.updatePlatformList(val)
    },
    siteList(val) {
      this.updateSiteList(val)
    },
    brandList(val) {
      this.updateBrandList(val)
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    init() {
      //获取所有平台类型
      getPlaTypeAll().then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          data.forEach((item) => {
            this.plaTypeOptions.push({
              value: item.platformTypeId,
              label: item.platformTypeCode
            })
          })
        }
      })

      //获取品牌下拉列表
      fetchBrandAll().then((res) => {
        res.data.data.records.forEach((item) => {
          if (res.data.code === 0) {
            this.brandOption.push({
              value: item.brandId,
              label: item.brandName
            })
          }
        })
      })

      //获取品类下拉列表
      fetchTreeList().then((response) => {
        this.treeCategoryData = response.data.data
      })
    },
    updatePlatformList(val) {
      console.log("plat", this.plaTypeOptions)
      let options = this.plaTypeOptions
      this.addOrUpdateForm.platformList = val.map((item) => {
        return {
          [item]: options.find((option) => option.value == [item]).label
        }
      })
    },
    updateSiteList(val) {
      console.log("site", this.siteOptions)
      let options = this.siteOptions
      console.log("siteoptions", options[0])
      this.addOrUpdateForm.siteList = val.map((item) => {
        // options.forEach(item => console.log(item))
        // console.log(options.find(option => option.value == item))
        return {
          [item]: options.find((option) => option.value == [item]).label
        }
      })
    },
    updateBrandList(val) {
      let options = this.brandOption
      this.addOrUpdateForm.brandList = val.map((item) => {
        return {
          [item]: options.find((option) => option.value == [item]).label
        }
      })
    },
    //选中平台后，获取对应的所有站点
    async changePlat(val) {
      this.siteOptions = []
      let res = await getSitlnfoByPlatformlds(val)
      res.data.data.forEach((item) => {
        this.siteOptions.push({
          value: item.bsePlatformSitId,
          label: item.sitName
        })
      })
    },

    // 删除某行
    deleteGroup(row) {
      this.$confirm("是否确认删除名称为" + row.name + "的小组?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRecord(row.groupId)
            .then(({ data }) => {
              if (data.code === 0) {
                this.$notify({ type: "success", message: "删除成功" })
                this.searchRecord(this.page)
                done()
              } else if (data.code === 1) {
                this.$notify({ type: "error", message: data.msg })
              } else {
                this.$notify({ type: "error", message: "删除失败" })
              }
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {})
        })
        .catch(() => {})
    },

    resolveAllCategory(json, temp) {
      json.forEach((item) => {
        temp.push({
          [item.value]: item.label
        })
      })
      return temp
    },

    // 确认新增或者更新小组
    addOrUpdateGroupSubmit(formName) {
      if (this.$refs.catagoryTree) {
        this.categoryList = this.$refs.catagoryTree.getCheckedNodes()
      }
      this.addOrUpdateForm.categoryList = this.resolveAllCategory(this.categoryList, [])

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            insertRecord(this.addOrUpdateForm)
              .then(({ data }) => {
                if (data.code === 0) {
                  this.$notify({ type: "success", message: "新建成功" })
                  this.addOrUpdateGroupDialogVisible = false
                  this.searchRecord(this.page)
                } else if (data.code === 1) {
                  this.$notify({ type: "error", message: data.msg })
                } else {
                  this.$notify({ type: "error", message: "新增小组失败" })
                }
              })
              .catch((error) => {
                this.$notify({ type: "error", message: "新增小组失败" })
              })
              .finally(() => {})
          } else {
            updateRecord(this.addOrUpdateForm)
              .then(({ data }) => {
                if (data.code === 0) {
                  this.$notify({ type: "success", message: "修改成功" })
                  this.addOrUpdateGroupDialogVisible = false
                  this.searchRecord(this.page)
                } else if (data.code === 1) {
                  this.$notify({ type: "error", message: data.msg })
                } else {
                  this.$notify({ type: "error", message: "修改小组失败" })
                }
              })
              .catch((error) => {
                this.$notify({ type: "error", message: "修改小组失败" })
              })
              .finally(() => {})
          }
        } else {
          return false
        }
      })
    },
    // 关闭新增或者更新小组对话框执行的事件
    addOrUpdateGroupDialogClose() {
      this.addOrUpdateForm = {
        groupId: "",
        name: "",
        groupFunctionId: "",
        deptId: "",
        remarks: ""
      }
      this.resetForm()
      this.$refs["addOrUpdateForm"].clearValidate()
    },
    // 打开新建小组对话框
    addGroup() {
      this.isAdd = true
      this.isView = false
      this.dialogTitle = "新建组"
      this.addOrUpdateForm = {
        groupId: "",
        name: "",
        groupFunctionId: "",
        deptId: "",
        remarks: ""
      }
      this.groupFunctionSelectdisabled = false
      this.addOrUpdateGroupDialogVisible = true
    },
    // 打开修改小组对话框
    async updateGroup(row) {
      this.isAdd = false
      this.isView = false
      var groupId = row.groupId
      this.addOrUpdateForm = {
        groupId: row.groupId,
        name: row.name,
        groupFunctionId: row.groupFunctionId,
        deptId: row.deptId,
        remarks: row.remarks
        // platformList: platformList
        // siteList: res.data.data.siteList,
        // brandList: res.data.data.brandList,
        // categoryList: res.data.data.categoryList,
      }
      let res = await getGroupSalesScopeByGroupId(groupId)
      if (res.data.code === 0) {
        if (res.data.data.PLATFORM && res.data.data.PLATFORM.length >= 1) {
          console.log(123)
          let platformList = []
          res.data.data.PLATFORM.forEach((item) => {
            platformList.push(item.valueId)
          })
          this.platformList = [...platformList]
          await this.changePlat(this.platformList)
        }
        if (res.data.data.SITE && res.data.data.SITE.length >= 1) {
          let siteList = []
          res.data.data.SITE.forEach((item) => {
            siteList.push(item.valueId)
          })
          this.siteList = [...siteList]
        }
        if (res.data.data.BRAND && res.data.data.BRAND.length >= 1) {
          let brandList = []
          res.data.data.BRAND.forEach((item) => {
            brandList.push(item.valueId)
          })
          this.brandList = [...brandList]
        }
        if (res.data.data.CATEGORY && res.data.data.CATEGORY.length >= 1) {
          let categoryList = []
          res.data.data.CATEGORY.forEach((item) => {
            categoryList.push(item.valueId)
          })
          this.categoryList = [...categoryList]
        }
      }
      checkUserForGroup(groupId).then((response) => {
        if (response.data.code === 0) {
          if (response.data.data) {
            this.groupFunctionSelectdisabled = true
          } else {
            this.groupFunctionSelectdisabled = false
          }
        } else {
          this.$notify({ type: "error", message: "查询小组下是否有组员信息失败" })
          return
        }
      })

      this.dialogTitle = "修改组"
      this.addOrUpdateGroupDialogVisible = true
    },
    async viewGroup(row) {
      this.isAdd = false
      this.isView = true
      var groupId = row.groupId
      // let res = await getGroupSalesScopeByGroupId(groupId)
      this.addOrUpdateForm = {
        groupId: row.groupId,
        name: row.name,
        groupFunctionId: row.groupFunctionId,
        deptId: row.deptId,
        remarks: row.remarks
        // platformList: res.data.data.platformList,
        // siteList: res.data.data.siteList,
        // brandList: res.data.data.brandList,
        // categoryList: res.data.data.categoryList,
      }
      let res = await getGroupSalesScopeByGroupId(groupId)
      if (res.data.code === 0) {
        if (res.data.data.PLATFORM && res.data.data.PLATFORM.length >= 1) {
          console.log(123)
          let platformList = []
          res.data.data.PLATFORM.forEach((item) => {
            platformList.push(item.valueId)
          })
          this.platformList = [...platformList]
          await this.changePlat(this.platformList)
        }
        if (res.data.data.SITE && res.data.data.SITE.length >= 1) {
          let siteList = []
          res.data.data.SITE.forEach((item) => {
            siteList.push(item.valueId)
          })
          this.siteList = [...siteList]
        }
        if (res.data.data.BRAND && res.data.data.BRAND.length >= 1) {
          let brandList = []
          res.data.data.BRAND.forEach((item) => {
            brandList.push(item.valueId)
          })
          this.brandList = [...brandList]
        }
        if (res.data.data.CATEGORY && res.data.data.CATEGORY.length >= 1) {
          let categoryList = []
          res.data.data.CATEGORY.forEach((item) => {
            categoryList.push(item.valueId)
          })
          this.categoryList = [...categoryList]
        }
      }
      checkUserForGroup(groupId).then((response) => {
        if (response.data.code === 0) {
          if (response.data.data) {
            this.groupFunctionSelectdisabled = true
          } else {
            this.groupFunctionSelectdisabled = false
          }
        } else {
          this.$notify({ type: "error", message: "查询小组下是否有组员信息失败" })
          return
        }
      })
      this.dialogTitle = "查看组"
      this.addOrUpdateGroupDialogVisible = true
    },
    resetForm() {
      this.platformList = []
      this.siteList = []
      this.brandList = []
      this.categoryList = []
    },
    // 双向绑定查询每页数量
    sizeChange(size) {
      this.page.pageSize = size
    },
    // 查询
    searchRecord(page, params) {
      var groupFunctionIdArray = this.groupFunctionIdArrayConfirm
      var deptIdArray = this.deptIdArrayConfirm

      if (groupFunctionIdArray) {
        this.searchParamsConfirm.groupFunctionIds = groupFunctionIdArray.join(",")
      } else {
        this.searchParamsConfirm.groupFunctionIds = ""
      }
      if (deptIdArray) {
        this.searchParamsConfirm.deptIds = deptIdArray.join(",")
      } else {
        this.searchParamsConfirm.deptIds = ""
      }
      if (!page) {
        page = {
          currentPage: 1,
          pageSize: 20
        }
      }

      this.page.currentPage = page.currentPage

      searchRecord(
        Object.assign({ current: page.currentPage, size: page.pageSize }, params, this.searchParamsConfirm)
      ).then(({ data }) => {
        if (data.code === 0) {
          this.list = data.data.records
          this.page.total = data.data.total
        } else if (data.code === 1) {
          this.$notify({ type: "error", message: data.msg })
        } else {
          this.$notify({ type: "error", message: "网络错误,请联系管理员" })
        }
      })
    },

    handleRefreshChange() {
      this.searchRecord(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(form, page) {
      this.searchParamsConfirm = deepCloneIgnoreNull(this.searchParams)
      this.deptIdArrayConfirm = this.deptIdArray
      this.groupFunctionIdArrayConfirm = this.groupFunctionIdArray
      this.searchRecord(page, form)
    },
    searchReset() {
      var params = this.searchParams
      params.name = ""
      params.groupFunctionIds = ""
      params.deptIds = ""
      this.groupFunctionIdArray = []
      this.deptIdArray = []
    }

    // // 新建
    // handleCreate(row, done, loading){
    //   this.form.deptId=this.form.deptName;
    //   this.form.groupFunctionId=this.form.groupFunctionName;
    //   insertRecord(this.form).then(({data})=>{
    //     if(data.code===0){
    //       this.$notify({type:'success', message:'新建成功'});
    //       this.searchRecord(this.page);
    //       done();
    //     }else if(data.msg){
    //       this.$notify({type:'warning', message:data.msg});
    //     }else{
    //       this.$notify({type:'error', message:'网络错误,请联系管理员'});
    //     }
    //   }).catch(error=>{
    //     console.log(error);
    //   });
    // },

    // // 修改
    // handleUpdate(row, index, done, loading){
    //   updateRecord(this.form).then(({data})=>{
    //     console.log(data)
    //     if(data.code===0){
    //       this.$notify({type:'success', message:'修改成功'});
    //       this.searchRecord(this.page);
    //       done();
    //     }else if(data.msg){
    //       this.$notify({type:'warning', message:data.msg});
    //     }else{
    //       this.$notify({type:'error', message:'网络错误,请联系管理员'});
    //     }
    //   }).catch((error)=>{
    //     console.log(error);
    //   });
    // },

    // // 删除
    // handleDelete(row, done, loading){
    //   this.$confirm('是否确认删除ID为'+row.groupId+'的小组?', '警告', {
    //   confirmButtonText:'确定', cancelButtonText:'取消', type:'warning'}).then(()=>{
    //     deleteRecord(row.groupId).then(({data})=>{
    //       if(data.code===0){
    //         this.$notify({type:'success', message:'删除成功'});
    //         this.searchRecord(this.page);
    //         done();
    //       }else if(data.msg){
    //         this.$notify({type:'warning', message:data.msg});
    //       }else{
    //         this.$notify({type:'error', message:'网络错误,请联系管理员'});
    //       }
    //     }).catch((error)=>{
    //       console.log(error);
    //     });
    //   });
    // }
  }
}
</script>

<style lang="scss">
.adminGroup {
  .el-dialog__header {
    height: 30px;
    background: #e8ecef;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid #d2d2d2;
  }

  .el-dialog__footer {
    padding: 20px 24px;
    border-top: 1px solid #d2d2d2;
    clear: both;
    background: #e8ecef;
    border-radius: 0px 0px 4px 4px;
  }

  .addOrUpdateGroupDialog {
    .el-form-item__label {
      width: 120px;
    }
  }
}
</style>
