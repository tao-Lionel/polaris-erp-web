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
  <div class="declaration-element">
    <basic-container>
      <el-row>
        <el-col :span="24">
          <div class="text-align-center title"><strong>申报要素</strong></div>
        </el-col>
      </el-row>
      <!-- 
            :page="page"
            @search-change="searchChange"
            @row-del="rowDel"
         -->
      <avue-crud ref="crud" @on-load="getDeclareElementInfo" :data="tableData" :option="tableOption"> </avue-crud>
    </basic-container>
  </div>
  <!-- 1 -->
</template>

<script>
import { elementTableOption } from "@/const/crud/logistics/declareCustoms/declaredetail/customsDeclaration"
import { getTokenUrl } from "@/util/auth"
import preview from "@/components/yvue/pdf/index"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import pooperatelog from "@/views/supplier/log/index"
import { getDeclareElement } from "@/api/logistics/declareCustoms/declaredetail/customsDeclaration"
export default {
  name: "declarationElements",
  created() {
    this.getDeclareElementInfo()
  },
  props: {
    numberNo: String
  },
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {},
      auditType: "1",
      selectList: [],
      auditTextarea: "",
      tableData: [],
      tableOption: elementTableOption
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    getDeclareElementInfo() {
      getDeclareElement(this.numberNo).then((res) => {
        this.tableData = res.data.data
        this.tableData.forEach((data) => {
          data.amount = (data.declarePrice * data.declareQuantity).toFixed(2)
        })
      })
    }
  }
}
</script>

<style lang="scss">
.declaration-element {
  .text-align-center {
    text-align: center;
  }
  .title {
    border-radius: 4px;
    min-height: 36px;
    font-size: 26px;
  }
  .basic-container {
    min-height: 500px;
  }
}
</style>
