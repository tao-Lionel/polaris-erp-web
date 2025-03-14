<template>
  <div id="organizeSettlement_create">
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="详情" name="first">
          <div>
            <el-form label-width="80px" :model="detailForm" ref="detailForm">
              <detail-wrapper :options="{ title: '基本信息' }">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="名称" label-width="50px" prop="listName">
                      <el-input
                        class="el-input--small"
                        v-model="detailForm.listName"
                        placeholder="请输入"
                        size="mini"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="使用组织" prop="corporationId">
                      <el-select
                        v-model="detailForm.corporationId"
                        size="small"
                        placeholder="请选择"
                        clearable
                        disabled
                      >
                        <el-option
                          v-for="item in corporationArr"
                          :key="item.corporationId"
                          :label="item.corporationName"
                          :value="item.corporationId"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="审核状态" prop="currency">
                      <el-select
                        v-model="detailForm.auditStatus"
                        size="small"
                        placeholder="审核状态"
                        disabled
                        clearable
                      >
                        <el-option
                          v-for="item in auditStatus"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="单据编号" prop="currency">
                      <el-input
                        class="el-input--small"
                        v-model="detailForm.listNo"
                        placeholder="请输入"
                        size="mini"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="结算币别" prop="currency">
                      <el-select v-model="detailForm.currency" size="small" placeholder="请选择" clearable disabled>
                        <el-option
                          v-for="item in currencyArr"
                          :key="item.currency"
                          :label="item.currency"
                          :value="item.currency"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="推送状态" prop="currency">
                      <el-select v-model="detailForm.syncStatus" size="small" placeholder="推送状态" disabled clearable>
                        <el-option v-for="item in syncStatus" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="有效时间" prop="timeArr">
                      <el-date-picker
                        disabled
                        style="width: 100%"
                        size="small"
                        v-model="detailForm.timeArr"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '00:00:00']"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注" label-width="40px">
                      <el-input
                        class="el-input--small"
                        style="margin: 5px 0"
                        type="textarea"
                        disabled
                        :autosize="{ minRows: 3, maxRows: 3 }"
                        v-model="detailForm.remark"
                        placeholder="请输入"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </detail-wrapper>
            </el-form>
          </div>

          <!-- 商品信息 -->
          <div>
            <detail-wrapper :options="{ title: '商品明细' }">
              <div style="padding: 10px">
                <avue-crud
                  ref="addSkuCrud"
                  :page="pages"
                  :data="detailList"
                  :option="skuOption"
                  @size-change="sizeChange"
                  @on-load="getDetailOnload"
                  @search-change="toSearchDetail"
                >
                  <template slot="search">
                    <el-form inline>
                      <el-form-item class="rig-ali" prop="categoryId" id="el-form-item" style="margin-bottom: 10px">
                        <el-cascader
                          expand-trigger="hover"
                          v-model="categoryId"
                          :show-all-levels="false"
                          :options="treeCategoryData"
                          @change="handleChange"
                          clearable
                          size="small"
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item size="small" style="margin-bottom: 10px">
                        <el-input v-model="searchForm.skuCode" clearable placeholder="请输入商品编码"></el-input>
                      </el-form-item>
                      <el-form-item size="small" style="margin-bottom: 10px">
                        <el-input v-model="searchForm.skuName" clearable placeholder="请输入商品名称"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </avue-crud>
              </div>
            </detail-wrapper>
          </div>

          <!-- 操作按钮 -->
          <el-row class="pore-submit">
            <el-col :span="24">
              <div class="text-align-right">
                <el-button
                  v-if="detailForm.syncStatus === 'N' && detailForm.auditStatus === 'UN_AUDIT'"
                  type="primary"
                  @click="goEdit"
                  size="small"
                  :loading="loading"
                  >编辑</el-button
                >
                <el-button
                  v-if="detailForm.syncStatus === 'N' && detailForm.auditStatus === 'UN_AUDIT'"
                  type="primary"
                  @click="audit"
                  size="small"
                  :loading="loading"
                  >审 核</el-button
                >
                <el-button
                  v-if="detailForm.syncStatus === 'N' && detailForm.auditStatus === 'AUDITED'"
                  type="danger"
                  @click="reverseAudit"
                  size="small"
                  :loading="loading"
                  >反审核</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="second">
          <!-- 操作日志 -->
          <div>
            <el-form label-width="70px" class="demo-form-inline">
              <detail-wrapper :options="{ title: '操作日志' }">
                <avue-crud ref="opeCrud" :data="logData" :option="logOption"> </avue-crud>
              </detail-wrapper>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { skuOption, logOption } from "@/const/crud/purchase/organizeSettlement"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { fetchList } from "@/api/product/prdarchives_detail"
