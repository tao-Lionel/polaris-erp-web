<template>
  <div id="labelManageList">
    <basic-container>
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
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" v-if="permissions.oms_lable_manage_add" size="small" @click="addLabelStatus = true"
            >新增标签</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.oms_lable_manage_delete"
            :disabled="!selectRows.length"
            size="small"
            @click="deleteLabel"
            >删除</el-button
          >
        </template>

        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="name">
              <el-input v-model="searchForm.name" placeholder="标签" clearable v-search-input size="small"></el-input>
            </el-form-item>
          </el-form>
        </template>

        <template slot="labelPriority" slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.labelPriority"
            placeholder="请输入优先级"
            @change="changePriority(scope.row)"
          ></el-input>
        </template>

        <template slot="name" slot-scope="scope">
          <span
            style="padding: 8px 10px; border-radius: 4px; color: #fff"
            :style="{ background: getColor(scope.row.labelColor) }"
            >{{ scope.row.name }}</span
          >
          <!-- <el-button :type="scope.row.labelColor">{{scope.row.name}}</el-button> -->
        </template>

        <template slot="labelType" slot-scope="scope">
          <span v-if="scope.row.labelType === 'SYS'">系统标签</span>
          <span v-if="scope.row.labelType === 'CUSTOMIZE'">自定义标签</span>
        </template>

        <template slot-scope="scope" slot="brandSolt">
          <a
            class="brandSolt_ope"
            v-if="permissions.oms_lable_manage_update && scope.row.labelType !== 'SYS'"
            @click="edit(scope.row)"
            >编辑</a
          >
          <a
            class="brandSolt_ope"
            style="margin-left: 10px"
            v-if="permissions.oms_lable_manage_delete && scope.row.labelType !== 'SYS'"
            @click="deleteLabel(scope.row.id)"
            >删除</a
          >
        </template>
      </avue-crud>

      <el-dialog
        :title="addLabelForm.id ? '编辑标签' : '新建标签'"
        :visible.sync="addLabelStatus"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form :model="addLabelForm" ref="addLabelForm" style="padding: 0 20px" :rules="addLabelRule">
          <el-form-item prop="name" label="标签名称" style="margin-bottom: 10px">
            <el-input v-model="addLabelForm.name" placeholder="请输入标签名称"></el-input>
          </el-form-item>
          <el-form-item prop="labelColor" label="标签颜色" style="margin-bottom: 10px">
            <div class="labelColor">
              <span
                class="labelColor-item"
                v-for="(item, index) in labelColorArr"
                :key="item.color"
                :style="{ background: item.color }"
                @click="choiceLabelColor(item.type, index)"
              >
                <i :class="{ 'el-icon-check': index === activeIndex }" style="color: #fff"></i
              ></span>
            </div>
          </el-form-item>
          <el-form-item label="优先级 " style="margin-bottom: 10px">
            <el-input-number
              size="small"
              v-model="addLabelForm.labelPriority"
              controls-position="right"
              placeholder="请输入"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="标签说明" style="margin-bottom: 10px">
            <el-input v-model="addLabelForm.explainMsg" placeholder="请输入标签说明"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="cancel">取消</el-button>
          <el-button size="small" style="padding: 9px 30px" type="primary" @click="save">保存</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { createLabel, updateLabel, getListPage, deleteLabel } from "@/api/order/labelManage"
