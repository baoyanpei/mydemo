<style lang="scss">
  @import "./echart-rylydqfb";

</style>
<template>
  <div class="echart-rylydqfb-container">
    <echart ref="echart-rylydqfb" :options="option" class="echart-rylydqfb" theme="infographic" style="width:100%"></echart>
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
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
          },
          series: [
            {
              name: '2012年',
              type: 'bar',
              data: [19325, 23438, 31000, 121594, 134141, 681807]
            }
          ]
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

    }

  };

</script>
