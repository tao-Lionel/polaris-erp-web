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
  <div class="contractAttachView">
    <basic-container>
      <div>
        <div v-for="(item, index) in pictures" :key="index">
          <img :src="item" width="100%" />
          <img />
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { showPic } from "@/api/purchase/contract/pocontract"
import { mapGetters } from "vuex"
import { getTokenUrl } from "@/util/auth"
export default {
  data() {
    return {
      contractNo: this.$route.query.contractNo,
      acctachType: this.$route.query.acctachType,
      pictures: []
    }
  },
  created() {
    this.getPic()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getPic() {
      var obj = {
        contractNo: this.contractNo,
        acctachType: this.acctachType
      }
      showPic(obj).then((response) => {
        if (response.data.code == 0 && response.data.data != null) {
          response.data.data.forEach((element) => {
            var url = getTokenUrl(element.attachFile)
            this.pictures.push(url)
          })
        }
      })
    }
  }
}
</script>
