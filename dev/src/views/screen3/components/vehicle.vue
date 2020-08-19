<style lang="scss">
  @import "./vehicle.scss";

</style>

<template>
  <div class="screen-vehicle">
    <div v-if="hasVehicleDevice === false" class="noVehicleDeviceTips">{{noVehicleDeviceTips}}</div>
    <div v-if="hasVehicleDevice === true">

      <el-row class="vehicle-info">
        <el-col :span="12">
          <div style='padding-left: 10px;' class="last-vehicle">
            <div class="title">进出场车牌号码</div>
            <div class="lisence">
              <div class="lisence-letter">{{lastVehicle.lisence[0]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[1]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[2]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[3]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[4]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[5]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[6]}}</div>
            </div>
            <div class="in-time">时间：{{lastVehicle.created_time}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <img :src="lastVehicle.pic" class="vehicle-img" />
        </el-col>
      </el-row>
      <el-row>
        <div class="vehicle-list">
          <div v-if="vehicleList[0]!==undefined" class="vehicle-list-item">
            {{vehicleList[0].lisence_show}}
          </div>
          <div v-if="vehicleList[1]!==undefined" class="vehicle-list-item vehicle-list-item1">
            {{vehicleList[1].lisence_show}}</div>
          <div v-if="vehicleList[2]!==undefined" class="vehicle-list-item vehicle-list-item1">
            {{vehicleList[2].lisence_show}}</div>
          <div v-if="vehicleList[3]!==undefined" class="vehicle-list-item">{{vehicleList[3].lisence_show}}</div>
          <div v-if="vehicleList[4]!==undefined" class="vehicle-list-item">{{vehicleList[4].lisence_show}}</div>
          <div v-if="vehicleList[5]!==undefined" class="vehicle-list-item vehicle-list-item1">
            {{vehicleList[5].lisence_show}}</div>
          <div v-if="vehicleList[6]!==undefined" class="vehicle-list-item vehicle-list-item1">
            {{vehicleList[6].lisence_show}}</div>
          <div v-if="vehicleList[7]!==undefined" class="vehicle-list-item ">{{vehicleList[7].lisence_show}}</div>
          <div v-if="vehicleList[8]!==undefined" class="vehicle-list-item ">
            {{vehicleList[8].lisence_show}}
          </div>
          <div v-if="vehicleList[9]!==undefined" class="vehicle-list-item vehicle-list-item1">
            {{vehicleList[9].lisence_show}}
          </div>
        </div>
      </el-row>
    </div>


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
        vehicleTableEmptyText: '正在查询',
        vehicleList: [],
        lastVehicle: {
          lisence: '',
          created_time: ''
        },
        hasVehicleDevice: false,
        noVehicleDeviceTips: ''
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
      init(project_id, datumMeterMap) {
        this.project_id = project_id


        datumMeterMap.forEach(datum => {
          if (datum.device_type === 18) {
            // this.cameraURList.push(datum)
            this.hasVehicleDevice = true


          }
        })


        if (this.hasVehicleDevice === true) {
          this.getVehicleGateData()
          this.refreshData()
        } else {
          this.noVehicleDeviceTips = "该项目没有配置车牌识别摄像头"
        }
      },
      tableRowClassName({
        row,
        rowIndex
      }) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      refreshData() {
        setTimeout(() => {
          this.getVehicleGateData()
          this.refreshData()
          // console.log('getVehicleGateData')
        }, 60 * 1000)
      },
      getVehicleGateData() {

        let param = {
          method: 'query_vehicle_logs',
          project_id: this.project_id,
        }

        this.$store.dispatch('QueryVehicleGate', param).then((vehicleDataList) => {
          // console.log('vehicleDataList', vehicleDataList)
          this.vehicleList = lodash.chunk(vehicleDataList, 10)[0]
          this.vehicleList.forEach(data => {
            data.lisence = data.lisence.replace(data.lisence_type, '')
            let _time = moment(data.created_time).format("M-DD HH:mm")
            data['lisence_show'] = `${data.lisence}(${data.lisence_type}) ${_time}`
            // console.log('data', data.lisence.replace(data.lisence_type, ''))
          });
          // console.log('this.vehicleList.length', this.vehicleList.length)
          for (let i = 0; i < (10 - this.vehicleList.length); i++) {
            // console.log('i', i)
            this.vehicleList.push({
              'lisence_show': ''
            })
          }
          console.log('this.vehicleList', this.vehicleList)
          this.lastVehicle = vehicleDataList[0]
        }).catch(() => {
          //   this.loading = false
        })
      },
      createTimeHTML(created_time) {
        let html = moment(created_time).format("M-DD HH:mm")

        return html
      }
    },

  }

</script>
