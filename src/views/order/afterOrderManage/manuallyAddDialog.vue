<template>
  <el-dialog title="添加商品" :visible="value" width="50%" @close="addCancel" @open="open">
    <basic-container>
      <avue-crud
        ref="addSkuCrud1"
        :page="page"
        :data="tableData"
        :option="addSkuOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template slot="search">
          <el-form>
            <el-form-item label="SKU" size="small">
              <el-input
                v-model.trim="addOrderSearchForm.skuCode"
                placeholder="请输入SKU"
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
        <template slot="imageUrl" slot-scope="scope">
          <img
            class="big-img"
            v-if="scope.row.imageUrl"
            :src="scope.row.imageUrl"
            :alt="加载失败"
          />
          <span v-else></span>
        </template>
      </avue-crud>
      <div style="text-align: center; margin-top: 20px">
        <el-button size="small" style="padding: 9px 30px" @click="addCancel"
          >取消</el-button
        >
        <el-button
          size="small"
          style="padding: 9px 30px"
          type="primary"
          :disabled="!selectRows.length"
          @click="addSave"
          >确认</el-button
        >
      </div>
    </basic-container>
  </el-dialog>
</template>

<script>
import { addSkuOption, tableOption } from './index';
import { mapGetters } from 'vuex';
import { getTokenUrl } from "@/util/auth";


import {
  getProductList,
} from '@/api/order/afterOrderManage.js';
export default {
  name: 'manuallyAddDialog',
  props: {
    value: {
      default: false,
      required: true,
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  data() {
    return {
      searchForm: {},
      //审核状态
      approveStatusOptions: [
        { value: 1, label: '待审核' },
        { value: 2, label: '已审核' },
      ],

      tableData: [],
      addOrderSearchForm: {
        skuCode: '',
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      selectRows: [],
      addSkuOption:addSkuOption
    };
  },
  methods: {
    open() {
      this.getList();
    },
    handleClose() {
      // this.visible = false;
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

    addCancel() {
      this.$emit('input', false);
      this.$refs.addSkuCrud1.selectClear();
      this.addOrderSearchForm.skuCode = '';
      this.tableData = [];
    },
    async getList() {
      const postData = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        skuCode: this.addOrderSearchForm.skuCode
      }
      const { data } = await getProductList(postData)
      if (data.code === 0) {
        data.data.records.forEach(item => {
            item.imageUrl = item.imageUrl ? getTokenUrl([item.imageUrl]) : ''
          })
        this.tableData = data.data.records;

        this.page.total = data.data.total;
        this.page.currentPage = data.data.current;
        this.page.pageSize = data.data.size;
     }
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    searchChange() {
      console.log(2222);
      this.page.currentPage = 1;
      this.page.pageSize = 10;
      this.getList();
    },
    searchReset() {
      this.addOrderSearchForm = {
        skuCode:''
      };
      this.page.currentPage = 1;
      this.page.pageSize = 10;
      this.getList();
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val;
    },
    //选中行事件
    selectionChange(selection) {
      console.log('selection',selection);
      this.selectRows = selection;
    },
    /**
     * 刷新回调
     */ refreshChange() {
      this.getList();
    },
    addSave() {
      this.$emit('selectedProduct', this.selectRows)
      this.$emit('input', false)
    }
  },
};
</script>

<style lang="scss" scoped>
#manually {
  .el-textarea__inner {
    height: 90px;
  }

  .mydialog-add .el-form-item__label {
    width: 124px;
  }
}
#bsecurrency {
  .el-textarea__inner {
    height: 90px;
  }

  .mydialog-add .el-form-item__label {
    width: 124px;
  }
}
.big-img {
    height: 50px;
    width: 50px;
    object-fit: cover;
  }
</style>
