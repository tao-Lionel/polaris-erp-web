<template>
  <div>
    <basic-container>
      <el-form :model="productSearchForm" ref="createForm" :rules="productRules" label-width="90px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="法人主体" prop="corporationId" style="margin-bottom: 10px">
              <el-select
                v-model="productSearchForm.corporationId"
                size="small"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in corporationOptions"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓 库" prop="warehouseId" style="margin-bottom: 10px">
              <el-select v-model="productSearchForm.warehouseId" size="small" filterable clearable placeholder="请选择">
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                ></el-option
              ></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转入平台" prop="inPlatform" style="margin-bottom: 10px">
              <el-select v-model="productSearchForm.inPlatform" size="small" clearable @change="changeInPlatform">
                <el-option v-for="item in plaTypeOption" :key="item.platformTypeId" :value="item.platformTypeCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转入站点" prop="inSite" style="margin-bottom: 10px">
              <el-select v-model="productSearchForm.inSite" clearable size="small">
                <el-option
                  v-for="item in sitInCountryOptions"
                  :key="item.bsePlatformSitId"
                  :value="item.sitEnName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="总转出数量" prop="totalChangeQuantity" style="margin-bottom: 10px">
              <el-input
                v-model="productSearchForm.totalChangeQuantity"
                size="small"
                placeholder="总转出数量"
                clearable
                style="max-width: 210px"
                @change="changeTotalChangeQuantity"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="addProductData" style="width: 100%; margin-top: 10px" border>
        <el-table-column label="标准SPU" prop="spuCode" width="120"></el-table-column>
        <el-table-column label="转出SKU" prop="outSkuCode" width="120"></el-table-column>
        <el-table-column label="产品名称" prop="skuName" width="120"></el-table-column>
        <el-table-column label="可用库存" prop="availableQuantity"></el-table-column>
        <el-table-column label="转出数量" prop="changeNumber" width="150">
          <template slot="header">
            <span>转出数量<span style="color: red">*</span></span>
          </template>
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.changeNumber"
              size="small"
              placeholder="转出数量"
              clearable
              @change="changeChangeNumber($event, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="海外库龄" prop="overseaStockAge"></el-table-column>
        <el-table-column label="平台站点库龄" prop="platformSiteStockAge" width="120"></el-table-column>
        <el-table-column label="是否共享库存" prop="sharedStock" width="120">
          <template slot="header">
            <span>是否共享库存<span style="color: red">*</span></span>
          </template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.sharedStock" clearable size="small">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="转出平台" prop="outPlatform"></el-table-column>
        <el-table-column label="转出站点" prop="outSite"></el-table-column>
        <el-table-column label="转入SKU" prop="outSkuCode" width="120"> </el-table-column>
        <el-table-column label="库内操作" prop="operaType" width="180">
          <template slot="header">
            <span class="needIn">库内操作</span>
            <el-button type="primary" style="display: inline; margin-left: 10px" size="small" @click="fillOperaType">
              批量填充
            </el-button>
          </template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.operaType" clearable size="small">
              <el-option
                v-for="item in operaTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" style="color: red" @click="delProduct(scope.$index)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div style="display: flex; justify-content: center; padding: 10px">
        <!-- <el-button size="small" type="primary" @click="productSubmitComfrim(0)">保 存</el-button> -->
        <el-button size="small" type="primary" @click="productSubmitComfrim(1)">提交审核</el-button>
        <el-button size="small" @click="goBack">取 消</el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { productRules } from "@/const/crud/warehouse/stockchange/wmsstockchange"
import { getAll as getBsecorporationAll } from "@/api/baseSetup/bsecorporation"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { productSubmit } from "@/api/warehouse/stockchange/wmsstockchange"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getStore as getSession } from "@/util/store"
import { getWmsStockByPramsApi } from "@/api/warehouse/wmsstock"

