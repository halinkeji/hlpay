<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
       <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-xs q-mt-sm">
          <div class="col-12 col-md-2 ">
            <q-input label="请输入退款订单号|支付订单号|商户退款号|渠道支付订单号" clearable outlined v-model="searchFrom.order_no" dense />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :options="paymentChannel"
              v-model="searchFrom.pay_code"
              dense
              clearable
              label="选择支付渠道"
            />
          </div>

          <div class="col-12 col-md-2">

            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :options="payRefundOrderStateArr"
              v-model="searchFrom.state"
              dense
              clearable
              label="状态"
            />
          </div>

          <div class="col-12 col-md-2">
            <q-input outlined dense label="开始时间" v-model="startTime" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="startTime" @click="startTime = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <q-input outlined dense label="结束时间" v-model="endTime" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="endTime" @click="endTime = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <q-btn @click="getList()" color="primary" unelevated label="搜索" />
          <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />

          <q-btn @click="exportBut()" color="red" unelevated label="导出" />
        </div>
      </div>
      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="orderListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
      <view-details v-if="orderDetailStatus" ref="detailsRef" />

    </div>
  </q-page>
</template>
<script>
import ViewDetails from './ViewDetails.vue'
import AgOperator from './AgOperator'
import { LocalStorage } from 'quasar'
export default {
  name: 'refund-order',
  components: {
    AgOperator,
    ViewDetails

  },
  data () {
    return {
      context: null,
      components: {},
      gridOptions: {},
      orderListData: [],

      columnDefs: [
        {
          headerName: '订单状态',
          field: 'state',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.payRefundOrderStateObject[p.data.state]
          }
        },
        {
          headerName: '商户退款单号',
          field: 'mch_refund_no',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '退款渠道订单号',
          field: 'channel_order_no',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '退款订单号',
          field: 'refund_order_id',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '支付订单号',
          field: 'pay_order_no',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '渠道支付订单号',
          field: 'channel_pay_order_no',
          width: this.nowpx(0.12) + 'px'
        },

        {
          headerName: '服务商号',
          field: 'isv_id',
          width: this.nowpx(0.12) + 'px'
        },

        {
          headerName: '商户号',
          field: 'mch_id',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '商户名称',
          field: 'mch_name',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '订单退款成功时间',
          field: 'success_time',
          width: this.nowpx(0.1) + 'px',
          valueGetter: this.timeFormatDate
        },

        {
          headerName: '类型',
          field: 'mch_type',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.mch_type) == 1) {
              return '普通商户'
            }
            if (parseInt(p.data.mch_type) == 2) {
              return '特约商户(服务商模式)'
            }
          }
        },
        {
          headerName: '支付金额（¥）',
          field: 'pay_amount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if (p.data && p.data.pay_amount) {
              return this.formatAmount(p.data.pay_amount / 100)
            }
            return p.data.pay_amount
          }
        },
        {
          headerName: '退款总金额（¥）',
          field: 'refund_amount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if (p.data && p.data.refund_amount) {
              return this.formatAmount(p.data.refund_amount / 100)
            }
            return p.data.refund_amount
          }
        },
        {
          headerName: '支付渠道标识',
          field: 'pay_code',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if (LocalStorage.getItem('hlpay_enum_local')) {
              const enumAllData = LocalStorage.getItem('hlpay_enum_local')
              const payCodeObject = enumAllData && enumAllData.payCodeObject ? enumAllData.payCodeObject : {}
              return payCodeObject[p.data.pay_code]
            }
          }
        },

        {
          headerName: '操作',
          field: 'created_at',
          cellRendererFramework: 'AgOperator',
          width: this.nowpx(0.15) + 'px',
          pinned: 'right'
        }
      ],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },

      stateOptions: [
        { label: '正常', value: '1' },
        { label: '停用', value: '2' }
      ],
      orderDetailStatus: false,
      refundStatus: false,

      searchFrom: {
        order_no: '',
        pay_code: '',
        startTime: '',
        endTime: '',
        state: ''
      },
      paymentChannel: [],
      wayCodeData: [],
      startTime: '',
      endTime: '',
      payRefundOrderStateObject: {},
      payRefundOrderStateArr: []
    }
  },
  mounted () {
    this.getList()
  },
  computed: {},
  created () {
    this.context = this
    const enumLocal = LocalStorage.getItem('hlpay_enum_local')
    if (enumLocal && enumLocal.payCodeArr) {
      this.paymentChannel = enumLocal.payCodeArr
    }

    if (enumLocal && enumLocal.wayCodeArr) {
      this.wayCodeData = enumLocal.wayCodeArr
      this.payRefundOrderStateObject = enumLocal.payRefundOrderStateObject
      this.payRefundOrderStateArr = enumLocal.payRefundOrderStateArr
    }
  },
  methods: {
    timeFormatDate (p) {
      if (parseInt(p.data.success_time)) {
        return this.$q_date.formatDate(parseInt(p.data.success_time), 'YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },
    viewOrderDetail (id) {
      this.orderDetailStatus = true
      this.$nextTick(() => {
        this.$refs.detailsRef.getViewData(id)
      })
    },

    getList () {
      this.orderDetailStatus = false
      if (this.startTime) {
        this.searchFrom.startTime = this.$q_date.formatDate(this.startTime, 'x')
      }
      if (this.endTime) {
        this.searchFrom.endTime = this.$q_date.formatDate(this.endTime, 'x')
      }
      const obj = {
        ...this.searchFrom,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('refundOrder/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.orderListData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },

    clearnBut () {
      this.searchFrom = {
        order_no: '',
        pay_code: '',
        state: '',
        startTime: '',
        endTime: ''
      }
      this.startTime = ''
      this.endTime = ''
      this.state = ''
      this.getList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit()
      }
    },
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-退款记录'
      })
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
