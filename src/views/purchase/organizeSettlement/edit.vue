<template>
  <div id="organizeSettlement_edit">
    <basic-container>
      <div>
        <el-form label-width="80px" :rules="rules" :model="createForm" ref="createForm">
          <detail-wrapper :options="{ title: '基本信息' }">
            <el-row>
              <el-col :span="5">
                <el-form-item label="名称" label-width="50px" prop="listName">
                  <el-input
                    class="el-input--small"
                    v-model="createForm.listName"
                    placeholder="请输入"
                    size="mini"
                    :disabled="createForm.auditStatus === 'AUDITED'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="使用组织" prop="corporationId">
                  <el-select
                    v-model="createForm.corporationId"
                    size="small"
                    placeholder="请选择"
                    clearable
                    :disabled="createForm.auditStatus === 'AUDITED'"
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
              <el-col :span="5">
                <el-form-item label="结算币别" prop="currency">
                  <el-select
                    v-model="createForm.currency"
                    size="small"
                    placeholder="请选择"
                    clearable
                    :disabled="createForm.auditStatus === 'AUDITED'"
                  >
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
              <el-col :span="9">
                <el-form-item label="有效时间" prop="timeArr">
                  <el-date-picker
                    style="width: 100%"
                    size="small"
                    :disabled="createForm.auditStatus === 'AUDITED'"
                    :picker-options="pickerOptions"
                    v-model="createForm.timeArr"
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
                    :disabled="createForm.auditStatus === 'AUDITED'"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 3 }"
                    v-model="createForm.remark"
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
        <el-form class="demo-form-inline">
          <detail-wrapper :options="{ title: '商品明细' }">
            <div style="padding: 10px">
              <avue-crud
                ref="skuCrud"
                :page="spages"
                :data="detailList"
                :option="editSkuOption"
                @size-change="editSizeChange"
                @on-load="getDetailOnload"
                @search-change="toSearchDetail"
                @selection-change="handleSelectionChange"
              >
                <template slot="menuLeft">
                  <div>
                    <el-button
                      size="small"
                      type="primary"
                      style="margin-bottom: 10px"
                      @click="addSkuStatus = true"
                      :disabled="createForm.auditStatus === 'AUDITED'"
                      >添加商品</el-button
                    >
                    <el-button
                      size="small"
                      type="danger"
                      style="margin-bottom: 10px"
                      :disabled="!detailListRows.length || createForm.auditStatus === 'AUDITED'"
                      @click="deleteSku"
                      >移除</el-button
                    >
                  </div>
                </template>
                <template slot="search">
                  <el-form-item class="rig-ali" prop="categoryId" id="el-form-item" style="margin-bottom: 10px">
                    <el-cascader
                      expand-trigger="hover"
                      v-model="editCategoryId"
                      :show-all-levels="false"
                      :options="treeCategoryData"
                      @change="editHandleChange"
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
                </template>
                <template slot="unitPrice" slot-scope="scope">
                  <el-input-number
                    :disabled="createForm.auditStatus === 'AUDITED'"
                    v-model="scope.row.unitPrice"
                    placeholder="请输入"
                    :precision="2"
                    style="width: 100%"
                    :controls="false"
                    @change="modifyUnitPrice(scope.row.$index)"
                    :min="0"
                  ></el-input-number>
                </template>
                <template slot="operate" slot-scope="scope">
                  <el-button
                    type="text"
                    @click="deleteDetail(scope.row.$index)"
                    :disabled="createForm.auditStatus === 'AUDITED'"
                    >移除</el-button
                  >
                </template>
              </avue-crud>
            </div>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 操作按钮 -->
      <el-row class="pore-submit">
        <el-col :span="24">
          <div class="text-align-right">
            <el-button
              v-if="createForm.auditStatus === 'UN_AUDIT'"
              type="primary"
              @click="handleSubmit"
              size="small"
              :loading="loading"
              >提 交</el-button
            >
            <!-- <el-button
              type="primary"
              @click="handleSave"
              size="small"
              :loading="loading"
              v-if="permissions.purchase_porequisiton_save && !isSubmit"
            >保 存</el-button> -->
          </div>
        </el-col>
      </el-row>

      <!-- 添加商品弹窗 -->
      <el-dialog title="选择商品" :visible.sync="addSkuStatus" width="50%" @close="addCancel">
        <avue-crud
          ref="addSkuCrud"
          :page="page"
          :data="addSkuData"
          :option="addSkuOption"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="loads"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
        >
          <template slot="search">
            <el-form>
              <el-form-item class="rig-ali exclude-label" prop="categoryId" id="el-form-item">
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
              <el-form-item size="small">
                <el-input v-model="addOrderSearchForm.skuCode" clearable placeholder="请输入SKU"></el-input>
              </el-form-item>
              <el-form-item size="small">
                <el-input v-model="addOrderSearchForm.skuName" clearable placeholder="请输入商品名称"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </avue-crud>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="addCancel">取消</el-button>
          <el-button
            size="small"
            style="padding: 9px 30px"
            type="primary"
            :disabled="!selectRows.length"
            @click="addSave"
            >确认</el-button
          >
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { addSkuOption, rules, editSkuOption } from "@/const/crud/purchase/organizeSettlement"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { fetchList } from "@/api/product/prdarchives_detail"
import { fetchList as getCurrency } from "@/api/baseSetup/bsecurrency"
import { getAll } from "@/api/baseSetup/bsecorporation"
import {
  settlementPriceUpdate,
  getDetailInfo,
  poOrgSettlementPriceListDetail,
  addDetail,
  removeDetail,
  updateDetail
} from "@/api/purchase/organizeSettlement"

