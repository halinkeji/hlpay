<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-xl">
        <div class="row q-col-gutter-sm q-mt-sm">
          <div class="col-12 col-md-2">
            <q-input outlined dense label="产生订单开始时间" v-model="startTime" readonly>
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
            <q-input outlined dense label="产生订单结束时间" v-model="endTime" readonly>
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
          <div class="col-12 col-md-2">
            <q-input outlined dense label="商户请求支付开始时间" v-model="mch_request_start_time" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="mch_request_start_time" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="mch_request_start_time" @click="mch_request_start_time = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="mch_request_start_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
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
            <q-input outlined dense label="商户请求支付结束时间" v-model="mch_request_end_time" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="mch_request_end_time" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="mch_request_end_time" @click="mch_request_end_time = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="mch_request_end_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
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
            <q-input outlined dense label="支付渠道发起支付请求开始时间" v-model="channel_request_start_time" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="channel_request_start_time" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="channel_request_start_time" @click="channel_request_start_time = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="channel_request_start_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
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
            <q-input outlined dense label="支付渠道发起支付请求结束时间" v-model="channel_request_end_time" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="channel_request_end_time" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="channel_request_end_time" @click="channel_request_end_time = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="channel_request_end_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
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
            <q-input outlined dense label="支付渠道响应支付请求开始时间" v-model="channel_response_start_time" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="channel_response_start_time" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="channel_response_start_time" @click="channel_response_start_time = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="channel_response_start_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
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
            <q-input outlined dense label="支付渠道响应支付请求结束时间" v-model="channel_response_end_time" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="channel_response_end_time" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="channel_response_end_time" @click="channel_response_end_time = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="channel_response_end_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
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
            <q-input outlined dense label="商户支付请求响应开始时间" v-model="mch_resp_start_time" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="mch_resp_start_time" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="mch_resp_start_time" @click="mch_resp_start_time = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="mch_resp_start_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
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
            <q-input outlined dense label="商户支付请求响应结束时间" v-model="mch_resp_end_time" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="mch_resp_end_time" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="mch_resp_end_time" @click="mch_resp_end_time = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="mch_resp_end_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mt-xs">
          <div class="col-12 col-md-2">
            <q-input label="请输入商户订单号|渠道订单号" clearable outlined v-model="searchFrom.order_no" dense />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              clearable
              :options="[
                { label: '支付', value: '1' },
                { label: '退款', value: '2' },
              ]"
              v-model="searchFrom.order_type"
              dense
              label="订单类型"
            />
          </div>
          <div class="q-gutter-sm">
            <q-btn @click="getList()" color="primary" unelevated label="搜索" />
            <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />

            <q-btn @click="exportBut()" color="red" unelevated label="导出" />
          </div>
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
      <view-details ref="detailsRef" />
    </div>
  </q-page>
