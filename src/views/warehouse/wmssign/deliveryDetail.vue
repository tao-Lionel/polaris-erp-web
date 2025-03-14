<template>
  <div class="execution" id="showDeliveryDetail">
    <basic-container>
      <!--查看送货产品详情-->
      <el-dialog title="送货产品详情" :visible.sync="goalDialog" width="60%" height="60%" center>
        <div style="margin-bottom: 10px">
          币别： <span>{{ currency }}</span>
        </div>
        <avue-crud :data="data" :option="tableOption"> </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="goalDialog = false">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { getHistoryData } from "@/api/purchase/delivery/podeliverydetail"
import { tableOptionDetail } from "@/const/crud/warehouse/wmssign"
import { mapGetters } from "vuex"

export default {
  name: "showDeliveryDetail",
  data() {
    return {
      goalDialog: false,
      tableOption: tableOptionDetail,
      data: [],
      currency: ""
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //通过海关id查询关联sku
    loadAll(deliveryNo) {
      getHistoryData(deliveryNo).then((response) => {
        if (response.data.code == 0) {
          var entity = response.data.data
          this.currency = entity.currency
          this.data = entity.detailList
          this.goalDialog = true
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
