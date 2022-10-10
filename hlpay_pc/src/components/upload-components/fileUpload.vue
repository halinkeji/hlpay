<template>
  <div class="full-height full-width">
    <div class="row full-height">
      <div class="col-12 full-height">
        <q-uploader
          ref="qUploadedImgRef"
          color="white"
          text-color="black"
          style="width: 100%"
          class="full-height"
          flat
          bordered
          :field-name="'file'"
          :multiple="multiple"
          :factory="factoryFn"
        >
          <template v-slot:header="scope">
            <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
              <div class="q-uploader__title">{{ cardTitle }}</div>
              <div class="q-uploader__subtitle">
                {{ scope.uploadSizeLabel }}
              </div>
              <q-space />
              <q-btn v-if="scope.canAddFiles" label="选择" type="a" icon="add_box" unelevated color="primary">
                <q-uploader-add-trigger />
              </q-btn>

              <q-btn v-if="scope.canUpload" icon="cloud_upload" label="上传" @click="scope.upload" unelevated color="primary"> </q-btn>
            </div>
          </template>

          <template v-slot:list="scope">
            <q-input outlined dense readonly label="微信支付API证书路径" v-model="valuePath"></q-input>
          </template>
        </q-uploader>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['relatedId', 'cardTitle', 'valuePath'],
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created () {},
  mounted () {},
  methods: {
    factoryFn (file) {
      const that = this

      const formData = new FormData()
      formData.append('file', file[0])
      formData.append('relatedId', that.relatedId)
      this.$store
        .dispatch('upload/cert', formData)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '上传文件成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })

            this.$emit('filePath', res.data)

            setTimeout(() => {
              this.$refs.qUploadedImgRef.reset()
            }, 1000)
          } else {
            this.$q.notify({
              message: '失败',
              caption: '上传文件失败，上传列表清空，请重新上传',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.$refs.qUploadedImgRef.reset()
            }, 1000)
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
          setTimeout(() => {
            this.$refs.qUploadedImgRef.reset()
          }, 1000)
        })
    }
  }
}
</script>

<style>
.overflow_area_500 {
  overflow: auto;
  height: 360px;
}
</style>
