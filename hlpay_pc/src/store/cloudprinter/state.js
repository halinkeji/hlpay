export default function () {
  return {
    printerModlData: [
      // {
      //   label: '标签',
      //   value: 'label'
      // },
      {
        label: '热敏纸',
        value: 'paper'
      }
      // {
      //   label: 'A4',
      //   value: 'A4'
      // }
    ],
    printerModlItem: {
      label: '标签',
      paper: '热敏纸',
      A4: 'A4'
    },
    printerPropertyData: [
      // {
      //   label: '驱动打印机',
      //   value: 'drive'
      // },
      {
        label: '云打印机',
        value: 'cloud'
      }
    ],
    printerPropertyItem: {
      // drive: '驱动打印机',
      cloud: '云打印机'
    },
    printerSharedData: [
      { label: '易联云', value: 'yilianyun' }
      // { label: '通用58', value: 'wuba' }
    ],
    printerSharedItem: {
      yilianyun: '易联云'
      // wuba: '通用58'
    }

  }
}
