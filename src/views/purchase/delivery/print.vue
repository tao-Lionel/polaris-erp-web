<template>
  <div>
    <div class="down-button">
      <el-button type="primary" size="small" v-if="permissions.poDelivery_print" @click="contractPrint()"
        >打印</el-button
      >
    </div>
    <div class="print-page">
      <component :is="activeComponent" :gycode="gycode"></component>
    </div>
  </div>
</template>
<script>
import basicInfoIndex from "@/views/purchase/delivery/printContent"
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      gycode: this.$route.query.deliveryNo,
      activeComponent: basicInfoIndex
    }
  },
  mounted: function () {
    // this. downWord();
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getData() {},

    contractPrint() {
      var dom = window.document.getElementById("printPage")
      //由于样式都是#print级联样式，所以这里需要把ID更换一下，这种做法不好，需改进
      dom.id = "print"
      this.$print(dom)
      dom.id = "printPage"
    }
  }
}
</script>
<style scoped>
.down-button {
  padding: 20px;
}
.avue-view {
  background: white;
}
.print-page {
  padding: 35px;
}
</style>
