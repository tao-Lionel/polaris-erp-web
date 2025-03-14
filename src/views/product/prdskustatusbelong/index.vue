<template>
  <div
    class="execution"
    id="prdskustatusbelong-box"
    v-loading.fullscreen.lock="importLoading"
    element-loading-text="正在处理中"
  >
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
        @search-change="searchChange"
        @search-reset="searchReset"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="openDataStatusDialog"
            v-if="permissions.product_prdskustatusbelong_set"
            size="small"
            >设置状态</el-button
          >
          <el-button
            type="primary"
            @click="switchDevelopGroup"
            v-if="permissions.statusbelong_change_develops"
            size="small"
            >切换开发组</el-button
          >
          <el-button
            type="primary"
            @click="switchBuyersGroup"
            v-if="permissions.statusbelong_change_buyers"
            size="small"
            >切换采购组</el-button
          >

          <el-button type="primary" @click="purchaseState(0)" v-if="permissions.belong_enable_purchase" size="small"
            >允许采购</el-button
          >
          <el-button type="primary" @click="purchaseState(1)" v-if="permissions.belong_prohibit_purchase" size="small"
            >禁止采购</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form-item>
            <el-input
              clearable
              v-model="search.spuCode"
              v-search-input
              size="small"
              placeholder="标准SPU,支持多个"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              clearable
              v-model="search.skuCode"
              v-search-input
              size="small"
              placeholder="工厂SKU,支持多个"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input clearable v-model="search.skuName" v-search-input size="small" placeholder="产品名称"></el-input>
          </el-form-item>
        </template>

        <template slot="searchAdvanced">
          <el-form :inline="true">
            <el-form-item>
              <el-select clearable v-model="search.saleStatus" size="small" placeholder="销售状态">
                <el-option label="正常" value="0"></el-option>
                <el-option label="停售" value="1"></el-option>
                <el-option label="清仓" value="2"></el-option>
                <!-- <el-option label="暂停" value="3"></el-option> -->
                <el-option label="待启用" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select clearable v-model="search.purchaseState" size="small" placeholder="采购状态">
                <el-option label="允许采购" value="0"></el-option>
                <el-option label="禁止采购" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="{ row }" slot="btnGroup">
          <a @click="showOperateLog(row.statusBelongId)">查看日志</a>
        </template>
        <template slot="sitEnNameWithCorporationVos" slot-scope="scope">
          <p v-for="(item, index) in scope.row.sitEnNameWithCorporationVos" :key="index">
            {{ item.sitEnName + ":" + item.corporationName }}
          </p>
        </template>
      </avue-crud>

      <el-dialog title="设置状态" class="mysetstatus" :visible.sync="setDataStatusDialog" width="20%" center>
        <span>销售状态：</span>
        <el-select v-model="dataStatus" size="small" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="setDataStatusDialog = false">取 消</el-button>
          <el-button type="primary" size="small" @click="confrimDataStatus()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 切换开发组信息 -->
      <el-dialog title="切换开发组" :visible.sync="switchDevelopGroupDialog" width="20%" center>
        <el-form
          ref="switchDevelopGroupForm"
          :model="switchDevelopGroupForm"
          label-position="right"
          :rules="switchDevelopGroupRules"
          size="small"
          status-icon
        >
          <el-form-item label="开发组:" prop="developGroupId">
            <el-select
              v-model="switchDevelopGroupForm.developGroupId"
              size="small"
              clearable
              placeholder="请选择开发组"
              @change="changeDevelop"
            >
              <el-option
                v-for="item in developGroupOptions"
                :key="item.groupId"
                :label="item.name"
                :value="item.groupId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开发维护人:" prop="maintainerId">
            <el-select
              size="small"
              clearable
              v-model="switchDevelopGroupForm.maintainerId"
              filterable
              placeholder="请选择开发维护人"
            >
              <el-option
                v-for="item in maintainerList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="switchDevelopGroupDialog = false">取 消</el-button>
          <el-button type="primary" size="small" @click="submitSwitchDevelopGroupForm('switchDevelopGroupForm')"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 切换采购组信息 -->
      <el-dialog title="切换采购组" :visible.sync="switchBuyerGroupDialog" width="20%" center>
        <el-form
          ref="switchBuyerGroupForm"
          :model="switchBuyerGroupForm"
          label-position="right"
          :rules="switchBuyerGroupRules"
          size="small"
          status-icon
        >
          <el-form-item label="采购组:" prop="buyerGroupId">
            <el-select
              v-model="switchBuyerGroupForm.buyerGroupId"
              size="small"
              clearable
              placeholder="请选择采购组"
              @change="changeBuyer"
            >
              <el-option
                v-for="item in buyerGroupOptions"
                :key="item.groupId"
                :label="item.name"
                :value="item.groupId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采购员:" prop="buyerId">
            <el-select
              size="small"
              clearable
              v-model="switchBuyerGroupForm.buyerId"
              filterable
              placeholder="请选择采购员"
            >
              <el-option
                v-for="item in buyerList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="switchBuyerGroupDialog = false">取 消</el-button>
          <el-button type="primary" size="small" @click="submitSwitchBuyerGroupForm('switchBuyerGroupForm')"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 操作日志 -->
      <prdoperatelog ref="prdoperatelog"></prdoperatelog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  putObj,
  delObj,
  purchaseState,
  getUserInfoByGroupId,
  changeDevelops,
  changeBuyers
} from "@/api/product/prdskustatusbelong"
import { tableOption, switchDevelopGroupRules, switchBuyerGroupRules } from "@/const/crud/product/prdskustatusbelong"
import prdoperatelog from "@/views/product/prdoperatelog/index"
import { getGroupAllByParams as getGroupApi } from "@/api/adminUser/adminGroup"
import { getAll as getBsecorporationAll } from "@/api/baseSetup/bsecorporation"
import { getSitAll } from "@/api/baseSetup/bseplatformsit"
import { preventShake } from "@/util/tool"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"

