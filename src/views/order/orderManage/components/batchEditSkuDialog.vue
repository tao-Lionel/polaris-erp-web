<template>
  <el-dialog title="修改SKU " :visible.sync="showDialog" width="900px">
    <div>
      <avue-crud ref="mateSkuCrud" :data="mateSkuData" :option="mateSkuOption">
        <template slot="imageUrl" slot-scope="scope">
          <img style="width: 60px" :src="scope.row.imageUrl" />
        </template>
        <template slot="opeBtn" slot-scope="scope">
          <a @click="editSku(scope.row)">修改SKU</a>
        </template>
      </avue-crud>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      showDialog: false,
      mateSkuData: [],
      mateSkuOption: {
        height: 350, //固定标题
        page: false,
        align: "center",
        menuAlign: "center",
        border: true, //是否显示边框
        editBtn: true,
        delBtn: false,
        addBtn: false,
        // dialogDisable: [0, 1, 2], //dialog是否可选
        dic: [],
        fixed: false,
        searchShow: true,
        showSearchBtn: true,
        showEmptyBtn: true,
        searchFlag: false,
        searchAdvanced: false, //高级搜索
        // index: true,
        selection: false,
        // indexLabel: '序号',
        stripe: true,
        menu: false,
        viewBtn: false,
        header: false, //是否显示头部
        pageFlag: false, //是否显示分页器

        column: [
          {
            label: "图片",
            prop: "imageUrl",
            solt: true,
            search: false,
            sortable: false,
            width: 100
          },
          {
            label: "品名",
            prop: "skuName",
            sortable: false
          },
          {
            label: "平台SKU",
            prop: "sellerSku",
            sortable: false
          },
          {
            label: "SKU",
            prop: "skuCode",
            sortable: false
          },
          {
            label: "库存",
            prop: "stockNum",
            sortable: false
          },
          {
            label: "操作",
            prop: "opeBtn",
            solt: true,
            sortable: false,
            copy: false
          }
        ]
      },
      row: {}
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog(list, row) {
      this.showDialog = true
      this.row = row
      // 过滤没库存的sku
      this.mateSkuData = list
    },
    editSku(res) {
      // if (res.stockNum === 0) {
      //   this.$message.warning(`SKU：${res.skuCode} 没有库存，无法修改`)
      //   return
      // }

      this.$emit("editSku", res, this.row)
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
