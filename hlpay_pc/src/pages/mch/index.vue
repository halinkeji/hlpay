<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">

          <div class="row q-gutter-sm items-center q-mt-sm">
            <div class="col-12 col-md-3">
              <q-input
              clearable
              label="请输入商户编号、名称、简称、联系人、联系电话、联系邮箱"
              outlined
              v-model="searchQuery"
              dense
            />
            </div>

            <div class="col-12 col-md-2">
              <q-select outlined label="状态" v-model="state" :options="stateOptions" dense emit-value map-options></q-select>
            </div>
            <!-- <div class="col-12 col-md-2">
              <q-select outlined label="应用关联状态" v-model="relationState" :options="relationStateOptions" dense emit-value map-options></q-select>
            </div> -->

            <div class="col-12 col-md-2">
              <q-select
                outlined
                label="关联应用"
                v-model="mchInfoFrom.relation_apply_id"
                :options="applyOptionsData"
                dense
                emit-value
                map-options
                option-value="apply_id"
                option-label="client_name"
              >
              </q-select>
            </div>
            <div class="col-12 col-md-2">
              <q-select
                outlined
                label="关联商户"
                v-model="mchInfoFrom.relation_store_id"
                :options="storeOptionsData"
                dense
                emit-value
                map-options
                option-value="id"
                option-label="name"
              >
              </q-select>
            </div>

            <q-btn @click="getList()" color="primary" unelevated label="搜索" />
            <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
            <q-btn @click="addNewData" color="primary" unelevated label="新增" v-if="authorityMeta('add')" />
            <q-btn :disable="dataListSelections.length > 0 ? false : true" @click="delAll()"  v-if="authorityMeta('alldel')" color="red" unelevated label="批量删除" />
          </div>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="mchListData"
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
          @rowSelected="rowSelectedAg"
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
      <add-mch ref="addIsvRef" @closeDialog="closeDialog" v-if="isPoppupStatus" />

      <bind-store ref="bindStoreRef" @closeDialog="closeDialog" v-if="bindStoreStatus" />
      <channel-list ref="channelListRef" @closeDialog="closeDialog" v-if="channelListStatus" />
      <link-config ref="linkConfigRef" @closeDialog="closeDialog" v-if="linkConfigStatus" />
    </div>
  </q-page>
</template>
<script>
import AddMch from './AddMch.vue'
import AgOperator from './AgOperator'
import AgMode from './AgMode'
import AgRelationMode from './AgRelationMode'

import BindStore from './BindStore.vue'
import ChannelList from './ChannelList.vue'
import LinkConfig from './LinkConfig.vue'
export default {
  name: 'serviceManage',
  components: {
    AddMch,
    AgMode,
    AgOperator,
    AgRelationMode,

    BindStore,
    ChannelList,
    LinkConfig
  },
  data () {
    return {
      isPoppupStatus: false,
      context: null,
      components: {},
      gridOptions: {},
      mchListData: [],
      state: '',
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.02) + 'px'
        },
        {
          headerName: '服务商',
          field: 'isv.isv_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商户编号',
          field: 'mch_id',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商户名称',
          field: 'mch_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商户简称',
          field: 'mch_short_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '类型',
          field: 'type',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.type) == 1) {
              return '普通商户'
            }
            if (parseInt(p.data.type) == 2) {
              return '特约商户(服务商模式)'
            }
          }
        },

        {
          headerName: '关联应用',
          field: 'relationData.apply.client_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '关联门店',
          field: 'relationData.store.name',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '联系人',
          field: 'contact_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '联系电话',
          field: 'contact_tel',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '联系邮箱',
          field: 'contact_email',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: 'app id',
          field: 'app_id',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: 'app 私钥',
          field: 'app_secrect',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '状态',
          field: 'state',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgMode'
        },

        {
          headerName: '操作',
          field: 'created_at',
          cellRendererFramework: 'AgOperator',
          width: this.nowpx(0.2) + 'px',
          pinned: 'right'

        }
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },

      dataListSelections: [],
      stateOptions: [
        { label: '正常', value: '1' },
        { label: '停用', value: '2' }
      ],
      relationState: '',
      relationStateOptions: [
        { label: '是', value: '1' },
        { label: '否', value: '0' }
      ],
      payConfigPoppupStatus: false,

      bindStoreStatus: false,
      channelListStatus: false,
      linkConfigStatus: false,

      applyOptionsData: [],
      storeOptionsData: [],

      mchInfoFrom: {

        relation_store_id: '',
        relation_apply_id: ''
      }
    }
  },
  mounted () {
    this.getList()
    this.context = this
  },
  computed: {},
  created () {
    this.getApplyData()
    this.getStoreData()
  },
  methods: {
    setPayConfig (type, relatedId, isvId) {
      this.channelListStatus = true
      this.$nextTick(() => {
        this.$refs.channelListRef.init(type, relatedId, isvId)
      })
    },

    setBindStore (mch_id, isv_id, mch_name, app_id, app_secrect) {
      this.bindStoreStatus = true
      this.$nextTick(() => {
        this.$refs.bindStoreRef.init(mch_id, isv_id, mch_name, app_id, app_secrect)
      })
    },

    setHardwareLink (relatedId) {
      this.linkConfigStatus = true
      this.$nextTick(() => {
        this.$refs.linkConfigRef.init(relatedId)
      })
    },

    getApplyData () {
      this.$store
        .dispatch('mch/getApplyData')
        .then((res) => {
          if (res.code == 200) {
            this.applyOptionsData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    getStoreData () {
      this.$store
        .dispatch('mch/getStoreData')
        .then((res) => {
          if (res.code == 200) {
            this.storeOptionsData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    getList () {
      this.isPoppupStatus = false
      const obj = {
        ...this.mchInfoFrom,
        isv_id: this.$route.query.isv_id,
        searchQuery: this.searchQuery,
        state: this.state,
        // relationState: this.relationState,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('mch/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.mchListData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    addNewData (id) {
      this.isPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addIsvRef.init(id)
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条商户信息吗？`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('mch/deleteData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
      }
    },
    clearnBut () {
      this.searchQuery = ''
      this.state = ''
      this.relationState = ''

      this.mchInfoFrom = {
        relation_store_id: '',
        relation_apply_id: ''
      }
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

    closeDialog () {
      this.channelListStatus = false
      this.linkConfigStatus = false
      this.bindStoreStatus = false
      this.payConfigPoppupStatus = false
      this.isPoppupStatus = true
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
