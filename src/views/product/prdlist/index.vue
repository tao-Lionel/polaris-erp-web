<template>
  <div class="execution" id="prdlist">
    <basic-container>
      <avue-crud
        ref="crud"
        v-model="form"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        @refresh-change="refreshChange"
        @search-change="handleFilter"
        @search-reset="searchReset"
      >
        <template slot="menuLeft">
          <!-- 0-未处理 1-销售审核 2-开发审核 3-财务审核 4-审核完成 -->
          <el-button size="small" type="primary" @click="openTag()" v-if="permissions.prdlist_add">创建新品</el-button>
          <el-button size="small" type="primary" @click="specialEdit()" v-if="permissions.prdlist_special_edit"
            >修改</el-button
          >
          <!-- <el-button size="small" type="primary" @click="cancelSubmit()"
            v-if="permissions.prdlist_cancel_submit">撤销提交</el-button> -->
          <el-button
            size="small"
            type="primary"
            @click="prdlistAuditZero(0, '提交审核')"
            v-if="permissions.prdlist_submit_audit"
            >提交审核</el-button
          >
          <!-- <el-dropdown-button v-if="permissions.prdlist_sales_audit" type="primary" size="small" buttonText="销售审核" command="销售审核" @command="handleCommand">
                <el-dropdown-item command="销售反审核">反审核</el-dropdown-item>
              </el-dropdown-button>
              <el-dropdown-button v-if="permissions.prdlist_development_audit" type="primary" size="small" buttonText="开发审核" command="开发审核" @command="handleCommand">
                <el-dropdown-item command="开发反审核">反审核</el-dropdown-item>
              </el-dropdown-button>                          -->
          <!-- <el-button size="small" type="primary" @click="prdlistAudit(1, '销售审核')" v-if="permissions.prdlist_sales_audit">销售审核</el-button>
              <el-button size="small" type="primary" @click="prdlistAudit(2, '开发审核')" v-if="permissions.prdlist_development_audit">开发审核</el-button> -->
          <!-- <el-button size="small" style="margin-left: 10px;" type="primary" @click="prdlistAudit(3, '财务审核')" v-if="permissions.prdlist_financial_audit">财务审核</el-button> -->
        </template>

        <template slot="search">
          <el-form @submit.prevent.native :model="queryParam" :inline="true" ref="queryParamForm" style="float: left">
            <!-- <el-form-item label="单据编码">
              <el-input v-model="queryParam.invoiceNo" placeholder="单据编码" size="small" v-search-input></el-input>
            </el-form-item> -->

            <el-form-item>
              <el-input
                v-model="queryParam.spuCode"
                placeholder="标准SPU,支持多个"
                size="small"
                v-search-input
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="SKU">
              <el-input v-model="queryParam.skuCode" placeholder="SKU搜索" size="small" v-search-input></el-input>
            </el-form-item> -->
            <el-form-item class="needChangeSelect">
              <el-input placeholder="请输入内容" v-model="selectValue" clearable size="small" v-search-input>
                <el-select v-model="selectLabel" slot="prepend" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in searchName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-input v-model="queryParam.spuName" placeholder="产品名称" size="small" v-search-input-trim></el-input>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="handleFilter"></el-button>
            <el-form-item>
              <el-select
                clearable
                placeholder="处理环节"
                multiple
                collapse-tags
                v-model="proceStep"
                size="small"
                @change="proceChange()"
              >
                <el-option
                  v-for="(item, index) in selectOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="queryParam" :inline="true" ref="searchFormAdvance">
            <!-- 创建人创建时间 -->
            <el-form-item prop="createName">
              <el-input v-model="queryParam.createName" size="small" placeholder="创建人" clearable></el-input>
            </el-form-item>
            <el-form-item prop="createTime">
              <el-date-picker
                size="small"
                v-model="queryParam.startDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="创建开始日期"
                end-placeholder="创建结束日期"
              >
              </el-date-picker>
            </el-form-item>

            <!-- <el-form-item label="型号">
                  <el-input v-model="queryParam.modelName" placeholder="型号搜索" size="small" v-search-input></el-input>
                </el-form-item> -->

            <el-button native-type="submit" v-show="false" @click="handleFilter"></el-button>
          </el-form>
        </template>

        <template slot="operateLog" slot-scope="scope">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.invoiceId)"></i>
          <!-- <el-button type="text" size="mini">查看</el-button> -->
        </template>
        <template slot="invoiceNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              class="el-row-text"
              v-if="permissions.prdlist_edit"
              :to="'/product/openTag/edit/' + scope.row.invoiceId"
              :title="scope.row.invoiceNo"
            >
              {{ scope.row.invoiceNo }}
            </router-link>

            <el-tag type="info" disable-transitions v-else>
              {{ scope.row.invoiceNo }}
            </el-tag>
          </copy-text>
        </template>

        <template slot="createName" slot-scope="{ row }">
          <div>{{ row.createName }}</div>
          <div>{{ row.createTime }}</div>
        </template>
      </avue-crud>

      <el-dialog
        v-bind:title="confrimDialogTitle"
        :visible.sync="confrimDialog"
        width="30%"
        @close="confrimDialogClearData"
        center
      >
        <el-form :model="auditForm" ref="auditForm" :rules="auditFormRules" size="small">
          <!-- <el-form-item label="" prop="confrimType" >
                <el-radio-group v-model="auditForm.confrimType" @change="confrimTypeChange">
                  <el-radio label="1">同意</el-radio>
                  <el-radio label="0">拒绝</el-radio>
              </el-radio-group>
            </el-form-item> -->

          <el-form-item label="" prop="message">
            <el-input
              type="textarea"
              :rows="2"
              :maxlength="100"
              placeholder="请填写相关信息，不得超过100个字符。"
              v-model="auditForm.message"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="confrimDialog = false">取 消</el-button> -->
          <!-- <el-button type="primary" @click="handleConfrim('auditForm')">确 定</el-button> -->
          <el-button type="info" size="small" @click="dialogResult(false, 'auditForm')">拒 绝</el-button>
          <el-button type="primary" size="small" @click="dialogResult(true, 'auditForm')">通 过</el-button>
        </span>
      </el-dialog>

      <!-- 操作日志 -->
      <prdoperatelog ref="prdoperatelog"></prdoperatelog>
    </basic-container>
  </div>
