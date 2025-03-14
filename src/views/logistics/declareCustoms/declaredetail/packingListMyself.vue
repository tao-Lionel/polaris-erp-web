<template>
  <div class="packing_myself">
    <basic-container>
      <el-row>
        <el-col :span="24"><p class="text-center title">装箱单</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><p class="text-center title">PAKING LIST</p></el-col>
      </el-row>
      <el-row class="top_text">
        <el-col :span="3"
          ><div class="text-center">
            合约号<br />
            Contract No:
          </div></el-col
        >
        <el-col :span="9"
          ><p class="text-center">{{ packageInfo.contractNumber }}</p></el-col
        >
        <el-col :span="4"></el-col>
        <el-col :span="4"
          ><div class="text-center">
            日期<br />
            Date:
          </div></el-col
        >
        <el-col :span="4"
          ><p>{{ packageInfo.declareDate }}</p></el-col
        >
      </el-row>
      <el-table
        :data="tableData"
        border
        center
        :header-cell-style="headerDisplay"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%"
      >
        <el-table-column :label="'船名 \n Shipped by'">
          <el-table-column prop="No" :label="'箱号 \n Cth.No'">
            <el-table-column prop="No" :label="'箱号 \n Cth.No'"> </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="header1">
          <el-table-column prop="customsName" :label="'货物名称及规格 \n Description'">
            <el-table-column prop="customsName" :label="'货物名称及规格 \n Description'"> </el-table-column>
          </el-table-column>
          <el-table-column prop="packageQuantity" :label="header2">
            <el-table-column prop="packageQuantity" :label="header2"> </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="'     付款条件 \n Trems of Payment'">
          <el-table-column prop="declareQuantity" :label="'总数量 \n Ge.Quantity:(platform)'">
            <el-table-column prop="declareQuantity" :label="'总数量 \n Ge.Quantity:(platform)'"></el-table-column>
            <el-table-column prop="customsLegalUnit"></el-table-column>
          </el-table-column>
        </el-table-column>

        <el-table-column label="电汇">
          <el-table-column prop="roughWeight" :label="'总毛重(千克) \n G.W.:(KG)'">
            <el-table-column prop="roughWeight" :label="'总毛重(千克) \n G.W.:(KG)'"> </el-table-column>
          </el-table-column>
          <el-table-column prop="netWeight" :label="'总净重(千克) \n N.W.:(KG)'">
            <el-table-column prop="netWeight" :label="'总净重(千克) \n N.W.:(KG)'"> </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </basic-container>
  </div>
</template>
<script>
import { getPackage } from "@/api/logistics/declareCustoms/declaredetail/customsDeclaration"
import { dateFormat } from "@/const/crud/logistics/declareCustoms/declaredetail/util"
export default {
  created() {
    this.getPackageInfo()
  },
  props: {
    numberNo: String
  },
  data() {
    return {
      tableData: [],
      packageInfo: {},
      header1: "   由             至 \n From  深圳  To  香港",
      header2: "件数(纸箱) \n Ge.Crate(CTNS)"
    }
  },
  methods: {
    headerDisplay({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 2) {
        return { display: "none" }
      }
    },
    getPackageInfo() {
      getPackage(this.numberNo).then((res) => {
        this.packageInfo = res.data.data
        this.header1 =
          "   由             至 \n From  " +
          this.packageInfo.signContractSite +
          "  To  " +
          this.packageInfo.goalCountryName
        this.header2 = "件数(" + this.packageInfo.packageType + ") \n Ge.Crate(CTNS)"
        this.packageInfo.declareDate = dateFormat(this.packageInfo.declareDate)
        this.tableData = res.data.data.detail
      })
    },
    getSummaries(param) {
      let { columns, data } = param
      let sum = []
      sum[0] = "合计"
      sum[1] = null
      sum[2] = this.packageInfo.packageSum
      let dqS = 0
      let rwS = 0
      let nwS = 0
      if (data.length > 0) {
        data.forEach((d) => {
          dqS += d.declareQuantity
          rwS += d.roughWeight
          nwS += d.netWeight
        })
      }
      sum[3] = dqS
      sum[5] = rwS.toFixed(4)
      sum[6] = nwS.toFixed(4)
      return sum
    }
  }
}
</script>
<style lang="scss">
.packing_myself {
  .text-center {
    text-align: center;
  }
  .title {
    font-size: 20px;
  }
  .el-table {
    .cell {
      white-space: pre;
      font-weight: normal;
    }
    td,
    th {
      text-align: center;
    }
  }
  .top_text {
    border: 1px solid #f0f0f0;
  }
  .top_text p {
    line-height: 40px;
  }
  .basic-container {
    min-height: 500px;
  }
}
</style>
