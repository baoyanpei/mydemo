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
            roseType: 'area',
            data: [{
                value: 10,
                name: 'rose1'
              },
              {
                value: 5,
                name: 'rose2'
              },
              {
                value: 15,
                name: 'rose3'
              },
              {
                value: 25,
                name: 'rose4'
              },
              {
                value: 20,
                name: 'rose5'
              },
              {
                value: 35,
                name: 'rose6'
              },
              {
                value: 30,
                name: 'rose7'
              },
              {
                value: 40,
                name: 'rose8'
              }
            ]
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

    }

  };

</script>
