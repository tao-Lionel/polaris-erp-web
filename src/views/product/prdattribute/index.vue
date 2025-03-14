<!--
  -    Copyright (c) 2018-2025, Aukey All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the trob4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: wangbin (AukeyIT@aukeys.com)
  -->

<template>
  <!-- 基础属性 -->
  <div class="execution" id="prdattribute">
    <!-- <basic-container> -->
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="tableOption"
      @size-change="sizeChange"
      @search-change="handleFilter"
      @search-reset="searchReset"
      @on-load="getList"
      @refresh-change="refreshChange"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <el-button type="primary" @click="handleRowAdd" size="small" v-if="permissions.product_prdskuattr_add"
          >新 增</el-button
        >
        <el-button type="primary" @click="handleRowUpdate" size="small" v-if="permissions.product_prdskuattr_edit"
          >编 辑</el-button
        >
        <el-button type="primary" @click="attrRowDel" size="small" v-if="permissions.product_prdskuattr_del"
          >删 除</el-button
        >
      </template>

      <template slot="search">
        <el-form :model="search" @submit.prevent.native>
          <el-form-item>
            <avue-crud-input
              v-model="search.attributeName"
              placeholder="属性名称"
              size="small"
              clearable
              @keyup.enter.native="handleFilter"
            ></avue-crud-input>
          </el-form-item>
          <el-form-item class="exclude-label">
            <el-select v-model="search.categoryId" size="small" placeholder="品类">
              <el-option
                v-for="item in categoryArr"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button v-show="false" native-type="submit" @click="getList({ currentPage: 1 })"></el-button>
        </el-form>
      </template>

      <template slot="tableBeforeSlot">
        <p style="color: red; margin-bottom: 10px">
          <span>提示：1、请先筛选“品类”，搜索数据之后，再设置“优先级” </span>
          <span style="margin-left: 20px">2、优先级数字越小，排序越靠前，请从1开始填写正整数</span>
        </p>
      </template>
      <template slot="sortNumber" slot-scope="scope">
        <el-input-number
          style="width: 100%"
          v-model="scope.row.sort"
          placeholder="请输入优先级"
          :min="1"
          size="small"
          :controls="false"
          @change="modifySort(scope.row)"
          :precision="0"
        >
        </el-input-number>
      </template>
      <template slot="attributeName" slot-scope="scope">
        <span class="el-row-text">
          {{ scope.row.attributeName }}
        </span>
      </template>
      <template slot-scope="scope" slot="operateValue">
        <!-- <el-button type="text" size="small" v-if="permissions.product_prdskuattributevalue_add" @click="addAttrValue(scope.row,scope.index)">新增</el-button>
          <el-button type="text" size="small" v-if="permissions.product_prdskuattributevalue_edit" @click="updateAttrValue(scope.row,scope.index)">编辑</el-button>
          <el-button type="text" size="small" v-if="permissions.product_prdskuattributevalue_del" @click="delAttrValue()">删除</el-button> -->
        <!-- <i class="icon-xinzeng y-icon-add"
          v-if="permissions.product_prdskuattributevalue_add && scope.row.systemStatus==0"
          @click="addAttrValue(scope.row,scope.index)"></i> -->
        <i
          class="icon-bianji y-icon-edit"
          v-if="permissions.product_prdskuattributevalue_edit && scope.row.systemStatus == 0"
          @click="updateAttrValue(scope.row, scope.index)"
        ></i>
        <!-- <i class="icon-shanchu y-icon-delect"
          v-if="permissions.product_prdskuattributevalue_del && scope.row.systemStatus==0" @click="delAttrValue(scope.row)"></i> -->
        <!-- v-if="permissions.product_prdattribute_edit" -->
      </template>

      <!-- :checked="domain.funcState=='0'?true:false" -->
      <template slot-scope="scope" slot="attributeValues">
        <el-checkbox
          class="attribute-checkbox"
          :title="domain.attributeValueName"
          v-for="domain in scope.row.attributeValues"
          :key="domain.attributeValueId"
          :label="domain.attributeValueName"
          @change="checkboxChange(domain, scope.row)"
        >
          {{ domain.attributeValueName }}{{ domain.attributeValueCode ? "，" + domain.attributeValueCode : "" }}
        </el-checkbox>
        <!-- <span v-if="scope.row.attributeValues">
            <el-tag
              v-for="domain in scope.row.attributeValues"
              :key="domain.attributeValueId"
            >{{domain.attributeValueName}}</el-tag>
          </span> -->
      </template>
    </avue-crud>
    <!-- </basic-container> -->

    <!-- 新增、修改弹窗 -->
    <dia
      :modal-obj="modalObj"
      :modalShow="modalVisible"
      :rowForm="JSON.stringify(rowForm)"
      ref="mydialog"
      :rules="rules"
      :isAdd="isAdd"
      :visi="visi"
      :addAttr="addAttr"
      :eidtAttr="eidtAttr"
      :addValue="addValue"
      :eidtValue="eidtValue"
      :categoryArr="categoryArr"
      v-on:getModalShow="getModalShow"
      @addAttrRow="addAttrRow"
      @eidtAttrRow="eidtAttrRow"
      @addAttrValueRow="addAttrValueRow"
      @eidtAttrValueRow="eidtAttrValueRow"
      @removeDomain="removeDomain"
    ></dia>
  </div>
