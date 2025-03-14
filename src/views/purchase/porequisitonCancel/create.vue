<template>
  <div class="porequisiton-common">
    <basic-container class="createOrDetailPorequisiton">
      <div>
        <detail-template
          :value="1"
          :options="{
            template: 1,
            title: '请购撤销单',
            list: [
              { label: '单据编号', value: requisitionRevokeNo },
              { label: '单据日期', value: time },
              { label: '请购人', value: createName }
            ]
          }"
        >
        </detail-template>

        <!-- <div style="width:100%">
          <p class="iod-header-title pore-title">请购撤销单</p>
          <p class="pore-man">
            单据日期：
            <span>{{time}}</span>
          </p>
          <p class="pore-man">
            请购人：
            <span>{{createName}}</span>
          </p>
          <p v-if="requisitionRevokeNo !== ''" class="pore-man">
            单据编号：
            <span>{{requisitionRevokeNo}}</span>
          </p>
        </div> -->
        <el-form :model="porequisitonCancelForm">
          <detail-wrapper :options="{ title: '撤销明细', openPadding: true }">
            <avue-crud
              :data="porequisitonCancelForm.poRequisitonRevokeVOList"
              :option="tableOption"
              @row-click="rowClick"
              style="padding: 4px; box-sizing: border-box"
              class="close-table-select"
            >
              <!-- 撤销数量 -->
              <template slot="revokeQuantity" slot-scope="scope">
                <el-form-item prop="revokeQuantity" :rules="scope.column.rules">
                  <el-input
                    size="mini"
                    clearable
                    maxlength="9"
                    v-model.number="scope.row.revokeQuantity"
                    :disabled="revokeQuantityorremarkFlag"
                  ></el-input>
                </el-form-item>
              </template>
              <!-- 新请购数量 -->
              <template slot="newRequisitionQuantity" slot-scope="scope">
                <div>{{ scope.row.oldRequisitionQuantity - scope.row.revokeQuantity }}</div>
              </template>

              <template slot="remark" slot-scope="scope">
                <el-form-item prop="remark" :rules="scope.column.rules">
                  <el-input
                    type="textarea"
                    size="mini"
                    clearable
                    placeholder="不得超过200个字符"
                    maxlength="200"
                    autosize
                    :disabled="revokeQuantityorremarkFlag"
                    v-model="scope.row.remark"
                  ></el-input>
                </el-form-item>
              </template>

              <template slot="oprateHandle" slot-scope="scope" v-if="saveorsubmitFlag">
                <div style="text-align: right">
                  <!-- <i class="icon-xinzeng y-icon-delect" v-if="scope.row.$index===porequisitonCancelForm.poRequisitonRevokeVOList.length-1" @click="handleAdd(scope.row.$index)"></i> -->
                  <i class="icon-shanchu y-icon-delect" @click="handleDel(scope.row, scope.row.$index)"></i>
                </div>
              </template>
            </avue-crud>
          </detail-wrapper>
        </el-form>
        <!-- <div class="border-rang" style="margin-top:20px;">
          <p class="iod-target iod-header" style="margin-bottom:0px;">
            <span class="pore-head">撤销明细</span>
          </p>
          <div>
            
              
           
          </div>
        </div> -->

        <!-- 操作按钮 -->
        <!-- 
          v-if="permissions.purchase_porequisiton_submit && !isSubmit"
          v-if="permissions.purchase_porequisiton_revoke_save && !isSubmit"
        -->
        <el-row class="pore-submit">
          <el-col :span="24">
            <div class="text-align-right">
              <el-button
                type="primary"
                @click="handleSave"
                size="small"
                v-if="saveorsubmitFlag && permissions.purchase_porequisitonrevoke_save"
                >保 存</el-button
              >
              <el-button
                type="primary"
                @click="handleSubmit"
                size="small"
                v-if="saveorsubmitFlag && permissions.purchase_porequisitonrevoke_submit"
                >提 交</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getCreateInitData, saveData, submitData, getObj } from "@/api/purchase/porequisitonCancel"