import { getAll as getAllSupplier } from "@/api/supplier/posupplier"

import { deepClone } from "../../../util/util"
export default {
  name: "prdlcreate",
  data() {
    return {
      createForm: {
        detailList: [],
        timeArr: []
      },
      searchForm: {
        skuCode: "",
        skuName: "",
        categoryId: "",
        page: 1, // 当前页数
        pageSize: 100 // 每页显示多少条
      },
      spages: {
        total: 0, // 总页数
        page: 1, // 当前页数
        pageSize: 100 // 每页显示多少条
      },
      selectRows: [],
      addSkuStatus: false,
      addOrderSearchForm: {},
      addSkuData: [],
      addSkuOption: addSkuOption,
      categoryId: [],
      editCategoryId: [],
      treeCategoryData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 100 // 每页显示多少条
      },
      currencyArr: [],
      corporationArr: [],
      rules: rules,
      detailList: [],
      detailListRows: [],
      pickerOptions: {
        disabledDate(date) {
          return date.getTime() < new Date().getTime() - 8.64e7
        }
      },
      editSkuOption: editSkuOption
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
    const id = this.$route.query.id
    getDetailInfo({ id: id }).then((res) => {
      if (res.data.code === 0) {
        this.createForm = res.data.data
        this.$set(this.createForm, "timeArr", [this.createForm.effectiveTime, this.createForm.failureTime])
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
    handleSubmit() {
      this.$refs["createForm"].validate((valid) => {
        if (valid) {
          if (!this.detailList.length) {
            this.$message.warning(`商品明细不能为空`)
            return
          }
          for (let i = 0; i < this.detailList.length; i++) {
            if (!this.detailList[i].unitPrice) {
              this.$message.warning(`SKU${this.detailList[i].skuCode}，的含税价格不能为空或者0`)
              return
            }
          }
          this.createForm.effectiveTime = this.createForm.timeArr[0]
          this.createForm.failureTime = this.createForm.timeArr[1]
          this.createForm.detailList = this.detailList.map((item) => {
            return {
              skuCode: item.skuCode,
              unitPrice: item.unitPrice
            }
          })
          settlementPriceUpdate(this.createForm).then((res) => {
            if (res.data.code === 0) {
              this.$message.success(`更新结算价目成功`)
              if (this.$parent.$refs.tagNavigate) {
                this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
                this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
              }
            }
          })
        }
      })
    },
    async deleteDetail(index) {
      console.log(1111, index)
      try {
        const data = await this.$confirm("移除后数据不可恢复，是否继续？", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        const detailListRows = [
          {
            listId: this.$route.query.id,
            id: this.detailList[index].id
          }
        ]
        removeDetail(detailListRows).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("移除成功")
            this.$refs.skuCrud.selectClear()
            this.searchForm.page = 1
            this.searchForm.skuCode = ""
            this.searchForm.skuName = ""
            this.searchForm.categoryId = ""
            this.getDetailList()
          }
        })
      } catch (err) {
        console.log("取消", err)
      }
    },
    handleSelectionChange(val) {
      this.detailListRows = val
    },
    // 商品明细全部逻辑
    editHandleChange() {
      this.searchForm.categoryId = this.editCategoryId[this.editCategoryId.length - 1]
    },
    editSizeChange(val) {
      this.spages.pageSize = val
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
            page: this.spages.page,
            pageSize: this.spages.pageSize
          },
          this.searchForm
        )
      ).then((res) => {
        if (res.data.code === 0) {
          this.spages.total = res.data.data.total
          this.detailList = res.data.data.records.map((item) => {
            return {
              id: item.id,
              skuCode: item.skuCode,
              skuName: item.skuName,
              productSize: item.skuSpecification,
              unitPrice: item.unitPrice
            }
          })
        }
      })
    },

    // 添加商品全部逻辑
    handleChange() {
      this.addOrderSearchForm.category = [this.categoryId[this.categoryId.length - 1]]
    },
    selectionChange(val) {
      this.selectRows = val
    },
    refreshChange() {
      this.getlist()
    },
    sizeChange(val) {
      this.page.pageSize = val
    },
    loads(val) {
      this.page.currentPage = val.currentPage
      this.getlist()
    },
    searchChange() {
      this.page.currentPage = 1
      this.getlist()
    },
    searchReset() {
      this.page.currentPage = 1
      this.categoryId = []
      this.addOrderSearchForm = {}
      this.getlist()
    },
    getlist() {
      fetchList(
        Object.assign(
          {
            current: this.page.currentPage,
            size: this.page.pageSize
          },
          this.addOrderSearchForm
        )
      ).then((res) => {
        console.log(1111)
        this.addSkuStatus = true
        this.addSkuData = res.data.data.records
        this.page.total = res.data.data.total
        this.$refs.addSkuCrud.selectClear()
      })
    },
    async deleteSku() {
      try {
        const data = await this.$confirm("移除后数据不可恢复，是否继续？", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        // for (let i = 0; i < this.detailListRows.length; i++) {
        //   for (let j = 0; j < this.detailList.length; j++) {
        //     if (this.detailListRows[i].skuCode === this.detailList[j].skuCode) {
        //       this.detailList.splice(j, 1)
        //     }
        //   }
        // }
        const detailListRows = this.detailListRows.map((item) => {
          return {
            listId: this.$route.query.id,
            id: item.id
          }
        })
        removeDetail(detailListRows).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("移除成功")
            this.$refs.skuCrud.selectClear()
            this.searchForm.page = 1
            this.searchForm.skuCode = ""
            this.searchForm.skuName = ""
            this.searchForm.categoryId = ""
            this.getDetailList()
          }
        })
      } catch (err) {
        console.log("取消", err)
      }
    },
    modifyUnitPrice(index) {
      const params = [
        {
          listId: this.$route.query.id,
          id: this.detailList[index].id,
          unitPrice: this.detailList[index].unitPrice
        }
      ]
      updateDetail(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("更新成功")
          this.getDetailList()
        }
      })
    },
    addSave() {
      const selectRows = this.selectRows.map((item) => {
        return {
          listId: this.$route.query.id,
          skuCode: item.skuCode,
          unitPrice: 0
        }
      })
      // const mergedArr = this.detailList.concat(selectRows).filter((item, index, self) => {
      //   return index === self.findIndex(obj => (
      //     obj.skuCode === item.skuCode
      //   ));
      // });
      addDetail(selectRows).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("添加成功")
          this.addOrderSearchForm = {}
          this.$refs.addSkuCrud.selectClear()
          this.addSkuStatus = false
          this.searchForm.page = 1
          this.searchForm.skuCode = ""
          this.searchForm.skuName = ""
          this.searchForm.categoryId = ""
          this.getDetailList()
        }
      })
    },
    addCancel() {
      this.addOrderSearchForm = {}
      this.$refs.addSkuCrud.selectClear()
      this.addSkuStatus = false
    }
  },
  components: {}
}
</script>

<style lang="scss">
#organizeSettlement_edit {
  .avue-crud__menu {
    margin-bottom: 0;
  }
  .avue-crud__header {
    margin-bottom: 0;
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
#organizeSettlement_edit {
  #el-form-item .el-form-item__content {
    line-height: normal;
  }
}
</style>
