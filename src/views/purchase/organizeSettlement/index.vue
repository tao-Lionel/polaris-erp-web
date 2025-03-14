<template>
  <div id="organizeSettlement">
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="结算价目" name="marked">
          <avue-crud
            ref="markedCrud"
            :page="page"
            :data="markedTableData"
            :option="markedTableOption"
            @on-load="markedOnload"
            @refresh-change="markedRefreshChange"
            @search-change="markedSearchChange"
            @search-reset="markedSearchReset"
            @size-change="markedSizeChange"
            @selection-change="markedSelectionChange"
          >
            <template slot="menuLeft">
              <el-button type="primary" @click="createMarked" size="small">新增</el-button>
              <el-dropdown-button
                type="primary"
                size="small"
                buttonText="审核"
                :command="true"
                @command="handleCommand"
              >
                <el-dropdown-item :command="false">反审核</el-dropdown-item>
              </el-dropdown-button>
              <!-- <el-button type="primary" size="small" @click="sendMarkedJd">推送金蝶</el-button> -->
            </template>

            <template slot="search">
              <el-form :model="markedSearchForm" ref="markedSearchForm" :inline="true">
                <el-form-item label="">
                  <el-input
                    v-model="markedSearchForm.listName"
                    v-search-input
                    size="small"
                    placeholder="名称"
                    clearable
                  ></el-input>
                </el-form-item>

                <el-form-item prop="corporationId" label="">
                  <el-select v-model="markedSearchForm.corporationId" size="small" placeholder="使用组织" clearable>
                    <el-option
                      v-for="item in corporationArr"
                      :key="item.corporationId"
                      :label="item.corporationName"
                      :value="item.corporationId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item prop="auditStatus" label="">
                  <el-select v-model="markedSearchForm.auditStatus" size="small" placeholder="审核状态" clearable>
                    <el-option v-for="item in auditStatus" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item prop="syncStatus" label="">
                  <el-select v-model="markedSearchForm.syncStatus" size="small" placeholder="推送状态" clearable>
                    <el-option v-for="item in syncStatus" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>

            <template slot-scope="scope" slot="listNo">
              <router-link :to="{ path: '/purchase/organizeSettlement/detail/', query: { id: scope.row.id } }">{{
                scope.row.listNo
              }}</router-link>
            </template>
            <template slot-scope="scope" slot="auditStatus">
              <el-tag :type="scope.row.auditStatus === 'AUDITED' ? 'success' : 'danger'">
                {{ scope.row.auditStatus === "AUDITED" ? "审核通过" : "未审核" }}
              </el-tag>
            </template>
            <template slot-scope="scope" slot="effectiveTime">
              <p>{{ scope.row.effectiveTime }} 至 {{ scope.row.failureTime }}</p>
            </template>
            <template slot-scope="scope" slot="syncStatus">
              <el-tag :type="scope.row.syncStatus === 'Y' ? 'success' : 'danger'">
                {{ scope.row.syncStatus === "Y" ? "已推送" : "未推送" }}
              </el-tag>
            </template>
            <template slot-scope="scope" slot="brandSolt">
              <div v-if="scope.row.auditStatus === 'UN_AUDIT'">
                <a class="brandSolt_ope" @click="examineMarked(scope.row)">审核</a>
                <router-link :to="{ path: '/purchase/organizeSettlement/edit/', query: { id: scope.row.id } }"
                  >编辑</router-link
                >
              </div>
            </template>
          </avue-crud>
        </el-tab-pane>

        <el-tab-pane label="结算关系" name="relationship">
          <avue-crud
            ref="relationshipCrud"
            :page="sPage"
            :data="relationshipTableData"
            :option="relationshipTableOption"
            @on-load="relationshipOnload"
            @refresh-change="relationshipRefreshChange"
            @search-change="relationshipSearchChange"
            @search-reset="relationshipSearchReset"
            @size-change="relationshipSizeChange"
            @selection-change="relationshipSelectionChange"
          >
            <template slot="menuLeft">
              <el-button type="primary" size="small" @click="rsStatus = true">新增</el-button>
              <el-dropdown-button
                type="primary"
                size="small"
                buttonText="审核"
                :command="true"
                @command="handleRsCommand"
              >
                <el-dropdown-item :command="false">反审核</el-dropdown-item>
              </el-dropdown-button>
              <!-- <el-button type="primary" size="small" @click="sendRsJd">推送金蝶</el-button> -->
            </template>

            <template slot="search">
              <el-form :model="relationshipSearchForm" ref="relationshipSearchForm" :inline="true">
                <el-form-item prop="outOrgId" label="">
                  <el-select v-model="relationshipSearchForm.outOrgId" size="small" placeholder="供货方" clearable>
                    <el-option
                      v-for="item in corporationArr"
                      :key="item.corporationId"
                      :label="item.corporationName"
                      :value="item.corporationId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item prop="inOrgId" label="">
                  <el-select v-model="relationshipSearchForm.inOrgId" size="small" placeholder="接收方" clearable>
                    <el-option
                      v-for="item in corporationArr"
                      :key="item.corporationId"
                      :label="item.corporationName"
                      :value="item.corporationId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item prop="auditStatus" label="">
                  <el-select v-model="relationshipSearchForm.auditStatus" size="small" placeholder="审核状态" clearable>
                    <el-option v-for="item in auditStatus" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item prop="syncStatus" label="">
                  <el-select v-model="relationshipSearchForm.syncStatus" size="small" placeholder="推送状态" clearable>
                    <el-option v-for="item in syncStatus" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>

            <template slot-scope="scope" slot="log">
              <i class="icon-rizhi y-reviews" @click="handleLog(scope.row)"></i>
            </template>

            <template slot-scope="scope" slot="detailNameList">
              <span v-for="(item, index) in scope.row.detailNameList" :key="index"
                >{{ item }}{{ index === scope.row.detailNameList.length - 1 ? "" : "、" }}</span
              >
            </template>
            <template slot-scope="scope" slot="auditStatus">
              <el-tag :type="scope.row.auditStatus === 'AUDITED' ? 'success' : 'danger'">
                {{ scope.row.auditStatus === "AUDITED" ? "审核通过" : "未审核" }}
              </el-tag>
            </template>
            <template slot-scope="scope" slot="effectiveTime">
              <p>{{ scope.row.effectiveTime }} 至 {{ scope.row.failureTime }}</p>
            </template>
            <template slot-scope="scope" slot="syncStatus">
              <el-tag :type="scope.row.syncStatus === 'Y' ? 'success' : 'danger'">
                {{ scope.row.syncStatus === "Y" ? "已推送" : "未推送" }}
              </el-tag>
            </template>
            <template slot-scope="scope" slot="brandSolt">
              <div v-if="scope.row.auditStatus === 'UN_AUDIT'">
                <a class="brandSolt_ope" @click="examineRs(scope.row)">审核</a>
                <a class="brandSolt_ope" @click="editRs(scope.row)">编辑</a>
              </div>
            </template>
          </avue-crud>
        </el-tab-pane>
      </el-tabs>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
    <!-- 新增结算关系 -->
    <el-dialog
      :title="rsAddForm.id ? '编辑结算关系' : '添加结算关系'"
      :visible.sync="rsStatus"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="rsAddCancel"
      id="organizeSettlement_dialog"
    >
      <el-form :model="rsAddForm" ref="rsAddForm" :inline="true" :rules="rsRules">
        <el-form-item prop="outOrgId" label="供货方(应收组织)" style="margin-bottom: 10px">
          <el-select v-model="rsAddForm.outOrgId" size="small" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in corporationArr"
              :key="item.corporationId"
              :label="item.corporationName"
              :value="item.corporationId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="inOrgId" label="接收方(应付组织)" style="margin-bottom: 10px">
          <el-select v-model="rsAddForm.inOrgId" size="small" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in corporationArr"
              :key="item.corporationId"
              :label="item.corporationName"
              :value="item.corporationId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="relationType" label="价格来源" style="margin-bottom: 10px">
          <el-radio-group v-model="rsAddForm.relationType" size="mini">
            <el-radio-button label="PRICE_LIST">价目表</el-radio-button>
            <el-radio-button label="EXPRESSION">公式</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          prop="listIdList"
          label="价目表"
          style="margin-bottom: 10px"
          v-if="rsAddForm.relationType === 'PRICE_LIST'"
        >
          <el-select v-model="rsAddForm.listIdList" size="small" placeholder="请选择" multiple clearable>
            <el-option v-for="item in markedTableData" :key="item.id" :label="item.listName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="commonRate"
          label="价格公式"
          style="margin-bottom: 10px"
          v-else-if="rsAddForm.relationType === 'EXPRESSION'"
        >
          <div>
            <span>采购价</span>
            <span style="margin: 0 10px">x</span>
            <el-input-number
              size="mini"
              min="0.01"
              v-model="rsAddForm.commonRate"
              :controls="false"
              :precision="2"
            ></el-input-number>
          </div>
        </el-form-item>
      </el-form>
      <div style="text-align: center; margin-top: 20px">
        <el-button size="small" style="padding: 9px 30px" @click="rsAddCancel">取消</el-button>
        <el-button size="small" style="padding: 9px 30px" :loading="loadingStatus" type="primary" @click="rsAddConfirm"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  settlementPriceList,
  settlementPriceAudit,
  settlementPriceReverseAudit,
  settlementPriceSync,
  settlementRelationList,
  settlementRelationCreate,
  settlementRelationAudit,
  settlementRelationReverseAudit,
  settlementRelationSync,
  settlementRelationUpdate
} from "@/api/purchase/organizeSettlement"
import { getAll } from "@/api/baseSetup/bsecorporation"
import { getObjByType } from "@/api/admin/dict"
import { markedTableOption, relationshipTableOption, rsRules } from "@/const/crud/purchase/organizeSettlement"
import operationlog from "@/views/baseSetup/bseoperatelog/index"