import { dateFormat } from "@/filters"
import { formatDate } from "@/filters/index"
import { mapGetters } from "vuex"
import { tableOptionCreate } from "@/const/crud/purchase/porequisitonCancel"
import column from "../../../components/avue/mixins/column"
import { deepClone } from "@/util/util"
export default {
  name: "createPorequisiton",
  data() {
    return {
      time: "",
      createName: "",
      requisitionRevokeNo: "",
      saveorsubmitFlag: false,
      revokeQuantityFlag: false,
      revokeQuantityorremarkFlag: true,
      porequisitonCancelForm: {
        poRequisitonRevokeVOList: [], //poRequisitonRevokeVOList
        deletePoRequisitionNoList: []
      },

      // isSubmit:false,
      tableOption: {},
      index: 0,
      list: {},
      pickerOptions: {
        disabledDate: (time) => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate() - 1))
          return time < nowData
        }
      },
      RevokeNoID: this.$route.query.requisitionRevokeNo,
      requisitionNoID: this.$route.query.requisitionNos
    }
  },

  beforeDestroy() {
    if (this.$parent.$refs.tagNavigate) {
      this.$parent.$refs.tagNavigate.clearTagCache(this.$route.fullPath)
    }
  },
  created: function () {
    // if(this.$parent.$refs.tagNavigate){
    //   this.$parent.$refs.tagNavigate.clearTagCache(this.$route.fullPath);
    // }
    this.loadAll()

    let temp_tableOptionCreate = deepClone(tableOptionCreate)

    if (this.RevokeNoID) {
      temp_tableOptionCreate.column.pop()
    }

    this.tableOption = temp_tableOptionCreate
  },
  computed: {
    ...mapGetters(["permissions", "userInfo"])
  },
  methods: {
    /**
     * 页面初始化
     */
    loadAll: function () {
      // 判断是由哪个页面跳转过来
      //        清除缓存
      if (this.$parent.$refs.tagNavigate) {
        this.$parent.$refs.tagNavigate.clearTagCache(this.$route.fullPath)
      }

      if (this.RevokeNoID) {
        //从请购撤销页面跳转过来
        this.fromrevole = true
        let param = {
          requisitionRevokeNo: this.RevokeNoID
        }
        getObj(this.RevokeNoID)
          .then((response) => {
            this.handleResponse(response, "请求成功", "renew")
          })
          .catch(() => {
            this.$message.error("操作失败")
            return
          })
      } else {
        //从请购单页面跳转过来
        this.fromrevole = false
        this.time = formatDate(new Date(), "yyyy-MM-dd")
        this.createName = this.userInfo.displayname
        let param = {
          requisitionNos: this.requisitionNoID
        }
        getCreateInitData(param)
          .then((response) => {
            this.handleResponse(response, "请求成功", "renew")
          })
          .catch(() => {
            this.$message.error("操作失败")
            return
          })
      }
    },
    /**
     * 确定操作行
     */
    rowClick: function (row, column, event) {
      this.index = row.$index
    },

    /**
     * 新增
     */
    // handleAdd: function(index) {
    //   this.porequisitonCancelForm.poRequisitonRevokeVOList.push(this.porequisitonCancelForm.poRequisitonRevokeVOList[index])
    // },
    /**
     * 删除
     */
    handleDel(row, index) {
      if (this.porequisitonCancelForm.poRequisitonRevokeVOList.length > 1) {
        if (this.porequisitonCancelForm.poRequisitonRevokeVOList[index].requisitionRevokeNo) {
          this.porequisitonCancelForm.deletePoRequisitionNoList.push(
            this.porequisitonCancelForm.poRequisitonRevokeVOList[index].requisitionRevokeNo
          )
        }
        this.porequisitonCancelForm.poRequisitonRevokeVOList.splice(index, 1)
      } else {
        this.$message.error("撤销订单不能少于1行")
        return
      }
    },
    /**
     * 保存
     */
    handleSave: function () {
      //保存或提交前验证
      this.checkSaveOrSubmitBefore()
      if (this.list.length == 0) {
        return
      }
      let param = {
        poRequisitonRevokeVOList: this.list,
        deletePoRequisitionNoList: this.porequisitonCancelForm.deletePoRequisitionNoList
      }
      // console.dir(param);

      saveData(param)
        .then((response) => {
          this.handleResponse(response, "保存成功", "save")
        })
        .catch(() => {
          this.$message.error("操作失败")
          return
        })
    },
    /**
     * 提交
     */
    handleSubmit: function () {
      //保存或提交前验证
      this.checkSaveOrSubmitBefore()
      if (this.list.length == 0) {
        return
      }
      let param = {
        poRequisitonRevokeVOList: this.list,
        deletePoRequisitionNoList: this.porequisitonCancelForm.deletePoRequisitionNoList
      }

      submitData(param)
        .then((response) => {
          this.handleResponse(response, "提交成功", "submit")
        })
        .catch(() => {
          this.$message.error("操作失败")
          return
        })
    },
    /**
     * 保存或提交前校验数据
     */
    checkSaveOrSubmitBefore: function () {
      this.list = []
      // if(this.isSubmit){
      //   this.$message.error("请购单已提交提交，不允许保存或提交");
      //   return;
      // }
      var flag = true
      var tip = ""
      var reg = /^[0-9]+$/
      for (let index = 0; index < this.porequisitonCancelForm.poRequisitonRevokeVOList.length; index++) {
        const element = this.porequisitonCancelForm.poRequisitonRevokeVOList[index]
        // console.dir(element);
        if (!element.revokeQuantity && element.revokeQuantity != 0) {
          tip = "SKU：" + element.skuCode + "，撤销数量不能为空"
          flag = false
          break
        }
        if (!reg.test(element.revokeQuantity)) {
          tip = "SKU：" + element.skuCode + "，撤销数量必须为正整数"
          flag = false
          break
        }
        if (parseInt(element.revokeQuantity) <= 0) {
          tip = "SKU：" + element.skuCode + "，撤销数量必须为正整数"
          flag = false
          break
        }
        if (element.revokeQuantity > element.oldRequisitionQuantity) {
          tip = "SKU：" + element.skuCode + "，撤销数量必须小于原采购数量"
          flag = false
          break
        }
        if (element.remark && element.remark.length > 200) {
          tip = "SKU：" + element.skuCode + "，说明不得超过200个字符"
          flag = false
          break
        }
        var date = new Date()
        this.list.push({
          requisitionRevokeNo: element.requisitionRevokeNo,
          requisitionNo: element.requisitionNo,
          requisitionBatchNo: element.requisitionBatchNo,
          revokeQuantity: element.revokeQuantity,
          remark: element.remark
        })
      }
      if (!flag) {
        this.list = []
        this.$message.error(tip)
        return
      }
      // if(this.list.length == 0){
      //   this.list = []
      //   this.$message.error("撤销订单不得少于一个");
      //   return;
      // }
    },
    /**
     * response相应处理
     */
    handleResponse: function (response, tip, operateCode) {
      // console.log(response.data.code)
      if (response.data.code == 0) {
        response.data.data.forEach((item) => {
          item.revokeQuantity = item.revokeQuantity ? item.revokeQuantity : item.oldRequisitionQuantity
        })
        this.$set(this.porequisitonCancelForm, "poRequisitonRevokeVOList", response.data.data)
        this.porequisitonCancelForm.deletePoRequisitionNoList = []
        if (this.fromrevole) {
          if (this.porequisitonCancelForm.poRequisitonRevokeVOList[0].status == 0) {
            this.saveorsubmitFlag = true
            this.revokeQuantityorremarkFlag = false
          }
          this.time = this.porequisitonCancelForm.poRequisitonRevokeVOList[0].createTime.split(" ")[0]
          this.createName = this.porequisitonCancelForm.poRequisitonRevokeVOList[0].createName
          this.requisitionRevokeNo = this.porequisitonCancelForm.poRequisitonRevokeVOList[0].requisitionRevokeNo
          // this.time = formatDate(this.porequisitonCancelForm.poRequisitonRevokeVOList[0].createTime, "yyyy-MM-dd")
        } else {
          this.saveorsubmitFlag = true
          this.revokeQuantityorremarkFlag = false
        }

        if (this.$parent.$refs.tagNavigate) {
          this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
        }
        if (operateCode === "submit") {
          this.$router.push("/purchase/porequisitonCancel")
        }
        if (operateCode !== "renew") {
          this.$notify({
            title: "成功",
            message: tip,
            type: "success",
            duration: 2000
          })
        }
      } else if (response.data.code == 1) {
        this.$message.error(response.data.msg)
        return
      } else {
        this.$message.error("操作失败")
        console.log("操作失败3")
        return
      }
    }
  }
}
</script>
<style lang="scss">
@import "./index.scss";
</style>
