<template>
  <q-dialog v-model="dialogShow" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.3) + 'px',
        'max-width': parseInt($q.screen.width * 0.3) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row">
          {{ mchInfoFrom.id > 0 ? '修改' : '新增' }}绑定信息
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
          <q-form ref="isvFromRef" class="row">
            <div class="col-12 q-px-xs">
              <q-select
                outlined
                label="关联应用状态"
                bottom-slots
                v-model="mchInfoFrom.relation_state"
                :options="relationStateOptions"
                dense
                emit-value
                map-options

              >
              </q-select>
            </div>
            <div class="col-12 q-px-xs">
              <q-select
                outlined
                label="关联应用"
                bottom-slots
                v-model="mchInfoFrom.relation_apply_id"
                :options="applyOptionsData"
                @input="getStoreData(2)"
                dense
                emit-value

                map-options
                option-value="apply_id"
                option-label="client_name"
                :rules="[(val) => !!val || '请选择关联应用']"
              >
              </q-select>
            </div>
            <div class="col-12 q-px-xs">
              <q-select
                outlined
                label="关联商户"
                bottom-slots
                v-model="mchInfoFrom.relation_lib_id"
                :options="storeOptionsData"
                dense
                emit-value
                map-options

                option-value="id"
                option-label="name"
                :rules="[(val) => !!val || '请选择关联商户']"
              >
              </q-select>
            </div>
          </q-form>
        </div>
        <div class="col-shrink bg-white q-pb-sm q-mt-xs q-gutter-sm text-center">
          <q-btn label="提交"  @click="saveData()"  unelevated class="q-px-xl" color="primary" />
          <q-btn label="关闭" type="reset" v-close-popup unelevated color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'BindStore',
  data () {
    return {
      mchInfoFrom: {
        relation_state: '',
        mch_id: '',
        isv_id: '',
        mch_name: '',
        app_id: '',
        app_secrect: '',
        relation_store_id: '',
        relation_lib_id: '',
        relation_apply_id: ''
      },

      relationStateOptions: [
        { label: '是', value: '1' },
        { label: '否', value: '0' }
      ],

      applyOptionsData: [],
      storeOptionsData: [],

      dialogShow: false
    }
  },

  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (mch_id, isv_id, mch_name, app_id, app_secrect) {
      this.dialogShow = true

      this.mchInfoFrom.mch_id = mch_id
      this.mchInfoFrom.isv_id = isv_id
      this.mchInfoFrom.mch_name = mch_name
      this.mchInfoFrom.app_id = app_id
      this.mchInfoFrom.app_secrect = app_secrect
      if (mch_id) {
        this.$nextTick(() => {
          this.getItem()
        })
      }
    },
    getApplyData () {
      this.$store
        .dispatch('mch/getApplyData')
        .then((res) => {
          if (res.code == 200) {
            this.applyOptionsData = res.data ? res.data : []
            if (this.mchInfoFrom.relation_lib_id) {
              this.getStoreData()
            }
          }
        })
        .catch((error) => {})
    },
    getStoreData () {
      this.$store
        .dispatch('mch/getStoreData', {
          apply_id: this.mchInfoFrom.relation_apply_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.storeOptionsData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    // 获取单条
    getItem () {
      this.$store.dispatch('mch/getStoreRelation', {
        mch_id: this.mchInfoFrom.mch_id
      }).then((res) => {
        this.getApplyData()
        if (res.code == 200 && res.data) {
          this.mchInfoFrom = res.data
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.isvFromRef.validate().then((success) => {
        if (success) {
          this.mchInfoFrom.relation_store_id = this.mchInfoFrom.relation_lib_id
          const obj = {
            ...this.mchInfoFrom
          }
          this.$store
            .dispatch('mch/setStoreRelation', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.mchInfoFrom.id > 0 ? '编辑' : '新增'}商户信息`,
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
