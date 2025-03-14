<template>
  <div class="y-prd-index" id="y-prd-index">
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="品牌" name="first">
          <div v-if="activeName == 'first'">
            <prdskubrand></prdskubrand>
          </div>
        </el-tab-pane>

        <el-tab-pane label="品类" name="second">
          <div v-if="activeName == 'second'">
            <prdskucategory></prdskucategory>
          </div>
        </el-tab-pane>

        <el-tab-pane label="属性" name="third">
          <div v-if="activeName == 'third'">
            <prdattribute></prdattribute>
          </div>
        </el-tab-pane>

        <!-- <el-tab-pane label="型号" name="fourth">
          <div v-if="activeName == 'fourth'">
            <prdskumodel></prdskumodel>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </basic-container>
  </div>
</template>
<script>
// 品牌
import prdskubrand from "../prdskubrand/index.vue"
// 品类
import prdskucategory from "../prdskucategory/index.vue"

// 属性
import prdattribute from "../prdattribute/index.vue"
// 型号
import prdskumodel from "../prdskumodel/index"
export default {
  components: {
    prdskucategory,
    prdskubrand,
    prdattribute,
    prdskumodel
  },
  data() {
    return {
      activeName: "first"
      // activeArr:['first'],
    }
  },
  methods: {
    handleClick(tab, event) {
      // let exist = this.activeArr.includes(tab.name);
      // if(!exist){
      //   this.activeArr.push(tab.name);
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
#y-prd-index {
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

  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__item {
    color: #999;
  }

  .el-tabs ::v-deep .el-card__body {
    padding: 0;
  }

  // ::v-deep .is-active{font-weight: bold;color: #000;}
}
</style>
