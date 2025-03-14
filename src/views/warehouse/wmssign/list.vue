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
  <div class="execution" id="signList">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <!-- 搜索条件 -->
        <template slot="search">
          <el-form :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="time" label="">
              <el-date-picker
                v-model="searchForm.time"
                type="daterange"
                size="small"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="deliveryNo">
              <el-input v-model="searchForm.deliveryNo" size="small" placeholder="送货单号"></el-input>
            </el-form-item>
            <el-form-item prop="supplierName">
              <el-input v-model="searchForm.supplierName" size="small" placeholder="供应商名称"></el-input>
            </el-form-item>
            <el-form-item prop="status" label="">
              <el-select size="small" v-model="searchForm.status" clearable placeholder="签收状态">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="wmsSignNo">
              <el-input v-model="searchForm.wmsSignNo" size="small" placeholder="请输入签收编号搜索"></el-input>
            </el-form-item>
            <el-form-item prop="corporationName">
              <el-input v-model="searchForm.corporationName" size="small" placeholder="请输入法人主体搜索"></el-input>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input v-model="searchForm.skuCode" size="small" placeholder="请输入SKU搜索"></el-input>
            </el-form-item>
            <el-form-item prop="poContractNo">
              <el-input v-model="searchForm.poContractNo" size="small" placeholder="请输入合同编号搜索"></el-input>
            </el-form-item>
            <el-form-item prop="taxType" label="税别">
              <el-select size="small" v-model="searchForm.taxType" clearable placeholder="请选择">
                <el-option v-for="item in taxTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <!-- 操作列表中的某一列 -->
        <template slot="deliveryNo" slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            class="button-css color-Warning"
            @click="openSignPage(scope.row.deliveryNo)"
            >{{ scope.row.deliveryNo }}</el-button
          >
          <!-- <span @click="openSignPage(scope.row.deliveryNo)" class="color-Warning">{{scope.row.deliveryNo}}</span> -->
        </template>
        <template slot="skuCount" slot-scope="scope">
          <span @click="showDetalil(scope.row.deliveryNo)" class="color-Warning">{{ scope.row.skuCount }}笔</span>
        </template>
      </avue-crud>

      <!-- 引入子组件-送货产品详情 -->
      <deliveryDetail ref="deliveryDetail"></deliveryDetail>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from "@/api/warehouse/wmssign"
import { tableOption } from "@/const/crud/warehouse/wmssign"
import { formatDate } from "@/filters/index"
import deliveryDetail from "./deliveryDetail"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "wmssign",
  components: {
    deliveryDetail
  },
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        time: [],
        startTime: "",
        endTime: "",
        deliveryNo: "",
        supplierName: "",
        status: "",
        wmsSignNo: "",
        corporationName: "",
        skuCode: "",
        poContractNo: "",
        taxType: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      selectList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      //签收状态
      statusOptions: [
        {
          value: 0,
          label: "待签收"
        },
        {
          value: 1,
          label: "已签收"
        }
      ],
      //税别
      taxTypeOptions: [
        {
          value: 1,
          label: "含税"
        },
        {
          value: 2,
          label: "非税"
        }
      ]
    }
  },
  created() {},
  mounted: function () {
    this.getList(this.page)
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getList(page, params) {
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
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.page.currentPage = 1
      //将搜索的条件放入到确认的搜索条件中
      if (this.searchForm.time && this.searchForm.time.length == 2) {
        this.searchForm.startTime = this.searchForm.time[0]
        this.searchForm.endTime = this.searchForm.time[1]
      } else {
        this.searchForm.startTime = ""
        this.searchForm.endTime = ""
      }
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
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, this.searchFormConfirm)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, this.searchFormConfirm)
    },
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    //清除选中
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    /**
     * 打开签收页面
     */
    openSignPage: function (deliveryNo) {
      this.$router.push({
        path: "/wmssign/sign",
        query: {
          deliveryNo: deliveryNo
        }
      })
    },
    showDetalil: function (deliveryNo) {
      this.$refs.deliveryDetail.loadAll(deliveryNo)
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
