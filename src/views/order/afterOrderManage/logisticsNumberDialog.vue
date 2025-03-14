<template>
  <div>
    <div>
      <el-dialog
        class="logisticsNumberDialog"
        title="填写物流单号"
        :visible="value"
        width="860px"
        @close="handleClose"
        @closed="formReset"
        @open="open"
      >
        <el-form ref="addOrUpdateForm" :model="addOrUpdateForm" status-icon>
          <div class="iod-target-top border-rang y-prd-info">
            <p class="iod-target target-title">工单信息</p>

            <div style="padding: 20px" class="flex4">
              <el-form-item
                class="f4-item"
                label="工单类型"
                prop="exchangeRate"
              >
                <el-input
                  size="small"
                  v-search-input-trim
                  readonly
                  v-model="detailData.workOrderTypeName"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="f4-item"
                prop="approveStatus"
                label="售后原因"
              >
                <el-input
                  size="small"
                  v-search-input-trim
                  readonly
                  v-model="detailData.reason"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="f4-item"
                label="投诉原文"
                prop="exchangeRate"
              >
                <el-input
                  size="small"
                  v-search-input-trim
                  readonly
                  v-model="detailData.complainOriginalText"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="f4-item"
                label="要点提取"
                prop="exchangeRate"
              >
                <el-input
                  size="small"
                  v-search-input-trim
                  readonly
                  v-model="detailData.keyPointsExtractionText"
                ></el-input>
              </el-form-item>
            </div>
          </div>

          <div
            class="iod-target-top border-rang y-prd-info"
            style="margin-top: 20px"
          >
            <p class="iod-target target-title">备注信息</p>

            <div style="padding: 20px" class="flex4">
              <avue-crud
                ref="crud"
                :data="detailData.remarkList"
                :option="remarkOption"
              >
              </avue-crud>
            </div>
          </div>
          <div
            class="iod-target-top border-rang y-prd-info"
            style="margin-top: 20px"
          >
            <p class="iod-target target-title">订单信息</p>
            <div style="padding: 20px">
              <div class="flex5" style="padding-bottom: 20px">
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  label="平台订单号"
                >
                  <el-input
                    size="small"
                    v-search-input-trim
                    readonly
                    v-model="detailData.sourceCode"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  label="订单号"
                >
                  <el-input
                    size="small"
                    v-search-input-trim
                    readonly
                    v-model="detailData.soOrderCode"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  label="店铺"
                >
                  <el-input
                    size="small"
                    v-search-input-trim
                    readonly
                    v-model="detailData.shopAccount"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  label="交货模式"
                >
                  <el-input
                    size="small"
                    v-search-input-trim
                    readonly
                    v-model="detailData.soOrderBusinessType"
                  ></el-input>
                </el-form-item>
              </div>

              <div>
                <p class="confirm-tips">
                  请检查订单发货信息、sku匹配等是否正确，确认订单后将不可变更！确认订单后，请继续操作【生成发货单】！
                </p>
                <el-table
                  :data="detailData.detailList"
                  :border="true"
                  :max-height="400"
                  style="width: 100%"
                >
                  <el-table-column prop="sku" label="SKU" width="160">
                  </el-table-column>
                  <el-table-column prop="skuName" label="产品名称" width="260">
                  </el-table-column>
                  <el-table-column prop="categoryName" label="品类" width="120">
                  </el-table-column>
                  <el-table-column prop="brandName" label="品牌" width="70">
                  </el-table-column>
                  <el-table-column
                    prop="soOrderDetailQuantity"
                    label="下单数量"
                    width="100"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="actualDeliveryNum"
                    label="已发货数量"
                    width="130"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="warehouseId"
                    label="申请退货数量"
                    width="160"
                  >
                    <template slot="header">
                      <span style="color: red">*</span>
                      <span>申请退货数量</span>
                    </template>
                    <template slot-scope="scope">
                      {{ scope.row.returnQuantity }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="warehouseId"
                    label="退货物流单号"
                    width="300"
                  >
                    <template slot="header">
                      <span style="color: red">*</span>
                      <span>退货物流单号</span>
                    </template>
                    <template slot-scope="scope">
                      <el-input
                        size="small"
                        v-search-input-trim
                        placeholder="如有多个，英文,分隔"
                        v-model="scope.row.logisticsNo"
                      ></el-input>
                    </template>
                  </el-table-column>

                </el-table>
              </div>
            </div>
          </div>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
          style="display: flex; justify-content: center"
        >
          <el-button style="padding: 9px 30px" size="small" @click="handleClose"
            >取 消</el-button
          >

          <el-button
            type="primary"
            size="small"
            style="padding: 9px 30px"
            @click="handleConfirm()"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { remarkOption } from './index';
import { getWorkOrderMsg, addLogisticsNo } from '@/api/order/afterOrderManage';
import { deepClone } from '@/util/util';

export default {
  name: 'logisticsNumberDialog',
  props: {
    value: {
      default: false,
      required: true,
      type: Boolean,
    },
    logisticsWorkOrderCode: {
      required: true,
      default: '',
      type: String,
    },
  },
  data() {
    return {
      addProductVisible: false,
      searchForm: {},
      //审核状态
      approveStatusOptions: [
        { value: 1, label: '待审核' },
        { value: 2, label: '已审核' },
      ],
      addOrderSearchForm: {
        skuCode: '',
      },
      remarkOption: remarkOption,
      detailData: {}, // 回显数据
      splitNumber: 0,
    };
  },
  watch: {},
  methods: {
    handleClose() {
      this.$emit('input', false);
    },
    formReset() {
      //方法2
      this.$nextTick(function () {
        this.$refs['addOrUpdateForm'].resetFields();
        this.addOrUpdateForm = {};
      });
      this.$emit('input', false);
    },
    handleAdddProduct() {
      this.addProductVisible = true;
    },
    async getDetail() {
      const { data } = await getWorkOrderMsg({
        workOrderCode: this.logisticsWorkOrderCode,
      });
      if (data.code === 0) {
        this.detailData = data.data;
      }
    },
    searchReset() {
      this.addOrderSearchForm = {};
    },

    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection;
    },

    addDetail(scope) {
      console.log('复制行');
    },
    delDetail(scope) {
      // this.confirmTableData.splice(scope.$index, 1)
    },

    open() {
      this.getDetail();
    },


    //  提交订单
    async handleConfirm() {
      console.log(this.detailData);
      const postData = deepClone(this.detailData);
      const { data } = await addLogisticsNo({
        ...postData,
        workOrderCode: this.logisticsWorkOrderCode
      });

      if (data.code == 0) {
        this.$message.success('提交成功')
        this.$emit('input',false)
        this.$emit('success')
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-tips {
  padding: 10px;
  color: red;
  background: #efefef;
  font-size: 13px;
}

.flex4 {
  display: flex;
  flex-wrap: wrap;
  .f4-item {
    width: 25%;
  }
}
.flex5 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
