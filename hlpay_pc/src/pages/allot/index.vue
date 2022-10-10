<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row">
      <q-tabs v-model="tab" inline-label outside-arrows mobile-arrows class="text-grey" active-color="primary" indicator-color="primary" dense>
        <q-tab name="allot" label="接收方" />
        <q-tab name="group" label="分组" v-if="authorityMeta('group')" />
      </q-tabs>
    </div>
    <div class="col-shrink full-height  " v-if="tab == 'allot'">
      <list />
    </div>
    <div class="col-shrink full-height  " v-if="tab == 'group'">
      <group-list />
    </div>
  </div>
</template>
<script>
import List from './List.vue'
import GroupList from './GroupList.vue'
export default {
  name: 'AllotReceivers',
  components: {
    GroupList,
    List
  },
  data () {
    return {
      tab: 'allot'
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (mchId, isvId, payCode) {
      this.dialogShow = true

      this.mchId = mchId
      this.isvId = isvId
      this.payCode = payCode

      this.$nextTick(() => {
        this.getList()
      })
    },

    getList () {
      this.$store
        .dispatch('allot/getReceiversListData', {
          mch_id: this.mchId,
          pay_code: this.payCode,
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

    delPayChannel (data) {
      this.$q
        .dialog({
          title: '确认删除',
          message: '确认删除支付渠道名称为' + data.name + '的信息吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$store
            .dispatch('isv/delPayChannel', {
              configId: data.id
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除成功！',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$nextTick(() => {
                  this.getList()
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '删除失败！',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              }
            })
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
    },

    editReceivers (mechId, isvId, type) {
      this.receiversDialogStatus = true
      this.$nextTick(() => {
        this.$refs.receiversFormRef.init(mechId, isvId, type)
      })
    },

    closeDialog () {
      this.$nextTick(() => {
        this.getList()
      })
    },

    hideNowPage () {
      this.dialogShow = false
      this.$emit('closeDialog')
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