export default {
  name: "prdskustatusbelong",
  components: {
    prdoperatelog
  },
  data() {
    return {
      search: {
        skuCode: "",
        spuCode: "",
        skuName: "",
        saleStatus: "",
        purchaseState: ""
      },
      selectList: [],
      developGroupOptions: [],
      maintainerList: [],
      buyerList: [],
      buyerGroupOptions: [],
      developGroupId: "",
      maintainer: "",
      buyerGroupId: "",
      buyer: "",
      list: [],
      options: [
        {
          value: "0",
          label: "正常"
        },
        {
          value: "1",
          label: "停售"
        },
        {
          value: "2",
          label: "清仓"
        },
        {
          value: "3",
          label: "暂停"
        },
        {
          value: "4",
          label: "待启用"
        }
      ],
      dataStatus: "0",
      setDataStatusDialog: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      searchTotal: {},
      groupId: null,
      changeGroup: false,
      //切换开发组信息
      switchDevelopGroupDialog: false,
      switchDevelopGroupRules: switchDevelopGroupRules,
      switchDevelopGroupForm: {
        developGroupId: "",
        maintainerId: "",
        statusBelongIdList: []
      },
      //切换采购组信息
      switchBuyerGroupDialog: false,
      switchBuyerGroupRules: switchBuyerGroupRules,
      switchBuyerGroupForm: {
        buyerGroupId: "",
        buyerId: "",
        statusBelongIdList: []
      },
      corporationOption: [],
      salesSitOption: [],
      statusBelongId: null,
      importLoading: false
    }
  },
  created() {
    this.loadBuyerGroup()
    this.loadCorporation()
    this.loadSit()
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //加载站点
    loadSit() {
      getSitAll().then((response) => {
        console.log(response.data.data)
        response.data.data.forEach((item) => {
          this.salesSitOption.push({
            label: item,
            value: item
          })
        })
        console.log(this.salesSitOption)
      })
    },
    //加载主体
    loadCorporation() {
      getBsecorporationAll().then((response) => {
        let data = response.data.data
        if (data && data.length > 0) {
          this.corporationOption = data
        }
      })
    },
    //加载采购组
    loadBuyerGroup() {
      //加载开发组
      var params = {
        groupFunctionName: "开发类",
        authority: true
      }
      getGroupApi(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.developGroupOptions = data
        }
      })

      //加载采购组
      var params = {
        groupFunctionName: "采购类",
        authority: false
      }
      getGroupApi(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.buyerGroupOptions = data
        }
      })
    },
    //查看操作日志
    showOperateLog(id) {
      this.$refs.prdoperatelog.showOperateLogDialog(id, 10)
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    searchReset(form) {
      this.search = {}
    },
    searchChange(form) {
      this.searchTotal = deepCloneIgnoreNull(this.search)
      this.getList(this.page, form)
    },
    /** 刷新回调 */
    refreshChange() {
      this.getList(this.page)
    },
    getList(page, params) {
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchTotal
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.clearSelectClear()
      })
    },
    /**
     * 清空选中
     */
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    confrimDataStatus() {
      var selectList = this.selectList
      var dataList = []
      for (let i = 0; i < selectList.length; i++) {
        dataList.push({
          statusBelongId: selectList[i].statusBelongId,
          skuId: selectList[i].skuId,
          saleStatus: this.dataStatus
        })
      }

      putObj(dataList, 0).then((response) => {
        if (response.data.code == 0) {
          this.getList(this.page)
          this.$notify({
            title: "成功",
            message: "切换成功",
            type: "success",
            duration: 2000
          })
          this.setDataStatusDialog = false
        } else if (response.data.code == 1) {
          this.$message({
            message: response.data.msg.replace(/\n/g, "<br>"),
            dangerouslyUseHTMLString: true,
            type: "error"
          })
          return
        } else {
          this.$message.error("切换失败")
          return
        }
      })
    },
    selectionChange(list) {
      this.selectList = list
    },
    openDataStatusDialog() {
      this.dataStatus = "0"
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      this.setDataStatusDialog = true
    },
    /**修改开发组 */
    switchDevelopGroup() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请勾选数据")
        return
      }
      this.switchDevelopGroupForm = {
        developGroupId: "",
        maintainerId: "",
        statusBelongIdList: []
      }

      if (this.developGroupOptions && this.developGroupOptions.length == 1) {
        this.switchDevelopGroupForm.developGroupId = this.developGroupOptions[0].groupId
        this.changeDevelop(this.switchDevelopGroupForm.developGroupId)
      }
      this.switchDevelopGroupDialog = true
    },
    //选中开发组后
    changeDevelop(val) {
      this.maintainer = null
      this.maintainerList = []
      getUserInfoByGroupId(val).then((data) => {
        this.maintainerList = data.data.data.map((item) => {
          return { value: item.userId, label: item.displayname }
        })
      })
    },
    submitSwitchDevelopGroupForm(formName) {
      var _this = this
      this.selectList.forEach((o) => {
        this.switchDevelopGroupForm.statusBelongIdList.push(o.statusBelongId)
      })
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        preventShake.preventShake((bool) => {
          if (bool) {
            changeDevelops(_this.switchDevelopGroupForm)
              .then((response) => {
                if (response.data.code == 0) {
                  _this.switchDevelopGroupDialog = false
                  _this.$message.success("操作成功")
                  _this.clearSelectClear()
                  _this.getList(_this.page)
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
      })
    },
    /**修改采购组 */
    switchBuyersGroup() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请勾选数据")
        return
      }

      this.switchBuyerGroupForm = {
        buyerGroupId: "",
        buyerId: "",
        statusBelongIdList: []
      }
      this.switchBuyerGroupDialog = true
    },
    //选中采购组后
    changeBuyer(val) {
      this.buyerId = null
      this.buyerList = []
      getUserInfoByGroupId(val).then((data) => {
        this.buyerList = data.data.data.map((item) => {
          return { value: item.userId, label: item.displayname }
        })
      })
    },
    submitSwitchBuyerGroupForm(formName) {
      var _this = this
      this.selectList.forEach((o) => {
        this.switchBuyerGroupForm.statusBelongIdList.push(o.statusBelongId)
      })
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        preventShake.preventShake((bool) => {
          if (bool) {
            changeBuyers(_this.switchBuyerGroupForm)
              .then((response) => {
                if (response.data.code == 0) {
                  _this.switchBuyerGroupDialog = false
                  _this.$message.success("操作成功")
                  _this.clearSelectClear()
                  _this.getList(_this.page)
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
      })
    },

    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.statusBelongId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.statusBelongId)
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
    /**采购状态修改 */
    purchaseState(state) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }

      let msg = state == 0 ? "允许采购" : "禁止采购"

      let fallRows = this.selectList.filter((o) => {
        return o.purchaseState == state
      })
      if (fallRows && fallRows.length > 0) {
        this.$message.warning("存在数据已:" + msg + "，请检查！")
        return
      }

      var statusBelongIdList = []
      this.selectList.forEach((obj, i) => {
        statusBelongIdList.push(obj.statusBelongId)
      })
      var param = {
        statusBelongIdList: statusBelongIdList
      }

      var _this = this
      this.$confirm("是否确认" + msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          //请求后台
          purchaseState(param, state)
            .then((data) => {
              if (data.data.code == 0) {
                _this.$message.success("操作成功")
                _this.clearSelectClear()
                _this.getList(_this.page)
              } else if (data.data.code == 1) {
                // warning(data.data.msg)
                _this.$message({
                  message: data.data.msg.replace(/\n/g, "<br>"),
                  type: "warning",
                  dangerouslyUseHTMLString: true
                })
              } else {
                _this.$message.error("操作失败")
              }
            })
            .catch(() => {
              _this.$message.error("操作失败")
            })
        })
        .then((data) => {})
        .catch(function (err) {})
    }
  }
}
</script>

<style lang="scss" scoped>
#prdskustatusbelong-box {
  .mysetstatus ::v-deep .el-dialog__body {
    display: flex;
    white-space: nowrap;
    align-items: center;
  }

  ::v-deep .el-dialog__header {
    line-height: 30px;
  }

  ::v-deep .el-textarea__inner {
    height: 90px;
  }

  ::v-deep .el-dialog__footer {
    padding: 0px 20px 20px 20px;
    border-top: 0px;
    clear: both;
    background: #fff;
  }
}
</style>
