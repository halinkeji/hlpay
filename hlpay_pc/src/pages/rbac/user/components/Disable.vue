<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row  q-gutter-x-sm">
        <q-input class="col-12 col-md-2 q-mt-sm" label="姓名/电话" outlined v-model="searchData.userName" dense />
        <q-btn @click="getUserList" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated v-if="authorityMeta('search')" label="搜索" />
        <q-btn @click="resetSearch" color="warning" class=" col-12 col-md-1 q-mt-sm" unelevated v-if="authorityMeta('reset')" label="重置" />
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="userDataList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :components="componentsAg"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          :gridOptions="gridOptions"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
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
        >
        </hl-pagination>
      </div>
    </div>

    <tab-user-edit @saveChanges="getUserList" ref="userEditStatusRef" v-if="userEditStatus"></tab-user-edit>
  </q-page>
</template>

<script>
import AgStatus from '../components/AgStatus.vue'
import AgEdit from '../components/AgEdit'
import TabUserEdit from '../Edit'
export default {
  components: {
    AgStatus,
    AgEdit,
    TabUserEdit
  },

  data () {
    return {
      userDataList: [],
      searchData: {
        userName: '',
        statusIndex: -1
      },
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
          headerName: '用户名',
          field: 'username'
        },

        {
          headerName: '手机号',
          field: 'mobile'
        },

        {
          headerName: '更新时间',
          field: 'updated_at',
          valueGetter: this.agValueTime
        },
        {
          headerName: '操作',
          field: 'mobile',
          cellRendererFramework: 'AgEdit'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      componentsAg: {
        AgStatus,
        AgEdit
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
    this.getUserList()
  },
  methods: {
    addOrUpdate (id) {
      this.userEditStatus = true

      setTimeout(() => {
        this.$refs.userEditStatusRef.init(id)
      }, 500)
    },
    // 获取用户信息
    getUserList () {
      const payload = {
        ...this.page,
        ...this.searchData
      }
      this.$store
        .dispatch('user/getUserList', payload)
        .then((res) => {
          this.userDataList = res.data.list
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
      params.api.sizeColumnsToFit()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getUserList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getUserList()
    },
    resetSearch () {
      this.searchData.userName = ''
      setTimeout(() => {
        this.getUserList()
      }, 100)
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