import { tableOption, addLabelRule } from "@/const/crud/order/labelManage/labelManage"
// import { preventShake } from "@/util/tool"
import { getUrlConcatToken, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "orderRuleList",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        name: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],
      addLabelStatus: false,
      addLabelForm: {
        id: "",
        name: "",
        labelColor: "",
        labelPriority: "",
        explainMsg: ""
      },
      addLabelRule: addLabelRule,
      labelColorArr: [
        { color: "#409eff", type: "primary" },
        { color: "#67c23a", type: "success" },
        { color: "#909399", type: "info" },
        { color: "#e6a23c", type: "warning" },
        { color: "#f56c6c", type: "danger" }
      ],
      activeIndex: ""
    }
  },
  components: {},
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getColor(labelColor) {
      const colorObj = {
        primary: "#409eff",
        success: "#67c23a",
        info: "#909399",
        warning: "#e6a23c",
        danger: "#f56c6c"
      }
      return colorObj[labelColor]
    },
    choiceLabelColor(type, index) {
      this.activeIndex = index
      this.addLabelForm.labelColor = type
    },
    cancel() {
      this.addLabelStatus = false
      this.activeIndex = ""
      this.addLabelForm = {}
      this.$refs["addLabelForm"].resetFields()
    },
    edit(row) {
      this.addLabelForm.id = row.id
      this.addLabelForm.name = row.name
      this.addLabelForm.labelPriority = row.labelPriority
      this.addLabelForm.labelColor = row.labelColor
      this.addLabelForm.explainMsg = row.explainMsg
      this.labelColorArr.forEach((item, index) => {
        if (row.labelColor === item.type) {
          this.activeIndex = index
        }
      })
      this.addLabelStatus = true
    },
    save() {
      this.$refs["addLabelForm"].validate((valid) => {
        if (valid) {
          if (this.addLabelForm.id) {
            updateLabel(this.addLabelForm).then((res) => {
              if (res.data.code === 0) {
                this.$message.success("标签修改成功")
                this.activeIndex = ""
                this.addLabelForm = {}
                this.addLabelStatus = false
                this.refreshChange()
              }
            })
          } else {
            createLabel(this.addLabelForm).then((res) => {
              if (res.data.code === 0) {
                this.$message.success("新增标签成功")
                this.activeIndex = ""
                this.addLabelForm = {}
                this.addLabelStatus = false
                this.refreshChange()
              }
            })
          }
        }
      })
    },
    // 删除数据
    async deleteLabel(id) {
      try {
        const data = await this.$confirm("您确定删除这条数据吗", "删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        const param = typeof id === "number" ? [id] : this.selectRows.map((item) => item.id)
        const res = await deleteLabel(param)
        if (res.data.code === 0) {
          this.selectRows = []
          this.$refs.crud.selectClear()
          this.refreshChange()
          this.$message.success("标签删除成功")
        }
      } catch (err) {
        console.log("取消", err)
      }
    },
    // 优先级改变
    async changePriority(row) {
      let param = {
        id: row.id,
        name: row.name,
        labelPriority: row.labelPriority,
        labelColor: row.labelColor,
        explainMsg: row.explainMsg
      }
      let res = await updateLabel(param)
      if (res.data.code === 0) {
        this.refreshChange()
        this.$message.success("优先级修改成功")
      }
    },
    // 导出数据
    async exportDataRule() {
      let res = await exportData(this.searchFormConfirm)
        .then((res) => {
          downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      console.log(params, page)
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      page = page || { currentPage: 1 }
      Object.assign(this.searchFormConfirm, params)
      params.scene = this.tabPositionModel
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.searchForm = {}
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    getList(page, params) {
      this.page.currentPage = page.currentPage
      getListPage(
        Object.assign(
          {
            page: page.currentPage,
            pageSize: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((res) => {
        this.tableData = res.data.data ? res.data.data.records : []
        this.page.total = res.data.data ? res.data.data.total : 0
      })
    },
    changeTabPosition(val) {
      this.getList(this.page, { scene: val })
    },
    /**导出 */
    handleExport() {
      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.currency)
        })
        par += "&selectCurrencyList=" + keys
      } else {
        Object.keys(this.searchFormConfirm).forEach((key) => {
          if (this.searchFormConfirm[key]) {
            par += "&" + key + "=" + this.searchFormConfirm[key]
          }
        })
      }
      this.$notify({
        title: "成功",
        message: "正在导出（注意：最多可导出6W条数据）",
        type: "success",
        duration: 2000
      })
      window.location = getUrlConcatToken(`/api/baseSetup/bsecurrency/handleExport`) + par
    }
  }
}
</script>

<style lang="scss">
#labelManageList {
  .brandSolt_ope {
    text-decoration: none;
  }

  .labelColor {
    display: flex;
    align-items: center;
    height: 100%;

    .labelColor-item {
      display: block;
      width: 18px;
      height: 18px;
      border-radius: 100%;
      margin-right: 15px;
      cursor: pointer;
      position: relative;

      .el-icon-check {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 100;
        transform: translate(-50%, -50%);
      }
    }

    // .activeLabel{
    //   &::before{
    //     content: '';
    //     position: absolute;
    //     width: 12px;
    //     height: 12px;
    //     background: #fff;
    //     top: 50%;
    //     left: 50%;
    //     transform: translate(-50%, -50%);
    //     border-radius: 100%;
    //   }
    // }
  }
}
</style>
