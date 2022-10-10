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
          {{ isvId > 0 ? '修改' : '新增' }}服务商信息
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
          <q-form ref="isvFromRef" class="row">
            <div class="col-12 q-px-xs">
              <q-input label="编号" outlined :disable="isvId ? true : false" v-model="isvInfoFrom.isv_id" dense lazy-rules :rules="[(val) => !!val || '请生成编号']">
                <template v-slot:after v-if="!isvId">
                  <q-btn color="warning" class="full-width" unelevated label="一键生成编号" @click="createIsvId" />
                </template>
              </q-input>
            </div>
            <div class="col-12 q-px-xs">
              <q-select
                outlined
                label="状态"
                bottom-slots
                v-model="isvInfoFrom.state"
                :options="stateOptions"
                dense
                emit-value
                map-options
              >
              </q-select>
            </div>
            <div class="col-12 q-px-xs">
              <q-input
                outlined
                dense
                label="服务商名称"
                :rules="[(val) => !!val || '必填项']"
                v-model="isvInfoFrom.isv_name"
                placeholder="请输入服务商名称"
                maxlength="255"
              ></q-input>
            </div>
            <div class="col-12 q-px-xs">
              <q-input
                outlined
                dense
                label="服务商简称"
                :rules="[(val) => !!val || '必填项']"
                v-model="isvInfoFrom.isv_short_name"
                placeholder="请输入服务商简称"
                maxlength="255"
              ></q-input>
            </div>

            <div class="col-12 q-px-xs">
              <q-input
                outlined
                dense
                label="联系人"
                :rules="[(val) => !!val || '必填项']"
                v-model="isvInfoFrom.contact_name"
                placeholder="请输入联系人"
                maxlength="255"
              ></q-input>
            </div>

            <div class="col-12 q-px-xs">
              <q-input
                outlined
                dense
                label="联系电话"
                :rules="[(val) => !!val || '必填项']"
                v-model="isvInfoFrom.contact_tel"
                placeholder="请输入联系电话"
                maxlength="255"
              ></q-input>
            </div>

            <div class="col-12 q-px-xs">
              <q-input
                outlined
                dense
                label="联系邮箱"
                :rules="[(val) => !!val || '必填项']"
                v-model="isvInfoFrom.contact_email"
                placeholder="请输入联系邮箱"
                maxlength="255"
              ></q-input>
            </div>

            <div class="col-12 q-px-xs">
              <q-input
                outlined
                dense
                label="备注"
                :rules="[(val) => !!val || '必填项']"
                v-model="isvInfoFrom.remark"
                placeholder="请输入备注"
                type="textarea"
                :rows="2"
              ></q-input>
            </div>
          </q-form>
        </div>
        <div class="col-shrink bg-white q-pb-sm q-mt-xs q-gutter-sm text-center">
          <q-btn label="提交" @click="saveData()" unelevated  class="q-px-xl" color="primary" />
          <q-btn label="关闭" type="reset" v-close-popup unelevated color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddIsv',
  data () {
    return {
      isvInfoFrom: {
        isv_id: '',
        isv_name: '',
        isv_short_name: '',
        contact_name: '',
        contact_tel: '',
        contact_email: '',
        state: '1',
        remark: ''
      },
      stateOptions: [
        { label: '正常', value: '1' },
        { label: '停用', value: '0' }
      ],

      dialogShow: false,
      isvId: 0
    }
  },
  created () {

  },
  mounted () {},
  computed: {},
  methods: {
    init (isvId) {
      this.dialogShow = true
      if (isvId > 0) {
        this.isvId = isvId
        this.$nextTick(() => {
          this.getItem()
        })
      }
    },
    createIsvId () {
      this.isvInfoFrom.isv_id = 'HL' + new Date().getTime().toString()
    },

    // 获取单条
    getItem () {
      this.$store.dispatch('isv/getIsvData', this.isvId).then((res) => {
        if (res.code == 200) {
          this.isvInfoFrom = res.data ? res.data : {}
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.isvFromRef.validate().then((success) => {
        if (success) {
          const obj = {
            id: this.isvId,
            ...this.isvInfoFrom
          }
          this.$store
            .dispatch('isv/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.isvId > 0 ? '编辑' : '新增'}服务商信息`,
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