</template>
<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  addAttAndVal,
  updateAttAndVal,
  delAttrVal,
  sortAttAndVal
} from "@/api/product/prdattribute"
import { fetchTreeListByPid } from "@/api/product/prdskucategory"
import { tableOption } from "@/const/crud/product/prdattribute"
import { rowForm, rules } from "@/const/crud/product/dailog/prdattrdailog"
import dia from "./attrdailog"
import { preventShake } from "@/util/tool"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "../../../components/avue/utils/util"
export default {
  name: "prdattribute",
  components: {
    dia
  },
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      search: {
        attributeName: ""
      },
      tableOption: tableOption,
      addFormVisible: false,
      rowForm: rowForm,
      rules: rules,
      rowList: [],
      modalVisible: false,
      modalObj: { title: "" },
      visi: false,
      addAttr: false,
      eidtAttr: false,
      addValue: false,
      eidtValue: false,
      isAdd: true,
      delAttrValIds: [],
      delAttrValParentId: -1,
      dataCache: [],
      sortList: [],
      categoryArr: []
    }
  },
  created() {
    fetchTreeListByPid(-1).then((res) => {
      if (res.data.code === 0) {
        this.categoryArr = res.data.data
      }
    })
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    modifySort(row) {
      // if (this.sortList.includes(row.sort)) {
      //   this.$message.warning('不能填写优先级重复的数字')
      //   setTimeout(() => {
      //     this.$set(this.tableData[row.$index], 'sort', this.sortList[row.$index])
      //   }, 0)
      //   return
      // }
      const params = {
        sortList: [{ [row.attributeId]: row.sort }]
      }
      sortAttAndVal(params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success("优先级调整成功")
            this.getList(this.page)
          }
        })
        .catch((err) => {
          this.$set(this.tableData[row.$index], "sort", this.sortList[row.$index])
        })
    },
    removeDomain(item) {
      var index = this.rowForm.attributeValues.indexOf(item)
      if (index !== -1) {
        this.rowForm.attributeValues.splice(index, 1)
      }
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    handleFilter() {
      this.getList(this.page)
      this.clearSelectClear()
    },
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    searchReset() {
      this.search = {}
    },
    getList(page) {
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          this.search
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.sortList = this.tableData.map((item) => item.sort)
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 多选勾选
     */
    selectionChange(list) {
      this.rowList = list
    },
    setSignToFalse() {
      this.addAttr = false //新增属性
      this.eidtAttr = false //编辑属性
      this.addValue = false //属性值新增
      this.eidtValue = false //编辑属性值
    },
    /**
     * 属性编辑弹出dailog
     */
    handleRowUpdate() {
      if (!this.rowList || this.rowList.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }

      this.rowForm = {}
      if (this.rowList.length === 1) {
        const row = this.rowList[0]

        // this.rowForm=row;
        if (row.systemStatus == 1) {
          this.$message.warning("系统属性不支持修改!!")
          return
        }
        this.rowForm.attributeId = row.attributeId
        this.rowForm.categoryId = row.categoryId
        this.rowForm.attributeName = row.attributeName
        this.rowForm.attributeValues = row.attributeValues
        this.modalObj.title = "属性编辑"
        this.isAdd = false
        this.visi = false
        this.setSignToFalse()
        this.eidtAttr = true //编辑属性
        this.$refs.mydialog.showDialog(true)
        //给form赋值
        this.$refs.mydialog.setRowForm(JSON.stringify(this.rowForm))
      } else {
        this.$message.warning("只能勾选一条数据")
        return
      }
    },
    /**
     * 属性新增弹出dailog
     */
    handleRowAdd() {
      this.modalObj.title = "属性新增"
      this.visi = true
      this.isAdd = false
      this.setSignToFalse()
      this.addAttr = true //新增属性
      this.rowForm = {
        attributeName: "",
        attributeValues: [
          {
            attributeValueId: "",
            attributeValueName: "",
            attributeValueCode: null,
            funcState: ""
          }
        ]
      }
      this.$refs.mydialog.showDialog(true)
      //给form赋值
      this.$refs.mydialog.setRowForm(JSON.stringify(this.rowForm))
    },
    /**
     * 属性值新增
     */
    addAttrValue(row, index) {
      this.rowForm = {}
      this.isAdd = true
      let data = {
        categoryId: row.categoryId,
        attributeId: row.attributeId,
        attributeName: row.attributeName,
        attributeValues: [
          {
            attributeValueId: "",
            attributeValueName: "",
            attributeValueCode: null
          }
        ]
      }
      this.rowForm = data
      this.modalObj.title = "属性值新增"
      this.visi = true
      this.setSignToFalse()
      this.addValue = true
      this.$refs.mydialog.showDialog(true)
      //给form赋值
      this.$refs.mydialog.setRowForm(JSON.stringify(this.rowForm))
    },
    /**
     * 属性值编辑弹出框
     */
    updateAttrValue(row, index) {
      this.rowForm = {}
      this.isAdd = true
      this.rowForm.categoryId = row.categoryId
      this.rowForm.attributeId = row.attributeId
      this.rowForm.attributeName = row.attributeName
      if (!row.attributeValues) {
        this.$message.warning("属性值不存在，请先新增属性值")
        return
      }
      row.attributeValues.forEach((bean, index) => {
        bean = Object.assign(bean || {}, { key: Date.now() + Math.random() })
        // bean.key = new Date().getTime;
      })

      this.rowForm.attributeValues = row.attributeValues
      this.modalObj.title = "属性值编辑"
      this.visi = true
      this.setSignToFalse()
      this.eidtValue = true //编辑属性值
      this.$refs.mydialog.showDialog(true)
      //给form赋值
      this.$refs.mydialog.setRowForm(JSON.stringify(this.rowForm))
    },
    /**
     * 属性新增
     */
    addAttrRow(row) {
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          addObj(row)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message({
                  showClose: true,
                  message: "新增成功",
                  type: "success"
                })
                _this.tableData.push(Object.assign({}, row))
                _this.$refs.mydialog.showDialog(false)
                _this.clearSelectClear()
                _this.getList(_this.page)
              } else if (response.data.code == 1) {
                _this.$message.error(response.data.msg)
                return
              } else {
                _this.$message.error("新增失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error("新增失败")
              return
            })
        }
      })
    },
    /**
     * 属性编辑
     */
    eidtAttrRow(row) {
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          putObj(row)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                })
                _this.$refs.mydialog.showDialog(false)
                _this.clearSelectClear()
                _this.getList(_this.page)
              } else if (response.data.code == 1) {
                _this.$message.error(response.data.msg)
                return
              } else {
                _this.$message.error("修改失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error("修改失败")
              return
            })
        }
      })
    },
    /**
     * 新增-保存属性值操作
     */
    addAttrValueRow(row) {
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          addAttAndVal(row)
            .then((response) => {
              if (response.data.code == 0) {
                this.$message({
                  showClose: true,
                  message: "新增成功",
                  type: "success"
                })
                this.$refs.mydialog.showDialog(false)
                this.clearSelectClear()
                this.getList(this.page)
              } else if (response.data.code == 1) {
                this.$message.error(response.data.msg)
                return
              } else {
                this.$message.error("新增失败")
                return
              }
            })
            .catch(() => {
              this.$message.error("新增失败")
              return
            })
        }
      })
    },
    /**
     * 编辑-保存属性值操作
     */
    eidtAttrValueRow(row) {
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          updateAttAndVal(row)
            .then((response) => {
              if (response.data.code == 0) {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                })
                this.$refs.mydialog.showDialog(false)
                this.clearSelectClear()
                this.getList(this.page)
              } else if (response.data.code == 1) {
                this.$message.error(response.data.msg)
                return
              } else {
                this.$message.error("修改失败")
                return
              }
            })
            .catch(() => {
              this.$message.error("修改失败")
              return
            })
        }
      })
    },
    /**
     * 属性删除
     */
    attrRowDel() {
      if (!this.rowList || this.rowList.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      var ids = ""
      var sysV = []
      this.rowList.forEach((item) => {
        if (item.systemStatus == 1) {
          sysV.push(item.attributeName)
        }
        ids += item.attributeId + ","
      })
      if (sysV.length > 0) {
        this.$message.warning(sysV + "为系统属性不允许删除")
        return
      }
      //去掉最后一个逗号(如果不需要去掉，就不用写)
      if (ids.length > 0) {
        ids = ids.substr(0, ids.length - 1)
      }
      var _this = this

      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(ids)
        })
        .then((data) => {
          if (data.data.code === 0) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            })
            this.clearSelectClear()
            this.getList(this.page)
          } else if (data.data.code === 1) {
            _this.$message.error(data.data.msg)
          } else {
            _this.$message.error("删除失败")
          }
        })
        .catch(function (err) {
          _this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    /**
     * 属性值状态变更
     */
    checkboxChange(valBean, row) {
      //用行号定义是否选中当前行
      let cache = this.dataCache
      let isNew = true
      cache.forEach((item) => {
        if (row.attributeId === item.parentId) {
          isNew = false
        }
      })
      if (isNew) {
        cache.push({
          parentId: row.attributeId,
          arr: [valBean.attributeValueId]
        })
      } else {
        cache.forEach((item) => {
          if (row.attributeId === item.parentId) {
            let index = item.arr.indexOf(valBean.attributeValueId)
            if (index == -1) {
              item.arr.push(valBean.attributeValueId)
            } else {
              item.arr.splice(index, 1)
            }
          }
        })
      }
    },
    /**删除属性值 */
    delAttrValue() {
      if (!this.dataCache || this.dataCache.length === 0) {
        this.$message.warning("未勾选属性值")
        return
      }
      this.dataCache = this.dataCache.filter((obj) => obj.arr.length > 0)
      if (this.dataCache.length !== 1) {
        this.$message.warning("不能选中多行的属性值")
        return
      }
      let ids = this.dataCache[0].arr

      var _this = this
      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delAttrVal(ids.join(","))
        })
        .then((data) => {
          if (data.data.code === 0) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            })
            this.clearSelectClear()
            this.getList(this.page)
            this.dataCache = []
          } else if (data.data.code === 1) {
            _this.$message.error(data.data.msg)
          } else {
            _this.$message.error("删除失败")
          }
        })
        .catch(function (err) {
          _this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    /**
     * dailog消失需要执行的操作
     */
    getModalShow(val) {
      this.modalVisible = val
      if (!val) {
        this.modalObj = { title: "" }
        this.visi = val
        this.addAttr = val
        this.eidtValue = val
        this.eidtAttr = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#prdattribute {
  .el-checkbox {
    margin: 0 5px;
    // width: 65px;

    ::v-deep .el-checkbox__label {
      padding-left: 5px;
      // overflow: hidden;
      display: inline-block;
      // width: 80%;
      white-space: nowrap;
      // text-overflow: ellipsis;
    }

    ::v-deep .el-checkbox__input {
      vertical-align: top;
    }
  }
}
</style>
