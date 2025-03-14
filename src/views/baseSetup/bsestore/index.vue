<template>
  <div class="execution" id="bsestoreDIV">
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
          <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.baseSetup_bsestore_add"
            >新 增</el-button
          >
          <el-button type="primary" @click="handleEdit" size="small" v-if="permissions.baseSetup_bsestore_edit"
            >修 改</el-button
          >
          <el-button type="primary" @click="handleUse" size="small" v-if="permissions.baseSetup_bsestore_del"
            >启 用</el-button
          >
          <el-button type="primary" @click="handleNotUse" size="small" v-if="permissions.baseSetup_bsestore_del"
            >禁 用</el-button
          >
          <el-button type="primary" v-if="permissions.bsestore_authorization" @click="authorization" size="small"
            >授 权</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsestore_saveCorporation"
            @click="setSaleMain"
            size="small"
            >设置法人主体
          </el-button>
          <!-- <el-button type="primary" v-if="permissions.baseSetup_bsestore_export" @click="handleExport" size="small">
            导 出
          </el-button> -->

          <export-btn
            v-if="permissions.baseSetup_bsestore_export"
            pageName="店铺"
            pageUrl="/bsestore/page"
            moduleName="baseSetup"
            :columns="tableOption.column"
            :pageReq="searchForm"
          ></export-btn>
        </template>
        <!-- 自定义搜索条件 -->
        <template slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="storeAccount">
              <el-input
                v-model="searchForm.storeAccount"
                size="small"
                placeholder="店铺名称,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="state">
              <el-select v-model="searchForm.state" clearable size="small" placeholder="启用/禁用">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="{ row }" slot="btnGroup">
          <el-dropdown trigger="click">
            <el-button class="el-dropdown-link"> 更多操作<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item type="text" size="small" plain @click.native="showOperateLog(row.storeId)"
                >查看日志</el-dropdown-item
              >
              <el-dropdown-item type="text" size="small" plain @click.native="showDetail(row)"
                >查看详情</el-dropdown-item
              >
            </el-dropdown-menu></el-dropdown
          >
        </template>
      </avue-crud>

      <el-dialog title="新建/编辑店铺" center width="600px" :visible.sync="addOrUpdateDialogVisible" @close="formReset">
        <el-form
          ref="addOrUpdateForm"
          label-width="120px"
          :inline="true"
          :model="bsestoreInfo"
          :rules="addOrUpdateFormRules"
          status-icon
        >
          <el-form-item label="平台" prop="platformTypeId">
            <el-select
              v-model="bsestoreInfo.platformTypeId"
              size="small"
              filterable
              placeholder="请选择"
              @change="changePlatform"
              :disabled="editDisabled"
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

          <el-form-item label="站点" prop="bsePlatformSitId">
            <el-select
              v-model="bsestoreInfo.bsePlatformSitId"
              size="small"
              filterable
              placeholder="请选择"
              :disabled="editDisabled"
            >
              <el-option
                v-for="item in bsePlatformSitOptions"
                :key="item.value"
                :label="item.sitEnName"
                :value="item.bsePlatformSitId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺名称" prop="storeAccount">
            <el-input
              size="small"
              placeholder="不得超过200个字符"
              v-model="bsestoreInfo.storeAccount"
              clearable
              maxLength="200"
              v-search-input-trim
            >
            </el-input>
          </el-form-item>

          <el-form-item label="币种" prop="currency">
            <el-select v-model="bsestoreInfo.currency" size="small" filterable placeholder="请选择">
              <el-option v-for="(item, index) in currencyOptions" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="不得超过200位字符"
              maxlength="200"
              v-model="bsestoreInfo.remark"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="金蝶CODE" prop="kingdeeCustCode">
            <el-input
              placeholder="只能输入字母、数字、符号"
              maxlength="200"
              clearable
              v-model="bsestoreInfo.kingdeeCustCode"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="金蝶名称" prop="kingdeeCustName">
            <el-input
              size="small"
              placeholder="不得超过200个字符"
              v-model="bsestoreInfo.kingdeeCustName"
              clearable
              maxLength="200"
              v-search-input-trim
            >
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="addOrUpdateDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="addOrUpdateSubmit('addOrUpdateForm')">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 授权-->
      <div>
        <el-dialog title="授权" :visible.sync="authDialog" width="660px" @close="authFormReset" center>
          <el-form
            label-width="180px"
            :inline="true"
            ref="authForm"
            :model="authForm"
            :rules="authRules"
            size="small"
            status-icon
          >
            <el-form-item label="平台" prop="platformTypeCode">
              <el-input v-model="authForm.platformTypeCode" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="站点" prop="countryCodes">
              <el-tag v-for="item in authForm.countryCodes" :key="item">
                {{ item }}
              </el-tag>
            </el-form-item>
            <el-form-item label="店铺名称" prop="storeAccount">
              <el-input v-model="authForm.storeAccount" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="Seller ID" prop="sellerId" v-if="false">
              <el-input v-model="authForm.sellerId" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="Token" prop="token" v-if="false">
              <el-input v-model="authForm.token" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="店铺ID" prop="clientId" v-if="authForm.platformTypeCode == 'WALMART'">
              <el-input v-model="authForm.clientId" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="店铺密钥" prop="clientSecret" v-if="authForm.platformTypeCode == 'WALMART'">
              <el-input v-model="authForm.clientSecret" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="平台通道标识" prop="channelType" v-if="authForm.platformTypeCode == 'WALMARTDSV'">
              <el-input v-model="authForm.channelType" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="分销商ID" prop="shipNode" v-if="authForm.platformTypeCode == 'WALMARTDSV'">
              <el-input v-model="authForm.shipNode" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="DSV私钥" prop="privateKey" v-if="authForm.platformTypeCode == 'WALMARTDSV'">
              <el-input v-model="authForm.clientId" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="AWS访问密钥编码" prop="accessKeyId" v-if="authForm.platformTypeCode == 'AMAZON'">
              <el-input v-model="authForm.accessKeyId" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="AWS访问密钥" prop="secretKey" v-if="authForm.platformTypeCode == 'AMAZON'">
              <el-input v-model="authForm.secretKey" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="IAM职权ARN" prop="roleArn" v-if="authForm.platformTypeCode == 'AMAZON'">
              <el-input v-model="authForm.roleArn" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="IAM职权名称" prop="roleSessionName" v-if="authForm.platformTypeCode == 'AMAZON'">
              <el-input v-model="authForm.roleSessionName" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="LWA客户端编码" prop="clientId" v-if="authForm.platformTypeCode == 'AMAZON'">
              <el-input v-model="authForm.clientId" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="LWA客户端密钥" prop="clientSecret" v-if="authForm.platformTypeCode == 'AMAZON'">
              <el-input v-model="authForm.clientSecret" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="LWA客户端令牌" prop="refreshToken" v-if="authForm.platformTypeCode == 'AMAZON'">
              <el-input v-model="authForm.refreshToken" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item
              label="LWA授权服务器的节点地址"
              prop="lwaEndpoint"
              v-if="authForm.platformTypeCode == 'AMAZON'"
            >
              <el-input v-model="authForm.lwaEndpoint" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="区域" prop="region" v-if="authForm.platformTypeCode == 'AMAZON'">
              <el-input v-model="authForm.region" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
            <el-form-item label="API地址" prop="endpoint" v-if="authForm.platformTypeCode == 'AMAZON'">
              <el-input v-model="authForm.endpoint" size="small" maxlength="200" v-search-input-trim></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="authDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitAuthForm('authForm')" v-show="submitAuthFormShow">
              确 定
            </el-button>
          </span>
        </el-dialog>
      </div>
      <!-- 设置主体-->
      <div>
        <el-dialog title="设置法人主体" :visible.sync="saleMainDialog" width="80%" @close="saleMainReset" center>
          <el-table
            :data="saleMainTableData"
            stripe
            max-height="500"
            @selection-change="handleSelectionChange"
            :header-cell-style="{ textAlign: 'center', color: '#000' }"
          >
            <el-table-column prop="platformTypeName" label="平台"></el-table-column>
            <el-table-column prop="sitName" label="站点"></el-table-column>
            <el-table-column prop="storeAccount" label="店铺名称"> </el-table-column>
            <el-table-column prop="corporationId" label="销售模式">
              <template slot-scope="scope">
                <div style="text-align: center">
                  <el-select
                    v-model="saleMainTableData[scope.$index].orderBusinessType"
                    size="small"
                    placeholder="销售模式"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="item in orderBusinessType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="corporationId" label="销售主体">
              <template slot-scope="scope">
                <div style="text-align: center">
                  <el-select v-model="saleMainTableData[scope.$index].corporationId" size="small" placeholder="全部">
                    <el-option
                      v-for="item in corporationOptions"
                      :key="item.corporationId"
                      :label="item.corporationName"
                      :value="item.corporationId"
                    >
                    </el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="deliveryCorporationId" label="发货主体">
              <template slot-scope="scope">
                <div style="text-align: center">
                  <el-select
                    v-model="saleMainTableData[scope.$index].deliveryCorporationId"
                    size="small"
                    placeholder="全部"
                  >
                    <el-option
                      v-for="item in corporationOptions"
                      :key="item.corporationId"
                      :label="item.corporationName"
                      :value="item.corporationId"
                    >
                    </el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作">
              <template slot-scope="scope">
                <i class="icon-shanchu y-icon-delect" @click="handleDelRow(scope.row, scope.$index)"></i>
                <i class="icon-xinzeng y-icon-add" @click="handleAddRow(scope.row)"></i>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="saleMainDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitSaleMain">确 定</el-button>
          </span></el-dialog
        >
      </div>

      <!-- 查看详情 -->
      <el-dialog title="查看详情" center width="600px" :visible.sync="detailVisible">
        <el-table :data="detailTableData" stripe :header-cell-style="{ textAlign: 'center', color: '#000' }">
          <el-table-column label="基础信息" header-align="center" width="140">
            <el-table-column prop="storeAccount" label="店铺名称" width="120"></el-table-column>
            <el-table-column prop="platformTypeCode" label="平台" width="120"></el-table-column>
            <el-table-column prop="sitEnName" label="站点" width="120"></el-table-column>
            <el-table-column prop="currency" label="币种" width="120"></el-table-column>
            <el-table-column prop="corporationName" label="销售主体" width="120"></el-table-column>
            <el-table-column prop="state" label="启用/禁用" width="120">
              <template slot-scope="scope">
                <p>{{ scope.row.state == "0" ? "启用" : "禁用" }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="authorizeState" label="是否授权" width="120">
              <template slot-scope="scope">
                <p>{{ scope.row.state == "0" ? "已授权" : "未授权" }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="120"></el-table-column>
            <el-table-column prop="createUser" label="创建人" width="120"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="120"></el-table-column>
            <el-table-column prop="updateUser" label="更新人" width="120"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="120"></el-table-column>
          </el-table-column>
          <el-table-column label="授权信息" header-align="center" width="140" v-if="isAuthorization == '0'">
            <el-table-column
              prop="clientId"
              label="店铺ID"
              v-if="platform == 'WALMART' || platform == 'WALMART_DSV'"
            ></el-table-column>
            <el-table-column prop="clientSecret" label="店铺密钥" v-if="platform == 'WALMART'"></el-table-column>
            <el-table-column prop="channelType" label="平台通道识别" v-if="platform == 'WALMART_DSV'"></el-table-column>
            <el-table-column prop="shipNode" label="分销商ID" v-if="platform == 'WALMART_DSV'"></el-table-column>
            <el-table-column prop="privateKey" label="DSV私钥" v-if="platform == 'WALMART_DSV'"></el-table-column>
            <el-table-column prop="acessKeyId" label="AWS访问密钥编码" v-if="platform == 'AMAZON'"></el-table-column>
            <el-table-column prop="secretKey" label="AWS访问密钥" v-if="platform == 'AMAZON'"></el-table-column>
            <el-table-column prop="roleArn" label="IAM职权ARN" v-if="platform == 'AMAZON'"></el-table-column>
            <el-table-column prop="roleSessionName" label="IAM职权名称" v-if="platform == 'AMAZON'"></el-table-column>
            <el-table-column prop="clientId" label="LWA客户端编码" v-if="platform == 'AMAZON'"></el-table-column>
            <el-table-column prop="clientSecret" label="LWA客户端密钥" v-if="platform == 'AMAZON'"></el-table-column>
            <el-table-column prop="refreshToken" label="LWA客户端令牌" v-if="platform == 'AMAZON'"></el-table-column>
            <el-table-column
              prop="lwaEndpoint"
              label="LWA授权服务器的节点地址"
              v-if="platform == 'AMAZON'"
            ></el-table-column>
            <el-table-column prop="region" label="区域" v-if="platform == 'AMAZON'"></el-table-column>
            <el-table-colum prop="endpoint" label="API地址" v-if="platform == 'AMAZON'"></el-table-colum>
          </el-table-column>
        </el-table>
      </el-dialog>
      <preview ref="preView"></preview>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  putObj,
  useObj,
  notuseObj,
  getDistrict,
  saveAuthorization,
  getListStoreWithCorporation,
  getAllCorporation,
  saveCorporation
} from "@/api/baseSetup/bsestore"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { tableOption, addOrUpdateFormRules, authRules } from "@/const/crud/baseSetup/bsestore"
import { getAll as getAllCurrency } from "@/api/baseSetup/bsecurrency"
import { preventShake } from "@/util/tool"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import preview from "@/components/yvue/pdf/index"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { mapGetters } from "vuex"
import { getObjByType } from "@/api/order/orderManage"
import { exportDataComApi } from "@/api/common/index"
import { downloadBlob } from "@/util/auth"

export default {
  name: "bsestore",
  components: {
    preview,
    operationlog
  },
  data() {
    return {
      tableData: [],
      saleMainTableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectList: [],
      //搜索对象
      searchForm: {
        storeAccount: "",
        storeNameShort: "",
        // districtId: [],
        state: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      options: [
        {
          value: "0",
          label: "启用"
        },
        {
          value: "1",
          label: "禁用"
        }
      ],
      //新增 修改相关
      addOrUpdateDialogVisible: false,
      addOrUpdateFlag: "0",
      bsestoreInfo: {
        storeId: null,
        storeAccount: "",
        bsePlatformSitId: "",
        storeNameShort: "",
        storeNameEn: "",
        platformTypeId: "",
        // saleGroupId: "",
        remark: "",
        currency: "",
        kingdeeCustCode: "",
        kingdeeCustName: ""
      },
      bsedistrictOptions: [],
      bsePlatformSitOptions: [],
      plaTypeOption: [],
      requisitionGroupOptions: [],
      addOrUpdateFormRules: addOrUpdateFormRules,
      editDisabled: false,
      //授权相关
      submitAuthFormShow: true,
      authDialog: false,
      authRules: authRules,

      authValidateDisabled: false,
      authForm: {
        platformTypeCode: "",
        storeAccount: "",
        districtName: "",
        countryCodes: [],
        sellerId: "",
        token: "",
        clientId: "",
        clientSecret: "",
        channelType: "",
        shipNode: "",
        privateKey: "",
        accessKeyId: "",
        secretKey: "",
        roleArn: "",
        roleSessionName: "",
        refreshToken: "",
        lwaEndpoint: "",
        region: "",
        endpoint: ""
      },
      saleMainDialog: false,
      storeIds: [],
      corporationOptions: [],
      currencyOptions: [],
      detailTableData: [],
      detailVisible: false,
      isAuthorization: "", //是否授权
      platform: "",
      orderBusinessType: [],
      storeId: ""
    }
  },
  created() {},
  mounted: function () {
    this.getList(this.page)
    this.initInfo()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //查看详情
    async showDetail(row) {
      this.isAuthorization = row.authorizeState
      this.platform = row.platformTypeCode
      this.detailTableData = [row]
      this.detailVisible = true
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /** 搜索回调*/
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
      this.selectList = selection
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
            page: page.currentPage,
            pageSize: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    /**
     * 查询初始化选项
     */
    initInfo() {
      getAllCurrency().then((response) => {
        response.data.data.forEach((item) => {
          if (response.data.code === 0) {
            this.currencyOptions.push({
              value: item.currency,
              label: item.currency
            })
          }
        })
      })
      getAllCorporation({}).then((res) => {
        this.corporationOptions = res.data.data.data
      })
      getObjByType("order_business_type").then((res) => {
        if (res.data.code === 0) {
          this.orderBusinessType = res.data.data
        }
      })
      //平台
      getPlaTypeAll().then((res) => {
        this.plaTypeOption = res.data.data
      })
      //区域
      getDistrict().then((res) => {
        this.bsedistrictOptions = res.data.data
      })
      //销售组
      var params = {
        groupFunctionName: "销售类",
        authority: false
      }
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.requisitionGroupOptions = data
        }
      })
    },
    formReset() {
      this.$refs["addOrUpdateForm"].resetFields()
      this.bsestoreInfo = {
        storeId: null,
        storeAccount: "",
        bsePlatformSitId: "",
        storeNameShort: "",
        storeNameEn: "",
        platformTypeId: "",
        // saleGroupId: "",
        remark: ""
      }
      this.bsePlatformSitOptions = []
    },
    getSitInfo(val) {
      let param = {
        platformTypeId: val
      }
      getSitInfoByPlatformId(param).then((res) => {
        this.bsePlatformSitOptions = res.data.data
      })
    },
    //选中平台获取平台下的站点信息
    changePlatform(val) {
      this.bsestoreInfo.bsePlatformSitId = ""
      this.getSitInfo(val)
    },
    /**
     * @title 打开新增窗口
     **/
    handleAdd: function () {
      this.addOrUpdateFlag = "0"
      this.addOrUpdateDialogVisible = true
      this.editDisabled = false
    },
    handleEdit() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请勾选数据")
        return
      }
      if (this.selectList.length != 1) {
        this.$message.warning("只能勾选一条数据")
        return
      }
      if (this.selectList && this.selectList[0].state == "1") {
        this.$message.warning("该数据已禁用，不能修改")
        return
      }

      var data = this.selectList[0]
      this.bsestoreInfo = {
        currency: data.currency,
        storeId: data.storeId,
        platformTypeId: data.platformTypeId,
        bsePlatformSitId: data.bsePlatformSitId,
        storeAccount: data.storeAccount,
        storeNameShort: data.storeNameShort,
        storeNameEn: data.storeNameEn,
        // saleGroupId: data.saleGroupId,
        remark: data.remark,
        kingdeeCustName: data.kingdeeCustName,
        // corporationId: data.corporationId,
        kingdeeCustCode: data.kingdeeCustCode
      }
      this.getSitInfo(data.platformTypeId)
      this.addOrUpdateFlag = "1"
      this.addOrUpdateDialogVisible = true
      this.editDisabled = true
    },
    /**
     * 提交新增或者更新表单
     */
    addOrUpdateSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          preventShake.preventShake((bool) => {
            if (bool) {
              //新增
              let reg = new RegExp(/[\u4e00-\u9fa5\s]/)
              if (reg.test(this.bsestoreInfo.kingdeeCustCode)) {
                this.$message.warning("【金蝶CODE】仅支持输入数字、英文字母、符号！")
                return
              }
              if (this.addOrUpdateFlag == "0") {
                addObj(this.bsestoreInfo)
                  .then((response) => {
                    if (response.data.code == 0) {
                      this.addOrUpdateDialogVisible = false
                      this.clearSelectClear()
                      this.searchChange()
                      this.$message.success("添加成功")
                    } else if (response.data.code == 1) {
                      this.$message.warning(response.data.msg)
                      return
                    } else {
                      this.$message.error("操作失败")
                      return
                    }
                  })
                  .catch(() => {
                    this.$message.error("操作失败")
                    return
                  })
              } else {
                //编辑
                putObj(this.bsestoreInfo)
                  .then((response) => {
                    if (response.data.code == 0) {
                      this.addOrUpdateDialogVisible = false
                      this.clearSelectClear()
                      this.searchChange()
                      this.$message.success("修改成功")
                    } else if (response.data.code == 1) {
                      this.$message.warning(response.data.msg)
                      return
                    } else {
                      this.$message.error("操作失败")
                      return
                    }
                  })
                  .catch(() => {
                    this.$message.error("操作失败")
                    return
                  })
              }
            }
          })
        }
      })
    },
    /**
     * 启用
     */
    handleUse() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var isOperate = true
      var tip = ""
      var data = this.selectList
      var storeIds = []
      this.selectList.forEach((item) => {
        if (item.state == 0 && isOperate) {
          tip = "店铺：" + item.storeAccount + "，已启用，不需要再启用"
          isOperate = false
        } else if (isOperate) {
          storeIds.push(item.storeId)
        }
      })
      if (!isOperate) {
        this.$message.warning(tip)
        return
      }
      // this.$confirm('是否确认启用选中店铺?', '提示', {
      //   confirmButtonText:'确定', cancelButtonText:'取消', type:'warning'}).then(()=>{
      useObj(storeIds.join(","))
        .then((response) => {
          if (response.data.code == 0) {
            this.clearSelectClear()
            this.searchChange()
            this.$message.success("操作成功")
          } else if (response.data.code == 1) {
            // this.$message.warning(response.data.msg)
            this.$message({
              message: response.data.msg.replace(/\n/g, "<br>"),
              dangerouslyUseHTMLString: true,
              type: "warning"
            })
            return
          } else {
            this.$message.error("操作失败")
            return
          }
        })
        .catch(() => {
          this.$message.error("操作失败")
          return
        })
      // }).catch((error)=>{
      // });
    },
    /**
     * 禁用
     */
    handleNotUse() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var isOperate = true
      var tip = ""
      var data = this.selectList
      var storeIds = []
      this.selectList.forEach((item) => {
        if (item.state == 1 && isOperate) {
          tip = "店铺：" + item.storeAccount + "，已禁用，不需要再禁用"
          isOperate = false
        } else if (isOperate) {
          storeIds.push(item.storeId)
        }
      })
      if (!isOperate) {
        this.$message.warning(tip)
        return
      }
      // this.$confirm('是否确认禁用选中店铺?', '提示', {
      //   confirmButtonText:'确定', cancelButtonText:'取消', type:'warning'}).then(()=>{
      notuseObj(storeIds.join(","))
        .then((response) => {
          if (response.data.code == 0) {
            this.clearSelectClear()
            this.searchChange()
            this.$message.success("操作成功")
          } else if (response.data.code == 1) {
            this.$message.warning(response.data.msg)
            return
          } else {
            this.$message.error("操作失败")
            return
          }
        })
        .catch(() => {
          this.$message.error("操作失败")
          return
        })
      // }).catch((error)=>{
      // });
    },
    authFormReset() {
      this.$refs["authForm"].resetFields()
    },
    //设置销售主体
    async setSaleMain() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      if (this.selectList.length > 1) {
        this.$message.warning("只能勾选一条数据")
        return
      }
      let storeIds = []
      this.storeIds = []
      this.selectList.forEach((item) => {
        storeIds.push(item.storeId)
      })
      this.storeIds = storeIds
      let res = await getListStoreWithCorporation({
        storeId: this.selectList[0].storeId
      })
      this.storeId = res.data.data.storeId
      // 没有历史数据的情况
      if (res.data.data.deliveryCorporations.length === 0) {
        this.saleMainTableData = this.selectList.map((item) => {
          return {
            platformTypeName: item.platformTypeName,
            sitName: item.sitName,
            storeAccount: item.storeAccount,
            orderBusinessType: null,
            storeId: item.storeId,
            deliveryCorporationId: item.deliveryCorporationId,
            corporationId: item.corporationId
          }
        })
      } else {
        this.saleMainTableData = res.data.data.deliveryCorporations
      }

      this.saleMainDialog = true
    },
    //设置销售主体提交
    async submitSaleMain() {
      let res = await saveCorporation({
        deliveryCorporations: this.saleMainTableData,
        storeId: this.storeId
      })

      if (res.data.code == 0) {
        this.$message.success("操作成功！")
      } else {
        this.$message.error(res.data.msg)
      }
      this.saleMainDialog = false
      this.searchChange()
    },
    //授权
    authorization() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      if (this.selectList.length > 1) {
        this.$message.warning("只能勾选单条数据授权!")
        return
      }
      //只能批量选择同店铺 同平台 同区域的数据
      var stores = []
      var platforms = []
      var districts = []
      var isNull = false
      var prohibit = false
      var existAuthOk = false
      var countryCodes = []
      this.selectList.forEach((o) => {
        //平台 站点 店铺 是否不存在
        if (
          !o.platformTypeId ||
          o.platformTypeId == "" ||
          !o.countryCode ||
          o.countryCode == "" ||
          !o.storeAccount ||
          o.storeAccount == ""
        ) {
          isNull = true
        }
        //店铺
        if (!stores.includes(o.storeAccount)) {
          stores.push(o.storeAccount)
        }
        //平台
        if (!platforms.includes(o.platformTypeId)) {
          platforms.push(o.platformTypeId)
        }
        //区域
        // if (!districts.includes(o.districtId)) {
        //   districts.push(o.districtId)
        // }
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
      if (isNull) {
        this.$message.warning("不能对平台、站点或店铺为空的数据进行授权，请先完善数据")
        return
      }
      if (stores.length > 1 || platforms.length > 1 || districts.length > 1) {
        this.$message.warning("授权时，请选择同平台同区域同店铺的数据进行操作")
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
        platformTypeCode: this.selectList[0].platformTypeCode,
        countryCodes: countryCodes,
        storeAccount: this.selectList[0].storeAccount,
        districtName: this.selectList[0].districtName,
        sellerId: "",
        token: "",
        clientId: this.selectList[0].clientId,
        clientSecret: this.selectList[0].clientSecret,
        channelType: this.selectList[0].channelType,
        shipNode: this.selectList[0].shipNode,
        privateKey: this.selectList[0].privateKey,
        accessKeyId: this.selectList[0].accessKeyId,
        secretKey: this.selectList[0].secretKey,
        roleArn: this.selectList[0].roleArn,
        roleSessionName: this.selectList[0].roleSessionName,
        refreshToken: this.selectList[0].refreshToken,
        lwaEndpoint: this.selectList[0].lwaEndpoint,
        region: this.selectList[0].region,
        endpoint: this.selectList[0].endpoint
      }
      this.submitAuthFormShow = true
      this.authDialog = true
    },
    submitAuthForm() {
      var ids = []
      this.selectList.forEach((o) => {
        ids.push(o.storeId)
      })
      const saveObj = {
        storeIds: ids,
        sellerId: this.authForm.sellerId,
        token: this.authForm.token,
        clientId: this.authForm.clientId,
        clientSecret: this.authForm.clientSecret,
        channelType: this.authForm.channelType,
        shipNode: this.authForm.shipNode,
        privateKey: this.authForm.privateKey,
        accessKeyId: this.authForm.accessKeyId,
        secretKey: this.authForm.secretKey,
        roleArn: this.authForm.roleArn,
        roleSessionName: this.authForm.roleSessionName,
        refreshToken: this.authForm.refreshToken,
        lwaEndpoint: this.authForm.lwaEndpoint,
        region: this.authForm.region,
        endpoint: this.authForm.endpoint,
        authorizeState: "0"
      }
      let _this = this

      this.$refs["authForm"].validate((valid) => {
        if (valid) {
          preventShake.preventShake((bool) => {
            if (bool) {
              saveAuthorization(saveObj)
                .then((response) => {
                  if (response.data.code == 0) {
                    _this.$message.success("授权成功")
                    _this.authDialog = false
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
        }
      })
    },
    showOperateLog(id) {
      this.$refs.operationlog.showOperateLogDialog(id, 6)
    },
    handleDelRow(row, index) {
      if (this.saleMainTableData.length > 1) {
        this.saleMainTableData.splice(index, 1)
      } else {
        this.$message.error("必须设置一个销售主体")
        return
      }
    },
    handleAddRow(row) {
      const { storeAccount, sitName, platformTypeName, storeId } = row
      this.saleMainTableData.push({
        storeAccount,
        sitName,
        platformTypeName,
        storeId
      })
    },
    async handleExport() {
      const exportParams = []
      const obj = deepCloneIgnoreNull(this.searchForm)

      Object.keys(obj).forEach((item) => {
        if (Array.isArray(obj[item])) {
          exportParams.push({ code: item, value: obj[item].join(",") })
        } else {
          exportParams.push({ code: item, value: obj[item] })
        }
      })

      const { data } = await exportDataComApi({
        id: 31,
        param: exportParams,
        exportModel: "SYNC"
      })
      downloadBlob(data, "店铺导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
    }
  }
}
</script>

<style lang="scss"></style>
