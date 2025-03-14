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
  <div class="execution" id="bsetransportcarrier">
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
          <el-button type="primary" v-if="permissions.baseSetup_bsetransportcarrier_add" size="small" @click="handleAdd"
            >新 增</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsetransportcarrier_edit"
            size="small"
            @click="handleEdit"
            >修改</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsetransportcarrier_audit"
            @click="handleAudit"
            size="small"
            >审核</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsetransportcarrier_enable"
            @click="handleEnable(0)"
            size="small"
            >启用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsetransportcarrier_prohibit"
            @click="handleEnable(1)"
            size="small"
            >禁用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsetransportcarrier_export"
            @click="handleExport()"
            size="small"
            >导出</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="carrierName">
              <el-input
                v-model="searchForm.carrierName"
                size="small"
                placeholder="物流商名称,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="approveStatus">
              <el-select v-model="searchForm.approveStatus" size="small" clearable filterable placeholder="状态">
                <el-option
                  v-for="item in approveStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="delFlag">
              <el-select v-model="searchForm.delFlag" size="small" clearable filterable placeholder="启用/禁用">
                <el-option v-for="item in delFlagOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <!-- <template slot-scope="scope" slot="operationLog">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.transportCarrierId)"></i>
        </template> -->
        <!-- <template #menu="{ size, row, index }">
          <el-button type="primary" size="small" @click="setTransPlat">设置平台物流映射</el-button>
          <el-button type="primary" size="small" @click="setTransPlat">设置仓库物流映射</el-button>
          <i class="icon-rizhi y-reviews" @click="showOperateLog(row.transportCarrierId)"></i>
          <el-button type="primary" size="small" @click="setTransPlat">查看详情</el-button>
        </template> -->
        <template slot-scope="{ row }" slot="btnGroup">
          <el-dropdown trigger="click">
            <el-button class="el-dropdown-link"> 更多操作<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item v-if="permissions.baseSetup_saveMapping_platform"
                @click.native="setTransPlat(row)">设置平台物流映射</el-dropdown-item>
              <el-dropdown-item v-if="permissions.baseSetup_saveMapping_oversea" type="text" size="small" plain
                @click.native="setTransWare(row)">设置仓库物流渠道</el-dropdown-item> -->
              <el-dropdown-item type="text" size="small" plain @click.native="showOperateLog(row.transportCarrierId)"
                >查看日志</el-dropdown-item
              >
              <el-dropdown-item type="text" size="small" plain @click.native="showDetail(row)"
                >查看详情</el-dropdown-item
              >
            </el-dropdown-menu></el-dropdown
          >
        </template>
      </avue-crud>

      <!--新增/编辑-->
      <div>
        <el-dialog
          class="add_dialog"
          :title="handleAddOrUpdateTile"
          :visible.sync="addOrUpdateDialog"
          width="660px"
          @close="formReset"
          center
        >
          <el-form ref="addOrUpdateForm" :model="addOrUpdateForm" :rules="addOrUpdateRules" size="small" status-icon>
            <el-form-item label="物流商编码" prop="transportCarrierCode">
              <el-input
                v-model="addOrUpdateForm.transportCarrierCode"
                size="small"
                maxlength="50"
                @blur="inputBlur"
                v-search-input-trim
              ></el-input>
            </el-form-item>
            <el-form-item label="物流商名称" prop="carrierName">
              <el-input
                v-model="addOrUpdateForm.carrierName"
                size="small"
                maxlength="50"
                @blur="inputBlur"
                v-search-input-trim
              ></el-input>
            </el-form-item>

            <el-form-item label="物流商简称" prop="carrierShortName">
              <el-input
                v-model="addOrUpdateForm.carrierShortName"
                size="small"
                maxlength="50"
                @blur="inputBlur"
                v-search-input-trim
              ></el-input>
            </el-form-item>
            <el-form-item label="服务范围" prop="serviceScope">
              <el-input v-model="addOrUpdateForm.serviceScope" size="small"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contactName">
              <el-input
                v-model="addOrUpdateForm.contactName"
                size="small"
                maxlength="20"
                v-search-input-trim
              ></el-input>
            </el-form-item>

            <el-form-item label="联系方式" prop="contactNo">
              <el-input v-model="addOrUpdateForm.contactNo" size="small" maxlength="20" v-search-input-trim></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="addOrUpdateDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitForm('addOrUpdateForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 审核 -->
      <el-dialog v-bind:title="auditTitle" :visible.sync="auditDialog" width="30%">
        <!-- :before-close="handleClose"> -->
        <!-- <el-radio v-model="auditType" label="1">同意</el-radio>
        <el-radio v-model="auditType" label="2">拒绝</el-radio> -->
        <el-input
          type="textarea"
          :rows="5"
          :maxlength="100"
          placeholder="请填写拒绝原因，不得超过100个字符。拒绝，必填"
          v-model="auditTextarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="confrimDialog = false">取 消</el-button> -->
          <!-- <el-button type="primary" @click="handleAuditSave">确 定</el-button> -->
          <!-- <el-button type="primary" @click="handleAuditSave">确 定</el-button> -->
          <el-button type="info" size="small" @click="dialogResult(false)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="dialogResult(true)">通 过</el-button>
        </span>
      </el-dialog>

      <!-- 设置平台物流映射 -->
      <div>
        <el-dialog title="设置平台物流映射" :visible.sync="setPlatTransportDialog" width="48%">
          <el-form
            ref="platTransportForm"
            :model="platTransportForm"
            :rules="platTransportRules"
            size="small"
            status-icon
          >
            <el-form-item label="物流商编码" prop="transportCarrierCode">
              <el-tag>{{ platTransportForm.transportCarrierCode }}</el-tag>
            </el-form-item>
            <el-form-item label="物流商名称" prop="carrierName">
              <el-tag>{{ platTransportForm.carrierName }}</el-tag>
            </el-form-item>
            <el-form-item v-for="(platformCarrier, index) in platTransportForm.bsePlatformCarriers" :key="index">
              <el-form-item label="平台" prop="platformTypeId">
                <el-row>
                  <el-col :span="8">
                    <el-select v-model="platformCarrier.platformTypeId" @change="handleChange(index)">
                      <el-option
                        v-for="item in platformOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="2"
                    ><el-button
                      @click="addPlatformCarrier"
                      v-if="index === platTransportForm.bsePlatformCarriers.length - 1"
                      >+</el-button
                    >
                    <el-button
                      @click="removePlatformCarrier(index)"
                      v-if="platTransportForm.bsePlatformCarriers.length !== 1"
                      >-</el-button
                    >
                  </el-col>
                </el-row>
              </el-form-item>
              <el-row>
                <el-col :span="8"
                  ><el-form-item label="销售站点" prop="sitId">
                    <el-select v-model="platformCarrier.sitId">
                      <el-option
                        v-for="item in salesSiteOptions[index]"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="平台物流商编码" prop="bsePlatformTransportCarrierCode">
                    <el-input v-model="platformCarrier.bsePlatformTransportCarrierCode"></el-input> </el-form-item
                ></el-col>
                <el-col :span="8">
                  <el-form-item label="平台物流商名称" prop="bsePlatformTransportCarrierName">
                    <el-input v-model="platformCarrier.bsePlatformTransportCarrierName"></el-input> </el-form-item
                ></el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="setPlatTransportDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="setPlatTransport">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 设置仓库物流映射 -->
      <div>
        <el-dialog title="设置仓库物流渠道" :visible.sync="setWareTransportDialog" width="48%">
          <el-form
            ref="wareTransportForm"
            :model="wareTransportForm"
            :rules="wareTransportRules"
            size="small"
            status-icon
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="物流商编码" prop="transportCarrierCode">
                  <el-tag>{{ wareTransportForm.transportCarrierCode }}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="物流商名称" prop="carrierName">
                  <el-tag>{{ wareTransportForm.carrierName }}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item v-for="(warehouseCarrier, index) in wareTransportForm.bseWarehouseCarriers" :key="index">
              <el-row>
                <el-col :span="7">
                  <el-form-item label="海外仓服务商" prop="providerId">
                    <el-select v-model="warehouseCarrier.providerId" @change="handleChangeProvider(index)">
                      <el-option
                        v-for="item in providerOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="海外仓渠道编码" prop="bseOverseaCarrierId">
                    <el-select
                      v-model="warehouseCarrier.bseOverseaCarrierId"
                      @change="handleChangeOversea(index)"
                      clearable
                    >
                      <el-option
                        v-for="item in overseaCarrierOption[index]"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="海外仓渠道名称" prop="bseOverseaCarrierName">
                    <el-tag>{{ warehouseCarrier.bseOverseaCarrierName }}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="3"
                  ><el-button
                    @click="addWarehouseCarrier"
                    v-if="index === wareTransportForm.bseWarehouseCarriers.length - 1"
                    icon="el-icon-plus"
                  ></el-button>
                  <el-button
                    @click="removeWarehouseCarrier(index)"
                    v-if="wareTransportForm.bseWarehouseCarriers.length !== 1"
                    icon="el-icon-minus"
                  ></el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="setWareTransportDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="setWareTransport">确 定</el-button>
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
  handleSaveOrUpdate,
  stateModify,
  handleAudit,
  getCarrierMsg,
  saveCarrierMsg,
  getProviderAll,
  getOverseaCarrierById,
  getOverseaMsg,
  saveOverseaMsg
} from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier"
import {
  tableOption,
  addOrUpdateRules,
  platTransportRules,
  wareTransportRules
} from "@/const/crud/baseSetup/bsetransportcarrier/bsetransportcarrier"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import { getPlaTypeAll } from "../../../api/baseSetup/bseplatformtype"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { getUrlConcatToken } from "@/util/auth"
import { preventShake } from "@/util/tool"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "bsetransportcarrier",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        carrierName: "",
        approveStatus: "",
        delFlag: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],
      //新增 修改相关
      handleAddOrUpdateTile: "",
      addOrUpdateDialog: false,
      wareTransportRules: wareTransportRules,
      platTransportRules: platTransportRules,
      addOrUpdateRules: addOrUpdateRules,
      addOrUpdateForm: {
        transportCarrierCode: "",
        transportCarrierId: null,
        carrierName: null,
        carrierShortName: null,
        contactName: null,
        contactNo: null,
        serviceScope: null
      },
      //审核状态
      approveStatusOptions: [
        { value: 1, label: "待审核" },
        { value: 2, label: "已审核" }
      ],
      //禁用
      delFlagOptions: [
        { value: "0", label: "启用" },
        { value: "1", label: "禁用" }
      ],
      //审核相关
      auditTitle: "审核",
      auditDialog: false,
      auditType: "1",
      auditTextarea: null,
      setPlatTransportDialog: false,
      platTransportForm: {
        transportCarrierCode: "",
        carrierName: "",
        bsePlatformCarriers: [
          {
            platformTypeId: null,
            sitId: null,
            bseWarehouseTransportCarrierCode: "",
            bseWarehouseTransportCarrierName: ""
          }
        ]
      },
      platformOptions: [],
      salesSiteOptions: [],
      transportCarrierId: null,
      setWareTransportDialog: false,
      wareTransportForm: {
        transportCarrierCode: "",
        carrierName: "",
        bseWarehouseCarriers: [
          {
            providerId: null,
            bseOverseaCarrierId: null,
            bseOverseaCarrierName: ""
          }
        ]
      },
      providerOptions: [],
      overseaCarrierOption: []
    }
  },
  components: {
    operationlog
  },
  created() {
    this.init()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    handleChangeOversea(index) {
      console.log(index)
      let value = this.wareTransportForm.bseWarehouseCarriers[index].bseOverseaCarrierId
      console.log(this.overseaCarrierOption[index])

      const selectedOption = this.overseaCarrierOption[index].find((option) => option.value === value)
      if (selectedOption) {
        this.wareTransportForm.bseWarehouseCarriers[index].bseOverseaCarrierName = selectedOption.label
        console.log(this.wareTransportForm.bseWarehouseCarriers[index].bseOverseaCarrierName)
      }
    },
    handleChange(index) {
      const platformTypeId = this.platTransportForm.bsePlatformCarriers[index].platformTypeId
      this.getSite(platformTypeId).then((options) => {
        this.$set(this.salesSiteOptions, index, options)
        this.$set(
          this.platTransportForm.bsePlatformCarriers[index],
          "sitId",
          options.length > 0 ? options[0].value : ""
        )
      })
    },
    init() {
      this.getPlatform()
      this.getProvider()
    },
    async getProvider() {
      let res = await getProviderAll()
      res.data.data.forEach((item) => {
        this.providerOptions.push({
          value: item.providerId,
          label: item.providerName
        })
      })
      console.log(res.data.data)
    },
    //获取所有平台
    async getPlatform() {
      let res = await getPlaTypeAll()
      res.data.data.forEach((item) => {
        this.platformOptions.push({
          value: item.platformTypeId,
          label: item.platformTypeName
        })
      })
      console.log("平台列表", this.platformOptions)
    },
    //根据所选平台,获取对应站点
    getSite(val) {
      console.log("val", val)
      // this.salesSiteOption = []
      return getSitInfoByPlatformId({ platformTypeId: val })
        .then((res) => {
          if (res.data.code === 0) {
            let options = []
            res.data.data.forEach((item) => {
              options.push({
                value: item.bsePlatformSitId,
                label: item.sitEnName
              })
            })
            return options
          }
        })
        .catch((err) => {
          this.$message.error(err)
          return []
        })
    },
    //物流平台映射
    async setTransPlat(val) {
      this.transportCarrierId = val.transportCarrierId
      let res = await getCarrierMsg({ id: val.transportCarrierId })
      console.log("res", res.data.data)
      console.log("val", val)
      if (res.data.code === 0) {
        console.log("length", res.data.data.bsePlatformCarriers.length - 1)
        let index = res.data.data.bsePlatformCarriers.length - 1
        res.data.data.bsePlatformCarriers.forEach((item) => {
          this.getSite(item.platformTypeId).then((options) => {
            console.log("index", index)
            this.$set(this.salesSiteOptions, index, options)
            this.$set(
              this.platTransportForm.bsePlatformCarriers[index],
              "sitId",
              options.length > 0 ? options[0].value : ""
            )
            index--
          })
        })
      }
      this.platTransportForm = {
        transportCarrierCode: res.data.data.transportCarrierCode,
        carrierName: res.data.data.carrierName,
        bsePlatformCarriers: res.data.data.bsePlatformCarriers
      }
      if (this.platTransportForm.bsePlatformCarriers.length === 0) {
        this.addPlatformCarrier()
      }
      console.log(this.platTransportForm)
      this.setPlatTransportDialog = true
    },
    // 添加新的 平台物流映射
    addPlatformCarrier() {
      this.platTransportForm.bsePlatformCarriers.push({
        platformTypeId: "",
        sitId: "",
        bsePlatformTransportCarrierCode: "",
        bsePlatformTransportCarrierName: ""
      })
      this.salesSiteOptions.push([])
    },
    // 移除指定的 平台物流映射
    removePlatformCarrier(index) {
      this.platTransportForm.bsePlatformCarriers.splice(index, 1)
      this.salesSiteOptions.splice(index, 1)
    },
    //保存平台物流映射
    async setPlatTransport() {
      let res = await saveCarrierMsg({
        transportCarrierId: this.transportCarrierId,
        bsePlatformCarrierDtos: this.platTransportForm.bsePlatformCarriers
      })
      if (res.data.code === 0) {
        this.$message.success("操作成功")
        this.setPlatTransportDialog = false
        this.refreshChange()
      } else {
        this.$message.error(res.data.msg)
      }
      console.log(res)
    },

    async setTransWare(val) {
      this.transportCarrierId = val.transportCarrierId
      let res = await getOverseaMsg({ id: val.transportCarrierId })
      if (res.data.code === 0) {
        console.log("res", res)
        console.log("length", res.data.data.bseOverSeaProviderCarrier.length - 1)
        let index = res.data.data.bseOverSeaProviderCarrier.length - 1
        res.data.data.bseOverSeaProviderCarrier.forEach((item) => {
          this.getOverseaCarrier(item.providerId).then((options) => {
            console.log("options", options)
            this.$set(this.overseaCarrierOption, index, options)
            console.log("data", this.overseaCarrierOption[index])
            this.$set(
              this.wareTransportForm.bseOverSeaProviderCarrier[index],
              "bseOverseaCarrierId",
              options.length > 0 ? options[0].value : ""
            )
            index--
          })
        })
      }
      console.log("index", this.wareTransportForm)
      this.wareTransportForm = {
        transportCarrierCode: res.data.data.transportCarrierCode,
        carrierName: res.data.data.carrierName,
        bseWarehouseCarriers: res.data.data.bseOverSeaProviderCarrier
      }
      if (this.wareTransportForm.bseWarehouseCarriers.length === 0) {
        this.addWarehouseCarrier()
      }
      console.log(res.data.data)
      this.setWareTransportDialog = true
    },
    handleChangeProvider(index) {
      const providerId = this.wareTransportForm.bseWarehouseCarriers[index].providerId
      console.log(providerId)
      this.wareTransportForm.bseWarehouseCarriers[index].bseOverseaCarrierName = ""
      // this.wareTransportForm.bseWarehouseCarriers[index].bseOverseaCarrierId = null
      console.log(this.wareTransportForm.bseWarehouseCarriers[index].bseOverseaCarrierId)
      this.getOverseaCarrier(providerId).then((options) => {
        console.log("options", options)
        this.$set(this.overseaCarrierOption, index, options)
        this.$set(
          this.wareTransportForm.bseWarehouseCarriers[index],
          "bseOverseaCarrierId",
          options.length > 0 ? options[0].value : ""
        )
      })
      console.log(this.overseaCarrierOption)
    },
    async getOverseaCarrier(val) {
      console.log(val)
      return getOverseaCarrierById({ id: val })
        .then((res) => {
          console.log("res", res)
          if (res.data.code === 0) {
            let options = []
            res.data.data.wrapperList.forEach((item) => {
              options.push({
                value: item.overSeaCarrierId,
                label: item.lpName
              })
            })
            return options
          }
        })
        .catch((err) => {
          this.$message.error(err)
          return []
        })
    },
    // 添加新的 平台物流映射
    addWarehouseCarrier() {
      this.wareTransportForm.bseWarehouseCarriers.push({
        providerId: null,
        bseOverseaCarrierId: "",
        bseOverseaCarrierName: ""
      })
      this.overseaCarrierOption.push([])
    },
    // 移除指定的 平台物流映射
    removeWarehouseCarrier(index) {
      this.wareTransportForm.bseWarehouseCarriers.splice(index, 1)
      this.overseaCarrierOption.splice(index, 1)
    },

    async setWareTransport() {
      console.log(this.transportCarrierId)
      console.log(this.wareTransportForm.bseWarehouseCarriers)
      let res = await saveOverseaMsg({
        transportCarrierId: this.transportCarrierId,
        bseOverSeaCarrierDtos: this.wareTransportForm.bseWarehouseCarriers
      })
      if (res.data.code === 0) {
        this.$message.success("操作成功")
        this.setWareTransportDialog = false
        this.refreshChange()
      } else {
        this.$message.error(res.data.msg)
      }
      console.log(res)
    },
    async showDetail(row) {
      const id = row.transportCarrierId
      console.log(id)
      this.$router.push({
        path: `/baseSetup/bsetransportcarrier/detail/${id ? id : ""}`
      })
      // console.log(row.transportCarrierId)
      // let res = await getDetail({ id: row.transportCarrierId })
      // console.log(res.data.data)
    },
    //dialog样式修改后添加
    dialogResult(dialogFlage) {
      if (dialogFlage) {
        this.auditType = 1
      } else {
        this.auditType = 2
      }
      this.handleAuditSave()
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
    //已审核数据
    getPSkuByApproveStatusOk() {
      let exists = []
      var data = this.selectRows.filter((obj) => {
        if (obj.approveStatus == 2) {
          exists.push(obj.carrierName)
          return obj
        }
      })
      return exists
    },
    //已禁用数据
    getPSkuByDelFlagFall() {
      let exists = []
      var data = this.selectRows.filter((obj) => {
        if (obj.delFlag == 1) {
          exists.push(obj.carrierName)
          return obj
        }
      })
      return exists
    },
    /** 打开新增窗口**/
    handleAdd: function () {
      this.handleAddOrUpdateTile = "新增"
      this.addOrUpdateDialog = true
    },
    handleEdit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("请选择一条数据进行修改")
        return
      }

      //是否已审核
      // let exists = this.getPSkuByApproveStatusOk();
      // if(exists && exists.length > 0){
      //   this.$message.warning('物流商:'+exists + '，已审核过，不能修改');
      //   return;
      // }

      // 获取已禁用平台sku
      let exists = this.getPSkuByDelFlagFall()
      if (exists && exists.length > 0) {
        this.$message.warning("物流商:" + exists + "，已禁用，不能修改")
        return
      }

      let row = this.selectRows[0]
      this.addOrUpdateForm = {
        transportCarrierCode: row.transportCarrierCode,
        transportCarrierId: row.transportCarrierId,
        carrierName: row.carrierName,
        carrierShortName: row.carrierShortName,
        contactName: row.contactName,
        contactNo: row.contactNo,
        serviceScope: row.serviceScope
      }
      this.handleAddOrUpdateTile = "修改"
      this.addOrUpdateDialog = true
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
                  console.log("gag")
                  _this.$message.error("操作失败")
                  return
                })
            }
          })
        }
      })
    },
    inputBlur() {
      if (!this.addOrUpdateDialog) {
        this.formReset()
      }
    },
    formReset() {
      this.$nextTick(function () {
        this.$refs["addOrUpdateForm"].resetFields()
        this.addOrUpdateForm = {
          transportCarrierId: null,
          carrierName: null,
          carrierShortName: null,
          contactName: null,
          contactNo: null
        }
      })
    },
    /**审核 */
    handleAudit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      //是否已审核
      let exists = this.getPSkuByApproveStatusOk()
      if (exists && exists.length > 0) {
        this.$message.warning("物流商:" + exists + "，已审核过，不能重新审核")
        return
      }

      // 获取已禁用
      exists = this.getPSkuByDelFlagFall()
      if (exists && exists.length > 0) {
        this.$message.warning("物流商:" + exists + "，已禁用，不能审核")
        return
      }
      // this.auditDialog = true;
      this.auditType = "1"
      this.auditTextarea = ""

      //直接审核
      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.transportCarrierId)
      })
      var _this = this
      var obj = {
        transportCarrierIds: ids,
        confirmType: this.auditType,
        message: this.auditTextarea
      }
      preventShake.preventShake((bool) => {
        if (bool) {
          handleAudit(obj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("审核成功")
                _this.clearSelectClear()
                _this.refreshChange()
                _this.auditDialog = false
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
    },
    handleAuditSave() {
      if (this.auditType == "2" && !this.auditTextarea && this.auditTextarea.trim() == "") {
        this.$message.warning("请填写拒绝原因")
        return
      }
      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.transportCarrierId)
      })
      var _this = this
      var obj = {
        transportCarrierIds: ids,
        confirmType: this.auditType,
        message: this.auditTextarea
      }
      preventShake.preventShake((bool) => {
        if (bool) {
          handleAudit(obj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("审核成功")
                _this.clearSelectClear()
                _this.refreshChange()
                _this.auditDialog = false
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
    },
    /**启用 禁用 */
    handleEnable(state) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }

      var ids = []
      var numberList = []
      this.selectRows.forEach((item) => {
        ids.push(item.transportCarrierId)
        if (state == item.delFlag) {
          numberList.push(item.carrierName)
        }
      })
      const msg = state === 0 ? "启用" : "禁用"
      if (numberList.length > 0) {
        this.$message.warning("物流商名称:" + numberList + "已" + msg + ",无须重复" + msg)
        return
      }

      const saveObj = {
        transportCarrierIds: ids,
        stateModify: state
      }
      if (state == 1) {
        this.$confirm("确认关闭该物流商!关闭后此数据将不可使用!", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.saveStateModify(saveObj, msg)
          })
          .catch(() => {})
      } else {
        this.saveStateModify(saveObj, msg)
      }
    },
    saveStateModify(saveObj, msg) {
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
    /**导出 */
    handleExport() {
      // let par='';
      //   Object.keys(this.searchForm).forEach(key=>{
      //     if(this.searchForm[key]){
      //         par+='&'+key+'='+this.searchForm[key];
      //   }
      // })

      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.transportCarrierId)
        })
        par += "&transportCarrierIds=" + keys.join(",")
      } else {
        Object.keys(this.searchFormConfirm).forEach((key) => {
          if (this.searchFormConfirm[key]) {
            par += "&" + key + "=" + this.searchFormConfirm[key]
          }
        })
      }
      this.$notify({
        title: "成功",
        message: "正在导出（注意：最多可导出6W条数据）",
        type: "success",
        duration: 2000
      })
      window.location = getUrlConcatToken(`/api/baseSetup/bsetransportcarrier/handleExport`) + par
    },
    showOperateLog(id) {
      this.$refs.operationlog.showOperateLogDialog(id, 3)
    }
  }
}
</script>

<style lang="scss">
#bsetransportcarrier {
  .add_dialog .el-form-item__label {
    width: 124px;
  }
}
</style>