import { preventShake } from "@/util/tool"
import { getUrlConcatToken, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "bsecurrency",
  data() {
    return {
      activeName: "marked",
      markedSearchForm: {},
      markedTableData: [],
      markedTableOption: markedTableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      selectRows: [],

      relationshipSearchForm: {},
      relationshipTableData: [],
      relationshipTableOption: relationshipTableOption,
      spage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      rsSelectRows: [],

      rsStatus: false,
      rsAddForm: {
        outOrgId: "",
        inOrgId: "",
        listIdList: [],
        relationType: "PRICE_LIST",
        commonRate: 0.01
      },
      rsRules: rsRules,
      corporationArr: [],
      auditStatus: [],
      syncStatus: [],
      treeCategoryData: [], // 品类
      categoryIdArr: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      }
    }
  },
  components: {
    operationlog
  },
  created() {
    this.dataInit()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    // 数据初始化
    dataInit() {
      getAll().then((res) => {
        if (res.data.code === 0) {
          this.corporationArr = res.data.data
        }
      })
      getObjByType("org_settlement_price_audit_status ").then((res) => {
        this.auditStatus = res.data.data
      })
      getObjByType("org_settlement_price_sync_status").then((res) => {
        this.syncStatus = res.data.data
      })
    },
    handleCommand(val) {
      if (!this.selectRows.length) {
        this.$message.warning("请勾选数据！")
        return
      }
      const isSyncStatus = this.selectRows.some((item) => item.syncStatus === "Y")
      if (isSyncStatus) {
        this.$message.warning("请确保勾选的数据都是未推送状态！")
        return
      }
      if (val) {
        const status = this.selectRows.every((item) => item.auditStatus === "UN_AUDIT")
        if (!status) {
          this.$message.warning("请确保勾选的数据都是未审核状态！")
          return
        }
        this.examineMarked()
      } else {
        const status = this.selectRows.every((item) => item.auditStatus === "AUDITED")
        if (!status) {
          this.$message.warning("请确保勾选的数据都是审核通过状态！")
          return
        }
        this.reverseExamineMarked()
      }
    },
    async examineMarked(row) {
      try {
        const data = await this.$confirm("确定审核数据吗", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        const params = row ? [row.listNo] : this.selectRows.map((item) => item.listNo)
        settlementPriceAudit(params).then((res) => {
          if (res.data.code === 0) {
            this.$message.success(`审核成功，已成功审核${row ? 1 : this.selectRows.length}张单据`)
            this.markedGetList()
            this.markedClearSelectClear()
          } else {
            this.$$message.error(res.data.msg)
          }
        })
      } catch (err) {
        console.log("取消", err)
      }
    },
    async reverseExamineMarked(row) {
      try {
        const data = await this.$confirm("确定反审核数据吗", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        const params = row ? [row.listNo] : this.selectRows.map((item) => item.listNo)
        settlementPriceReverseAudit(params).then((res) => {
          if (res.data.code === 0) {
            this.$message.success(`反审核成功，已成功反审核${row ? 1 : this.selectRows.length}张单据`)
            this.markedGetList()
            this.markedClearSelectClear()
          } else {
            this.$$message.error(res.data.msg)
          }
        })
      } catch (err) {
        console.log("取消", err)
      }
    },
    sendMarkedJd() {
      if (!this.selectRows.length) {
        this.$message.warning("请勾选数据！")
        return
      }
      const status = this.selectRows.every((item) => item.auditStatus === "AUDITED")
      if (!status) {
        this.$message.warning("请确保勾选的数据都是审核通过状态！")
        return
      }
      const params = this.selectRows.map((item) => item.id)
      settlementPriceSync(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success(`推送成功，已推送【组织间结算价目表】到金蝶`)
          this.markedGetList()
          this.markedClearSelectClear()
        } else {
          this.$$message.error(res.data.msg)
        }
      })
    },

    // 结算关系
    handleRsCommand(val) {
      if (!this.rsSelectRows.length) {
        this.$message.warning("请勾选数据！")
        return
      }
      const isSyncStatus = this.rsSelectRows.some((item) => item.syncStatus === "Y")
      if (isSyncStatus) {
        this.$message.warning("请确保勾选的数据都是未推送状态！")
        return
      }
      if (val) {
        const status = this.rsSelectRows.every((item) => item.auditStatus === "UN_AUDIT")
        if (!status) {
          this.$message.warning("请确保勾选的数据都是未审核状态！")
          return
        }
        this.examineRs()
      } else {
        const status = this.rsSelectRows.every((item) => item.auditStatus === "AUDITED")
        if (!status) {
          this.$message.warning("请确保勾选的数据都是审核通过状态！")
          return
        }
        this.reverseExamineRs()
      }
    },
    async examineRs(row) {
      try {
        const data = await this.$confirm("确定审核数据吗", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        const params = row ? [row.id] : this.rsSelectRows.map((item) => item.id)
        settlementRelationAudit(params).then((res) => {
          if (res.data.code === 0) {
            this.$message.success(`审核成功，已成功审核${row ? 1 : this.rsSelectRows.length}张单据`)
            this.relationshipGetList()
            this.relationshipClearSelectClear()
          } else {
            this.$$message.error(res.data.msg)
          }
        })
      } catch (err) {
        console.log("取消", err)
      }
    },
    async reverseExamineRs(row) {
      try {
        const data = await this.$confirm("确定反审核数据吗", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        const params = row ? [row.id] : this.rsSelectRows.map((item) => item.id)
        settlementRelationReverseAudit(params).then((res) => {
          if (res.data.code === 0) {
            this.$message.success(`反审核成功，已成功反审核${row ? 1 : this.rsSelectRows.length}张单据`)
            this.relationshipGetList()
            this.relationshipClearSelectClear()
          } else {
            this.$$message.error(res.data.msg)
          }
        })
      } catch (err) {
        console.log("取消", err)
      }
    },
    sendRsJd() {
      if (!this.rsSelectRows.length) {
        this.$message.warning("请勾选数据！")
        return
      }
      const status = this.rsSelectRows.every((item) => item.auditStatus === "AUDITED")
      if (!status) {
        this.$message.warning("请确保勾选的数据都是审核通过状态！")
        return
      }
      const params = this.rsSelectRows.map((item) => item.id)
      settlementRelationSync(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success(`推送成功，已推送【组织间结算关系】到金蝶`)
          this.relationshipGetList()
          this.relationshipClearSelectClear()
        } else {
          this.$$message.error(res.data.msg)
        }
      })
    },
    editRs(row) {
      this.rsAddForm = {
        id: row.id,
        relationExpressionId: row.relationExpressionId,
        relationCode: row.relationCode,
        inOrgId: row.inOrgId,
        listIdList: row.detailIdList,
        outOrgId: row.outOrgId,
        relationType: row.relationType,
        commonRate: row.commonRate ? row.commonRate : 0.01
      }
      this.rsStatus = true
    },
    rsAddCancel() {
      this.rsAddForm = {
        outOrgId: "",
        inOrgId: "",
        listIdList: [],
        relationType: "PRICE_LIST",
        commonRate: 0.01
      }
      this.$refs["rsAddForm"].resetFields()
      this.rsStatus = false
    },
    rsAddConfirm() {
      this.$refs["rsAddForm"].validate((valid) => {
        if (valid) {
          if (this.rsAddForm.inOrgId === this.rsAddForm.outOrgId) {
            this.$message.warning("供货方和接收方不能相同，请重新选择！")
            return
          }
          console.log(this.rsAddForm)
          if (this.rsAddForm.relationType === "PRICE_LIST") {
            this.rsAddForm.commonRate = null
          } else if (this.rsAddForm.relationType === "EXPRESSION") {
            this.rsAddForm.listIdList = []
          }
          if (this.rsAddForm.id) {
            settlementRelationUpdate(this.rsAddForm).then((res) => {
              this.$message.success(`编辑结算关系成功`)
              this.rsAddCancel()
              this.relationshipGetList()
            })
          } else {
            settlementRelationCreate(this.rsAddForm).then((res) => {
              this.$message.success(`新增结算关系成功`)
              this.rsAddCancel()
              this.relationshipGetList()
            })
          }
        }
      })
    },

    createMarked() {
      this.$router.push({
        path: `/purchase/organizeSettlement/create`
      })
    },

    // 结算关系
    // 刷新回调
    relationshipRefreshChange() {
      this.relationshipGetList()
    },
    // 搜索回调
    relationshipSearchChange() {
      this.spage.currentPage = 1
      this.relationshipGetList()
    },
    relationshipSearchReset() {
      this.relationshipSearchForm = {}
    },
    // 页大小回调
    relationshipSizeChange(val) {
      this.spage.pageSize = val
    },
    //选中行事件
    relationshipSelectionChange(selection) {
      this.rsSelectRows = selection
    },
    relationshipClearSelectClear() {
      this.$refs.relationshipCrud.toggleSelection()
    },
    relationshipOnload(val) {
      this.spage.currentPage = val.currentPage
      this.spage.pageSize = val.pageSize
      this.relationshipGetList()
    },
    relationshipGetList() {
      settlementRelationList(
        Object.assign(
          {
            page: this.spage.currentPage,
            pageSize: this.spage.pageSize
          },
          this.relationshipSearchForm
        )
      ).then((response) => {
        this.relationshipTableData = response.data.data.records
        this.spage.total = response.data.data.total
      })
    },

    // 结算价目
    // 刷新回调
    markedRefreshChange() {
      this.markedGetList(this.page)
    },
    // 搜索回调
    markedSearchChange(params, page) {
      this.page.currentPage = 1
      this.markedGetList()
    },
    markedSearchReset() {
      this.markedSearchForm = {}
    },
    // 页大小回调
    markedSizeChange(val) {
      this.page.pageSize = val
    },
    //选中行事件
    markedSelectionChange(selection) {
      this.selectRows = selection
    },
    markedClearSelectClear() {
      this.$refs.markedCrud.toggleSelection()
    },
    markedOnload(val) {
      this.page.currentPage = val.currentPage
      this.page.pageSize = val.pageSize
      this.markedGetList()
    },
    markedGetList() {
      settlementPriceList(
        Object.assign(
          {
            page: this.page.currentPage,
            pageSize: this.page.pageSize
          },
          this.markedSearchForm
        )
      ).then((response) => {
        this.markedTableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    handleLog(row) {
      this.$refs.operationlog.showOperateLogDialog(row.id, "PoOrgSettlementRelation", true)
    }
  }
}
</script>

<style lang="scss">
#organizeSettlement > .basic-container > .el-card > .el-card__body {
  padding: 5px 20px;
}
#organizeSettlement {
  #organizeSettlement_dialog {
    .el-select__tags > span {
      // text-overflow: initial;
      // overflow: initial;
      // white-space: initial
    }
  }
  .brandSolt_ope {
    margin-right: 10px;
  }
  // .el-select .el-input__inner{
  //   height: auto !important;
  // }
}
</style>
