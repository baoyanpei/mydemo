<style lang="scss">
  @import "./echart-rylydqfb";

</style>
<template>
  <div class="echart-rylydqfb-container">
    <echart ref="echart-rylydqfb" :options="option" class="echart-rylydqfb" theme="infographic" style="width:100%"></echart>
  </div>
</template>
<script>
  import lodash from 'lodash'
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
            type: 'value',
            // boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: []
          },
          series: [{
            name: '人员数量',
            type: 'bar',
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
          target: document.querySelector('.echart-rylydqfb-container')
        });
        const _param = {
          method: 'tj_online_area_by_time',
          project_id: param.project_id,
          bt: param.bt,
          et: param.et
        }
        this.option.yAxis.data = []
        this.option.series[0].data = []
        this.$store.dispatch('queryTjOnlineAreaByTime', _param).then((dataList) => {

          // console.log('data-queryTjOnlineAreaByTime', dataList)

          dataList = lodash.sortBy(dataList, function (item) {
            return item.count;
          });

          dataList.forEach((item, index) => {
            this.option.yAxis.data.push(item.province)
            this.option.series[0].data.push(item.count)

          })
          loading.close();

        })
      }
    }

  };

</script>
