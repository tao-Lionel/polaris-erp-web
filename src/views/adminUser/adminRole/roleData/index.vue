<template>
  <basic-container id="roleDataApp">
    <el-row :span="24">
      <el-col :xs="24" :sm="24" :md="10">
        <div style="overflow: hidden">
          <div style="float: left">
            <el-button size="mini" type="primary" v-if="permissions.sys_datarole_add" @click="addRoleData()"
              >新建角色</el-button
            >
            <!-- <el-button size="mini" type="primary" v-if="permissions.sys_datarole_add" @click="setMenuAuth">设置菜单数据权限</el-button>
          <el-button size="mini" type="primary" v-if="permissions.sys_datarole_add" @click="lookMenuAuth">查看菜单数据权限</el-button> -->
          </div>
        </div>
        <div class="role-data-search">
          <avue-crud
            ref="crud"
            :data="list"
            :page="page"
            :option="option"
            @on-load="searchRecord"
            @search-change="searchChange"
            @search-reset="searchReset"
            @current-row-change="handleCurrentChange"
            @size-change="sizeChange"
          >
            <!--数据角色搜索框-->
            <template slot="search">
              <el-form
                @submit.prevent.native
                :model="searchParams"
                ref="searchParams"
                :inline="true"
                class="demo-form-inline"
              >
                <el-form-item label="" prop="name">
                  <el-input
                    placeholder="数据角色名称"
                    v-model="searchParams.name"
                    size="small"
                    v-search-input
                  ></el-input>
                </el-form-item>
                <el-form-item label="" prop="remarks">
                  <el-input placeholder="备注" v-model="searchParams.remarks" size="small" v-search-input></el-input>
                </el-form-item>

                <!-- <el-form-item>
                  <el-button @click="reset(searchParams)" type="primary" size="mini">重置</el-button>
                  <el-button @click="search(searchParams)" type="primary" size="mini">搜索</el-button>
                </el-form-item> -->
              </el-form>
            </template>
            <template slot="operate" slot-scope="scope">
              <button
                type="button"
                v-if="permissions.sys_datarole_del"
                class="el-button el-button--text el-button--small"
                @click="handleDelete(scope.row)"
              >
                <i class="icon-shanchu"></i>
              </button>
            </template>
          </avue-crud>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="10">
        <div class="baseContainer y-card-tree" style="overflow: auto">
          <h4>查看/修改该角色下的数据权限:</h4>
          <el-tabs v-model="tabPosition" type="card" @tab-click="handleTabClick">
            <!--品类-->
            <el-tab-pane label="品类" name="品类">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small" style="width: 60%">
              </el-input>
              <el-select
                v-model="categoryGrouping"
                size="small"
                clearable
                @change="categoryGroupingChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in categoryGroupingOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-tree
                highlight-current
                :props="treeDataProps"
                :data="treeData"
                node-key="id"
                ref="catagoryTree"
                show-checkbox
                :filter-node-method="filterNode"
              >
              </el-tree>
              <el-button
                :disabled="catagoryDisabled"
                type="primary"
                @click="updateCategory"
                v-if="roleDataId && permissions.sys_datarole_assign"
                size="small"
                class="submitButton"
                >确认</el-button
              >
            </el-tab-pane>
            <!-- 品牌 -->
            <el-tab-pane label="品牌" name="品牌">
              <el-checkbox-group v-model="brandAllList">
                <div v-for="item in brandAll" :key="item.brandId" style="padding: 2px">
                  <el-checkbox :label="item.brandId">{{ item.brandName }}</el-checkbox>
                </div>
              </el-checkbox-group>
              <el-button
                :disabled="brandDisabled"
                type="primary"
                @click="updateBrand"
                v-if="roleDataId && permissions.sys_datarole_assign"
                size="small"
                class="submitButton"
                >确认</el-button
              >
            </el-tab-pane>
            <!--仓库-->
            <el-tab-pane class="warehouse-form" label="仓库" name="仓库">
              <!-- <el-form :model="warehouseForm" inline size="small" class="form">
              <el-form-item>
                <el-input size="small" v-model="warehouseForm.warehouseName" placeholder="仓库名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="warehouseForm.warehouseTypeId" placeholder="仓库类型">
                  <el-option
                    v-for="v in warehouseTypeOption"
                    :key="v.warehouseTypeId"
                    :label="v.warehouseTypeName"
                    :value="v.warehouseTypeId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item >
                <el-input size="small" v-model="warehouseForm.remark" placeholder="备注"></el-input>
              </el-form-item>
              <el-form-item style="float:right">
                <el-button type="primary" @click="warehouseFormSubmit">搜索</el-button>
              </el-form-item>
            </el-form> -->
              <span>
                <!-- <el-tag
                :key="tag.warehouseId"
                v-for="tag in checkedWarehouseKey"
                :disable-transitions="false"
              >
                {{tag.warehouseId}}
              </el-tag> -->
              </span>
              <div>
                <avue-crud
                  :option="warehouseOption"
                  ref="warehouse"
                  :page="warehousePage"
                  @on-load="warehouseSearchRecord"
                  @search-change="warehouseSearchChange"
                  @selection-row="selectionRow"
                  @selection-all="selectionAll"
                  :data="warehouseList"
                >
                  <template slot="search">
                    <el-form :model="warehouseForm" :inline="true" class="demo-form-inline" ref="warehouseForm">
                      <el-form-item>
                        <el-input
                          v-model="warehouseForm.warehouseName"
                          size="small"
                          placeholder="仓库名称"
                          v-search-input
                        ></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-select
                          v-model="warehouseForm.warehouseTypeId"
                          size="small"
                          placeholder="仓库类型"
                          clearable
                        >
                          <el-option
                            v-for="v in warehouseTypeOption"
                            :key="v.warehouseTypeId"
                            :label="v.warehouseTypeName"
                            :value="v.warehouseTypeId"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-input v-model="warehouseForm.remark" size="small" placeholder="备注"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </avue-crud>
                <!-- <el-table ref="warehouse" border :data="warehouseList" @selection-change="warehouseSelectionChange" max-height="600">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-for="v in warehouseTableColumn" :key="v.name" :label="v.name" :prop="v.prop"></el-table-column>
            </el-table> -->
                <el-button
                  :disabled="warehouseDisabled"
                  type="primary"
                  @click="updateWarehouse"
                  v-if="roleDataId && permissions.sys_datarole_assign"
                  size="small"
                  class="submitButton"
                  >确认</el-button
                >
              </div>
            </el-tab-pane>

            <!--店铺-->
            <el-tab-pane class="warehouse-form" label="店铺" name="店铺">
              <!-- <el-tag
                :key="tag.storeId"
                v-for="tag in checkedStoreKey"
                :disable-transitions="false"
              >
                {{tag.storeId}}
              </el-tag> -->
              <div>
                <avue-crud
                  :option="storeOption"
                  ref="store"
                  :page="storePage"
                  @on-load="storeSearchRecord"
                  @search-change="storeSearchChange"
                  @selection-row="storeSelectionRow"
                  @selection-all="storeSelectionAll"
                  :data="storeList"
                >
                  <template slot="search">
                    <el-form :model="storeForm" inline>
                      <el-form-item>
                        <el-input
                          v-model="storeForm.storeAccount"
                          size="small"
                          placeholder="店铺名称"
                          v-search-input
                        ></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-input v-model="storeForm.remark" size="small" placeholder="备注"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </avue-crud>
                <!-- <el-table ref="store" border :data="storeList" @selection-change="storeSelectionChange" max-height="600">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column v-for="v in storeTableColumn" :key="v.name" :label="v.name" :prop="v.prop"></el-table-column>
            </el-table> -->
                <el-button
                  :disabled="storeDisabled"
                  type="primary"
                  @click="updateStore"
                  v-if="roleDataId && permissions.sys_datarole_assign"
                  size="small"
                  class="submitButton"
                  >确认</el-button
                >
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <!--拥有该角色的用户-->
      <el-col :xs="24" :sm="24" :md="4">
        <div class="baseContainer">
          <h4>拥有该角色的用户有:</h4>
          <div v-if="roleDataId && roleDataId !== ''" style="font-size: 14px">
            <font v-if="!roleAuthorityNames || roleAuthorityNames.length === 0" color="orange"
              >暂无拥有该角色的用户...</font
            >
            <font v-else
              ><el-tag v-for="item in roleAuthorityNames" :key="item.index">{{ item }}</el-tag></font
            >
          </div>
          <div style="font-size: 14px; color: gray" v-else>请选择数据角色.</div>
        </div>
      </el-col>
    </el-row>

    <!-- 菜单数据权限 -->
    <el-dialog title="菜单数据权限" center :visible.sync="menuAuthVisible" width="50%">
      <el-table border :data="menuTreeData" max-height="500" style="width: 100%">
        <el-table-column label="菜单名称" prop="name"> </el-table-column>
        <el-table-column label="品类" prop="aaaa"> </el-table-column>
        <el-table-column label="品牌" prop="bbbb"> </el-table-column>
        <el-table-column label="仓库" prop="cccc"> </el-table-column>
        <el-table-column label="店铺" prop="dddd"> </el-table-column>
      </el-table>
    </el-dialog>

    <!--新建数据角色弹出框-->
    <el-dialog
      title="新建数据角色"
      center
      :visible.sync="addRoleDataDialogVisible"
      width="500px"
      @close="addRoleDataDialogClose"
    >
      <el-form ref="addRoleDataForm" :model="addRoleDataForm" status-icon>
        <el-form-item
          label="角色名称:"
          prop="name"
          :rules="[{ required: true, message: '角色名称不能为空', trigger: 'blur' }]"
        >
          <el-input size="small" v-model.trim="addRoleDataForm.name" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="备　 　 注:" prop="remarks">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4 }"
            v-model.trim="addRoleDataForm.remarks"
            maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addRoleDataDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addRoleDataSubmit('addRoleDataForm')">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { search, insert, remove, update, select, warehouseType } from "@/api/adminUser/adminRole"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { fetchBrandAll } from "@/api/product/prdskubrand"
