<template>
  <div id="wayTypeId" :style="{ height:$q.screen.height * 0.2 + 'px' }" class="full-width"></div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
export default {
  props: ['sevenSummary'],
  data () {
    return {
      chartPie: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawPieChart()
    })
  },
  watch: {
    sevenSummary () {
      this.drawPieChart()
    }
  },
  methods: {
    drawPieChart () {
      const that = this

      this.chartPie = echarts.init(document.getElementById('wayTypeId'), 'macarons')
      console.log('this.chartPie', this.chartPie)

      this.chartPie.setOption({

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            },
            formatter: '{b0}: {c0}<br />{b1}: {c1}'
          }
        },

        legend: {
          data: that.sevenSummary.legendData
        },
        toolbox: {
          // feature: {
          //   saveAsImage: {}
          // }
        },
        grid: {
          left: '4%',
          right: '6%',
          bottom: '3%',
          top: '1%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: that.sevenSummary.payCodexAxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: that.sevenSummary.seriesData
      })
    }
  }
}
</script>
