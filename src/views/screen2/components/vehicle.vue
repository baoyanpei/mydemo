<style lang="scss">
  @import "./vehicle.scss";

</style>

<template>
  <div class="screen-vehicle">
    <div v-if="hasVehicleDevice === false" class="noVehicleDeviceTips">{{noVehicleDeviceTips}}</div>
    <div v-if="hasVehicleDevice === true">
      <el-row>
        <el-col :span="9">
          <el-table class="screen-vehicle-table" ref="vehicleTable" stripe :data="vehicleList" height="320px"
            :empty-text="vehicleTableEmptyText" style="width: 100%" size="mini" :show-header="true" border
            :row-class-name="tableRowClassName" :resizabl="false">

            <el-table-column property="lisence_show" label="车牌号" align="center" header-align="center">
            </el-table-column>
            <el-table-column property="created_time" label="进场时间" align="center" header-align="center">
              <template slot-scope="scope">
                <span v-html="createTimeHTML(scope.row.created_time)"></span>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
        <el-col :span="15">
          <div style='padding-left: 10px;' class="last-vehicle">
            <div class="title">最新进场车牌号码</div>
            <div class="lisence">
              <div class="lisence-letter">{{lastVehicle.lisence[0]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[1]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[2]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[3]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[4]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[5]}}</div>
              <div class="lisence-letter">{{lastVehicle.lisence[6]}}</div>
            </div>
            <div class="in-time">进场时间：<br />{{lastVehicle.created_time}}</div>

            <img :src="lastVehicle.pic" class="vehicle-img" />
          </div>

        </el-col>
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
          console.log('vehicleDataList', vehicleDataList)
          this.vehicleList = lodash.chunk(vehicleDataList, 8)[0]
          this.vehicleList.forEach(data => {
            data.lisence = data.lisence.replace(data.lisence_type, '')
            data['lisence_show'] = `${data.lisence} (${data.lisence_type})`
            // console.log('data', data.lisence.replace(data.lisence_type, ''))
          });
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