import { GetMenu } from "@/api/admin/menu"
import { tableOption, warehouseOption, storeOption } from "@/const/crud/adminUser/adminRole/roleData"
import { manageResponse, deleteEmptyProps } from "@/util/util"
import * as warehouseApi from "@/api/baseSetup/bsewarehouse"
import * as storeApi from "@/api/baseSetup/bsestore"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getDictByType } from "@/util/auth"

export default {
  components: {},
  data() {
    return {
      // 数据角色集合
      list: [],
      // 分页
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 20
      },
      // 数据角色表
      option: tableOption,
      // 选中的数据角色行的ID
      roleDataId: "",

      // 选中tab标签
      tabPosition: "品类",
      // 树子节点属性
      treeDataProps: {
        label: "name",
        children: "children"
      },
      // 该数据角色所拥有的品类/仓库/店铺/用户集合
      checkedCategory: [],
      checkedWarehouse: [],
      checkedStore: [],
      roleAuthorityNames: [],
      // 品类树/所有仓库数据/所有店铺数据
      treeData: [],
      warehouseList: [],
      storeList: [],
      // 仓库搜索参数
      warehouseForm: {
        warehouseName: "",
        warehouseTypeId: "",
        remark: "",
        funcState: "1"
      },
      warehouseFormConfirm: {
        warehouseName: "",
        warehouseTypeId: "",
        remark: "",
        funcState: "1"
      },
      // 仓库分页
      warehousePage: {
        total: 0,
        currentPage: 1,
        pageSize: 20
      },
      // 仓库列表
      warehouseOption: warehouseOption,
      warehouseTableColumn: [
        { name: "仓库名称", prop: "warehouseName" },
        { name: "仓库简称", prop: "" },
        { name: "仓库类型", prop: "warehouseTypeName" },
        { name: "备注", prop: "remark" }
      ],
      // 仓库类型集合
      warehouseTypeOption: [],
      // selectedWarehouseIndex:[],
      // 店铺搜索参数
      storeForm: {
        storeAccount: "",
        remark: "",
        state: "0"
      },
      storeFormConfirm: {
        storeAccount: "",
        remark: "",
        state: "0"
      },
      // 店铺分页
      storePage: {
        total: 0,
        currentPage: 1,
        pageSize: 20
      },
      //selectedStoreIndex:[],
      // 店铺列表
      storeOption: storeOption,
      storeTableColumn: [
        { name: "店铺名称", prop: "storeAccount" },
        { name: "店铺简称", prop: "" },
        { name: "备注", prop: "remark" }
      ],
      // 更新的品类/仓库/店铺集合
      checkedCatagoryKey: [],
      checkedWarehouseKey: [],
      checkedStoreKey: [],

      // 新增角色弹框是否显示
      addRoleDataDialogVisible: false,
      // 新增角色表格
      addRoleDataForm: {
        name: "",
        remarks: ""
      },
      //搜索
      searchParams: {
        name: "",
        remarks: ""
      },
      searchParamsConfirm: {
        name: "",
        remarks: ""
      },
      //按钮是否可用
      catagoryDisabled: true,
      brandDisabled: true,
      warehouseDisabled: true,
      storeDisabled: true,

      filterText: "",
      brandAll: [],
      brandAllList: [],
      menuTreeData: [],
      menuAuthVisible: false,
      testData: [{}],
      categoryGroupingOptions: [],
      categoryGrouping: ""
    }
  },

  mounted() {},

  async created() {
    // 加载店铺树
    fetchTreeList().then(({ data }) => {
      if (data.code === 0) {
        this.treeData = data.data
      } else {
        this.$notify({ type: "error", message: "查询品类信息失败" })
      }
    })
    const params = {
      size: -1,
      current: -1
    }
    fetchBrandAll(params).then((res) => {
      if (res.data.code === 0) {
        console.log(112121, res)
        this.brandAll = res.data.data.records
      }
    })

    let menuArr = []
    this.$store.getters.menu.forEach((item) => {
      if (item.children.length) {
        item.children.forEach((firstItem) => {
          if (firstItem.children.length) {
            firstItem.children.forEach((secondItem) => {
              menuArr.push(secondItem)
            })
          } else {
            menuArr.push(firstItem)
          }
        })
      }
    })
    this.menuTreeData = menuArr

    // 加载所有店铺
    // storeApi.fetchList().then(({data})=>{
    //   if(data.code===0){
    //     this.storeList=data.data.records;
    //   }else{
    //     this.$notify({type:'info', message:'查询店铺信息失败'});
    //   }
    // });
    warehouseType().then(({ data }) => {
      this.warehouseTypeOption = data.data
    })
    this.categoryGroupingOptions = await getDictByType("costing_category_grouping")
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {
    filterText(val) {
      this.$refs.catagoryTree.filter(val)
    }
  },
  methods: {
    categoryGroupingChange(val) {
      this.$refs.catagoryTree.filter(this.filterText)
    },
    setMenuAuth() {},
    lookMenuAuth() {},
    filterNode(value, data) {
      if (!value) {
        return this.categoryGrouping ? data.categoryGrouping === this.categoryGrouping : true
      }
      if (this.categoryGrouping) {
        return data.categoryGrouping === this.categoryGrouping
          ? data.label.toLowerCase().indexOf(value.trim().toLowerCase()) !== -1
          : false
      }
      return data.label.toLowerCase().indexOf(value.trim().toLowerCase()) !== -1
    },
    addRoleDataDialogClose() {
      this.$refs["addRoleDataForm"].resetFields()
    },
    // 清空搜索
    searchReset(param) {
      this.searchParams.name = ""
      this.searchParams.remarks = ""
    },
    sizeChange(size) {
      this.page.pageSize = size
      this.clearSelect()
    },
    warehouseSearchChange(params, page) {
      this.warehouseFormConfirm = deepCloneIgnoreNull(this.warehouseForm)
      this.warehouseSearchRecord(page, params)
    },
    warehouseSearchRecord(page, params) {
      this.warehouseDisabled = true
      // params=Object.assign(params  || {},this.warehouseForm) ;
      // var warehouseName = params.warehouseName;
      // var remark = params.remark;
      // if(warehouseName && warehouseName!==''){
      //   params.warehouseName = warehouseName.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
      // }
      // if(remark && remark!==''){
      //   params.remark = remark.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
      // }
      this.warehousePage.currentPage = page.currentPage
      params = deleteEmptyProps(this.warehouseFormConfirm)
      // if(remarks){
      //   params.remarks = remarks.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
      // }

      warehouseApi
        .fetchList(
          Object.assign(
            {
              page: page.currentPage,
              pageSize: page.pageSize
            },
            params,
            this.warehouseFormConfirm
          )
        )
        .then(({ data }) => {
          if (data.code === 0) {
            this.warehouseList = data.data.records
            this.warehousePage.total = data.data.total
            if (this.roleDataId && this.roleDataId != "") {
              this.$refs.warehouse.selectClear()
              var selectKey = []
              for (let i in this.checkedWarehouseKey) {
                var warehouseRow = this.warehouseList.filter(
                  (item) => item.warehouseId == this.checkedWarehouseKey[i].warehouseId
                )
                if (warehouseRow && warehouseRow.length > 0) {
                  selectKey.push(warehouseRow[0])
                }
              }
              this.$refs.warehouse.toggleSelection(selectKey)
            }
            this.warehouseDisabled = false
          } else {
            this.$notify({ type: "error", message: "查询仓库信息失败" })
          }
        })
    },

    storeSearchChange(params, page) {
      this.storeFormConfirm = deepCloneIgnoreNull(this.storeForm)
      this.storeSearchRecord(page, params)
    },

    storeSearchRecord(page, params) {
      this.storeDisabled = true
      // params=Object.assign(params  || {},this.storeForm) ;
      // var storeAccount = params.storeAccount;
      // var remark = params.remark;
      // if(storeAccount && storeAccount!==''){
      //   params.storeAccount = storeAccount.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
      // }
      // if(remark && remark!==''){
      //   params.remark = remark.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
      // }
      this.storePage.currentPage = page.currentPage
      params = deleteEmptyProps(this.storeFormConfirm)
      storeApi
        .fetchList(
          Object.assign(
            {
              page: page.currentPage,
              pageSize: page.pageSize
            },
            params,
            this.storeFormConfirm
          )
        )
        .then(({ data }) => {
          if (data.code === 0) {
            this.storeList = data.data.records
            this.storePage.total = data.data.total
            if (this.roleDataId && this.roleDataId != "") {
              this.$refs.store.selectClear()
              var selectKey = []
              for (let i in this.checkedStoreKey) {
                var storeRow = this.storeList.filter((item) => item.storeId == this.checkedStoreKey[i].storeId)
                if (storeRow && storeRow.length > 0) {
                  selectKey.push(storeRow[0])
                }
              }
              this.$refs.store.toggleSelection(selectKey)
            }
            this.storeDisabled = false
          } else {
            this.$notify({ type: "error", message: "查询店铺信息失败" })
          }
        })
    },

    // 新增角色
    addRoleData() {
      this.addRoleDataDialogVisible = true
    },

    addRoleDataSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          insert(this.addRoleDataForm)
            .then(({ data }) => {
              if (data.code === 0) {
                this.addRoleDataDialogVisible = false
                this.$notify({ type: "success", message: "新建成功" })
                this.searchRecord(this.page)
              } else if (data.code === 1) {
                this.$notify({ type: "error", message: data.msg })
              } else {
                this.$notify({ type: "error", message: "新增失败" })
              }
            })
            .finally(() => {})
        } else {
          return false
        }
      })
    },

    searchChange(params, page) {
      this.searchParamsConfirm = deepCloneIgnoreNull(this.searchParams)
      this.searchRecord(page, params)
    },

    // 查询列表
    searchRecord(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }
      // params=Object.assign(params  || {},this.searchParams) ;
      // var name = params.name;
      // var remarks = params.remarks;
      // if(name){
      //   params.name = name.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
      // }
      // if(remarks){
      //   params.remarks = remarks.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
      // }

      this.page.currentPage = page.currentPage
      //查询数据角色
      search(Object.assign({ current: page.currentPage, size: page.pageSize }, params, this.searchParamsConfirm)).then(
        ({ data }) => {
          if (data.code === 0) {
            this.list = data.data.records
            this.page.total = data.data.total
          } else if (data.msg) {
            this.$notify({ type: "error", message: data.msg })
          } else {
            this.$notify({ type: "error", message: "查询数据角色失败" })
          }
        }
      )
      console.info(this.page)
      this.clearSelect()
    },

    clearSelect() {
      if (this.$refs.crud) {
        this.$refs.crud.setCurrentRow()
      }
      // 清空勾选项
      if (this.$refs.warehouse) {
        this.$refs.warehouse.selectClear()
      }
      if (this.$refs.catagoryTree) {
        this.$refs.catagoryTree.setCheckedKeys([])
      }
      if (this.$refs.store) {
        this.$refs.store.selectClear([])
      }
      // 清空属性
      this.checkedCategory = []
      this.checkedWarehouse = []
      this.checkedStore = []
      this.roleAuthorityNames = []
      this.roleDataId = ""
      this.checkedWarehouseKey = []
      this.checkedCatagoryKey = []
      this.checkedStoreKey = []
    },

    // 获取仓库数据
    getWarehouseList(page, params) {
      warehouseApi
        .fetchList(
          Object.assign(
            {
              current: page.currentPage,
              size: page.pageSize
            },
            params
          )
        )
        .then(({ data }) => {
          if (data.code === 0) {
            this.warehouseList = data.data.records
            this.warehousePage.total = data.data.total
          } else {
            this.$notify({ type: "error", message: "查询仓库信息失败" })
          }
        })
    },

    // 获取店铺数据
    getStoreList(params) {
      storeApi.fetchList(params).then(({ data }) => {
        if (data.code === 0) {
          this.storeList = data.data.records
        } else {
          this.$notify({ type: "error", message: "查询店铺信息失败" })
        }
      })
    },

    // 仓库类型数据
    getWarehouseType(params) {},

    // 条件搜索
    // search(params){
    //   var name = params.name;
    //   var remarks = params.remarks;
    //   if(name){
    //     params.name = name.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
    //   }
    //   if(remarks){
    //     params.remarks = remarks.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
    //   }
    //   this.searchRecord(this.page, params);
    // },

    reset(params) {
      params.name = ""
      params.remarks = ""
    },

    // 删除记录
    handleDelete(row) {
      this.$confirm("是否确认删除ID为" + row.roleDataId + "的小组?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          remove(row.roleDataId)
            .then(({ data }) => {
              if (data.code === 0) {
                this.$notify({ type: "success", message: "删除成功" })
                this.searchRecord(this.page)
              } else if (data.code === 1) {
                this.$notify({ type: "error", message: data.msg })
              } else {
                this.$notify({ type: "error", message: "删除失败" })
              }
            })
            .finally(() => {})
        })
        .catch((res) => {})
    },

    // 选择列表记录 切换选中数组
    handleCurrentChange(item) {
      if (item && item.roleDataId) {
        // var loading = this.$loading({
        //   lock: true,
        //   text: '正在查询角色的权限',
        //   spinner: 'el-icon-loading'
        // });

        this.catagoryDisabled = true
        this.brandDisabled = true
        this.warehouseDisabled = true
        this.storeDisabled = true
        this.roleDataId = item.roleDataId
        select(this.roleDataId).then(({ data }) => {
          this.checkedCategory = data.data.categoryIds
          this.brandAllList = data.data.brandIds
          this.$refs.catagoryTree.setCheckedKeys(this.checkedCategory)
          this.checkedWarehouse = data.data.warehouseIds
          this.checkedStore = data.data.storeIds
          this.roleAuthorityNames = data.data.userNames
          this.initWarehouseSelect()
          this.initStoreSelect()
          this.catagoryDisabled = false
          this.brandDisabled = false
          this.warehouseDisabled = false
          this.storeDisabled = false
        })
      }
    },

    // 数据角色的仓库初始勾选值
    initWarehouseSelect() {
      this.checkedWarehouseKey = []
      if (this.checkedWarehouse && this.checkedWarehouse.length > 0) {
        for (var i = 0; i < this.checkedWarehouse.length; i++) {
          this.checkedWarehouseKey.push({ warehouseId: this.checkedWarehouse[i] })
        }
      }
      this.$refs.warehouse.selectClear()
      var select = []
      for (let i in this.checkedWarehouse) {
        var warehouseRow = this.warehouseList.filter((item) => item.warehouseId == this.checkedWarehouse[i])
        if (warehouseRow && warehouseRow.length > 0) {
          select.push(warehouseRow[0])
        }
      }
      this.$refs.warehouse.toggleSelection(select)
    },

    // 数据角色的店铺初始勾选值
    initStoreSelect() {
      this.checkedStoreKey = []
      if (this.checkedStore && this.checkedStore.length > 0) {
        for (var i = 0; i < this.checkedStore.length; i++) {
          this.checkedStoreKey.push({ storeId: this.checkedStore[i] })
        }
      }
      this.$refs.store.selectClear()
      var select = []
      for (let i in this.checkedStore) {
        var storeRow = this.storeList.filter((item) => item.storeId == this.checkedStore[i])
        if (storeRow && storeRow.length > 0) {
          select.push(storeRow[0])
        }
      }
      this.$refs.store.toggleSelection(select)
    },

    // 点击选项
    handleTabClick(tab) {
      if (tab.name === "品类") {
        this.$refs.catagoryTree.setCheckedKeys(this.checkedCategory)
      }
      if (tab.name === "仓库") {
        this.initWarehouseSelect()
      }
      if (tab.name === "店铺") {
        this.initStoreSelect()
      }
    },

    // 更新角色拥有的品类权限
    updateCategory() {
      this.checkedCatagoryKey = this.$refs.catagoryTree.getCheckedKeys()
      this.checkedCatagoryKey = this.resolveAllEunuchNodeId(this.treeData, this.checkedCatagoryKey, [])

      update(
        Object.assign({
          roleDataId: this.roleDataId,
          categoryIds: this.checkedCatagoryKey,
          assignModule: "skuCategory"
        })
      )
        .then(({ data }) => {
          if (data.code === 0) {
            select(this.roleDataId).then(({ data }) => {
              this.checkedCategory = data.data.categoryIds
              this.$refs.catagoryTree.setCheckedKeys(this.checkedCategory)
            })
            this.$notify({ type: "success", message: "分配成功" })
          } else if (data.code === 1) {
            this.$notify({ type: "error", message: data.msg })
          } else {
            this.$notify({ type: "error", message: "分配失败" })
          }
        })
        .finally(() => {})
    },

    // 更新角色拥有的品牌权限
    updateBrand() {
      console.log(this.brandAllList)
      update(Object.assign({ roleDataId: this.roleDataId, brandIds: this.brandAllList, assignModule: "brand" }))
        .then(({ data }) => {
          if (data.code === 0) {
            select(this.roleDataId).then(({ data }) => {
              console.log(data)
              this.brandAllList = data.data.brandIds
            })
            this.$notify({ type: "success", message: "分配成功" })
          } else if (data.code === 1) {
            this.$notify({ type: "error", message: data.msg })
          } else {
            this.$notify({ type: "error", message: "分配失败" })
          }
        })
        .finally(() => {})
    },

    // 删除父节点
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          var filterArray = idArr.filter((id) => id === item.id)
          if (filterArray && filterArray.length > 0) {
            temp.push(filterArray.join(","))
          }
        }
      }
      return temp
    },

    // 更新角色拥有的仓库权限
    updateWarehouse() {
      var warehouseIds = []
      for (var i = 0; i < this.checkedWarehouseKey.length; i++) {
        if (this.checkedWarehouseKey[i]) {
          warehouseIds.push(this.checkedWarehouseKey[i].warehouseId)
        }
      }

      update(Object.assign({ roleDataId: this.roleDataId, warehouseIds: warehouseIds, assignModule: "warehouse" }))
        .then(({ data }) => {
          if (data.code === 0) {
            select(this.roleDataId).then(({ data }) => {
              this.checkedWarehouse = data.data.warehouseIds
              this.initWarehouseSelect()
            })
            this.$notify({ type: "success", message: "分配成功" })
          } else if (deta.msg) {
            this.$notify({ type: "error", message: data.msg })
          } else {
            this.$notify({ type: "error", message: "分配失败" })
          }
        })
        .finally(() => {})
    },

    // 更新角色拥有的店铺角色
    updateStore() {
      var storeIds = []

      for (var i = 0; i < this.checkedStoreKey.length; i++) {
        if (this.checkedStoreKey[i]) {
          storeIds.push(this.checkedStoreKey[i].storeId)
        }
      }

      update(Object.assign({ roleDataId: this.roleDataId, storeIds: storeIds, assignModule: "platAccount" }))
        .then(({ data }) => {
          if (data.code === 0) {
            select(this.roleDataId).then(({ data }) => {
              this.checkedStore = data.data.storeIds
              this.initStoreSelect()
            })
            this.$notify({ type: "success", message: "分配成功" })
          } else if (deta.msg) {
            this.$notify({ type: "error", message: data.msg })
          } else {
            this.$notify({ type: "error", message: "分配失败" })
          }
        })
        .finally(() => {})
    },

    // 仓库表单提交
    warehouseFormSubmit() {
      this.getWarehouseList(deleteEmptyProps(this.warehouseForm))
    },

    selectionRow(selection, row) {
      if (this.roleDataId && this.roleDataId != "") {
        this.warehouseDisabled = true
        var isSelect = selection.filter((item) => item.warehouseId == row.warehouseId)
        if (!isSelect || isSelect.length == 0) {
          this.checkedWarehouseKey = this.checkedWarehouseKey.filter((item) => item.warehouseId != row.warehouseId)
        } else {
          this.checkedWarehouseKey = this.checkedWarehouseKey.filter((item) => item.warehouseId != row.warehouseId)
          this.checkedWarehouseKey.push(row)
        }
        this.warehouseDisabled = false
      }
    },
    selectionAll(selection) {
      if (this.roleDataId && this.roleDataId != "") {
        this.warehouseDisabled = true
        if (!selection || selection.length == 0) {
          for (let i in this.warehouseList) {
            this.checkedWarehouseKey = this.checkedWarehouseKey.filter(
              (item) => item.warehouseId != this.warehouseList[i].warehouseId
            )
          }
        } else {
          for (let i in selection) {
            this.checkedWarehouseKey = this.checkedWarehouseKey.filter(
              (item) => item.warehouseId != selection[i].warehouseId
            )
            this.checkedWarehouseKey.push(selection[i])
          }
        }
        this.warehouseDisabled = false
      }
    },

    storeSelectionRow(selection, row) {
      if (this.roleDataId && this.roleDataId != "") {
        this.storeDisabled = true
        var isSelect = selection.filter((item) => item.storeId == row.storeId)
        if (!isSelect || isSelect.length == 0) {
          this.checkedStoreKey = this.checkedStoreKey.filter((item) => item.storeId != row.storeId)
        } else {
          this.checkedStoreKey = this.checkedStoreKey.filter((item) => item.storeId != row.storeId)
          this.checkedStoreKey.push(row)
        }
        this.storeDisabled = false
      }
    },

    storeSelectionAll(selection) {
      if (this.roleDataId && this.roleDataId != "") {
        this.storeDisabled = true
        if (!selection || selection.length == 0) {
          for (let i in this.storeList) {
            this.checkedStoreKey = this.checkedStoreKey.filter((item) => item.storeId != this.storeList[i].storeId)
          }
        } else {
          for (let i in selection) {
            this.checkedStoreKey = this.checkedStoreKey.filter((item) => item.storeId != selection[i].storeId)
            this.checkedStoreKey.push(selection[i])
          }
        }
        this.storeDisabled = false
      }
    },

    // 店铺表单提交
    storeFormSubmit() {
      this.getStoreList(deleteEmptyProps(this.storeForm))
    },

    // 默认选中的店铺
    selectedStore() {
      this.$refs.store.toggleRowSelection(this.storeList[this.selectedStoreIndex], true)
    }
  }
}
</script>

<style lang="scss" scope>
@import "./index.scss";
</style>
