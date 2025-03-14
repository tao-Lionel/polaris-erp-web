<template>
  <div id="wms_fba_return_detail">
    <basic-container>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '退货详情',
          list: [
            { label: '退货单号', value: returnForm.returnOrderNo },
            { label: '制单人', value: returnForm.createName }
          ]
        }"
      >
      </detail-template>
      <detail-wrapper
        :options="{
          template: 2,
          title: '关联信息'
        }"
      >
        <div class="return-detail">
          <el-row>
            <el-col :span="8">
              <span class="rWidth">退货仓:</span>
              <span>{{ returnForm.warehouseName }}</span>
            </el-col>
            <el-col :span="8">
              <span class="rWidth">运输方式:</span>
              <span>{{ returnForm.transportModeName }}</span>
            </el-col>
            <el-col :span="8">
              <span class="rWidth">FBA移除号:</span>
              <span>{{ returnForm.fbaRemoveNo }}</span>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <span class="rWidth">计划处理方式:</span>
              <span>{{ returnForm.handleModeName }}</span>
            </el-col>
            <el-col :span="8">
              <span class="rWidth">销售组:</span>
              <span>{{ returnForm.salesGroupName }}</span>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <span class="rWidth">退货原因:</span>
              <span>{{ returnForm.returnReason }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <span class="rWidth">备注:</span>
              <span>{{ returnForm.remark }}</span>
            </el-col>
          </el-row>
        </div>
      </detail-wrapper>

      <!-- 列表 -->
      <detail-wrapper :options="{ title: '产品信息', openPadding: true }">
        <avue-crud
          class="close-table-select"
          :data="returnForm.tableData"
          :option="handleTableOption"
          :spanMethod="tableSpanMethod"
        >
        </avue-crud>
      </detail-wrapper>
    </basic-container>
  </div>
</template>

<script>
import { getInfo } from "@/api/warehouse/fbareturn/wmsfbareturndetail"
import { inforTableOption } from "@/const/crud/warehouse/fbareturn/wmsfbareturndetail"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getTokenUrl, getTokenUrlFile } from "@/util/auth"
export default {
  name: "wmsfbareturndetail",
  data() {
    return {
      handleTableOption: inforTableOption,
      returnForm: {
        returnOrderNo: this.$route.query.returnOrderNo,
        //returnOrderNo:'FT19052800004',
        createTime: "",
        createName: "",
        warehouseName: "",
        warehouseId: "",
        transportModeName: "",
        transportModeId: "",
        fbaRemoveNo: "",
        handleModeName: "",
        handleMode: "",
        salesGroupId: "",
        salesGroupName: "",
        returnReason: "",
        remark: "",
        tableData: [],
        tempId: null
      }
    }
  },
  created() {
    this.getArriveInfo()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getArriveInfo() {
      if (this.isNulls(this.returnForm.returnOrderNo)) {
        return
      }

      getInfo(this.returnForm.returnOrderNo).then((resp) => {
        if (resp.data.code == 0) {
          var returnData = resp.data.data
          this.returnForm.createTime = returnData.createTime
          this.returnForm.createName = returnData.createName
          this.returnForm.warehouseName = returnData.warehouseName
          this.returnForm.transportModeName = returnData.transportModeName
          this.returnForm.fbaRemoveNo = returnData.fbaRemoveNo
          this.returnForm.handleModeName = returnData.handleModeName
          this.returnForm.salesGroupName = returnData.salesGroupName

          this.returnForm.returnReason = returnData.returnReason
          this.returnForm.remark = returnData.remark
          // returnData.detailList.forEeach((item,index)=>{

          // })

          this.$set(this.returnForm, "tableData", returnData.detailList)
        }
      })
    },
    /**
     * 检查字符串是否为空
     */
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    },

    tableSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        if (this.tempId !== row.id) {
          let step = 0
          this.returnForm.tableData.forEach((item) => {
            if (item.id === row.id) {
              step++
            }
          })

          this.tempId = row.id
          return [step, 1]
        }
        return [0, 0]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rWidth {
  margin-right: 10px;
  width: auto;
  align-content: right;
}
.return-detail {
  .el-row {
    > div {
      padding: 10px;
    }
  }
}
</style>
