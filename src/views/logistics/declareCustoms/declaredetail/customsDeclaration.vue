<template>
  <!-- 报关单 -->
  <div class="execution" id="customsDeclaration">
    <basic-container>
      <el-row>
        <el-col :span="24">
          <div class="text-align-center title"><strong>中华人民共和国海关出口货物报关单</strong></div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="margin-buttom-to-zero">
        <el-col :span="6">
          <span>预录入编号：</span>
        </el-col>
        <el-col :span="6">
          <span>申报口岸：</span>
        </el-col>
        <el-col :span="6">
          <span>海关编号：</span>
        </el-col>
        <el-col :span="6"> </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" style="margin-bottom: -1px">
          <table border="1" bordercolor="#ebeef5" class="table-base">
            <tr>
              <td>
                <p>
                  境内发货人 <span>{{ declareInfo.certificationNo }}</span>
                </p>
                <span>{{ declareInfo.senderName }}</span>
              </td>
              <td colspan="2">
                <p>出境关别</p>
                <span>{{ declareInfo.customsExit }}</span>
              </td>
              <td colspan="2">
                <p>出口日期</p>
                <span></span>
              </td>
              <td colspan="2">
                <p>申报日期</p>
                <span>{{ declareInfo.declareDate }}</span>
              </td>
              <td>
                <p>备案号</p>
                <span></span>
              </td>
            </tr>

            <tr>
              <td>
                <p>境外收货人</p>
                <span>{{ declareInfo.outboundConsignee }}</span>
              </td>
              <td colspan="2">
                <p>运输方式</p>
                <span>{{ declareInfo.transportModeName }}</span>
              </td>
              <td colspan="2">
                <p>运输工具名称及航次号</p>
                <span></span>
              </td>
              <td colspan="2">
                <p>提运单号</p>
                <span></span>
              </td>
              <td></td>
            </tr>

            <tr>
              <td>
                <p>生产销售单位</p>
                <span>{{ declareInfo.sellerName }}</span>
              </td>
              <td colspan="2">
                <p>监管方式</p>
                <span>{{ declareInfo.regulatoryMode }}</span>
              </td>
              <td colspan="2">
                <p>征免性质</p>
                <span>{{ declareInfo.exemptionProperty }}</span>
              </td>
              <td colspan="2">
                <p>许可证号</p>
                <span></span>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <p>合同协议号</p>
                <span>{{ declareInfo.contractNumber }}</span>
              </td>
              <td colspan="2">
                <p>贸易国（地区）</p>
                <span>{{ declareInfo.tradeCountryName }}</span>
              </td>
              <td colspan="2">
                <p>运抵国（地区）</p>
                <span>{{ declareInfo.destinateCountryName }}</span>
              </td>
              <td colspan="2">
                <p>指运港</p>
                <span></span>
              </td>
              <td>
                <p>离境口岸</p>
                <span>{{ declareInfo.exitPort }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <p>包装种类</p>
                <span>{{ declareInfo.packageType }}</span>
              </td>
              <td>
                <p>件数</p>
                <span>{{ declareInfo.packageSum }}</span>
              </td>
              <td>
                <p>毛重（千克）</p>
                <span>{{ declareInfo.totalRoughWeight }}</span>
              </td>
              <td>
                <p>净重（千克）</p>
                <span>{{ declareInfo.totalNetWeight }}</span>
              </td>
              <td>
                <p>成交方式</p>
                <span>{{ declareInfo.bargainType }}</span>
              </td>
              <td>
                <p>运费</p>
                <span></span>
              </td>
              <td>
                <p>保费</p>
                <span></span>
              </td>
              <td>
                <p>杂费</p>
                <span></span>
              </td>
            </tr>

            <tr>
              <td colspan="8">
                <label>随附单证及编号：</label>
                <span>{{ declareInfo.accompanyDocNo }}</span>
              </td>
            </tr>

            <tr>
              <td colspan="8">
                <label>标记唛码及备注：</label>
                <span>{{ declareInfo.markNoRemark }} 境内自主品牌 不享惠</span>
              </td>
            </tr>

            <tr>
              <td colspan="8">
                <el-row>
                  <el-col :span="6">
                    <label>特殊关系确认：否</label>
                  </el-col>
                  <el-col :span="6">
                    <label>价格影响确认：否</label>
                  </el-col>
                  <el-col :span="6">
                    <label>支付特权使用费：否</label>
                  </el-col>
                  <el-col :span="6">
                    <label>自报自缴：</label>
                  </el-col>
                </el-row>
              </td>
            </tr>
          </table>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" v-loading="rowLoading">
          <avue-crud :data="CDTableData" :option="CDTableOption" highlight-current-row>
            <!--商品名称及规格型号-->
            <template slot="customsName" slot-scope="scope">
              {{ scope.row.customsName }}<br />{{ scope.row.declarationElement }} </template
            ><!-- {{scope.row.specification}}{{scope.row.modelName}} -->
            <!--数量及单位-->
            <template slot="declareQuantity" slot-scope="scope">
              {{ scope.row.declareQuantity }} {{ scope.row.customsLegalUnit }}
            </template>
            <!-- 单价/总价/币制 -->
            <template slot="price" slot-scope="scope">
              {{ scope.row.declarePrice }}<br />{{ (scope.row.declarePrice * scope.row.declareQuantity).toFixed(2)
              }}<br />{{ scope.row.currency }}
              &nbsp;&nbsp;
              <i
                class="icon-bianji y-icon-edit"
                v-if="editPricDisable"
                @click="editHandle(scope.row.$index)"
                title="编辑"
              ></i>
            </template>
            <!-- 最终用目的国 -->
            <template slot="goalCountryName" slot-scope="scope">
              {{ declareInfo.goalCountryName }}
            </template>
            <!-- 货源地 -->
            <template slot="sourceLocal" slot-scope="scope">
              {{ declareInfo.signContractSite }}
            </template>

            <!-- 移动 -->
            <template slot="sort" slot-scope="scope">
              <i
                class="el-icon-arrow-up y-reviews"
                @click="setSort(scope.row.$index)"
                title="上移"
                v-if="scope.row.$index > 0 && editPricDisable"
              ></i>
            </template>
          </avue-crud>
        </el-col>
      </el-row>

      <!-- 修改单价相关信息 -->
      <el-dialog title="修改" :visible.sync="addOrUpdateDialog" width="660px" center>
        <el-form ref="refForm" :model="refForm" :label-position="labelPosition" size="small" :rules="checkRules">
          <el-form-item label="商品编号">
            <el-tag>{{ refForm.customsCode }}</el-tag>
          </el-form-item>
          <el-form-item label="原单价:" prop="price" id="check-tip">
            <el-input v-model="refForm.oldPrice" v-search-input-trim style="width: 30%" :disabled="true"></el-input>
            <i class="el-icon-d-arrow-right"></i>
            <label>新单价：</label>
            <el-input v-model="refForm.price" v-search-input-trim style="width: 30%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="addOrUpdateDialog = false">取 消</el-button>
          <el-button type="primary" size="small" :loading="loading" @click="submitForm()">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { tableOption } from "@/const/crud/logistics/declareCustoms/declaredetail/customsDeclaration"
import Sortable from "sortablejs"
import { mapGetters } from "vuex"
import { getTotalInfoOne } from "@/api/logistics/declareCustoms/customsList/customsList"
import { dateFormat } from "@/const/crud/logistics/declareCustoms/declaredetail/util"
import { updatePrice, updateItemNO } from "@/api/logistics/declareCustoms/declaredetail/customsDeclaration"
export default {
  name: "customsDeclaration",
  components: {},
  created() {
    this.getDeclareInfo()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  props: {
    numberNo: String,
    disableCD: Boolean
  },
  data() {
    var isNumber = (rule, value, callback) => {
      var req = /^([0-9]{0,8})?(\.[0-9]{1,2})?$/
      var reg = new RegExp(req)
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("8位整数,2位小数"))
      }
    }

    return {
      declareInfo: {},
      CDTableOption: tableOption,
      CDTableData: [],
      labelPosition: "right",
      addOrUpdateDialog: false,
      refForm: {
        customsCode: null,
        price: null,
        oldPrice: null
      },
      checkRules: {
        price: [
          { required: true, message: "单价不能为空", trigger: "blur" },
          { validator: isNumber, trigger: "blur" }
        ]
      },
      currIndex: -1,
      loading: false,
      editPricDisable: !this.disableCD,
      rowLoading: false
    }
  },
  methods: {
    //编辑
    editHandle(index) {
      this.currIndex = index
      var row = this.CDTableData[this.currIndex]
      if (!row) {
        this.$message.warning("数据不存在")
        return
      }
      this.refForm = {
        detailId: row.detailId,
        customsCode: row.customsCode,
        price: row.declarePrice,
        oldPrice: row.declarePrice
      }
      this.addOrUpdateDialog = true
    },
    //获取报关单全部信息
    getDeclareInfo() {
      getTotalInfoOne(this.numberNo).then((res) => {
        this.declareInfo = res.data.data
        this.declareInfo.declareDate = dateFormat(this.declareInfo.declareDate)
        this.CDTableData = this.declareInfo.detail
      })
    },
    //保存修改
    submitForm() {
      this.$refs["refForm"].validate((valid) => {
        if (valid) {
          this.loading = true
          //alert(JSON.stringify(this.refForm));
          //请求后台保存
          updatePrice(Object.assign(this.refForm))
            .then((res) => {
              if (res.data.data) {
                this.$message.success("编辑成功")
                this.addOrUpdateDialog = false
                this.CDTableData[this.currIndex].declarePrice = this.refForm.price
              } else {
                this.$message.warning(res.data.msg)
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    //排序
    setSort(index) {
      let rows = []
      let startRow = this.CDTableData[index]
      let endRow = this.CDTableData[index - 1]
      let row1 = {}
      let row2 = {}
      row1.detailId = startRow.detailId
      row1.itemNo = endRow.itemNo
      row2.detailId = endRow.detailId
      row2.itemNo = startRow.itemNo
      rows.push(row1)
      rows.push(row2)
      //更新项号
      this.rowLoading = true
      updateItemNO(Object.assign({ rows: JSON.stringify(rows) }))
        .then((res) => {
          if (res.data.data) {
            let itemTmp = startRow.itemNo
            startRow.itemNo = endRow.itemNo
            endRow.itemNo = itemTmp
            let temp = this.CDTableData[index - 1]
            Vue.set(this.CDTableData, index - 1, this.CDTableData[index])
            Vue.set(this.CDTableData, index, temp)
          } else {
            this.$message.warning(res.data.msg)
          }
        })
        .finally(() => {
          this.rowLoading = false
        })
    },
    disableCDFn(bool) {
      this.editPricDisable = bool
    }
  }
}
</script>
<style lang="scss">
#customsDeclaration {
  .text-align-center {
    text-align: center;
  }
  .title {
    border-radius: 4px;
    min-height: 36px;
    font-size: 26px;
  }

  .margin-buttom-to-zero .el-col {
    margin-bottom: 0px;
    // font-weight: bold;
  }
  .table-base {
    width: 100%;
  }
  .table-base tr td {
    width: 10%;
    padding: 1px;
  }
  .table-base tr:first-child td {
    width: 20%;
  }

  .table-base tr td p {
    margin: 2px 0px 0px 2px;
    // font-weight: bold;
  }

  .table-base tr td span {
    margin: 2px 0px 0px 30px;
  }
  #check-tip .el-form-item__error {
    left: 239px;
  }
  #check-tip .el-form-item__label:before {
    content: "";
  }

  //修改样式
  .y-icon-edit {
    float: right;
  }
}
</style>
