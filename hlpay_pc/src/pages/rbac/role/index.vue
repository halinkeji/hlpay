<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-my-sm q-gutter-x-sm">
          <div class="col-12 col-md-3">
            <q-input label="名称" outlined v-model="searchData.name" dense />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              option-value="code"
              option-label="name"
              emit-value
              map-options
              dense
              outlined
              v-model="searchData.status"
              :options="statusList"
              label="选择状态"
            />
          </div>

          <q-btn @click="getRoleDataList" color="primary" unelevated label="搜索" />
          <q-btn @click="resetSearch" color="warning" unelevated label="重置" />
          <q-btn :to="{ name: 'roleEdit' }" color="primary" v-if="authorityMeta('add')" unelevated label="新增" />
        </div>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="roleDataList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :components="componentsAg"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          :gridOptions="gridOptions"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :singleClickEdit="true"
          :context="context"
          rowHeight="50"
        >
        </ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :total="page.pageTotal"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </hl-pagination>
      </div>
    </div>
  </q-page>
</template>

<script>
import AgEdit from './components/AgEdit'
import AgStatus from './components/AgStatus'
export default {
  components: {
    AgEdit,
    AgStatus
  },
  props: [],
  data () {
    return {
      roleDataList: [],
      searchData: {
        name: '',
        status: '',
        apply: ''
      },
      statusList: [
        {
          code: '1',
          name: '开启'
        },
        {
          code: '2',
          name: '关闭'
        }
      ],
      gridApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      columnDefs: [
        {
          headerName: '排序',
          field: 'sort',
          editable: true,
          onCellValueChanged: this.changeSort,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '名称',
          field: 'name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '状态',
          field: 'status',
          cellRendererFramework: 'AgStatus',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '更新时间',
          field: 'updated_at',
          valueGetter: this.agValueTime,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '操作',
          field: 'mobile',
          cellRendererFramework: 'AgEdit',
          width: this.nowpx(0.3) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      componentsAg: {
        AgEdit,
        AgStatus
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      userEditStatus: false
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {
    this.context = this
    this.gridApi = this.gridOptions.api
    this.getRoleDataList()
  },
  methods: {
    addOrUpdate (id) {
      this.userEditStatus = true

      setTimeout(() => {
        this.$refs.userEditStatusRef.init(id)
      }, 500)
    },
    // 排序并加限制
    changeSort (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      const sort = data.sort
      if (!regu.test(sort)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      const payload = {
        id: parseInt(data.id),
        sort: sort
      }
      this.$store.dispatch('role/updateRoleData', payload).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '修改排序成功',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          this.getRoleDataList()
        }
      })

      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
    },

    // 获取用户列表
    getRoleDataList () {
      this.userEditStatus = false
      const payload = {
        ...this.page,
        ...this.searchData
      }
      this.$store
        .dispatch('role/getRoleData', payload)
        .then((res) => {
          this.roleDataList = res.data.list ? res.data.list : []
          this.page.pageTotal = res.data.page.totalCount
        })
        .catch((error) => {})
    },
    agValueTime (p) {
      if (parseInt(p.data.updated_at)) {
        return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },

    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getRoleDataList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getRoleDataList()
    },
    resetSearch () {
      this.searchData = {
        name: '',
        status: '',
        apply: ''
      }
      setTimeout(() => {
        this.getRoleDataList()
      }, 100)
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
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
