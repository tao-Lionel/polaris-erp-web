<template>
  <div id="purchaseSalesInventory">
    <basic-container>
      <avue-crud
        ref="markedCrud"
        :page="page"
        :data="tableData"
        :option="purchaseSalesInventoryOption"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="月份统计" name="first"></el-tab-pane>
            <el-tab-pane label="月份明细" name="second"></el-tab-pane>
          </el-tabs>
          <el-dropdown-button type="primary" size="small" buttonText="审核" :command="true" @command="handleCommand">
            <el-dropdown-item :command="false">反审核</el-dropdown-item>
          </el-dropdown-button>
          <el-button type="primary" size="small" @click="pushJd">推送金蝶</el-button>
          <el-button type="primary" size="small" @click="showRecord">操作日志</el-button>
          <el-button type="primary" size="small" @click="regenerateReport">重新生成报表</el-button>
          <el-button type="primary" size="small" @click="handleRegenerateAndPush">生成并推送费用</el-button>
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item prop="month" label="">
              <el-date-picker
                size="small"
                v-model="searchForm.month"
                type="month"
                value-format="yyyy-MM"
                :picker-options="pickerOptions"
                placeholder="选择月份"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="corporationCode" label="">
              <el-select v-model="searchForm.corporationCode" size="small" placeholder="库存组织" filterable clearable>
                <el-option
                  v-for="item in corporationArr"
                  :key="item.corporationCode"
                  :label="item.corporationName"
                  :value="item.corporationCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="warehouseCode" label="">
              <el-select v-model="searchForm.warehouseCode" size="small" placeholder="仓库" filterable clearable>
                <el-option
                  v-for="item in warehouseArr"
                  :key="item.warehouseCode"
                  :label="item.warehouseName"
                  :value="item.warehouseCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="processStatus" label="">
              <el-select v-model="searchForm.processStatus" size="small" placeholder="审核状态" filterable clearable>
                <el-option v-for="item in examineArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="pushStatus" label="">
              <el-select v-model="searchForm.pushStatus" size="small" placeholder="推送金蝶" filterable clearable>
                <el-option v-for="item in sendArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="isDifferent" label="差异">
              <el-radio-group v-model="searchForm.isDifferent">
                <el-radio label="">全部</el-radio>
                <el-radio :label="1">有差异</el-radio>
                <el-radio :label="0">无差异</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="inTravelCountDiff">
          <span style="color: #f56c6c" v-if="scope.row.inTravelCountDiff > 0">{{ scope.row.inTravelCountDiff }}</span>
          <span v-else-if="scope.row.inTravelCountDiff === 0">{{ scope.row.inTravelCountDiff }}</span>
          <span style="color: #67c23a" v-else>{{ scope.row.inTravelCountDiff }}</span>
        </template>
        <template slot-scope="scope" slot="stockCountDiff">
          <span style="color: #f56c6c" v-if="scope.row.stockCountDiff > 0">{{ scope.row.stockCountDiff }}</span>
          <span v-else-if="scope.row.stockCountDiff === 0">{{ scope.row.stockCountDiff }}</span>
          <span style="color: #67c23a" v-else>{{ scope.row.stockCountDiff }}</span>
        </template>
        <template slot-scope="scope" slot="operate">
          <router-link
            :to="{
              path: '/financialStatements/purchaseSalesInventoryDetail/detail',
              query: {
                month: scope.row.month,
                corporationCode: scope.row.corporationCode,
                warehouseCode: scope.row.warehouseCode
              }
            }"
            >明细</router-link
          >
        </template>
      </avue-crud>

      <el-dialog
        title="进销存对账单-操作日志"
        :visible.sync="psiStatus"
        width="65%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <avue-crud
          ref="logCrud"
          :page="logPage"
          :data="logData"
          id="purchaseSalesInventoryIndex"
          :option="purchaseSalesInventoryLogOption"
          @current-change="logCurrentChange"
        >
          <template slot="tableBeforeSlot">
            <el-form :inline="true">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item size="small" style="margin-bottom: 10px">
                    <el-date-picker
                      v-model="logForm.bizId"
                      type="month"
                      value-format="yyyy-MM"
                      :picker-options="pickerOptions"
                      placeholder="选择月份"
                      @change="bizIdChange"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item size="small" style="margin-bottom: 10px">
                    <el-select
                      v-model="logForm.operateType"
                      size="small"
                      placeholder="请选择操作类型"
                      clearable
                      @change="operateTypeChange"
                    >
                      <el-option v-for="item in typeArr" :key="item.label" :label="item.label" :value="item.label">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- <el-form-item size="small" style="margin-bottom: 10px">
                <el-button type="primary" @click="logToSearch" size="small">搜索</el-button>
              </el-form-item> -->
            </el-form>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="psiStatus = false">关 闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  finEnterSaleStore,
  checkProcess,
  process,
  pushJieDie,
  checkReverseProcess,
  reverseProcess,
  checkGenerate,
  generate,
  deleteData,
  getBizLogPage,
  getObjByType,
  getAllWarehouseAboutInTransit,
  checkData,
  regenerateAndPushApi
} from "@/api/financialStatements/index"
import { purchaseSalesInventoryOption, purchaseSalesInventoryLogOption } from "@/const/crud/financialStatements/index"
import { getAll } from "@/api/baseSetup/bsecorporation"
import { mapGetters } from "vuex"
import { deepClone } from "@/components/avue/utils/util"

