<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
      <div class="row q-gutter-x-sm">
        <div class="col-12 col-md-3">
           <q-input  clearable label="可搜索:分账账号名称/分账接收账号/分账接收账号名称" outlined v-model="searchQuery" dense />
        </div>
        <div class="col-12 col-md-3">
           <q-input  clearable label="可搜索:服务商户号/商户号" outlined v-model="searchId" dense />
        </div>
        <q-btn @click="getList()" color="primary" unelevated label="搜索" />
        <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
        <q-btn @click="editReceivers" color="primary" unelevated label="新增" v-if="authorityMeta('get-add')" />
      </div>
    </div>
    <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
       <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="receiversList"
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
    <div class="col-shrink bg-white q-pb-md q-mt-xs">
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
    <allot-receivers-edit ref="receiversFormRef" @closeDialog="closeDialog" v-if="receiversDialogStatus" />
  </div>
</template>
<script>
import { LocalStorage } from 'quasar'
import Operator from './Operator'
import AgMode from './AgMode'
import AllotReceiversEdit from './Edit.vue'
export default {
  name: 'AllotReceivers',
  components: {
    AllotReceiversEdit,
    Operator,
    AgMode
  },
  data () {
    return {
      columnDefs: [

        {
          headerName: '分账账号名称',
          field: 'name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '分组',
          field: 'type.name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '分账接收账号类型',
          field: 'receiver_type',
          width: this.nowpx(0.1) + 'px',
          valueGetter (p) {
            if (parseInt(p.data.receiver_type) == 1) {
              return '对公'
            } else {
              return '对私'
            }
          }
        },

        {
          headerName: '分账接收账号',
          field: 'receiver_id',
          width: this.nowpx(0.1) + 'px'
        },
        {

          headerName: '分账接收账号名称',
          field: 'receiver_name',
          width: this.nowpx(0.1) + 'px'
        },
        {

          headerName: '分账关系类型',
          field: 'relation_type',
          valueGetter: this.relationTypeText,
          width: this.nowpx(0.1) + 'px'
        },

        {

          headerName: '分账比例(%)',
          field: 'allot_receiver_profit',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '状态',
          field: 'state',
          valueGetter (p) {
            if (parseInt(p.data.state) == 1) {
              return '正常分账'
            } else {
              return '暂停分账'
            }
          },
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgMode'
        },

        {
          headerName: '服务商',
          field: 'isv.isv_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '服务商户号',
          field: 'isv_id'
        },
        {
          headerName: '商户',
          field: 'mch.mch_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商户号',
          field: 'mch_id',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '操作',
          field: 'id',
          pinned: 'right',
          cellRendererFramework: 'Operator',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      dialogShow: false,
      type: '',
      receiversList: [],
      payCodeObject: {},

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      isvId: '',
      payCode: '',
      receiversDialogStatus: false,
      context: '',
      localeText: this.$ag_grid_localeText,
      gridOptions: {},
      relationTypeObject: {},
      searchQuery: '',
      searchId: ''
    }
  },
  created () {
    if (LocalStorage.getItem('hlpay_enum_local')) {
      const enumAllData = LocalStorage.getItem('hlpay_enum_local')
      this.relationTypeObject = enumAllData && enumAllData.relationTypeObject ? enumAllData.relationTypeObject : []
    }

    this.context = this
  },
  mounted () {
    this.init()
  },
  computed: {},
  methods: {
    init () {
      this.dialogShow = true
      this.$nextTick(() => {
        this.getList()
      })
    },

    getList () {
      this.$store
        .dispatch('allot/getReceiversListData', {
          searchQuery: this.searchQuery,
          searchId: this.searchId,
          pSize: this.page.pSize,
          page: this.page.pageIndex
        })
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.receiversList = res.data && res.data.list ? res.data.list : []
              this.page.totalCount = res.data && res.data.page ? res.data.page.totalCount : 0
            }
          }
        })
    },

    editReceivers (receiversId) {
      this.receiversDialogStatus = true
      this.$nextTick(() => {
        this.$refs.receiversFormRef.init(receiversId)
      })
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit()
      }
    },

    closeDialog () {
      this.receiversDialogStatus = false
      this.$nextTick(() => {
        this.getList()
      })
    },
    relationTypeText (p) {
      if (p.data && p.data.relation_type) {
        return this.relationTypeObject[p.data.relation_type] + (p.data.relation_type_name ? '/' + p.data.relation_type_name : '')
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearnBut () {
      this.searchQuery = ''
      this.searchId = ''

      this.$nextTick(() => {
        this.getList()
      })
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
