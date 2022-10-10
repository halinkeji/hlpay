<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-x-sm q-mt-sm">
          <div class="col-12 col-md-2">
            <q-input label="请输入音箱名称" outlined v-model="searchQuery" dense />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="speakerStatus"
              :options="status"
              dense
              label="音箱状态"
            />
          </div>
          <q-btn @click="getList()" color="primary" unelevated label="搜索" />
          <q-btn @click="clearnButton()" color="warning" unelevated label="重置" />
          <q-btn @click="addSpeakerData(0)" color="primary" v-if="authorityMeta('add')" unelevated label="新增" />
          <q-btn
            :disabled="dataListSelections.length > 0 ? false : true"
            @click="delAll()"
            v-if="authorityMeta('delAll')"
            color="red"
            unelevated
            label="批量删除"
          />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="speakerList"
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
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
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
      <add-speaker v-if="isDialogStatus" @getMethods="getList" ref="addConfigRef"></add-speaker>
    </div>
  </q-page>
</template>
<script>
import AgOperator from './components/AgOperator'
import AgMode from './components/AgMode'
import AddSpeaker from './components/AddSpeaker'
export default {
  name: 'speaker',
  components: {
    AgOperator,
    AgMode,
    AddSpeaker
  },
  data () {
    return {
      speakerStatus: '',
      adType: '',
      status: [
        {
          value: 1,
          label: '开启'
        },
        {
          value: 2,
          label: '关闭'
        }
      ],
      isDialogStatus: false,
      context: null,
      components: {
        AgOperator,
        AgMode
      },
      gridOptions: {},
      speakerList: [],
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '音箱名称',
          field: 'psc_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: ' appKey',
          field: 'psc_app_key',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: ' appSecret',
          field: 'psc_app_secret',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: ' 设备码',
          field: 'psc_device_code',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: ' 品牌',
          field: 'psc_model',
          valueGetter: (p) => {
            if (p.data.psc_model == 'feiyu') {
              return '广州飞鱼云音箱'
            } else {
              return '其他'
            }
          },
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '状态',
          cellRendererFramework: 'AgMode',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: (p) => {
            if (parseInt(p.data.created_at)) {
              return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
            }
            return ''
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: ' 操作',
          cellRendererFramework: 'AgOperator',
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
      dataListSelections: []
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
      this.isDialogStatus = false
      const obj = {
        status: this.speakerStatus,
        nameParams: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('speaker/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.speakerList = res.data ? res.data.list : []
            this.dataListSelections = []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            caption: error.message,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    addSpeakerData (id) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addConfigRef.getItem(id)
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
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条音箱信息吗`,
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
        this.$store.dispatch('speaker/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条音箱'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
      }
    },
    clearnButton () {
      this.speakerStatus = ''
      this.searchQuery = ''
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
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
