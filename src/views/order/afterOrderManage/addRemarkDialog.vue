<template>
  <el-dialog title="新增备注" :visible="value" width="30%" @close="addCancel">
    <basic-container>
      <el-form
        ref="remarkForm"
        :model="addRemarkForm"
        :rules="addRemarkFormRules"
        status-icon
      >
        <div class="flex-remark">
          <el-form-item
            style="width: 250px; margin-bottom: 0; margin-right: 30px"
            label="备注"
            prop="remark"
          >
            <el-input
              size="small"
              type="textarea"
              placeholder="请输入备注"
              v-search-input-trim
              v-model="addRemarkForm.remark"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="flex-remark" style="text-align: center; margin-top: 20px">
        <el-button size="small" style="padding: 9px 30px" @click="addCancel"
          >取消</el-button
        >
        <el-button
          size="small"
          style="padding: 9px 30px"
          type="primary"
          @click="addSave"
          >确认</el-button
        >
      </div>
    </basic-container>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

import { addRemark } from '@/api/order/afterOrderManage.js';

export default {
  name: 'addRemarkDialog',
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
  watch: {
    workOrderCode(val, oldVal) {
      this.addRemarkForm.workOrderCode = val;
    }
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
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      addRemarkForm: {
        remark: '',
        workOrderCode: '',
        workOrderId: '',

      },
      addRemarkFormRules: {
        remark: [
          {
            required: true,
            message: '请输入备注',
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit('input', false);
    },
    formReset() {
      //方法2
      this.$nextTick(function () {
        this.$refs['remarkForm'].resetFields();
        this.addRemarkForm = {
          remark: '',
        };
      });
      this.$emit('input', false);
    },

    addCancel() {
      this.$emit('input', false);
      this.$refs.remarkForm.resetFields();
    },
    async addSave() {
     await this.$refs.remarkForm.validate()
      const res = await addRemark(this.addRemarkForm);
      if (res.data.code === 0) {
        this.$message.success('添加备注成功');
        this.$emit('input', false);
        this.$emit('success');
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>

<style lang="scss">
.flex-remark {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
