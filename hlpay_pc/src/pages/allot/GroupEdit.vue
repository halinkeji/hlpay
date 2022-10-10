<template>
  <q-dialog v-model="dialogShow" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.2) + 'px',
        'max-width': parseInt($q.screen.width * 0.2) + 'px',
      }"
    >
      <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row items-center">
        分组
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
      <div class="q-pa-sm full-height bg-white q-mt-xs">
        <q-form ref="isvFromRef" class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12">
            <q-input
              outlined
              dense
              label="名称"
              :rules="[(val) => !!val || '必填项']"
              v-model="groupForm.name"
              placeholder="请输入分账分组名称"
              maxlength="64"
            ></q-input>
          </div>

          <div class="col-12">
            <q-select outlined label="选择商户" bottom-slots v-model="groupForm.mch_id" :options="mchAllList" dense emit-value map-options option-label="mch_name" option-value="mch_id">
            </q-select>
          </div>
          <div class="col-12">
            <q-select
              outlined
              label="自动分账组"
              bottom-slots
              v-model="groupForm.auto_allot_receiver_flag"
              :options="receiverOptions"
              dense
              emit-value
              map-options
            >
            </q-select>
          </div>
        </q-form>
      </div>
      <div class="bg-white q-pb-sm q-mt-xs q-gutter-sm text-center">
        <q-btn label="保存" @click="saveData()" unelevated class="q-px-xl" color="primary" />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AllotGroupEdit',
  data () {
    return {
      groupForm: {
        name: '',
        auto_allot_receiver_flag: '1',
        mch_id: ''
      },
      receiverOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ],

      dialogShow: false,
      groupId: 0,
      mchAllList: []
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (groupId) {
      this.dialogShow = true
      this.getAllMch()
      if (groupId > 0) {
        this.groupId = groupId
        this.getItem()
      }
    },

    // 获取单条
    getItem () {
      this.$store.dispatch('allot/getItem', this.groupId).then((res) => {
        if (res.code == 200) {
          this.groupForm = res.data ? res.data : {}
        }
      })
    },

    // 获取全部商户
    getAllMch () {
      this.$store.dispatch('mch/getAllMch').then((res) => {
        if (res.code == 200) {
          this.mchAllList = res.data ? res.data : {}
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.isvFromRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.groupForm,
            groupId: this.groupId
          }
          this.$store
            .dispatch('allot/saveData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功！',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })

                this.hideNowPage()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        }
      })
    },

    hideNowPage () {
      this.dialogShow = false
      this.$emit('closeDialog')
    }
  }
}
</script>
