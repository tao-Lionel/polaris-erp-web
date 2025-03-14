<template>
  <div id="prdcombproduct_detail">
    <basic-container>
      <div>
        <el-form label-width="120px" :model="detailForm" ref="detailForm" :rules="detailRules">
          <detail-wrapper :options="{ title: '基本信息' }">
            <el-row>
              <el-col :span="18">
                <el-form-item label="组合商品名称:" prop="name">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.name"
                    placeholder="请输入"
                    size="mini"
                    :disabled="model == 'detail'"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="组合商品编码:" prop="code">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.code"
                    placeholder="请输入"
                    size="mini"
                    :disabled="model == 'detail'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="销售状态:" prop="saleStatus">
                  <el-select
                    v-model="detailForm.saleStatus"
                    size="small"
                    placeholder="请选择"
                    clearable
                    :disabled="model == 'detail'"
                  >
                    <el-option
                      v-for="item in saleStatusOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="备注:" prop="remark">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.remark"
                    placeholder="请输入"
                    size="mini"
                    :disabled="model == 'detail'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="是否拆分:" prop="split">
                  <el-select v-model="detailForm.split" size="small" placeholder="请选择" clearable disabled>
                    <el-option v-for="item in splitOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 商品信息 -->
      <div>
        <detail-wrapper :options="{ title: '组合关系' }">
          <div style="padding: 10px">
            <avue-crud ref="addSkuCrud" :data="detailList" :option="prdOption" @on-load="getDetailOnload">
              <template slot-scope="scope" slot="skuCode">
                <el-select
                  v-model="scope.row.skuCode"
                  popper-class="y-form-select"
                  filterable
                  remote
                  placement="top"
                  size="mini"
                  reserve-keyword
                  placeholder="请检索输入"
                  :remote-method="fetchSuggestions"
                  :loading="loadingSkuQuery"
                  @change="handleSelectSkuCode(scope.row)"
                  :disabled="model == 'detail'"
                >
                  <el-option
                    v-for="item in skuList"
                    :key="item.skuId"
                    :label="item.skuCode"
                    :value="item.skuCode"
                  ></el-option>
                </el-select>
              </template>
              <template slot-scope="scope" slot="num">
                <el-input
                  class="el-input--small"
                  v-model="scope.row.num"
                  placeholder="请输入数量"
                  size="small"
                  :disabled="model == 'detail'"
                  type="number"
                  @change="validateInput(scope.row)"
                ></el-input>
              </template>
              <template slot-scope="scope" slot="price">
                <el-input
                  class="el-input--small"
                  v-model="scope.row.price"
                  type="number"
                  @change="validatePriceInput(scope.row)"
                  placeholder="请输入标准售价"
                  size="small"
                  :disabled="model == 'detail'"
                ></el-input>
              </template>
              <template slot-scope="scope" slot="operate">
                <div class="operateBtn">
                  <el-button
                    type="text"
                    size="small"
                    @click="addDetail(scope)"
                    style="font-size: 20px"
                    icon="el-icon-circle-plus-outline"
                    circle
                    :disabled="model == 'detail' || detailForm.checkStatus == 'PASS'"
                  ></el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="delDetail(scope)"
                    v-if="detailList.length > 1"
                    style="font-size: 20px; color: red"
                    icon="el-icon-remove-outline"
                    circle
                    :disabled="model == 'detail' || detailForm.checkStatus == 'PASS'"
                  ></el-button>
                </div>
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
              type="primary"
              @click="submitBundle(model)"
              size="small"
              :loading="loading"
              :disabled="model == 'detail'"
              >提 交</el-button
            >
            <el-button @click="submitBack" size="small" :loading="loading">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { prdOption } from "../../../const/crud/product/prdcombproduct"
import { getBundle, batchCreate, updateBundle } from "@/api/product/prdcombproduct"
import { getObjByType } from "@/api/admin/dict"
import { getByLikeSkuCodeAndCreateAuditComplete } from "@/api/product/prdsku"

