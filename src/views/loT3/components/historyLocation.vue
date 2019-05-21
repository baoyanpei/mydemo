<template>
  <div class="history-location">
  </div>
</template>
<script>
  import lodash from 'lodash'
  import moment from 'moment'
  export default {
    directives: {},
    name: 'history-location',
    components: {},
    data() {
      return {


      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
    },
    created() {


    },
    watch: {
      project_id(curVal, oldVal) {
        this.getLocationHisData()
      },
    },
    mounted() {
      console.log('history-location')
      //   this.getLocationHisData()
    },
    beforeDestroy() {},
    destroyed() {},
    methods: {
      getLocationHisData() {
        const _param = {
          method: 'query_location_his',
          project_id: this.project_id,
          bt: moment().add('minutes', -30).format('YYYY-MM-DD HH:mm:ss'), //'2019-01-17 00:00:00', //
          et: moment().format('YYYY-MM-DD HH:mm:ss') //HH:mm:ss
        }
        this.$store.dispatch('QueryLocationHis', _param).then((dataList) => {
          console.log('QueryLocationHis', this.project_id, dataList)
          dataList.forEach(data => {
            this.$emit('initPerson', data)
          });

        })
      },
    }
  }

</script>
