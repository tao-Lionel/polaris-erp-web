<template>
  <div id="invoiceManage">
    <p></p>
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
        :summaryMethod="getSummaries"
      >
        <template slot="menuLeft">
          <el-tabs v-model="tabParam" @tab-click="changeMenu">
            <el-tab-pane
              v-for="item in orderAllStatus"
              :key="item.key"
              :label="item.statusName"
              :name="item.key"
            ></el-tab-pane>
          </el-tabs>
        </template>

        <template slot="menuLeft">
          <div style="margin-bottom: 10px" class="search-btn-box">
            <el-button type="primary" size="small" @click="examine" v-if="permissions.oms_foorder_manage_distribute"
              >下发至第三方仓</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="setLabel('')"
              :disabled="!selectRows.length"
              v-if="permissions.oms_order_manage_modify_label"
              >修改标签</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="setWarehouse"
              v-if="permissions.oms_foorder_manage_set_logistics"
              >设置物流渠道</el-button
            >
            <el-button type="primary" size="small" @click="invoiceCancel" v-if="permissions.oms_foorder_manage_reverse"
              >反审核至订单</el-button
            >
            <el-button type="primary" size="small" @click="toSend" v-if="permissions.oms_foorder_manage_lable_deliver"
              >标记已发货</el-button
            >
            <el-button type="primary" size="small" @click="signFor" v-if="permissions.oms_foorder_manage_lable_sign"
              >标记已签收</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="cancelAbnormal"
              :disabled="!selectRows.length"
              v-if="permissions.oms_fo_order_clear_abnormal"
              >取消异常标识</el-button
            >
            <el-button
              v-if="permissions.oms_foorder_batch_import_tracking_number"
              type="primary"
              size="small"
              @click="handleBatchImportTrackingNumber"
            >
              批量导入跟踪号
            </el-button>
            <el-button type="primary" size="small" @click="exportInvoice" v-if="permissions.oms_foorder_manage_export">
              导出
            </el-button>
            <el-button
              v-if="permissions.oms_foorder_manage_cancel_shipment"
              type="primary"
              size="small"
              @click="handleCancelShipment"
            >
              撤销发货
            </el-button>
            <el-button
              v-if="permissions.oms_fo_order_modify_order_price"
              @click="handleImportModifyUnitPrice(1)"
              type="primary"
              size="small"
            >
              导入修改单价
            </el-button>
            <el-button
              v-if="permissions.oms_fo_order_modify_order_price_v2"
              @click="handleImportModifyUnitPrice(2)"
              type="primary"
              size="small"
            >
              导入修改单价(2万条)
            </el-button>
            <el-dropdown trigger="hover">
              <el-button type="primary" size="small">上传附件</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in antiDumpingBill"
                  :key="item.value"
                  @click.native="downloadInvoiceTemplate(item)"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="orderCode">
              <el-input
                size="small"
                v-model="searchForm.orderCode"
                placeholder="发货单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="soOrderCode">
              <el-input
                size="small"
                v-model="searchForm.soOrderCode"
                placeholder="订单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="sourceCode">
              <el-input
                size="small"
                v-model="searchForm.sourceCode"
                placeholder="平台订单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="platformOrderCode">
              <el-input
                size="small"
                v-model="searchForm.platformOrderCode"
                placeholder="平台订单编码,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="extendCode">
              <el-input
                size="small"
                v-model="searchForm.extendCode"
                placeholder="ARN/排柜号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="wmsCode">
              <el-input
                size="small"
                v-model="searchForm.wmsCode"
                placeholder="三方出库单单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="trackingNo">
              <el-input
                size="small"
                v-model="searchForm.trackingNo"
                placeholder="跟踪号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="platform">
              <el-select
                v-model="searchForm.platform"
                filterable
                size="small"
                placeholder="平台"
                @change="changePlatform"
                clearable
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in platform"
                  :key="item.platformTypeCode"
                  :label="item.platformTypeName"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="site">
              <select-all
                ref="selectAllRef"
                :selectValue.sync="searchForm.site"
                size="small"
                placeholder="站点,支持多个"
                @change="changeSit"
                :options="marketOption"
                keyName="sitName"
                labelName="sitName"
              >
              </select-all>
            </el-form-item>

            <el-form-item prop="shopId">
              <el-select
                v-model="searchForm.shopId"
                filterable
                size="small"
                placeholder="店铺,支持多个"
                clearable
                multiple
              >
                <el-option
                  v-for="item in storeOptions"
                  :key="item.storeId"
                  :label="item.storeAccount"
                  :value="item.storeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="deliveryStatus">
              <el-select
                v-model="searchForm.deliveryStatus"
                filterable
                size="small"
                placeholder="发货状态,支持多个"
                clearable
                multiple
                :disabled="isUsed"
                @change="handleCheckStatus"
              >
                <el-option v-for="item in deliveryStatus" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="deliveryStatusIsUsed">
              <el-select
                v-model="searchForm.deliveryStatusIsUsed"
                filterable
                size="small"
                placeholder="是否有效"
                clearable
                @change="handleStatus"
                :disabled="cancelStatus"
              >
                <el-option
                  v-for="item in isUsedArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="orderBusinessType">
              <el-select
                v-model="searchForm.orderBusinessType"
                filterable
                size="small"
                placeholder="交货模式"
                clearable
                multiple
              >
                <el-option v-for="item in orderModel" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="orderType">
              <el-select
                v-model="searchForm.orderType"
                filterable
                size="small"
                multiple
                placeholder="订单类型"
                clearable
              >
                <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="warehouseId">
              <el-select
                v-model="searchForm.warehouseId"
                filterable
                size="small"
                placeholder="发货仓库,支持多个"
                clearable
                multiple
              >
                <el-option v-for="item in warehouse" :key="item.label" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" ref="searchAdvancedFormRef" :inline="true">
            <el-form-item prop="logisticsChannel">
              <el-select
                v-model="searchForm.logisticsChannel"
                filterable
                size="small"
                placeholder="物流渠道"
                clearable
                multiple
              >
                <el-option v-for="item in channelOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="abnormalType">
              <el-select
                v-model="searchForm.abnormalType"
                filterable
                multiple
                size="small"
                placeholder="异常类型"
                clearable
              >
                <el-option v-for="item in abnormalType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="deliveryMethod">
              <el-select
                v-model="searchForm.deliveryMethod"
                filterable
                multiple
                size="small"
                placeholder="发货方式"
                clearable
              >
                <el-option
                  v-for="item in deliveryMethodOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="labelIdList" class="exclude-label">
              <el-select
                ref="labelSelect"
                v-model="searchForm.labelIdList"
                @visible-change="handleExpend"
                size="small"
                placeholder="全部标签"
                clearable
                multiple
                filterable
                @clear="handleClear"
              >
                <el-option v-for="item in labels" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <avue-crud-search-item
              ref="searchCrudItemRef"
              :searchFields="searchFields"
              @updateField="updateField"
            ></avue-crud-search-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="opeSolt">
          <a style="margin-right: 10px" @click="showFacesheet(scope.row)">查看面单</a>
          <a @click="uploadFacesheet(scope.row)">上传面单</a>
        </template>

        <template slot="skuName" slot-scope="scope">
          <span> {{ scope.row.spliceProducts[0].name }} </span>
        </template>
        <template slot="orderCode" slot-scope="scope">
          <copy-text hoverToShow>
            <a @click="goOrderDetail(scope.row)">{{ scope.row.orderCode }}</a>
          </copy-text>
        </template>
        <template slot="soOrderCode" slot-scope="scope">
          <copy-text hoverToShow>
            <span> {{ scope.row.soOrderCode }} </span>
          </copy-text>
          <el-tag v-if="scope.row.deliveryName" type="primary" size="mini" style="margin-right: 5px">{{
            scope.row.deliveryName
          }}</el-tag>
          <el-tag v-if="scope.row.orderBusinessType" type="primary" size="mini" style="margin-right: 5px">{{
            scope.row.orderBusinessType
          }}</el-tag>
          <el-tag type="danger" size="mini" v-if="scope.row.freezeStatus === 'FROZEN'">冻结</el-tag>
        </template>

        <template slot="spliceProducts" slot-scope="scope">
          <div v-for="(item, index) in scope.row.spliceProducts" :key="index">
            <span>{{ item.sku ? item.sku : "暂无SKU" }}</span>
            <span style="color: #1380e6">*{{ item.quantity }}</span>
            &nbsp;
            <span>{{ item.name }}</span>
          </div>
          <div style="text-align: center; font-size: 12px" v-if="scope.row.isMoreProducts">
            <router-link
              style="width: auto; margin-right: 10px"
              :to="{
                path: '/order/orderManages/detail',
                query: { id: scope.row.id }
              }"
              >......</router-link
            >
          </div>
        </template>
        <template slot="interfaceSendFlag" slot-scope="scope">
          <span>{{ interfaceSendStatusObj[scope.row.interfaceSendFlag] }}</span>
          <el-popover
            placement="top-start"
            title="失败原因"
            width="200"
            trigger="hover"
            :content="scope.row.interfaceErrorDescription"
          >
            <div slot="reference">
              <span v-if="scope.row.interfaceErrorDescription && scope.row.interfaceSendFlag === 'F'">{{
                "/" + scope.row.spliceError
              }}</span>
            </div>
          </el-popover>
        </template>
        <template slot="deliveryStatus" slot-scope="scope">
          <span>{{ deliveryStatusObj[scope.row.deliveryStatus] }}</span>
        </template>
        <template slot="abnormalType" slot-scope="scope">{{ abnormalTypeObj[scope.row.abnormalType] }}</template>
        <template slot="createUserName" slot-scope="scope">
          <span>{{ scope.row.createUserName }}</span>
          <br />
          <span>{{ scope.row.createTime }}</span>
        </template>
        <template slot="updateUserName" slot-scope="scope">
          <span>{{ scope.row.updateUserName }}</span>
          <br />
          <span>{{ scope.row.updateTime }}</span>
        </template>
        <template slot="platform" slot-scope="scope">
          <span>{{ scope.row.platform + " / " + scope.row.market }}</span>
        </template>
        <template slot="trackingNo" slot-scope="scope">
          <copy-text hoverToShow>
            <a @click="handleTrackingNo(scope.row)">{{ scope.row.trackingNo }}</a>
          </copy-text>
        </template>

        <template slot="wmsStatus" slot-scope="scope">
          <span>{{ scope.row.wmsStatus }}</span>
          <br v-if="scope.row.wmsStatus" />
          <span>{{ scope.row.shippingTime }}</span>
        </template>
        <template slot="labels" slot-scope="scope">
          <div v-if="scope.row.labels && scope.row.labels.length <= 3">
            <el-tag
              style="margin: 0 10px 5px 0"
              :type="item.labelColor"
              v-for="item in scope.row.labels"
              :key="item.id"
              >{{ item.name }}</el-tag
            >
          </div>
          <div v-else-if="scope.row.labels && scope.row.labels.length > 3">
            <el-popover placement="right" width="200" trigger="hover">
              <el-tag
                style="margin: 0 10px 5px 0"
                :type="item.labelColor"
                v-for="item in scope.row.labels"
                :key="item.id"
                >{{ item.name }}</el-tag
              >
              <div slot="reference">
                <el-tag
                  style="margin: 0 10px 5px 0"
                  :type="item.labelColor"
                  v-for="item in scope.row.labels.slice(0, 3)"
                  :key="item.id"
                  >{{ item.name }}</el-tag
                >
              </div>
            </el-popover>
          </div>
        </template>
      </avue-crud>
      <!-- 查看面单 -->
      <el-dialog
        title="面单"
        :visible.sync="faceSheetStatus"
        width="35%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div>
          <avue-crud :data="faceSheetData" :option="faceSheetOption">
            <template slot="faceSheetUrl" slot-scope="scope">
              <el-popover placement="right" width="500" trigger="click">
                <img :src="scope.row.faceSheetUrl" width="500px" alt="" />
                <el-button type="text" slot="reference">面单</el-button>
              </el-popover>
            </template>
          </avue-crud>
        </div>
      </el-dialog>

      <!-- 上传面单 -->
      <el-dialog
        title="上传面单"
        :visible.sync="uploadFacesheetStatus"
        width="35%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form :model="uploadForm" ref="uploadForm">
          <el-form-item
            prop="trackingNo"
            label="跟踪号"
            :rules="{ required: true, message: '跟踪号不能为空', trigger: 'blur' }"
          >
            <el-input size="small" v-model="uploadForm.trackingNo"></el-input>
          </el-form-item>
          <el-form-item
            label="上传面单"
            prop="faceSheet"
            :rules="{ required: true, message: '必须上传面单', trigger: 'blur' }"
          >
            <el-upload
              class="upload-inq inline-class"
              style="margin-bottom: 5px"
              ref="upload"
              accept=".pdf,.png"
              :file-list="fileList"
              action="String"
              :auto-upload="false"
              :on-change="signFileChange"
              :on-remove="handleRemove"
              multiple
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">支持以下格式：pdf、png，支持上传多个附件</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <!-- <el-table :data="uploadForm">
          <el-table-column prop="trackingNo" label="跟踪号">
            <template slot="header">
              <span style="color:red;">*</span>
              <span> 跟踪号 </span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.trackingNo" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="faceSheet">
            <template slot="header">
              <span style="color:red;">*</span>
              <span> 上传面单 </span>
            </template>
            <template>
              <a @click="uploadShow(scope.row)">上传面单</a>
              <el-upload class="upload-inq inline-class" style="margin-bottom: 5px;" ref="upload" accept=".pdf,.png"
                :file-list="fileList" action="String" :show-file-list="false" :auto-upload="false"
                :on-change="signFileChange" :on-remove="handleRemove" multiple>
                <a size="small" type="primary">点击上传</a>
                <div slot="tip" class="el-upload__tip">支持以下格式：pdf、png，支持上传多个附件</div>
              </el-upload>
            </template>
          </el-table-column>
        </el-table> -->
        <!-- <div style="text-align:center;">
          <el-upload class="upload-inq inline-class" style="margin-bottom: 5px;" ref="upload" accept=".pdf,.png"
            :file-list="fileList" action="String" :auto-upload="false" :on-change="signFileChange"
            :on-remove="handleRemove" multiple>
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持以下格式：pdf、png，支持上传多个附件</div>
          </el-upload>
        </div> -->
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="uploadFacesheetStatus = false">取消</el-button>
          <el-button size="small" style="padding: 9px 30px" type="primary" @click="uploadComfirm">确认</el-button>
        </div>
      </el-dialog>

      <!-- 下发至第三方仓弹窗 -->
      <el-dialog title="下发至第三方仓" :visible.sync="examineStatus" width="25%">
        <div style="color: #000; width: 250px; margin: 0 auto">
          <p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 20px">
            共{{ selectRows.length }}个发货单，确认审核发货吗？
          </p>
          <div style="line-height: 24px">
            <p>审核发货需满足：</p>
            <p>1、所有商品已匹配SKU</p>
            <p>2、发货单已分配仓库</p>
            <p>3、发货单已分配物流</p>
            <p>4、所有商品在指定仓库有可用库存</p>
            <p>5、发货单状态为待下发</p>
          </div>
        </div>
        <!-- <el-checkbox v-model="checked" style="padding:10px 0;">直接下发到第三方仓</el-checkbox> -->
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="examineStatus = false">取消</el-button>
          <el-button size="small" style="padding: 9px 30px" type="primary" @click="examineConfirm">确认</el-button>
        </div>
      </el-dialog>

      <!-- 下方第三方仓队列结果 -->
      <el-dialog
        title="提示"
        :visible.sync="examineResultStatus"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="50%"
        :before-close="examineResultConfirm"
      >
        <p style="color: red; font-size: 15px; margin-bottom: 10px">
          <span v-if="examineLoading">正在处理数据，请不要进行任何操作，不要关闭此页面，谢谢！</span>
          <span v-else>下方第三方仓数据已处理完毕！</span>
        </p>
        <div style="font-size: 14px; padding: 6px 0; display: flex">
          <p>
            <span>总条数：</span><span>{{ selectRows.length }}</span>
          </p>
          <p style="margin: 0 20px">
            <span>成功条数：</span><span>{{ responseList.successCount }}</span>
          </p>
          <p>
            <span>失败条数：</span><span style="color: red">{{ responseList.failCount }}</span>
          </p>
        </div>
        <el-table :data="responseList.erList" :border="true" :max-height="400" style="width: 100%">
          <el-table-column type="index" label="序号" width="80"> </el-table-column>
          <el-table-column prop="code" label="单据编号" width="210px"></el-table-column>
          <el-table-column prop="success" label="成功/失败" width="85px">
            <template slot-scope="scope">
              <span v-if="scope.row.success">成功</span>
              <span v-else style="color: red">失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="msg" label="失败原因"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="examineResultConfirm" :loading="examineLoading"
            >关 闭</el-button
          >
        </span>
      </el-dialog>

      <!-- 同步订单弹窗 -->
      <el-dialog
        title="同步订单"
        :visible.sync="synchronousStatus"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form :model="synchronousForm" ref="synchronousForm" style="padding: 0 20px" :rules="synchronousRule">
          <el-form-item label="平台" prop="platformTypeId">
            <el-select v-model="synchronousForm.platform" size="small" placeholder="请选择" clearable>
              <el-option
                v-for="item in platform"
                :key="item.platformTypeCode"
                :label="item.platformTypeName"
                :value="item.platformTypeCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="orderCode" label="订单编号">
            <el-input v-model="synchronousForm.orderCode" placeholder="请输入订单编号"></el-input>
          </el-form-item>
        </el-form>
        <p style="text-align: center; color: #1380e6">最近更新时间：2023-07-01 23:00:00</p>
        <p style="text-align: center">可同步时间：15分钟后才可同步</p>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="synCancel">取消</el-button>
          <el-button size="small" style="padding: 9px 30px" type="primary" @click="synConfirm">确认</el-button>
        </div>
      </el-dialog>

      <!-- 标记已发货-->
      <el-dialog
        title="标记已发货"
        :visible.sync="sendTableStatus"
        width="80%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        id="orderManage-dialog"
      >
        <div>
          <el-table :data="sendTableData" :border="sendTableOption.border" :max-height="400" style="width: 100%">
            <el-table-column prop="orderCode" label="发货单号"></el-table-column>
            <el-table-column prop="soOrderCode" label="系统单号"></el-table-column>
            <el-table-column prop="sourceCode" label="平台单号"></el-table-column>
            <el-table-column prop="skuList" label="商品">
              <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.skuList" :key="index">{{ item + "\n" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="warehouseName" label="发货仓库"> </el-table-column>
            <el-table-column prop="logisticsChannel" label="物流方式"> </el-table-column>
            <el-table-column
              prop="trackingNo"
              label="跟踪号"
              v-if="orderBusinessType !== 'PO' && orderBusinessType !== 'DI'"
            >
              <template slot="header" slot-scope="scope">
                <span style="color: red">*</span>
                <span> 跟踪号 </span>
                <span style="color: #4299eb; margin-left: 10px; cursor: pointer" @click="batWrite(scope)">批量</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.trackingNo" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="sendOpe" label="操作">
              <template slot-scope="scope">
                <div style="text-align: center">
                  <el-button type="text" style="color: red" @click="removeSend(scope.$index, scope.row)"
                    >移除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="sendTableStatus = false">取消</el-button>
          <el-button size="small" style="padding: 9px 30px" type="primary" @click="sendConfirm">确认</el-button>
        </div>
      </el-dialog>

      <!-- 设置仓库物流弹窗 -->
      <el-dialog
        title="设置物流渠道"
        :visible.sync="warehouseStatus"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="warehouseCancel"
      >
        <el-form :model="warehouseForm" ref="warehouseForm" style="padding: 0 20px" :rules="warehouseRule">
          <el-form-item label="发货仓库" prop="warehouse">
            <el-select
              v-model="warehouseForm.warehouse"
              size="small"
              filterable
              placeholder="请选择发货仓库"
              clearable
              disabled
              @change="getLogistics"
            >
              <el-option v-for="item in warehouse" :key="item.label" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流商" prop="logisticsCode">
            <el-select
              v-model="warehouseForm.logisticsCode"
              size="small"
              placeholder="请选择物流商"
              clearable
              :disabled="!warehouseForm.warehouse"
              @change="getBseChannel"
            >
              <el-option v-for="item in logistics" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流渠道" prop="logisticsChannel">
            <el-select
              v-model="warehouseForm.logisticsChannel"
              size="small"
              placeholder="请选择物流渠道"
              clearable
              :disabled="!warehouseForm.logisticsCode"
            >
              <el-option
                v-for="item in logisticsChannel"
                :key="item.bseChannelName"
                :label="item.bseChannelName"
                :value="item.bseChannelName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="warehouseCancel">取消</el-button>
          <el-button size="small" style="padding: 9px 30px" type="primary" @click="warehouseConfirm">确认</el-button>
        </div>
      </el-dialog>

      <!-- 反审核至订单 -->
      <el-dialog
        title="反审核至订单"
        :visible.sync="invoiceDelVisible"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="confirm-tips">
          <div>场景：</div>
          <div>1、订单存在异常情况，需作废发货单，暂停发货；</div>
          <div style="margin-bottom: 10px">2、发货单地址、商品、数量等有误，需修改订单信息后重新生成发货单</div>
          <p>作废发货单需满足条件：发货单状态 不为 “已发货/已签收”</p>
          <p>【反审核至订单】操作成功后，发货单作废，并自动释放占用库存。如需发货，可在【订单管理】重新生成发货单！</p>
        </div>
        <p style="font-size: 15px; text-align: center; padding: 10px">
          共<span style="color: #1380e6">{{ selectRows.length }}</span>
          个发货单，确认作废发货单吗？
        </p>
        <el-form :model="invoiceCancelForm" ref="invoiceCancelForm" style="padding: 0 20px" :rules="invoiceCancelRule">
          <el-form-item label="作废发货单原因" prop="reason" style="margin-bottom: 16px">
            <el-select v-model="invoiceCancelForm.reason" size="small" placeholder="请选择作废原因" clearable>
              <el-option v-for="item in cancelReason" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="remark"
            label="原因备注"
            style="margin-bottom: 16px"
            v-if="invoiceCancelForm.reason === 'OTHER'"
          >
            <el-input
              v-model="invoiceCancelForm.remark"
              size="small"
              type="textarea"
              :rows="2"
              clearable
              placeholder="请输入原因备注："
            ></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="invoiceDelVisible = false">取消</el-button>
          <el-button
            size="small"
            style="padding: 8px 30px"
            :loading="loadingStatus"
            type="primary"
            @click="invoiceCancelConfirm"
            >确定</el-button
          >
        </div>
      </el-dialog>
      <!-- 标签弹窗 -->
      <el-dialog
        title="设置标签"
        :visible.sync="labelStatus"
        width="60%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="label-search">
          <el-input v-model="labelSearchInfo" size="small" style="width: 100px; padding-right: 10px"></el-input>
          <div class="operate">
            <el-button size="small" type="primary" @click="labelSearch">搜索</el-button>
            <el-button size="small" @click="labelSearchInfo = ''">清空</el-button>
          </div>
        </div>
        <div style="display: flex; padding: 10px 15px">
          <p style="flex-shrink: 0">已选标签：</p>
          <div style="display: flex; flex-wrap: wrap">
            <el-tag
              style="margin: 0 10px 10px 0"
              size="small"
              v-for="(tag, index) in tagsContent"
              :key="tag.name"
              closable
              @close="handleClose(tag, index)"
              :type="tag.labelColor"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </div>
        <div style="display: flex; padding: 10px 15px">
          <p style="flex-shrink: 0">标签列表：</p>
          <div>
            <el-radio style="font-size: 12px" v-model="isAddOrDelLabel" label="CREATE">添加标签</el-radio>
            <el-radio style="font-size: 12px" v-model="isAddOrDelLabel" label="DELETE">移除标签</el-radio>
          </div>
        </div>
        <div>
          <el-checkbox v-model="checkAll" style="margin-bottom: 10px" @change="handleCheckAllChange">全选</el-checkbox>
          <a @click="goLabel">维护标签</a>
          <detail-wrapper
            :options="{
              title: '系统标签',
              customContentStyle: {
                padding: '15px'
              }
            }"
          >
            <el-checkbox-group
              style="display: flex; flex-wrap: wrap"
              v-model="checkedLabel"
              @change="handleCheckedLabel"
            >
              <el-checkbox style="margin-bottom: 5px" v-for="item in sysLabelsArr" :label="item.id" :key="item.id">{{
                item.name
              }}</el-checkbox>
            </el-checkbox-group>
          </detail-wrapper>
          <detail-wrapper
            :options="{
              title: '自定义标签',
              customContentStyle: {
                padding: '15px'
              }
            }"
          >
            <el-checkbox-group
              style="display: flex; flex-wrap: wrap"
              v-model="checkedLabel"
              @change="handleCheckedLabel"
            >
              <el-checkbox
                style="margin-bottom: 5px"
                v-for="item in customizeLabelsArr"
                :label="item.id"
                :key="item.id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </detail-wrapper>
        </div>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="labelCancel">取消</el-button>
          <el-button
            size="small"
            style="padding: 9px 30px"
            type="primary"
            :loading="loadingStatus"
            @click="labelConfirm"
            >确认</el-button
          >
        </div>
      </el-dialog>

      <!-- 标签筛选 -->
      <el-dialog title="标签搜索" :visible.sync="labelSearchStatus" width="60%" :close-on-click-modal="false">
        <div class="label-search">
          <el-input v-model="labelSearchInfo" size="small" style="width: 100px; padding-right: 10px"></el-input>
          <div class="operate">
            <el-button size="small" type="primary" @click="labelSearch">搜索</el-button>
            <el-button size="small" @click="labelSearchInfo = ''">清空</el-button>
          </div>
        </div>
        <div style="display: flex; padding: 10px 15px">
          <p style="flex-shrink: 0">标签列表：</p>
          <div>
            <el-radio style="font-size: 12px" v-model="searchForm.hasLabelIdFlag" :label="true">包含标签</el-radio>
            <el-radio style="font-size: 12px" v-model="searchForm.hasLabelIdFlag" :label="false">排除标签</el-radio>
          </div>
        </div>
        <div>
          <el-checkbox v-model="checkAll" style="margin-bottom: 10px" @change="handleCheckAllChange">全选</el-checkbox>
          <detail-wrapper
            :options="{
              title: '系统标签',
              customContentStyle: {
                padding: '15px'
              }
            }"
          >
            <el-checkbox-group
              style="display: flex; flex-wrap: wrap"
              v-model="checkedLabel"
              @change="handleCheckedLabel"
            >
              <el-checkbox style="margin-bottom: 5px" v-for="item in sysLabelsArr" :label="item.id" :key="item.id">{{
                item.name
              }}</el-checkbox>
            </el-checkbox-group>
          </detail-wrapper>
          <detail-wrapper
            :options="{
              title: '自定义标签',
              customContentStyle: {
                padding: '15px'
              }
            }"
          >
            <el-checkbox-group
              style="display: flex; flex-wrap: wrap"
              v-model="checkedLabel"
              @change="handleCheckedLabel"
            >
              <el-checkbox
                style="margin-bottom: 5px"
                v-for="item in customizeLabelsArr"
                :label="item.id"
                :key="item.id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </detail-wrapper>
        </div>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="labelSearchStatus = false">取消</el-button>

          <el-button
            size="small"
            style="padding: 9px 30px"
            type="primary"
            :loading="loadingStatus"
            @click="labelSearchConfirm"
            >确认</el-button
          >
        </div>
      </el-dialog>
    </basic-container>

    <!-- 查看图片 -->
    <imgdialog ref="imgdialog"></imgdialog>
    <cancelShipmentDialog ref="cancelShipmentDialogRef" @updateList="updateList"></cancelShipmentDialog>
    <logisticsTrackingDialog ref="logisticsTrackingDialogRef" @updateList="updateList"></logisticsTrackingDialog>
    <commonImport
      ref="commonImport"
      :excelStatus="false"
      :excelDangerStatus="excelDangerStatus"
      @import="importExcelBtn"
      @export="exportDangerExcel"
      :customDownload="customDownload"
    >
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

    <markShippedDialog ref="markShippedDialogRef" @updateDate="updateDate"></markShippedDialog>
    <batchUploadFile ref="batchUploadFileRef" @updateList="updateDate"></batchUploadFile>
  </div>
