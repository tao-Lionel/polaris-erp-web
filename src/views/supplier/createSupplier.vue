<template>
  <div id="createSupplier">
    <basic-container>
      <div class="banner-text">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first"></el-tab-pane>
          <el-tab-pane label="联系人" name="second"></el-tab-pane>
          <el-tab-pane label="银行账户" name="third"></el-tab-pane>
          <el-tab-pane label="税务信息" name="fourth"></el-tab-pane>
          <el-tab-pane label="合同条款" name="fifth"></el-tab-pane>
        </el-tabs>
        <keep-alive>
          <component
            class="create-active"
            :is="activeComponent"
            @save-success="saveSuccess"
            :gycode="gycode"
          ></component>
        </keep-alive>

        <!-- <basicInfoIndex @save-success="savesuccess" :gycode='gycode' -->
      </div>
    </basic-container>
  </div>
</template>

<script>
// 基本信息
import basicInfoIndex from "@/views/supplier/posupplier/index"
// 联系人
import suppliercontactsIndex from "@/views/supplier/posuppliercontacts/index"
// 银行账户
import supplieraccountIndex from "@/views/supplier/posupplieraccount/index"
// 税务信息
import supplyTaxIndex from "@/views/supplier/posupplier/supplyTaxIndex"
// 合同条款
import supplyOtherIndex from "@/views/supplier/posupplierOther/index"
export default {
  data() {
    return {
      gycode: "",
      activeName: "first",
      activeComponent: basicInfoIndex
      // activeName: 'fifth',
      // activeComponent:supplyOtherIndex
    }
  },
  created() {},
  methods: {
    handleClick(tab, event) {
      if (this.activeName === "first") {
        this.activeComponent = basicInfoIndex
      } else if (this.activeName === "second") {
        this.activeComponent = suppliercontactsIndex
      } else if (this.activeName === "third") {
        this.activeComponent = supplieraccountIndex
      } else if (this.activeName === "fourth") {
        this.activeComponent = supplyTaxIndex
      } else if (this.activeName === "fifth") {
        this.activeComponent = supplyOtherIndex
      }
    },
    saveSuccess(gycode) {
      this.gycode = gycode
    }
  }
}
</script>
<style lang="scss">
#createSupplier {
  .create-active .basic-container,
  .create-active .el-card__body {
    padding: 0;
  }
}
</style>
