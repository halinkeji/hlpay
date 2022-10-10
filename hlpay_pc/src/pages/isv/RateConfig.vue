<template>
  <q-dialog v-model="dialogShow" @hide="hideNowPage" full-height persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.3) + 'px',
        'max-width': parseInt($q.screen.width * 0.3) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row">
          接口费率设置
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
          <q-scroll-area class="fit full-height">
            <q-form ref="isvFromRef" class="row q-col-gutter-sm q-pa-sm">
              <div class="row">
                <div class="col">接口名称</div>
                <div class="col">费率</div>
                <div class="col">状态</div>
              </div>
              <div class="row items-center q-col-gutter-md" v-for="(item, key) in wayCodeData">
                <div class="col">
                  {{ item.pay_way_code_label }}
                </div>
                <div class="col">
                  <q-input outlined v-model="item.value" dense :rules="[(val) => !!val || '请输入参数值']" label="费率" class="q-mt-md" />
                </div>
                <div class="col">
                  <q-select
                    outlined
                    label="状态"
                    bottom-slots
                    v-model="item.state"
                    :options="stateOptions"
                    dense
                    emit-value
                    map-options
                  >
                  </q-select>
                </div>
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-sm q-mt-xs q-gutter-sm text-center">
          <q-btn label="保存" @click="saveData()" unelevated class="q-px-xl" color="primary" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>

export default {
  name: 'PayConfig',
  data () {
    return {

      stateOptions: [
        { label: '正常', value: '1' },
        { label: '停用', value: '0' }
      ],

      dialogShow: false,

      wayCodeData: []
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (type, relatedId) {
      this.configType = type
      this.relatedId = relatedId

      this.dialogShow = true
      if (type && relatedId) {
        this.getItem()
      }
    },

    // 获取单条
    getItem () {
      this.$store
        .dispatch('isv/getPayConfig', {
          type: this.configType,
          related_id: this.relatedId
        })
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.wayCodeData = res.data ? res.data : []
            }
          }
        })
    },

    // 提交
    saveData () {
      this.$refs.isvFromRef.validate().then((success) => {
        if (success) {
          const obj = {
            type: this.configType,
            related_id: this.relatedId,
            wayCodeData: this.wayCodeData
          }
          this.$store
            .dispatch('isv/setPayConfig', obj)
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
      this.$emit('closeDialog')
    }
  }
}
</script>
