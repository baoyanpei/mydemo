<style lang="scss">
@import './index';
</style>
<template>
  <div class="loT6-index">
    <mqttBim
      ref="mqttBim"
      v-on:mqttWeather="mqttWeather"
      v-on:mqttTaDiao="mqttTaDiao"
      v-on:mqttShenJiangJi="mqttShenJiangJi"
    ></mqttBim>
    <historyLocation ref="historyLocation" v-on:initPerson="initPerson"></historyLocation>
    <mqttLocation ref="mqttLocation" v-on:initPerson="initPerson"></mqttLocation>
    <div id="viewer-local" v-show="tip_message===''"></div>
    <div v-if="nomodel_message!==''" class="nomodel_message" v-html="nomodel_message"></div>
    <div v-if="tip_message!==''" class="tip_message" v-html="tip_message"></div>
    <div style="width:350px;height: 100vh;z-index:10;position: relative;padding: 5px;">
      <el-row>
        <el-col v-for="item in tdDataList" :key="item.device_id" :span="12">
          <div v-show="showTadiaoInfo" class="divDataTadiao">
            <div style="padding-bottom: 5px;font-size: 14px;">{{item.device_name}}</div>
            <div>
              塔吊高度：
              <span id="td_tdgd">{{item.displayHeight}}</span> 米
            </div>
            <div>
              大臂角度：
              <span id="td_dbjd">{{item.rotate}}</span> 度
            </div>
            <div>
              小车距离：
              <span id="td_xcjl">{{item.extent}}</span> 米
            </div>
            <div>
              吊钩高度：
              <span id="td_dggd">{{item.height}}</span> 米
            </div>
            <div>
              上报时间：
              <span id="td_sbsj">{{item.created_time_s}}</span>
            </div>
          </div>
        </el-col>
        <el-col v-for="item in sjjDataList" :key="item.device_id" :span="12">
          <div v-show="showShenjiangjiInfo" class="divDataShenJiangJi">
            <div style="padding-bottom: 5px;font-size: 14px;">升降机</div>
            <div>
              高度：
              <span id="sjj_gd">{{item.sjjgd}}</span> 米
            </div>
            <div>
              楼层：
              <span id="sjj_lc">{{item.sjjlc}}</span> 层
            </div>
            <div>
              笼门状态：
              <span id="sjj_lmzt">{{item.mzt}}</span>
            </div>
            <div>
              上报时间：
              <span id="sjj_sbsj">{{item.sbsj}}</span>
            </div>
          </div>
        </el-col>
        <el-col v-for="item in hjjcyDataList" :key="item.station_nbr" :span="12">
          <div v-show="showWeatherInfo" class="divDataWeather">
            <!-- <img class='iconTipClose' src='/static/icon/closeIcon.png' @click="closeInfoAreaHandle(3)" title="关闭" /> -->
            <div style="padding-bottom: 5px;font-size: 14px;">{{item.device_name}}</div>
            <div>
              温度：
              <span>{{item.temp}}</span> °C
            </div>
            <div>
              湿度：
              <span>{{item.h}}</span> %
            </div>
            <div>
              噪声：
              <span>{{item.noise}}</span> db
            </div>
            <div>
              扬尘：
              <span>{{item.pm10}}</span> ug/m
            </div>
            <div>
              PM2.5：
              <span>{{item.pm2_5}}</span> ug/m
            </div>
            <div>
              风速：
              <span>{{ item.wind }}</span> 级
            </div>
          </div>
        </el-col>
        <el-col v-for="item in shuibiaoDataList" :key="item.device_id" :span="12">
          <div v-show="showShuibiaoInfo" class="divDataShuibiao">
            <!-- <img class='iconTipClose' src='/static/icon/closeIcon.png' @click="closeInfoAreaHandle(4)" title="关闭" /> -->
            <div style="padding-bottom: 5px;font-size: 14px;">{{item.device_name}}</div>
            <div>
              当前用量：
              <span>{{item.total_used}}</span> 吨
            </div>
          </div>
        </el-col>
        <el-col v-for="item in dianbiaoDataList" :key="item.device_id" :span="12">
          <div v-show="showDianbiaoInfo" class="divDataDianbiao">
            <!-- <img class='iconTipClose' src='/static/icon/closeIcon.png' @click="closeInfoAreaHandle(5)" title="关闭" /> -->
            <div style="padding-bottom: 5px;font-size: 14px;">{{item.device_name}}</div>
            <div>当前用量：{{item.total_used}} 度</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import LoadLotMixin from './mixin/LoadLotHander'

