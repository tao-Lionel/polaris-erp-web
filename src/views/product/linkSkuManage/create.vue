<template>
  <basic-container>
    <el-form ref="formRef" :model="form" :rules="formRule" inline label-width="110px">
      <detail-wrapper
        :options="{
          title: '基本信息',
          customContentStyle: {
            padding: '15px'
          }
        }"
      >
        <el-form-item label="平台" prop="platform">
          <el-select
            v-model="form.platform"
            size="small"
            placeholder="请选择平台"
            clearable
            filterable
            :disabled="isEdit"
            @change="changePlatform"
          >
            <el-option
              v-for="item in platformOptions"
              :key="item.platformTypeCode"
              :label="item.platformTypeName"
              :value="item.platformTypeCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站点" prop="site">
          <el-select
            v-model="form.site"
            size="small"
            placeholder="请选择站点"
            clearable
            filterable
            :disabled="isEdit"
            @change="changeSite"
          >
            <el-option v-for="item in sitOptions" :key="item.sitEnName" :label="item.sitEnName" :value="item.sitEnName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺" prop="storeId">
          <el-select
            size="small"
            v-model="form.storeId"
            clearable
            filterable
            placeholder="请选择店铺"
            :disabled="isEdit"
            @change="changeStoreId"
          >
            <el-option
              v-for="item in storeIdOptions"
              :key="item.storeId"
              :label="item.storeAccount"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售状态" prop="saleStatus">
          <el-select v-model="form.saleStatus" clearable filterable placeholder="请选择销售状态" size="small">
            <el-option
              v-for="item in saleStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="产品状态" prop="productStatus">
          <el-select v-model="form.productStatus" placeholder="请选择产品状态" size="small">
            <el-option
              v-for="item in productStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="是否重点SKU" prop="focusStatus">
          <el-select v-model="form.focusStatus" placeholder="请选择是否重点SKU" size="small">
            <el-option
              v-for="item in focusStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="brandId" label="品牌">
          <el-select v-model="form.brandId" size="small" placeholder="请选择品牌" clearable>
            <el-option
              v-for="item in brandOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级负责人" prop="firstLeader">
          <el-select
            v-model="form.firstLeader"
            filterable
            clearable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            placeholder="请输入一级负责人"
            size="small"
          >
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级负责人" prop="secondLeader">
          <el-select
            v-model="form.secondLeader"
            filterable
            clearable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            placeholder="请输入二级负责人"
            size="small"
          >
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营" prop="operator">
          <el-select
            v-model="form.operator"
            filterable
            clearable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            placeholder="请输入运营"
            size="small"
          >
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </detail-wrapper>
      <detail-wrapper
        :options="{
          title: '链接SKU关系',
          customContentStyle: {
            padding: '15px'
          }
        }"
      >
        <avue-crud :data="form.tableData" :option="tableOption" ref="avueRef" :key="form.tableData.length">
          <template slot="spuCode" slot-scope="{ row }">
            <el-form-item :prop="`tableData.${row.$index}.spuCode`" :rules="formRule.spuCode">
              <el-select
                v-model="row.spuCode"
                filterable
                clearable
                remote
                placement="top"
                size="small"
                reserve-keyword
                placeholder="请输入标准SPU"
                :loading="loadingSpuQuery"
                :remote-method="
                  (val) => {
                    remoteMethodSpu(val, row)
                  }
                "
                @change="handleSpuCodeChange($event, row)"
                @focus="focusSpu(row)"
              >
                <el-option v-for="item in row.spuCodeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template slot="parentSkuCode" slot-scope="{ row }">
            <el-form-item :prop="`tableData.${row.$index}.parentSkuCode`" :rules="formRule.parentSkuCode">
              <el-select
                v-model="row.parentSkuCode"
                filterable
                clearable
                remote
                placement="top"
                size="small"
                reserve-keyword
                placeholder="请输入标准SKU"
                :loading="loadingSkuQuery"
                :remote-method="
                  (val) => {
                    remoteMethodSku(val, row)
                  }
                "
                @change="handleSkuCodeChange($event, row)"
                @focus="focusSku(row)"
              >
                <el-option v-for="item in row.skuCodeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <templated slot="linkSpuCode" slot-scope="{ row }">
            <el-form-item :prop="`tableData.${row.$index}.linkSpuCode`" :rules="formRule.linkSpuCode">
              <el-input
                v-model="row.linkSpuCode"
                placeholder="请输入链接SPU"
                size="small"
                :disabled="isEdit"
              ></el-input>
            </el-form-item>
          </templated>
          <template slot="linkSkuCode" slot-scope="{ row }">
            <div>
              <el-form-item :prop="`tableData.${row.$index}.linkSkuCode`" :rules="formRule.linkSkuCode" class="test">
                <el-input
                  v-model="row.linkSkuCode"
                  placeholder="请输入链接SKU"
                  size="small"
                  :disabled="isEdit"
                ></el-input>
              </el-form-item>
            </div>
          </template>
          <template v-if="form.platform === 'AMAZONVC' || form.platform === 'AMAZON'" slot="asin" slot-scope="{ row }">
            <el-input v-model="row.platformSkuId" placeholder="请输入" size="small"></el-input>
          </template>
          <template
            v-if="
              form.platform === 'WALMARTDSV' ||
              form.platform === 'WALMART' ||
              form.platform === 'TIKTOK' ||
              form.platform === 'TEMU'
            "
            slot="platformSkuId"
            slot-scope="{ row }"
          >
            <el-input v-model="row.platformSkuId" placeholder="请输入" size="small"></el-input>
          </template>
          <template v-if="form.platform === 'WALMARTDSV'" slot="platformSkuCode" slot-scope="{ row }">
            <el-input v-model="row.platformSkuCode" placeholder="请输入" size="small"></el-input>
          </template>
          <template
            v-if="
              form.platform === 'WALMARTDSV' ||
              form.platform === 'WALMART' ||
              form.platform === 'TIKTOK' ||
              form.platform === 'TEMU'
            "
            slot="platformItemId"
            slot-scope="{ row }"
          >
            <el-input v-model="row.platformItemId" placeholder="请输入" size="small"></el-input>
          </template>
          <template slot="operate" slot-scope="scope">
            <div style="font-size: 18px; cursor: pointer">
              <i
                v-if="scope.row.$index === form.tableData.length - 1"
                class="el-icon-circle-plus-outline mr-10"
                @click="addList()"
              ></i>
              <i class="el-icon-delete" @click.prevent="delList(scope)"></i>
            </div>
          </template>
        </avue-crud>
      </detail-wrapper>
    </el-form>
    <div style="display: flex; justify-content: center; line-height: 40px">
      <el-button type="primary" size="small" @click="submit">保存</el-button>
      <el-button v-if="id" type="primary" size="small" @click="handleAudit">提交审核</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex"
