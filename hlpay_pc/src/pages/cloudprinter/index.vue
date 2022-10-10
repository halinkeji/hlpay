<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-x-sm q-mt-sm">
          <div class="col-12 col-md-2 ">
          <q-input  label="请输入打印机名称" outlined v-model="searchQuery" dense />
          </div>

          <q-btn @click="getList()" color="primary" unelevated  label="搜索" />
          <q-btn @click="clearBut" color="warning"  unelevated  label="重置" />
          <q-btn
            @click="openPrintEdit(0)"
            color="primary"
            unelevated
            v-if="authorityMeta('add')"
            label="新增"
          />
          <q-btn
            :disabled="dataListSelections.length > 0 ? false : true"
            @click="delAll()"
            color="red"
            unelevated
            v-if="authorityMeta('delAll')"
            label="批量删除"
          />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="printerListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="60"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
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
      <add-printer ref="printerEditRef" @closeDialog="closePrinterDialog" v-if="editPrintDialog" />
    </div>
  </q-page>
</template>

<script>
import Operating from './components/AgOperator'
import AgSwitch from './components/AgSwitch'
import AddPrinter from './components/AddPrinter'
export default {
  name: 'index',
  components: {
    Operating,
    AgSwitch,
    AddPrinter
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {
        Operating
      },
      dataListSelections: {},
      printerListData: [],
      columnDefs: [
        // 表格列数据
        {
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: ' 打印机名称',
          field: 'cp_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '类型', // 列标题
          field: 'cp_model', // 列与数据源对应的字段
          width: this.nowpx(0.25) + 'px',
          valueGetter: this.modelValue
        },
        {
          headerName: '属性', // 列标题
          field: 'cp_property', // 列与数据源对应的字段
          width: this.nowpx(0.25) + 'px',
          valueGetter: this.propertyValue
        },
        {
          headerName: '品牌', // 列标题
          field: 'cp_shared', // 列与数据源对应的字段
          width: this.nowpx(0.25) + 'px',
          valueGetter: this.sharedValue
        },
        {
          headerName: '状态',
          field: 'cp_status',
          cellRendererFramework: 'AgSwitch',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: ' 操作',
          cellRendererFramework: 'Operating',
          width: this.nowpx(0.25) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},
      printerId: '',

      searchQuery: '',
      selected: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      editPrintDialog: false
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
      const obj = {
        printerId: this.printerId,
        text: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('cloudprinter/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.printerListData = res.data ? res.data.list : []
            this.dataListSelections = {}
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    modelValue (p) {
      if (this.$store.state.cloudprinter.printerModlItem) {
        return this.$store.state.cloudprinter.printerModlItem[p.data.cp_model]
      }
    },
    propertyValue (p) {
      if (this.$store.state.cloudprinter.printerPropertyItem) {
        return this.$store.state.cloudprinter.printerPropertyItem[p.data.cp_property]
      }
    },
    sharedValue (p) {
      if (this.$store.state.cloudprinter.printerSharedItem) {
        return this.$store.state.cloudprinter.printerSharedItem[p.data.cp_shared]
      }
    },

    clearBut () {
      this.searchQuery = ''
      this.printerId = ''
      this.getList()
      this.dataListSelections = {}
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条打印机信息吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },

    openPrintEdit (id) {
      this.editPrintDialog = true
      this.$nextTick(() => {
        this.$refs.printerEditRef.init(id)
      })
    },

    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('cloudprinter/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条打印机信息'
            })
            this.getList()
            this.dataListSelections = {}
          }
        })
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
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
    closePrinterDialog () {
      this.editPrintDialog = false
      this.$nextTick(() => {
        this.getList()
      })
    }
  }
}
</script>

<style scoped></style>
