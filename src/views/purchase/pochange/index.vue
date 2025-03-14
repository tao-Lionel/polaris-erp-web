<template>
  <div class="execution" id="pochange">
    <!-- 采购变更列表 -->
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
          <el-button type="primary" size="small" v-if="permissions.purchase_poorderchange_delete" @click="handleDel"
            >删除</el-button
          >

          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="提交审核"
            v-if="permissions.purchase_poorderchange_submit"
            command="10"
            style="margin-right: 10px"
            @command="submitVerify"
          >
            <el-dropdown-item command="20">撤销提交</el-dropdown-item>
          </el-dropdown-button>

          <el-dropdown-button
            type="primary"
            size="small"
            v-if="permissions.purchase_poorderchange_purchase"
            buttonText="采购审核"
            command="1"
            style="margin-right: 10px"
            @command="changeStatus"
          >
            <el-dropdown-item command="-1">反审核</el-dropdown-item>
          </el-dropdown-button>

          <el-button
            type="primary"
            v-if="permissions.purchase_poorderchange_finance"
            size="small"
            @click="changeStatus(2)"
            >财务审核</el-button
          >
        </template>
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="time">
              <el-date-picker
                v-model="searchForm.time"
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="poOrderChangeNo">
              <avue-crud-input
                v-model="searchForm.poOrderChangeNo"
                size="small"
                placeholder="单据编号"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="supplierName" label="">
              <el-select v-model="searchForm.supplierName" size="small" placeholder="供应商" filterable clearable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>

        <!-- 展开行 -->
        <template slot="expand" slot-scope="scope">
          <el-table
            :data="scope.row?.childVos"
            :show-header="true"
            style="margin-left: 90px; width: calc(100% - 90px)"
            size="mini"
          >
            <el-table-column prop="skuCode" label="工厂SKU"></el-table-column>
            <el-table-column prop="skuName" label="产品名称"></el-table-column>
            <el-table-column prop="platformCode" label="平台" width="100"></el-table-column>
            <el-table-column prop="sitCode" label="站点" width="100"></el-table-column>
            <el-table-column prop="originalPurchaseQuantity" label="原采购数量" width="100"></el-table-column>
            <el-table-column prop="changeQuantity" label="变更数量" width="100"></el-table-column>
            <el-table-column prop="originalRemainingQuantity" label="原单剩余数量" width="120"></el-table-column>
            <el-table-column prop="changePrice" label="变更单价" width="80"></el-table-column>
            <el-table-column prop="changeTotalAmount" label="总金额" width="120"></el-table-column>
          </el-table>
        </template>

        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="oldContractNo">
              <avue-crud-input
                v-model="searchForm.oldContractNo"
                size="small"
                placeholder="源合同编号"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="newContractNo">
              <avue-crud-input
                v-model="searchForm.newContractNo"
                size="small"
                placeholder="新合同编号"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="corporationName">
              <el-select v-model="searchForm.corporationName" size="small" placeholder="法人主体" filterable clearable>
                <el-option
                  v-for="item in corporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select
                size="small"
                v-model="searchForm.status"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="变更状态"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>

        <!-- 列插入 -->
        <template slot-scope="scope" slot="poOrderChangeNo">
          <!-- 变更状态 -->
          <span class="el-row-text">
            <!-- isChangeList为true，表示从变更列表进入详情 -->
            <copy-text hoverToShow>
              <router-link
                :to="{ path: '/pochange/edit', query: { poOrderNos: scope.row.poOrderChangeNo, isChangeList: true } }"
              >
                {{ scope.row.poOrderChangeNo }}
              </router-link>
            </copy-text>
          </span>
        </template>

        <template slot-scope="scope" slot="status">
          <!-- 变更状态 -->
          <a class="a-no-line" @click="showOperateLog(scope.row.poOrderChangeNo)">{{
            handleStatus(scope.row.status)
          }}</a>
        </template>
      </avue-crud>

      <!-- 审核弹出框 -->
      <el-dialog :title="verifyTitle" width="35%" :visible.sync="verifyModel" @close="cancelReason = ''">
        <avue-crud-input
          maxlength="100"
          type="textarea"
          :rows="3"
          placeholder="请填写原因，不得超过100个字符。(拒绝必填)"
          v-model="cancelReason"
        ></avue-crud-input>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="refuseOrPass(1)">拒 绝</el-button>
          <el-button size="small" type="primary" @click="refuseOrPass(2)">通过</el-button>
        </div>
      </el-dialog>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  delRows,
  purchaseSubmit,
  purchaseCancelSubmit,
  purchaseVerify,
  poReverseAuditor
} from "@/api/purchase/pochange/poorderchange"
import { tableOption } from "@/const/crud/purchase/pochange/poorderchange"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import operationlog from "@/views/purchase/log/index"
import { getTokenUrlFile } from "@/util/auth"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getAll as getAllCorporationApi } from "@/api/baseSetup/bsecorporation"