</template>
<script>
import { tableOption } from "@/const/crud/product/prdlist/prdlist"
import { fetchList, toExamine, cancelSubmit, rollbackSubmit } from "@/api/product/prdlist/prdlist"
import prdoperatelog from "@/views/product/prdoperatelog/index"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "../../../components/avue/utils/util"

export default {
  name: "prdlist",
  components: {
    prdoperatelog
  },
  data() {
    return {
      tableData: [],
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      form: {},
      proceStep: [],
      queryParam: {
        startDate: [],
        invoiceNo: null,
        skuCode: null,
        spuCode: null,
        spuName: null,
        modelName: null,
        proceStep: null,
        createName: null,
        createTime: []
      },
      queryParamQ: {},
      selectOptions: [
        {
          value: "0",
          label: "未处理"
        },
        // {
        //   value: "1",
        //   label: "销售审核"
        // },
        // {
        //   value: "2",
        //   label: "开发审核"
        // },
        // {
        //   value: "3",
        //   label: "财务审核"
        // },
        {
          value: "4",
          label: "审核完成"
        }
      ],
      //复选框相关
      auditFormRules: {
        message: [{ required: false, message: "请填写审批信息", trigger: "blur" }]
      },
      selectRows: [],
      confrimDialogTitle: "",
      confrimDialog: false,
      auditForm: {
        confirmType: "1",
        message: ""
      },
      prdCreateInvoicesList: [],
      searchName: [
        { label: "工厂sku", value: "skuCode" },
        { label: "标准sku", value: "standardSkuCode" }
      ],
      selectValue: "",
      selectLabel: "skuCode"
    }
  },
  created() {},
  mounted: function () {},
  activated() {
    this.getList(this.page)
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //dialog样式修改后添加
    dialogResult(dialogFlage, formName) {
      if (dialogFlage) {
        this.auditForm.confrimType = 1
        this.confrimTypeChange(1)
      } else {
        this.auditForm.confrimType = 0
        this.confrimTypeChange(0)
      }
      this.handleConfrim(formName)
    },

    //当前第几页
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    getList(page, params) {
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.queryParamQ
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    handleFilter(param) {
      this.clearSelectClear()
      // this.page.page = 1;
      this.queryParamQ = deepCloneIgnoreNull(this.queryParam)

      if (this.selectLabel && this.selectValue) {
        param[this.selectLabel] = this.selectValue
      }
      this.getList(this.page, param)
    },
    refreshChange() {
      this.getList(this.page)
    },
    openTag() {
      if (this.screen <= 1) this.$store.commit("SET_COLLAPSE")
      this.$router.push({
        path: "/product/openTag/index/-1"
        // query: { id: "12345" }
      })
    },
    selectionChange(selected) {
      this.selectRows = selected
    },
    confrimDialogClearData() {
      if (this.$refs["auditForm"]) {
        this.$refs["auditForm"].resetFields()
      }
      this.auditForm.confrimType = "1"
      this.auditForm.message = ""
    },
    //下拉反审核
    handleCommand(command) {
      if (command == "销售审核") {
        this.prdlistAudit(1, "销售审核")
      } else if (command == "开发审核") {
        this.prdlistAudit(2, "开发审核")
      } else if (command == "销售反审核") {
        this.rollBackSubmit(2, "开发审核状态")
      } else if (command == "开发反审核") {
        this.rollBackSubmit(3, "财务审核状态")
      }
    },
    /*提交审核*/
    prdlistAuditZero(state, msg) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      //验证当前选中数据的状态是否 与 审核状态一致
      let errorBill = []
      this.prdCreateInvoicesList = []
      this.selectRows.forEach((item) => {
        let bean = {}
        if (state !== item.processStep) {
          errorBill.push(item.invoiceNo)
        } else {
          bean.invoiceId = item.invoiceId
          bean.processStep = item.processStep
          this.prdCreateInvoicesList.push(bean)
        }
      })
      if (errorBill.length > 0) {
        this.$message.warning("单据:" + errorBill + "，不能进行" + msg)
        return
      }
      this.$confirm("是否提交审核", "提交审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.auditComand()
        })
        .catch((res) => {})
    },
    /*销售、开发、财务审核*/
    prdlistAudit(state, msg) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      //验证当前选中数据的状态是否 与 审核状态一致
      let errorBill = []
      this.prdCreateInvoicesList = []
      this.selectRows.forEach((item) => {
        let bean = {}
        if (state !== item.processStep) {
          errorBill.push(item.invoiceNo)
        } else {
          bean.invoiceId = item.invoiceId
          bean.processStep = item.processStep
          this.prdCreateInvoicesList.push(bean)
        }
      })
      if (errorBill.length > 0) {
        this.$message.warning("单据:" + errorBill + "，不能进行" + msg)
        return
      }

      this.confrimDialogTitle = msg
      this.auditFormRules.message = [{ required: false, message: "请填写审批信息", trigger: "blur" }]
      this.confrimDialog = true
    },
    handleConfrim(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        this.auditComand()
      })
    },
    //提交审核
    auditComand() {
      //保存操作
      let bean = {}
      bean.prdCreateInvoicesList = this.prdCreateInvoicesList
      bean.attchObj = this.auditForm
      toExamine(bean)
        .then((response) => {
          if (response.data.code == 0) {
            this.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            })
            this.confrimDialog = false
            this.clearSelectClear()
            this.getList(this.page, this.queryParam)
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
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
    },
    //撤销提交
    cancelSubmit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      let errorBill = []
      this.prdCreateInvoicesList = []
      this.selectRows.forEach((item) => {
        let bean = {}
        if (1 !== item.processStep) {
          errorBill.push(item.invoiceNo)
        } else {
          bean.invoiceId = item.invoiceId
          this.prdCreateInvoicesList.push(bean)
        }
      })
      if (errorBill.length > 0) {
        this.$message.warning("单据:" + errorBill + "，不能进行撤销提交")
        return
      }

      //请求后台
      var _this = this
      this.$confirm("是否确认撤销提交", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return cancelSubmit(_this.prdCreateInvoicesList)
        })
        .then((data) => {
          if (data.data.code === 0) {
            this.$message({
              showClose: true,
              message: "撤销提交成功",
              type: "success"
            })
            this.clearSelectClear()
            this.getList(this.page, this.queryParam)
          } else if (data.data.code === 1) {
            _this.$message.error(data.data.msg)
          } else {
            _this.$message.error("撤销提交失败")
          }
        })
        .catch(function (err) {
          _this.$message({
            type: "info",
            message: "已取消撤销提交"
          })
        })
    },
    //反审核
    rollBackSubmit(state, msg) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }

      let errorBill = []
      this.prdCreateInvoicesList = []
      this.selectRows.forEach((item) => {
        let bean = {}
        if (state != item.processStep) {
          errorBill.push(item.invoiceNo)
        } else {
          bean.invoiceId = item.invoiceId
          this.prdCreateInvoicesList.push(bean)
        }
      })
      if (errorBill.length > 0) {
        if (errorBill.length <= 5) {
          this.$message.warning("单据:" + errorBill + "不处在" + msg + "，不能进行反审核")
        } else {
          this.$message.warning("单据:" + errorBill.splice(0, 4) + "..." + "不处在" + msg + "，不能进行反审核")
        }
        return
      }

      //请求后台
      var _this = this
      this.$confirm("是否确定反审核", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return rollbackSubmit(_this.prdCreateInvoicesList)
        })
        .then((data) => {
          if (data.data.code === 0) {
            this.$message({
              showClose: true,
              message: "反审核成功",
              type: "success"
            })
            this.clearSelectClear()
            this.getList(this.page, this.queryParam)
          } else if (data.data.code === 1) {
            _this.$message.error(data.data.msg)
          } else {
            _this.$message.error("反审核失败")
          }
        })
        .catch(function (err) {
          _this.$message({
            type: "info",
            message: "已取反审核提交"
          })
        })
    },
    searchReset() {
      /* 清空搜索项 */
      this.proceStep = []
      this.queryParam = {
        startDate: null,
        endDate: null,
        invoiceNo: null,
        spuCode: null,
        spuName: null,
        model: null,
        proceStep: null
      }
      this.selectValue = ""
      this.$refs["queryParamForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    proceChange() {
      if (this.proceStep.length > 0) {
        this.queryParam.proceStep = this.proceStep.join(",")
      } else {
        this.queryParam.proceStep = null
      }
    },
    //多选情况下，清空选中
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    //当选框选中回调
    confrimTypeChange(val) {
      if ("0" === val) {
        this.auditFormRules.message = [{ required: true, message: "请填写审批信息", trigger: "blur" }]
      } else {
        this.auditFormRules.message = [{ required: false, message: "请填写审批信息", trigger: "blur" }]
      }
    },
    //查看操作日志
    showOperateLog(id) {
      this.$refs.prdoperatelog.showOperateLogDialog(id, 0)
    },
    //特殊修改权限，未处理和审核完成可以修改
    specialEdit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("请勾选一条数据进行修改")
        return
      }
      var row = this.selectRows[0]
      //未处理和已审核都能修改，但是已审核只支持修改 基本信息/设计清单/样品图片！
      if (row.processStep != 0 && row.processStep != 4) {
        this.$message.warning("只有未处理和已审核完成的数据才能修改！")
        return
      }
      let url = "/product/openTag/edit/" + row.invoiceId
      this.$router.push({
        path: url
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "./index.scss";

// .height{
//   height: 100%;
// }
//  #prdlist{
//         @extend .height;
//          .basic-container{
//           @extend .height;
//           .el-card{
//           @extend .height;
//          }
//          .el-card__body{
//            @extend .height;
//          }
//          .avue-crud{
//            @extend .height;
//          }
//          }

//       }
#prdlist {
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
