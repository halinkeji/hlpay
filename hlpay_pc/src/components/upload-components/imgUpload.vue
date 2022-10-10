<template>
  <div
    class="full-width q-pa-sm"
    :style="{
      height: dialogHeight,
      'mix-height': dialogHeight,
    }"
  >
    <q-uploader
      ref="qUploadedImgRef"
      color="white"
      text-color="black"
      accept=".jpg, image/*"
      flat
      :field-name="'file'"
      :multiple="multiple"
      :factory="factoryFn"
      hide-upload-btn
      class="fit xxxxx"
    >
      <template v-slot:header="scope">
        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
          <div class="q-uploader__title">上传后端文件</div>
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
        <div class="row">
          <div class="col-2 q-ma-sm" v-for="file in scope.files">
            <img :src="file.__img.src" style="width: 100%" :ratio="1" />
          </div>
        </div>
      </template>
    </q-uploader>
  </div>
</template>
<script>
export default {
  props: ['showOperateIndex', 'multiple'],
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      dialogWidth: '600px',
      dialogHeight: '550px'
    }
  },
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.6) + 'px'
    }
    if (this.$q.screen.height) {
      this.dialogHeight = parseInt(this.$q.screen.height * 0.65) + 'px'
    }
  },
  mounted () {},
  methods: {
    factoryFn (file) {
      const that = this
      const formData = new FormData()
      formData.append('file', file[0])
      this.$store
        .dispatch('upload/image', formData)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '上传图片成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })

            setTimeout(() => {
              this.$refs.qUploadedImgRef.reset()
              this.$nextTick(() => {
                this.$emit('uploadSuccess')
              })
            }, 1000)
          } else {
            this.$q.notify({
              message: '失败',
              caption: '上传图片失败，上传列表清空，请重新上传',
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
<style >
.xxxxx .q-uploader__list{
  height: 600px !important;
  min-height: 600px !important;
}
</style>
