<style lang="scss">
  @import "./tasks.scss";

</style>

<template>
  <div class="screen-tasks">

    screen-tasks
  </div>
</template>
<script>
  import lodash from 'lodash'
  import moment from 'moment'
  export default {
    components: {},
    data() {
      return {
        project_id: null,

      }
    },
    props: {

    },
    computed: {

    },
    created() {

    },
    watch: {

    },
    mounted() {
      // this.getVehicleGateData()
      // this.refreshData()
    },
    destroyed() {

    },
    methods: {
      init(project_id) {
        this.project_id = project_id
        this.getAllInstList()


      },
      getAllInstList() {

        let param = {
          method: 'get_all_inst_list',
          project_id: this.project_id,
          page: 1,
          limit: 20,
          qtype: 'inProgress',
          flow_id: 'ProblemFindSolve01'
        }

        this.$store.dispatch('GetAllInstList', param).then((vehicleDataList) => {
          console.log('vehicleDataList', vehicleDataList)

        }).catch(() => {
          //   this.loading = false
        })
      },
    },

  }

</script>
