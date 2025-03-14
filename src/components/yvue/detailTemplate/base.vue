<!-- 详情两栏 -->
<template>
  <div class="iod-target-top border-rang mg-b-10">
    <div class="title-wrapper" :class="{ 'head-left': options.left }">
      <span class="title-name">{{ options.title }}</span
      ><span v-if="options.subTitle">{{ options.subTitle }}</span>
      <ul v-if="options.subHeader" class="pull-flex subheader">
        <li v-show="item.value" class="de-t" v-for="(item, i) in options.subHeader" :key="i">
          <span>{{ item.label }}：</span>
          <span>{{ item.value }}</span>
        </li>
      </ul>
      <ul class="pull-flex">
        <slot name="custom"></slot>
      </ul>
    </div>
    <div class="det-content" :class="{ 'content-p': options.openPadding }" :style="options.customContentStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "detail-wrapper",
  data() {
    return {}
  },
  props: {
    options: Object
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.title-wrapper {
  padding: 12px 15px;
  background: #f7f8fb;
  border-bottom: 1px solid #e7ebef;
  position: relative;
  vertical-align: middle;
}

.iod-target-top {
  ::v-deep .el-form-item__error {
    z-index: 3;
    bottom: -15px;
    top: auto;
    white-space: nowrap;
  }
}

.title-name {
  font-size: 16px;
  margin-right: 20px;
}

.title-name::before {
  content: "";
  display: inline-block;
  width: 2px;
  height: 14px;
  background: #409eff;
  position: relative;
  top: -2px;
  vertical-align: middle;
  margin-right: 8px;
}

.subheader {
  float: right;
}

.det-content {
  box-sizing: border-box;

  ::v-deep .el-row {
    border-bottom: 1px solid #e7ebef;

    .el-col {
      margin-bottom: 0;
      border-right: 1px solid #e7ebef;

      &:last-child {
        border-right: unset;
      }
    }

    &:last-child {
      border-bottom: unset;
    }

    .el-form-item {
      padding: 10px 8px;
      margin: 0;
    }

    .el-input,
    .el-textarea,
    .el-select,
    .el-autocomplete {
      width: 100% !important;
    }

    .el-textarea {
      vertical-align: middle;
    }
  }
}

.content-p {
  padding: 6px;
}

.de-t {
  padding: 0 10px;
}

::v-deep {
  // .el-form-item__content{overflow: hidden;}
  .avue-crud .el-table th {
    background-color: #f7f8fb;
  }

  .rm-border .el-textarea__inner {
    border-color: transparent !important;
  }
}
.head-left {
  display: flex;
  align-items: center;
}
</style>
