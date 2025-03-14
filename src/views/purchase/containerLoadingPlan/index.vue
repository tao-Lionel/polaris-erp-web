<template>
  <div id="containerLoadingPlan">
    <basic-container>
      <keep-alive>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="待排柜（非DI订单）" name="first">
            <NotDiList ref="NotDiList" :selectOptionData="selectOptionData" />
          </el-tab-pane>
          <el-tab-pane label="待排柜（DI订单）" name="second">
            <DiList ref="DiList" :selectOptionData="selectOptionData" />
          </el-tab-pane>
          <el-tab-pane label="已排柜（全部）" name="third">
            <AllList ref="AllList" :selectOptionData="selectOptionData" />
          </el-tab-pane>
        </el-tabs>
      </keep-alive>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import NotDiList from "./notDiList.vue"
import DiList from "./diList.vue"
import AllList from "./allList.vue"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getAll as getAllCorporationApi } from "@/api/baseSetup/bsecorporation"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { getObjByType } from "@/api/admin/dict.js"
export default {
  name: "containerLoadingPlan",
  components: { NotDiList, DiList, AllList },
  data() {
    return {
      activeName: "first",
      selectOptionData: {
        supplierOptions: [],
        platform: [],
        treeCategoryData: [],
        warehouseOptions: [],
        corporationList: [],
        departureHarbourList: []
      }
    }
  },
  watch: {
    activeName: {
      handler(val) {
        if (val === "first") {
          this.$refs.NotDiList.getList()
        } else if (val === "second") {
          this.$refs.DiList.getList()
        } else if (val === "third") {
          this.$refs.AllList.getList()
        }
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    init() {
      this.getSupplierAll()
      this.getPlatform()
      this.getWarehouseList()
      this.getCorporation()
      this.getCategory()
      getObjByType("departure_harbour").then((res) => {
        if (res.data.code === 0) {
          this.selectOptionData.departureHarbourList = res.data.data
        }
      })
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        this.selectOptionData.supplierOptions = data.data.map((item) => {
          return {
            value: item.supplierNo,
            label: item.supplierName
          }
        })
      }
    },
    getPlatform() {
      getPlaTypeAll().then((res) => {
        if (res.data.code == 0) {
          this.selectOptionData.platform = this.sortArray(res.data.data, "platformTypeName")
        }
      })
    },
    /**
     * 查询仓库
     */ getWarehouseList() {
      var query = {
        funcState: "1",
        delFlag: "0",
        isFba: false
      }
      this.warehouseInOptions = []
      getAllWarehouse(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.selectOptionData.warehouseOptions = data.map((item) => {
            return {
              value: item.warehouseId,
              label: item.warehouseName
            }
          })
        }
      })
    },
    getCategory() {
      //品类
      fetchTreeList().then((response) => {
        this.selectOptionData.treeCategoryData = response.data.data
      })
    },
    // 获取法人主体
    async getCorporation() {
      const { data } = await getAllCorporationApi()
      if (data.code === 0) {
        this.selectOptionData.corporationList = data.data
      }
    },
    // 排序
    sortArray(arr, field) {
      return arr.sort((a, b) => {
        const nameA = a[field].toUpperCase()
        const nameB = b[field].toUpperCase()
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
