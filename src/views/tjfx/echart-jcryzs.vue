<style lang="scss">
  @import "./echart-jcryzs";

</style>
<template>
  <div class="echart-jcryzs-container">
    <echart ref="echarts-jcryzs" :options="option" class="echarts-jcryzs" theme="infographic" style="width:100%"></echart>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {
        option: {
          title: {
            // text: '进场人员走势'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            top: '3%',
            containLabel: true
          },
          legend: {
            data: ['人员数量'],
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          color: ['#D16AAB', '#57A2D6', '#FBDB70', '#88DDE1', '#F3A386'],
          series: [{
            name: '人员数量',
            data: [],
            type: 'line',
            smooth: true,
            center: ['10%', '10%'],
          }]
        }
      };
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      }

    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          // this.reloadData()
        }
      },
    },
    mounted() {


    },

    methods: {
      reloadData(param) {
        // console.log('param', param)
        this.getData(param)
      },
      getData(param) {
        const _param = {
          method: 'query_online_max',
          project_id: param.project_id,
          bt: param.bt,
          et: param.et
        }
        this.option.xAxis.data = []
        this.option.series[0].data = []
        this.$store.dispatch('QueryPersonOnlineMaxList', _param).then((dataList) => {
          dataList.forEach((item, index) => {
              this.option.xAxis.data.push(item.date)
              this.option.series[0].data.push(item.in_count)
          })
        })
      }

    }

  };

</script>
