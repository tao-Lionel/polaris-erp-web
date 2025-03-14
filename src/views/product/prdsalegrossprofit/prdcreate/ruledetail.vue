<template>
  <div class="ruledetail">
    <basic-container>
      <!--头部以及标题信息信息-->
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: titleName,
          list: []
        }"
      >
      </detail-template>

      <div>
        <el-form label-width="70px" class="demo-form-inline">
          <detail-wrapper :options="{ title: '基础信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="规则ID">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.code"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="规则名称">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.name"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="区域">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.districtName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="平台">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.platformCode"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="销售站点">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.salesSiteName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="模式">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.salesModel"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供应商">
                  <el-input
                    class="el-input--small"
                    v-model="supplierObj[ruleDetail.supplierNo]"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="币种">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.currency"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="创建人">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.createrName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.createTime"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="更新人">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.updaterName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="更新时间">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.updateTime"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!--运营配置信息模块-->
      <div v-if="false">
        <el-form class="demo-form-inline" label-width="70px">
          <detail-wrapper :options="{ title: '运营配置信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="目标价格">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.targetPrice"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="FBA配送费">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.deliveryCharge"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!--产品配置信息模块-->
      <div>
        <el-form class="demo-form-inline" label-width="130px">
          <detail-wrapper :options="{ title: '产品配置信息' }">
            <el-row>
              <!-- <el-col :span="6">
                <el-form-item label="品牌">
                  <el-input class="el-input--small" v-model="ruleDetail.brandName" placeholder="暂无数据" :disabled="true"
                    size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="推广费费比" label-width="90px">
                  <el-input class="el-input--small" v-model="ruleDetail.promotionExpensesRate" placeholder="暂无数据"
                    :disabled="true" size="mini"></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="8" v-for="item in ruleDetail.promotionExpensesRateList" :key="item.id">
                <el-form-item label="A品牌推广费费比" v-if="item.brandId === 54">
                  <el-input
                    class="el-input--small"
                    v-model="item.promotionExpensesRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="S品牌推广费费比" v-if="item.brandId === 56">
                  <el-input
                    class="el-input--small"
                    v-model="item.promotionExpensesRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item label="N品牌推广费费比" v-if="item.brandId === 57">
                  <el-input
                    class="el-input--small"
                    v-model="item.promotionExpensesRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!--物流配置信息相关模块-->
      <div>
        <el-form class="demo-form-inline" label-width="70px">
          <detail-wrapper :options="{ title: '物流配置信息' }">
            <el-row>
              <!-- <el-col :span="6">
                <el-form-item label="品类">
                  <el-input class="el-input--small" v-model="ruleDetail.categoryName" placeholder="暂无数据" :disabled="true"
                    size="mini"></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="关税率">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.tariffRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!--财务配置信息相关模块-->
      <div>
        <el-form class="demo-form-inline" label-width="70px">
          <detail-wrapper :options="{ title: '财务配置信息' }">
            <el-row>
              <el-col :span="8">
                <el-form-item label="管理费用费比" label-width="110px">
                  <el-input
                    class="el-input--small"
                    v-model="ruleDetail.managementFeeRate"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { getPrdCalculateRuleDetail } from "@/api/baseSetup/bseplatformtype"
import { getAll as getAllSupplier } from "@/api/supplier/posupplier"

import { deepClone } from "../../../../util/util"
export default {
  name: "prdlcreate",
  data() {
    return {
      titleName: "查看详情",
      ruleDetail: {},
      supplierOptions: []
    }
  },
  created() {
    const id = this.$route.params.id
    this.init(id)
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
    async init(id) {
      const res = await getPrdCalculateRuleDetail({ id })
      this.ruleDetail = res.data.data

      //获取供应商
      getAllSupplier().then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            this.supplierOptions.push({
              value: item.supplierNo,
              label: item.supplierName
            })
          })
        }
      })
    }
  },
  components: {}
}
</script>

<style lang="scss">
// @import "./prdcreate.scss";
.ruledetail .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}
</style>
