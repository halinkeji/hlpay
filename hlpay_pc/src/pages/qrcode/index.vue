<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-x-sm q-mt-sm">
          <div class="col-12 col-md-2">
            <q-input label="请输入模板名称|欢迎语" outlined v-model="searchQuery" dense />
          </div>

          <q-btn @click="getList()" color="primary" unelevated label="搜索" />
          <q-btn @click="clearnButton()" color="warning" unelevated label="重置" />
          <q-btn @click="addTemplateData(0)" color="primary"  v-if="authorityMeta('add')" unelevated label="新增" />
        </div>
      </div>
      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-2" v-for="(item, key) in qrcodeTemplateList">
            <q-card bordered flat class="q-px-sm">
              <q-item>
                <q-item-section avatar>
                  <q-avatar v-if="item.logo" rounded>
                    <img :src="item.logo" />
                  </q-avatar>
                  <q-avatar v-else color="grey-4" rounded>
                    <q-icon name="las la-image" size="20px"></q-icon>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>{{ item.title }}</q-item-label>
                </q-item-section>
              </q-item>

              <img :src="item.base64_url" style="max-height: 390px" />

              <q-card-actions align="center">
                <q-btn flat dense icon="las la-edit" v-if="authorityMeta('edit')" @click="addTemplateData(item.id)" color="primary" label="修改">
                  <q-tooltip> 修改 </q-tooltip>
                </q-btn>
                <q-btn flat dense icon="las la-trash-alt"  v-if="authorityMeta('del')"  @click="deteleTemplate(item)" color="negative" label="删除">
                  <q-tooltip> 删除 </q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[12, 24, 36]"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>

      <add-qrcode-template v-if="qrcodeTemplateDialog" @getMethods="getList" ref="qrcodeTemplateRef" />
    </div>
  </q-page>
</template>
<script>
import AddQrcodeTemplate from './AddQrcodeTemplate'
export default {
  name: 'qrcodeTemplate',
  components: {
    AddQrcodeTemplate
  },
  data () {
    return {
      gridOptions: {},
      qrcodeTemplateList: [],

      page: {
        pageIndex: 1,
        pSize: 12,
        totalCount: 0
      },
      dataListSelections: [],
      qrcodeTemplateDialog: false,
      searchQuery: ''
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
      this.qrcodeTemplateDialog = false
      const obj = {
        searchQuery: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('qrcode/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.qrcodeTemplateList = res.data ? res.data.list : []
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
    addTemplateData (id) {
      this.qrcodeTemplateDialog = true
      this.$nextTick(() => {
        this.$refs.qrcodeTemplateRef.getItem(id)
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
    deteleTemplate (item) {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除名称为 ${item.name} 的模板吗`,
          cancel: true
        })
        .onOk(() => {
          this.$store.dispatch('qrcode/delData', item.id).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '成功',
                caption: '删除成功！'
              })
              this.getList()
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: res.message,
                color: 'red'
              })
            }
          })
        })
    },

    clearnButton () {
      this.searchQuery = ''
      this.getList()
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
