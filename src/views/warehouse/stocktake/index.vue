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
  <div class="execution" id="stocktake">
    <basic-container>
      <avue-crud
        class="handle-cell-hidden"
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @selection-change="selectionChange"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
      >
        <template slot="menuLeft">
          <el-button type="primary" v-if="permissions.stock_take_create" @click="createStockTake" size="small"
            >新 增</el-button
          >
          <el-dropdown-button
            v-if="permissions.stock_take_export"
            type="primary"
            size="small"
            buttonText="导出"
            command="导出"
            @command="handleCommand"
          >
            <el-dropdown-item command="列表导出">列表导出</el-dropdown-item>
            <el-dropdown-item command="明细导出">明细导出</el-dropdown-item>
          </el-dropdown-button>
          <el-button
            style="margin-left: 10px"
            v-if="permissions.stock_take_del"
            type="primary"
            @click="deleRow"
            size="small"
            >删除</el-button
          >
          <el-button type="primary" v-if="permissions.stock_take_approve" @click="confrim" size="small">审核</el-button>
          <el-button type="primary" v-if="permissions.stock_take_create_order" @click="corporationShow" size="small"
            >生成单据</el-button
          >
        </template>
        <template slot="createdRelationNo" slot-scope="scope">
          <p v-if="scope.row.createdRelationNo === 0" style="padding: 0 12px" type="text">未生成</p>
          <el-button
            v-if="scope.row.createdRelationNo === 2"
            type="text"
            @click="showRelationNo(scope.row.stockTakeNo, scope.row.$index)"
            >部分生成</el-button
          >
          <el-button
            v-if="scope.row.createdRelationNo === 1"
            type="text"
            @click="showRelationNo(scope.row.stockTakeNo, scope.row.$index)"
            >已生成</el-button
          >
        </template>
        <!-- 操作日志 -->
        <template slot="operateLog" slot-scope="scope">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.stockTakeNo)"></i>
        </template>
        <template slot="stockTakeNo" slot-scope="scope">
          <copy-text hoverToShow>
            <a
              :title="scope.row.stockTakeNo"
              class="el-row-text"
              @click="showDetail(scope.row.stockTakeNo, detailSearchForm)"
              >{{ scope.row.stockTakeNo }}</a
            >
          </copy-text>
        </template>
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="stockTakeNo">
              <el-input
                clearable
                v-model="searchForm.stockTakeNo"
                size="small"
                placeholder="盘点单号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item class="form-label" prop="searchDate">
              <el-date-picker
                size="small"
                v-model="searchForm.searchDate"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>

            <el-form-item prop="dataStatus">
              <el-select
                v-model="searchForm.dataStatus"
                size="small"
                multiple
                collapse-tags
                filterable
                clearable
                placeholder="状态"
              >
                <el-option
                  v-for="item in dataStatusOptions"
                  :key="item.dataStatus"
                  :label="item.statusDescribe"
                  :value="item.dataStatus"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="warehouseId">
              <el-select
                v-model="searchForm.warehouseId"
                size="small"
                multiple
                collapse-tags
                filterable
                clearable
                placeholder="仓库"
              >
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="orderNo">
              <el-input
                clearable
                v-model="searchForm.orderNo"
                size="small"
                placeholder="关联单据号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="createdRelationNo">
              <el-select
                v-model="searchForm.createdRelationNo"
                size="small"
                multiple
                collapse-tags
                filterable
                clearable
                placeholder="关联单据"
              >
                <el-option
                  v-for="item in createdRelationNoOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>
      </avue-crud>
    </basic-container>

    <el-dialog title="新增" :visible.sync="createStockTakeDialog" width="600px">
      <el-alert
        title="1.必须按照导出模板导入； 2.导入sku必须在系统存在； 3.仅支持静态盘点；"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <ul class="stock-add pull-overflow">
        <li class="stock-add-down">
          <el-upload
            class="upload-demo"
            action
            list-type="text"
            accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :on-preview="handlePreview"
            :before-upload="onBeforeUploadExcel"
            :http-request="uploadFile"
            :on-change="fileChange"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-remove="removeFile"
          >
            <el-button size="small" type="primary">上传数据</el-button>
          </el-upload>
        </li>
        <li>
          <el-button type="dufault" size="small" @click="downLoadExcel">模板下载</el-button>
        </li>
        <!-- <li class="pull-flex">

          <p>注意事项:</p>
          <div style="margin-left:5px;">
            <p>1.必须按照导出模板导入；</p>
            <p>2.导入sku必须在系统存在；</p>
            <p>3.仅支持静态盘点；</p>
          </div>
        </li> -->
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="createStockTakeDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="comfrimCreateStockTake">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关联单据" width="30%" :visible.sync="relationTableVisible">
      <!-- <el-table style="width:100%;" :data="relationTableData">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column property="orderNo" label="单据编号"></el-table-column>
        <el-table-column property="type" label="单据类型"></el-table-column>
      </el-table>-->
      <avue-crud :data="relationTableData" :option="relationOption"></avue-crud>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="relationTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="`盘点明细 (${detialStockTakeNo})`" :visible.sync="detailTableVisible">
      <el-form @submit.prevent.native :model="detailSearchForm" :inline="true" ref="detailSearchForm">
        <el-form-item label="是否有库存差异" prop="type">
          <el-select v-model="detailSearchForm.type" size="small" placeholder="请选择" style="width: 100px">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
          &nbsp;
          <el-button type="primary" size="small" @click="showDetail(detialStockTakeNo, detailSearchForm)"
            >搜 索</el-button
          >
          <el-button size="small">清 空</el-button>
        </el-form-item>
      </el-form>
      <avue-crud :data="detailTableData" :option="detailOption">
        <!-- <template slot-scope="scope" slot="menuLeft">
        </template> -->
        <template slot-scope="scope">
          <span :title="scope.row.remark" class="el-row-text">{{ scope.row.remark }}</span>
        </template>
      </avue-crud>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="goToReviewed">提交审核</el-button>
        <el-button size="small" @click="detailTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="生成单据" width="77%" :visible.sync="corporationVisible" :show-close="false">
      <!-- <div style="display: flex; align-items:center;">
        <div style="flex-shrink: 0; margin-right:10px;"><span style="color: red;">*</span><span>法人主体</span></div>
        <el-select v-model="corporationId" clearable placeholder="请选择">
          <el-option v-for="item in corporationOptions" :key="item.corporationId" :label="item.corporationName"
            :value="item.corporationId"></el-option>
        </el-select>
      </div> -->
      <el-table :data="corporationData">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="SKU" prop="skuCode"></el-table-column>
        <el-table-column label="产品名称" prop="skuName"></el-table-column>
        <el-table-column label="仓库" prop="warehouseName"></el-table-column>
        <el-table-column label="库位" prop="locationCode"></el-table-column>
        <el-table-column label="法人主体" prop="corporationName"></el-table-column>
        <el-table-column label="系统库存" prop="staticQuantity"></el-table-column>
        <el-table-column label="盘点库存" prop="stockTakeQuantity"></el-table-column>
        <el-table-column label="差异库存" prop="differenceQuantity"></el-table-column>
        <el-table-column label="仓库备注" prop="remark"></el-table-column>
        <el-table-column label="平台" prop="platform">
          <template slot-scope="scope">
            <el-select v-model="scope.row.platform" size="mini" @change="changePlatform(scope.row)">
              <el-option v-for="(item, index) in plaTypeOption" :key="index" :value="item.platformTypeCode">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="站点" prop="site">
          <template slot-scope="{ row }">
            <el-select v-model="row.site" size="mini" @change="changeSite(row)">
              <el-option
                v-for="item in sitCountryOptions[row.skuCode]"
                :key="item.bsePlatformSitId"
                :value="item.sitEnName"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="可用库存" prop="availableQuantity"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="corporationCancel">取 消</el-button>
        <el-button size="small" type="primary" @click="createOrder">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 操作日志 -->
    <pooperatelog ref="pooperatelog"></pooperatelog>
  </div>
