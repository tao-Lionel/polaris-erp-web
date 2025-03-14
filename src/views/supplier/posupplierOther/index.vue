<template>
  <div>
    <basic-container id="supplyTax">
      <div class="banner-text">
        <avue-crud
          ref="crud"
          :page="page"
          :data="tableData"
          :option="tableOption"
          @on-load="getList"
          @refresh-change="refreshChange"
          @search-change="searchChange"
          @search-reset="searchReset"
          @size-change="sizeChange"
        >
          <template slot="tableBeforeSlot">
            <div style="padding: 10px">
              <el-button
                type="primary"
                @click="openDialog"
                size="small"
                v-if="permissions.purchase_posupplier_save && tableData.length < 6"
                >新 增</el-button
              >
            </div>
          </template>
          <template slot-scope="scope" slot="operate">
            <el-button type="text" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" @click="editMsg(scope.row)" v-if="permissions.purchase_posupplier_cancel">
              编辑
            </el-button>
          </template>
        </avue-crud>

        <el-dialog
          :visible.sync="dialogFormVisible"
          center
          width="50%"
          :title="dialogTitle"
          :close-on-click-modal="false"
        >
          <el-form
            :model="formValue"
            ref="ruleForm"
            :rules="rules"
            class="contract-form"
            :disabled="dialogTitle === '查看'"
          >
            <el-form-item label="合同条款名称:" prop="informationName">
              <el-input v-model="formValue.informationName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="A.TERM OF DELIVERY:" prop="termOfDelivery">
              <el-input v-model="formValue.termOfDelivery" size="small"></el-input>
            </el-form-item>
            <el-form-item label="B.PAYMENT TERMS:" prop="paymentTerms">
              <el-input v-model="formValue.paymentTerms" size="small"></el-input>
            </el-form-item>
            <el-form-item label="C.COUNTRY OF ORIGIN:" prop="countryOfOrigin">
              <el-input v-model="formValue.countryOfOrigin" size="small"></el-input>
            </el-form-item>
            <el-form-item label="D.ORDER REQUIREMENT:" prop="orderRequirement1">
              <el-input v-model="formValue.orderRequirement1" size="small"></el-input>
            </el-form-item>
            <div v-for="(item, index) in orderRequirementList" :key="item.index">
              <el-form-item :label="`${item.index}:`" style="display: flex">
                <el-input v-model="item.content" size="small" style="width: 80%"></el-input>
                <div v-if="dialogTitle !== '查看'" class="operation">
                  <i
                    v-show="index === orderRequirementList.length - 1"
                    class="el-icon-circle-plus-outline mr-10"
                    @click="addList()"
                  ></i>
                  <i class="el-icon-delete" @click.prevent="delList(index)"></i>
                </div>
              </el-form-item>
            </div>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogResult(false)">取 消</el-button>
            <el-button v-if="dialogTitle !== '查看'" type="primary" size="small" @click="dialogResult(true)">
              保 存
            </el-button>
          </span>
        </el-dialog>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { saveOtherInformation, getListBySupplierNo } from "@/api/supplier/posupplierOther"
import { mapGetters } from "vuex"
import pooperatelog from "@/views/supplier/log/index"
import { deepClone } from "@/util/util"

