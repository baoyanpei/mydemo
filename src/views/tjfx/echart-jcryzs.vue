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
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '2%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          color: ['#D16AAB', '#57A2D6', '#FBDB70', '#88DDE1', '#F3A386'],
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
            center: ['10%', '10%'],
          }]
        }
        //   option: {
        //     tooltip: {
        //       trigger: 'item',
        //       formatter: '{a} <br/>{b}: {c} ({d}%)'
        //     },
        //     legend: {
        //       orient: 'vertical',
        //       x: 'right',
        //       y: '25%',
        //       align: 'left',
        //       itemGap: 35,
        //       right: '10%'
        //     },
        //     color: ['#D16AAB', '#57A2D6', '#FBDB70', '#88DDE1', '#F3A386'],
        //     series: [{
        //       name: '',
        //       type: 'pie',
        //       radius: ['58%', '85%'],
        //       center: ['10%', '50%'],
        //       avoidLabelOverlap: false,
        //       label: {
        //         normal: {
        //           show: false,
        //           position: 'center'
        //         },
        //         emphasis: {
        //           show: true,
        //           textStyle: {
        //             fontSize: '15',
        //             fontWeight: 'bold'
        //           }
        //         }
        //       },
        //       labelLine: {
        //         normal: {
        //           show: false
        //         }
        //       },
        //       data: [{
        //           value: 0,
        //           name: '抽烟报警'
        //         },
        //         {
        //           value: 0,
        //           name: '接打电话报警'
        //         },
        //         {
        //           value: 0,
        //           name: '疲劳驾驶报警'
        //         },
        //         {
        //           value: 0,
        //           name: '前向碰撞报警'
        //         },
        //         {
        //           value: 0,
        //           name: '车道偏离报警'
        //         },
        //         {
        //           value: 0,
        //           name: '车距过近报警'
        //         },
        //         {
        //           value: 0,
        //           name: '行人碰撞报警'
        //         },
        //         {
        //           value: 0,
        //           name: '频繁变道报警'
        //         },
        //         {
        //           value: 0,
        //           name: '道路标识超限报警'
        //         },
        //         {
        //           value: 0,
        //           name: '障碍物报警'
        //         },
        //         {
        //           value: 0,
        //           name: '分神驾驶报警'
        //         },
        //         {
        //           value: 0,
        //           name: '驾驶员异常报警'
        //         }
        //       ]
        //     }]
        //   }
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

    }

  };

</script>
