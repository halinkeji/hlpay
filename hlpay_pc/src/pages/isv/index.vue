<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-card flat class="q-pa-sm">
          <div class="row q-gutter-x-sm">
            <q-input
              clearable
              class="col-12 col-md-4"
              label="请输入服务商编号、名称、简称、联系人、联系电话、联系邮箱"
              outlined
              v-model="searchQuery"
              dense
            />
            <div class="col-12 col-md-2">
              <q-select outlined label="状态" v-model="state" :options="stateOptions" dense emit-value map-options></q-select>
            </div>
            <q-btn @click="getList()" color="primary" unelevated label="搜索" />
            <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
            <q-btn @click="addNewData" color="primary" unelevated label="新增" v-if="authorityMeta('add')" />
            <q-btn :disable="dataListSelections.length > 0 ? false : true" @click="delAll()" color="red" v-if="authorityMeta('alldel')" unelevated label="批量删除" />
          </div>
        </q-card>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="isvListData"
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
      <add-isv ref="addIsvRef" @closeDialog="closeDialog" v-if="isPoppupStatus" />

    <channel-list ref="channelListRef" @closeDialog="closeDialog" v-if="channelListStatus" />
    </div>
  </q-page>
</template>
<script>
import AddIsv from './AddIsv.vue'
import AgOperator from './AgOperator'
import AgMode from './AgMode'
import ChannelList from './ChannelList.vue'
export default {
  name: 'serviceManage',
  components: {
    AddIsv,
    AgMode,
    AgOperator,
    ChannelList
  },
  data () {
    return {
      isPoppupStatus: false,
      context: null,
      components: {},
      gridOptions: {},
      isvListData: [],
      state: '',
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '服务商编号',
          field: 'isv_id',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '服务商名称',
          field: 'isv_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '服务商简称',
          field: 'isv_short_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '联系人',
          field: 'contact_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '联系电话',
          field: 'contact_tel',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '联系邮箱',
          field: 'contact_email',
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
          width: this.nowpx(0.25) + 'px'
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
      payConfigPoppupStatus: false,
      channelListStatus: false
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    setPayConfig (type, relatedId) {
      this.channelListStatus = true
      this.$nextTick(() => {
        this.$refs.channelListRef.init(type, relatedId)
      })
    },

    getList () {
      this.isPoppupStatus = false
      const obj = {
        searchQuery: this.searchQuery,
        state: this.state,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('isv/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.isvListData = res.data ? res.data.list : []
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
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条服务商信息吗？`,
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
        this.$store.dispatch('isv/deleteData', obj).then((res) => {
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
      this.getList()
      this.dataListSelections = []
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

    closeDialog () {
      this.payConfigPoppupStatus = false
      this.isPoppupStatus = false
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
