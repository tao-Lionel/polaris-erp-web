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
  - Author: wangxiaowen (AukeyIT@aukeys.com)

  产品详情
  -->

<template>
  <div class="execution" id="prdoverview">
    <basic-container>
      <el-input placeholder="请输入需要搜索的SPU" size="small" v-model="searchSPUModule">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <el-button type="primary"> 查询 </el-button>

      <span>SPU:SPU001 产品名称：这里是产品名称 型号：这里是型号</span>
      <div class="prd-sku-select">
        <!-- 属性切换 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="SKU00001" name="first"></el-tab-pane>
          <el-tab-pane label="SKU00002" name="second"></el-tab-pane>
          <el-tab-pane label="SKU00003" name="third"></el-tab-pane>
          <el-tab-pane label="SKU00004" name="fourth"></el-tab-pane>
          <el-tab-pane label="SKU00005" name="fourth"></el-tab-pane>
          <el-tab-pane label="SKU00005" name="fourth"></el-tab-pane>
          <el-tab-pane label="SKU00005" name="fourth"></el-tab-pane>
          <el-tab-pane label="SKU00005" name="fourth"></el-tab-pane>
        </el-tabs>

        <!-- 展示过多时显示多选 -->
        <el-select v-show="true" v-model="value4" size="small" clearable placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>

      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-carousel :interval="4000" type="card" height="350px">
              <el-carousel-item v-for="item in 6" :key="item">
                <h3>{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light grid-custom">
            <ul>
              <li>
                <strong>SKU名称：</strong>
                <span>这里是SKU名称这里是SKU名称这里是SKU名称这里是SKU名称这里是SKU名称这里是SKU名称这里是SKU名称</span>
              </li>
            </ul>

            <el-row class="prod-status">
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <strong>当前销售状态：</strong>
                  <span>正常</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple-light">
                  <strong>开发人员：</strong>
                  <span>张三</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <strong>维护人员：</strong>
                  <span>李四</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple-light">
                  <strong>所属销售部门：</strong>
                  <span>销售一部</span>
                </div>
              </el-col>
            </el-row>

            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="supplier" label="供应商" width="180"></el-table-column>
              <el-table-column prop="pricetax" label="含税价" width="180"></el-table-column>
              <el-table-column prop="price" label="非税价"></el-table-column>
              <el-table-column prop="isdefault" label="默认供应商"></el-table-column>
              <el-table-column prop="prodcycle" label="生产周期"></el-table-column>
            </el-table>

            <el-table :data="attrData" style="width: 30%; margin-top: 20px">
              <el-table-column prop="name" label="属性名" width="100"></el-table-column>
              <el-table-column prop="value" label="值"> </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="装箱信息" name="first">
          <el-form ref="form" :model="form" :inline="true">
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="文件清单" name="second">
          <el-form ref="form" :model="form" :inline="true">
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="海关要素" name="third">
          <el-form ref="form" :model="form" :inline="true">
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
            <el-form-item label="产品净重(g)" label-width="120px">
              <div style="width: 150px">3569</div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 0,
      data: [],
      activeName: "first",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      attrData: [
        {
          name: "属性A",
          value: "A的value"
        },
        {
          name: "属性B",
          value: "B的value"
        },
        {
          name: "属性C",
          value: "C的value"
        }
      ],
      tableData: [
        {
          supplier: "XX供应商",
          pricetax: 1234.56,
          price: 1234.56,
          isdefault: "是",
          prodcycle: "36d"
        },
        {
          supplier: "XX供应商",
          pricetax: 1234.56,
          price: 1234.56,
          isdefault: "是",
          prodcycle: "36d"
        },
        {
          supplier: "XX供应商",
          pricetax: 1234.56,
          price: 1234.56,
          isdefault: "是",
          prodcycle: "36d"
        },
        {
          supplier: "XX供应商",
          pricetax: 1234.56,
          price: 1234.56,
          isdefault: "是",
          prodcycle: "36d"
        }
      ],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value4: "",
      searchSPUModule: ""
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