import { getPlayTypeAll, getSit, getStore, getStoreBySitIds } from "@/api/order/orderManage"
import { getSitInfo } from "@/api/baseSetup/bseplatformsit"
import { getDictByType } from "@/util/auth"
import { fetchBrandAll } from "@/api/product/prdskubrand"
import { fetchList } from "@/api/admin/user"
import { createTableOption } from "./list"
import {
  getBrandOrSpuOrSkuCodeApi,
  saveBatchLinkSkuApi,
  editLinkSkuApi,
  getLinkSkuDetailApi,
  batchUpdateApi
} from "@/api/product/linkSkuMange"
import { deepClone } from "@/util/util"

export default {
  name: "linkSkuManageCreate",
  components: {},
  data() {
    return {
      form: {
        platform: "",
        site: "",
        storeId: "",
        saleStatus: "1",
        // productStatus: "NEW",
        focusStatus: "0",
        brandId: "",
        firstLeader: "",
        secondLeader: "",
        operator: "",
        auditStatus: "",
        tableData: []
      },
      formRule: {
        platform: [{ required: true, message: "请选择平台", trigger: "change" }],
        site: [{ required: true, message: "请选择站点", trigger: "change" }],
        storeId: [{ required: true, message: "请选择店铺", trigger: "change" }],
        saleStatus: [{ required: true, message: "请选择销售状态", trigger: "change" }],
        // productStatus: [{ required: true, message: "请选择产品状态", trigger: "change" }],
        focusStatus: [{ required: true, message: "请选择是否重点", trigger: "change" }],
        brandId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        firstLeader: [{ required: true, message: "请选择一级负责人", trigger: "change" }],
        secondLeader: [{ required: true, message: "请选择二级负责人", trigger: "change" }],
        operator: [{ required: true, message: "请选择操作人", trigger: "change" }],
        spuCode: [{ required: true, message: "请输入标准SPU", trigger: "blur" }],
        parentSkuCode: [{ required: true, message: "请输入标准SKU", trigger: "blur" }],
        linkSpuCode: [{ required: true, message: "请输入链接SPU", trigger: "blur" }],
        linkSkuCode: [{ required: true, message: "请输入链接SKU", trigger: "blur" }]
      },
      platformOptions: [],
      sitOptions: [],
      storeIdOptions: [],
      saleStatusOptions: [],
      productStatusOptions: [],
      focusStatusOptions: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
      brandOption: [],
      options: [],

      tableOption: createTableOption,
      loadingSpuQuery: false,
      loadingSkuQuery: false,
      keySpuMap: {},
      keySkuMap: {},
      id: this.$route.query.id
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    isEdit() {
      return !!this.id
    }
  },
  watch: {},
  created() {},

  mounted: function () {
    this.init()
  },
  methods: {
    async init() {
      this.form.tableData = [
        {
          spuCode: "",
          parentSkuCode: "",
          linkSpuCode: "",
          linkSkuCode: "",
          platformSkuId: "",
          platformSkuCode: "",
          platformItemId: ""
        }
      ]

      let linkSkuSaleStatus = localStorage.getItem("link_sku_sale_status")
      let linkSkuProductStatus = localStorage.getItem("link_sku_product_status")
      let brand_option = localStorage.getItem("brand_option")
      let platform_options = localStorage.getItem("platform_options")
      this.platformOptions = platform_options ? JSON.parse(platform_options) : await this.getPlatform()
      this.saleStatusOptions = linkSkuSaleStatus
        ? JSON.parse(linkSkuSaleStatus)
        : await getDictByType("link_sku_sale_status")
      this.productStatusOptions = linkSkuProductStatus
        ? JSON.parse(linkSkuProductStatus)
        : await getDictByType("link_sku_product_status")
      this.brandOption = brand_option ? JSON.parse(brand_option) : await this.getBrand()
      await this.remoteMethod(undefined)

      if (this.id) {
        this.getDetail()
      }
    },

    async getDetail() {
      const { data } = await getLinkSkuDetailApi(this.id)
      if (data.code === 0) {
        await this.getSitByPlatform(data.data.platform)
        await this.getStoreBySit(data.data.site)
        this.form = {
          platform: data.data.platform,
          site: data.data.site,
          storeId: data.data.storeId,
          saleStatus: data.data.saleStatus,
          // productStatus: data.data.productStatus,
          focusStatus: data.data.focusStatus,
          brandId: data.data.brandId,
          firstLeader: data.data.firstLeader,
          secondLeader: data.data.secondLeader,
          operator: data.data.operator,
          tableData: [
            {
              spuCode: data.data.spuCode,
              parentSkuCode: data.data.parentSkuCode,
              linkSpuCode: data.data.linkSpuCode,
              linkSkuCode: data.data.linkSkuCode,
              platformSkuId: data.data.platformSkuId,
              platformSkuCode: data.data.platformSkuCode,
              platformItemId: data.data?.platformItemId
            }
          ]
        }
      }
    },

    async remoteMethod(query) {
      if (query !== "") {
        const { data } = await fetchList({
          current: 1,
          size: 9999,
          displayname: query
        })
        this.options = data.data.records.map((item) => {
          return { value: item.userId, label: item.displayname }
        })
      } else {
        this.options = []
      }
    },
    // 获取品牌
    async getBrand() {
      const { data } = await fetchBrandAll()
      console.log("data", data)
      if (data.code === 0) {
        data.data.records.forEach((item) => {
          this.brandOption.push({
            value: item.brandId,
            label: item.brandName
          })
        })
      }
    },
    // 获取平台
    async getPlatform() {
      const { data } = await getPlayTypeAll()
      this.platformOptions = this.sortArray(data.data, "platformTypeName")
    },
    // 获取所有站点
    async getSitAll() {
      const { data } = await getSitInfo()
      if (data.code === 0) {
        this.sitOptions = this.sortArray(data.data, "sitEnName")
      }
    },
    // 获取店铺
    async getStoreList(platformCode) {
      let arr = platformCode ? [platformCode] : []
      const { data } = await getStore(arr)
      this.storeIdOptions = this.sortArray(
        data.filter((item) => item.state === "0"),
        "storeAccount"
      )
    },
    // 根据平台获取站点
    async getSitByPlatform(platform = this.form.platform) {
      const { data } = await getSit([platform])
      this.sitOptions = this.sortArray(data, "sitEnName")
    },
    // 根据站点获取店铺
    async getStoreBySit(site) {
      let ids = [this.sitOptions.find((s) => s.sitEnName === site)?.bsePlatformSitId]
      const { data } = await getStoreBySitIds(ids)
      if (data.code === 0) {
        this.storeIdOptions = this.sortArray(data.data, "storeAccount")
      }
    },
    // 排序
    sortArray(arr, field) {
      return arr.sort((a, b) => {
        const nameA = a[field].toUpperCase() // 忽略大小写
        const nameB = b[field].toUpperCase() // 忽略大小写
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    },
    addList() {
      this.form.tableData.push({
        spuCode: "",
        parentSkuCode: "",
        linkSpuCode: "",
        linkSkuCode: "",
        platformSkuId: "",
        platformSkuCode: "",
        platformItemId: ""
      })
    },
    delList(scope) {
      if (this.form.tableData.length === 1) {
        this.$message.warning("至少保留一条数据")
        return
      }
      this.form.tableData.splice(scope.$index, 1)
    },

    async callSpuAndSkuApi(params) {
      const { data } = await getBrandOrSpuOrSkuCodeApi(params)
      return data.data
    },

    async remoteMethodSpu(queryString, row) {
      row.parentSkuCode = ""
      this.loadingSpuQuery = true
      const data = await this.callSpuAndSkuApi({ spuCode: queryString?.trim() })
      this.keySpuMap = data.keySpuMap
      row.spuCodeList = Object.keys(data.keySpuMap)
      this.loadingSpuQuery = false
    },
    handleSpuCodeChange(val, row) {
      row.skuCodeList = this.keySpuMap[val]
    },
    async focusSpu(row) {
      if (row.parentSkuCode) {
        this.loadingSpuQuery = true
        const data = await this.callSpuAndSkuApi({ standardSkuCode: row.parentSkuCode?.trim() })
        this.keySkuMap = data.keySkuMap
        row.skuCodeList = Object.keys(data.keySkuMap)
        row.spuCodeList = this.keySkuMap[row.parentSkuCode]
        this.loadingSpuQuery = false
      }
    },
    async focusSku(row) {
      if (row.spuCode) {
        this.loadingSkuQuery = true
        const data = await this.callSpuAndSkuApi({ spuCode: row.spuCode?.trim() })
        this.keySpuMap = data.keySpuMap
        row.spuCodeList = Object.keys(data.keySpuMap)
        row.skuCodeList = this.keySpuMap[row.spuCode]
        this.loadingSkuQuery = false
      }
    },
    async remoteMethodSku(queryString, row) {
      row.spuCode = ""
      this.loadingSkuQuery = true
      const data = await this.callSpuAndSkuApi({ standardSkuCode: queryString?.trim() })
      this.keySkuMap = data.keySkuMap
      row.skuCodeList = Object.keys(data.keySkuMap)
      this.loadingSkuQuery = false
    },
    handleSkuCodeChange(val, row) {
      row.spuCodeList = this.keySkuMap[val]
    },
    submit() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          let form = deepClone(this.form)
          delete form.tableData
          let params = {
            ...form,
            skuInfoList: this.form.tableData
          }

          let fnApi = saveBatchLinkSkuApi
          if (this.id) {
            fnApi = editLinkSkuApi
            params = {
              ...form,
              id: this.id,
              ...this.form.tableData[0]
            }
          }

          const { data } = await fnApi(params)
          if (data.code === 0) {
            this.$message.success("操作成功")
            this.cancel()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    handleAudit() {
      Object.assign(this.form, { auditStatus: "1" })
      this.submit()
    },
    cancel() {
      this.$refs.formRef.resetFields()
      this.$router.$avueRouter.closeTag()
      this.$router.push({
        path: "/product/linkSkuManage/list"
      })
    },
    // 选择平台
    changePlatform(val) {
      console.log("🥶 ---> changePlatform ---> val👉", val)
      this.form.site = ""
      this.form.storeId = ""
      if (val) {
        this.getSitByPlatform()
      }
    },
    // 选择站点
    changeSite(val) {
      this.form.storeId = ""
      if (val) {
        this.getStoreBySit(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 10px;
}

::v-deep .el-table .el-form-item {
  margin-bottom: 0;
}
</style>
