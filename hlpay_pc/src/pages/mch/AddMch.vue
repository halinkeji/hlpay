<template>
  <q-dialog v-model="dialogShow" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.6) + 'px',
        'max-width': parseInt($q.screen.width * 0.6) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row">
          {{ mchId > 0 ? '修改' : '新增' }}商户信息
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
          <q-form ref="isvFromRef" class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-input
                label="编号"
                outlined
                v-model="mchInfoFrom.mch_id"
                :disable="mchId ? true : false"
                dense
                lazy-rules
                :rules="[(val) => !!val || '请生成编号']"
              >
                <template v-slot:after v-if="!mchId">
                  <q-btn color="warning" class="full-width" unelevated label="一键生成编号" @click="createMchId" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                outlined
                label="选择服务商"
                option-value="isv_id"
                option-label="isv_name"
                bottom-slots
                v-model="mchInfoFrom.isv_id"
                :options="isvListData"
                :disable="!!mchId"
                dense
                emit-value
                map-options
              >
              </q-select>
            </div>

            <div class="col-12 col-md-6">
              <q-select outlined label="状态" bottom-slots v-model="mchInfoFrom.state" :options="stateOptions" dense emit-value map-options>
              </q-select>
            </div>

            <div class="col-12 col-md-6">
              <q-select outlined label="类型" bottom-slots v-model="mchInfoFrom.type" :options="typeOptions" dense emit-value map-options> </q-select>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                label="商户名称"
                :rules="[(val) => !!val || '必填项']"
                v-model="mchInfoFrom.mch_name"
                placeholder="请输入商户名称"
                maxlength="255"
              ></q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                label="商户简称"
                :rules="[(val) => !!val || '必填项']"
                v-model="mchInfoFrom.mch_short_name"
                placeholder="请输入商户简称"
                maxlength="255"
              ></q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                label="联系人"
                :rules="[(val) => !!val || '必填项']"
                v-model="mchInfoFrom.contact_name"
                placeholder="请输入联系人"
                maxlength="255"
              ></q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                label="联系电话"
                :rules="[(val) => !!val || '必填项']"
                v-model="mchInfoFrom.contact_tel"
                placeholder="请输入联系电话"
                maxlength="255"
              ></q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                label="联系邮箱"
                :rules="[(val) => !!val || '必填项']"
                v-model="mchInfoFrom.contact_email"
                placeholder="请输入联系邮箱"
                maxlength="255"
              ></q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                label="备注"
                :rules="[(val) => !!val || '必填项']"
                v-model="mchInfoFrom.remark"
                placeholder="请输入备注"
                type="textarea"
                :rows="2"
              ></q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-img :src="mchInfoFrom.logo" width="100px" height="100px">
                <template v-if="!mchInfoFrom.logo">
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>

                <q-btn
                  round
                  size="md"
                  color="red"
                  v-else
                  :ripple="false"
                  flat
                  class="absolute-top-right"
                  icon="delete_forever"
                  @click="mchInfoFrom.logo = ''"
                ></q-btn>
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
              </q-img>

              <div class="q-my-sm text-grey-8">支付图标， 建议尺寸： 100 X 100</div>

              <q-btn unelevated color="primary" @click="imageData = true" label="上传图片" />
            </div>
          </q-form>
        </div>
        <upload-img v-if="imageData" @imageData="getImageData" :multiple="false" @closeUpload="imageData = false"></upload-img>
        <div class="col-shrink bg-white q-pb-sm q-mt-xs q-gutter-sm text-center">
          <q-btn label="提交" @click="saveData()" unelevated class="q-px-xl" color="primary" />
          <q-btn label="关闭" type="reset" v-close-popup unelevated color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddMch',
  data () {
    return {
      mchInfoFrom: {
        mch_id: '',
        mch_name: '',
        mch_short_name: '',
        contact_name: '',
        contact_tel: '',
        contact_email: '',
        state: '1',
        type: '1',
        relation_state: '1',
        remark: '',
        isv_id: '',
        logo: ''
      },
      stateOptions: [
        { label: '正常', value: '1' },
        { label: '停用', value: '0' }
      ],
      relationStateOptions: [
        { label: '是', value: '1' },
        { label: '否', value: '0' }
      ],
      typeOptions: [
        { label: '普通商户', value: '1' },
        { label: '特约商户(服务商模式)', value: '2' }
      ],
      applyOptionsData: [],
      storeOptionsData: [],

      dialogShow: false,
      mchId: 0,
      isvListData: [],
      imageData: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (mchId) {
      this.dialogShow = true
      this.getAllIsvList()
      this.mchInfoFrom.isv_id = this.$route.query.isv_id
      if (mchId > 0) {
        this.mchId = mchId

        this.$nextTick(() => {
          this.getItem()
        })
      }
    },
    getImageData (v) {
      this.imageData = false
      if (v) {
        this.mchInfoFrom.logo = v[0].base_url
      }
    },
    getAllIsvList () {
      this.$store
        .dispatch('isv/getAllIsv')
        .then((res) => {
          if (res.code == 200) {
            this.isvListData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    createMchId () {
      this.mchInfoFrom.mch_id = 'HL' + new Date().getTime().toString()
    },

    // 获取单条
    getItem () {
      this.$store.dispatch('mch/getIsvData', this.mchId).then((res) => {
        if (res.code == 200) {
          this.mchInfoFrom = res.data ? res.data : {}
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.isvFromRef.validate().then((success) => {
        if (success) {
          const obj = {
            id: this.mchId,
            ...this.mchInfoFrom
          }
          this.$store
            .dispatch('mch/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.mchId > 0 ? '编辑' : '新增'}商户信息`,
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
      this.dialogShow = false
      this.$emit('closeDialog')
    }
  }
}
</script>