export default {
  name: "bsecurrency",
  data() {
    return {
      psiStatus: false,
      searchForm: {
        month: "",
        corporationCode: "",
        warehouseCode: "",
        pushStatus: "",
        processStatus: "",
        isDifferent: ""
      },
      searchFormConfirm: [],
      searchFormOperator: [
        // { key: 'tmsLogisticsCostTypeName', operator: 'like' }
      ],
      logForm: {
        bizId: "",
        className: "FinEnterSaleStore",
        operateType: ""
      },
      tableData: [],
      purchaseSalesInventoryOption: purchaseSalesInventoryOption,
      purchaseSalesInventoryLogOption: purchaseSalesInventoryLogOption,
      logData: [],
      logPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20]
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      selectRows: [],

      corporationArr: [],
      examineArr: [],
      sendArr: [],
      warehouseArr: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      activeName: "first"
    }
  },
  components: {},
  created() {
    // let now = new Date()
    // let year = now.getFullYear()
    // let month = now.getMonth()
    // month = month < 10 ? "0" + month : month
    // this.searchForm.month = `${year}-${month}`

    // 获取当前日期
    const now = new Date()
    // 设置为上个月的最后一天
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const year = lastMonth.getFullYear()
    // getMonth() 返回 0-11，需要+1 才是实际月份
    const month = String(lastMonth.getMonth() + 1).padStart(2, "0")
    console.log("year", year, month)
    this.searchForm.month = `${year}-${month}`
    this.dataInit()
    this.searchFormConfirm = this.transformSearchForm()
    this.getList()
    this.logForm.bizId = this.searchForm.month
    getObjByType("finance_enter_sale_store_log_type").then((res) => {
      if (res.data.code === 0) {
        this.typeArr = res.data.data
      }
    })
  },
  activated() {
    this.activeName = "first"
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    handleClick() {
      if (this.activeName === "second") {
        this.$router.push({
          path: `/financialStatements/purchaseSalesInventoryDetail/detail`,
          query: {
            month: this.searchForm.month
          }
        })
      }
    },
    logCurrentChange(val) {
      this.logPage.currentPage = val
      this.toSearch()
    },
    logToSearch() {
      if (!this.logForm.bizId) {
        this.$message.warning("请先选择月份！")
        return
      }
      this.logPage.currentPage = 1
      this.toSearch()
    },
    toSearch() {
      let obj = deepClone(this.logForm)
      obj.bizId = obj.bizId.replace("-", "")
      getBizLogPage(
        Object.assign(
          {
            current: this.logPage.currentPage,
            size: this.logPage.pageSize
          },
          obj
        )
      ).then((res) => {
        if (res.data.code === 0) {
          this.logData = res.data.data.records
          this.logPage.total = res.data.data.total
        }
      })
    },
    // 数据初始化
    dataInit() {
      getAll().then((res) => {
        if (res.data.code === 0) {
          this.corporationArr = res.data.data
        }
      })
      getObjByType("finance_enter_sale_store_process_type ").then((res) => {
        if (res.data.code === 0) {
          this.examineArr = res.data.data
        }
      })
      getObjByType("finance_enter_sale_store_push_type").then((res) => {
        if (res.data.code === 0) {
          this.sendArr = res.data.data
        }
      })
      getAllWarehouseAboutInTransit().then((res) => {
        if (res.data.code === 0) {
          this.warehouseArr = res.data.data.filter((item) => item.funcState === "1")
        }
      })
    },
    showPoper(obj, callback) {
      const h = this.$createElement
      this.$msgbox({
        message: h("div", { style: "padding-top:20px;" }, [
          h("p", { style: "text-align: center;font-size:17px;font-weight:bold;" }, obj.title),
          h("p", { style: "text-align: center;padding-top:10px;" }, obj.content)
        ]),
        showCancelButton: obj.showCancel,
        showConfirmButton: obj.showConfirm,
        confirmButtonText: obj.confirmButton,
        cancelButtonText: obj.cancelButton,
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            if (obj.confirmButtonLoading) {
              instance.confirmButtonLoading = obj.confirmButtonLoading
            }
            callback && callback(done, instance)
          } else {
            done()
          }
        }
      })
    },
    // 操作日志
    showRecord() {
      this.psiStatus = true
      this.toSearch()
    },
    async regenerateReport() {
      const { data } = await checkData()
      console.log("data", data)
      if (data.data == 1) {
        this.$alert(
          `<div style="text-align: center"><p style="font-size: 14px; color: #616161; font-weight: 500">请先维护SKU的成本单价后，再继续生成业财单据</p><p style="font-size: 12px; color: #a4a4a4">功能入口：内部交易>内部交易成本维护</p></div>`,
          "內部交易存在SKU缺少成本，无法继续",
          {
            dangerouslyUseHTMLString: true,
            center: true,
            showClose: false,
            showCancelButton: true,
            closeOnPressEscape: true,
            closeOnClickModal: true,
            cancelButtonText: "以后再说",
            confirmButtonText: "去维护价格"
          }
        ).then(() => {
          this.$router.push({
            path: "/transaction/maintainInternalTransactionCost"
          })
        })
      } else {
        this.setReport()
      }
    },
    // 生成报表
    async setReport() {
      if (!this.searchForm.month) {
        this.$message.warning("请选择月份后，在点击重新生成报表！")
        return
      }
      let res = await checkGenerate({ dateMonth: this.searchForm.month })
      if (res.data.code === 0) {
        if (res.data.data.isPush || res.data.data.isProcess) {
          let showPoperObj = {
            title: `${this.searchForm.month.replace("-", "年")}月单据已${
              res.data.data.isPush ? "推送金蝶" : "审核通过"
            }，无法操作`,
            content: `如果确认报表数据有差异，需要重新修正，可操作【删除金蝶本期数据】后，再操作【重新生成报表】`,
            showCancel: true,
            showConfirm: false,
            confirmButton: "",
            cancelButton: "知道了",
            confirmButtonLoading: true
          }
          this.showPoper(showPoperObj, (done, instance) => {
            done()
          })
        }

        if (!res.data.data.isPush && !res.data.data.isProcess) {
          let showPoperObj = {
            title: `确定重新生成${this.searchForm.month.replace("-", "年")}月的进销存报表吗？`,
            content: `重新生成的报表将会覆盖更新上次的报表数据`,
            showCancel: true,
            showConfirm: true,
            confirmButton: "重新生成",
            cancelButton: "考虑一下",
            confirmButtonLoading: true
          }
          this.showPoper(showPoperObj, (done, instance) => {
            generate({ dateMonth: this.searchForm.month })
              .then((res) => {
                if (res.data.code === 0) {
                  instance.confirmButtonLoading = false
                  done()
                  this.$message.success(`账单正在生成中，请10分钟后再次刷新页面查看`)
                  this.getList()
                } else {
                  this.$message.error(res.data.msg)
                }
              })
              .catch((err) => {
                instance.confirmButtonLoading = false
              })
          })
        }
      }
    },
    async handleCommand(val) {
      // 审核
      if (val) {
        if (!this.searchForm.month) {
          this.$message.warning("请选择月份后，在点击审核！")
          return
        }
        let res = await checkProcess({ dateMonth: this.searchForm.month })
        if (res.data.code === 0) {
          if (res.data.data.accountPeriod) {
            let showPoperObj = {
              title: "当前账期未结束，无法操作审核！",
              content: `${this.searchForm.month.replace(
                "-",
                "年"
              )}月数据为临时报表，仅供查询；可等到下月初生成正式报表后，再操作审核！`,
              showCancel: true,
              showConfirm: false,
              confirmButton: "",
              cancelButton: "知道了",
              confirmButtonLoading: true
            }
            this.showPoper(showPoperObj, (done, instance) => {
              done()
            })
          } else if (res.data.data.stockDifference) {
            let showPoperObj = {
              title: `确定${this.searchForm.month.replace("-", "年")}月进销存对账单审核通过？`,
              content: res.data.data.msg,
              showCancel: true,
              showConfirm: true,
              confirmButton: "审核通过",
              cancelButton: "考虑一下",
              confirmButtonLoading: true
            }
            this.showPoper(showPoperObj, (done, instance) => {
              process({ dateMonth: this.searchForm.month })
                .then((res) => {
                  if (res.data.code === 0) {
                    instance.confirmButtonLoading = false
                    done()
                    // this.$message.success(`${this.searchForm.month.replace('-','年')}月进销存对账单审核通过成功！`)
                    this.getList()
                    setTimeout(() => {
                      this.pushData(), 0
                    })
                  } else {
                    this.$message.error(res.data.msg)
                  }
                })
                .catch((err) => {
                  instance.confirmButtonLoading = false
                })
            })
          } else if (!res.data.data.accountPeriod && !res.data.data.stockDifference) {
            let showPoperObj = {
              title: `确定${this.searchForm.month.replace("-", "年")}月进销存对账单审核通过？`,
              content: `审核通过后，将无法再重新生成报表`,
              showCancel: true,
              showConfirm: true,
              confirmButton: "审核通过",
              cancelButton: "考虑一下",
              confirmButtonLoading: true
            }
            this.showPoper(showPoperObj, (done, instance) => {
              process({ dateMonth: this.searchForm.month })
                .then((res) => {
                  if (res.data.code === 0) {
                    instance.confirmButtonLoading = false
                    done()
                    // this.$message.success(`${this.searchForm.month.replace('-','年')}月进销存对账单审核通过成功！`)
                    this.getList()
                    setTimeout(() => {
                      this.pushData(), 0
                    })
                  } else {
                    this.$message.error(res.data.msg)
                  }
                })
                .catch((err) => {
                  instance.confirmButtonLoading = false
                })
            })
          }
        }
        // 反审核
      } else {
        let res = await checkReverseProcess({ dateMonth: this.searchForm.month })
        if (res.data.code === 0) {
          let showPoperObj = {
            title: `确定反审核${this.searchForm.month.replace("-", "年")}月单据`,
            content: `反审核后，${this.searchForm.month.replace(
              "-",
              "年"
            )}月的对账单审核状态将变更为未审核，可操作再次生成报表`,
            showCancel: true,
            showConfirm: true,
            confirmButton: "反审核",
            cancelButton: "考虑一下",
            confirmButtonLoading: true
          }
          this.showPoper(showPoperObj, (done, instance) => {
            reverseProcess({ dateMonth: this.searchForm.month })
              .then((res) => {
                if (res.data.code === 0) {
                  this.$message.success(`${this.searchForm.month.replace("-", "年")}月单据，反审核成功！`)
                  instance.confirmButtonLoading = false
                  this.getList()
                  done()
                } else {
                  this.$message.error(res.data.msg)
                }
              })
              .catch((err) => {
                instance.confirmButtonLoading = false
              })
          })
        }
        if (res.data.code === 1) {
          let showPoperObj = {
            title: `${this.searchForm.month.replace("-", "年")}月数据已推送金蝶，无法反审核`,
            content: `如确定报表数据出错，可操作【删除金蝶本期数据】后，再操作【反审核】`,
            showCancel: true,
            showConfirm: false,
            confirmButton: "",
            cancelButton: "知道了",
            confirmButtonLoading: true
          }
          this.showPoper(showPoperObj, (done, instance) => {
            done()
          })
        }
      }
    },
    pushData() {
      let showPoperObj = {
        title: `${this.searchForm.month.replace("-", "年")}月进销存对账单已审核通过！`,
        content: `可以将${this.searchForm.month.replace("-", "年")}月的所有进销存相关单据推送到金蝶系统！`,
        showCancel: true,
        showConfirm: true,
        confirmButton: "推送金蝶",
        cancelButton: "下次再说",
        confirmButtonLoading: true
      }
      console.log(111111)
      this.showPoper(showPoperObj, (done, instance) => {
        pushJieDie({ dateMonth: this.searchForm.month })
          .then((res) => {
            if (res.data.code === 0) {
              instance.confirmButtonLoading = false
              done()
              this.$message.success(`目前数据正在推送至金蝶系统，需要一定时间，请耐心等待！`)
              this.getList()
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch((err) => {
            instance.confirmButtonLoading = false
          })
      })
    },
    // 推送金蝶
    pushJd() {
      if (!this.searchForm.month) {
        this.$message.warning("请选择月份后，在点击推送金蝶！")
        return
      }
      let showPoperObj = {
        title: `请确保${this.searchForm.month.replace("-", "年")}月进销存对账单已审核通过！`,
        content: `否则${this.searchForm.month.replace("-", "年")}月的所有进销存相关单据无法顺利推送至金碟系统！`,
        showCancel: true,
        showConfirm: true,
        confirmButton: "推送金蝶",
        cancelButton: "下次再说",
        confirmButtonLoading: true
      }
      this.showPoper(showPoperObj, (done, instance) => {
        pushJieDie({ dateMonth: this.searchForm.month })
          .then((res) => {
            if (res.data.code === 0) {
              instance.confirmButtonLoading = false
              done()
              this.$message.success(`目前数据正在推送至金蝶系统，需要一定时间，请耐心等待！`)
              this.getList()
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch((err) => {
            instance.confirmButtonLoading = false
          })
      })
    },
    // 删除
    delReport() {
      if (!this.searchForm.month) {
        this.$message.warning("请选择月份后，在点击删除！")
        return
      }
      let showPoperObj = {
        title: `确定删除${this.searchForm.month.replace("-", "年")}月金蝶进销存单据？`,
        content: `删除后，金蝶进销存相关的所有单据将会删除，且不可恢复数据`,
        showCancel: true,
        showConfirm: true,
        confirmButton: "确定删除",
        cancelButton: "考虑一下",
        confirmButtonLoading: true
      }
      this.showPoper(showPoperObj, (done, instance) => {
        deleteData({ dateMonth: this.searchForm.month })
          .then((res) => {
            if (res.data.code === 0) {
              instance.confirmButtonLoading = false
              done()
              this.$message.success(
                `金蝶${this.searchForm.month.replace("-", "年")}月单据正在删除中，需要一定时间，请耐心等待！`
              )
              this.getList()
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch((err) => {
            instance.confirmButtonLoading = false
          })
      })
    },
    // 刷新回调
    refreshChange() {
      this.getList(this.page)
    },
    // 处理搜索条件
    transformSearchForm() {
      let result = []
      console.log(this.searchForm)
      for (let key in this.searchForm) {
        let value = this.searchForm[key]
        if (typeof value === "string" && value) {
          value = value.split(",")
        }
        if (typeof value === "number") {
          value = String(value).split(",")
        }
        if (value && value.length) {
          result.push({
            field: key,
            value: value
          })
        }
      }
      for (let i = 0; i < this.searchFormOperator.length; i++) {
        result.forEach((item) => {
          if (this.searchFormOperator[i].key === item.field) {
            item.operator = this.searchFormOperator[i].operator
          }
        })
      }
      return result
    },
    // 搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      this.searchFormConfirm = this.transformSearchForm()
      this.getList()
    },
    searchReset() {
      this.$refs["searchForm"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.getList()
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      this.$refs.Crud.toggleSelection()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    getList() {
      finEnterSaleStore(
        Object.assign({
          page: this.page.currentPage,
          pageSize: this.page.pageSize,
          isDifferent: this.searchForm.isDifferent,
          filtering: this.searchFormConfirm
        })
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    operateTypeChange(val) {
      this.logToSearch()
    },
    bizIdChange(val) {
      this.logToSearch()
    },
    async handleRegenerateAndPush() {
      if (!this.searchForm.month) {
        this.$message.warning("请选择月份后，再点击生成并推送费用！")
        return
      }
      const { data } = await regenerateAndPushApi({ dateMonth: this.searchForm.month })
      if (data.code === 0) {
        this.$message.success("生成并推送费用成功！")
      } else {
        this.$message.error(data.msg)
      }
    }
  }
}
</script>

<style lang="scss">
#purchaseSalesInventory > .basic-container > .el-card > .el-card__body {
  padding: 5px 20px;
}

#purchaseSalesInventory {
  #purchaseSalesInventoryIndex {
    .el-row-text {
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical; //垂直方向排列
    }
  }

  .el-radio {
    margin-right: 20px;
  }

  .brandSolt_ope {
    margin-right: 10px;
  }

  .el-select .el-input__inner {
    height: auto !important;
  }

  .el-dialog .el-form-item {
    display: inline-block;
  }
}
</style>
