<style lang="scss">
  @import "./taji.scss";

</style>
<template>
  <div class="screen-taji-info">
    <div class="bg-img">
      <!-- <img src="../../assets/tadiao.png"> -->
    </div>
    <el-row>
      <el-col :span="24" class="title">
        塔机实时数据
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="grid-content">
          载重：
        </div>
      </el-col>
      <el-col :span="10">
        <div :class="taji_data.Weight | checkStatus('Weight').class" class="grid-content">
          {{taji_data.Weight | checkStatus('Weight').value}} 吨
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="grid-content">
          风级：
        </div>
      </el-col>
      <el-col :span="10">
        <div :class="taji_data.WindLevel | checkStatus('WindLevel').class" class="grid-content">
          {{taji_data.WindLevel | checkStatus('WindLevel').value}} 级
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="grid-content" style="font-size: 20px;">
          倾角：
        </div>
      </el-col>
      <el-col :span="10">
        <div :class="taji_data.ObliguityAlarm | alertText1().class" class="grid-content">
          {{taji_data.ObliguityAlarm | alertText1().value}}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="grid-content">
          力矩报警：
        </div>
      </el-col>
      <el-col :span="10">
        <div :class="taji_data.MomentAlarm | alertText1().class" class="grid-content">
          {{taji_data.MomentAlarm | alertText1().value}}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="grid-content">
          风速报警：
        </div>
      </el-col>
      <el-col :span="10">
        <div :class="taji_data.WindSpeedAlarm | alertText1().class" class="grid-content">
          {{taji_data.WindSpeedAlarm | alertText1().value}}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="grid-content">
          工作状态：
        </div>
      </el-col>
      <el-col :span="10">
        <div :class="taji_data.WorkStatus | workStatusText().class" class="grid-content">
          {{taji_data.WorkStatus | workStatusText().value}}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="grid-content">
          多机防撞：
        </div>
      </el-col>
      <el-col :span="10">
        <div :class="taji_data.MultiAlarmAll | alertText1().class" class="grid-content">
          {{taji_data.MultiAlarmAll | alertText1().value}}
        </div>
      </el-col>
    </el-row>
    <!--
          <el-row>
            <el-col :span="7">
              <div class="grid-content" style="font-size: 20px;">
                高度上限位：
              </div>
            </el-col>
            <el-col :span="5">
              <div :class="taji_data.HeightAlarm | alertText1().class" class="grid-content">
                {{taji_data.HeightAlarm | alertText1().value}}
              </div>
            </el-col>
          </el-row>
          -->

    <!--
          <el-row>
            <el-col :span="7">
              <div class="grid-content" style="font-size: 20px;">
                幅度内限位：
              </div>
            </el-col>
            <el-col :span="5">
              <div :class="taji_data.MinRangeAlarm | alertText1().class" class="grid-content">
                {{taji_data.MinRangeAlarm | alertText1().value}}
              </div>
            </el-col>
            <el-col :span="7">
              <div class="grid-content" style="font-size: 20px;">
                幅度外限位：
              </div>
            </el-col>
            <el-col :span="5">
              <div :class="taji_data.MaxRangeAlarm | alertText1().class" class="grid-content">
                {{taji_data.MaxRangeAlarm | alertText1().value}}
              </div>
            </el-col>
          </el-row>
        -->
    <!--
          <el-row>
            <el-col :span="10">
              <div class="grid-content">
                顺时针回转限位：
              </div>
            </el-col>
            <el-col :span="10">
              <div :class="taji_data.PosAngleAlarm | alertText1().class" class="grid-content">
                {{taji_data.PosAngleAlarm | alertText1().value}}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <div class="grid-content">
                逆时针回转限位：
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <div :class="taji_data.NegAngleAlarm | alertText1().class" class="grid-content">
                  {{taji_data.NegAngleAlarm | alertText1().value}}
                </div>
              </div>
            </el-col>
          </el-row>
          -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content" style="font-size: 12px;">上报时间：{{ taji_data.RTime }}</div>
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
