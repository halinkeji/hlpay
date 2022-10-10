<template>
  <q-dialog @hide="hideNowPage" v-model="addConfig" persistent>
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
      class="q-pa-sm "
    >
      <q-card-section class="row items-center ">
        <div class="text-h6">
          {{ dataId > 0 ? '修改音箱' : '新增音箱' }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </q-card-section>

      <q-form ref="configDataRef" class="q-gutter-md">
        <div class="row">
          <div class="col-12 col-md-6 q-px-sm">
            <span>音箱名称 <span class="text-red q-pl-xs">*</span></span>
            <q-input outlined dense v-model="configData.psc_name" placeholder="请输入音箱名称" lazy-rules :rules="[(val) => !!val || '音箱名称不能为空']" maxlength="100" />
          </div>
          <div class="col-12 col-md-6 q-px-sm">
            <span>音箱品牌 </span>
            <q-select outlined option-value="value" option-label="label" emit-value map-options v-model="configData.psc_model" :options="modelPosition" dense label="请选择品牌" :error="false" />
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 q-px-sm">
            <span>appKey <span class="text-red q-pl-xs">*</span></span>
            <q-input outlined dense v-model="configData.psc_app_key" placeholder="请输入音箱appKey(联系代理商获取)" lazy-rules :rules="[(val) => !!val || 'appKey不能为空']" maxlength="150" />
          </div>
          <div class="col-12 col-md-6 q-px-sm">
            <span>appSecret <span class="text-red q-pl-xs">*</span></span>
            <q-input outlined dense v-model="configData.psc_app_secret" placeholder="输入appSecret(联系代理商获取)" lazy-rules :rules="[(val) => !!val || 'appSecret不能为空']" maxlength="150" />
          </div>
        </div>
        <!-- <div class="row">
          <div class="col-12 col-md-6 q-px-sm">
            <span>用户ID <span class="text-red q-pl-xs">*</span></span>
            <q-input outlined dense v-model="configData.psc_feiyu_user_id" placeholder="请输入飞鱼设备用户ID)" lazy-rules :rules="[(val) => !!val || '设备用户ID不能为空']" maxlength="50" />
          </div>
          <div class="col-12 col-md-6 q-px-sm">
            <span>设备token <span class="text-red q-pl-xs">*</span></span>
            <q-input outlined dense v-model="configData.psc_feiyu_token" placeholder="输入飞鱼设备token" lazy-rules :rules="[(val) => !!val || '设备token不能为空']" maxlength="100" />
          </div>
        </div> -->
        <div class="row">
          <div class="col-12 col-md-6 q-px-sm">
            <span>设备码 <span class="text-red q-pl-xs">*</span></span>
            <q-input outlined dense v-model="configData.psc_device_code" placeholder="输入设备码(联系代理商获取)" lazy-rules :rules="[(val) => !!val || '设备码不能为空']" />
          </div>

          <div class="col-12 col-md-6 q-px-sm">
            <span>音箱状态</span>
            <q-btn-toggle
              v-model="configData.psc_status"
              spread
              no-caps
              class="my-custom-toggle"
              rounded
              unelevated
              toggle-color="primary"
              color="white"
              text-color="black"
              :options="[
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' },
              ]"
            />
          </div>
        </div>

        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
          <q-btn unelevated :disable="btnDisable"  label="提交" @click="saveData()" color="primary" class="q-px-xl" />
          <q-btn unelevated label="关闭" type="reset" @click="hideNowPage()" color="grey" class="q-px-xl" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddSpeaker',
  components: {},
  data () {
    return {
      chooseVisible: false,
      dialogWidth: '1000px',
      addConfig: false,
      dataId: 0,
      configData: {
        psc_name: '',
        psc_app_key: '',
        psc_app_secret: '',
        psc_device_code: '',
        psc_model: 'feiyu',
        psc_status: '1',
        psc_feiyu_user_id: '',
        psc_feiyu_token: ''
      },
      modelPosition: [
        {
          value: 'feiyu',
          label: '广州飞鱼云音响'
        }
      ],
      btnDisable: false
    }
  },
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.5) + 'px'
    }
  },
  computed: {},
  created () {},
  methods: {
    getItem (id) {
      this.dataId = id
      this.addConfig = true
      if (id > 0) {
        this.$store.dispatch('speaker/getItem', id).then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : {}
          }
        })
      }
    },
    saveData () {
      this.$refs.configDataRef.validate().then((success) => {
        if (success) {
          this.btnDisable = true
          this.addConfig = false
          const obj = {
            ...this.configData,
            id: this.dataId
          }
          this.$store
            .dispatch('speaker/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}音箱成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.btnDisable = false
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
              this.btnDisable = false
            })
        }
      })
    },
    // 关闭
    closeChooseGoods () {
      this.chooseVisible = false
      // this.addConfig = true;
    },
    hideNowPage () {
      this.$emit('getMethods')
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
