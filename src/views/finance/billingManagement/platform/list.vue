<template>
  <div>
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="结算" name="settlement">
          <settlementTable
            v-if="activeName === 'settlement'"
            :params="params"
            @switchTab="handleSwitchTab"
          ></settlementTable>
        </el-tab-pane>
        <el-tab-pane label="账单" name="bill">
          <billTable v-if="activeName === 'bill'" :params="params" @switchTab="handleSwitchTab"></billTable>
        </el-tab-pane>
        <el-tab-pane label="账单明细" name="billDetail">
          <billDetailTable
            v-if="activeName === 'billDetail'"
            :params="params"
            @switchTab="handleSwitchTab"
          ></billDetailTable>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import settlementTable from "./settlementTable.vue"
import billTable from "./billTable.vue"
import billDetailTable from "./billDetailTable.vue"

export default {
  name: "BillingManagementPlatformList",
  components: {
    settlementTable,
    billTable,
    billDetailTable
  },
  computed: {},
  data() {
    return {
      activeName: "settlement",
      params: null
    }
  },
  created() {},
  mounted: async function () {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
      this.params = {}
    },
    handleSwitchTab(tab, params) {
      this.activeName = tab
      this.params = params
    }
  }
}
</script>

<style lang="scss" scoped></style>
