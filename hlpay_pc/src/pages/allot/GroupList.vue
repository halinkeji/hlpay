<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll bg-grey-3">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
      <div class="row q-gutter-x-sm">
        <div class="col-12 col-md-2">
          <q-select outlined label="是否自动分账" v-model="flag" :options="stateOptions" dense emit-value map-options></q-select>
        </div>
        <q-btn @click="getList()" color="primary" unelevated label="搜索" />
        <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />

        <q-btn
          :disable="dataListSelections.length > 0 ? false : true"
          @click="delGroupList()"
          color="red"
          class="col-12 col-md-1"
          unelevated
          label="批量删除"
          v-if="authorityMeta('group-del')"
        />
        <q-btn @click="editGroupData" color="primary" v-if="authorityMeta('group-add')" unelevated label="新增" />
      </div>
    </div>
    <div class="col-shrink q-pa-sm full-height bg-white q-my-xs">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="allotGroupList"
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
    <allot-group-edit ref="allotGroupRef" @closeDialog="closeDialog" v-if="groupDialogStatus" />
  </div>
</template>
<script>
import AllotGroupEdit from './GroupEdit.vue'
import Operator from './AgOperator'
export default {
  name: 'ChannelList',
  components: {
    AllotGroupEdit,
    Operator
  },
  data () {
    return {
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.01) + 'px'
        },
        {
          headerName: '分组名称',
          field: 'name'
        },
        {
          headerName: '自动分账组',
          field: 'auto_allot_receiver_flag',
          valueGetter (p) {
            if (parseInt(p.data.auto_allot_receiver_flag) == 1) {
              return '开启'
            } else {
              return '关闭'
            }
          }
        },
        {
          headerName: '商户',
          field: 'mch.mch_name'
        },

        {
          headerName: '操作',
          field: 'id',
          cellRendererFramework: 'Operator'
        }
      ],
      localeText: this.$ag_grid_localeText,

      allotGroupList: [],
      groupDialogStatus: false,
      flag: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      stateOptions: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '2'
        }
      ],
      context: '',
      dataListSelections: []
    }
  },
  created () {},
  mounted () {
    this.init()
    this.context = this
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
        .dispatch('allot/getListData', {
          flag: this.flag,
          pSize: this.page.pSize,
          page: this.page.pageIndex
        })
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.allotGroupList = res.data && res.data.list ? res.data.list : []
              this.page.totalCount = res.data && res.data.page ? res.data.page.totalCount : 0
            }
          }
        })
    },

    updatePayConfig (channelId, filed, value) {
      const params = {}
      params.configId = channelId
      params[filed] = value
      this.$store.dispatch('isv/setPayConfig', params).then((res) => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.getList()
          })
        }
      })
    },
    editGroupData (groupId) {
      this.groupDialogStatus = true
      this.$nextTick(() => {
        this.$refs.allotGroupRef.init(groupId)
      })
    },
    closeDialog () {
      this.groupDialogStatus = false
      this.$nextTick(() => {
        this.getList()
      })
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    delGroupList () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除 "${this.dataListSelections.length}" 条分组吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteGroup(this.dataListSelections)
        })
        .onCancel(() => {})
    },

    deleteGroup (val) {
      this.$store
        .dispatch('allot/deteleGroup', val)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除分组成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '错误',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearnBut () {
      this.flag = ''
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
