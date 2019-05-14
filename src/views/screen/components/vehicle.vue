<style lang="scss">
  @import "./vehicle.scss";

</style>

<template>
  <div class="screen-vehicle">
    <el-row>
      <el-col :span="8">
        <el-table class="screen-vehicle-table" ref="vehicleTable" stripe :data="vehicleList" height="320px"
          :empty-text="vehicleTableEmptyText" style="width: 100%" size="mini" :show-header="true" border
          :row-class-name="tableRowClassName" :resizabl="false">

          <el-table-column property="lisence" label="车牌号" align="center" header-align="center">
          </el-table-column>
          <el-table-column property="created_time" label="进场时间" align="center" header-align="center">
            <template slot-scope="scope">
              <span v-html="createTimeHTML(scope.row.created_time)"></span>
            </template>
          </el-table-column>

        </el-table>
      </el-col>
      <el-col :span="16">
        <div style='padding-left: 20px;' class="last-vehicle">
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

          <img :src="lastVehicle.pic" class="vehicle-img"/>
        </div>

      </el-col>
    </el-row>

  </div>
</template>
<script>
  import lodash from 'lodash'
  import moment from 'moment'
  export default {
    components: {},
    data() {
      return {
        project_id: 10000,
        vehicleTableEmptyText: '正在查询',
        vehicleList: [],
        lastVehicle: {
          lisence: '',
          created_time: ''
        }
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
      this.getVehicleGateData()
    },
    destroyed() {

    },
    methods: {
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
            console.log('data', data.lisence.replace(data.lisence_type, ''))
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
