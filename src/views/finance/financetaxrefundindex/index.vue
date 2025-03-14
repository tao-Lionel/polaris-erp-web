<!--
  -    Copyright (c) 2018-2025, Aukey All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the trob4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: wangbin (AukeyIT@aukeys.com)
  -->

<template>
  <div class="finance-tax-refund-index" id="finance-tax-refund-index">
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="退税预审管理" name="tab_a">
          <div v-if="activeName == 'tab_a'">
            <financetaxrefundmanage></financetaxrefundmanage>
          </div>
        </el-tab-pane>

        <el-tab-pane label="退税管理" name="tab_b">
          <div v-if="activeName == 'tab_b'">
            <findrawbackmanage></findrawbackmanage>
          </div>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import financetaxrefundmanage from "../financetaxrefundmanage/index"
import findrawbackmanage from "../findrawbackmanage/index"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "finance-tax-refund-index",
  components: {
    financetaxrefundmanage,
    findrawbackmanage
  },
  data() {
    return {
      activeName: "tab_a"
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    handleClick(tab, event) {}
  }
}
</script>

<style lang="scss" scoped>
#finance-tax-refund-index {
  @media (max-width: 1279px) {
    .avue-crud__menu .el-select {
      width: auto !important;
    }
    .avue-crud__menu .el-input {
      width: 140px;
    }
    .avue-crud__menu .el-form-item__label {
      padding-right: 5px;
    }
    .avue-crud__menu .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    .el-form-item {
      margin-bottom: 5px;
    }
  }
}
</style>