</template>

<script>
import {
  getInvoiceListPageV2,
  getInvoiceListPage,
  syncOrder,
  syncOrderStatus,
  getMarkShipment,
  markReceived,
  delOrder,
  setLogistics,
  getStatusCount,
  getAllChannel,
  invoiceExport,
  uploadImgAndPdf,
  uploadStatement,
  previewImgAndPdf,
  cancelAbnormal,
  logisticsTracking,
  downloadTemplate,
  modifyOrderPrice,
  checkModifyOrderPrice,
  checkModifyOrderPriceV2
} from "@/api/order/invoiceManage"
import {
  tableOption,
  synchronousRule,
  sendTableOption,
  warehouseRule,
  faceSheetOption
} from "@/const/crud/order/invoiceManage/invoiceManage"
import {
  getPlayTypeAll,
  getStore,
  getObjByType,
  getCountry,
  getSit,
  getCarriersByWarehouseld,
  editAllLabel,
  getStoreBySitIds
} from "@/api/order/orderManage"
import imgdialog from "./imgDialog"
import commonImport from "@/views/cockpit/commonImport"
import { downloadFileByUrl, setFiltering } from "@/util/auth"
import { getSitInfo } from "@/api/baseSetup/bseplatformsit"
import { getListPage } from "@/api/order/labelManage"
import { fetchList as getLogistics } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier"
import { getAllWarehouse } from "@/api/order/orderRule"
import { fetchList as getAllLogistics } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier"
import { getStore as getSession } from "@/util/store"
import { getUrlConcatToken, downloadBlob, getDictByType } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import cancelShipmentDialog from "./components/cancelShipmentDialog"
import newCommonImport from "@/views/cockpit/newCommonImport"
import logisticsTrackingDialog from "./components/logisticsTrackingDialog"
import markShippedDialog from "./components/markShippedDialog"
import batchUploadFile from "../orderManage/components/batchUploadFile.vue"

