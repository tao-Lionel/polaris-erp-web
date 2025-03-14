<!--
  -    Copyright (c) 2018-2025, Aukey All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the trob4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: wangbin (AukeyIT@aukeys.com)
  -->

<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.bsestoresitmanage_add"
            >新 增</el-button
          >
          <el-button type="primary" @click="handleEdit" size="small" v-if="permissions.bsestoresitmanage_edit"
            >修 改</el-button
          >
          <el-button type="primary" v-if="permissions.bsestoresitmanage_enable" @click="handleEnable(0)" size="small"
            >启 用</el-button
          >
          <el-button type="primary" v-if="permissions.bsestoresitmanage_prohibit" @click="handleEnable(1)" size="small"
            >禁 用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.bsestoresitmanage_authorization"
            @click="authorization"
            size="small"
            >授 权</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="storeAccount" label="店铺名称">
              <el-input v-model="searchForm.storeAccount" size="small" placeholder="请输入店铺名称"></el-input>
            </el-form-item>

            <el-form-item prop="state" label="启用/禁用:">
              <el-select v-model="searchForm.state" size="small" filterable placeholder="请选择">
                <el-option v-for="item in stateFlagOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item label="平台" prop="platformTypeCode">
              <el-select v-model="searchForm.platformTypeCode" size="small" filterable multiple placeholder="请选择">
                <el-option
                  v-for="item in plaTypeOption"
                  :key="item.platformTypeId"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="operationLog">
          <i class="icon-chakan y-reviews" @click="showOperateLog(scope.row.storeSitManageId)"></i>
        </template>
      </avue-crud>

      <!--新增/编辑-->
      <div>
        <el-dialog
          :title="handleAddOrUpdateTile"
          :visible.sync="addOrUpdateDialog"
          width="660px"
          @close="formReset"
          center
        >
          <el-form
            label-width="100px"
            ref="addOrUpdateForm"
            :model="addOrUpdateForm"
            :rules="addOrUpdateRules"
            size="small"
            status-icon
          >
            <el-form-item label="平台" prop="platformTypeId">
              <el-select
                v-model="addOrUpdateForm.platformTypeId"
                size="small"
                filterable
                placeholder="请选择"
                @change="changePlatform"
              >
                <el-option
                  v-for="item in plaTypeOption"
                  :key="item.platformTypeId"
                  :label="item.platformTypeName"
                  :value="item.platformTypeId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="店铺名称" prop="storeId">
              <el-select v-model="addOrUpdateForm.storeId" size="small" filterable placeholder="请选择">
                <el-option
                  v-for="item in baseStoreOptions"
                  :key="item.storeId"
                  :label="item.storeAccount"
                  :value="item.storeId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="站点" prop="bsePlatformSitId">
              <el-select v-model="addOrUpdateForm.bsePlatformSitId" size="small" filterable placeholder="请选择">
                <el-option
                  v-for="item in sitCountryOptions"
                  :key="item.bsePlatformSitId"
                  :label="item.countryCode"
                  :value="item.bsePlatformSitId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="销售组" prop="saleGroupId">
              <el-select v-model="addOrUpdateForm.saleGroupId" size="small" filterable placeholder="请选择">
                <el-option
                  v-for="item in requisitionGroupOptions"
                  :key="item.groupId"
                  :label="item.name"
                  :value="item.groupId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input v-model="addOrUpdateForm.remark" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="addOrUpdateDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitForm('addOrUpdateForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 授权-->
      <div>
        <el-dialog title="授权" :visible.sync="authDialog" width="660px" @close="authFormReset" center>
          <el-form label-width="100px" ref="authForm" :model="authForm" :rules="authRules" size="small" status-icon>
            <el-form-item label="店铺名称" prop="storeAccount">
              <el-input v-model="authForm.storeAccount" size="small" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="区域" prop="districtName">
              <el-input v-model="authForm.districtName" size="small" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="站点" prop="countryCodes">
              <el-tag v-for="item in authForm.countryCodes" :key="item">
                {{ item }}
              </el-tag>
            </el-form-item>

            <el-form-item label="Seller ID" prop="sellerId">
              <el-input v-model="authForm.sellerId" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>

            <el-form-item label="Token" prop="token">
              <el-input v-model="authForm.token" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>

            <el-form-item>
              <a
                href="http://oversee.eccang.com/default/platform-user/view-platform-authorize/platform/amazon/isPlatformIntegrate/false"
                target="_blank"
                >帮助中心</a
              >
              &nbsp;&nbsp;&nbsp;
              <el-button size="warning" @click="authValidate">验 证</el-button>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="authDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitAuthForm('authForm')" v-show="submitAuthFormShow"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  handleSaveOrUpdate,
  stateModify,
  saveAuthorization
} from "@/api//baseSetup/bsestoresitmanage/bsestoresitmanage"
import { getAll as getAllStore } from "@/api/baseSetup/bsestore"
import { getSitCountryDistrict } from "@/api/baseSetup/bseplatformsit"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { tableOption, addOrUpdateRules, authRules } from "@/const/crud/baseSetup/bsestoresitmanage/bsestoresitmanage"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { preventShake } from "@/util/tool"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "bsestoresitmanage",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        storeAccount: "",
        storeNameShort: "",
        state: "",
        platformTypeCode: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      //禁用下拉数据
      stateFlagOptions: [
        { value: "0", label: "启用" },
        { value: "1", label: "禁用" }
      ],
      plaTypeOption: [],
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],
      //新增 修改
      handleAddOrUpdateTile: "新增",
      addOrUpdateDialog: false,
      addOrUpdateForm: {
        platformTypeId: null,
        storeSitManageId: null,
        storeId: null,
        bsePlatformSitId: null,
        saleGroupId: null,
        remark: ""
      },
      addOrUpdateRules: addOrUpdateRules,
      baseStoreOptions: [],
      sitCountryOptions: [],
      requisitionGroupOptions: [],
      //授权相关
      submitAuthFormShow: false,
      authDialog: false,
      authRules: authRules,
      authForm: {
        storeAccount: "",
        districtName: "",
        countryCodes: [],
        sellerId: "",
        token: ""
      }
    }
  },
  created() {},
  mounted: function () {
    this.initInfo()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    operationlog
  },
  methods: {
    /** 刷新回调 */
    refreshChange() {
      this.getList(this.page)
    },
    /** 搜索回调 */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      page = page || { currentPage: 1 }
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    getList(page, params) {
      // this.page.currentPage=page.currentPage;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    initInfo() {
      //平台
      getPlaTypeAll().then((res) => {
        this.plaTypeOption = res.data.data
      })
      //销售组
      var params = {
        groupFunctionName: "销售类",
        authority: true
      }
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.requisitionGroupOptions = data
        }
      })
      //店铺
      // getAllStore().then(res =>{
      //   this.baseStoreOptions = res.data.data;
      // })
    },
    formReset() {
      this.$refs["addOrUpdateForm"].resetFields()
      this.addOrUpdateForm = {}
    },
    //选中平台
    changePlatform(val) {
      let param = {
        platformTypeId: val
      }
      getAllStore(param).then((res) => {
        this.baseStoreOptions = res.data.data
      })
    },
    //新增
    handleAdd() {
      this.baseStoreOptions = []
      this.addOrUpdateDialog = true
      this.handleAddOrUpdateTile = "新增"
    },
    //修改
    handleEdit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("请勾选一条数据")
        return
      }
      let row = this.selectRows[0]
      if (!row.platformTypeId || row.platformTypeId == "") {
        this.$message.warning("请先在店铺设置中完善平台信息")
        return
      }
      if (row.state == "1") {
        this.$message.warning("该数据已禁用，不能修改")
        return
      }
      this.addOrUpdateForm = {
        platformTypeId: row.platformTypeId,
        storeSitManageId: row.storeSitManageId,
        storeId: row.storeId,
        bsePlatformSitId: row.bsePlatformSitId,
        saleGroupId: row.saleGroupId,
        remark: row.remark
      }
      this.changePlatform(this.addOrUpdateForm.platformTypeId)
      this.addOrUpdateDialog = true
      this.handleAddOrUpdateTile = "修改"
    },
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          preventShake.preventShake((bool) => {
            if (bool) {
              handleSaveOrUpdate(_this.addOrUpdateForm)
                .then((response) => {
                  if (response.data.code == 0) {
                    _this.$message.success(_this.handleAddOrUpdateTile + "成功")
                    _this.clearSelectClear()
                    _this.refreshChange()
                    _this.addOrUpdateDialog = false
                  } else if (response.data.code == 1) {
                    _this.$message.warning(response.data.msg)
                    return
                  } else {
                    _this.$message.error("操作失败")
                    return
                  }
                })
                .catch(() => {
                  _this.$message.error("操作失败")
                  return
                })
            }
          })
        }
      })
    },
    //启用 禁用
    handleEnable(state) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }

      var ids = []
      var numberList = []
      this.selectRows.forEach((item) => {
        ids.push(item.storeSitManageId)
        if (state == item.state) {
          numberList.push(item.storeAccount)
        }
      })
      const msg = state === 0 ? "启用" : "禁用"
      if (numberList.length > 0) {
        this.$message.warning("店铺:" + numberList + "已" + msg + ",无须重复" + msg)
        return
      }

      const saveObj = {
        storeSitManageIdList: ids,
        stateModify: state
      }
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          stateModify(saveObj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success(msg + "成功")
                _this.clearSelectClear()
                _this.refreshChange()
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error(msg + "失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error(msg + "失败")
              return
            })
        }
      })
    },
    authFormReset() {
      this.$refs["authForm"].resetFields()
    },
    //授权
    authorization() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      //只能批量选择同店铺 同平台 同区域的数据
      var stores = []
      var platforms = []
      var districts = []
      var isNullPlatforms = false
      var prohibit = false
      var existAuthOk = false
      var countryCodes = []
      this.selectRows.forEach((o) => {
        //平台是否不存在
        if (!o.platformTypeCode || o.platformTypeCode == "") {
          isNullPlatforms = true
        }
        //店铺
        if (!stores.includes(o.storeId)) {
          stores.push(o.storeId)
        }
        //平台
        if (!platforms.includes(o.platformTypeCode)) {
          platforms.push(o.platformTypeCode)
        }
        //区域
        if (!districts.includes(o.districtId)) {
          districts.push(o.districtId)
        }
        //是否存在 禁用数据
        if (o.state == "1") {
          prohibit = true
        }
        //是否存在 已授权数据
        if (o.token && o.token.trim() != "") {
          existAuthOk = true
        }
        //保存 countryCode
        countryCodes.push(o.countryCode)
      })
      if (isNullPlatforms) {
        this.$message.warning("不能选择平台为空的数据")
        return
      }
      if (stores.length > 1 || platforms.length > 1 || districts.length > 1) {
        this.$message.warning("批量授权，请选择同店铺同平台同区域的数据进行操作")
        return
      }
      if (prohibit) {
        this.$message.warning("不能选择禁用的数据，进行授权")
        return
      }
      if (existAuthOk) {
        this.$message.warning("不能选择已授权的数据，进行重复授权")
        return
      }
      this.authForm = {
        storeAccount: this.selectRows[0].storeAccount,
        districtName: this.selectRows[0].districtName,
        countryCodes: countryCodes,
        sellerId: "",
        token: ""
      }
      this.submitAuthFormShow = false
      this.authDialog = true
    },
    //验证 sellerID token
    authValidate() {
      if (!this.authForm.sellerId || this.authForm.sellerId.trim() == "") {
        this.$message.warning("SellerID 不能为空")
        // return;
      }
      if (!this.authForm.token || this.authForm.token.trim() == "") {
        this.$message.warning("Token 不能为空")
        // return;
      }
      //请求接口验证 数据是否正确

      this.submitAuthFormShow = true
    },
    submitAuthForm() {
      var ids = []
      this.selectRows.forEach((o) => {
        ids.push(o.storeSitManageId)
      })
      const saveObj = {
        storeSitManageIdList: ids,
        sellerId: this.authForm.sellerId,
        token: this.authForm.token
      }
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          saveAuthorization(saveObj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("授权成功")
                _this.clearSelectClear()
                _this.refreshChange()
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error("授权失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error("授权失败")
              return
            })
        }
      })
    },
    showOperateLog(id) {
      this.$refs.operationlog.showOperateLogDialog(id, 7)
    }
  }
}
</script>

<style lang="scss" scoped></style>