import { deepClone } from "../../../util/util"
export default {
  name: "prdcombproduct",
  data() {
    return {
      detailForm: {
        split: true
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
      currencyArr: [],
      corporationArr: [],
      auditStatus: [],
      syncStatus: [],
      prdOption: prdOption,
      saleStatusOption: [
        { label: "在售", value: "ON_SALE" },
        { label: "停售", value: "STOP_SALE" }
      ],
      splitOption: [
        { label: "是", value: true },
        { label: "否", value: false }
      ],
      detailRules: {
        name: [{ required: true, message: "组合商品名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "组合商品名称不能为空", trigger: "blur" }],
        saleStatus: [{ required: true, message: "组合商品名称不能为空", trigger: "blur" }]
      },
      model: "create",
      loadingSkuQuery: false,
      skuList: []
    }
  },
  created() {
    this.model = this.$route.query.type
    const id = this.$route.query.id
    console.log(this.model !== "create")
    if (this.model !== "create") {
      this.getDetailList(id)
    }
    if (!this.detailList || this.detailList.length == 0) {
      this.detailList.push({
        skuCode: "",
        skuId: "",
        num: null,
        price: null
      })
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    validateInput(row) {
      // 验证输入值
      const regex = /^[1-9]\d*$/
      if (!regex.test(row.num)) {
        // 输入值不符合要求，进行处理
        row.num = null
        this.$message.warning("数量请输入大于或等于1的整数！")
      }
    },
    validatePriceInput(row) {
      // 验证输入值
      const regex = /^(?!0\d)\d+(\.\d{1,2})?$/
      if (!regex.test(row.price)) {
        // 输入值不符合要求，进行处理
        row.price = null
        this.$message.warning("售价请输入大于或等于0的小数，最多两位小数！")
      }
    },
    submitBundle(type) {
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.detailList.length; i++) {
            const obj = this.detailList[i]
            if (!obj.num) {
              this.$message.error(`${obj.skuCode ? obj.skuCode : "请检查数据"} ：数量 不能为空`)
              return
            }
            if (!obj.price) {
              this.$message.error(`${obj.skuCode ? obj.skuCode : "请检查数据"} ：售价 不能为空`)
              return
            }
          }
          let params = {
            ...this.detailForm,
            bundleRelationCmdList: this.detailList
          }
          if (type == "create") {
            batchCreate([params]).then((res) => {
              if (res.data.code == 0) {
                this.$message.success("操作成功")
                this.submitBack()
              } else {
                this.$message.error(res.data.msg)
              }
            })
          }
          if (type == "edit") {
            updateBundle(params).then((res) => {
              if (res.data.code == 0) {
                this.$message.success("操作成功")
                this.submitBack()
              } else {
                this.$message.error(res.data.msg)
              }
            })
          }
        }
      })
    },
    submitBack() {
      this.$router.$avueRouter.closeTag()
      this.$router.push({ path: "/product/prdcombproduct/list" })
    },
    addDetail(scope) {
      const cloneRow = deepClone(scope.row)
      cloneRow.skuCode = ""
      cloneRow.skuId = ""
      cloneRow.num = null
      cloneRow.skuName = ""
      cloneRow.price = null
      this.detailList.splice(scope.$index + 1, 0, cloneRow)
    },
    delDetail(scope) {
      this.detailList.splice(scope.$index, 1)
    },
    sizeChange(val) {
      this.pages.pageSize = val
    },
    getDetailOnload() {
      // this.getDetailList()
    },
    getDetailList(id) {
      console.log(id)
      getBundle({ id }).then((res) => {
        console.log(res.data)
        if (res.data.code == 0) {
          res.data.data.relationVOList.forEach((item) => {
            item.name = item.skuName
          })
          this.detailForm = res.data.data
          this.detailList = res.data.data.relationVOList
        }
      })
    },
    //sku检索输入
    fetchSuggestions(queryString) {
      let queryParams = {
        isHideLoading: true,
        skuCode: queryString ? queryString.trim() : queryString,
        codes: "1000"
      }
      this.loadingSkuQuery = true
      getByLikeSkuCodeAndCreateAuditComplete(queryParams).then((response) => {
        this.loadingSkuQuery = false
        this.skuList = response.data.data
      })
    },
    //选中sku
    handleSelectSkuCode(item) {
      console.log(item)
      var skuInfo = this.skuList.filter((sku) => {
        return sku.skuCode === item.skuCode
      })
      if (skuInfo.length === 0) {
        return
      }
      item.skuId = skuInfo[0].skuId
      item.skuCode = skuInfo[0].skuCode
      item.skuName = skuInfo[0].skuName
    }
  },
  components: {}
}
</script>

<style lang="scss">
#prdcombproduct_detail {
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

  .operateBtn {
    .el-button {
      width: 42px;
      height: 42px;
    }
  }
}
</style>