</template>
<script>
import AgOperator from './AgOperator'
import ViewDetails from './ViewDetails.vue'
export default {
  name: 'orderManage',
  components: {
    AgOperator,
    ViewDetails
  },
  data () {
    return {
      isPoppupStatus: false,
      context: null,
      components: {},
      gridOptions: {},
      orderListData: [],
      state: '',
      columnDefs: [
        {
          headerName: '支付订单',
          field: 'mch_order_no',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '订单类型',
          field: 'order_type',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.order_type) == 1) {
              return '支付'
            }
            if (parseInt(p.data.order_type) == 2) {
              return '退款'
            }
          }
        },
        {
          headerName: '渠道订单号',
          field: 'channel_order_no',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.order_type) == 1) {
              return p.data.pay_channel_order_no
            }
            if (parseInt(p.data.order_type) == 2) {
              return p.data.refund_channel_order_no
            }
          }

        },

        {
          headerName: '产生订单时间',
          field: 'created_at',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.created_at)) {
              return this.$q_date.formatDate(parseInt(p.data.created_at), 'YYYY-MM-DD HH:mm:ss')
            }
            return ''
          }
        },
        {
          headerName: '商户支付请求时间',
          field: 'mch_request_time',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.mch_request_time)) {
              return this.$q_date.formatDate(parseInt(p.data.mch_request_time), 'YYYY-MM-DD HH:mm:ss')
            }
            return ''
          }
        },
        {
          headerName: '支付渠道发起支付请求时间',
          field: 'channel_request_time',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.channel_request_time)) {
              return this.$q_date.formatDate(parseInt(p.data.channel_request_time), 'YYYY-MM-DD HH:mm:ss')
            }
            return ''
          }
        },
        {
          headerName: '支付渠道响应支付请求时间',
          field: 'channel_response_time',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.channel_response_time)) {
              return this.$q_date.formatDate(parseInt(p.data.channel_response_time), 'YYYY-MM-DD HH:mm:ss')
            }
            return ''
          }
        },
        {
          headerName: '商户支付请求响应时间',
          field: 'mch_resp_time',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.mch_resp_time)) {
              return this.$q_date.formatDate(parseInt(p.data.mch_resp_time), 'YYYY-MM-DD HH:mm:ss')
            }
            return ''
          }
        },
        {
          headerName: '操作',
          field: 'created_at',
          cellRendererFramework: 'AgOperator',
          width: this.nowpx(0.2) + 'px'
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

      searchFrom: {
        order_no: '',
        order_type: '',
        startTime: '',
        endTime: '',
        mch_request_start_time: '',
        mch_request_end_time: '',
        channel_request_start_time: '',
        channel_request_end_time: '',
        channel_response_start_time: '',
        channel_response_end_time: '',
        mch_resp_start_time: '',
        mch_resp_end_time: ''

      },
      mch_request_start_time: '',
      mch_request_end_time: '',
      channel_request_start_time: '',
      channel_request_end_time: '',
      channel_response_start_time: '',
      channel_response_end_time: '',
      mch_resp_start_time: '',
      mch_resp_end_time: ''

    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.isPoppupStatus = false
      if (this.startTime) {
        this.searchFrom.startTime = this.$q_date.formatDate(this.startTime, 'x')
      }
      if (this.endTime) {
        this.searchFrom.endTime = this.$q_date.formatDate(this.endTime, 'x')
      }

      if (this.mch_request_start_time) {
        this.searchFrom.mch_request_start_time = this.$q_date.formatDate(this.mch_request_start_time, 'x')
      }
      if (this.mch_request_end_time) {
        this.searchFrom.mch_request_end_time = this.$q_date.formatDate(this.mch_request_end_time, 'x')
      }

      if (this.channel_request_start_time) {
        this.searchFrom.channel_request_start_time = this.$q_date.formatDate(this.channel_request_start_time, 'x')
      }
      if (this.channel_request_end_time) {
        this.searchFrom.channel_request_end_time = this.$q_date.formatDate(this.channel_request_end_time, 'x')
      }

      if (this.channel_response_start_time) {
        this.searchFrom.channel_response_start_time = this.$q_date.formatDate(this.channel_response_start_time, 'x')
      }
      if (this.channel_response_end_time) {
        this.searchFrom.channel_response_end_time = this.$q_date.formatDate(this.channel_response_end_time, 'x')
      }

      if (this.mch_resp_start_time) {
        this.searchFrom.mch_resp_start_time = this.$q_date.formatDate(this.mch_resp_start_time, 'x')
      }
      if (this.mch_resp_end_time) {
        this.searchFrom.mch_resp_end_time = this.$q_date.formatDate(this.mch_resp_end_time, 'x')
      }

      const obj = {
        ...this.searchFrom,
        state: this.state,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('snapshot/getListData', obj)
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
        startTime: '',
        order_type: '',
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
        params.api.sizeColumnsToFit()
      }
    },
    viewOrderDetail (id) {
      this.$nextTick(() => {
        this.$refs.detailsRef.getViewData(id)
      })
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
