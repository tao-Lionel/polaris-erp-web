<template>
  <basic-container class="adminPloyee admin-dict">
    <adminDialog :data="viewMoreDialogData" :isShowDialog="isShowDialog" @adminDialog="adminDialogFnc" />

    <el-row style="display: flex" :span="24">
      <el-col :xs="24" :sm="24" :md="5" style="overflow-x: auto; overflow-y: hidden">
        <p class="ground-title"><b>结构组织</b>(不含业务小组)</p>
        <!-- 左边组织架构 -->
        <el-tree
          class="left-tree"
          highlight-current
          :data="deptTreeData"
          :props="deptTreeProps"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="searchDeptNodeData"
        ></el-tree>
      </el-col>
      <el-col :xs="24" :sm="24" :md="19">
        <div style="padding: 0 10px">
          <div class="ployee-btn-wrap">
            <!-- icon="el-icon-plus" -->
            <el-button v-if="permissions.sys_user_add" size="mini" type="primary" @click="handleCreatePloyee"
              >新建员工资料</el-button
            >
            <el-button v-if="permissions.sys_user_edit" size="mini" type="primary" @click="handleUpdatePloyee"
              >修改员工资料</el-button
            >
            <el-button v-if="permissions.user_relation_function" size="mini" type="primary" @click="handleRelevantRole"
              >关联功能角色</el-button
            >
            <el-button v-if="permissions.user_relation_data" size="mini" type="primary" @click="handleRelevantDataRole"
              >关联数据角色</el-button
            >
            <el-button v-if="permissions.user_password_reset" size="mini" type="primary" @click="passwordInit"
              >密码初始化</el-button
            >
            <el-button v-if="permissions.sys_user_rep" size="mini" type="primary" @click="handleLoginPloyee"
              >登录</el-button
            >
            <el-button v-if="permissions.sys_user_lock" size="mini" type="primary" @click="handleEnable"
              >启用</el-button
            >
            <el-button v-if="permissions.sys_user_lock" size="mini" type="primary" @click="handleDisable"
              >禁用</el-button
            >
          </div>
          <!-- <div style="float:right">
            <el-button v-if="permissions.sys_user_rep" size="mini" type="primary" @click="handleLoginPloyee">登录</el-button>
            <el-button v-if="permissions.sys_user_lock" size="mini" type="primary" @click="handleEnable">启用</el-button>
            <el-button v-if="permissions.sys_user_lock" size="mini" type="info" @click="handleDisable">禁用</el-button>
          </div> -->
        </div>
        <avue-crud
          :option="option"
          ref="crud"
          class="handle-cell-hidden"
          v-model="form"
          :page="page"
          @on-load="getList"
          @size-change="sizeChange"
          @search-change="handleFilter"
          @search-reset="searchReset"
          @refresh-change="handleRefreshChange"
          @row-update="update"
          @row-save="create"
          @selection-change="selectionChange"
          :before-open="handleOpenBefore"
          :data="list"
        >
          <template slot="search">
            <el-form
              @submit.native.prevent
              :model="formInline"
              ref="formInline"
              :inline="true"
              class="demo-form-inline"
            >
              <el-form-item>
                <el-input v-model="formInline.username" size="small" placeholder="用户账号"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="formInline.displayname" size="small" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="formInline.lockFlag" clearable size="small" placeholder="选择启用状态">
                  <el-option label="启用中" value="0"></el-option>
                  <el-option label="禁用中" value="1"></el-option>
                </el-select>
              </el-form-item>
              <!-- 搜索隐藏按钮，误删 -->
            </el-form>
          </template>

          <!-- <template slot="username" slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template> -->
          <!-- <template slot="displayname" slot-scope="scope">
            <span>{{scope.row.displayname}}</span>
          </template> -->
          <template slot="role" slot-scope="scope">
            <span v-for="(role, index) in scope.row.roleList" :key="index">
              <el-tag>{{ role.roleName }}</el-tag
              >&nbsp;&nbsp;
            </span>
          </template>
          <template slot="deptId" slot-scope="scope">{{ scope.row.deptName }}</template>
          <template slot="lockFlag" slot-scope="scope">
            <el-tag :type="scope.label === '禁用中' ? 'danger' : 'success'">{{ scope.label }}</el-tag>
          </template>
          <template slot="roleFunction" slot-scope="scope">
            <!-- <span
            title="点击查看其功能权限"
              @click="showRoleFunction(scope.row.userId,scope.row.displayname)"
              class="el-row-text clickClass"
            >点击查看其功能权限</span> -->
            <i class="icon-chakan y-reviews" @click="showRoleFunction(scope.row.userId, scope.row.displayname)"></i>
          </template>
          <template slot="userPositionName" slot-scope="scope">
            <el-row v-for="(k, v) in scope.row.sysUserGroups" :key="v" style="margin-bottom: 0px">
              <div class="admin-info" v-if="v === 0 && k.groupName">
                <el-col style="text-align: left">组: {{ k.groupName }}</el-col>
                <el-col style="text-align: left"
                  >职务: {{ k.userPositionName }}/{{ k.dataShareName }}
                  <a @click.stop="viewMore(scope.row.sysUserGroups)" v-if="scope.row.sysUserGroups.length >= 2"
                    >更多>></a
                  >
                </el-col>
              </div>
            </el-row>
          </template>
          <template slot="categoryNames" slot-scope="scope">
            <!-- <span v-if="scope.row.prdSkuCategorys && scope.row.prdSkuCategorys.length===1">{{scope.row.prdSkuCategorys[0].categoryName}}</span>
              <span v-if="scope.row.prdSkuCategorys && scope.row.prdSkuCategorys.length>1" @click="showSkuCategorys(scope.row)" class="showDataRoleClass">{{scope.row.prdSkuCategorys[0].categoryName}}...</span> -->
            <!-- <span title="点击查看其品类权限"
                @click="showSkuCategory(scope.row.userId,scope.row.displayname)"
                class="clickClass el-row-text"
              >点击查看其品类权限</span> -->
            <i class="icon-chakan y-reviews" @click="showSkuCategory(scope.row.userId, scope.row.displayname)"></i>
          </template>
          <template slot="brandNames" slot-scope="scope">
            <i class="icon-chakan y-reviews" @click="showBrand(scope.row.userId, scope.row.displayname)"></i>
          </template>
          <template slot="baseStoreNames" slot-scope="scope">
            <!-- <span v-if="scope.row.bseStores && scope.row.bseStores.length===1">{{scope.row.bseStores[0].storeAccount}}</span>
              <span v-if="scope.row.bseStores && scope.row.bseStores.length>1" @click="showBseStores(scope.row)" class="showDataRoleClass">{{scope.row.bseStores[0].storeAccount}}...</span> -->
            <!-- <span title="点击查看其店铺权限"
                @click="showbaseStore(scope.row.userId,scope.row.displayname)"
                class="clickClass el-row-text"
              >点击查看其店铺权限</span> -->
            <i class="icon-chakan y-reviews" @click="showbaseStore(scope.row.userId, scope.row.displayname)"></i>
          </template>
          <template slot="warehouses" slot-scope="scope">
            <!-- <span v-if="scope.row.bseWarehouses && scope.row.bseWarehouses.length===1">{{scope.row.bseWarehouses[0].warehouseName}}</span>
              <span v-if="scope.row.bseWarehouses && scope.row.bseWarehouses.length>1" @click="showBseWarehouses(scope.row)" class="showDataRoleClass">{{scope.row.bseWarehouses[0].warehouseName}}...</span>   -->
            <!-- <span title="点击查看其仓库权限"
                @click="showWarehouse(scope.row.userId,scope.row.displayname)"
                class="clickClass el-row-text"
              >点击查看其仓库权限</span> -->
            <i class="icon-chakan y-reviews" @click="showWarehouse(scope.row.userId, scope.row.displayname)"></i>
          </template>
          <template slot="deptIdForm">
            <avue-crud-input
              v-model="form.deptId"
              type="tree"
              placeholder="请选择所属部门"
              :node-click="getNodeData"
              :dic="treeDeptData"
              :props="defaultProps"
            ></avue-crud-input>
          </template>
          <template slot="roleForm">
            <avue-crud-select
              v-model="role"
              multiple
              placeholder="请选择角色"
              :dic="rolesOptions"
              :props="roleProps"
            ></avue-crud-select>
          </template>
        </avue-crud>
      </el-col>
    </el-row>

    <!--关联功能角色-->
    <div>
      <el-dialog title="关联功能角色" :visible.sync="relateModal" width="500px" center @close="relateModalClose">
        <h3 class="mg-b-20">
          功能角色
          <span style="color: red; font-size: 14px; margin-left: 10px">{{ roleFunctionError }}</span>
        </h3>
        <font color="orange">
          <el-tag
            :key="tag.roleId"
            v-for="tag in userRoleList"
            closable
            :disable-transitions="false"
            @close="handleCloseTag(tag)"
            >{{ tag.roleName }}</el-tag
          >
        </font>

        <el-form ref="roleFunctionForm" :model="roleFunctionForm">
          <el-form-item
            :label="'功能权限' + (i + 1) + ':'"
            v-for="(v, i) in roleFunctionForm.roleFunction"
            :key="v.key"
            :prop="'roleFunction.' + i + '.value'"
            :rules="[{ required: true, message: '请选择功能角色', trigger: 'change' }]"
          >
            <el-select
              size="small"
              v-model="v.value"
              style="width: 280px"
              placeholder="请选择功能角色, 即功能模板"
              @change="changeRoleSelect()"
              filterable
            >
              <el-option
                v-for="item in allRoleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              ></el-option>
              <!-- <el-option label="区域一" value="一"></el-option>
                <el-option label="区域二" value="二"></el-option>-->
            </el-select>
            <el-button type="text" @click.prevent="removeItem(v)" style="margin: 0 1rem">&times;</el-button>
          </el-form-item>
          <el-button @click="appendItem" style="width: 100%; margin-top: 20px">添加</el-button>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="relateModal = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitRoleFunctionFrom('roleFunctionForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!--关联数据角色-->
    <div>
      <el-dialog
        title="关联数据角色"
        :visible.sync="relateRoleDataModal"
        width="500px"
        center
        @close="relateRoleDataModalClose"
      >
        <h3 class="mg-b-20">
          数据角色
          <span style="color: red; font-size: 14px; margin-left: 10px">{{ roleDataError }}</span>
        </h3>
        <font color="orange">
          <el-tag
            :key="tag.roleDataId"
            v-for="tag in userRoleDataList"
            closable
            :disable-transitions="false"
            @close="handleCloseRoleDataTag(tag)"
            >{{ tag.name }}</el-tag
          >
        </font>
        <el-form ref="roleDataForm" :model="roleDataForm">
          <el-form-item
            :label="'数据权限' + (i + 1) + ':'"
            v-for="(v, i) in roleDataForm.roleData"
            :key="v.key"
            :prop="'roleData.' + i + '.value'"
            :rules="[{ required: true, message: '请选择数据角色', trigger: 'change' }]"
          >
            <el-select
              size="small"
              style="width: 280px"
              v-model="v.value"
              placeholder="请选择数据角色, 即数据模板"
              @change="changeRoleDataSelect()"
              filterable
            >
              <el-option
                v-for="item in allRoleDataList"
                :key="item.roleDataId"
                :label="item.name"
                :value="item.roleDataId"
              ></el-option>
              <!-- <el-option label="区域一" value="一"></el-option>
              <el-option label="区域二" value="二"></el-option>-->
            </el-select>
            <el-button type="text" @click.prevent="removeRoleDataItem(v)" style="margin: 0 1rem">&times;</el-button>
          </el-form-item>

          <el-button @click="appendRoleDataItem" style="width: 100%; margin-top: 20px">添加</el-button>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="relateRoleDataModal = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitRoleDataFrom('roleDataForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 查看所有功能权限 -->
    <div>
      <el-dialog :title="selectDisplayName + '所有的功能权限'" :visible.sync="roleModal" width="400px" center>
        <h3>{{ selectDisplayName }}所使用到的功能角色（功能模板）有：</h3>
        <font style="margin-left: 10px" color="orange">{{ roleNames }}</font>
        <el-tree
          highlight-current
          :props="roleTreeDataProps"
          :data="roleTreeData"
          node-key="id"
          show-checkbox
          :default-checked-keys="checkedRole"
          :default-expanded-keys="expandedRole"
        ></el-tree>
      </el-dialog>
    </div>

    <!-- 查看所有品类权限 -->
    <div>
      <el-dialog
        :title="selectDisplayName + '所有的品类权限'"
        :visible.sync="skuCategoryModal"
        @open="skuCategoryDialogOpen"
        center
      >
        <el-tree
          highlight-current
          :props="skuCategoryTreeDataProps"
          :data="skuCategoryTreeData"
          node-key="id"
          show-checkbox
          ref="catagoryTree"
        ></el-tree>
      </el-dialog>
    </div>

    <!-- 查看所有品牌权限 -->
    <div>
      <el-dialog
        :title="selectDisplayName + '所有的品牌权限'"
        :visible.sync="brandModal"
        @open="brandDialogOpen"
        center
      >
        <el-checkbox-group v-model="brandAllList">
          <div v-for="item in brandSelect" :key="item.brandId" style="padding: 2px">
            <el-checkbox :label="item.brandId" disabled>{{ item.brandName }}</el-checkbox>
          </div>
        </el-checkbox-group>
      </el-dialog>
    </div>

    <!-- 查看所有仓库权限 -->
    <div>
      <el-dialog
        :title="selectDisplayName + '所有的仓库权限'"
        :visible.sync="warehouseModal"
        @close="warehouseDialogClose"
        center
      >
        <avue-crud
          :option="warehouseOption"
          ref="warehouse"
          :page="warehousePage"
          :data="warehouseList"
          @current-change="warehouseCurrentChange"
        ></avue-crud>
      </el-dialog>
    </div>

    <!-- 查看所有店铺权限 -->
    <div>
      <el-dialog
        :title="selectDisplayName + '所有的店铺权限'"
        :visible.sync="storeModal"
        @close="storeDialogClose"
        center
      >
        <avue-crud
          :option="storeOption"
          ref="store"
          :page="storePage"
          :data="storeList"
          @current-change="storeCurrentChange"
        ></avue-crud>
      </el-dialog>
    </div>

    <!--新增/编辑用户-->
    <el-dialog
      class="admin-dialog-box"
      title="新建员工/修改员工基本信息"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="addOrUpdateDialogVisible"
      @close="addOrUpdateDialogClose"
    >
      <el-form ref="addOrUpdateForm" :model="userInfo" :rules="addOrUpdateFormRules" status-icon>
        <!-- <el-form-item
          label="基本信息"
          label-position="left"
          class="greyColor"
          style="margin-top:-20px"
        ></el-form-item> -->
        <el-form-item label="姓名" prop="displayname">
          <el-input
            size="small"
            v-model.trim="userInfo.displayname"
            placeholder="请输入姓名，不得超过30个字符"
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="genders">
          <!-- <el-radio-group v-model="userInfo.genders" label-position="left" class="centerText">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group> -->
          <el-select size="small" v-model="userInfo.genders" placeholder="请选择">
            <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input
            size="small"
            v-model.trim="userInfo.username"
            placeholder="请输入账号，不得超过50个字符，建议用邮箱"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="isCreate">
          <el-input
            size="small"
            type="password"
            v-model="userInfo.password"
            placeholder="由数字与字母组成8~16位的字符"
            maxlength="16"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="doublePassword" v-if="isCreate">
          <el-input
            size="small"
            type="password"
            v-model="userInfo.doublePassword"
            placeholder="请重复输入密码"
            maxlength="16"
          ></el-input>
        </el-form-item>
        <el-form-item label="　手机号码" prop="phone">
          <el-input size="small" v-model.trim="userInfo.phone" placeholder="请输入11位阿拉伯数字，非必填"></el-input>
        </el-form-item>
        <el-form-item style="background-color: #eff6ff; padding: 0 10px">
          <span>
            <i class="el-icon-info avue-tip__icon">&nbsp;</i>
            <span>所在组织(职务决定数据权限关系)</span>
          </span>
        </el-form-item>
        <template>
          <el-table v-show="!showAddButton" :data="userInfo.sysUserGroups" style="width: 100%">
            <!-- 所在组 -->
            <el-table-column prop="groupId" label="所在组">
              <template slot-scope="scope">
                <el-select v-model="scope.row.groupId" filterable placeholder="请选择所在组" size="small">
                  <el-option
                    v-for="item in groupList"
                    :key="item.groupId"
                    :label="item.name"
                    :value="item.groupId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <!-- 职务 -->
            <el-table-column prop="userPositionId" label="职务">
              <template slot-scope="scope">
                <el-select v-model="scope.row.userPositionId" filterable size="small" placeholder="请选择职务">
                  <el-option
                    v-for="item in userPositionList"
                    :key="item.userPositionId"
                    :label="item.name"
                    :value="item.userPositionId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="dataShare" width="150" label="权限">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.dataShare" label-position="left" class="centerText">
                  <el-radio :label="0">共享</el-radio>
                  <el-radio :label="1" style="margin-left: 10px">私有</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column width="100" label="操作">
              <template slot-scope="scope">
                <i class="icon-shanchu y-icon-delect" @click="deleteSingle(scope.$index)"></i>
                <i
                  v-show="scope.$index === userInfo.sysUserGroups.length - 1"
                  class="icon-xinzeng y-icon-delect"
                  @click="addSelect"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <!-- <el-row v-for="(k,v) in userInfo.sysUserGroups" :key="v">
          <el-col :span="8">
            <el-form-item
              :label="'所在组'+(v+1)"
              :prop="'sysUserGroups.'+v+'.groupId'"
              :rules="{ required: true, message: '所在组'+(v+1)+'不能为空', trigger: 'change' }"
            >
              <el-select v-model="k.groupId" placeholder="请搜索选择所在组" size="small" filterable >
                <el-option
                  v-for="item in groupList"
                  :key="item.groupId"
                  :label="item.name"
                  :value="item.groupId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="'职务'+(v+1)"
              :prop="'sysUserGroups.'+v+'.userPositionId'"
              :rules="{ required: true, message: '职务'+(v+1)+'不能为空', trigger: 'change' }"
            >
              <el-select v-model="k.userPositionId" size="small" placeholder="请选择职务" filterable >
                <el-option
                  v-for="item in userPositionList"
                  :key="item.userPositionId"
                  :label="item.name"
                  :value="item.userPositionId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              :prop="'sysUserGroups.'+v+'.dataShare'"
              class="dataShareClass"
              :rules="{ required: true, message: '共享关系'+(v+1)+'不能为空', trigger: 'change' } "
            >
              <el-radio-group v-model="k.dataShare" label-position="left" class="centerText">
                <el-radio :label="0">共享</el-radio>
                <el-radio :label="1" style="margin-left:10px;">私有</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="line-height:3;">
            <i class="el-icon-error" @click="deleteSingle(v)"></i>
          </el-col>
        </el-row> -->
        <el-row v-if="showAddButton">
          <el-col :span="24">
            <el-button style="width: 100%" @click="addSelect">添加</el-button>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addOrUpdateDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addOrUpdateSubmit('addOrUpdateForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="roleDataTitle" center :visible.sync="roleDataDialogVisible" width="400px">
      <span>{{ roleDataContent }}</span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  getObj,
  putObj,
  editFlagLock,
  getPassCode,
  getFunctionRole,
  assignRole2User,
  assignRoleData2User,
  passwordInit,
  getSkuCatagorysByUserId,
  getWarehousesByUserId,
  getStoresByUserId,
  getBrandsByUserId,
  passwordInitV2Api
} from "@/api/admin/user"
import {
  deptRoleList,
  getRoleListById,
  getAll as getAllRole,
  getRoleDataListById,
  getAllRoleData
} from "@/api/admin/role"
import router from "@/router/router"
import { fetchDeptTree } from "@/api/admin/dept"
import { sysUserPositionList } from "@/api/admin/sysuserposition"
import { groupList } from "@/api/admin/group"
import { tableOption, warehouseOption, storeOption } from "@/const/crud/adminUser/adminPloyee"
import { mapGetters } from "vuex"
import { constants } from "fs"
import { connect } from "tls"
import {
  getTreeData,
  searchNodeData,
  insertNodeData,
  updateNodeData,
  deleteNodeData
} from "@/api/adminUser/adminOrganize"
import adminDialog from "./dialog.vue"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { recordLog } from "@/api/login"
import { getStore } from "@/util/store"