export default {
  components: {
    pooperatelog
  },
  data() {
    return {
      tableData: [],
      page: {
        // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: {
        border: true,
        searchShow: false, //搜索栏开关
        searchAdvanced: false, //高级搜索栏开关，默认关闭
        index: true,
        indexLabel: "序号",
        stripe: true,
        menuAlign: "center",
        align: "center",
        editBtn: false,
        delBtn: false,
        addBtn: false,
        header: false,
        pageFlag: false, //是否显示分页器
        dic: [],
        column: [
          {
            label: "合同条款名称",
            prop: "informationName",
            sortable: false
          },
          {
            label: "操作",
            prop: "operate",
            sortable: false,
            solt: true,
            copy: false
          }
        ]
      },
      rules: {
        informationName: [{ required: true, message: "请填写合同条款名称", trigger: "blur" }],
        termOfDelivery: [{ required: true, message: "请填写A.TERM OF DELIVERY", trigger: "blur" }],
        paymentTerms: [{ required: true, message: "请填写B.PAYMENT TERMS", trigger: "blur" }],
        countryOfOrigin: [{ required: true, message: "请填写C.COUNTRY OF ORIGIN", trigger: "blur" }],
        orderRequirement1: [{ required: true, message: "请填写D.ORDER REQUIREMENT", trigger: "blur" }]
      },
      formValue: {
        supplierNo:
          typeof this.$route.query.paramSupplierNo == "undefined" ? this.gycode : this.$route.query.paramSupplierNo,
        termOfDelivery: "",
        paymentTerms: "",
        countryOfOrigin: "",
        orderRequirement1: "",
        // orderRequirement2: "",
        // orderRequirement3: "",
        // orderRequirement4: "",
        ordinances: ""
      },
      dialogFormVisible: false,
      dialogTitle: "",
      supplierNo: "",
      orderRequirementList: [{ index: 1, content: "" }]
    }
  },
  created() {
    this.supplierNo = this.$route.query.paramSupplierNo
    if (this.formValue.supplierNo == "" || typeof this.formValue.supplierNo == "undefined") {
      this.$message.error("请先完善[基本信息]")
      return
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  mounted() {
    this.fetchData()
  },
  props: {
    gycode: [String, Number]
  },
  methods: {
    dialogResult(status) {
      if (status) {
        this.$refs["ruleForm"].validate(async (valid) => {
          if (valid) {
            let params = deepClone(this.formValue)
            params.orderRequirements = []

            this.orderRequirementList.forEach((item) => {
              params.orderRequirements.push({
                index: item.index,
                content: item.content
              })
            })
            params.orderRequirements.unshift({
              index: 0,
              content: params.orderRequirement1
            })
            console.log("params", params)

            let res = await saveOtherInformation([params])
            if (res.data.code === 0) {
              this.$message.success("操作成功")
              this.formValue = {
                supplierNo: this.$route.query.paramSupplierNo,
                termOfDelivery: "",
                paymentTerms: "",
                countryOfOrigin: "",
                orderRequirement1: "",
                ordinances: ""
              }
              this.dialogFormVisible = false
              this.fetchData()
            } else {
              this.$message.error(res.data.msg)
            }
          }
        })
      } else {
        this.formValue = {
          supplierNo: this.$route.query.paramSupplierNo,
          termOfDelivery: "",
          paymentTerms: "",
          countryOfOrigin: "",
          orderRequirement1: "",
          // orderRequirement2: "",
          // orderRequirement3: "",
          // orderRequirement4: "",
          ordinances: ""
        }
        this.dialogFormVisible = false
      }
    },
    openDialog() {
      this.dialogFormVisible = true
      this.dialogTitle = "新增"
      this.orderRequirementList = [{ index: 1, content: "" }]
    },
    editMsg(row) {
      this.dialogTitle = "编辑"
      this.init(row)
    },

    fetchData() {
      getListBySupplierNo(this.supplierNo).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    addList() {
      let index = this.orderRequirementList[this.orderRequirementList.length - 1].index
      this.orderRequirementList.push({
        index: index + 1,
        content: ""
      })
    },
    delList(index) {
      if (this.orderRequirementList.length === 1) {
        this.$message.error("至少保留一项")
        return
      }
      this.orderRequirementList.splice(index, 1)
      this.orderRequirementList.forEach((item, i) => {
        item.index = i + 1
      })
    },
    handleView(row) {
      this.dialogTitle = "查看"
      this.init(row)
    },
    init(row) {
      this.formValue = row
      let list = deepClone(row.orderRequirements)
      this.formValue.orderRequirement1 = list.splice(0, 1)[0]?.content
      if (list && list.length > 0 && list.some((item) => item !== null)) {
        this.orderRequirementList = list
      } else {
        this.orderRequirementList = [{ index: 1, content: "" }]
      }
      this.dialogFormVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.contract-form {
  ::v-deep .el-form-item__content {
    display: flex;
  }
  .operation {
    font-size: 20px;
    margin-left: 20px;
    i {
      cursor: pointer;
    }
  }
}
</style>
