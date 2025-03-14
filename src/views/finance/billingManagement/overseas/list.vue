<template>
  <div>
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="账单" name="bill">
          <billTable v-if="activeName === 'bill'" :params="params" @switchTab="handleSwitchTab"></billTable>
        </el-tab-pane>
        <el-tab-pane label="费用汇总" name="feeSummary">
          <feeSummary v-if="activeName === 'feeSummary'" :params="params" @switchTab="handleSwitchTab"></feeSummary>
        </el-tab-pane>
        <el-tab-pane label="仓库费用汇总" name="warehouseFees">
          <warehouseFees
            v-if="activeName === 'warehouseFees'"
            :params="params"
            @switchTab="handleSwitchTab"
          ></warehouseFees>
        </el-tab-pane>
        <el-tab-pane label="费用明细" name="feeDetail">
          <feeDetail v-if="activeName === 'feeDetail'" :params="params" @switchTab="handleSwitchTab"></feeDetail>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import billTable from "./billTable.vue"
import warehouseFees from "./warehouseFees.vue"
import feeSummary from "./feeSummary.vue"
import feeDetail from "./feeDetail.vue"

export default {
  name: "BillingManagementOverseasList",
  components: {
    billTable,
    warehouseFees,
    feeSummary,
    feeDetail
  },
  computed: {},
  data() {
    return {
      activeName: "bill",
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
