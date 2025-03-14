<template>
  <div class="packing-fta">
    <basic-container>
      <el-row>
        <el-col :span="24"><p class="text-center title">天津自贸通外贸服务股份有限公司</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><p class="text-center">TIANJIN FREE TRADE SERVICE CO LTD</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><p class="text-center">NO.3 YUNNAN POAD,TIANJIN CHINA</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><p class="text-center title">装箱单</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><p class="text-center title">PAKING LIST</p></el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :span="5"
          ><div class="text-right"><strong>TO:</strong></div></el-col
        >
        <el-col :span="9"></el-col>
        <el-col :span="6"
          ><p><strong>INV NO:</strong>{{ packageInfo.contractNumber }}</p></el-col
        >
      </el-row>
      <br />
      <el-row>
        <el-col :span="14"></el-col>
        <el-col :span="6"
          ><p><strong>DATE:</strong>{{ packageInfo.declareDate }}</p></el-col
        >
      </el-row>
      <br />
      <el-row>
        <el-col :span="14"></el-col>
        <el-col :span="6"
          ><p><strong>PONO:</strong>{{ packageInfo.contractNumber }}</p></el-col
        >
      </el-row>
      <br />
      <el-row>
        <el-col :span="5"><strong>ROUTE:</strong></el-col>
      </el-row>
      <br />
      <el-table
        class="pink-table"
        :data="tableData"
        border
        center
        show-summary
        append
        :show-header="showHeader"
        :span-method="spanMethod"
        :summary-method="getSummaries"
      >
        <el-table-column prop="mark"></el-table-column>
        <el-table-column prop="customsName"></el-table-column>
        <el-table-column prop="packageQuantity"></el-table-column>
        <el-table-column prop="unit">
          <template slot-scope="scope">
            <span v-if="scope.row.detailId">{{ packageInfo.packageType }}</span>
            <span v-else>{{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="declareQuantity"></el-table-column>
        <el-table-column prop="customsLegalUnit"></el-table-column>
        <el-table-column prop="roughWeight"></el-table-column>
        <el-table-column prop="netWeight"></el-table-column>
        <el-table-column prop="volume"></el-table-column>
      </el-table>
    </basic-container>
  </div>
</template>
<script>
import { getPackage } from "@/api/logistics/declareCustoms/declaredetail/customsDeclaration"
import { dateFormat } from "@/const/crud/logistics/declareCustoms/declaredetail/util"
import { fixedPackageTable1 } from "@/const/crud/logistics/declareCustoms/declaredetail/detail"
export default {
  created() {
    this.getPackageInfo()
  },
  props: {
    numberNo: String
  },
  data() {
    return {
      tableData: fixedPackageTable1(),
      showHeader: false,
      packageInfo: {}
    }
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0 || rowIndex == 1) {
        if (columnIndex == 4) {
          return [1, 2]
        } else if (columnIndex == 5) {
          return [0, 0]
        }
      }
      if (rowIndex == 1) {
        if (columnIndex == 0) {
          return [this.tableData.length, 1]
        }
      } else if (rowIndex > 1) {
        if (columnIndex == 0) {
          return [0, 0]
        }
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = ""
          return
        } else if (index == 1) {
          sums[index] = "TOTAL"
          return
        } else if (index == 2) {
          sums[index] = this.packageInfo.packageSum
          return
        } else if (index == 3) {
          sums[index] = "CTNS"
          return
        } else if (index == 4 || index == 5) {
          sums[index] = " "
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          if (index == 8) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = sums[index]
          } else {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = sums[index]
          }
        } else {
          sums[index] = "N/A"
        }
      })
      return sums
    },
    getPackageInfo() {
      getPackage(this.numberNo).then((res) => {
        this.tableData = fixedPackageTable1()
        this.packageInfo = res.data.data
        this.packageInfo.declareDate = dateFormat(this.packageInfo.declareDate)
        this.tableData = this.tableData.concat(this.packageInfo.detail)
        //    console.log(this.tableData)
      })
    }
  }
}
</script>
<style lang="scss">
.packing-fta {
  .text-center {
    text-align: center;
  }
  .title {
    font-size: 20px;
  }
  .text-right {
    text-align: right;
  }
  .pink-table {
    width: 100%;
    overflow-x: auto;
    .el-table__body {
      width: 100% !important;
    }
    .el-table__footer {
      width: 100% !important;
    }
    .el-table__body-wrapper {
      /* overflow-x: auto; */
      overflow-x: hidden;
      overflow: initial;
    }
    .el-table__footer-wrapper {
      overflow: initial;
    }
  }
  .el-table--border::after,
  .el-table--group::after {
    background-color: rgba(000, 000, 000, 0);
  }
}
</style>