export default {
  name: "createStockChange",
  components: {},
  data() {
    return {
      productSearchForm: {
        corporationId: "",
        warehouseId: "",
        outPlatform: "",
        outSite: "",
        inPlatform: "",
        inSite: "",
        skuName: "",
        totalChangeQuantity: undefined
      },
      productRules,
      corporationOptions: [],
      warehouseOptions: [],
      addProductData: [],
      sitCountryOptions: [],
      sitInCountryOptions: [],
      operaTypeOption: [
        { value: 0, label: "无" },
        { value: 1, label: "换条码" },
        { value: 2, label: "换箱唛" },
        { value: 3, label: "换条码换箱唛" }
      ],
      corporationId: "",
      warehouseId: ""
    }
  },
  created() {
    this.initInfo()
    this.getBsecorporation()
    this.getWarehouseList()
  },
  activated() {
    console.log("activated")
    this.productSearchForm.totalChangeQuantity = undefined
    const { corporationId, warehouseId } = this.$route.query
    this.corporationId = corporationId
    this.warehouseId = warehouseId
    if (corporationId && warehouseId) {
      this.productSearchForm.corporationId = Number(corporationId)
      this.productSearchForm.warehouseId = Number(warehouseId)
    }
    this.getProductList(corporationId, warehouseId)
  },
  deactivated() {
    this.addProductData = []
  },
  mounted: function () {
    console.log("mounted")
    // const { corporationId, warehouseId } = this.$route.query
    // if (corporationId && warehouseId) {
    //   this.productSearchForm.corporationId = Number(corporationId)
    //   this.productSearchForm.warehouseId = Number(warehouseId)
    // }
    // this.getProductList(corporationId, warehouseId)
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    async initInfo() {
      const { data } = await getPlaTypeAll()
      this.plaTypeOption = data.data
    },
    //获取法人主体
    async getBsecorporation() {
      const { data } = await getBsecorporationAll({})
      if (data.data && data.data.length > 0) {
        this.corporationOptions = data.data
      }
    },
    /**
     * 查询仓库
     */
    async getWarehouseList() {
      var query = {
        funcState: "1",
        delFlag: "0",
        isFba: false
      }
      this.warehouseInOptions = []
      const { data } = await getAllWarehouse(query)
      if (data.data && data.data.length > 0) {
        this.warehouseOptions = data.data
        // for (let index = 0; index < data.length; index++) {
        //   const element = data[index]
        // }
      }
    },
    //选中转入平台-获取平台下的所有站点
    changeInPlatform(val) {
      console.log(123, val)
      const obj = this.plaTypeOption.find((o) => o.platformTypeCode === val)
      const id = obj ? obj.platformTypeId : undefined
      //清空站点值
      this.sitInCountryOptions = []
      this.getPlatformSit(id, "in")
    },
    //根据平台查询站点
    getPlatformSit(val, status) {
      let param = {
        platformTypeId: val
      }
      getSitInfoByPlatformId(param).then((res) => {
        if (status === "in") {
          this.sitInCountryOptions = res.data.data
        } else {
          this.sitCountryOptions = res.data.data
          console.log("sitCountryOptions===", this.sitCountryOptions)
        }
      })
    },
    fillOperaType() {
      if (this.addProductData.length) {
        if (this.addProductData[0].operaType != undefined) {
          this.addProductData.forEach((item) => {
            this.$set(item, "operaType", this.addProductData[0].operaType)
          })
        }
      }
    },
    delProduct(index) {
      if (this.addProductData.length === 1) {
        this.$message.error("至少保留一条数据")
        return
      }
      this.addProductData.splice(index, 1)
      this.reduceChangeNumber()
    },
    async productSubmitComfrim(status) {
      // for (let item of this.addProductData) {
      //   if (item.sharedStock == undefined) {
      //     this.$message.error("请选择是否共享库存")
      //     return
      //   }
      // }

      this.addProductData.forEach((item) => {
        item.inPlatform = this.productSearchForm.inPlatform
        item.inSite = this.productSearchForm.inSite
        item.inSkuId = item.inSkuId
        item.outSkuId = item.outSkuId
        item.sharedStock = item.sharedStock
      })

      this.$refs.createForm.validate(async (valid) => {
        if (valid) {
          let res = await productSubmit({ dataStatus: status, datas: this.addProductData })
          console.log("res", res.data)
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.createFormVisible = false
            this.goBack()
          } else {
            this.$message.error(res.data.msg)
          }
        }
      })
    },
    goBack() {
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    },
    // 获取产品列表
    async getProductList(corporationId, warehouseId, totalChangeQuantity = "") {
      const list = getSession({ name: "warehouseStockChange" })
      const params = {
        corporationId,
        warehouseId,
        list,
        totalChangeQuantity
      }
      const { data } = await getWmsStockByPramsApi(params)
      if (totalChangeQuantity) {
        this.addProductData.forEach((item) => {
          data.data.forEach((cItem) => {
            cItem.key = `${cItem.outSkuCod}_${cItem.overseaStockAge}_${cItem.platformSiteStockAge}_${cItem.outPlatform}`
            if (item.key === cItem.key) {
              item.changeNumber = cItem.changeNumber
            }
          })
        })
      } else {
        this.addProductData = data.data.map((item) => {
          return {
            ...item,
            key: `${item.outSkuCod}_${item.overseaStockAge}_${item.platformSiteStockAge}_${item.outPlatform}` // 唯一键
          }
        })
        list.forEach((item) => {
          this.addProductData.forEach((cItem) => {
            // cItem.outPlatform = item.platform
            cItem.outSite = item.site
            cItem.changeNumber = undefined
          })
        })
      }
    },
    changeTotalChangeQuantity(val) {
      if (!val) return
      const newVal = val.replace(/[^0-9]/g, "")
      if (newVal || newVal === 0) {
        this.productSearchForm.totalChangeQuantity = newVal
      } else {
        this.productSearchForm.totalChangeQuantity = null
      }

      this.getProductList(this.corporationId, this.warehouseId, newVal)
    },

    changeChangeNumber(val, row) {
      if (!val) return
      const newVal = val.replace(/[^0-9]/g, "")
      if (newVal || newVal === 0) {
        this.$set(row, "changeNumber", newVal)
      } else {
        this.$set(row, "changeNumber", null)
      }
      this.reduceChangeNumber()
    },

    reduceChangeNumber() {
      // 累加changeNumber
      this.productSearchForm.totalChangeQuantity = this.addProductData.reduce((prev, cur) => {
        return prev + (Number(cur.changeNumber) || 0)
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped></style>