let tip = {
  t1: "请勾选数据操作",
  t2: "检测到变更单号:",
  t3: "为"
}
export default {
  name: "poorderchange",
  data() {
    return {
      verifyTitle: "",
      searchForm: {
        time: []
      },
      searchFormConfirm: {},
      //处理环节
      statusOptions: [
        {
          value: 0,
          label: "未处理"
        },
        {
          value: 1,
          label: "采购审核"
        },
        {
          value: 2,
          label: "财务审核"
        },
        {
          value: 3,
          label: "审核完成"
        }
      ],
      //确定的搜索条件
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],
      verifyModel: false, //反审核模态框
      cancelReason: "", //反审核拒绝理由
      requestType: "",
      supplierOptions: [],
      corporationList: []
    }
  },
  created() {},
  mounted: function () {
    this.getSupplierAll()
    this.getCorporation()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    operationlog
  },
  methods: {
    // 查看日志
    showOperateLog(poOrderChangeNo) {
      this.$refs.operationlog.showOperateLogDialog(poOrderChangeNo, 16)
    },
    getList(page) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      //将搜索的条件放入到确认的搜索条件中
      if (this.searchFormConfirm.time && this.searchFormConfirm.time.length > 0) {
        this.searchFormConfirm.startDate = this.searchFormConfirm.time[0]
        this.searchFormConfirm.endDate = this.searchFormConfirm.time[1]
        delete this.searchFormConfirm.time
      }

      this.page.currentPage = page.currentPage
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(page)
    },
    selectionChange(selected) {
      this.selectRows = selected
    },
    locationVerify(tip, status) {
      // this.$refs.crud.rowDel(row, index);
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning(tip.t1)
        return {
          isOk: false,
          contractNoList: null
        }
      }
      let contractNoList = []
      let canDelect = true
      this.selectRows.forEach((item) => {
        //仅 未审核 可删除
        if (item.status !== status) {
          canDelect = false
          this.$message({
            type: "error",
            message: tip.t2 + item.poOrderChangeNo + tip.t3 + this.handleStatus(item.status) + tip.t4,
            duration: 5000
          })
        }
        contractNoList.push(item.poOrderChangeNo)
      })
      if (!canDelect) {
        return {
          isOk: false,
          contractNoList: null
        }
      }

      return {
        isOk: true,
        contractNoList: contractNoList
      }
    },
    handleDel() {
      tip.t4 = ",仅未处理状态可删除"

      let v = this.locationVerify(tip, 0)
      if (v.isOk) {
        this.$confirm("此操作将删除选中采购变更, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            delRows({ poOrderChangeNos: v.contractNoList }).then((response) => {
              if (response.data.code === 0) {
                // 手动调用清除选择
                this.$refs.crud.selectClear()
                this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
                this.getList(this.page)
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
                  duration: 2000
                })
              } else if (response.data.code === 1) {
                this.$message.error(response.data.msg)
                return
              } else {
                this.$message.error("删除失败")
                return
              }
              // this.getList(this.page);
            })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            })
          })
      }
    },
    submitVerify(id) {
      // 提交审核,撤销审核

      id = Number(id)
      if (id === 10) {
        tip.t4 = ",仅状态为未处理状态可操作"
        let v = this.locationVerify(tip, 0)
        if (v.isOk) {
          purchaseSubmit({
            poOrderChangeNos: v.contractNoList
          }).then((res) => {
            if (res.data.code == 0) {
              this.submitSuccessTip("提交审核通过，当前状态为：采购审核")
            } else if (res.data.code == 1) {
              this.$message.error(res.data.msg)
            } else {
              this.$message.error("修改失败")
            }
          })
        }
      } else if (id === 20) {
        tip.t4 = ",仅状态为采购审核态可操作"
        let v = this.locationVerify(tip, 1)
        if (v.isOk) {
          purchaseCancelSubmit({
            poOrderChangeNos: v.contractNoList
          }).then((res) => {
            if (res.data.code == 0) {
              this.submitSuccessTip("撤销成功，当前状态为：未处理")
            } else if (res.data.code == 1) {
              this.$message.error(res.data.msg)
            } else {
              this.$message.error("修改失败")
            }
          })
        }
      }
    },
    submitSuccessTip(str) {
      this.$refs.crud.selectClear()
      this.searchChange(undefined, this.page)
      this.$notify({
        title: "提示",
        message: str,
        type: "success",
        duration: 5000
      })
    },
    changeStatus(id) {
      id = Number(id)

      let v = null
      if (id === 1) {
        // 采购审核
        tip.t4 = ",仅状态为采购审核可操作"
        v = this.locationVerify(tip, id)
        if (v.isOk) {
          this.verifyTitle = "采购审核"
          this.verifyModel = true
          this.requestType = 1
        }
      } else if (id === -1) {
        // 反审核
        this.verifyTitle = "反审核"
        tip.t4 = ",仅状态为财务审核可操作"

        v = this.locationVerify(tip, 2)
        if (v.isOk) {
          // this.verifyModel = true;
          poReverseAuditor({
            poOrderChangeNos: v.contractNoList
          })
            .then((res) => {
              if (res.data.code === 0) {
                this.$notify({
                  title: "提示",
                  message: "操作成功",
                  type: "success",
                  duration: 3000
                })
                this.$refs.crud.selectClear()
                this.searchChange(undefined, this.page)
              } else {
                this.$message.error(res.data.code)
              }
            })
            .catch((res) => {
              this.$message.error("请求出错")
            })
        }
        return
      } else if (id === 2) {
        // 财务审核
        tip.t4 = ",仅状态为财务审核可操作"
        this.verifyTitle = "财务审核"
        v = this.locationVerify(tip, id)
        if (v.isOk) {
          this.requestType = 2
          this.verifyModel = true
        }
      }
    },
    refuseOrPass(reasonId) {
      let v = {
        contractNoList: []
      }
      this.selectRows.forEach((val) => {
        v.contractNoList.push(val.poOrderChangeNo)
      })

      if (reasonId === 1) {
        // 拒绝
        if (!this.cancelReason.trim()) {
          this.$message.error("拒绝原因必填")
          return
        }
        this.requestServive(
          {
            tip: "已拒绝",
            type: this.requestType
          },
          v,
          this.cancelReason
        )
      } else if (reasonId === 2) {
        // 通过
        this.requestServive(
          {
            tip: "审核通过",
            type: this.requestType
          },
          v
        )
      }
    },
    requestServive(obj, v, reason) {
      let par = {
        poOrderChangeNos: v.contractNoList,
        type: obj.type
      }

      if (reason) {
        par.refuseText = reason
      }
      purchaseVerify(par).then((response) => {
        if (response.data.code == 0) {
          // 手动调用清除选择
          this.$refs.crud.selectClear()
          this.verifyModel = false

          this.searchChange(undefined, this.page)
          this.$notify({
            title: "提示",
            message: obj.tip,
            type: "success",
            duration: 5000
          })
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("修改失败")
          return
        }
      })
    },

    /**
     * 刷新回调
     */
    refreshChange() {
      // this.getList(this.page);
      this.searchChange(undefined, this.page)
    },

    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    handleStatus(status) {
      const obj = {
        0: "未处理",
        1: "采购审核",
        2: "财务审核",
        3: "审核完成"
      }
      return obj[status]
    },
    downLoadFile() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      if (this.selectRows.length > 1) {
        this.$message.warning("一次只能下载一条数据!")
        return
      }
      if (this.selectRows[0].delFlag == 1) {
        this.$message.warning("无效合同!")
        return
      }
      const downloadUrl = getTokenUrlFile("/api/purchase/poorderchange/download/" + this.selectRows[0].poOrderChangeNo)
      window.location.href = downloadUrl
      this.$message.success("下载中...")
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierName,
            label: item.supplierName
          })
        })
      }
    },
    // 获取法人主体
    async getCorporation() {
      const { data } = await getAllCorporationApi()
      if (data.code === 0) {
        this.corporationList = data.data
      }
    }
  }
}
</script>

<style lang="scss">
#pochange {
  .attachFile-cell {
    display: flex;
  }
  .attachFile-cell li {
    flex: 1;
  }
  .el-textarea__inner {
    height: 90px;
  }
  .el-dialog__footer {
    padding: 0px 20px 20px 20px;
    border-top: 0px;
    clear: both;
    background: #fff;
    border-radius: 0px 0px 4px 4px;
  }
}
</style>
