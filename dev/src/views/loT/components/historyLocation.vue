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

    },
    created() {


    },
    watch: {

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
          project_id: 10000,
          bt: moment().add('minutes', -30).format('YYYY-MM-DD HH:mm:ss'),//'2019-01-17 00:00:00', //
          et: moment().format('YYYY-MM-DD HH:mm:ss') //HH:mm:ss
        }
        this.$store.dispatch('QueryLocationHis', _param).then((dataList) => {
          console.log('QueryLocationHis', dataList)
          dataList.forEach(data => {
            // console.log('datadata', data)
            // data.datatime = data.created_time
            // data.layer = data.z
            // data.x = data.x
            // data.y = data.y
            this.$emit('initPerson', data)
          });

        })
      },
    }
  }

</script>
