<template>
  <div>
    <div>
      <el-dialog
        class="followReturnDialog"
        title="跟进退货"
        :visible="value"
        width="860px"
        @close="handleClose"
        @closed="formReset"
        @open="open"
      >
        <el-form
          ref="addOrUpdateForm"
          :model="addOrUpdateForm"
          :rules="followReturnRules"
          status-icon
        >
          <div class="iod-target-top border-rang y-prd-info">
            <p class="iod-target target-title">工单信息</p>

            <div style="padding: 20px" class="flex4">
              <el-form-item class="f4-item" label="工单类型">
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
                  v-model="detailData.keyPointsExtractionText"
                  v-search-input-trim
                  readonly
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
            <p class="iod-target target-title">退货信息</p>
            <div style="padding: 20px">
              <div class="flex5" style="padding-bottom: 20px">
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  label="平台订单号"
                  prop="exchangeRate"
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
                  prop="exchangeRate"
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
                  prop="exchangeRate"
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
                  prop="exchangeRate"
                >
                  <el-input
                    size="small"
                    v-search-input-trim
                    readonly
                    v-model="detailData.soOrderBusinessType"
                  ></el-input>
                </el-form-item>
              </div>

              <avue-crud
                ref="refundCrud"
                :data="detailData.returnDetailMsgInfoVos"
                :option="returnOption"
              >
                <template slot="defaultWarehouseIdList" slot-scope="scope">
                  <template slot="header">
                    <span style="color: red">*</span>
                    <span>退货仓库</span>
                  </template>
                  <template>
                    <el-select
                      v-model="scope.row.warehouseId"
                      clearable
                      placeholder="请选择仓库"
                    >
                      <el-option
                        v-for="item in warehouseList"
                        :key="item.warehouseId"
                        :label="item.warehouseName"
                        :value="item.warehouseId"
                      >
                      </el-option>
                    </el-select>
                  </template>
                </template>
                <template
                  slot="actualReturnNum"
                  label="实际退货数量"
                  slot-scope="scope"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="scope.row.actualReturnNum"
                    :controls="false"
                    :min="0"
                    clearable
                    :max="scope.row.actualReturnNum"
                    size="small"
                  ></el-input-number>
                </template>
                <template slot="returnInBoundNo" slot-scope="scope">
                  <template slot="header">
                    <span style="color: red">*</span>
                    <span>退货入库单号</span>
                  </template>
                  <template>
                    <el-input
                      size="small"
                      v-search-input-trim
                      clearable
                      v-model="scope.row.returnInBoundNo"
                    ></el-input>
                  </template>
                </template>
              </avue-crud>
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
            @click="handleConfirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  tableOption,
  addDetailOption,
  refundOption,
  returnOption,
  remarkOption,
  followReturnRules,
} from './index';
import {
  getReturnMsg,
  followUpOnReturn,
  getAllWarehouse,
} from '@/api/order/afterOrderManage';
import { deepClone } from '@/util/util';

export default {
  name: 'addDialog',
  props: {
    value: {
      default: false,
      required: true,
      type: Boolean,
    },
    workOrderCode: {
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
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      tableOption: tableOption,
      addDetailOption: addDetailOption,
      refundOption: refundOption,
      returnOption: returnOption,
      remarkOption: remarkOption,
      detailData: {},
      warehouseList: [],
      followReturnRules: followReturnRules,
    };
  },
  methods: {
    open() {
      this.getDetail();
      this.getAllWarehouse();
    },
    async getDetail() {
      const { data } = await getReturnMsg({
        workOrderCode: this.workOrderCode,
      });

      if (data.code === 0) {
        const dealData = data.data;
        dealData.returnDetailMsgInfoVos.forEach((item) => {
          item.returnInBoundNo = '';
          item.warehouseId = '';
          item.actualReturnNum = undefined;
          item.warehouseId = item.defaultWarehouse
            ? item.defaultWarehouse
            : item.warehouseId;
        });
        this.detailData = dealData;
      } else {
        this.$emit('input', false);
        this.$message.error(data.msg);
      }
    },
    handleClose() {
      this.$emit('input', false);
    },
    formReset() {
      //方法2
      this.$nextTick(function () {
        this.$refs['addOrUpdateForm'].resetFields();
        this.addOrUpdateForm = {
          isAdd: true,
          currency: null,
          currencyName: null,
          exchangeRate: null,
          averageExchangeRate: null,
        };
      });
      this.$emit('input', false);
    },

    getList() {},
    searchChange() {
      this.getList();
    },
    searchReset() {
      this.addOrderSearchForm = {};
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val;
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection;
    },
    /**
     * 刷新回调
     */ refreshChange() {
      this.getList(this.page);
    },

    async getAllWarehouse(warehouseId) {
      console.log('仓库');
      let query = {};
      if (!warehouseId) {
        query = {
          funcState: '1',
          delFlag: '0',
          isFba: false,
        };
      } else {
        query = {
          warehouseId: warehouseId,
        };
      }
      const { data } = await getAllWarehouse(query);
      if (data.code === 0) {
        this.warehouseList = data.data;
      }
    },
    async handleConfirm() {
      const postData = deepClone(this.detailData);
      postData.cmdDetails = postData.returnDetailMsgInfoVos;
      delete postData.returnDetailMsgInfoVos;
      const { data } = await followUpOnReturn(postData);
      if (data.code == 0) {
        this.$message.success('提交成功');
        this.$emit('input', false);
        this.$emit('success');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
.el-input--small {
  .el-input__inner {
    cursor: not-allowed !important;
  }
}
</style>
