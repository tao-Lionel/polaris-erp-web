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
  <div class="execution podeliveryplan-create">
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
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
        @row-click="rowClick"
      >
        <template slot-scope="scope" slot="search">
          <el-form :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="requisitionNo">
              <el-input
                v-model.trim="searchForm.requisitionNo"
                size="small"
                placeholder="请输入请购单号搜索"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input
                v-model.trim="searchForm.skuCode"
                size="small"
                placeholder="请输入SKU搜索"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchaseUserName">
              <el-input
                v-model.trim="searchForm.purchaseUserName"
                size="small"
                placeholder="请输入采购员搜索"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="requisitionUserName">
              <el-input
                v-model.trim="searchForm.requisitionUserName"
                size="small"
                placeholder="请输入销售员搜索"
                v-search-input
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model.trim="searchForm.purchaseOrderNo"
                size="small"
                placeholder=" 请输入采购单号搜索"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="poContractNo">
              <el-input
                v-model.trim="searchForm.poContractNo"
                size="small"
                placeholder="请输入合同编号搜索"
                v-search-input
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>
      <!--制作交货计划-->
      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        title="制作交货计划"
        :visible.sync="createDeliveryPlanDialog"
      >
        <avue-crud :data="rowDeliveryPlanData" :option="rowDeliveryPlanOption">
          <template slot="platformSkuCode" slot-scope="scope">
            <el-select
              size="small"
              v-model.trim="scope.row.platformSkuCode"
              filterable
              remote
              :remote-method="getPlatformSku"
              @change="platformSkuChange(scope.row)"
              :disabled="scope.row.purchaseConfirmStatus == 1 || scope.row.purchaseConfirmStatus == 2"
            >
              <el-option
                v-for="item in bsePlatformSkuList"
                :key="item.bsePlatformSkuId"
                :label="item.platformSkuCode"
                :value="item.bsePlatformSkuId"
              >
              </el-option>
            </el-select>
            <!-- <el-input v-model.trim="scope.row.platformSkuCode" size="small"></el-input> -->
          </template>
          <!-- <template slot="sitName" slot-scope="scope">
              <el-select
                  size="small"
                  v-model.trim="scope.row.sitName"
                  filterable
                  remote
                  :remote-method="(value)=>getPlatformSit(value,scope.row)"
                  @change="platformSitChange(scope.row)"
                  :disabled="scope.row.purchaseConfirmStatus==1 || scope.row.purchaseConfirmStatus==2">
                  <el-option
                    v-for="item in platformSitList"
                    :key="item.bsePlatformSitId"
                    :label="item.sitName"
                    :value="item.bsePlatformSitId">
                  </el-option>
              </el-select>        
             </template> -->
          <!-- <template slot="platformAccountName" slot-scope="scope">
              <el-select
                  size="small"
                  v-model.trim="scope.row.platformAccountName"
                  filterable
                  remote
                  :remote-method="(value)=>getPlatformAccount(value,scope.row)"
                  @change="platformAccountChange(scope.row)"
                  :disabled="scope.row.purchaseConfirmStatus==1 || scope.row.purchaseConfirmStatus==2">
                  <el-option
                    v-for="item in platformAccountList"
                    :key="item.platformAccountId"
                    :label="item.name"
                    :value="item.platformAccountId">
                  </el-option>
              </el-select>
             </template> -->
          <template slot="expectDeliveryQuantity" slot-scope="scope">
            <el-input
              v-model.trim="scope.row.expectDeliveryQuantity"
              size="small"
              maxlength="8"
              :disabled="scope.row.purchaseConfirmStatus == 1 || scope.row.purchaseConfirmStatus == 2"
            ></el-input>
          </template>
          <template slot="expectDeliveryDate" slot-scope="scope">
            <el-date-picker
              size="small"
              style="width: 100%"
              v-model="scope.row.expectDeliveryDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              :disabled="scope.row.purchaseConfirmStatus == 1 || scope.row.purchaseConfirmStatus == 2"
            >
            </el-date-picker>
            <!-- <el-input v-model.trim="scope.row.expectDeliveryDate" size="small"></el-input> -->
          </template>
          <template slot="operate" slot-scope="scope">
            <div style="text-align: right">
              <a
                href="javascript:void(0)"
                class="plan-opra"
                v-if="scope.row.$index === rowDeliveryPlanData.length - 1 && permissions.purchase_podeliveryplan_add"
                @click="addRow"
                >新增</a
              >
              <a
                href="javascript:void(0)"
                class="plan-opra"
                @click="saveRow(scope.row, scope.row.$index)"
                v-if="permissions.purchase_podeliveryplan_save"
                :disabled="scope.row.purchaseConfirmStatus == 1 || scope.row.purchaseConfirmStatus == 2"
                >保存</a
              >
              <a
                href="javascript:void(0)"
                class="plan-opra"
                @click="submitRow(scope.row, scope.row.$index)"
                v-if="permissions.purchase_podeliveryplan_submit"
                :disabled="scope.row.purchaseConfirmStatus == 1 || scope.row.purchaseConfirmStatus == 2"
                >提交</a
              >
              <a
                href="javascript:void(0)"
                class="plan-opra"
                @click="deleteRow(scope.row, scope.row.$index)"
                v-if="permissions.purchase_podeliveryplan_delete"
                :disabled="scope.row.purchaseConfirmStatus == 1 || scope.row.purchaseConfirmStatus == 2"
                >删除</a
              >
              <!-- <el-button type="text" v-if="scope.row.$index===rowDeliveryPlanData.length-1 && permissions.purchase_podeliveryplan_add" @click="addRow"></el-button>
                <el-button type="text"  @click="saveRow(scope.row,scope.row.$index)" v-if="permissions.purchase_podeliveryplan_save" :disabled="scope.row.purchaseConfirmStatus==1 || scope.row.purchaseConfirmStatus==2">保存</el-button>
                <el-button type="text"  @click="submitRow(scope.row,scope.row.$index)" v-if="permissions.purchase_podeliveryplan_submit" :disabled="scope.row.purchaseConfirmStatus==1 || scope.row.purchaseConfirmStatus==2">提交</el-button>
                <el-button type="text"  @click="deleteRow(scope.row,scope.row.$index)" v-if="permissions.purchase_podeliveryplan_delete" :disabled="scope.row.purchaseConfirmStatus==1 || scope.row.purchaseConfirmStatus==2">删除</el-button> -->
            </div>
          </template>
        </avue-crud>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  getCreateDeliveryPlanPage,
  getDeliveryPlanInfo,
  savePoDeliveryPlan,
  submitPoDeliveryPlan,
  deletePoDeliveryPlan
} from "@/api/purchase/podeliveryplan"
import { createDeliveryPlanOption, rowDeliveryPlanOption } from "@/const/crud/purchase/podeliveryplan"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getAll } from "@/api/baseSetup/bseplatformsit"
import { getPlatformSkuBySkuId } from "@/api/baseSetup/bseplatformsku"
import { getStoreBySkuId } from "@/api/baseSetup/bsestore"
export default {
  name: "podeliveryplan",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        requisitionNo: "",
        skuCode: "",
        purchaseOrderNo: "",
        poContractNo: "",
        requisitionUserName: "",
        purchaseUserName: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [{}],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      tableOption: createDeliveryPlanOption,
      createDeliveryPlanDialog: false,
      rowDeliveryPlanData: [{}],
      rowDeliveryPlanOption: rowDeliveryPlanOption,
      bsePlatformSkuList: [],
      platformSitList: [],
      platformAccountList: [],
      selectRequisitionNo: "",
      selectSkuId: "",

      pickerOptions: {
        disabledDate(time) {
          var date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          return time.getTime() < date
        }
      }
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    addRow() {
      if (this.rowDeliveryPlanData && this.rowDeliveryPlanData.length >= 200) {
        this.$message.error("行数不能超过200行，请知悉")
        return
      }
      this.rowDeliveryPlanData.push({})
    },
    platformSkuChange(row) {
      row.bsePlatformSkuId = row.platformSkuCode
      for (var i = 0; i < this.bsePlatformSkuList.length; i++) {
        var bsePlatformSkuId = this.bsePlatformSkuList[i].bsePlatformSkuId
        if (row.bsePlatformSkuId == bsePlatformSkuId) {
          this.$set(row, "platformAccountName", this.bsePlatformSkuList[i].storeAccount)
          this.$set(row, "platformAccountId", this.bsePlatformSkuList[i].storeId)
          this.$set(row, "sitName", this.bsePlatformSkuList[i].sitName)
          this.$set(row, "bsePlatformSitId", this.bsePlatformSkuList[i].bsePlatformSitId)
        }
      }
    },
    getPlatformSku(query) {
      if (!query) {
        return
      }
      getPlatformSkuBySkuId({ skuId: this.selectSkuId, name: query.trim(), isHideLoading: true }).then(({ data }) => {
        if (data.code == 0) {
          this.bsePlatformSkuList = []
          for (var i = 0; i < data.data.length; i++) {
            this.bsePlatformSkuList.push({
              bsePlatformSkuId: data.data[i].bsePlatformSkuId,
              platformSkuCode:
                data.data[i].platformSkuCode +
                "(" +
                data.data[i].platformTypeCode +
                "," +
                data.data[i].sitName +
                ",店铺:" +
                data.data[i].storeAccount +
                ")",
              storeAccount: data.data[i].storeAccount,
              storeId: data.data[i].storeId,
              sitName: data.data[i].sitName,
              bsePlatformSitId: data.data[i].bsePlatformSitId
            })
          }
        } else {
          this.$message.error("查询平台SKU失败")
        }
      })
      // this.bsePlatformSkuList=[{
      //   bsePlatformSkuId:3,
      //   platformSkuCode:'ffsd'
      // },{
      //   bsePlatformSkuId:4,
      //   platformSkuCode:'ffsd2'
      // }];
    },
    // platformSitChange(row){
    //   row.bsePlatformSitId=row.sitName;
    // },
    // getPlatformSit(query,row){
    //   if(!query){
    //     return;
    //   }
    //   var bsePlatformSkuId = row.bsePlatformSkuId;
    //   if(!bsePlatformSkuId){
    //     this.$message.error("请先选择平台SKU");
    //     this.platformSitList=[];
    //     return;
    //   }
    //   getAll({name:query.trim(),bsePlatformSkuId:bsePlatformSkuId,isHideLoading:true}).then(({data})=>{
    //     if(data.code==0){
    //       this.platformSitList = data.data;
    //     }else{
    //       this.$message.error("查询站点失败");
    //     }
    //   });
    //   // this.platformSitList = [{
    //   //   bsePlatformSitId:1,
    //   //   sitName:'111'
    //   // }]
    // },
    // platformAccountChange(row){
    //   row.platformAccountId=row.platformAccountName;
    // },
    // getPlatformAccount(query,row){
    //   if(!query){
    //     return;
    //   }
    //   var bsePlatformSkuId = row.bsePlatformSkuId;
    //   if(!bsePlatformSkuId){
    //     this.$message.error("请先选择平台SKU");
    //     this.platformAccountList=[];
    //     return;
    //   }
    //   getStoreBySkuId({skuId:this.selectSkuId,name:query.trim(),bsePlatformSkuId:bsePlatformSkuId,isHideLoading:true}).then(({data})=>{
    //     if(data.code==0){
    //       if(!data.data || data.data.length==0){
    //          this.platformAccountList=[];
    //       }else{
    //         this.platformAccountList=[];
    //         for(var i=0;i<data.data.length;i++){
    //           this.platformAccountList.push({
    //             platformAccountId:data.data[i].storeId,
    //             name:data.data[i].storeAccount}
    //           )
    //         }
    //       }
    //     }else{
    //       this.$message.error("查询店铺失败");
    //     }
    //   })
    //   // this.platformAccountList = [{
    //   //   platformAccountId:1,
    //   //   name:'1',
    //   // }]
    // },
    saveRow(row, $index) {
      if (row.purchaseConfirmStatus && row.purchaseConfirmStatus != 0) {
        this.$message.error("只能保存状态为空或者未处理的数据")
        return false
      }
      if (!this.checkRowData(row)) {
        return false
      }
      var expectDeliveryDate = row.expectDeliveryDate
      if (new Date(expectDeliveryDate) < new Date(new Date(new Date().toLocaleDateString()).getTime())) {
        this.$message.error("期望交货日期小于当前日期，请检查")
        return false
      }
      row.requisitionNo = this.selectRequisitionNo
      row.skuId = this.selectSkuId

      savePoDeliveryPlan(row)
        .then(({ data }) => {
          if (data.code == 0) {
            this.$message({
              message: "保存成功",
              type: "success"
            })
            this.$set(this.rowDeliveryPlanData, $index, data.data)
            if (this.$parent.$refs.tagNavigate) {
              this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
            }
          } else if (data.code == 1 && data.msg) {
            this.$message.error(data.msg)
          } else {
            this.$message.error("保存失败")
          }
        })
        .finally(() => {})
    },
    submitRow(row, $index) {
      if (row.purchaseConfirmStatus && row.purchaseConfirmStatus != 0) {
        this.$message.error("只能提交状态为空或者未处理的数据")
        return false
      }
      if (!this.checkRowData(row)) {
        return false
      }
      var expectDeliveryDate = row.expectDeliveryDate
      if (new Date(expectDeliveryDate) < new Date(new Date(new Date().toLocaleDateString()).getTime())) {
        this.$message.error("期望交货日期小于当前日期，请检查")
        return false
      }
      row.requisitionNo = this.selectRequisitionNo
      row.skuId = this.selectSkuId

      submitPoDeliveryPlan(row)
        .then(({ data }) => {
          if (data.code == 0) {
            this.$message({
              message: "提交成功",
              type: "success"
            })
            this.$set(this.rowDeliveryPlanData, $index, data.data)
            if (this.$parent.$refs.tagNavigate) {
              this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
            }
          } else if (data.code == 1 && data.msg) {
            this.$message.error(data.msg)
          } else {
            this.$message.error("提交失败")
          }
        })
        .finally(() => {})
    },
    deleteRow(row, $index) {
      if (row.purchaseConfirmStatus && row.purchaseConfirmStatus != 0) {
        this.$message.error("只能删除状态为空或者未处理的数据")
        return false
      }
      var _this = this
      this.$confirm("是否确认删除该条数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          if (!row.deliveryPlanId) {
            _this.rowDeliveryPlanData.splice($index, 1)
            if (!_this.rowDeliveryPlanData || _this.rowDeliveryPlanData.length == 0) {
              _this.rowDeliveryPlanData.push({})
            }
            _this.$message({
              message: "删除成功",
              type: "success"
            })
          } else {
            deletePoDeliveryPlan(row.deliveryPlanId)
              .then(({ data }) => {
                if (data.code == 0) {
                  _this.$message({
                    message: "删除成功",
                    type: "success"
                  })
                  _this.rowDeliveryPlanData.splice($index, 1)
                  if (!_this.rowDeliveryPlanData || _this.rowDeliveryPlanData.length == 0) {
                    _this.rowDeliveryPlanData.push({})
                  }
                  if (_this.$parent.$refs.tagNavigate) {
                    _this.$parent.$refs.tagNavigate.clearTagCache(_this.$route.meta.parentPath)
                  }
                } else if (data.code == 1 && data.msg) {
                  _this.$message.error(data.msg)
                } else {
                  _this.$message.error("删除失败")
                }
              })
              .finally(() => {})
          }
        })
        .catch(function (err) {})
    },
    checkRowData(row) {
      if (!row.bsePlatformSkuId || row.bsePlatformSkuId == "") {
        this.$message.error("平台SKU为空,请检查")
        return false
      }
      if (!row.platformAccountId || row.platformAccountId == "") {
        this.$message.error("店铺为空,请检查")
        return false
      }
      if (!row.bsePlatformSitId || row.bsePlatformSitId == "") {
        this.$message.error("站点为空,请检查")
        return false
      }
      if (!row.expectDeliveryQuantity || row.expectDeliveryQuantity == "") {
        this.$message.error("期望交货数量为空,请检查")
        return false
      }
      if (!/(^[1-9]\d*$)/.test(row.expectDeliveryQuantity)) {
        this.$message.error("期望交货数量不是正整数")
        return false
      }
      if (!row.expectDeliveryDate || row.expectDeliveryDate == "") {
        this.$message.error("期望交货日期为空,请检查")
        return false
      }

      return true
    },
    rowClick(row, event, column) {
      var requisitionNo = row.requisitionNo
      var skuId = row.skuId
      this.bsePlatformSkuList = []
      this.platformSitList = []
      this.platformAccountList = []
      getDeliveryPlanInfo(requisitionNo).then(({ data }) => {
        if (data.code == 0) {
          this.rowDeliveryPlanData = data.data
          if (!this.rowDeliveryPlanData || this.rowDeliveryPlanData.length == 0) {
            this.rowDeliveryPlanData.push({})
          }
          this.selectRequisitionNo = requisitionNo
          this.selectSkuId = skuId
          this.createDeliveryPlanDialog = true
        }
      })
    },
    getList(page, params) {
      this.page.currentPage = page.currentPage
      getCreateDeliveryPlanPage(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        console.info(response.data.data)
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
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
      this.$confirm("是否确认删除ID为" + row.deliveryPlanId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.deliveryPlanId)
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
<style scoped lang="scss">
.podeliveryplan-create {
  .plan-opra {
    margin: 0 5px;
    text-decoration: none;
  }

  // @media (min-width: 800px){
  //  ::v-deep .avue-crud__menu .avue-crud__right {top: 0;}
  // }

  // @media (max-width: 1180px){
  //  ::v-deep .avue-crud__menu .avue-crud__right {top: 43px;}
  // }
}
</style>