export default {
  name: "orderRuleList",
  components: {
    imgdialog,
    cancelShipmentDialog,
    commonImport,
    newCommonImport,
    logisticsTrackingDialog,
    markShippedDialog,
    batchUploadFile
  },
  watch: {},
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        orderCode: "",
        soOrderCode: "",
        sourceCode: "",
        platformOrderCode: "",
        extendCode: "",
        wmsCode: "",
        trackingNo: "",
        platform: [],
        shopId: [],
        deliveryStatusIsUsed: "EFFICIENT",
        orderBusinessType: [],
        orderType: [],
        warehouseId: [],
        logisticsChannel: [],
        abnormalType: [],
        deliveryMethod: [],
        labelIdList: [],
        hasLabelIdList: [],
        noLabelIdList: [],
        hasLabelIdFlag: true,
        deliveryStatus: "",
        site: []
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],
      tabParam: "TOTAL",
      orderAllStatus: [
        { statusName: "全部", key: "TOTAL" },
        { statusName: "创建", key: "CREATE", countKey: "create" },
        { statusName: "待下发", key: "UN_SEND", countKey: "unSend" },
        { statusName: "待发货", key: "UN_DELIVERY", countKey: "unDelivery" },
        { statusName: "已发货", key: "ALREADY_DELIVERY", countKey: "alreadyDelivery" },
        { statusName: "已签收", key: "ALREADY_SIGN", countKey: "alreadySign" },
        { statusName: "已取消", key: "CANCELED", countKey: "canceled" }
      ],
      deliveryMethodOptions: [
        { label: "平台仓发货", value: "PLATFORM" },
        { label: "海外仓发货", value: "WAREHOUSE" },
        { label: "中转仓发货", value: "TRANSIT" }
      ],
      examineStatus: false,
      synchronousStatus: false,
      synchronousForm: {
        platformTypeId: "",
        salesSiteId: "",
        storeId: "",
        orderCode: ""
      },
      synchronousRule: synchronousRule,
      warehouseStatus: false,
      warehouseForm: {
        warehouseId: "",
        warehouse: "",
        logisticsCode: "",
        logisticsChannel: "",
        warehouseCode: ""
      },
      warehouseRule: warehouseRule,
      sendTableStatus: false,
      sendTableOption: sendTableOption,
      sendTableData: [
        { id: "111qqq", priority: 1, ruleName: 19, count: 19, fhCount: 0, isInit: true },
        { id: "111www", priority: 1, ruleName: 9, count: 6, fhCount: 0, isInit: true },
        { id: "111eee", priority: 1, ruleName: 19, count: 0, fhCount: 0, isInit: true }
      ],
      platform: [],
      sit: [],
      store: [],
      country: [],
      orderType: [],
      orderStatus: [],
      warehouse: [],
      logistics: [],
      logisticsChannel: [],
      invoiceDelVisible: false,
      cancelReason: [
        { label: "订单异常", value: "ORDER_ERROR" },
        { label: "发货单信息有误", value: "FO_ORDER_ERROR" },
        { label: "其他", value: "OTHER" }
      ],
      invoiceCancelForm: {
        reason: "",
        remark: ""
      },
      wmsStatus: [],
      deliveryStatus: [],
      searchFields: [
        { label: "SKU", value: "sku", type: "input", default: true },
        { label: "平台SKU", value: "platformSku", type: "input" },
        { label: "发货单创建时间", value: "createTime", type: "datetimerange" },
        { label: "下发三方仓时间", value: "interfaceTransactionTime", type: "datetimerange" },
        { label: "ERP发货时间", value: "erpShippingTime", type: "datetimerange" },
        { label: "仓库发货时间", value: "shippingTime", type: "datetimerange" },
        { label: "下单时间", value: "orderTime", type: "datetimerange" }
      ],
      interfaceSendStatus: "",
      abnormalType: [],
      marketOption: [],
      storeOptions: [],
      searchValue: "",
      orderModel: [],
      channelOption: [],
      isInitWare: false,
      warehouseInit: {},
      orderBusinessType: "",
      faceSheetStatus: false,
      faceSheetData: [],
      faceSheetOption: faceSheetOption,
      uploadFacesheetStatus: false,
      fileList: [],
      uploadIds: [],
      uploadForm: {},
      pdfData: "",
      imageData: "",
      examineResultStatus: false,
      examineLoading: false,
      responseList: {
        erList: [],
        successCount: 0,
        failCount: 0
      },
      labelSearchInfo: "",
      labelStatus: false,
      isAddOrDelLabel: "CREATE",
      loadingStatus: false,
      labelSearchStatus: false,
      tagsContent: [],
      checkAll: false,
      checkedLabel: [],
      labelsArr: [],
      sysLabelsArr: [],
      customizeLabelsArr: [],
      isUsedArr: [
        { value: "ABROGATE", label: "作废" },
        { value: "EFFICIENT", label: "有效" }
      ],
      cancelStatus: false,
      isUsed: false,
      invoiceCancelRule: {
        reason: [{ required: true, message: "请选择作废发货单原因", trigger: "change" }]
      },
      excelDangerStatus: false,
      errorFileUrl: "",
      newDownloadUrl: "/oms/foOrder/downloadTemplate",
      newPreviewUrl: "/oms/foOrder/batchImportTrackingNoPreview",
      newUploadUrl: "/oms/foOrder/batchImportTrackingNo",
      newDownloadTitle: "批量导入跟踪号模板",
      antiDumpingBill: [],
      modifyPriceType: null,
      otherParams: ["sku", "platformSku", "labelIdList", "hasLabelIdList", "noLabelIdList", "deliveryStatusIsUsed"],
      aggregateRecord: {}
    }
  },

  async created() {
    this.init()
    this.getList()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"]),
    deliveryStatusObj() {
      const result = {}
      this.deliveryStatus.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    },
    interfaceSendStatusObj() {
      const result = {}
      this.interfaceSendStatus.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    },
    wmsStatusObj() {
      const result = {}
      this.wmsStatus.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    },
    abnormalTypeObj() {
      const result = {}
      this.abnormalType.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    }
  },
  methods: {
    async handleTrackingNo(row) {
      const { orderCode } = row
      const { data } = await logisticsTracking(orderCode)
      if (!data.data || data.data.length == 0) {
        this.$message.warning("无物流轨迹数据")
        return
      }
      if (data.data.length) {
        this.$refs.logisticsTrackingDialogRef.openDialog(data.data)
      }
    },
    handleStatus(val) {
      if (val === "ABROGATE") {
        this.searchForm.deliveryStatus = []
        this.isUsed = true
      } else {
        this.isUsed = false
      }
    },
    handleCheckStatus(val) {
      if (val.length != 0) {
        this.cancelStatus = true
      }
      if (val.length == 0) {
        this.cancelStatus = false
      }
    },
    goLabel() {
      this.labelStatus = false
      this.$router.push({
        path: "/order/labelManageList"
      })
    },
    /**
     * 标签设置
     */
    async setLabel(row) {
      this.labelSearchInfo = ""
      if (this.sysLabelsArr.length == 0 && this.customizeLabelsArr.length == 0) {
        let res = await getListPage({ page: -1, pageSize: -1, name: this.labelSearchInfo })
        if (res.data.code === 0) {
          this.sysLabelsArr = res.data.data.records
            .filter((item) => item.labelType === "SYS" && item.id != 44)
            .sort((a, b) => a.name.length - b.name.length)
          this.customizeLabelsArr = res.data.data.records
            .filter((item) => item.labelType === "CUSTOMIZE")
            .sort((a, b) => a.name.length - b.name.length)
        }
      }

      let labelRow = {},
        singleStatus = false
      if (row) {
        labelRow = row
        singleStatus = true
      } else if (!row && this.selectRows.length === 1) {
        labelRow = this.selectRows[0]
        singleStatus = true
      }

      if (singleStatus) {
        this.tableDataRow = labelRow
        this.tagsContent = deepClone(labelRow.labels) || []
        if (labelRow.labels) {
          this.checkedLabel = labelRow.labels.map((item) => item.id)
        } else {
          this.checkedLabel = []
        }
        this.checkAll = this.tagsContent.length === this.labelsArr.length
      }
      this.labelStatus = true
    },
    labelCancel() {
      this.labelSetType = ""
      this.isAddOrDelLabel = "CREATE"
      this.checkAll = false
      this.tagsContent = []
      this.checkedLabel = []
      this.labelStatus = false
    },
    labelConfirm() {
      if (this.selectRows.length > 1) {
        const params = {
          orderCodeList: this.selectRows.map((item) => item.orderCode),
          type: this.isAddOrDelLabel,
          labelIdList: this.checkedLabel
        }
        this.loadingStatus = true
        editAllLabel(params)
          .then((res) => {
            if (res.data.code === 0) {
              this.loadingStatus = false
              this.$message.success("批量修改标签成功")
              this.refreshChange()
              this.isAddOrDelLabel = "CREATE"
              this.tagsContent = []
              this.checkedLabel = []
              this.labelStatus = false
              this.clearSelectClear()
            } else {
              this.loadingStatus = false
              this.$message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.loadingStatus = false
          })
      } else {
        const params = {
          orderCodeList: this.selectRows.map((item) => item.orderCode),
          labelIdList: this.checkedLabel,
          type: this.isAddOrDelLabel
        }
        this.loadingStatus = true
        editAllLabel(params)
          .then((res) => {
            if (res.data.code === 0) {
              this.loadingStatus = false
              this.$message.success("单个修改标签成功")
              this.refreshChange()
              this.tagsContent = []
              this.checkedLabel = []
              this.labelStatus = false
              this.clearSelectClear()
            } else {
              this.loadingStatus = false
              this.$message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.loadingStatus = false
          })
      }
    },
    handleClose(tag, tagIndex) {
      const index = this.checkedLabel.findIndex((item) => item === tag.id)
      this.checkedLabel.splice(index, 1)
      this.tagsContent.splice(tagIndex, 1)
      this.checkAll = this.tagsContent.length === this.labelsArr.length
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checkedLabel = this.labelsArr.map((item) => item.id)
        this.tagsContent = deepClone(this.labelsArr)
      } else {
        this.checkedLabel = []
        this.tagsContent = []
      }
    },
    handleCheckedLabel(val) {
      this.tagsContent = []
      let newCountent = []
      val.forEach((valItem) => {
        let needArr = this.labelsArr.filter((item) => valItem === item.id)
        this.tagsContent = [...this.tagsContent, ...needArr]
      })
      this.tagsContent.forEach(function (obj) {
        let exists = newCountent.some(function (item) {
          return item.id === obj.id
        })
        if (!exists) {
          newCountent.push(obj)
        }
      })
      this.tagsContent = newCountent
      let checkedCount = val.length
      this.checkAll = checkedCount === this.labelsArr.length
    },
    /**
     标签筛选
    */
    handleClear() {
      this.checkedLabel = []
      this.tagsContent = []
    },
    labelSearchConfirm() {
      this.searchForm.labelIdList = [...this.checkedLabel]
      this.searchForm.hasLabelIdList = this.searchForm.hasLabelIdFlag ? [...this.checkedLabel] : []
      this.searchForm.noLabelIdList = this.searchForm.hasLabelIdFlag ? [] : [...this.checkedLabel]
      console.log(this.searchForm.labelIdList)
      this.labelSearchStatus = false
    },
    handleExpend(isVisible) {
      if (isVisible) {
        this.$refs.labelSelect.blur()
        this.labelSetType = "筛选"
        this.labelTitle = "标签搜索"
        this.labelSearchInfo = ""
        if (this.sysLabelsArr.length == 0 && this.customizeLabelsArr.length == 0) {
          getListPage({ page: -1, pageSize: -1, name: this.labelSearchInfo }).then((res) => {
            if (res.data.code === 0) {
              // this.labelsArr = res.data.data.records
              this.sysLabelsArr = res.data.data.records
                .filter((item) => item.labelType === "SYS")
                .sort((a, b) => a.name.length - b.name.length)
              this.customizeLabelsArr = res.data.data.records
                .filter((item) => item.labelType === "CUSTOMIZE")
                .sort((a, b) => a.name.length - b.name.length)
            }
          })
        }
        this.labelSearchStatus = true
      }
    },
    labelSearch() {
      getListPage({ page: -1, pageSize: -1, name: this.labelSearchInfo }).then((res) => {
        if (res.data.code === 0) {
          // this.labelsArr = res.data.data.records
          this.sysLabelsArr = res.data.data.records.filter((item) => item.labelType === "SYS" && item.id != 37)
          this.customizeLabelsArr = res.data.data.records.filter((item) => item.labelType === "CUSTOMIZE")
        }
      })
    },

    cancelAbnormal() {
      const params = this.selectRows.map((item) => item.orderCode)
      cancelAbnormal(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("取消异常标识成功")
          this.clearSelectClear()
          this.refreshChange()
        }
      })
    },
    //保存面单
    uploadComfirm() {
      this.$refs.uploadForm.validate((valid) => {
        if (valid) {
          console.log(123)
          uploadStatement(this.uploadForm).then((res) => {
            console.log(res)
            if (res.data.code === 0) {
              this.$message.success("操作成功")
              this.uploadFacesheetStatus = false
              this.refreshChange()
            } else {
              this.$message.error(res.data.msg)
              this.uploadFacesheetStatus = false
              this.refreshChange()
            }
          })
        }
      })
      // this.uploadForm.faceSheet = this.uploadIds
    },
    signFileChange(file, fileList) {
      console.log(123)
      if (file.size / 1024 / 1024 > 5) {
        this.$message.warning("不允许上传大于5M文件")
        return
      }
      const fileType = ["application/pdf", "image/png"]
      const status = fileType.some((item) => item === file.raw.type)
      if (!status) {
        this.$message.warning("请选择png或者PDF文件")
        return
      }

      let formdata = new FormData()
      formdata.append("applicationName", "")
      formdata.append("file", file.raw)
      uploadImgAndPdf(formdata).then((res) => {
        console.log(321)
        if (res.data.code == 0) {
          this.$message.success("上传成功")
          this.uploadIds.push(res.data.data.id)
          this.fileList = fileList
          this.uploadForm.faceSheet = res.data.data.id + ""
        } else if (res.data.code == 1) {
          this.$message.error(res.data.msg)
        }
      })
    },
    //查看面单弹窗
    showFacesheet(row) {
      if (!row.faceSheet) {
        this.$message.warning("该订单暂无面单！")
        return
      }
      // if (this.pdfData) {
      //   window.open(this.pdfData)
      //   return
      // }
      // if (this.imageData) {
      //   console.log(123)
      //   this.$refs.imgdialog.showImgUrl(this.imageData)
      //   return
      // }
      previewImgAndPdf({ fileId: row.faceSheet }).then((res) => {
        if (res.data.type === "application/pdf") {
          const blob = new Blob([res.data], { type: "application/pdf" })
          this.pdfData = URL.createObjectURL(blob)
          window.open(this.pdfData)
        } else {
          const href = window.URL.createObjectURL(res.data)
          this.imageData = href
          this.$refs.imgdialog.showImgUrl(href)
        }
      })
    },
    //上传面单
    uploadFacesheet(row) {
      this.fileList = []
      this.uploadForm = {
        id: row.id,
        faceSheet: "",
        trackingNo: row.trackingNo
      }
      this.uploadFacesheetStatus = true
    },
    async init() {
      getStatusCount().then((res) => {
        if (res.data.code === 0) {
          console.log(res.data)
          this.orderAllStatus.forEach((item) => {
            if (res.data.data[item.countKey] !== undefined) {
              item.statusName = item.statusName + "(" + res.data.data[item.countKey] + ")"
            }
          })
        }
      })
      getPlayTypeAll().then((res) => {
        if (res.data.code == 0) {
          this.platform = this.sortArray(res.data.data, "platformTypeName")
        }
      })
      // getObjByType('order_operate_type').then(res => {
      //   if (res.data.code === 0) {
      //     this.orderType = res.data.data
      //   }
      // })
      getObjByType("fulfillment_status").then((res) => {
        if (res.data.code === 0) {
          this.orderStatus = res.data.data
        }
      })
      getObjByType("order_batch_invoice").then((res) => {
        if (res.data.code === 0) {
          this.deliveryStatus = res.data.data
        }
      })
      getObjByType("wms_status").then((res) => {
        if (res.data.code === 0) {
          this.wmsStatus = res.data.data
        }
      })
      getObjByType("interface_send_flag").then((res) => {
        if (res.data.code === 0) {
          this.interfaceSendStatus = res.data.data
        }
      })

      getObjByType("order_business_type").then((res) => {
        if (res.data.code === 0) {
          this.orderModel = res.data.data
        }
      })

      getObjByType("order_type").then((res) => {
        if (res.data.code === 0) {
          this.orderType = res.data.data
        }
      })

      getObjByType("fo_order_abnormal_type").then((res) => {
        if (res.data.code === 0) {
          this.abnormalType = res.data.data
          console.log(this.abnormalType)
        }
      })

      getAllWarehouse().then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            this.warehouse.push({
              value: item.warehouseId,
              label: item.warehouseName
            })
          })
        }
      })

      getAllChannel().then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            this.channelOption.push({
              value: item.bseChannelCode,
              label: item.bseChannelName
            })
          })
        }
      })

      getAllLogistics({ current: -1, size: -1 }).then((res) => {
        if (res.data.code === 0) {
          res.data.data.records.forEach((item) => {
            this.logistics.push({
              value: item.transportCarrierCode,
              label: item.carrierShortName
            })
          })
        }
      })
      getCountry().then((res) => {
        if (res.data.code === 0) {
          this.country = res.data.data
        }
      })
      getListPage({ page: -1, pageSize: -1 }).then((res) => {
        if (res.data.code === 0) {
          this.labels = res.data.data.records
          this.labelsArr = res.data.data.records
          this.sysLabelsArr = res.data.data.records
            .filter((item) => item.labelType === "SYS" && item.id != 37)
            .sort((a, b) => a.name.length - b.name.length)
          this.customizeLabelsArr = res.data.data.records
            .filter((item) => item.labelType === "CUSTOMIZE")
            .sort((a, b) => a.name.length - b.name.length)
          console.log(this.sysLabelsArr, 111)
        }
      })

      this.getStoreList()
      this.getSitAll()
      this.antiDumpingBill = await getDictByType("anti_dumping_bill_type")
    },

    //根据平台查询站点
    getPlatformSit(param) {
      getSit(param).then((res) => {
        this.marketOption = this.sortArray(res.data, "sitName")
      })
    },
    getChannel() {},
    goOrderDetail(row) {
      console.log(111, row)
      this.$router.push({
        path: "/order/invoiceManage/detail",
        query: { id: row.id }
      })
    },

    removeSend(index, row) {
      this.sendTableData.splice(index, 1)
    },
    batWrite(val) {
      let label = val.column.property
      if (label === "trackingNo") {
        let trackingNo = this.sendTableData[0].trackingNo
        this.sendTableData.forEach((item) => {
          this.$set(item, "trackingNo", trackingNo)
        })
      }
      if (label === "warehouse") {
        let warehouse = this.sendTableData[0].warehouse
        this.sendTableData.forEach((item) => {
          this.$set(item, "warehouse", warehouse)
        })
      }
      if (label === "bseOverseaCarrierCode") {
        let bseOverseaCarrierCode = this.sendTableData[0].bseOverseaCarrierCode
        this.sendTableData.forEach((item) => {
          this.$set(item, "bseOverseaCarrierCode", bseOverseaCarrierCode)
        })
      }
    },
    getLogistics(warehouseId) {
      this.logistics = []
      this.logisticsChannel = []
      this.warehouseForm.logisticsCode = ""
      this.warehouseForm.logisticsChannel = ""

      getCarriersByWarehouseld({ warehouseIds: [warehouseId] }).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data && res.data.data.length) {
            res.data.data[0].dataList.forEach((item) => {
              this.logistics.push({
                value: item.transportCarrierCode,
                label: item.carrierName,
                transportCarrierId: item.transportCarrierId,
                warehouseId: item.warehouseId,
                bseChannels: item.bseChannels
              })
            })
            this.logistics.forEach((item) => {
              if (item.warehouseId === warehouseId) {
                this.warehouseForm.warehouseCode = item.warehouseCode
              }
            })
            if (this.warehouseInit.logisticsCode && !this.isInitWare) {
              this.$set(this.warehouseForm, "logisticsCode", this.warehouseInit.logisticsCode)
              this.getBseChannel(this.warehouseForm.logisticsCode)
            }
          }
        }
      })
    },
    getBseChannel(val) {
      console.log(val)
      this.warehouseForm.logisticsChannel = ""
      this.logistics.forEach((item) => {
        console.log(item)
        if (item.value === val) {
          this.logisticsChannel = item.bseChannels ? item.bseChannels : []
        }
      })

      if (!this.isInitWare) {
        this.warehouseForm.logisticsChannel = this.warehouseInit.logisticsChannel
        this.isInitWare = true
      }
    },
    getAllStore(val) {
      if (val) return
      if (!this.searchForm.platform) return
      getStore(this.searchForm.platform).then((res) => {
        if (res.status === 200) {
          this.store = res.data
        }
      })
    },
    getSitAndStore() {
      // if (val) return
      if (!this.synchronousForm.platformTypeId) return
      getStore([this.synchronousForm.platformTypeId]).then((res) => {
        if (res.status === 200) {
          this.store = res.data
        }
      })
      getSit([this.synchronousForm.platformTypeId]).then((res) => {
        if (res.status === 200) {
          this.sit = res.data
        }
      })
    },
    invoiceCancel() {
      if (!this.selectRows || this.selectRows.length === 0) {
        this.$message.error("请勾选数据")
        return
      }
      const invoicestatus = this.selectRows.map((item) => item.deliveryStatus)
      const orderstatus = ["UN_SEND", "UN_DELIVERY", "VIRTUAL_SHIPPED"]
      let status = false
      invoicestatus.forEach((item) => {
        status = orderstatus.includes(item)
      })
      console.log(status)
      if (!status) {
        this.$message.error("只有待下发/待发货/虚假发货成功状态的订单才可以反审核！")
        return
      }
      this.invoiceDelVisible = true
    },
    async invoiceCancelConfirm() {
      this.$refs.invoiceCancelForm.validate(async (valid) => {
        if (valid) {
          let orderCodeList = this.selectRows.map((item) => item.orderCode)
          let res = await delOrder({
            orderCodeList,
            deleteType: this.invoiceCancelForm.reason,
            deleteReason: this.invoiceCancelForm.remark
          })
          if (res.data.code == 0) {
            this.$message.success("删除成功")
            this.invoiceDelVisible = false
            this.refreshChange()
          } else {
            this.$message.error(res.data.msg)
          }
        }
      })
    },
    exportInvoice() {
      invoiceExport(this.searchForm).then((res) => {
        if (res.data.size < 100) {
          let count = getSession({ name: "downloadCount" })
          this.$store.commit("SET_DOWNLOAD_COUNT", Number(count) + 1)
          this.$message.success(`由于导出订单数据量较大，请点击右上角【下载列表】图标进行查看！`)
        } else {
          this.$message.success(`导出成功`)
          downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        }
      })
    },
    setWarehouse() {
      if (!this.selectRows || this.selectRows.length === 0) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.selectRows.length > 1) {
        let isSame = this.selectRows.every((obj) => obj.warehouseId === this.selectRows[0].warehouseId)
        if (!isSame) {
          this.$message.warning("发货仓库相同，才能批量设置物流渠道")
          return
        }
        this.warehouseInit = {
          warehouse: this.selectRows[0].warehouseId
        }
      } else {
        this.warehouseInit = {
          warehouse: this.selectRows[0].warehouseId,
          logisticsCode: this.selectRows[0].logisticsCode,
          logisticsChannel: this.selectRows[0].logisticsChannel
        }
      }

      this.warehouseForm.warehouse = this.selectRows[0].warehouseId
      if (this.warehouseForm.warehouse) {
        this.getLogistics(this.warehouseForm.warehouse)
      }
      this.warehouseStatus = true
    },
    warehouseCancel() {
      this.warehouseForm = {
        warehouseId: "",
        warehouse: "",
        logisticsCode: "",
        logisticsChannel: "",
        warehouseCode: ""
      }
      this.$refs["warehouseForm"].resetFields()
      this.warehouseStatus = false
      this.isInitWare = false
    },
    warehouseConfirm() {
      this.$refs["warehouseForm"].validate(async (valid) => {
        if (valid) {
          let idList = this.selectRows.map((item) => item.id)
          this.warehouseForm.idList = idList
          let res = await setLogistics(this.warehouseForm)
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.warehouseStatus = false
            this.refreshChange()
            this.$refs.crud.toggleSelection()
            this.$refs["warehouseForm"].resetFields()
            this.isInitWare = false
          } else {
            this.$message.error(res.data.msg)
            this.warehouseStatus = false
          }
        }
      })
    },
    async toSend() {
      if (!this.selectRows || this.selectRows.length === 0) {
        this.$message.error("请勾选数据")
        return
      }
      let typeEqual = this.selectRows.every((obj) => obj.orderBusinessType === this.selectRows[0].orderBusinessType)
      if (!typeEqual) {
        this.$message.warning("交货模式相同，才能批量标记已发货！")
        return
      }
      let orderstatus = this.selectRows.map((item) => item.deliveryStatus)
      const status = orderstatus.includes("ABROGATE")
      if (status) {
        this.$message.error("不允许操作")
        return
      }
      let ids = this.selectRows.map((item) => item.id)
      let res = await getMarkShipment(ids)
      this.sendTableData = res.data.data
      this.orderBusinessType = this.selectRows[0].orderBusinessType
      this.sendTableStatus = true
    },
    async sendConfirm() {
      this.sendTableStatus = false
      this.$refs.markShippedDialogRef.openDialog(this.sendTableData)
    },
    synchronous() {
      if (!this.selectRows || this.selectRows.length === 0) {
        this.$message.error("请勾选数据")
        return
      }
      this.synchronousStatus = true
    },
    synCancel() {
      this.synchronousForm = {}
      this.sit = []
      this.store = []
      this.$refs["synchronousForm"].resetFields()
      this.synchronousStatus = false
    },
    synConfirm() {
      this.$refs["synchronousForm"].validate(async (valid) => {
        if (valid) {
          let res = await syncOrderStatus()
          console.log(res)
        }
      })
    },
    examine() {
      if (!this.selectRows || this.selectRows.length === 0) {
        this.$message.error("请勾选数据")
        return
      }
      this.examineStatus = true
    },
    async examineConfirm() {
      let ids = this.selectRows.map((item) => {
        return [
          {
            id: item.id,
            code: item.orderCode
          }
        ]
      })
      this.examineResultStatus = true
      this.examineLoading = true

      const BATCH_SIZE = 10 // 每次处理的批次大小
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

      for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        // 获取当前批次的数据
        const batch = ids.slice(i, i + BATCH_SIZE)

        // 处理当前批次的所有请求
        await Promise.all(
          batch.map(async (idObj, index) => {
            await syncOrder(idObj)
              .then((res) => {
                if (res.data.code === 0) {
                  let obj = {
                    id: this.selectRows[i + index].id,
                    code: this.selectRows[i + index].orderCode,
                    success: true,
                    msg: ""
                  }
                  this.responseList.erList.push(obj)
                  this.responseList.successCount++
                } else {
                  let obj = {
                    id: this.selectRows[i + index].id,
                    code: this.selectRows[i + index].orderCode,
                    success: false,
                    msg: res.data.msg
                  }
                  this.responseList.erList.unshift(obj)
                  this.responseList.failCount++
                }
              })
              .catch((error) => {
                let obj = {
                  id: this.selectRows[i + index].id,
                  code: this.selectRows[i + index].orderCode,
                  success: false,
                  msg: error.message || "请求失败"
                }
                this.responseList.erList.unshift(obj)
                this.responseList.failCount++
              })
          })
        )

        // 每处理完一个批次，延迟一段时间再处理下一个批次
        await delay(300) // 延迟300毫秒，可以根据需要调整
      }

      this.examineLoading = false
    },
    examineResultConfirm() {
      this.responseList.erList = []
      this.responseList.successCount = 0
      this.responseList.failCount = 0
      this.examineResultStatus = false
      this.examineStatus = false
      this.clearSelectClear()
      this.refreshChange()
    },
    signFor() {
      if (!this.selectRows || this.selectRows.length === 0) {
        this.$message.error("请勾选数据")
        return
      }
      let orderstatus = this.selectRows.map((item) => item.deliveryStatus)
      const status = orderstatus.includes("ABROGATE")
      if (status) {
        this.$message.error("不允许操作")
        return
      }
      const h = this.$createElement
      this.$msgbox({
        title: "",
        message: h("div", null, [
          h(
            "p",
            { style: "color: #1380E6;font-size: 16px;margin-bottom: 10px;" },
            `共${this.selectRows.length}个发货单，确认修改发货单状态为已签收吗？`
          ),
          h("p", null, "标记已签收需满足：发货单状态为已发货")
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = "执行中..."
            let codes = this.selectRows.map((item) => item.orderCode)
            markReceived(codes)
              .then((res) => {
                if (res.data.code === 0) {
                  instance.confirmButtonLoading = false
                  this.refreshChange()
                  done()
                }
              })
              .catch((err) => {
                instance.confirmButtonLoading = false
              })
          } else {
            done()
          }
        }
      }).then((action) => {
        this.$message({
          type: "success",
          message: "标记已签收成功"
        })
      })
    },
    // 导出数据
    async exportDataRule() {
      let res = await exportData(this.searchForm)
        .then((res) => {
          downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getCellClass({ row }) {
      if (row.abnormalType) {
        return "isAbnormalFlag"
      }
      if (row.freezeStatus === "FROZEN") {
        return "isFreezeFlag"
      }
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList()
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList()
    },
    searchReset() {
      this.$refs.searchFormRef.resetFields()
      this.$refs.searchAdvancedFormRef?.resetFields()

      this.$refs.searchCrudItemRef.resetField()
      this.searchForm.hasLabelIdList = []
      this.searchForm.noLabelIdList = []
      this.isUsed = false
      this.getStoreList()
      this.getSitAll()
      this.$refs.selectAllRef.resetSelectAll()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    // 过滤筛选参数
    filterSearchParams() {
      this.searchForm = deepCloneIgnoreNull(this.searchForm)

      const searchParams = Object.keys(this.searchForm).reduce((acc, key) => {
        if (this.otherParams.includes(key)) {
          acc[key] = this.searchForm[key]
        }
        if (key === "deliveryStatusIsUsed") {
          acc[key] = this.searchForm[key] === "EFFICIENT" ? undefined : this.searchForm[key]
        }
        return acc
      }, {})

      return searchParams
    },

    // 处理搜索参数
    handleSearchParams(otherParams, searchForm) {
      const filteredSearchForm = Object.keys(searchForm).reduce((acc, key) => {
        if (!otherParams.includes(key)) {
          acc[key] = searchForm[key]
        }
        return acc
      }, {})

      const operatorParams = {
        createTime: "BETWEEN",
        interfaceTransactionTime: "BETWEEN",
        erpShippingTime: "BETWEEN",
        shippingTime: "BETWEEN",
        requiredShipDate: "BETWEEN",
        abnormalOrderFlag: "EQUAL"
      }

      return setFiltering(filteredSearchForm, operatorParams)
    },
    async getList() {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: this.handleSearchParams(this.otherParams, this.searchForm),
        ...this.filterSearchParams(),
        aggregate: [{ field: "totalAmount", function: "sum" }]
      }

      const { data } = await getInvoiceListPageV2(params)

      if (data.code === 0) {
        data.data.records.forEach((item) => {
          if (item.productVOS?.length > 3) {
            item.spliceProducts = item.productVOS?.slice(0, 3)
            item.isMoreProducts = true
          } else {
            item.spliceProducts = item.productVOS
          }
          if (item.interfaceErrorDescription !== null && item.interfaceErrorDescription?.length > 10) {
            item.spliceError = item.interfaceErrorDescription.substring(0, 10)
          } else {
            item.spliceError = item.interfaceErrorDescription
          }

          item.platformSlotText = `${item.platform} / ${item.market}`
          // =============================== //
          item.abnormalTypeSlotText = `${this.abnormalTypeObj[item.abnormalType]}`
          item.deliveryStatusSlotText = `${this.deliveryStatusObj[item.deliveryStatus]}`
        })
        this.aggregateRecord = data.data.aggregateRecord
      }
      this.tableData = data.data ? data.data.records : []
      this.page.total = data.data ? data.data.total : 0
      this.imageData = ""
      this.pdfData = ""
    },
    changeMenu() {
      if (["TOTAL"].includes(this.tabParam)) {
        this.searchForm.deliveryStatus = undefined
      } else {
        this.searchForm.deliveryStatus = [this.tabParam]
      }

      this.getList()
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
        Object.keys(this.searchForm).forEach((key) => {
          if (this.searchForm[key]) {
            par += "&" + key + "=" + this.searchForm[key]
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
    },
    // 撤销发货
    handleCancelShipment() {
      if (!this.selectRows || this.selectRows.length === 0) {
        this.$message.error("请勾选数据")
        return
      }
      this.$refs.cancelShipmentDialogRef.openDialog(this.selectRows)
    },
    updateList() {
      this.getList(this.page, {})
    },
    handleImportModifyUnitPrice(type) {
      this.modifyPriceType = type
      this.$refs.commonImport.syncFn()
    },
    // 下载错误文件
    async exportDangerExcel() {
      downloadFileByUrl(this.errorFileUrl, "异常文件.xlsx")
    },
    // 导入数据
    async importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImport.openFullScreen()
      let formData = new FormData()
      formData.append("file", file.raw)
      const { data } =
        this.modifyPriceType === 1 ? await checkModifyOrderPrice(formData) : await checkModifyOrderPriceV2(formData)

      if (data.data.errorFileUrl) {
        this.excelDangerStatus = true
        this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
        this.errorFileUrl = data.data.errorFileUrl
        return
      }
      this.excelDangerStatus = false
      const res = await modifyOrderPrice(data.data.successDataList)

      if (res.data.code === 0) {
        this.$message.success("导入成功")
        this.$refs.commonImport.syncFn()
      } else {
        this.$message.error("导入失败")
        this.$refs.commonImport.syncFn()
      }
      this.$refs.commonImport.closeFullScreen()
    },
    // 下载模板
    async customDownload() {
      const { data } = await downloadTemplate({
        templateName: "订单以及发货单价格修改模板.xlsx"
      })
      downloadBlob(data, "订单以及发货单价格修改模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    // 获取所有站点
    async getSitAll() {
      const { data } = await getSitInfo()
      if (data.code === 0) {
        this.marketOption = this.sortArray(data.data, "sitName")
      }
    },
    // 获取店铺
    async getStoreList(platformCode = []) {
      const { data } = await getStore(platformCode)
      this.storeOptions = this.sortArray(
        data.filter((item) => item.state === "0"),
        "storeAccount"
      )
    },
    // 根据站点获取店铺
    async getStoreBySit(marketId) {
      let ids = []
      marketId.forEach((item) => {
        ids.push(this.marketOption.find((s) => s.sitName === item).bsePlatformSitId)
      })
      const { data } = await getStoreBySitIds(ids)
      if (data.code === 0) {
        this.storeOptions = this.sortArray(data.data, "storeAccount")
      }
    },
    // 批量导入跟踪号
    handleBatchImportTrackingNumber() {
      this.$refs.newCommonImport.syncFn({
        downloadParams: { templateName: "" },
        uploadParams: { templateName: "" }
      })
    },
    // 导入成功才有的回调
    importExcel(file) {
      this.updateList()
    },
    // 排序
    sortArray(arr, field) {
      return arr.sort((a, b) => {
        const nameA = a[field].toUpperCase() // 忽略大小写
        const nameB = b[field].toUpperCase() // 忽略大小写
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    },
    updateDate() {
      this.clearSelectClear()
      this.refreshChange()
    },
    downloadInvoiceTemplate(item) {
      this.$refs.batchUploadFileRef.openDialog(item)
    },
    updateField(obj) {
      let timeObj = {}

      Object.assign(this.searchForm, obj, timeObj)
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.property === "orderCode") {
          sums[index] = "总计："
        } else if (column.property === "totalAmount") {
          sums[index] = this.aggregateRecord.totalAmount
        }
      })
      return sums
    },

    //选中平台操作获取该平台下的站点
    changePlatform(val) {
      this.searchForm.site = []
      this.searchForm.shopId = []
      if (val && val.length) {
        if (!this.searchForm.platform?.length) return
        this.getPlatformSit(this.searchForm.platform)
        // 根据平台获取店铺
        this.getStoreList(this.searchForm.platform)
      }
    },
    // 站点下拉回调
    changeSit(val) {
      this.searchForm.shopId = []
      if (val && val.length) {
        if (!this.searchForm.site?.length) return
        this.getStoreBySit(this.searchForm.site)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#invoiceManage {
  .label-search {
    display: flex;
    align-items: center;

    .operate {
      display: flex;
      align-items: center;
    }
  }

  ::v-deep .avue-crud__menu {
    margin-bottom: 3px;
  }

  a {
    text-decoration: none;
  }

  ::v-deep .isAbnormalFlag {
    background: rgba(244, 201, 51, 0.1);
  }

  ::v-deep .isFreezeFlag {
    background: #fbc4c4;
  }

  #orderManage-dialog {
    ::v-deep .el-input-number {
      width: 100%;
    }

    ::v-deep .el-date-editor {
      width: 100%;
    }
  }
  .search-btn-box {
    .el-button {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
}
.el-checkbox {
  flex: 1 1 120px;
}
</style>
