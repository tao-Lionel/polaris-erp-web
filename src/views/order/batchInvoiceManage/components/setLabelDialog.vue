<template>
  <el-dialog
    title="设置标签"
    :visible.sync="showDialog"
    width="60%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
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
      <p style="flex-shrink: 0">已选标签：</p>
      <div style="display: flex; flex-wrap: wrap">
        <el-tag
          style="margin: 0 10px 10px 0"
          size="small"
          v-for="(tag, index) in tagsContent"
          :key="tag.name"
          closable
          @close="handleClose(tag, index)"
          :type="tag.labelColor"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </div>
    <div style="display: flex; padding: 10px 15px">
      <p style="flex-shrink: 0">标签列表：</p>
      <div>
        <el-radio style="font-size: 12px" v-model="isAddOrDelLabel" label="CREATE">添加标签</el-radio>
        <el-radio style="font-size: 12px" v-model="isAddOrDelLabel" label="DELETE">移除标签</el-radio>
      </div>
    </div>
    <div>
      <el-checkbox v-model="checkAll" style="margin-bottom: 10px" @change="handleCheckAllChange">全选</el-checkbox>
      <a @click="goLabel">维护标签</a>
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
      <el-button size="small" style="padding: 9px 30px" @click="labelCancel">取消</el-button>
      <el-button size="small" style="padding: 9px 30px" type="primary" :loading="loadingStatus" @click="labelConfirm">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getListPage } from "@/api/order/labelManage"
import { deepClone } from "@/components/avue/utils/util"
import { editLabelApi } from "@/api/order/batchInvoiceManage"

export default {
  name: "batchInvoiceManageSetLabelDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      labelSearchInfo: "",
      tagsContent: [],
      isAddOrDelLabel: "CREATE",
      checkAll: false,
      checkedLabel: [],
      sysLabelsArr: [],
      customizeLabelsArr: [],
      labelsArr: [],
      loadingStatus: false,
      selectRows: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(selectRows, row) {
      this.showDialog = true
      this.selectRows = selectRows
      this.getList(row)
    },

    async getList(row) {
      this.labelSearchInfo = ""
      if (this.sysLabelsArr.length == 0 && this.customizeLabelsArr.length == 0) {
        let res = await getListPage({ page: -1, pageSize: -1, name: this.labelSearchInfo })
        if (res.data.code === 0) {
          this.sysLabelsArr = res.data.data.records
            .filter((item) => item.labelType === "SYS" && item.id != 44)
            .sort((a, b) => a.name.length - b.name.length)
          this.customizeLabelsArr = res.data.data.records
            .filter((item) => item.labelType === "CUSTOMIZE")
            .sort((a, b) => a.name.length - b.name.length)
        }
      }

      let labelRow = {},
        singleStatus = false
      if (row) {
        labelRow = row
        singleStatus = true
      } else if (!row && this.selectRows.length === 1) {
        labelRow = this.selectRows[0]
        singleStatus = true
      }

      if (singleStatus) {
        this.tableDataRow = labelRow
        this.tagsContent = deepClone(labelRow.labels) || []
        if (labelRow.labels) {
          this.checkedLabel = labelRow.labels.map((item) => item.id)
        } else {
          this.checkedLabel = []
        }
        this.checkAll = this.tagsContent.length === this.labelsArr.length
      }
    },

    labelSearch() {
      getListPage({ page: -1, pageSize: -1, name: this.labelSearchInfo }).then((res) => {
        if (res.data.code === 0) {
          this.sysLabelsArr = res.data.data.records.filter((item) => item.labelType === "SYS" && item.id != 37)
          this.customizeLabelsArr = res.data.data.records.filter((item) => item.labelType === "CUSTOMIZE")
        }
      })
    },
    handleClose(tag, tagIndex) {
      const index = this.checkedLabel.findIndex((item) => item === tag.id)
      this.checkedLabel.splice(index, 1)
      this.tagsContent.splice(tagIndex, 1)
      this.checkAll = this.tagsContent.length === this.labelsArr.length
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
    goLabel() {
      this.showDialog = false
      this.$router.push({
        path: "/order/labelManageList"
      })
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
    labelConfirm() {
      if (this.selectRows.length > 1) {
        const params = {
          batchOrderCodes: this.selectRows.map((item) => item.batchOrderCode),
          type: this.isAddOrDelLabel,
          labelIdList: this.checkedLabel
        }
        this.loadingStatus = true
        editLabelApi(params)
          .then((res) => {
            if (res.data.code === 0) {
              this.loadingStatus = false
              this.$message.success("批量修改标签成功")
              this.isAddOrDelLabel = "CREATE"
              this.tagsContent = []
              this.checkedLabel = []
              this.showDialog = false
              this.$emit("updateList")
            } else {
              this.loadingStatus = false
              this.$message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.loadingStatus = false
          })
      } else {
        const params = {
          batchOrderCodes: this.selectRows.map((item) => item.batchOrderCode),
          labelIdList: this.checkedLabel,
          type: this.isAddOrDelLabel
        }
        this.loadingStatus = true
        editLabelApi(params)
          .then((res) => {
            if (res.data.code === 0) {
              this.loadingStatus = false
              this.$message.success("单个修改标签成功")
              this.tagsContent = []
              this.checkedLabel = []
              this.showDialog = false
              this.$emit("updateList")
            } else {
              this.loadingStatus = false
              this.$message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.loadingStatus = false
          })
      }
    },
    labelCancel() {
      this.isAddOrDelLabel = "CREATE"
      this.checkAll = false
      this.tagsContent = []
      this.checkedLabel = []
      this.showDialog = false
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
