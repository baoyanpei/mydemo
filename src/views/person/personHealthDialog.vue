<style lang="scss">
  @import "./personHealthDialog";

</style>
<template>
  <div class="person-health-dialog">
    <el-dialog :modal="true" top="2vh" width="570px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonHealthDialogHandle" @close="closePersonHealthDialogHandle"
      :visible.sync="personHealthDialog.show" :title="personHealthDialog.title">
      <div id="person-health-from" class="person-health-from">
        <el-form ref="personHealthForm" :model="personHealthForm" label-width="180px" :inline="false">
          <el-form-item prop="travelInfoList" label="节假日流动情况" :rules="ruleTravelInfo">
            <el-button type="success" :loading="loading" icon="el-icon-search"
              @click.native.prevent="openWorldCitysDialogHandle()" size="mini">添加
            </el-button>
            <el-table ref="travelInfoListTable" :data="personHealthForm.travelInfoList" size="mini" :show-header="false"
              header-align="center" :default-sort="{prop: 'name', order: 'ascending'}">
              <el-table-column property="name" sortable align="center" label="姓名" width="180" header-align="center">
                <template slot-scope="scope">
                  {{scope.row.name}}
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="warning" @click="handleDeleteClick(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item prop="BackDate" label="返兰日期" :rules="ruleBackDate">
            <el-date-picker type="date" v-model="personHealthForm.BackDate" name="BackDate" :editable="false"
              :clearable="false" placeholder="选择日期" size="mini" style="width: 140px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="useTraffic" label="外地返兰乘坐交通工具" :rules="ruleUseTraffic">
            <el-radio-group v-model="radioUseTraffic" size="mini" @change="changeRadioUseTrafficHandle">
              <el-radio-button label="飞机"></el-radio-button>
              <el-radio-button label="火车"></el-radio-button>
              <el-radio-button label="班车"></el-radio-button>
              <el-radio-button label="自驾"></el-radio-button>
              <el-radio-button label="其他"></el-radio-button>
            </el-radio-group>

            <el-form ref="UseTrafficForm" label-width="80px" style="width: 200px;margin-top: 10px;"
              class="UseTrafficForm">
              <div v-if="radioUseTraffic==='飞机'">
                <el-form-item label="航班号：">
                  <el-input placeholder="请输入航班号" v-model="personHealthForm.feijiHBH" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="座位：">
                  <el-input placeholder="请输入座位" v-model="personHealthForm.feijiZW" size="mini"></el-input>
                </el-form-item>
              </div>
              <div v-if="radioUseTraffic==='火车'">
                <el-form-item label="班次：">
                  <el-input placeholder="请输入班次" v-model="personHealthForm.huocheBC" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="座位：">
                  <el-input placeholder="请输入座位" v-model="personHealthForm.huocheZW" size="mini"></el-input>
                </el-form-item>
              </div>
              <div v-if="radioUseTraffic==='班车'">
                <el-form-item label="车牌号：">
                  <el-input placeholder="请输入车牌号" v-model="personHealthForm.bancheCPH" size="mini"></el-input>
                </el-form-item>
              </div>
              <div v-if="radioUseTraffic==='自驾'">
                <el-form-item label="车牌号：">
                  <el-input placeholder="请输入车牌号" v-model="personHealthForm.zijiaCPH" size="mini"></el-input>
                </el-form-item>
              </div>
              <div v-if="radioUseTraffic==='其他'">
                <el-form-item label="备注：">
                  <el-input placeholder="请输入备注" v-model="personHealthForm.jiaotongBZ" size="mini"></el-input>
                </el-form-item>
              </div>
            </el-form>

          </el-form-item>
          <el-form-item prop="travelInHb" label="有无重点区域旅居史" :rules="ruleTravelInHb">
            <el-radio v-model="personHealthForm.travelInHb" label="1">有</el-radio>
            <el-radio v-model="personHealthForm.travelInHb" label="0">无</el-radio>
          </el-form-item>
          <el-form-item prop="contactHb" label="有无接触重点区域人员" :rules="ruleContactHb">
            <el-radio v-model="personHealthForm.contactHb" label="1">有</el-radio>
            <el-radio v-model="personHealthForm.contactHb" label="0">无</el-radio>
          </el-form-item>
          <el-form-item prop="symptom" label="十四天内有无干咳等症状" :rules="ruleSymptom">
            <el-radio v-model="personHealthForm.symptom" label="1">有</el-radio>
            <el-radio v-model="personHealthForm.symptom" label="0">无</el-radio>
          </el-form-item>
        </el-form>
        <hr class="hr1" />
        <div style="text-align: right;">
          <el-button :loading="loading" @click.native.prevent="handleCloseDialog" size="mini">取消
          </el-button>
          <el-button type="success" :loading="loading" @click.native.prevent="handleSubmit()" size="mini">确定修改
          </el-button>
        </div>

      </div>
    </el-dialog>

  </div>

