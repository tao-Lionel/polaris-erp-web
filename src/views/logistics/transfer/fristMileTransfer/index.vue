<template>
  <div id="transfer">
    <!-- 调拨管理 -->
    <div class="execution" v-loading.fullscreen.lock="loading" element-loading-text="正在处理中" id="porequisitonList">
      <basic-container>
        <avue-crud
          ref="crud"
          :page="page"
          :data="tableData"
          :option="tableOption"
          @refresh-change="refreshChange"
          @search-change="searchChange"
          @search-reset="searchReset"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="selectionChange"
          :cell-class-name="getCellClass"
        >
          <template slot="menuLeft">
            <!-- <el-dropdown-button type="primary" size="small" buttonText="导 出" @command="handleCommand"
            v-if="permissions.transfer_tmstransfer_export" style="margin-right:-5px;margin-left: 0px;width: 100px;">
            <el-dropdown-item command="列表导出">列表导出</el-dropdown-item>
            <el-dropdown-item command="明细导出">明细导出</el-dropdown-item>
            <el-dropdown-item command="货物交接单"
              v-if="tabPositionModel == '4' || tabPositionModel == '5'">货物交接单</el-dropdown-item>
          </el-dropdown-button>-->
            <el-button type="primary" v-if="permissions.transfer_head_create" @click="openNewPage" size="small"
              >新 增</el-button
            >
            <el-button type="primary" v-if="permissions.transfer_head_submit" @click="transferSubmit" size="small"
              >提交</el-button
            >
            <el-button
              type="primary"
              v-if="permissions.transfer_head_confirm_deliver"
              @click="sendMutiConfirm"
              size="small"
              >确认发货</el-button
            >
            <el-button type="primary" v-if="permissions.transfer_head_import_cost" @click="costImport" size="small"
              >导入费用</el-button
            >
            <el-button type="primary" @click="costLock" size="small" v-if="false">锁定费用</el-button>
            <el-button type="primary" v-if="permissions.transfer_head_force_finish" @click="forceEndShow" size="small"
              >强制完结</el-button
            >
            <el-button type="primary" v-if="permissions.transfer_head_export" @click="exportData" size="small"
              >导出</el-button
            >
            <el-button type="primary" @click="batchModifyTime" v-if="permissions.transfer_head_update_time" size="small"
              >批量修改时间</el-button
            >
            <el-button type="primary" @click="handleUploadAttachment" size="small"> 上传附件 </el-button>
            <el-button type="primary" @click="handleFileList(null)" size="small"> 下载附件 </el-button>
          </template>
          <template slot="search">
            <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
              <el-form-item prop="transferNo">
                <el-input
                  v-model="searchForm.transferNo"
                  size="small"
                  placeholder="调拨单号,支持多个"
                  v-search-input
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="containerNo">
                <el-input
                  v-model="searchForm.containerNo"
                  size="small"
                  placeholder="柜号,支持多个"
                  v-search-input
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="cabinetNumber">
                <el-input
                  v-model="searchForm.cabinetNumber"
                  size="small"
                  placeholder="排柜号,支持多个"
                  v-search-input
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="spuCode">
                <el-input
                  v-model="searchForm.spuCode"
                  size="small"
                  placeholder="标准SPU,支持多个"
                  v-search-input
                  clearable
                ></el-input>
              </el-form-item>
            </el-form>
          </template>

          <template slot="searchAdvanced">
            <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm">
              <el-form-item prop="skuCode">
                <el-input
                  v-model="searchForm.skuCode"
                  size="small"
                  placeholder="SKU,支持多个"
                  v-search-input
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="transferBusinessType">
                <el-select
                  size="small"
                  v-model="searchForm.transferBusinessType"
                  clearable
                  filterable
                  placeholder="业务类型"
                >
                  <el-option
                    v-for="item in transferBusinessTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="fmWarehouseId">
                <el-select
                  size="small"
                  v-model="searchForm.fmWarehouseId"
                  multiple
                  collapse-tags
                  clearable
                  filterable
                  placeholder="转出仓"
                >
                  <el-option
                    v-for="item in warehouseOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="toWarehouseId">
                <el-select
                  size="small"
                  v-model="searchForm.toWarehouseId"
                  multiple
                  collapse-tags
                  clearable
                  filterable
                  placeholder="目的仓"
                >
                  <el-option
                    v-for="item in warehouseOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="fmCountryCode">
                <el-select
                  size="small"
                  v-model="searchForm.fmCountryCode"
                  multiple
                  collapse-tags
                  clearable
                  filterable
                  placeholder="起运国家"
                >
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="toCountryCode">
                <el-select
                  size="small"
                  v-model="searchForm.toCountryCode"
                  multiple
                  collapse-tags
                  clearable
                  filterable
                  placeholder="目的国家"
                >
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="transferStatus">
                <el-select
                  size="small"
                  v-model="searchForm.transferStatus"
                  multiple
                  collapse-tags
                  clearable
                  filterable
                  placeholder="调拨状态"
                >
                  <el-option
                    v-for="item in transferStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="costLockStatus">
                <el-select
                  size="small"
                  v-model="searchForm.costLockStatus"
                  multiple
                  collapse-tags
                  clearable
                  filterable
                  placeholder="费用状态"
                >
                  <el-option
                    v-for="item in costLockStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="abnormalType">
                <el-select
                  size="small"
                  v-model="searchForm.abnormalType"
                  multiple
                  collapse-tags
                  clearable
                  filterable
                  placeholder="异常类型"
                >
                  <el-option
                    v-for="item in transferAbnormalOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="inboundDelay">
                <el-select
                  size="small"
                  v-model="searchForm.inboundDelay"
                  multiple
                  clearable
                  filterable
                  placeholder="是否入库延迟"
                >
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="wmsInboundNo">
                <avue-crud-input
                  v-model="searchForm.wmsInboundNo"
                  size="small"
                  placeholder="入库单号,支持多个"
                ></avue-crud-input>
              </el-form-item>
              <el-form-item prop="shippingContainerNo">
                <avue-crud-input
                  v-model="searchForm.shippingContainerNo"
                  size="small"
                  placeholder="出货柜号"
                ></avue-crud-input>
              </el-form-item>
              <el-form-item prop="createName">
                <avue-crud-input v-model="searchForm.createName" size="small" placeholder="创建人"></avue-crud-input>
              </el-form-item>
              <el-form-item prop="updateName">
                <avue-crud-input v-model="searchForm.updateName" size="small" placeholder="更新人"></avue-crud-input>
              </el-form-item>
              <el-form-item prop="createTime">
                <el-date-picker
                  v-model="searchForm.createTime"
                  type="daterange"
                  size="small"
                  start-placeholder="创建开始日期"
                  end-placeholder="创建结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="updateTime">
                <el-date-picker
                  v-model="searchForm.updateTime"
                  type="daterange"
                  size="small"
                  start-placeholder="更新开始日期"
                  end-placeholder="更新结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </template>

          <template slot-scope="{ row }" slot="operation">
            <el-button type="text" size="small" @click.native="handleFileList(row)">查看</el-button>
            <el-button type="text" size="small" @click.native="handleFileList(row)" style="margin: 0px">下载</el-button>

            <el-dropdown trigger="click">
              <el-button type="text" size="small">更多操作</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editTransfer(row)" v-if="row.transferStatus !== 'CANCEL'"
                  >编辑</el-dropdown-item
                >
                <el-dropdown-item
                  type="text"
                  size="small"
                  plain
                  @click.native="cancelTransfer(row)"
                  v-if="
                    (row.transferStatus === 'WAIT_DELIVERY' ||
                      row.transferStatus === 'TO_BE_SUBMITTED' ||
                      row.transferStatus === 'IN_TRANSIT') &&
                    row.transferStatus !== 'CANCEL'
                  "
                  >作废</el-dropdown-item
                >
                <el-dropdown-item
                  type="text"
                  size="small"
                  plain
                  @click.native="sendConfirm(row)"
                  v-if="row.transferStatus === 'WAIT_DELIVERY' && row.transferStatus !== 'CANCEL'"
                  >确认发货</el-dropdown-item
                >
                <el-dropdown-item
                  type="text"
                  size="small"
                  plain
                  @click.native="instockConfirm(row)"
                  v-if="
                    (row.transferStatus !== 'CANCEL' && row.transferStatus === 'IN_TRANSIT') ||
                    row.transferStatus === 'PART_IN'
                  "
                  divided
                  >确认入库</el-dropdown-item
                >
                <el-dropdown-item
                  type="text"
                  size="small"
                  plain
                  @click.native="costRecord(row)"
                  v-if="row.costLockStatus === 'UN_LOCK' && row.transferStatus !== 'CANCEL'"
                  >录入费用</el-dropdown-item
                >
                <!-- <el-dropdown-item type="text" size="small" plain @click.native="costAdjustRecord(row)"
                  v-if="row.costLockStatus === 'LOCK' && row.modifycostLockStatus === 'UN_LOCK' && row.transferStatus !== 'CANCEL'">录入调整费用</el-dropdown-item> -->
                <!-- <el-dropdown-item
                  type="text"
                  size="small"
                  plain
                  @click.native="uploadAccount(row)"
                  v-if="row.transferStatus !== 'CANCEL'"
                  divided
                >
                  上传对账单
                </el-dropdown-item> -->
                <el-dropdown-item
                  type="text"
                  size="small"
                  plain
                  @click.native="relatedNo(row)"
                  v-if="row.transferStatus !== 'CANCEL'"
                  >人工关联单号</el-dropdown-item
                >

                <el-dropdown-item
                  v-if="row.inboundDelay === 1"
                  type="text"
                  size="small"
                  plain
                  @click.native="addRemark(row)"
                >
                  填写入库延迟原因
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

          <!-- 操作日志 -->
          <template slot="operateLog" slot-scope="scope">
            <a @click="download(scope.row.transferAttach)">下载</a>
            <a style="margin-left: 10px" @click="showOperateLog(scope.row.transferNo)">日志</a>
            <!-- <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.transferNo)"></i> -->
          </template>

          <template slot="transferNo" slot-scope="scope">
            <copy-text hoverToShow>
              <router-link :to="'/transfer/fristMileTransfer/detail?id=' + scope.row.id + '&type=detail'">{{
                scope.row.transferNo
              }}</router-link>
            </copy-text>
          </template>
          <template slot="transferStatus" slot-scope="scope">
            <span>{{ transferStatusObj[scope.row.transferStatus] }}</span>
          </template>

          <template slot="costLockStatus" slot-scope="scope">
            <span>暂估费用： {{ scope.row.costLockStatusName }}</span>
            <br />
            <span>调整费用： {{ scope.row.modifycostLockStatusName }}</span>
          </template>

          <template slot="count" slot-scope="scope">
            <span>计划:&nbsp;&nbsp;{{ scope.row.planCount }}</span>
            <br />
            <span>发货:&nbsp;&nbsp;{{ scope.row.outCount }}</span>
            <br />
            <span>入库:&nbsp;&nbsp;{{ scope.row.inCount }}</span>
          </template>

          <template slot="cost" slot-scope="scope">
            <span v-for="(item, index) in scope.row.costDetail" :key="index">
              {{ item.logisticsCostTypeName + ":" }}
              {{ item.cost ? item.cost : "空" }}
              &nbsp;
              {{ item.costCurrency ? item.costCurrency : "" }}
              <br />
            </span>
            <!-- <span>运费：{{ scope.row.freightCost ? scope.row.freightCost : '空' }}</span>
          &nbsp;
          <span>{{ scope.row.freightCurrency ? scope.row.freightCurrency : '' }}</span>
          <br />
          <span>关税：{{ scope.row.taxCost ? scope.row.taxCost : '空' }}</span>
          &nbsp;
          <span>{{ scope.row.taxCurrency ? scope.row.taxCurrency : '' }}</span>
          <br />
          <span>清关派送费：{{ scope.row.clearanceCost ? scope.row.clearanceCost : '空' }}</span>
          &nbsp;
          <span>{{ scope.row.clearanceCurrency ? scope.row.clearanceCurrency : '' }}</span>
          <br />
          <span>其他费用：{{ scope.row.otherCost ? scope.row.otherCost : '空' }}</span>
          &nbsp;
          <span>{{ scope.row.otherCurrency ? scope.row.otherCurrency : '' }}</span> -->
          </template>

          <template slot="actualCostDetail" slot-scope="scope">
            <span v-for="(item, index) in scope.row.actualCostDetail" :key="index">
              {{ item.logisticsCostTypeName + ":" }}
              {{ item.cost ? item.cost : "空" }}
              &nbsp;
              {{ item.costCurrency ? item.costCurrency : "" }}
              <br />
            </span>
          </template>

          <template slot="countryShortName" slot-scope="scope">
            <span>转出仓：{{ scope.row.fmWarehouseName }}</span>
            <br />
            <span>起运国家：{{ scope.row.fmCountryName }}</span>
            <br />
            <span>目的仓：{{ scope.row.toWarehouseName }}</span>
            <br />
            <span>目的国家：{{ scope.row.toCountryName }}</span>
          </template>

          <template slot="container" slot-scope="scope">
            <span>装柜：{{ scope.row.freightContainerModeName }}</span>
            <br />
            <span>箱型：{{ scope.row.containerModelName }}</span>
            <br />
            <span>柜号：{{ scope.row.containerNo }}</span>
          </template>

          <template slot="abnormal" slot-scope="scope">
            <span>{{ scope.row.abnormalTypeName + "/" + scope.row.abnormalInfo }}</span>
          </template>

          <template slot="create" slot-scope="scope">
            <span>{{ scope.row.createName }}</span>
            <br />
            <span>{{ scope.row.createTime }}</span>
          </template>

          <template slot="update" slot-scope="scope">
            <span>{{ scope.row.updateName }}</span>
            <br />
            <span>{{ scope.row.updateTime }}</span>
          </template>

          <template slot="relationNo" slot-scope="scope">
            <span>调拨出库单：{{ scope.row.wmsTransferOutNo }}</span>
            <br />
            <span>调拨入库单：{{ scope.row.wmsTransferInNo }}</span>
            <br />
            <span>预约入库单：{{ scope.row.thirdPartyAsnInNo }}</span
            >&nbsp;<el-button v-if="scope.row.thirdPartyAsnInNoHand" type="primary" size="mini">人工关联单号</el-button>
            <br />
            <span>入库单：{{ scope.row.thirdPartyInNo }}</span
            >&nbsp;<el-button v-if="scope.row.thirdPartyInNoHand" type="primary" size="mini">人工关联单号</el-button>
          </template>

          <template slot="timePoint" slot-scope="scope">
            <span>装柜时间：{{ scope.row.freightContainerTime }}</span>
            <br />
            <span>预计上架时间：{{ scope.row.estimatePutTime }}</span>
            <br />
            <span>首次上架时间：{{ scope.row.firstInDate }}</span>
            <br />
            <span>完全入库时间：{{ scope.row.inDate }}</span>
            <br />
          </template>
        </avue-crud>

        <el-dialog title="提示">
          <el-row>
            <el-col>
              <span>总条数:X</span>
            </el-col>
            <el-col>
              <span>成功条数:X</span>
            </el-col>
            <el-col>
              <span>失败条数:X</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col>详情如下:</el-col>
            <el-col>
              <el-table>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="单据编号"></el-table-column>
                <el-table-column label="成功/失败"></el-table-column>
                <el-table-column label="失败原因"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-dialog>

        <el-dialog title="强制完结" :visible.sync="endingDialog" width="80%">
          <div style="color: red">
            <span>提示:</span>
            <br />
            <span>1、当转出仓的发货数量≠目的仓库的入库数量时,差异原因必填</span>
            <br />
            <span
              >2、当目的仓与海外仓实际入库仓库不一致时,系统将会自动创建目的仓为海外仓入库仓库的新调拨单,并将旧调拨单的费用转移到新调拨单！</span
            >
          </div>
          <el-table :data="endingData">
            <el-table-column label="SKU" prop="sku"></el-table-column>
            <el-table-column label="产品名称" prop="skuName"></el-table-column>
            <el-table-column label="转出仓/发货数量">
              <template slot-scope="{ row }">
                <span>转出仓:{{ row.fromWarehouseCode }}</span>
                <br />
                <span>发货数量:{{ row.outCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="海外仓入库仓库/入库数量">
              <template slot-scope="{ row }">
                <span>海外仓入库仓库:{{ row.thirdWarehouseCode }}</span>
                <br />
                <span>入库数量:{{ row.inOverseaCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="ERP目的仓/发货数量">
              <template slot-scope="{ row }">
                <span>海外仓入库仓库:{{ row.toWarehouseCode }}</span>
                <br />
                <span>入库数量:{{ row.inCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="差异原因">
              <template slot-scope="{ row }">
                <el-select
                  v-model="row.inAbnormalType"
                  size="mini"
                  clearable
                  :required="row.inAbnormalRequired"
                  :disabled="!row.inAbnormalRequired"
                >
                  <el-option
                    v-for="item in inAbnormalOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="endingConfirm">确认</el-button>
            <el-button size="small" @click="endingDialog = false">取消</el-button>
          </span>
        </el-dialog>

        <el-dialog title="锁定费用" :visible.sync="lockDialog" width="80%" center>
          <el-table :data="lockData">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="货代公司" prop="forwarderTransportName"></el-table-column>
            <el-table-column label="运费">
              <template slot-scope="{ row }">
                <span>{{ row.freightCost + row.freightCurrency }}</span>
              </template>
            </el-table-column>
            <el-table-column label="清关公司" prop="clearanceTransportName"></el-table-column>
            <el-table-column label="清关费用">
              <template slot-scope="{ row }">
                <span>{{ row.clearanceCost + row.clearanceCurrency }}</span>
              </template>
            </el-table-column>
            <el-table-column label="派送公司" prop="sendTransportName"></el-table-column>
            <el-table-column label="派送费用">
              <template slot-scope="{ row }">
                <span>{{ row.taxCost + row.taxCurrency }}</span>
              </template>
            </el-table-column>
            <el-table-column label="其他费用">
              <template slot-scope="{ row }">
                <span>{{ row.otherCost + row.otherCurrency }}</span>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="lockConfirm">锁定费用</el-button>
            <el-button size="small" @click="lockDialog = false">取消</el-button>
          </span>
        </el-dialog>

        <el-dialog title="确认发货" :visible.sync="sendDialog" width="500px" center>
          <el-table :data="transferFormData">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="调拨单号" prop="transferNo"></el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="confirmSend">确认发货</el-button>
            <el-button size="small" @click="sendDialog = false">取消</el-button>
          </span>
        </el-dialog>

        <el-dialog title="人工关联单号" :visible.sync="relatedDialog" width="500px" center>
          <div style="padding: 0 10px">
            <span style="color: red"
              >提示:ERP没有对接海外仓或海外仓建仓失败时,人工在海外仓建单后,可在下方将单号关联到调拨单!</span
            >
            <el-form :model="relatedForm" style="width: 60%px">
              <el-form-item label="预约入库单号:" style="margin-bottom: 5px">
                <el-input v-model="relatedForm.thirdPartyAsnInNo" size="small"></el-input>
              </el-form-item>
              <el-form-item label="入库单号:">
                <el-input v-model="relatedForm.thirdPartyInNo" size="small"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align: center; margin-top: 20px">
              <el-button size="small" type="primary" @click="saveRelated">保存</el-button>
              <el-button size="small" @click="relatedDialog = false">取消</el-button>
            </div>
          </div>
        </el-dialog>

        <el-dialog title="确认入库" :visible.sync="instockDialog" width="80%" center>
          <el-button type="primary" size="small" @click="refreshInstock" v-if="false">刷新海外仓入库数量</el-button>
          <span>提示：<span v-html="remark"></span></span>
          <el-table
            :data="instockData"
            :row-key="(row) => row.sku"
            :expand-row-keys="expandedRows"
            :cell-class-name="getClass"
          >
            <el-table-column type="expand">
              <template #default="props">
                <el-table :data="props.row.confirmDetails" style="width: 100%">
                  <el-table-column label="法人主体" prop="corporationName"></el-table-column>
                  <el-table-column label="平台" prop="platform"></el-table-column>
                  <el-table-column label="站点" prop="site"></el-table-column>
                  <el-table-column label="发货数量" prop="outCount"></el-table-column>
                  <el-table-column label="已入库数量" prop="actualInCount"></el-table-column>
                  <el-table-column label="本次入库数量">
                    <template slot-scope="{ row }">
                      <el-input-number
                        v-model="row.inCount"
                        size="mini"
                        :min="0"
                        :precision="0"
                        :controls="false"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="SKU" prop="sku"></el-table-column>
            <el-table-column label="产品名称" prop="productName"></el-table-column>
            <el-table-column label="目的仓/发货数量">
              <template slot-scope="{ row }">
                <span>目的仓:{{ row.fmWarehouseName }}</span>
                <br />
                <span>发货数量:{{ row.outCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="海外仓入库仓库/入库数量">
              <template slot-scope="{ row }">
                <span>海外仓入库仓库:{{ row.toWarehouseName }}</span>
                <br />
                <span>入库数量:{{ row.toWarehouseInCount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="已入库数量" prop="actualInCount"></el-table-column>
            <el-table-column label="本次入库数量">
              <template slot="header">
                <span style="color: red">*</span>
                <span>本次入库数量</span>
              </template>
              <template slot-scope="{ row }">
                <!-- @input="isEqual(row)" -->
                <el-input-number
                  v-model="row.inCount"
                  size="mini"
                  :min="0"
                  :precision="0"
                  :controls="false"
                ></el-input-number>
              </template>
            </el-table-column>
            <!-- <el-table-column label="发货数量与海外仓入库数量不一致原因">
            <template slot-scope="{row}">
              <el-select v-model="row.inAbnormalType" size="mini" clearable @change="handleAbnormal"
                :required="row.inAbnormalRequired" :disabled="!row.inAbnormalRequired">
                <el-option v-for="item in inAbnormalOptions" :key="item.value" :value="item.value"
                  :label="item.label"></el-option>
              </el-select>
            </template>
          </el-table-column> -->
          </el-table>

          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="confirmInStorage">保存</el-button>
            <el-button size="small" @click="instockDialog = false">取消</el-button>
          </span>
        </el-dialog>

        <el-dialog title="录入费用" :visible.sync="recordDialog" width="80%" center>
          <div style="display: flex; margin-bottom: 10px">
            <p>调拨单：{{ costObj.sourceNo }}</p>
            <p style="margin-left: 30px">柜号：{{ costObj.trackingNo }}</p>
          </div>
          <avue-crud
            ref="crud"
            :data="costObj.costInfo"
            :option="costListOption"
            @row-del="delRowAttr"
            class="handle-cell-hidden"
          >
            <template slot="transportCode" slot-scope="{ row }">
              <el-select
                size="mini"
                clearable
                v-model="row.transportCode"
                filterable
                placeholder="请选择"
                :disabled="!row.isOperate"
              >
                <el-option
                  v-for="item in forwarderTransportCodeOptions"
                  :key="item.transportCarrierCode"
                  :label="item.carrierShortName"
                  :value="item.transportCarrierCode"
                ></el-option>
              </el-select>
            </template>

            <template slot="costType" slot-scope="{ row }">
              <el-select
                size="mini"
                clearable
                v-model="row.costType"
                filterable
                placeholder="请选择"
                :disabled="row.costType == 'TARIFF' || row.costType == 'CONSUMPTION_TAX'"
              >
                <!-- !row.isOperate  -->
                <el-option
                  v-for="item in costList"
                  :key="item.tmsLogisticsCostTypeCode"
                  :label="item.tmsLogisticsCostTypeName"
                  :value="item.tmsLogisticsCostTypeCode"
                  :disabled="
                    item.tmsLogisticsCostTypeCode == 'CONSUMPTION_TAX' || item.tmsLogisticsCostTypeCode == 'TARIFF'
                  "
                ></el-option>
              </el-select>
            </template>
            <!-- :disabled="state === 'detail' || !isChangeFlag || transferStatus === 'IN' || transferStatus === 'PART_IN'" -->
            <template slot="cost" slot-scope="{ row }">
              <el-input
                v-model="row.cost"
                @change="validateNumber($event, row, 'cost')"
                placeholder="请输入"
                size="mini"
                :disabled="row.costType == 'TARIFF' || row.costType == 'CONSUMPTION_TAX'"
              >
                <el-select
                  v-model="row.costCurrency"
                  slot="append"
                  placeholder="币种"
                  class="el-select--append"
                  :disabled="row.costType == 'TARIFF' || row.costType == 'CONSUMPTION_TAX'"
                >
                  <el-option
                    :label="item.currency"
                    :value="item.currency"
                    v-for="item in currencyArr"
                    :key="item.currency"
                  ></el-option>
                </el-select>
              </el-input>
            </template>

            <template slot="operate" slot-scope="{ row }">
              <div
                v-if="
                  state === 'detail' ||
                  (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                "
              ></div>
              <div v-else>
                <el-button
                  type="text"
                  style="padding: 10px 0"
                  @click="addCost(row)"
                  v-if="
                    row.$index === costObj.costInfo.length - 1 &&
                    // row.$index > 1 &&
                    state !== 'detail'
                  "
                  >添加</el-button
                >
                <el-button type="text" style="padding: 10px 0; color: rgb(140, 9, 9)" @click="deleteCost(row)"
                  >删除</el-button
                >
              </div>
            </template>
          </avue-crud>
          <span slot="footer" class="dialog-footer">
            <!-- :disabled="buttonLoading" -->
            <el-button size="small" type="primary" @click="saveRecord">保存</el-button>
            <el-button size="small" @click="recordDialog = false">取消</el-button>
          </span>
        </el-dialog>

        <el-dialog title="录入调整费用" :visible.sync="adjustDialog" width="80%" center>
          <el-table :data="recordData.enterCost">
            <el-table-column label="物流商" prop="transportCarrierName"></el-table-column>
            <el-table-column label="运费" prop="freightCost">
              <template slot-scope="{ row }">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="row.shipment.cost"
                    size="mini"
                    type="number"
                    :disabled="row.shipment.costLockStatus == 'LOCK'"
                  ></el-input>
                  <el-select
                    v-model="row.shipment.costCurrency"
                    size="mini"
                    :disabled="row.shipment.costLockStatus == 'LOCK'"
                  >
                    <el-option
                      v-for="item in currencyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="清关费" prop="clearanceCost">
              <template slot-scope="{ row }">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="row.clearance.cost"
                    size="mini"
                    type="number"
                    :disabled="row.clearance.costLockStatus == 'LOCK'"
                  ></el-input>
                  <el-select
                    v-model="row.clearance.costCurrency"
                    size="mini"
                    :disabled="row.clearance.costLockStatus == 'LOCK'"
                  >
                    <el-option
                      v-for="item in currencyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="关税费">
              <template slot-scope="{ row }">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="row.triff.cost"
                    size="mini"
                    type="number"
                    :disabled="row.triff.costLockStatus == 'LOCK'"
                  ></el-input>
                  <el-select
                    v-model="row.triff.costCurrency"
                    size="mini"
                    :disabled="row.triff.costLockStatus == 'LOCK'"
                  >
                    <el-option
                      v-for="item in currencyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="其他费用" prop="otherCost">
              <template slot-scope="{ row }">
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="row.other.cost"
                    size="mini"
                    type="number"
                    :disabled="row.other.costLockStatus == 'LOCK'"
                  ></el-input>
                  <el-select
                    v-model="row.other.costCurrency"
                    size="mini"
                    :disabled="row.other.costLockStatus == 'LOCK'"
                  >
                    <el-option
                      v-for="item in currencyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="锁定状态" prop="costLockStatusName">
              <template slot-scope="{ row }">
                <span>{{ row.transferTransportCostDetailVOS[3].costLockStatusName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="费用操作类型" prop="costOperateName">
              <template slot-scope="{ row }">
                <span>{{ row.costOperateName }}</span>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="saveAdjustRecord">保存</el-button>
            <el-button size="small" @click="adjustDialog = false">取消</el-button>
          </span>
        </el-dialog>

        <el-dialog
          class="upload-dialog"
          title="导入费用"
          :visible.sync="importCostDialog"
          width="500px"
          center
          @close="importReset"
        >
          <div class="dialog-content">
            <el-upload
              class="upload-inq inline-class"
              style="margin-bottom: 5px"
              ref="importCost"
              accept=".xls, .xlsx"
              :file-list="importList"
              :auto-upload="false"
              :http-request="customImport"
              :on-change="importFileChange"
              :on-exceed="handleExceed"
            >
              <el-button type="primary" size="small" style="margin-bottom: 5px" slot="trigger">上传数据</el-button>
              <el-button type="default" style="margin-left: 10px" size="small" @click="downloadTemplate"
                >模板下载</el-button
              >
            </el-upload>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="importCostConfirm">确定</el-button>
            <el-button size="small" @click="importCostDialog = false">取消</el-button>
          </span>
        </el-dialog>

        <el-dialog
          class="upload-dialog"
          title="上传对账单"
          :visible.sync="uploadDialog"
          width="500px"
          center
          @close="importReset"
        >
          <div class="dialog-content">
            <el-upload
              class="upload-inq inline-class"
              style="margin-bottom: 5px"
              ref="upload"
              accept=".pdf,.xls, .xlsx"
              :file-list="fileList"
              action="String"
              :auto-upload="false"
              :on-change="signFileChange"
              :on-remove="handleRemove"
              multiple
            >
              <span style="margin-bottom: 100px">上传对账单:</span>
              <el-button type="primary" size="small" style="margin-bottom: 5px">上传数据</el-button>
              <div slot="tip" class="el-upload__tip">附件只能上传pdf/excel文件</div>
            </el-upload>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="saveAcount">保存</el-button>
            <el-button size="small" @click="uploadDialog = false">取消</el-button>
          </span>
        </el-dialog>

        <commonImport ref="commonImport" :downloadUrl="downloadUrl" :fileSuffix="fileSuffix" @import="importExcelBtn">
        </commonImport>

        <newCommonImport
          ref="newCommonImport"
          :downloadUrl="newDownloadUrl"
          :previewUrl="newPreviewUrl"
          :uploadUrl="newUploadUrl"
          :downloadTitle="newDownloadTitle"
          @import="importExcel"
        >
        </newCommonImport>

        <!-- 操作日志 -->
        <pooperatelog ref="pooperatelog"></pooperatelog>

        <batchUploadFile ref="batchUploadFileRef" @updateList="updateList"></batchUploadFile>
        <fileListDialog ref="fileListDialogRef"></fileListDialog>
        <remarkDialog ref="remarkDialogRef" @updateList="updateList"></remarkDialog>
      </basic-container>
    </div>
  </div>
</template>

<script>
import {
  fetchList,
  transferCancel,
  confirmShipment,
  confirmCost,
  relatedInNo,
  saveCost,
  confirmPutInStorage,
  getConfirmInfoById,
  getCostInfoById,
  getImportTemplate,
  importCostApi,
  getUnLockCostInfo,
  uploadStatement,
  uploadImgAndPdf,
  previewImgAndPdf,
  downloadImgAndPdf,
  submitTransfer,
  forceFinishShow,
  forceFinish,
  getLockCostInfoById,
  exportExcel,
  costListAll,
  getCarriersByWarehouse,
  showCostList,
  handleCost,
  getFileListApi,
  downloadAllApi
} from "@/api/logistics/transfer/fristMileTransfer"

import { tableOption, costListOption } from "@/const/crud/logistics/transfer/fristMileTransfer"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getObjByType } from "@/api/admin/dict"
import commonImport from "@/views/cockpit/commonImport"
import newCommonImport from "@/views/cockpit/newCommonImport"

import { getAll as getAllCurrency } from "@/api/baseSetup/bsecurrency"

import { mapGetters } from "vuex"
import pooperatelog from "@/views/logistics/transfer/tmstransferoperatelog/index"
import { getUrlConcatToken, getTokenUrl, downloadBlob } from "@/util/auth"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { parse } from "path"
import tip from "@/views/cockpit/tip"
import { constants } from "crypto"
import { throws } from "assert"
import batchUploadFile from "./components/batchUploadFile.vue"
import fileListDialog from "./components/fileListDialog.vue"
import remarkDialog from "./components/remarkDialog.vue"

export default {
  name: "tmstransfer",
  components: {
    pooperatelog,
    commonImport,
    tip,
    newCommonImport,
    batchUploadFile,
    fileListDialog,
    remarkDialog
  },
  data() {
    /**是否是整数 */
    // var validateNumber = (rule, value, callback) => {
    //   var reg = /^[+]{0,1}(\d+)$/;
    //   if (reg.test(value)) {
    //     callback();
    //   } else {
    //     callback(new Error("只能输入整数"));
    //   }
    // };
    /**是否非负数 */
    var validateFloat = (rule, value, callback) => {
      var reg = /^\d+(\.\d+)?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("只能输入非负数"))
      }
    }
    /**最多保留两位小数 */
    var validateFloatFourDigit = (rule, value, callback) => {
      var reg = /^\d+(\.\d{1,4})?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("最多保留四位小数"))
      }
    }
    /**最多保留两位小数 */
    var validateFloatFiveDigit = (rule, value, callback) => {
      var reg = /^\d+(\.\d{1,5})?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("最多保留五位小数"))
      }
    }
    //柜型验证
    var validateTransportCabinetType = (rule, value, callback) => {
      if (this.audit.involveCabinetFlag === 1 && !value) {
        callback(new Error(""))
      } else {
        callback()
      }
    }
    return {
      newDownloadUrl: "/warehouse/basis/downloadTemplate",
      newPreviewUrl: "/warehouse/basis/importDataPreview",
      newUploadUrl: "",
      newDownloadTitle: "",

      endingDialog: false,
      cancelVisible: false,
      sendDialog: false,
      recordDialog: false,
      adjustDialog: false,
      lockDialog: false,
      relatedDialog: false,
      uploadDialog: false,
      instockDialog: false,
      importCostDialog: false,

      buttonLoading: false,

      lockData: [],
      relatedForm: {
        transferId: null,
        thirdPartyAsnInNo: "",
        thirdPartyInNo: ""
      },
      transferId: null,
      recordData: {},
      instockData: [],

      warehouseOptions: [],
      countryOptions: [],
      transferStatusOptions: [],
      costLockStatusOptions: [],
      inAbnormalOptions: [],
      currencyOptions: [],

      //搜索条件，和前端控件绑定
      searchForm: {
        transferNo: "", //调拨单号
        fmWarehouseId: [], //转出仓
        toWarehouseId: [], //目的仓
        fmCountryCode: [], //起运国家
        toCountryCode: [], //目的国家
        costLockStatus: [], //费用状态
        containerNo: "",
        transferBusinessType: "",
        skuCode: "",
        time: [],
        startTime: "",
        endTime: "",
        warehouseOutId: "",
        corporationId: "",
        warehouseInId: "",
        transferStatus: "",
        transportModeId: "",
        transportCarrierId: "",
        shipmentid: "",
        declareCustomNoType: "",
        outStockTime: [],
        outStockTimeStart: "",
        outStockTimeEnd: "",
        taxType: "",
        transferBusinessTypeArr: [],
        cabinetNumber: "",
        wmsInboundNo: "",
        abnormalType: "",
        transferType: "HEAD",
        skuCode: "",
        spuCode: "",
        shippingContainerNo: "",
        inboundDelay: ""
      },
      expandedRows: [], //展开的行数据
      //确定的搜索条件
      searchFormConfirm: [],
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      loading: false,

      selectList: [],
      fileList: [],
      importList: [],
      costRules: {
        freightCost: [
          {
            required: true,
            message: "运费不能为空",
            type: "number",
            trigger: "blur"
          },
          {
            validator: validateFloat,
            message: "运费不能小于0",
            trigger: "blur"
          }
        ],
        clearanceCost: [
          {
            required: true,
            message: "清关费用不能为空",
            type: "number",
            trigger: "blur"
          },
          {
            validator: validateFloat,
            message: "清关费用不能小于0",
            trigger: "blur"
          }
        ],
        taxCost: [
          {
            required: true,
            message: "派送费用不能为空",
            type: "number",
            trigger: "blur"
          },
          {
            validator: validateFloat,
            message: "派送费用不能小于0",
            trigger: "blur"
          }
        ]
      },
      uploadIds: [],
      remark: "",
      transferAbnormalOptions: [],
      costObj: {
        costInfo: [],
        sourceNo: "",
        trackingNo: ""
      },
      costListOption: costListOption,
      costList: [],
      forwarderTransportCodeOptions: [],
      currencyArr: [],
      previewFileList: []
    }
  },
  created() {
    costListAll().then((res) => {
      if (res.data.code === 0) {
        this.costList = res.data.data
      }
    })
    getAllCurrency().then((res) => {
      if (res.data.code === 0) {
        this.currencyArr = res.data.data
      }
    })
  },
  activated() {
    this.refreshChange()
  },
  mounted: function () {
    this.init()
    this.getList(this.page)
  },
  computed: {
    ...mapGetters(["permissions"]),
    formatTransferNo: {
      get() {
        return this.searchForm.transferNo.replace(/\s|\n/g, ",")
      },
      set(value) {
        this.searchForm.transferNo = value
      }
    },
    transferStatusObj() {
      const result = {}
      this.transferStatusOptions.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    },
    costLockStatusObj() {
      const result = {}
      this.costLockStatusOptions.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    }
  },
  methods: {
    init() {
      //获取所有币种
      getAllCurrency().then((response) => {
        response.data.data.forEach((item) => {
          if (response.data.code === 0) {
            this.currencyOptions.push({
              value: item.currency,
              label: item.currency
            })
          }
        })
      })
      //加载所有仓库
      getAllWarehouse({
        funcState: "1",
        delFlag: "0"
      }).then((res) => {
        res.data.data.forEach((item) => {
          this.warehouseOptions.push({
            label: item.warehouseName,
            value: item.warehouseId
          })
        })
      })
      //加载所有国家
      getCountry().then((res) => {
        console.log(123, res.data.data)
        res.data.data.forEach((item) => {
          this.countryOptions.push({
            label: item.countryShortName,
            value: item.countryCode
          })
        })
      })

      //发货数量与海外仓入库数量不一致原因
      getObjByType("in_abnormal_type").then((res) => {
        this.inAbnormalOptions = res.data.data
      })
      //调拨状态
      getObjByType("transfer_status").then((res) => {
        this.transferStatusOptions = res.data.data
      })
      // 调拨业务类型
      getObjByType("transfer_business_type").then((res) => {
        if (res.data.code === 0) {
          this.transferBusinessTypeArr = res.data.data
        }
      })
      //费用状态
      getObjByType("cost_lock_status").then((res) => {
        this.costLockStatusOptions = res.data.data
        console.log(this.costLockStatusOptions)
      })
      getObjByType("transfer_abnormal_type").then((res) => {
        if (res.data.code === 0) {
          this.transferAbnormalOptions = res.data.data
        }
      })
    },

    addCost(row) {
      console.log(row)
      this.costObj.costInfo.push({
        transportCode: "",
        costType: "",
        cost: "",
        costCurrency: "USD",
        isOperate: true
      })
    },
    deleteCost(row) {
      let count = 0
      this.costObj.costInfo.forEach((item) => {
        if (item.costType === row.costType) {
          count++
        }
      })

      // 部分入库和已入库的并且已存在的不能删除
      if (["PART_IN", "IN"].includes(this.transferStatus) && row.costStatus && !row.isOperate) {
        this.$message.warning(`部分入库和已入库，已存在的不可删除！`)
        return
      }

      // 仅费用类型=运费、关税、清关费，消费税,且仅有1条时不允许删除，其他项均可删除
      if (["SHIPMENT", "CLEARANCE", "TARIFF", "CONSUMPTION_TAX"].find((item) => item === row.costType) && count <= 1) {
        this.$message.warning(`该费用类型只有唯一一条，不可删除！`)
        return
      }

      // if (count <= 1) {
      //   this.$message.warning(`该费用类型只有唯一一条，不可删除！`)
      //   return
      // }
      this.costObj.costInfo.splice(row.$index, 1)
    },
    batchModifyTime() {
      ;(this.newUploadUrl = "/warehouse/transfer/updateEstimateArrivalTime"),
        (this.newDownloadTitle = "批量修改时间导入模板"),
        this.$refs.newCommonImport.syncFn({
          downloadParams: { templateName: "批量修改时间导入模板.xlsx" },
          uploadParams: { templateName: "批量修改时间导入模板.xlsx" }
        })
    },

    // 导入成功才有的回调
    importExcel(file) {
      this.getList(this.pages, this.searchFormConfirm)
    },

    exportData() {
      this.handleSearchFilter()
      exportExcel(
        Object.assign({
          page: -1,
          pageSize: -1,
          filtering: [],
          ...this.searchFormConfirm
        })
      )
        .then((res) => {
          downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    forceEndShow() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请先选择调拨单")
        return
      }
      if (this.selectList.length > 1) {
        this.$message.warning("只能勾选一条调拨单")
        return
      }
      this.transferId = this.selectList[0].id
      forceFinishShow({ transferId: this.transferId }).then((res) => {
        console.log(res.data)
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            if (item.outCount !== item.inCount) {
              item.inAbnormalRequired = true
            } else {
              item.inAbnormalRequired = false
            }
          })
          this.endingData = res.data.data
          this.endingDialog = true
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    endingConfirm() {
      let endFlag = false
      this.endingData.forEach((item) => {
        console.log(item.inAbnormalRequired)
        if (item.inAbnormalRequired) {
          if (item.inAbnormalType) {
            endFlag = true
          } else {
            this.$message.error("当转出仓库发货数量≠目的仓额入库数量时,差异原因必填！")
            endFlag = false
          }
        }
      })
      console.log(endFlag)
      if (endFlag) {
        forceFinish({
          transferId: this.transferId,
          dataList: this.endingData
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("操作成功"), (this.endingDialog = false)
            this.refreshChange()
          } else {
            this.$message.error(res.data.msg)
            this.endingDialog = false
          }
        })
      }
    },

    //保存上传对账单
    saveAcount() {
      let params = {
        transferId: this.transferId,
        fileIds: this.uploadIds
      }
      uploadStatement(params).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          this.$message.success("操作成功")
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    transferSubmit() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请先选择提交的调拨单!")
        return
      }
      let transferId = this.selectList.map((item) => item.id)
      submitTransfer({ transferId })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.refreshChange()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    isEqual(row) {
      row.inAbnormalRequired = row.outCount != row.inCount
    },
    // isEqual (row) {
    //   row.inAbnormalRequired = row.inCount != row.outCount
    //   console.log(row.inAbnormalRequired)
    //   this.expandedRows.push(row.sku)
    //   if (!row.inAbnormalRequired) {
    //     row.inAbnormalType = ""
    //     row.confirmDetails.forEach(item => {
    //       this.$set(item, 'inCount', item.outCount)
    //     })
    //   }
    //   else {
    //     let count = 0
    //     let stayCount = row.inCount
    //     row.confirmDetails.forEach(item => {
    //       if (count < row.inCount && stayCount > item.outCount) {
    //         this.$set(item, 'inCount', item.outCount)
    //         count += item.outCount
    //         stayCount -= item.outCount
    //       } else {
    //         this.$set(item, 'inCount', stayCount)
    //       }
    //     })
    //   }
    // },

    signFileChange(file, fileList) {
      console.log(123)
      if (file.size / 1024 / 1024 > 5) {
        this.$message.warning("不允许上传大于5M文件")
        return
      }
      const fileType = [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ]
      const status = fileType.some((item) => item === file.raw.type)
      if (!status) {
        this.$message.warning("请选择excel或者PDF文件")
        return
      }
      this.fileList = fileList
      let formdata = new FormData()
      formdata.append("applicationName", "")
      formdata.append("file", file.raw)

      uploadImgAndPdf(formdata)
        .then((res) => {
          console.log(321)
          if (res.data.code == 0) {
            this.$message.success("上传成功")
            this.uploadIds.push(res.data.data.id)
          } else if (res.data.code == 1) {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message.error("上传失败")
          return
        })
    },

    costLock() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请先选择要锁定费用的调拨单!")
        return
      }
      let transferId = this.selectList.map((obj) => obj.id)
      getUnLockCostInfo(transferId).then((res) => {
        console.log(res.data.data)
        if (res.data.code === 0) {
          this.lockData = res.data.data
          this.lockDialog = true
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    async lockConfirm() {
      let transferIds = this.selectList.map((obj) => obj.id)
      let transferCostIds = this.lockData.map((obj) => obj.transferCostId)
      let res = await confirmCost({ transferCostIds, transferIds })
      if (res.data.code === 0) {
        this.$message.success("操作成功")
        this.lockDialog = false
        this.refreshChange()
      } else {
        this.$message.error(res.data.msg)
      }
    },

    editTransfer(row) {
      console.log("row", row)
      this.$router.push({
        path: "/transfer/fristMileTransfer/edit",
        query: { id: row.id, type: "edit" }
      })
    },

    cancelTransfer(row) {
      this.$confirm("作废调拨单之后不可恢复,您确定作废调拨单" + row.transferNo + "吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await transferCancel({ transferId: row.id })
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: "操作成功"
            })
            this.refreshChange()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          })
        })
    },

    sendConfirm(row) {
      console.log(row)
      this.transferFormData = [row]
      this.sendDialog = true
      console.log("确认发货")
    },
    sendMutiConfirm() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请先选择要发货的调拨单!")
        return
      }
      this.transferFormData = this.selectList
      this.sendDialog = true
      console.log("确认发货")
    },
    async confirmSend() {
      console.log(this.transferFormData)
      let transferId = null
      this.transferFormData.forEach((item) => {
        transferId = item.id
      })
      console.log(transferId)
      let res = await confirmShipment({ transferId })
      if (res.data.code === 0) {
        this.$message.success("操作成功")
        this.sendDialog = false
        this.refreshChange()
      } else {
        this.$message.error(res.data.msg)
        this.sendDialog = false
      }
    },
    costImport() {
      this.importCostDialog = true
      // this.$refs.commonImport.syncFn()
      console.log("导入费用")
    },
    downloadTemplate() {
      getImportTemplate({})
        .then((res) => {
          downloadBlob(res.data, "导入费用模板.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleRemove(file, fileList) {
      console.log(123, file, fileList)
    },
    beforeRemove(file, fileList) {
      console.log(123, file, fileList)
    },
    importFileChange(file, fileList) {
      // 只保留最后选择的文件，替换列表中的文件为最新选择的文件
      if (fileList.length > 1) {
        fileList.shift()
      }
      this.importList = fileList
    },
    handleExceed(files, fileList) {
      console.log(123, fileList)
      console.log(102, files)
      fileList.splice(0, 1, files[files.length - 1])
      this.importList = [...fileList]
      console.log(this.importList)
    },
    customImport() {
      console.log(this.importList)
      const formData = new FormData()
      console.log("formdata1", formData)
      formData.append("file", this.importList[0].raw)
      console.log("file", this.importList[0].raw)
      console.log("formdata", formData)
      importCostApi(formData)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            // this.importList.push({ name: file.file.name, url: res.data.url })
            this.$refs.importCost.clearFiles()
            this.importCostDialog = false
            this.refreshChange()
          } else if (res.data.code === 700) {
            this.$message({
              message: res.data.msg.replace(/\n/g, "<br>"),
              dangerouslyUseHTMLString: true,
              type: "error"
            })
            console.log(123)
            this.$refs.importCost.clearFiles()
            this.importCostDialog = false
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    importCostConfirm() {
      // formData.append('file', this.fileList)
      // this.$refs.importCost.submit()
      this.$refs.importCost.submit()
    },
    async instockConfirm(row) {
      let res = await getConfirmInfoById({ transferId: row.id })
      // .then(res => {
      //   this.transferId = row.id
      //   this.transferNo = row.transferNo
      //   res.data.data.transferDetails.forEach(items => {
      //     if (items.fmWarehouseName !== items.toWarehouseName) {
      //       this.$message.error('目的仓与海外仓入库仓库不一致，请操作【编辑订单】修改目的仓！')
      //     }
      //     if (items.outCount === items.toWarehouseInCount) {
      //       items.confirmDetails.forEach(item => {
      //         item.inCount = item.outCount
      //       })
      //     }
      //   })
      //   this.instockData = res.data.data.transferDetails
      //   this.remark = res.data.data.remark.replace(/\n/g, '<br>')
      // })
      if (res.data.code === 0) {
        this.transferId = row.id
        this.transferNo = row.transferNo
        res.data.data.transferDetails.forEach((items) => {
          if (items.outCount === items.toWarehouseInCount) {
            items.confirmDetails.forEach((item) => {
              item.inCount = item.outCount
            })
          }
        })
        this.instockData = res.data.data.transferDetails
        this.remark = res.data.data.remark ? res.data.data.remark.replace(/\n/g, "<br>") : ""
      }
      console.log("确认入库")
      this.instockDialog = true
    },
    confirmInStorage() {
      let isValid = this.validateInStorage()
      console.log(isValid)
      if (isValid) {
        this.buttonLoading = true
        this.instockData.forEach((item) => {
          item.confirmDetails.forEach((i) => {
            i.sku = item.sku
            i.skuId = item.skuId
          })
        })
        console.log(this.instockData, 123)

        let transferDetails = this.instockData.filter((item) => item.inCount != 0)
        confirmPutInStorage({
          transferId: this.transferId,
          transferNo: this.transferNo,
          transferDetails
        }).then((res) => {
          this.buttonLoading = false
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.instockDialog = false
            this.refreshChange()
          } else {
            this.$message.error(res.data.msg)
            this.buttonLoading = false
          }
        })
      }
    },
    validateInStorage() {
      for (const rows of this.instockData) {
        if (rows.inCount * 1 + rows.actualInCount * 1 > rows.toWarehouseInCount) {
          this.$message.error("累计入库数量不能超过海外仓入库数量")
          return false
        } else {
          let totalCount = 0
          let totalInCount = 0
          for (const row of rows.confirmDetails) {
            if (row.inCount * 1 + row.actualInCount * 1 > row.outCount) {
              console.log(row.inCount * 1, row.actualInCount * 1, row.outCount)
              console.log(3)
              this.$message.error("累计入库数量不能超过发货数量")
              return false
            }
            totalCount += row.inCount * 1 + row.actualInCount * 1
            totalInCount += row.inCount * 1
          }
          if (totalCount > rows.toWarehouseInCount) {
            console.log(totalCount)
            this.$message.error("累计入库数量不能超过海外仓入库数量")
            return false
          }
          if (totalInCount !== rows.inCount * 1) {
            this.$message.error("明细本次入库数量必须与总本次入库数量相等")
            return false
          }
        }
      }
      return true
    },

    geFail(row) {
      const paramsArr = [
        {
          transportCode: row.forwarderTransportCode,
          costType: "SHIPMENT",
          cost: "",
          costCurrency: "USD",
          isOperate: true
        },
        {
          transportCode: row.sendTransportCode,
          costType: "CLEARANCE",
          cost: "",
          costCurrency: "USD",
          isOperate: true
        },
        {
          transportCode: row.clearanceTransportCode,
          costType: "TARIFF",
          cost: "",
          costCurrency: "USD",
          isOperate: true
        },
        {
          transportCode: row.clearanceTransportCode,
          costType: "CONSUMPTION_TAX",
          cost: "",
          costCurrency: "USD",
          isOperate: true
        }
      ]

      for (let i = 0; i < paramsArr.length; i++) {
        if (!paramsArr[i].transportCode) return
      }

      this.costObj.costInfo = paramsArr
    },

    costRecord(row) {
      getCarriersByWarehouse({
        warehouseIds: [row.fmWarehouseId],
        transportType: "FORWARDER"
      }).then((res) => {
        this.forwarderTransportCodeOptions = res.data.data[0].dataList
      })
      showCostList({ sourceNo: row.transferNo }).then((res) => {
        if (res.data.code === 0) {
          this.costObj = res.data.data
          if (this.costObj.costInfo.length === 0) {
            this.geFail(row)
          }
        }
      })
      this.transferStatus = row.transferStatus
      this.recordDialog = true
    },

    async saveRecord() {
      let target = {}

      for (let i = 0; i < this.costObj.costInfo.length; i++) {
        let data = this.costObj.costInfo[i]
        if (!data.transportCode || !data.costType || (!data.cost && data.cost != 0) || !data.costCurrency) {
          this.$message.warning(`请完善序号【${i + 1}】的费用数据`)
          return
        }
        if (target[`${data.transportCode}+${data.costType}`]) {
          this.$message.warning("存在相同的物流商和费用类型")
          return
        } else {
          target[`${data.transportCode}+${data.costType}`] = true
        }
      }

      const isOperateCostObj = this.costObj.costInfo.filter((item) => item.isOperate)
      console.log("isOperateCostObj", isOperateCostObj)
      console.log("this.costObj.costInfo", this.costObj.costInfo)

      // this.buttonLoading = true;
      let res = await handleCost({
        ...this.costObj,
        costInfo: isOperateCostObj
      })
      // this.buttonLoading = false;
      if (res.data.code === 0) {
        this.$message.success("操作完成")
        this.recordDialog = false
        this.refreshChange()
      } else {
        this.$message.error(res.data.msg)
        // this.buttonLoading = false;
        this.recordDialog = false
        this.refreshChange()
      }
      // console.log(res.data.data)
    },

    costAdjustRecord(row) {
      getLockCostInfoById([row.id]).then((res) => {
        res.data.data.transferCostDetailVOS.forEach((item) => {
          item.transferTransportCostDetailVOS.forEach((itemCost) => {
            if (itemCost.logisticsCostTypeEnum == "CLEARANCE") {
              item.clearance = itemCost
            }
            if (itemCost.logisticsCostTypeEnum == "FINAL_SHIPPING") {
              item.finalShipping = itemCost
            }
            if (itemCost.logisticsCostTypeEnum == "OTHER") {
              item.other = itemCost
            }
            if (itemCost.logisticsCostTypeEnum == "SHIPMENT") {
              item.shipment = itemCost
            }
            if (itemCost.logisticsCostTypeEnum == "TARIFF") {
              item.triff = itemCost
            }
          })
        })
        this.recordData = {
          enterCost: res.data.data[0].transferCostDetailVOS,
          transferId: res.data.data[0].transferId,
          saveModel: "MODIFYCOST"
        }
      })
      this.adjustDialog = true
      console.log("录入调整费用")
    },

    async saveAdjustRecord() {
      // let costData = this.recordData[this.recordData.length - 1]
      let enterCost = this.recordData.enterCost.filter((item) => item.costOperateType === "MODIFYCOST")
      enterCost.forEach((item) => {
        item.transferTransportCostDetailVOS = [item.clearance, item.other, item.shipment, item.triff]
      })
      console.log(enterCost)
      let obj = {
        enterCost: enterCost.flatMap(({ transferTransportCostDetailVOS, ...rest }) =>
          transferTransportCostDetailVOS.map((detail) => ({
            ...rest,
            ...detail
          }))
        ),
        saveModel: this.recordData.saveModel,
        transferId: this.recordData.transferId
      }
      console.log(obj)
      let res = await saveCost(obj)
      if (res.data.code === 0) {
        this.$message.success("操作完成")
        this.adjustDialog = false
        this.recordData = {}
        this.refreshChange()
      } else {
        this.$message.error(res.data.msg)
        this.adjustDialog = false
        this.recordData = {}
        this.refreshChange()
      }
      console.log(res.data.data)
    },
    validateTableData() {
      // 遍历表格数据，执行校验逻辑
      for (const row of this.recordData) {
        if (row.freightCost == null || row.clearanceCost == null || row.taxCost == null) {
          // 行校验失败，您可以在这里处理错误消息
          console.log(row.freightCost == null)
          this.$message.error("校验失败,请检查费用是否未填写")
          return false // 一旦有一行数据不通过校验，返回 false
        } else if (row.freightCost < 0 || row.clearanceCost < 0 || row.taxCost < 0) {
          this.$message.error("校验失败,费用不能小于0")
          return false
        }
        if (row.freightCost > 0) {
          if (!row.freightCurrency) {
            this.$message.error("运费不为0时,币种不能为空")
            return false
          }
        }
        if (row.clearanceCost > 0) {
          if (!row.clearanceCurrency) {
            this.$message.error("清关费用不为0时,币种不能为空")
            return false
          }
        }
        if (row.taxCost > 0) {
          if (!row.taxCurrency) {
            this.$message.error("派送费用不为0时,币种不能为空")
            return false
          }
        }
        if (row.otherCost > 0) {
          if (!row.otherCurrency) {
            this.$message.error("其他费用不为0时,币种不能为空")
            return false
          }
        }
        // 其他校验逻辑
      }
      return true // 所有行数据通过校验
    },
    validateAdjustData() {
      // 遍历表格数据，执行校验逻辑
      for (const row of this.recordData) {
        if (row.freightCost === null || row.clearanceCost === null || row.taxCost === null) {
          console.log(row.freightCost)
          // 行校验失败，您可以在这里处理错误消息
          this.$message.error("校验失败,请检查费用是否未填写")
          return false // 一旦有一行数据不通过校验，返回 false
        }
        if (row.freightCost != 0) {
          if (!row.freightCurrency) {
            this.$message.error("运费不为0时,币种不能为空")
            return false
          }
        }
        if (row.clearanceCost != 0) {
          if (!row.clearanceCurrency) {
            this.$message.error("清关费用不为0时,币种不能为空")
            return false
          }
        }
        if (row.taxCost != 0) {
          if (!row.taxCurrency) {
            this.$message.error("关税不为0时,币种不能为空")
            return false
          }
        }
        if (row.otherCost != 0) {
          if (!row.otherCurrency) {
            this.$message.error("关税不为0时,币种不能为空")
            return false
          }
        }
        // 其他校验逻辑
      }
      return true // 所有行数据通过校验
    },

    uploadAccount(row) {
      console.log(row.id)
      this.transferId = row.id
      this.fileList = [{ name: "对账单.xlsx", id: 15439 }]
      this.uploadDialog = true
      console.log("上传对账单")
    },

    relatedNo(row) {
      this.relatedForm.transferId = row.id
      this.relatedForm.thirdPartyAsnInNo = row.thirdPartyAsnInNo
      this.relatedForm.thirdPartyInNo = row.thirdPartyInNo
      this.relatedDialog = true
      console.log("人工关联单据")
    },
    async saveRelated() {
      let res = await relatedInNo(this.relatedForm)
      if (res.data.code === 0) {
        this.$message.success("操作成功")
        this.relatedDialog = false
        this.refreshChange()
      } else {
        this.$message.error(res.data.msg)
      }
      console.log(res.data.data)
    },

    //下载附件
    download(url) {
      if (!url) {
        this.$message.warning("未上传调拨附件")
        return
      }
      window.location = getTokenUrl(url)
    },
    //重置表格验证
    formReset(formName) {
      this.$refs[formName].resetFields()
    },
    getList(page, params) {
      this.tableLoading = true
      // this.page.currentPage=page.currentPage;
      // this.tableData = [{ id: 1 }]
      // this.tableData = [{ transferNo: "123456789", id: 1 }]
      this.handleSearchFilter()
      fetchList(
        Object.assign(
          {
            page: page.currentPage,
            pageSize: page.pageSize,
            filtering: [],
            ...this.searchFormConfirm
          },
          params
        )
      ).then((response) => {
        console.log(111, response.data.data)
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        // const countMap = response.data.data.countMap
        // for (let index = 0; index < 7; index++) {
        //   const element = this.tabPosition[index]
        //   element.count = 0
        //   for (
        //     let index = 0;
        //     index < element.transferStatusArr.length;
        //     index++
        //   ) {
        //     if (countMap[element.transferStatusArr[index]]) {
        //       element.count =
        //         element.count + countMap[element.transferStatusArr[index]]
        //     }
        //   }
        // }
        this.tableLoading = false
      })
    },
    //处理搜索条件
    transformSearchForm(searchForm) {
      let result = []
      for (let key in searchForm) {
        let value = searchForm[key]
        if (typeof value === "string") {
          value = value.split(",")
        }
        // 出货柜号不进行处理
        if (key !== "shippingContainerNo") {
          result.push({
            field: key,
            value: value
          })
        }
      }
      return result
    },
    //刷新回调
    refreshChange() {
      this.getList(this.page)
    },
    //搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      // page=page||{currentPage:1}
      this.handleSearchFilter()
      this.getList(this.page, params)
    },
    //搜索条件处理
    handleSearchFilter() {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.searchFormConfirm.filtering = this.transformSearchForm(this.searchFormConfirm)
      console.log("搜索条件", this.searchFormConfirm)
    },
    //重置搜索条件
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
      this.searchForm = {
        transferType: "HEAD"
      }
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      // this.handleSearchFilter();
      this.getList(this.page, this.searchFormConfirm)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      // this.handleSearchFilter();
      this.getList(this.page, this.searchFormConfirm)
    },
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    //清除选中
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    //跳转到详情页面
    openNewPage: function () {
      this.$router.push({ path: "/transfer/fristMileTransfer/add?type=add" })
    },
    //查看操作日志
    showOperateLog: function (transferNo) {
      this.$refs.pooperatelog.showOperateLogDialog(transferNo, 1)
    },
    getClass({ row }) {
      if (row.toWarehouseInCount != row.outCount) {
        return "mainRow"
      }
      if (row) {
        return "mainRow"
      }
    },
    getCellClass({ row }) {
      if (row.abnormalType != "NOT_ABNORMAL" || row.inboundDelay === 1) {
        return "warningRow"
      }
    },
    validateNumber(val, row, key) {
      if (!val) return
      row[key] = val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0")
      row[key] = row[key] === "" ? "" : parseFloat(row[key]).toFixed(2)
    },
    handleUploadAttachment() {
      this.$refs.batchUploadFileRef.openDialog()
    },
    // 查看 下载附件
    handleFileList(row) {
      let erpBizNo = ""
      if (!row) {
        if (this.selectList?.length <= 0) {
          this.$message.warning("请先勾选调拨单")
          return
        }
        erpBizNo = this.selectList.map((item) => item.transferNo).join(",")
      } else {
        erpBizNo = row.transferNo
      }
      this.$refs.fileListDialogRef.openDialog(erpBizNo)
    },

    updateList() {
      this.getList(this.page)
    },
    addRemark(row) {
      this.$refs.remarkDialogRef.openDialog(row)
    }
  }
}
</script>
<style lang="scss">
#transfer {
  .dialog-content {
    display: flex;
    /* flex-direction: column; */
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .el-select--append {
    width: 80px;
  }

  .errorRow {
    background: rgba(240, 64, 64, 0.1);
  }

  .warningRow {
    background: rgba(244, 201, 51, 0.1);
  }

  .mainRow {
    font-size: 13px;
    font-weight: bold;
    background: rgba(244, 201, 51, 0.1);
  }
}
</style>
