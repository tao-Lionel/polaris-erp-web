<template>
  <el-dialog
    title="标签搜索"
    :visible.sync="showDialog"
    width="60%"
    :close-on-click-modal="false"
    class="dialogShowScroll"
  >
    <div class="label-search">
      <el-input v-model="labelSearchInfo" size="small" style="width: 100px; padding-right: 10px"></el-input>
      <div class="operate">
        <el-button size="small" type="primary" @click="labelSearch">搜索</el-button>
        <el-button size="small" @click="labelSearchInfo = ''">清空</el-button>
      </div>
    </div>
    <div style="display: flex; padding: 10px 15px">
      <p style="flex-shrink: 0">标签列表：</p>
      <div>
        <el-radio style="font-size: 12px" v-model="searchForm.hasLabelIdFlag" :label="true">包含标签</el-radio>
        <el-radio style="font-size: 12px" v-model="searchForm.hasLabelIdFlag" :label="false">排除标签</el-radio>
      </div>
    </div>
    <div>
      <el-checkbox v-model="checkAll" style="margin-bottom: 10px" @change="handleCheckAllChange">全选</el-checkbox>
      <detail-wrapper
        :options="{
          title: '系统标签',
          customContentStyle: {
            padding: '15px'
          }
        }"
      >
        <el-checkbox-group style="display: flex; flex-wrap: wrap" v-model="checkedLabel" @change="handleCheckedLabel">
          <el-checkbox style="margin-bottom: 5px" v-for="item in sysLabelsArr" :label="item.id" :key="item.id">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </detail-wrapper>
      <detail-wrapper
        :options="{
          title: '自定义标签',
          customContentStyle: {
            padding: '15px'
          }
        }"
      >
        <el-checkbox-group style="display: flex; flex-wrap: wrap" v-model="checkedLabel" @change="handleCheckedLabel">
          <el-checkbox style="margin-bottom: 5px" v-for="item in customizeLabelsArr" :label="item.id" :key="item.id">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </detail-wrapper>
    </div>
    <div slot="footer">
      <el-button size="small" style="padding: 9px 30px" @click="showDialog = false">取消</el-button>

      <el-button
        size="small"
        style="padding: 9px 30px"
        type="primary"
        :loading="loadingStatus"
        @click="labelSearchConfirm"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { getListPage } from "@/api/order/labelManage"
import { deepClone } from "@/components/avue/utils/util"

export default {
  name: "batchInvoiceManageSearchLabelDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      sysLabelsArr: [],
      customizeLabelsArr: [],
      labelsArr: [],
      labelSearchInfo: "",
      searchForm: {
        hasLabelIdFlag: true
      },
      checkAll: false,
      checkedLabel: [],
      loadingStatus: false
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(sysLabelsArr, customizeLabelsArr, labelsArr, checkedLabel, hasLabelIdFlag) {
      this.showDialog = true
      this.sysLabelsArr = sysLabelsArr.sort((a, b) => a.name.length - b.name.length)
      this.customizeLabelsArr = customizeLabelsArr.sort((a, b) => a.name.length - b.name.length)
      this.labelsArr = labelsArr
      this.checkedLabel = checkedLabel || []
      // this.searchForm.hasLabelIdFlag = hasLabelIdFlag
    },
    labelSearch() {
      getListPage({ page: -1, pageSize: -1, name: this.labelSearchInfo }).then((res) => {
        if (res.data.code === 0) {
          this.sysLabelsArr = res.data.data.records.filter((item) => item.labelType === "SYS" && item.id != 37)
          this.customizeLabelsArr = res.data.data.records.filter((item) => item.labelType === "CUSTOMIZE")
        }
      })
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checkedLabel = this.labelsArr.map((item) => item.id)
        this.tagsContent = deepClone(this.labelsArr)
      } else {
        this.checkedLabel = []
        this.tagsContent = []
      }
    },
    handleCheckedLabel(val) {
      this.tagsContent = []
      let newCountent = []
      val.forEach((valItem) => {
        let needArr = this.labelsArr.filter((item) => valItem === item.id)
        this.tagsContent = [...this.tagsContent, ...needArr]
      })
      this.tagsContent.forEach(function (obj) {
        let exists = newCountent.some(function (item) {
          return item.id === obj.id
        })
        if (!exists) {
          newCountent.push(obj)
        }
      })
      this.tagsContent = newCountent
      let checkedCount = val.length
      this.checkAll = checkedCount === this.labelsArr.length
    },
    labelSearchConfirm() {
      this.$emit("searchLabel", { checkedLabel: this.checkedLabel, searchForm: this.searchForm })
      this.showDialog = false
    },
    clearLabel() {
      this.checkedLabel = []
      this.tagsContent = []
    }
  }
}
</script>

<style lang="scss" scoped>
.label-search {
  display: flex;
  align-items: center;

  .operate {
    display: flex;
    align-items: center;
  }
}

::v-deep .el-dialog {
  height: 75vh;
  .el-dialog__body {
    overflow-y: auto;
    height: calc(100% - 135px);
  }
}
.el-checkbox {
  flex: 1 1 120px;
}
</style>
