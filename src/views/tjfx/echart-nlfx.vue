<style lang="scss">
  @import "./echart-nlfx";

</style>
<template>
  <div class="echart-nlfx-container">
    <echart ref="echart-nlfx" :options="option" class="echart-nlfx" theme="infographic" style="width:100%"></echart>
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

          color: ['#D16AAB', '#57A2D6', '#FBDB70', '#88DDE1', '#F3A386'],
          series: [{
            name: '面积模式',
            type: 'pie',
            radius: [30, 110],
            // center: ['75%', '50%'],
            roseType: 'radius',
            label: {
              formatter: '{b}:  ({c}人)'
            },
            data: []
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
        const loading = this.$loading({
          lock: true,
          text: '正在载入数据...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)',
          target: document.querySelector('.echart-nlfx-container')
        });
        const _param = {
          method: 'tj_online_age_by_time',
          project_id: param.project_id,
          bt: param.bt,
          et: param.et
        }
        this.option.series[0].data = []
        this.$store.dispatch('QueryTjOnlineAgeByTime', _param).then((dataList) => {

          // console.log('data', dataList)

          dataList.forEach((item, index) => {
            if (item.value > 0) {
              this.option.series[0].data.push({
                value: item.value,
                name: item.name
              })
            }

          })
          loading.close();

        })
      }
    }

  };

</script>
