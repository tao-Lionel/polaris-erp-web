<template>
  <div class="execution" id="prdoperatelog">
    <el-dialog title="操作日志" :visible.sync="prdoperatelogDialog" @close="dialogClose" width="60%" height="60%">
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @current-change="currentChange"
        @size-change="sizeChange"
        @refresh-change="refreshChange"
      >
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="prdoperatelogDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getBizLog } from "@/api/baseSetup/bseoperatelog/prdoperatelog"

export default {
  name: "linkSkuLogDialog",
  props: {
    receiveRelateId: Number,
    receiveLogType: Number
  },
  data() {
    return {
      prdoperatelogDialog: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableOption: {
        enableLocalStorage: false,
        border: true,
        index: true,
        indexLabel: "序号",
        header: false,
        stripe: true,
        menuAlign: "center",
        align: "center",
        editBtn: false,
        delBtn: false,
        addBtn: false,
        menu: false,
        dic: [],
        fixHeight: 430,
        column: [
          {
            label: "操作时间",
            prop: "createTime",
            sortable: false
          },
          {
            label: "操作人",
            prop: "createByName",
            sortable: false
          },
          {
            label: "操作类型",
            prop: "operateType",
            sortable: false
          }
        ]
      },
      id: ""
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    dialogClose() {
      this.page = {
        total: 0, // 总页数
        pageSize: 10,
        currentPage: 1 // 当前页数
      }
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getList()
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList()
    },
    getList() {
      let params = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        className: "PrdLinkSkuServiceImpl",
        bizId: this.id
      }
      getBizLog(params).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    showOperateLogDialog(id) {
      this.prdoperatelogDialog = true
      this.id = id
      this.getList()
    }
  }
}
</script>

<style>
#prdoperatelog .avue-crud__menu {
  display: none;
}

#prdoperatelog .el-dialog__body {
  padding: 10px 10px;
}

#prdoperatelog .el-card__body {
  padding: 0px 0px;
}
</style>
