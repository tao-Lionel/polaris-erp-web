<template>
  <div class="execution" id="wmsinbound">
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
          <el-button type="primary" @click="exportList" size="small" v-if="permissions.purchase_inbound_export"
            >导出</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form
            @keyup.enter.native="searchChange"
            :model="searchForm"
            :inline="true"
            ref="searchForm"
            style="float: left"
          >
            <el-form-item prop="poContractNo" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-input
                v-model="searchForm.poContractNo"
                size="small"
                placeholder="合同号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="skuCode" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-input
                v-model="searchForm.skuCode"
                size="small"
                placeholder="工厂SKU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="purchaseOrderNo" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-input
                v-model="searchForm.purchaseOrderNo"
                size="small"
                placeholder="采购单号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="purchaseGroupId">
              <el-select v-model="searchForm.purchaseGroupId" size="small" clearable placeholder="采购组">
                <el-option
                  v-for="item in purchaseGroupOptions"
                  :key="item.groupId"
                  :label="item.name"
                  :value="item.groupId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="purchaseUserName">
              <el-input v-model="searchForm.purchaseUserName" size="small" placeholder="采购员"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance"> </el-form>
        </template> -->
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, exportData } from "@/api/report/purchaseInboundReport.js"
import { tableOption } from "@/const/crud/report/purchaseInboundReport.js"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { getTokenUrl, getTokenUrlFile } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        poContractNo: "",
        skuCode: "",
        purchaseOrderNo: "",
        purchaseGroupId: "",
        saleGroupId: "",
        purchaseUserName: ""
      },
      selectList: [], //列表勾选
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      requisitionGroupOptions: [],
      purchaseGroupOptions: []
    }
  },
  created() {},
  mounted: function () {
    this.loadAll()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

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
      })
    },

    /**
     * 页面初始化
     */
    loadAll: function () {
      var params = {
        groupFunctionName: "销售类",
        authority: false
      }
      //加载请购组
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.requisitionGroupOptions = data
        }
      })

      //加载采购组
      params = {
        groupFunctionName: "采购类",
        authority: false
      }
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.purchaseGroupOptions = data
        }
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
    },
    //列表勾选
    selectionChange(list) {
      this.selectList = list
    },

    //导出数据
    exportList() {
      var obj = this.searchFormConfirm
      var param = ""
      var count = 0
      for (var index in obj) {
        if (count == 0) {
          param = "?" + index + "=" + obj[index]
        } else {
          param = param + "&" + index + "=" + obj[index]
        }
        count++
      }
      this.downloadUrl = getTokenUrlFile("/api/purchase/poorder/exportData" + param)
      window.location.href = this.downloadUrl
      this.$message.success("导出成功!")
    },

    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    }
  }
}
</script>
