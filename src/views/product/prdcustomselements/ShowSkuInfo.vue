<template>
  <div class="execution" id="showSkuInfoId">
    <!-- <basic-container> -->
    <!--查看sku信息-->
    <el-dialog title="关联SKU信息" :visible.sync="showSkuDialog" width="520px" height="60%">
      <el-table :data="gridSkuInfoData" height="360" border>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column property="skuCode" label="SKU代码"></el-table-column>
        <el-table-column property="skuName" label="SKU名称"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showSkuDialog = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- </basic-container> -->
  </div>
</template>

<script>
import { getRelationSku } from "@/api/product/customsElements/prdcustomselements"
import { mapGetters } from "vuex"

export default {
  name: "showSkuInfo",
  props: {
    queryCustomsElementsId: "String",
    required: true
  },
  data() {
    return {
      showSkuDialog: false,
      gridSkuInfoData: {}
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //通过海关id查询关联sku
    findRelationSkuView(id) {
      getRelationSku(id).then((response) => {
        this.gridSkuInfoData = response.data.data
        this.showSkuDialog = true
      })
    }
  }
}
</script>
