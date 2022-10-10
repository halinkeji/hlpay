<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-xs q-mt-sm">
          <div class="col-12 col-md-2 ">
            <q-input label="请输入支付订单号|渠道订单号" clearable outlined v-model="searchFrom.order_no" dense />
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
        class="ag-theme-balham ag-grid-table allot-order-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="orderListData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :components="components"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
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
    </div>
  </q-page>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'orderManage',
  components: {

  },
  data () {
    return {
      context: null,
      components: {},
      gridOptions: {},
      orderListData: [],
      state: '',
      columnDefs: [
        {
          headerName: '支付订单号',
          field: 'pay_order_no',
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order-allot': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '商户号',
          field: 'mch_id',
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order-allot': function (p) {
              if (p.value) {
                return true
              }
            }
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
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order-allot': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '分账接收账号',
          field: 'receiver_id',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '接收账号名称',
          field: 'receiver_name',
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '分账比例（%）',
          field: 'allot_receiver_profit',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '分账金额（¥）',
          field: 'calculate_allot_receiver_amount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if (p.data && p.data.calculate_allot_receiver_amount) {
              return this.formatAmount(p.data.calculate_allot_receiver_amount / 100)
            }
            return p.data.calculate_allot_receiver_amount
          }
        },

        {
          headerName: '支付渠道分账批次号',
          field: 'batch_order_id',
          width: this.nowpx(0.2) + 'px'
        }

      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',

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
      refundOrderStatus: false,

      searchFrom: {
        order_no: '',
        pay_code: '',
        way_code: '',
        startTime: '',
        endTime: ''
      },
      paymentChannel: [],
      wayCodeData: [],
      startTime: '',
      endTime: ''
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
    refundOrder (id) {
      this.refundOrderStatus = true
      this.$nextTick(() => {
        this.$refs.refundOrderRef.init(id)
      })
    },

    getList () {
      this.orderDetailStatus = false
      this.refundOrderStatus = false
      if (this.startTime) {
        this.searchFrom.startTime = this.$q_date.formatDate(this.startTime, 'x')
      }
      if (this.endTime) {
        this.searchFrom.endTime = this.$q_date.formatDate(this.endTime, 'x')
      }

      const obj = {
        ...this.searchFrom,
        state: this.state,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('allot/getRecordList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.orderListData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
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
        way_code: '',
        startTime: '',
        endTime: ''
      }
      this.startTime = ''
      this.endTime = ''
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
    },
    rowSpan (params) {
      const fields = ['pay_order_no', 'mch_id', 'pay_code']
      const data = this.orderListData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    }
  }
}
</script>
<style>
.allot-order-table .cell-span-order-allot {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
