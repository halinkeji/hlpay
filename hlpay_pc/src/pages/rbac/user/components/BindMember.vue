<template>
  <q-dialog @hide="hideNowPage" v-model="bindMobileStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
      }"
      class="q-pa-sm fit "
    >
      <div class="fit column no-wrap  justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md text-h6 q-mb-xs">
          移动端权限
        </div>

        <div class="col-shrink q-pa-sm full-height ">
          <q-scroll-area class="fit full-height">
            <q-list bordered padding class="rounded-borders">
              <q-item :v-ripple="false">
                <q-item-section avatar top>
                  <q-avatar v-if="memberInfo.mem_memberPicture" color="primary" text-color="white">
                    <img :src="memberInfo.mem_memberPicture" alt="" />
                  </q-avatar>
                  <q-avatar color="grey" text-color="white" icon="person" v-else />
                </q-item-section>

                <q-item-section v-if="memberInfo.id">
                  <q-item-label lines="1">{{ memberInfo.mem_memberName }}(真实姓名:{{ memberInfo.mem_memberRealName }})</q-item-label>
                  <q-item-label caption>{{ memberInfo.mem_memberMobile }}(卡号:{{ memberInfo.mem_memberCardNum }})</q-item-label>
                </q-item-section>

                <q-item-section v-else>
                  <q-item-label lines="1">请选择绑定会员</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn unelevated label="选择会员" @click="addMember" color="primary" />
                </q-item-section>
                <q-item-section side v-if="memberInfo.id">
                  <q-btn unelevated label="重置" @click="resetMember" color="red" />
                </q-item-section>
              </q-item>
              <q-item  :v-ripple="false">
                <q-item-section>
                  <q-item-label>微信公众号模板消息提醒</q-item-label>
                  <q-item-label caption>启用后，当前操作员可以接收会员消费、会员注册等微信公众号模板消息提醒</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="configContent.acceptWechatTemplate" :true-value="1" :false-value="0" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-py-sm text-center q-gutter-sm q-mt-xs">
          <q-btn unelevated color="primary" class="q-px-xl" @click="saveBindData" label="保存" />
          <q-btn unelevated color="grey" @click="bindMobileStatus = false" class="q-px-xl" label="关闭" />
        </div>
        <hl-choose-manager v-if="chooseManagerStatus" ref="chooseManagerList" @getChooseManageData="receivingAdministrator"></hl-choose-manager>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  components: {},
  name: 'index',
  props: {},
  data () {
    return {
      chooseManagerStatus: false,
      memberInfo: {},
      bindMobileStatus: false,
      configContent: {
        acceptWechatTemplate: 0
      }
    }
  },
  computed: {},
  created () {},
  watch: {},
  mounted () {},
  methods: {
    init (userId) {
      this.bindMobileStatus = true
      if (userId && parseInt(userId) > 0) {
        this.user_id = userId
        this.getMobileInfo()
      }
    },
    hideNowPage () {
      this.$emit('closeDialog')
    },
    getMobileInfo () {
      const payload = {
        user_id: parseInt(this.user_id)
      }

      this.$store
        .dispatch('user/getMobileInfo', payload)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.memberInfo = res.data.member ? res.data.member : {}
            this.setConfigContent(res.data.content)

            this.bindMemberId = res.data && res.data.member_id ? res.data.member_id : 0
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    setConfigContent (data) {
      if (data) {
        for (const key in this.configContent) {
          this.configContent[key] = data[key] ? data[key] : ''
        }
      }
    },
    receivingAdministrator (val) {
      this.chooseManagerStatus = false
      if (val && val.length > 0) {
        this.memberInfo = val[0]
        this.bindMemberId = this.memberInfo.id
      }
    },
    resetMember () {
      this.bindMemberId = 0
      this.memberInfo = {}
    },
    saveBindData () {
      const payload = {
        user_id: parseInt(this.user_id),
        bindMemberId: this.bindMemberId,
        configContent: this.configContent
      }

      this.$store
        .dispatch('user/setMobileInfo', payload)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.bindMobileStatus = false
            this.$q.notify({
              message: '成功',
              caption: '设置成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    addMember () {
      this.chooseManagerStatus = true
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    }
  }
}
</script>
