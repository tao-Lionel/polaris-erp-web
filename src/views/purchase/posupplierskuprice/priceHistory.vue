<template>
  <div class="execution" id="showPriceHistoryInfoId">
    <!-- <basic-container> -->
    <!--查看历史价格信息-->
    <el-dialog title="历史价格信息" :visible.sync="goalDialog" width="80%" height="60%" center>
      <!-- <el-table :data="goalData" max-height="500" border>
            <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
            <el-table-column align="center" property="taxPrice" label="含税单价" ></el-table-column>
            <el-table-column align="center" property="noneTaxPrice" label="非税单价" ></el-table-column>
            <el-table-column align="center" property="taxRate" label="交易税率" ></el-table-column>
            <el-table-column align="center" property="currency" label="币别" ></el-table-column>
            <el-table-column align="center" property="createByName" label="制单人" ></el-table-column>
            <el-table-column align="center" property="createTime" label="单价时间" width="160" ></el-table-column>
            <el-table-column align="center" property="sourceNo" label="源单据" ></el-table-column>
          </el-table> -->
      <avue-crud :data="goalData" :option="priceHistoryOption">
        <template slot="startPriceValidity" slot-scope="scope">
          <span v-if="scope.row.startPriceValidity">{{ scope.row?.startPriceValidity?.split(" ")?.[0] }} 至 </span>
          <span>{{ scope.row?.endPriceValidity?.split(" ")?.[0] }}</span>
        </template>
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="goalDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- </basic-container> -->
  </div>
</template>

<script>
import { getBySupplierNoAndSkuId } from "@/api/purchase/posupplierskupricehistory"
import { mapGetters } from "vuex"
import { priceHistoryOption } from "@/const/crud/purchase/posupplierskuprice"
export default {
  name: "showPriceHistoryInfo",
  props: {
    queryCustomsElementsId: "String",
    required: true
  },
  data() {
    return {
      goalDialog: false,
      goalData: [],
      priceHistoryOption
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //通过海关id查询关联sku
    loadAll(supplierNo, skuId, priceModel) {
      var query = {
        supplierNo: supplierNo,
        skuId: skuId,
        priceModel
      }
      getBySupplierNoAndSkuId(query).then((response) => {
        this.goalData = response.data.data
        for (let index = 0; index < this.goalData.length; index++) {
          const element = this.goalData[index]
          if (element.taxRate) {
            this.goalData[index].taxRate = Math.round(element.taxRate * 100 * 1000) / 1000 + "%"
          }
          if (element.taxType == 2) {
            this.goalData[index].taxRate = ""
          }
        }
        this.goalDialog = true
      })
    }
  }
}
</script>
