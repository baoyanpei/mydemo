<style lang="scss">
  @import "./tadiaoTaji.scss";

</style>
<template>
  <div class="screen-tadiao-taji">
    <div class="bg-img">
      <!-- <img src="../../assets/tadiao.png"> -->
    </div>
    <el-row>
      <el-col :span="24" class="title">
        <span>塔机数据</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          塔吊高度：
        </div>
      </el-col>
      <el-col :span="16">
        <div :class="taji_data.Weight | checkStatus('Weight').class" class="grid-content">
          {{taji_data.Weight | checkStatus('Weight').value}} 吨
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          大臂角度：
        </div>
      </el-col>
      <el-col :span="16">
        <div :class="taji_data.WindLevel | checkStatus('WindLevel').class" class="grid-content">
          {{taji_data.WindLevel | checkStatus('WindLevel').value}} 级
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          小车距离：
        </div>
      </el-col>
      <el-col :span="16">
        <div :class="taji_data.ObliguityAlarm | alertText1().class" class="grid-content">
          {{taji_data.ObliguityAlarm | alertText1().value}}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          吊钩线长：
        </div>
      </el-col>
      <el-col :span="16">
        <div :class="taji_data.MomentAlarm | alertText1().class" class="grid-content">
          {{taji_data.MomentAlarm | alertText1().value}}
        </div>
      </el-col>
    </el-row>
    <el-row>

      <el-col :span="8">
        <div class="grid-content label">
          上报时间：
        </div>
      </el-col>
      <el-col :span="16">
        <div :class="taji_data.MomentAlarm | alertText1().class" class="grid-content">
                {{ taji_data.RTime }}
        </div>
      </el-col>
      
    </el-row>
  </div>
</template>
<script>
  import moment from 'moment'
  export default {
    components: {},
    data() {
      return {
        taji_data: {
          Weight: '-', //载重
          WindLevel: '-', //风级
          MomentAlarm: '-', //力矩报警
          WindSpeedAlarm: '-', //风速报警
          HeightAlarm: '-', //高度上限位报警
          MinRangeAlarm: '-', //幅度内限位报警
          MaxRangeAlarm: '-', // 幅度外限位报警
          PosAngleAlarm: '-', // 顺时针回转限位报警
          NegAngleAlarm: '-', //逆时针回转限位报警
          ObliguityAlarm: '-', //倾角报警
          MultiAlarmAll: '-', //多机防撞报警
          WorkStatus: '-', //工作状态
          RTime: '-'
        },
        // TempColor: '#FF00000',
        // ZhenchangColor: '#67C23A',
        // BaojinColor: '#FF0000',
        // YujinColor: '#f1f506',


      }
    },
    props: {

    },
    filters: { //如下这样写
      checkStatus: (valueNum, typeName) => { //valueNum就是我们需要的值
        let _class = 'ZhenchangColor'
        if (valueNum === '-') {
          return {
            value: valueNum,
            class: 'NodataColor'
          }
        }
        switch (typeName) {
          case 'Weight': // 载重
            return {
              value: valueNum,
              class: 'ZhenchangColor'
            }
            break
          case 'WindLevel': //风力
            if (parseInt(valueNum) > 5) {
              _class = 'BaojinColor'
            }
            return {
              value: valueNum,
              class: _class
            }
            break;
          case 'MomentAlarm':
            return valueNum
            break;
        }
      },
      alertText1: (value) => {
        if (value === '-') {
          return {
            value: value,
            class: 'NodataColor'
          }
        } else if (value === '0') {
          return {
            value: '正常',
            class: 'ZhenchangColor'
          }
        } else if (value === '1') {
          return {
            value: '报警',
            class: 'BaojinColor'
          }
        } else if (value === '2') {
          return {
            value: '预警',
            class: 'YujinColor'
          }
        }
        return {
          value: '未知',
          class: 'NodataColor'
        }
      },
      workStatusText: (value) => {
        if (value === '-') {
          return {
            value: value,
            class: 'NodataColor'
          }
        } else if (value === '0') {
          return {
            value: '运行监控',
            class: 'ZhenchangColor'
          }
        } else if (value === '1') {
          return {
            value: '顶升监控',
            class: 'ZhenchangColor'
          }
        }
        return {
          value: '未知',
          class: 'NodataColor'
        }
      }
    },
    methods: {
      updateData(data) {
        this.taji_data = data

      },

    },
    watch: {

    },
    mounted() {
      //   console.log("persion_data.entry_pic", this.persion_data.entry_pic)

    }
  }

</script>