</template>

<script>
  import moment from 'moment'
  // import vpdf from 'vpdf'
  // import pdf from 'vue-pdf'
  // import vueshowpdf from 'vueshowpdf'
  export default {
    components: {
      // pdf
      // vueshowpdf
    },
    directives: {},

    data() {
      const validateInoutDaterange = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('必须选择返兰日期'))
        } else {
          callback()
        }
      }
      const validateTravelInHb = (rule, value, callback) => {
        if (value === -1) {
          callback(new Error('必须选择有无重点区域旅居史'))
        } else {
          callback()
        }
      }
      const validateContactHb = (rule, value, callback) => {
        if (value === -1) {
          callback(new Error('必须选择有无接触重点区域人员'))
        } else {
          callback()
        }
      }
      const validateSymptom = (rule, value, callback) => {
        if (value === -1) {
          callback(new Error('必须选择十四天内有无干咳等症状'))
        } else {
          callback()
        }
      }
      const validateTravelInfo = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('必须添加节假日流动情况'))
        } else {
          callback()
        }
      }
      const validateUseTraffic = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('必须填写外地返兰乘坐的交通工具'))
        } else {
          callback()
        }
      }


      return {
        loading: false,
        radioUseTraffic: '飞机',
        personHealthForm: {
          BackDate: '', // 时间范围
          travelInHb: -1,
          contactHb: -1,
          symptom: -1,
          travelInfoList: [],
          useTraffic: '',
          feijiHBH: '',
          feijiZW: '',
          huocheBC: '',
          huocheZW: '',
          bancheCPH: '',
          zijiaCPH: '',
          jiaotongBZ: ''
        },
        ruleBackDate: [{ //计划时间验证
          required: true,
          trigger: 'blur',
          validator: validateInoutDaterange
        }],
        ruleTravelInHb: [{ //
          required: true,
          trigger: 'blur',
          validator: validateTravelInHb
        }],
        ruleContactHb: [{ //
          required: true,
          trigger: 'blur',
          validator: validateContactHb
        }],
        ruleSymptom: [{ //
          required: true,
          trigger: 'blur',
          validator: validateSymptom
        }],
        ruleTravelInfo: [{ //
          required: true,
          trigger: 'blur',
          validator: validateTravelInfo
        }],
        ruleUseTraffic: [{ //
          required: true,
          trigger: 'blur',
          validator: validateUseTraffic
        }]
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personHealthDialog: {
        get: function () {
          return this.$store.state.health.personHealthDialog
        },
        set: function (newValue) {
          this.$store.state.health.personHealthDialog = newValue
        }
      },
      healthWorldCitysData: {
        get: function () {
          return this.$store.state.tools.healthWorldCitysData
        },
        set: function (newValue) {
          this.$store.state.tools.healthWorldCitysData = newValue
        }
      }
      // personInfoChanged() {
      //   return this.$store.state.project.personInfoChanged
      // }

    },
    created: function () {

      // this.src = pdf.createLoadingTask(this.src)
    },
    watch: {
      personHealthDialog: {
        handler: function (newVal, oldVal) {
          //   console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            // this.initData()
            // this.getProjectPersonInfo()
            // this.getPersonDatum()

          } else {
            // this.initData()
          }

        },
        deep: true
      },
      healthWorldCitysData: {
        handler: function (newVal, oldVal) {
          console.info('value newValnewVal ', newVal)
          this.personHealthForm.travelInfoList.push({
            name: newVal.name,
            id: newVal.id
          })
          console.log('travelInfoList', this.personHealthForm.travelInfoList)
        },
        deep: true
      },
      // personInfoChanged(curVal, oldVal) {
      //   this.initData()
      //   this.getProjectPersonInfo()
      // },
    },
    methods: {
      openPersonHealthDialogHandle() {
        // console.log("----22222---")
      },
      closePersonHealthDialogHandle() {
        this.clearAllData()
      },
      handleCloseDialog() {
        const param = {
          show: false,
          title: '',
        }
        this.$store.dispatch('SetHealthDialog', param).then(() => {}).catch(() => {

        })
      },
      clearAllData() {
        this.radioUseTraffic = '飞机'
        this.personHealthForm.BackDate = '' // 时间范围
        this.personHealthForm.travelInHb = -1
        this.personHealthForm.contactHb = -1
        this.personHealthForm.symptom = -1
        this.personHealthForm.travelInfoList = []
        this.clearUseTrafficData()
      },
      clearUseTrafficData() { // 清除交通工具的记录
        this.personHealthForm.feijiHBH = ''
        this.personHealthForm.feijiZW = ''
        this.personHealthForm.huocheBC = ''
        this.personHealthForm.huocheZW = ''
        this.personHealthForm.bancheCPH = ''
        this.personHealthForm.zijiaCPH = ''
        this.personHealthForm.jiaotongBZ = ''
        this.personHealthForm.useTraffic = ''
      },
      changeRadioUseTrafficHandle() {
        console.log('changeRadioUseTrafficHandle')
        this.clearUseTrafficData()
      },
      handleSubmit() {
        this.personHealthForm.useTraffic = ''
        switch (this.radioUseTraffic) {
          case "飞机":
            if (this.personHealthForm.feijiHBH !== '' && this.personHealthForm.feijiZW !== '') {
              this.personHealthForm.useTraffic =
                `${this.radioUseTraffic},航班号:${this.personHealthForm.feijiHBH},位置:${this.personHealthForm.feijiZW}`
            }
            break;
          case "火车":
            if (this.personHealthForm.huocheBC !== '' && this.personHealthForm.huocheZW !== '') {
              this.personHealthForm.useTraffic =
                `${this.radioUseTraffic},班次:${this.personHealthForm.huocheBC},座位:${this.personHealthForm.huocheZW}`
            }
            break;
          case "班车":
            if (this.personHealthForm.bancheCPH !== '') {
              this.personHealthForm.useTraffic =
                `${this.radioUseTraffic},车牌号:${this.personHealthForm.bancheCPH}`
            }
            break;
          case "自驾":
            if (this.personHealthForm.zijiaCPH !== '') {
              this.personHealthForm.useTraffic =
                `${this.radioUseTraffic},车牌号:${this.personHealthForm.zijiaCPH}`
            }
            break;
          case "其他":
            if (this.personHealthForm.jiaotongBZ !== '') {
              this.personHealthForm.useTraffic =
                `${this.radioUseTraffic},备注:${this.personHealthForm.jiaotongBZ}`
            }
            break;
        }
        console.log('this.personHealthForm.useTraffic', this.personHealthForm.useTraffic)

        /*
        feijiHBH: '',
        feijiZW: '',
        huocheBC: '',
        huocheZW: '',
        bancheCPH: '',
        zijiaCPH: '',
        jiaotongBZ: ''
        <el-radio-button label="飞机"></el-radio-button>
              <el-radio-button label="火车"></el-radio-button>
              <el-radio-button label="班车"></el-radio-button>
              <el-radio-button label="自驾"></el-radio-button>
              <el-radio-button label="其他"></el-radio-button>
        */

        this.$refs.personHealthForm.validate(valid => {
          if (valid) {
            // this.getData(isExport)

            let param = {
              use_traffic: this.personHealthForm.useTraffic
            }
            console.log('param', param)
          }
        })
      },
      openWorldCitysDialogHandle() {
        const param = {
          show: true,
        }
        this.$store.dispatch('SetWorldCitysDialog', param).then(() => {}).catch(() => {

        })
      },
      handleDeleteClick(data) {
        console.log('handleDeleteClick', data)
        let _travelInfoList = this.personHealthForm.travelInfoList
        for (var i = _travelInfoList.length - 1; i >= 0; i--) {
          let _travelInfo = _travelInfoList[i]
          if (_travelInfo.id === data.id) {
            _travelInfoList.splice(i, 1);
          }
        }
      }
    },
    mounted() {


    }
  }

</script>
