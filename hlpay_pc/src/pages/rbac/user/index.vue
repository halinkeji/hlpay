<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-my-sm q-gutter-x-sm">
          <div class="col-12 col-md-3 ">
            <q-input  label="姓名/电话" outlined v-model="searchData.userName" dense />
          </div>

          <div class="col-12 col-md-3">
            <q-select
            option-value="code"
            option-label="name"
            emit-value
            map-options
            dense
            outlined
            v-model="searchData.statusIndex"
            :options="statusList"
            label="选择状态"
          />
          </div>

          <q-btn @click="getUserList" color="primary" unelevated  label="搜索" />
          <q-btn @click="resetSearch" color="warning"  unelevated  label="重置" />
          <q-btn @click="addOrUpdate()" color="primary" v-if="authorityMeta('add')"  unelevated label="新增" />
        </div>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
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
          :gridOptions="gridOptions"
          @first-data-rendered="onFirstDataRendered"
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

    <tab-user-edit @saveChanges="getUserList" :applyId="applyId" :storeId="$route.query.storeId" ref="userEditStatusRef" v-if="userEditStatus"></tab-user-edit>
    <bind-member ref="bindMobileRef" @closeDialog="bindMobileStatus = false" v-if="bindMobileStatus" />
  </q-page>
</template>

<script>
import AgStatus from './components/AgStatus'
import AgEdit from './components/AgEdit'
import TabUserEdit from './Edit'
import BindMember from './components/BindMember'
export default {
  components: {
    AgStatus,
    AgEdit,
    TabUserEdit,
    BindMember
  },
  props: ['storeId', 'applyId'],
  data () {
    return {
      userDataList: [],
      searchData: {
        userName: '',
        statusIndex: ''
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
          headerName: '用户名',
          field: 'username',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '手机号',
          field: 'mobile',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '绑定角色',
          valueGetter: (p) => {
            return p.data.roleName ? p.data.roleName : '未绑定'
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '状态',
          cellRendererFramework: 'AgStatus',
          width: this.nowpx(0.1) + 'px'
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
        AgStatus,
        AgEdit
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      userEditStatus: false,
      bindMobileStatus: false
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
    addOrUpdate (id) {
      this.userEditStatus = true

      setTimeout(() => {
        this.$refs.userEditStatusRef.init(id)
      }, 500)
    },
    bindMobileMember (id) {
      this.bindMobileStatus = true

      this.$nextTick(() => {
        this.$refs.bindMobileRef.init(id)
      })
    },

    // 获取用户信息
    getUserList () {
      this.userEditStatus = false
      const payload = {
        ...this.page,
        ...this.searchData
      }
      this.$store
        .dispatch('user/getUserList', payload)
        .then((res) => {
          this.userDataList = res.data.list ? res.data.list : []
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

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getUserList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getUserList()
    },
    resetSearch () {
      this.searchData = {
        userName: '',
        statusIndex: ''
      }
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