// import './Viewing.Extension.MeshSelection'

import mqttBim from './components/mqttBim'
import mqttLocation from './components/mqttLocation'
import historyLocation from './components/historyLocation'
import moment from 'moment'
export default {
  name: 'Lot6-index',
  components: {
    mqttBim,
    historyLocation,
    mqttLocation
  },
  mixins: [LoadLotMixin],
  data() {
    return {
      tdDataList: [], // 塔吊
      sjjDataList: [], //升降机
      hjjcyDataList: [], // 环境检测仪
      shuibiaoDataList: [], // 水表
      dianbiaoDataList: [] // 电表
    }
  },
  computed: {
    project_id() {
      return this.$store.state.project.project_id
    }
  },
  watch: {
    project_id(curVal, oldVal) {
      console.log('project_idproject_idproject_id', curVal, oldVal)
      if (oldVal !== null) {
        // this.clearData()
        location.reload()
      }
      if (curVal !== null) {
        this.useFrom = 'lot'
        this.init(curVal)
      }
    }
  },
  created() {},
  mounted() {
    if (this.project_id !== undefined && this.project_id !== '') {
      this.init(this.project_id)
    }
  },
  destroyed() {},
  methods: {
    showTaDiaoData(_newData) {
      console.log('taDiaoDatataDiaoDatataDiaoDatataDiaoData', _newData)
      let hasData = false
      this.tdDataList.forEach(data => {
        if (data.device_id === _newData.device_id) {
          data.rotate = _newData.rotate
          data.height = _newData.height
          data.extent = _newData.extent
          data.created_time_s = moment(_newData.created_time).format('HH:mm:ss')
          hasData = true
        }
      })
      if (hasData === false) {
        _newData.created_time_s = moment(_newData.created_time).format(
          'HH:mm:ss'
        )
        this.tdDataList.push(_newData)
      }
    },
    showHJJCYData(_newData) {
      // 环境检测仪
      console.log('天气数据', _newData)
      let hasData = false
      this.hjjcyDataList.forEach(data => {
        if (data.station_nbr === _newData.station_nbr) {
          data.temp = _newData.temp
          data.h = _newData.h
          data.noise = _newData.noise
          data.wind = _newData.wind
          data.pm10 = _newData.pm10
          data.pm2_5 = _newData.pm2_5

          hasData = true
        }
      })
      if (hasData === false) {
        this.hjjcyDataList.push(_newData)
      }
    },
    showDianbiaoData(_newData) {
      console.log('showDianbiaoDatashowDianbiaoData', _newData)
      let hasData = false
      this.dianbiaoDataList.forEach(data => {
        if (data.device_id === _newData.device_id) {
          data.total_used = _newData.total_used
          hasData = true
        }
      })
      if (hasData === false) {
        this.dianbiaoDataList.push(_newData)
      }
    },
    showShuibiaoData(_newData) {
      console.log('showShuibiaoDatashowShuibiaoDatashowShuibiaoData', _newData)
      let hasData = false
      this.shuibiaoDataList.forEach(data => {
        if (data.device_id === _newData.device_id) {
          data.total_used = _newData.total_used
          hasData = true
        }
      })
      if (hasData === false) {
        this.shuibiaoDataList.push(_newData)
      }
    }
  }
}
</script>