import { fetchList as getCurrency } from "@/api/baseSetup/bsecurrency"
import { getObjByType } from "@/api/admin/dict"
import { getAll } from "@/api/baseSetup/bsecorporation"
import {
  getDetailInfo,
  poOrgSettlementPriceListDetail,
  settlementPriceAudit,
  settlementPriceReverseAudit,
  getAllBizLog
} from "@/api/purchase/organizeSettlement"

import { getAll as getAllSupplier } from "@/api/supplier/posupplier"

import { deepClone } from "../../../util/util"
export default {
  name: "prdlcreate",
  data() {
    return {
      detailForm: {
        timeArr: []
      },
      searchForm: {
        page: 1,
        pageSize: 20
      },
      pages: {
        total: 0,
        page: 1, // 当前页数新参数
        pageSize: 20 // 每页显示多少条
      },
      detailList: [],
      categoryId: [],
      treeCategoryData: [],
      currencyArr: [],
      corporationArr: [],
      auditStatus: [],
      syncStatus: [],
      skuOption: skuOption,
      logOption: logOption,
      logData: [],
      activeName: "first"
    }
  },
  created() {
    // 品类
    fetchTreeList().then((response) => {
      this.treeCategoryData = response.data.data
      console.log("品类", this.treeCategoryData)
    })
    // 币种
    const params = {
      size: -1,
      current: -1
    }
    getObjByType("org_settlement_price_audit_status").then((res) => {
      this.auditStatus = res.data.data
    })
    getObjByType("org_settlement_price_sync_status").then((res) => {
      this.syncStatus = res.data.data
    })
    getCurrency(params).then((res) => {
      if (res.data.code === 0) {
        this.currencyArr = res.data.data.records
      }
    })
    getAll().then((res) => {
      if (res.data.code === 0) {
        this.corporationArr = res.data.data
      }
    })
    this.getDetailInfo()
    // this.getDetailList()
    const logParams = {
      bizId: 1,
      className: "getAllBizLog",
      size: 20
    }
    getAllBizLog(logParams).then((res) => {
      if (res.data.code === 0) {
      }
    })
  },
  computed: {
    ...mapGetters(["permissions"]),
    supplierObj() {
      const result = {}
      this.supplierOptions.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    }
  },
  methods: {
    handleChange() {
      this.searchForm.categoryId = this.categoryId[this.categoryId.length - 1]
    },
    goEdit() {
      // if (this.$parent.$refs.tagNavigate) {
      //   this.$parent.$refs.tagNavigate.clearTagCache(
      //     this.$route.meta.parentPath
      //   )
      //   this.$parent.$refs.tagNavigate.closeTag(
      //     this.$route.fullPath,
      //   )
      // }
      this.$router.push({
        path: `/purchase/organizeSettlement/edit`,
        query: {
          id: this.$route.query.id
        }
      })
    },
    sizeChange(val) {
      this.pages.pageSize = val
    },
    getDetailOnload(val) {
      this.searchForm.page = val.currentPage
      this.searchForm.pageSize = val.pageSize
      this.getDetailList()
    },
    toSearchDetail() {
      this.searchForm.page = 1
      this.getDetailList()
    },
    getDetailList() {
      this.searchForm.listId = this.$route.query.id
      poOrgSettlementPriceListDetail(
        Object.assign(
          {
            page: this.pages.page,
            pageSize: this.pages.pageSize
          },
          this.searchForm
        )
      ).then((res) => {
        if (res.data.code === 0) {
          this.pages.total = res.data.data.total
          this.detailList = res.data.data.records.map((item) => {
            return {
              skuCode: item.skuCode,
              skuName: item.skuName,
              productSize: item.skuSpecification,
              unitPrice: item.unitPrice
            }
          })
        }
      })
    },
    getDetailInfo() {
      const id = this.$route.query.id
      getDetailInfo({ id: id }).then((res) => {
        if (res.data.code === 0) {
          this.detailForm = res.data.data
          this.$set(this.detailForm, "timeArr", [this.detailForm.effectiveTime, this.detailForm.failureTime])
        }
      })
    },
    audit() {
      settlementPriceAudit([this.detailForm.listNo]).then((res) => {
        if (res.data.code === 0) {
          this.$message.success(`审核成功`)
          this.getDetailInfo()
        } else {
          this.$$message.error(res.data.msg)
        }
      })
    },
    reverseAudit() {
      settlementPriceReverseAudit([this.detailForm.listNo]).then((res) => {
        if (res.data.code === 0) {
          this.$message.success(`反审核成功`)
          this.getDetailInfo()
        } else {
          this.$$message.error(res.data.msg)
        }
      })
    }
  },
  components: {}
}
</script>

<style lang="scss">
#organizeSettlement_create {
  .el-card__body {
    padding: 10px 20px 20px;
  }
  #el-form-item .el-form-item__content {
    line-height: normal;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }
  .el-range-editor.is-disabled input {
    color: #000;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    color: #000;
  }
}
</style>