export default {
  name: "table_user",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"))
        // } else if (!/^[A-Za-z0-9]{8,16}$/.test(value)) {
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(value)) {
        callback(new Error("密码必须由大写字母和小写字母和数字组成"))
      } else {
        if (this.userInfo.doublePassword !== "") {
          this.$refs.addOrUpdateForm.validateField("doublePassword")
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"))
      } else if (value !== this.userInfo.password) {
        callback(new Error("两次输入密码不一致!"))
      } else {
        callback()
      }
    }

    var validatePhone = (rule, value, callback) => {
      if (!value || value.replace(/(^\s*)|(\s*$)/g, "") === "") {
        callback()
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, "")
        if (!/^\d{11}$/.test(value)) {
          callback(new Error("手机号码有误，请重填"))
        } else {
          callback()
        }
      }
    }

    return {
      showAddButton: false,
      genders: [
        {
          value: 0,
          label: "男"
        },
        {
          value: 1,
          label: "女"
        }
      ],
      cleanSelect: false,
      isShowDialog: false,
      viewMoreDialogData: [],
      treeOption: {
        nodeKey: "id",
        addBtn: false,
        menu: false,
        props: {
          label: "name",
          value: "id"
        }
      },
      option: tableOption,
      treeDeptData: [],
      checkedKeys: [],
      roleProps: {
        label: "roleName",
        value: "roleId"
      },
      defaultProps: {
        label: "name",
        value: "id"
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false //是否倒序
      },
      list: [],

      role: [],
      form: {},
      rolesOptions: [],

      formInline: {
        username: "",
        displayname: "",
        lockFlag: ""
      },

      searchParam: {
        username: "",
        displayname: "",
        lockFlag: "",
        deptId: ""
      },

      selectList: [],
      addOrUpdateDialogVisible: false,
      userPositionList: [],
      groupList: [],
      userInfo: {},
      addOrUpdateFormRules: {
        displayname: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 30, message: "姓名不得超过30个字符", trigger: "blur" }
        ],
        genders: [{ required: true, message: "请输入性别", trigger: "change" }],
        username: [
          { required: true, message: "请输入用户账号", trigger: "blur" },
          { max: 50, message: "用户账号不得超过50个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 8, max: 16, message: "密码长度为8-16位", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        doublePassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ],
        phone: [{ validator: validatePhone, trigger: "blur" }]
      },
      isCreate: true,
      selectUserId: "",
      selectDisplayName: "",
      roleModal: false,
      roleTreeDataProps: {
        label: "name",
        children: "children"
      },
      roleTreeData: [],
      checkedRole: [],
      expandedRole: [],
      roleNames: "",

      //功能角色
      relateModal: false,
      roleFunctionForm: {
        roleFunction: []
      },
      userRoleList: [],
      allRoleList: [],
      updateRoleParam: {
        id: "",
        roleIds: ""
      },
      roleFunctionError: "",

      //数据角色
      relateRoleDataModal: false,
      roleDataForm: {
        roleData: []
      },
      userRoleDataList: [],
      allRoleDataList: [],
      updateRoleDataParam: {
        id: "",
        roleDataIds: ""
      },
      roleDataError: "",
      skuCategoryTreeData: [],
      skuCategoryTreeDataProps: {
        label: "name",
        children: "children"
      },
      skuCategoryModal: false,
      skuCategorySelect: [],
      warehousePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      warehouseOption: warehouseOption,
      warehouseList: [],
      warehouseModal: false,

      storePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      storeOption: storeOption,
      storeList: [],
      storeModal: false,

      //组织架构
      deptTreeData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roleDataTitle: "",
      roleDataDialogVisible: false,
      roleDataContent: "",
      brandModal: false,
      brandSelect: [],
      brandAllList: []
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    adminDialog: adminDialog
  },
  watch: {
    role() {
      this.form.role = this.role
    }
  },
  created() {
    this.init()
  },
  methods: {
    storeDialogClose() {
      this.$refs.store.defaultPage.currentPage = 1
      this.storeList = []
      this.storePage.total = 0
    },
    showbaseStore(userId, displayname) {
      this.selectDisplayName = displayname
      this.selectUserId = userId
      this.storeModal = true
      this.storeCurrentChange(this.storePage.currentPage)
    },
    storeCurrentChange(currentPage) {
      var userId = {
        userId: this.selectUserId
      }

      getStoresByUserId(
        Object.assign(
          {
            current: currentPage,
            size: this.storePage.pageSize
          },
          userId
        )
      )
        .then(({ data }) => {
          if (data.code == 0) {
            this.storeList = data.data.records
            this.storePage.total = data.data.total
          } else {
            this.$message({ type: "error", message: "查询用户店铺权限失败" })
          }
        })
        .finally(() => {})
    },
    warehouseDialogClose() {
      this.$refs.warehouse.defaultPage.currentPage = 1
      this.warehouseList = []
      this.warehousePage.total = 0
    },
    showWarehouse(userId, displayname) {
      this.selectDisplayName = displayname
      this.selectUserId = userId
      this.warehouseModal = true
      this.warehouseCurrentChange(this.warehousePage.currentPage)
    },
    warehouseCurrentChange(currentPage) {
      var userId = {
        userId: this.selectUserId
      }

      getWarehousesByUserId(
        Object.assign(
          {
            current: currentPage,
            size: this.warehousePage.pageSize
          },
          userId
        )
      )
        .then(({ data }) => {
          if (data.code == 0) {
            this.warehouseList = data.data.records
            this.warehousePage.total = data.data.total
          } else {
            this.$message({ type: "error", message: "查询用户仓库权限失败" })
          }
        })
        .finally(() => {})
    },
    skuCategoryDialogOpen() {
      this.$nextTick(() => {
        this.$refs.catagoryTree.setCheckedKeys(this.skuCategorySelect)
      })
    },
    showSkuCategory(userId, displayname) {
      getSkuCatagorysByUserId(userId).then(({ data }) => {
        if (data.code == 0) {
          this.selectDisplayName = displayname
          this.skuCategorySelect = data.data
          this.skuCategoryModal = true
        } else {
          this.$message({ type: "error", message: "查询用户品类权限失败" })
        }
      })
    },
    showBrand(userId, displayname) {
      getBrandsByUserId(userId)
        .then(({ data }) => {
          if (data.code == 0) {
            this.selectDisplayName = displayname
            this.brandSelect = data.data.records
            this.brandAllList = data.data.records.map((item) => item.brandId)
            this.brandModal = true
          } else {
            this.$message({ type: "error", message: "查询用户品牌权限失败" })
          }
        })
        .finally(() => {})
    },
    showSkuCategorys(row) {
      this.roleDataTitle = "品类权限"
      this.roleDataContent = row.categoryNames
      this.roleDataDialogVisible = true
    },
    showBseStores(row) {
      this.roleDataTitle = "店铺权限"
      this.roleDataContent = row.baseStoreNames
      this.roleDataDialogVisible = true
    },
    showBseWarehouses(row) {
      this.roleDataTitle = "仓库权限"
      this.roleDataContent = row.warehouses
      this.roleDataDialogVisible = true
    },
    sizeChange(size) {
      this.$refs.crud.selectClear()
      this.page.pageSize = size
    },
    adminDialogFnc(bool) {
      this.isShowDialog = bool
    },

    viewMore(data) {
      this.viewMoreDialogData = data
      this.isShowDialog = true
    },
    relateModalClose: function () {
      this.$refs["roleFunctionForm"].resetFields()
    },
    relateRoleDataModalClose() {
      this.$refs["roleDataForm"].resetFields()
    },
    addOrUpdateDialogClose() {
      this.$refs["addOrUpdateForm"].resetFields()
    },
    init() {
      // var _this = this;
      // document.onkeydown = function(e) {
      //   var key = window.event.keyCode;
      //   if (key == 13) {
      //     _this.handleFilter();
      //   }
      // }
      // 加载店铺树
      fetchTreeList().then(({ data }) => {
        if (data.code === 0) {
          this.skuCategoryTreeData = data.data
        } else {
          this.$notify({ type: "error", message: "查询品类信息失败" })
        }
      })
      groupList().then((response) => {
        this.groupList = response.data.data
      })
      sysUserPositionList().then((response) => {
        this.userPositionList = response.data.data
      })
      // fetchDeptTree().then(response => {
      //   this.treeData = response.data.data;
      // });
      getTreeData().then(({ data }) => {
        this.deptTreeData = data.data
      })
    },

    // 获取节点数据
    searchDeptNodeData(param) {
      //alert(param.id);
      this.$refs.crud.selectClear()
      this.$refs.crud.defaultPage.currentPage = 1
      this.searchParam.deptId = param.id
      this.getList(this.page)
    },

    getList(page, params) {
      if (this.$refs.crud) {
        this.page.currentPage = this.$refs.crud.defaultPage.currentPage
      }

      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchParam
        )
      ).then((response) => {
        this.list = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    getNodeData(data) {
      deptRoleList().then((response) => {
        this.rolesOptions = response.data.data
      })
    },
    handleDept() {
      fetchDeptTree().then((response) => {
        this.treeDeptData = response.data.data
      })
    },
    handleFilter(param) {
      this.$refs.crud.defaultPage.currentPage = 1
      this.copySearchParam()
      this.submitForm(param)
    },
    copySearchParam() {
      var username = this.formInline.username
      var displayname = this.formInline.displayname
      if (username) {
        this.formInline.username = username.trim().replace(/\s+/g, ",").replace(/,{2,}/g, ",")
      }
      if (displayname) {
        this.formInline.displayname = displayname.trim().replace(/\s+/g, ",").replace(/,{2,}/g, ",")
      }
      this.searchParam.username = this.formInline.username
      this.searchParam.displayname = this.formInline.displayname
      this.searchParam.lockFlag = this.formInline.lockFlag
    },
    // 搜索
    submitForm(param) {
      this.$refs.crud.selectClear()
      this.getList(this.page, param)
    },
    // 清空搜索
    searchReset(param) {
      this.formInline.username = ""
      this.formInline.displayname = ""
      this.formInline.lockFlag = ""
    },
    handleRefreshChange() {
      this.getList(this.page)
    },
    handleCreate() {
      this.$refs.crud.rowAdd()
    },

    handleOpenBefore(show, type) {
      window.boxType = type
      this.handleDept()
      if (["edit", "views"].includes(type)) {
        this.role = []
        for (var i = 0; i < this.form.roleList.length; i++) {
          this.role[i] = this.form.roleList[i].roleId
        }
        deptRoleList().then((response) => {
          this.rolesOptions = response.data.data
        })
      } else if (type === "add") {
        this.role = []
      }
      show()
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
      this.form.password = undefined
    },
    create(row, done, loading) {
      addObj(this.form)
        .then(() => {
          this.getList(this.page)
          done()
          this.$notify({
            title: "成功",
            message: "创建成功",
            type: "success",
            duration: 2000
          })
        })
        .catch(() => {
          loading()
        })
    },
    update(row, index, done, loading) {
      putObj(this.form)
        .then(() => {
          this.getList(this.page)
          done()
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          })
        })
        .catch(() => {
          loading()
        })
    },
    deletes(row, index) {
      this.$confirm("此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delObj(row.userId)
            .then(() => {
              this.list.splice(index, 1)
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              })
            })
            .cache(() => {
              this.$notify({
                title: "失败",
                message: "删除失败",
                type: "error",
                duration: 2000
              })
            })
        })
        .catch((res) => {})
    },
    handleLogin(row, index) {
      this.$confirm("确定要代登录该用户(用户名:" + row.username + "), 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            //代登录
            this.$store
              .dispatch("LoginByUsername", {
                username: row.username,
                password: "FJjxYiXdEsAGnWp/8fsOetMuOON96Ntk/Ym2M/RKRyU0GZsea",
                code: "1111",
                redomStr: ""
              })
              .then(() => {
                window.location.href = window.location.origin
              })
          })
        })
        .catch((res) => {})
    },

    //登录
    handleLoginPloyee() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return
      }
      var username = this.selectList[0].username
      var lockFlag = this.selectList[0].lockFlag

      if (lockFlag != "启用中") {
        this.$message.error("非启用中的账号不允许登录")
        return
      }

      this.$confirm("确定要代登录该用户(用户名:" + username + "), 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //后台获取密码和验证码
          getPassCode().then((response) => {
            this.$store.dispatch("LogOut").then(() => {
              //代登录
              this.$store
                .dispatch("LoginByUsername", {
                  username: username,
                  password: response.data.data,
                  code: response.data.data,
                  randomStr: response.data.data
                })
                .then(() => {
                  recordLog({ type: 2 })
                    .then(({ data }) => {})
                    .catch(() => {})
                  window.location.href = window.location.origin
                })
                .catch((error) => {
                  router.push({
                    path: "/login"
                  })
                })
            })
          })
        })
        .catch((res) => {})
    },

    handleRelevantFunctionRole() {},

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },

    // 新建员工
    handleCreatePloyee() {
      //this.$set(this.userInfo,"displayname",'');
      this.userInfo = {
        displayname: "",
        genders: "",
        username: "",
        password: "",
        doublePassword: "",
        phone: "",
        sysUserGroups: [
          {
            groupId: "",
            userPositionId: "",
            dataShare: ""
          }
        ]
      }
      this.isCreate = true
      this.addOrUpdateDialogVisible = true
      this.showAddButton = false
      //this.$refs.crud.rowAdd();
    },

    //编辑用户
    handleUpdatePloyee() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return
      }
      var data = this.selectList[0]
      var gender = ""
      if (data.genders == "男") {
        gender = 0
      } else if (data.genders == "女") {
        gender = 1
      }
      console.info(data.sysUserGroups)
      var sysUserGroups = []
      if (data.sysUserGroups) {
        for (var i = 0; i < data.sysUserGroups.length; i++) {
          var element = data.sysUserGroups[i]
          var sysUserGroup = {
            groupId: element.groupId,
            userPositionId: element.userPositionId,
            dataShare: element.dataShare
          }
          sysUserGroups.push(sysUserGroup)
        }
      }
      console.info(sysUserGroups)
      this.userInfo = {
        userId: data.userId,
        displayname: data.displayname,
        genders: gender,
        username: data.username,
        phone: data.phone,
        sysUserGroups: sysUserGroups
      }
      this.isCreate = false
      this.addOrUpdateDialogVisible = true
      if (this.userInfo.sysUserGroups.length === 0) {
        this.showAddButton = true
      } else {
        this.showAddButton = false
      }
    },

    //增加一条小组，职位和共享关系
    addSelect() {
      var item = { groupId: "", userPositionId: "", dataShare: "" }
      this.userInfo.sysUserGroups.push(item)
      this.showAddButton = false
    },

    //删除一条小组，职位和共享关系
    deleteSingle(index) {
      this.userInfo.sysUserGroups.splice(index, 1)
      if (this.userInfo.sysUserGroups.length === 0) {
        this.showAddButton = true
      }
    },

    //提交新增或者更新表单
    addOrUpdateSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { sysUserGroups } = this.userInfo
          let groupIds = []
          if (sysUserGroups.length > 0) {
            for (var i = 0; i < sysUserGroups.length; i++) {
              if (!sysUserGroups[i].groupId) {
                this.$message.error("存在小组为空的数据，请检查")
                return
              }
              if (!sysUserGroups[i].userPositionId) {
                this.$message.error("存在职务为空的数据，请检查")
                return
              }
              // if(sysUserGroups[i].dataShare!=0 && sysUserGroups[i].dataShare!=1){
              if (sysUserGroups[i].dataShare === "" || sysUserGroups[i].dataShare === null) {
                this.$message.error("存在权限为空的数据，请检查")
                return
              }

              groupIds.push(sysUserGroups[i].groupId)
            }
            if (new Set(groupIds).size != groupIds.length) {
              this.$message.error("存在相同的小组，请检查")
              return
            }
          } else {
            this.$message.error("至少有一条组织关系")
            return
          }
          if (this.isCreate) {
            addObj(this.userInfo)
              .then((response) => {
                if (response.data.code == 0) {
                  this.$refs.crud.selectClear()
                  this.addOrUpdateDialogVisible = false
                  this.getList(this.page)
                  this.$notify({
                    title: "成功",
                    message: "新增成功",
                    type: "success",
                    duration: 2000
                  })
                } else if (response.data.code == 1) {
                  this.$message.error(response.data.msg)
                  return
                } else {
                  this.$message.error("新增失败")
                  return
                }
              })
              .finally(() => {})
          } else {
            putObj(this.userInfo)
              .then((response) => {
                if (response.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success",
                    duration: 2000
                  })
                  const userInfo = getStore({ name: "user_info", type: "session" })
                  const { userId, username } = userInfo
                  // 如果当前登录的用户和修改的用户是同一个的话,并且修改了账号就退出登录重新登录
                  if (userId === this.selectList[0].userId && username !== this.userInfo.username) {
                    this.$store.dispatch("LogOut").then(() => {
                      this.$router.push({ path: "/login" })
                    })
                  } else {
                    this.addOrUpdateDialogVisible = false
                    this.$refs.crud.selectClear()
                    this.getList(this.page)
                  }
                } else if (response.data.code == 1) {
                  this.$message.error(response.data.msg)
                  return
                } else {
                  this.$message.error("修改失败")
                  return
                }
              })
              .finally(() => {})
          }
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },

    selectionChange(list) {
      this.selectList = list
    },

    //启用
    handleEnable() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
      } else {
        var selectIds = []
        for (var i = 0; i < this.selectList.length; i++) {
          var lockFlag = this.selectList[i].lockFlag
          if (lockFlag != "禁用中") {
            this.$message.error("勾选的数据存在着非禁用中的状态")
            return
          }
          selectIds.push(this.selectList[i].userId)
        }
        var userIds = selectIds.join(",")
        var lockFlag = "0"
        var param = {
          userIds: userIds,
          lockFlag: lockFlag
        }

        editFlagLock(param)
          .then((response) => {
            if (response.data.code === 0) {
              this.$refs.crud.selectClear()
              this.getList(this.page)
              this.$notify({
                title: "成功",
                message: "启用成功",
                type: "success",
                duration: 2000
              })
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("启用失败")
              return
            }
          })
          .finally(() => {})
      }
    },

    //禁用
    handleDisable() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else {
        var selectIds = []
        for (var i = 0; i < this.selectList.length; i++) {
          var lockFlag = this.selectList[i].lockFlag
          if (lockFlag != "启用中") {
            this.$message.error("勾选的数据存在着非启用中的状态")
            return
          }
          selectIds.push(this.selectList[i].userId)
        }
        var userIds = selectIds.join(",")
        var lockFlag = "1"
        var param = {
          userIds: userIds,
          lockFlag: lockFlag
        }

        editFlagLock(param)
          .then((response) => {
            if (response.data.code == 0) {
              this.$refs.crud.selectClear()
              this.getList(this.page)
              this.$notify({
                title: "成功",
                message: "禁用成功",
                type: "success",
                duration: 2000
              })
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("禁用失败")
              return
            }
          })
          .finally(() => {})
      }
    },

    //显示用户所有功能角色
    showRoleFunction(userId, displayname) {
      getFunctionRole(userId).then((response) => {
        if (response.data.code == 0) {
          this.checkedRole = response.data.data.menuIds
          this.expandedRole = response.data.data.menuIds
          this.roleTreeData = response.data.data.menuTreeList
          //console.error(this.checkedRole);
          if (this.checkedRole && this.checkedRole.length > 0) {
            this.checkedRole = this.resolveAllEunuchNodeId(this.roleTreeData, this.checkedRole, [])
          }
          //console.error(this.checkedRole);

          var functionRoleNames = response.data.data.functionRoleNames
          if (functionRoleNames) {
            this.roleNames = functionRoleNames.join("、")
          } else {
            this.roleNames = "暂未分配任何功能角色"
          }
          if (displayname) {
            this.selectDisplayName = displayname
          } else {
            this.selectDisplayName = ""
          }
          this.roleModal = true
        } else {
          this.$message.error("查询用户功能权限失败")
          return
        }
      })
    },

    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          var arr = idArr.filter((id) => id === item.id)
          if (arr && arr.length > 0) {
            temp.push(arr.join(","))
          }
        }
      }
      return temp
    },

    //关联功能角色
    handleRelevantRole() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return
      }

      var userId = this.selectList[0].userId
      ;(this.roleFunctionForm = {
        roleFunction: []
      }),
        getRoleListById(userId)
          .then((response) => {
            if (response.data.code == 0) {
              this.userRoleList = response.data.data
              if (!this.userRoleList || this.userRoleList.length == 0) {
                this.userRoleList = []
              }
              getAllRole()
                .then((response) => {
                  if (response.data.code == 0) {
                    this.allRoleList = response.data.data
                    if (!this.allRoleList || this.allRoleList.length == 0) {
                      this.allRoleList = []
                    }
                    this.changeRoleSelect()
                    this.relateModal = true
                  } else {
                    this.$message.error("查询用户功能权限失败")
                    return false
                  }
                })
                .catch((error) => {
                  this.$message.error("查询用户功能权限失败")
                  return false
                })
            } else {
              this.$message.error("查询用户功能权限失败")
              return false
            }
          })
          .catch(() => {
            this.$message.error("查询用户功能权限失败")
            return false
          })
    },

    // 添加一条
    appendItem() {
      this.roleFunctionForm.roleFunction.push({ value: "", key: Date.now() })
    },

    // 删除一条
    removeItem(item) {
      var index = this.roleFunctionForm.roleFunction.indexOf(item)
      if (index !== -1) this.roleFunctionForm.roleFunction.splice(index, 1)
      this.changeRoleSelect()
    },

    //关闭Tag
    handleCloseTag(tag) {
      this.userRoleList.splice(this.userRoleList.indexOf(tag), 1)
      this.changeRoleSelect()
    },

    //确认关联功能角色
    submitRoleFunctionFrom(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.selectList || this.selectList.length == 0) {
            this.$message.error("请勾选数据")
            return false
          } else if (this.selectList.length != 1) {
            this.$message.error("只能勾选一条数据")
            return false
          }
          this.updateRoleParam.id = this.selectList[0].userId
          var roleSelect = this.changeRoleSelect()
          if (!roleSelect) {
            return false
          }
          if (roleSelect && roleSelect.length > 0) {
            this.updateRoleParam.roleIds = roleSelect.join(",")
          } else {
            this.updateRoleParam.roleIds = ""
          }

          assignRole2User(this.updateRoleParam)
            .then((response) => {
              if (response.data.code == 0) {
                this.relateModal = false
                this.$refs.crud.selectClear()
                this.$notify({
                  title: "成功",
                  message: "关联功能权限成功",
                  type: "success",
                  duration: 2000
                })
              } else if (response.data.code == 1) {
                this.$message.error(response.data.msg)
                return
              } else {
                this.$message.error("关联功能权限失败")
                return
              }
            })
            .finally(() => {})
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },

    //改变功能角色
    changeRoleSelect() {
      var userIdArray = []
      for (var i = 0; i < this.userRoleList.length; i++) {
        userIdArray.push(this.userRoleList[i].roleId)
      }
      for (var j = 0; j < this.roleFunctionForm.roleFunction.length; j++) {
        if (this.roleFunctionForm.roleFunction[j].value && this.roleFunctionForm.roleFunction[j].value != "") {
          userIdArray.push(this.roleFunctionForm.roleFunction[j].value)
        }
      }
      if (new Set(userIdArray).size != userIdArray.length) {
        this.roleFunctionError = "存在相同的功能角色，请检查"
        return false
      } else {
        this.roleFunctionError = ""
      }
      return userIdArray
    },

    //关联数据角色
    handleRelevantDataRole() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return
      }

      var userId = this.selectList[0].userId
      ;(this.roleDataForm = {
        roleData: []
      }),
        getRoleDataListById(userId)
          .then((response) => {
            if (response.data.code == 0) {
              this.userRoleDataList = response.data.data
              if (!this.userRoleDataList || this.userRoleDataList.length == 0) {
                this.userRoleDataList = []
              }
              getAllRoleData()
                .then((response) => {
                  if (response.data.code == 0) {
                    this.allRoleDataList = response.data.data
                    if (!this.allRoleDataList || this.allRoleDataList.length == 0) {
                      this.allRoleDataList = []
                    }
                    this.changeRoleDataSelect()
                    this.relateRoleDataModal = true
                  } else {
                    this.$message.error("查询数据权限列表失败")
                    return
                  }
                })
                .catch(() => {
                  this.$message.error("查询数据权限列表失败")
                  return
                })
            } else {
              this.$message.error("查询用户数据权限失败")
              return
            }
          })
          .catch(() => {
            this.$message.error("查询用户数据权限失败")
            return
          })
    },

    // 添加一条
    appendRoleDataItem() {
      this.roleDataForm.roleData.push({ value: "", key: Date.now() })
    },

    // 删除一条
    removeRoleDataItem(item) {
      var index = this.roleDataForm.roleData.indexOf(item)
      if (index !== -1) this.roleDataForm.roleData.splice(index, 1)
      this.changeRoleDataSelect()
    },

    //关闭Tag
    handleCloseRoleDataTag(tag) {
      this.userRoleDataList.splice(this.userRoleDataList.indexOf(tag), 1)
      this.changeRoleDataSelect()
    },

    //确认关联数据角色
    submitRoleDataFrom(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.selectList || this.selectList.length == 0) {
            this.$message.error("请勾选数据")
            return false
          } else if (this.selectList.length != 1) {
            this.$message.error("只能勾选一条数据")
            return false
          }
          this.updateRoleDataParam.id = this.selectList[0].userId
          var roleDataSelect = this.changeRoleDataSelect()
          if (!roleDataSelect) {
            return false
          }
          if (roleDataSelect && roleDataSelect.length > 0) {
            this.updateRoleDataParam.roleDataIds = roleDataSelect.join(",")
          } else {
            this.updateRoleDataParam.roleDataIds = ""
          }

          assignRoleData2User(this.updateRoleDataParam)
            .then((response) => {
              if (response.data.code == 0) {
                this.relateRoleDataModal = false
                this.$refs.crud.selectClear()
                this.$notify({
                  title: "成功",
                  message: "关联数据权限成功",
                  type: "success",
                  duration: 2000
                })
                this.getList(this.page)
              } else if (response.data.code == 1) {
                this.$message.error(response.data.msg)
                return
              } else {
                this.$message.error("关联数据权限失败")
                return
              }
            })
            .finally(() => {})
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },

    //改变数据角色
    changeRoleDataSelect() {
      var userIdArray = []
      for (var i = 0; i < this.userRoleDataList.length; i++) {
        userIdArray.push(this.userRoleDataList[i].roleDataId)
      }
      for (var j = 0; j < this.roleDataForm.roleData.length; j++) {
        if (this.roleDataForm.roleData[j].value && this.roleDataForm.roleData[j].value != "") {
          userIdArray.push(this.roleDataForm.roleData[j].value)
        }
      }
      if (new Set(userIdArray).size != userIdArray.length) {
        this.roleDataError = "存在相同的数据角色，请检查"
        return false
      } else {
        this.roleDataError = ""
      }
      return userIdArray
    },

    //密码初始化
    passwordInit() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return false
      } else if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return false
      }
      var userId = this.selectList[0].userId
      var displayname = this.selectList[0].displayname
      console.log("this.selectList", this.selectList)
      this.$confirm("确定要初始化" + displayname + "的密码吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data, msg } = await passwordInitV2Api({ userId: userId })
          if (data.code == 0) {
            this.relateRoleDataModal = false
            this.$refs.crud.selectClear()
            this.$notify({
              title: "成功",
              message: "密码初始化成功",
              type: "success",
              duration: 2000
            })
          } else if (data.code == 1) {
            this.$message.error(msg || data.msg)
            return
          } else {
            this.$message.error("密码初始化失败")
            return
          }
          // passwordInitV2Api,
          //   {
          //     userId: userId
          //     // password: "123456"
          //   }
          //     .then((response) => {
          //       console.log("response", response)
          //       if (response.data.code == 0) {
          //         this.relateRoleDataModal = false
          //         this.$refs.crud.selectClear()
          //         this.$notify({
          //           title: "成功",
          //           message: "密码初始化成功",
          //           type: "success",
          //           duration: 2000
          //         })
          //       } else if (response.data.code == 1) {
          //         this.$message.error(response.data.msg)
          //         return
          //       } else {
          //         this.$message.error("密码初始化失败")
          //         return
          //       }
          //     })
          //     .catch((e) => {
          //       console.log("e", e)
          //     })
          //     .finally(() => {})
        })
        .catch((res) => {})
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