</template>

<script>
import pooperatelog from "@/views/warehouse/wmsoperatelog"
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  createStockTake,
  confrim,
  createOrder,
  showRelationNo,
  showDetail,
  delRows,
  toBeReviewed
} from "@/api/warehouse/stocktake/wmsstocktake"
import { tableOption, detailOption, relationOption } from "@/const/crud/warehouse/stocktake/wmsstocktake"
import { getAll as getCorporationList } from "@/api/baseSetup/bsecorporation"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getStatusByFuncName } from "@/api/baseSetup/bsestatusorderrecord"
import { getTokenUrl, getToken } from "@/util/auth"
import { getUrlConcatToken } from "@/util/auth"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { fetchList as getProductAll } from "@/api/warehouse/wmsstock"
export default {
  name: "wmsstocktake",
  components: {
    pooperatelog
  },
  data() {
    return {
      // loading: false,
      relationOption: relationOption,
      detailOption: detailOption,
      showRelationNoLoading: false,
      detialStockTakeNo: "",
      detailTableData: [],
      relationTableData: [],
      detailTableVisible: false,
      relationTableVisible: false,
      selectRows: [],
      fileList: [],
      createStockTakeDialog: false,
      currentIndex: "",
      createdRelationNoOptions: [
        {
          name: "未生成",
          value: 0
        },
        {
          name: "已生成",
          value: 1
        },
        {
          name: "部分生成",
          value: 2
        }
      ],
      warehouseOptions: [],
      dataStatusOptions: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        stockTakeNo: "",
        searchDate: [],
        dataStatus: [],
        warehouseId: "",
        orderNo: "",
        createdRelationNo: []
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      corporationVisible: false,
      corporationId: "",
      corporationOptions: [],
      detailSearchForm: {
        type: "1"
      },
      corporationData: [],
      plaTypeOption: [],
      sitCountryOptions: []
    }
  },
  created() {
    this.getAllWarehouse()
    this.getStatusByFuncName()
    this.getCorporation()
    this.initInfo()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    initInfo() {
      getPlaTypeAll().then((res) => {
        this.plaTypeOption = res.data.data
      })
    },
    //根据平台查询站点
    getPlatformSit(id, row) {
      let param = {
        platformTypeId: id
      }
      getSitInfoByPlatformId(param).then((res) => {
        row.sitCountryOptions = res.data.data
      })
    },
    //选中平台-获取平台下的所有站点
    async changePlatform(row) {
      console.log(123, row)
      const obj = this.plaTypeOption.find((o) => o.platformTypeCode === row.platform)
      const id = obj ? obj.platformTypeId : undefined
      // row.sitCountryOptions = []
      //清空站点值
      let res = await getSitInfoByPlatformId({ platformTypeId: id })
      this.$set(this.sitCountryOptions, row.skuCode, res.data.data)
      // this.sitCountryOptions = [...res.data.data]

      // row.sitCountryOptions = res.data.data
      //  .then(res => {
      //     row.sitCountryOptions = res.data.data
      //   })
      // row.sitCountryOptions = []
      // this.getPlatformSit(id, row)
    },
    //选中站点-请求对应的库存
    changeSite(row) {
      console.log("row", row)
      this.corporationData.forEach((item) => {
        console.log("item", item)
        if (item.platform && item.site) {
          getProductAll({
            skuCode: item.skuCode,
            corporationId: item.corporationId,
            warehouseId: item.warehouseId,
            platform: item.platform,
            site: item.site
          })
            .then((response) => {
              if (response.data.code === 0) {
                let data = response.data.data.records.filter((product) => product.skuCode === item.skuCode)
                // this.$set(item, "availableQuantity", data[0].availableQuantity)
                item.availableQuantity = data[0].availableQuantity
                item.skuId = data[0].skuId
                item.poPrice = data[0].poPrice
                item.taxPrice = data[0].taxPrice
                item.stockLocationId = data[0].stockLocationId
                item.taxType = data[0].taxType
              } else {
                // this.$message.error(response.data.msg)
                console.log(123)
                item.availableQuantity = 0
                // this.$set(item, "availableQuantity", 0)
              }
            })
            .catch((err) => {
              item.availableQuantity = 0
              console.log(err)
            })
        }
      })
    },
    /**
     * 查法人
     */
    getCorporation() {
      //1为非税
      var obj = {
        taxQualification: [1]
      }
      getCorporationList(obj).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.corporationOptions = data
          this.corporationOptions.forEach((item) => {
            if (item.corporationName == "甜秘密创新有限公司") {
              this.otherInStock.corporationId = item.corporationId
            }
          })
        }
      })
    },

    goToReviewed() {
      toBeReviewed(this.detailTableData).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.detailTableVisible = false
          this.getList(this.page)
        } else {
          this.$message.error(res.data.msg)
          this.detailTableVisible = false
        }
      })
    },
    //删除图片
    removeFile(file, fileLis) {
      this.fileList = fileLis
    },
    /**
     * 查看操作日志
     */
    showOperateLog: function (orderNo) {
      this.$refs.pooperatelog.showOperateLogDialog(orderNo, 3)
    },
    //拉下选择
    handleCommand(command) {
      if (command == "列表导出") {
        this.exportExcel("main")
      } else if (command == "明细导出") {
        this.exportExcel("detail")
      }
    },
    exportExcel(type) {
      if (!this.tableData || this.tableData.length == 0) {
        this.$message.error("没有可导出数据")
        return
      }
      var param = "&type=" + type
      if (this.selectRows && this.selectRows.length > 0) {
        this.selectRows.forEach((item) => {
          param = param + "&selectNo=" + item.stockTakeNo
        })
      }
      if (this.searchFormConfirm.stockTakeNo) {
        param = param + "&stockTakeNo=" + this.searchFormConfirm.stockTakeNo
      }
      if (this.searchFormConfirm.searchDate) {
        this.searchFormConfirm.searchDate.forEach((item) => {
          param = param + "&searchDate=" + item
        })
      }
      if (this.searchFormConfirm.dataStatus) {
        this.searchFormConfirm.dataStatus.forEach((item) => {
          param = param + "&dataStatus=" + item
        })
      }
      if (this.searchFormConfirm.warehouseId) {
        this.searchFormConfirm.warehouseId.forEach((item) => {
          param = param + "&warehouseId=" + item
        })
      }
      if (this.searchFormConfirm.orderNo) {
        param = param + "&orderNo=" + this.searchFormConfirm.orderNo
      }
      if (this.searchFormConfirm.createdRelationNo) {
        this.searchFormConfirm.createdRelationNo.forEach((item) => {
          param = param + "&createdRelationNo=" + item
        })
      }
      window.location = getUrlConcatToken("/api/warehouse/wmsstocktake/exportExcel") + param
    },
    //下载模板
    downLoadExcel() {
      location.href = window.location.origin + "/api/warehouse/wmsstocktake/downLoadExcel?access_token=" + getToken()
    },
    //删除盘点单
    deleRow() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      for (let index = 0; index < this.selectRows.length; index++) {
        const element = this.selectRows[index]
        if (element.statusDescribe != "待审核") {
          this.$message.warning("只能删除[待审核]数据")
          return
        }
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRows(this.selectRows).then((response) => {
            //this.tableData.splice(this.selectList[0].$index, 1, Object.assign({}, selectRow))
            if (response.data.code == 0) {
              this.getList(this.page)
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              })
              // 手动调用清除选择
              this.$refs.crud.selectClear()
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("删除失败")
              return
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    //显示明细
    showDetail(stockTakeNo, type) {
      this.detialStockTakeNo = stockTakeNo
      showDetail(stockTakeNo).then((response) => {
        this.detailTableData = []
        if (response.data.code == 0) {
          let datas = []
          console.log("type", type.type)
          if (type.type == 1) {
            datas = response.data.data.filter((data) => data.differenceQuantity != 0)
          } else if (type.type == 0) {
            datas = response.data.data.filter((data) => data.differenceQuantity == 0)
          }
          console.log(datas)
          this.detailTableData = datas
          // datas.forEach(item => {
          //   var data = {
          //     platformSkuCode: item.platformSkuCode,
          //     stockTakeNo: item.stockTakeNo,
          //     skuCode: item.skuCode,
          //     locationCode: item.locationCode,
          //     platformTypeCode: item.platformTypeCode,
          //     stockTakeQuantity: item.stockTakeQuantity,
          //     staticQuantity: item.staticQuantity,
          //     differenceQuantity: item.differenceQuantity,
          //     groupName: item.groupName,
          //     remark: item.remark
          //   }
          //   this.detailTableData.push(data)
          // }
          // )
          this.detailTableVisible = true
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("查询失败")
          return
        }
      })
    },
    //显示生成单据
    showRelationNo(stockTakeNo, envIndex) {
      this.showRelationNoLoading = true
      this.currentIndex = envIndex
      this.relationTableData = []
      showRelationNo(stockTakeNo)
        .then((response) => {
          if (response.data.code == 0) {
            response.data.data.forEach((item) => {
              var data = {
                orderNo: item.orderNo,
                type: item.type == 0 ? "其他出库" : "其他入库"
              }
              this.relationTableData.push(data)
            })
            this.relationTableVisible = true
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
            return
          } else {
            this.$message.error("查询失败")
            return
          }
        })
        .finally(() => {
          this.showRelationNoLoading = false
        })
    },
    corporationCancel() {
      this.corporationId = ""
      this.corporationVisible = false
    },
    corporationShow() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("只能勾选1条数据")
        return
      }

      console.log(this.selectRows[0].stockTakeNo)
      showDetail(this.selectRows[0].stockTakeNo).then((res) => {
        console.log("res", res)
        res.data.data.forEach((item) => {
          item.availableQuantity = 0
        })
        this.corporationData = res.data.data

        // let params = {
        //   skuCode: "SN-M006-F"
        // }
        // getProductAll(params).then(response => {
        //   if (response.data.code === 0) {
        //     let data = response.data.data.records.filter(item => item.skuCode === params.skuCode)
        //     this.corporationData[0].availableQuantity = data[0].availableQuantity
        //   } else {
        //     this.$message.error(response.data.msg)
        //   }
        // })
        console.log(this.corporationData)
      })
      this.corporationVisible = true
    },
    //生成单据
    createOrder() {
      // this.loading = true;corporationData
      let flag = true
      this.corporationData.forEach((item) => {
        if (!item.platForm && !item.site) {
          this.$message.warning("请选择平台站点")
          return (flag = false)
        }
      })
      if (!flag) {
        return
      }
      // if (!this.corporationData[0].platForm && !this.corporationData[0].site) {
      //   this.$message.warning('请选择平台站点')
      //   return
      // }
      createOrder(this.corporationData)
        .then((response) => {
          if (response.data.code == 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
              duration: 2000
            })
            // 手动调用清除选择
            this.corporationVisible = false
            this.$refs.crud.selectClear()
            this.getList(this.page)
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
            return
          } else {
            this.$message.error("操作失败")
            return
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    //选中数据
    selectionChange(tableData) {
      this.selectRows = tableData
    },
    //审核
    confrim() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      //
      this.$confirm("审核后无法撤销, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.loading = true;
          confrim(this.selectRows).then((response) => {
            if (response.data.code == 0) {
              this.$notify({
                title: "成功",
                message: "审核成功",
                type: "success",
                duration: 2000
              })
              // 手动调用清除选择
              this.$refs.crud.selectClear()
              this.getList(this.page)
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("审核失败")
              return
            }
          })
          // .finally(() => {
          //   this.loading = false;
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          })
        })

      //
    },
    fileChange(file, fileList) {
      //  let existFile = fileList
      //     .slice(0, fileList.length - 1)
      //     .find(f => f.name === file.name);
      //   if (existFile) {
      //     this.$message.error("当前文件已经存在!");
      //     fileList.pop();
      //   }
      this.fileList = fileList
    },
    comfrimCreateStockTake() {
      if (!this.fileList || this.fileList.length != 1) {
        this.$message.error("请先上传文件")
        return
      }
      var formData = new FormData()
      this.fileList.forEach((file) => {
        formData.append("createStockTakeFile", file.raw)
      })
      // this.loading = true;
      createStockTake(formData).then((response) => {
        if (response.data.code == 0) {
          this.$notify({
            title: "成功",
            message: "新增成功",
            type: "success",
            duration: 2000
          })
          // 手动调用清除选择
          this.$refs.crud.selectClear()
          this.getList(this.page)
          this.createStockTakeDialog = false
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("新增失败")
          return
        }
      })
      // .finally(() => {
      //   this.loading = false;
      // });
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制只能上传 1 个文件`)
    },
    uploadFile() {},
    onBeforeUploadExcel(file) {
      if (file.name.indexOf(",") != -1 || file.name.indexOf("[") != -1 || file.name.indexOf("]") != -1) {
        this.$message.error("文件名包含敏感字符,请修改后重新上传")
        return false
      }
      if (file.name.length > 40) {
        this.$message.error("文件名长度超出40个字符，请重新命名后上传")
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      // if (
      //   !(
      //     file.type == "image/jpeg" ||
      //     file.type == "image/jpg" ||
      //     file.type == "image/png"
      //   )
      // ) {
      //   this.$message.error("上传文件只能是图片格式!");
      //   return false;
      // }
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!")
        return false
      }
    },
    handlePreview(file) {
      this.createStockTakeDialog = true
    },
    createStockTake() {
      this.fileList = []
      this.createStockTakeDialog = true
    },
    /**
     * 查询仓库
     */
    getAllWarehouse() {
      var query = {
        funcState: "1",
        delFlag: "0",
        isFba: false
      }
      getAllWarehouse(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.warehouseOptions = data
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
          }
        }
      })
    },
    /**
     * 查状态
     */
    getStatusByFuncName() {
      var query = {
        funcName: "stock_take_v1"
      }
      getStatusByFuncName(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.dataStatusOptions = data
        }
      })
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }
      this.tableLoading = true
      this.page.currentPage = page.currentPage
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
        this.tableLoading = false
      })
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      this.$refs.crud.rowAdd()
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.stockTakeNo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.stockTakeNo)
        })
        .then((data) => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          })
          this.getList(this.page)
        })
        .catch(function (err) {})
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done) {
      putObj(row).then((data) => {
        this.tableData.splice(index, 1, Object.assign({}, row))
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        })
        done()
        this.getList(this.page)
      })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done) {
      addObj(row).then((data) => {
        this.tableData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
        done()
        this.getList(this.page)
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
#stocktake {
  .stock-add {
    position: relative;
    margin-top: 20px;
  }

  .stock-add-down {
    margin-bottom: 15px;
    justify-content: space-between;
  }
}
</style>
