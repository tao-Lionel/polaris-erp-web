<!--
  -    Copyright (c) 2018-2025, aukeyit All rights reserved.
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
  - Author: aukeyit (aukeyit@aukeyit.com)
  -->

<template>
  <div class="execution">
    <basic-container>
      <el-alert title="路由配置是非常专业的事情，不建议非工程师操作" type="warning"> </el-alert>
      <vue-json-editor v-model="json" :show-btns="false"></vue-json-editor>
      <div align="center">
        <el-button @click="edit()">更新</el-button>
      </div>
    </basic-container>
  </div>
</template>
<script>
import vueJsonEditor from "vue-json-editor"
import { fallback, fetchList, putObj } from "@/api/admin/route"

export default {
  data() {
    return {
      json: null
    }
  },

  // 注入vueJsonEditor组件
  components: {
    vueJsonEditor
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      fetchList().then((response) => {
        let result = response.data.data
        for (var i = 0; i < result.length; i++) {
          let route = result[i]
          if (route.predicates) {
            let predicates = route.predicates
            route.predicates = JSON.parse(predicates)
          }
          if (route.filters) {
            let filters = route.filters
            route.filters = JSON.parse(filters)
          }
        }
        this.json = result
      })
    },

    edit() {
      putObj(this.json).then((response) => {
        this.$notify({
          title: "成功",
          message: "更新成功",
          type: "success",
          duration: 2000
        })
      })
    }
  }
}
</script>
