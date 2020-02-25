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
            <el-table ref="travelInfoListTable" :data="personHealthForm.travelInfoList" height="100px" size="mini"
              :show-header="false" header-align="center" :default-sort="{prop: 'name', order: 'ascending'}"
              empty-text="请添加节假日流动情况">
              <el-table-column property="name" sortable align="center" label="姓名" width="180" header-align="center">
                <template slot-scope="scope">
                  {{scope.row.name}}
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="warning" @click="handlePersonHealtDeleteClick(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item prop="BackDate" label="返项目日期" :rules="ruleBackDate">
            <el-date-picker type="date" v-model="personHealthForm.BackDate" name="BackDate" :editable="false"
              :clearable="false" placeholder="选择日期" size="mini" style="width: 140px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="useTrafficList" label="外地返项目乘坐交通工具" :rules="ruleUseTraffic">
            <el-button type="success" :loading="loading" icon="el-icon-search"
              @click.native.prevent="openUseTrafficDialogHandle()" size="mini">添加
            </el-button>
            <el-table ref="useTrafficListTable" :data="personHealthForm.useTrafficList" height="100px" size="mini"
              :show-header="false" header-align="center" :default-sort="{prop: 'name', order: 'ascending'}"
              empty-text="请添加外地返项目乘坐交通工具">
              <el-table-column property="name" sortable align="center" label="姓名" width="180" header-align="center">
                <template slot-scope="scope">
                  {{scope.row.name}}
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="warning" @click="handleUseTrafficDeleteClick(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-radio-group v-model="radioUseTraffic" size="mini" @change="changeRadioUseTrafficHandle">
              <el-radio-button label="飞机"></el-radio-button>
              <el-radio-button label="火车"></el-radio-button>
              <el-radio-button label="班车"></el-radio-button>
              <el-radio-button label="自驾"></el-radio-button>
              <el-radio-button label="其他"></el-radio-button>
            </el-radio-group> -->

            <!-- <el-form ref="UseTrafficForm" label-width="80px" style="width: 200px;margin-top: 10px;"
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
            </el-form> -->

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
          <el-button type="success" :loading="loading" @click.native.prevent="handleSubmit()" size="mini">确定
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
          callback(new Error('必须选择返项目日期'))
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
        if (value.length === 0) {
          callback(new Error('必须填写外地返项目乘坐的交通工具'))
        } else {
          callback()
        }
      }


      return {
        loading: false,
        // radioUseTraffic: '飞机',
        person_id: -1,
        personHealthForm: {
          BackDate: '', // 时间范围
          travelInHb: -1,
          contactHb: -1,
          symptom: -1,
          travelInfoList: [],
          useTrafficList: [],
          // useTraffic: '',
          // feijiHBH: '',
          // feijiZW: '',
          // huocheBC: '',
          // huocheZW: '',
          // bancheCPH: '',
          // zijiaCPH: '',
          // jiaotongBZ: ''
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
        }],
        personHealthInfo: null
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
          // console.info('value newValnewVal ', newVal)
          this.personHealthForm.travelInfoList.push({
            name: newVal.name,
            id: newVal.id
          })
          // console.log('travelInfoList', this.personHealthForm.travelInfoList)
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
        console.log("----personHealthDialog---", this.personHealthDialog)
        this.person_id = this.personHealthDialog.person_id
        this.getPersonHealth()
      },
      closePersonHealthDialogHandle() {
        this.clearAllData()
        this.$refs.personHealthForm.resetFields();
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
        // this.radioUseTraffic = '飞机'
        this.personHealthForm.BackDate = '' // 时间范围
        this.personHealthForm.travelInHb = -1
        this.personHealthForm.contactHb = -1
        this.personHealthForm.symptom = -1
        this.personHealthForm.travelInfoList = []
        // this.personHealthForm.useTraffic = ''
        this.personHealthForm.useTrafficList = []
        // this.clearUseTrafficData()
        this.personHealthInfo = null
        this.loading = false
      },
      // clearUseTrafficData() { // 清除交通工具的记录
      //   this.personHealthForm.feijiHBH = ''
      //   this.personHealthForm.feijiZW = ''
      //   this.personHealthForm.huocheBC = ''
      //   this.personHealthForm.huocheZW = ''
      //   this.personHealthForm.bancheCPH = ''
      //   this.personHealthForm.zijiaCPH = ''
      //   this.personHealthForm.jiaotongBZ = ''
      //   this.personHealthForm.useTraffic = ''
      // },
      getPersonHealth() {
        const param = {
          method: 'person_health_list',
          project_id: this.project_id,
          person_id: this.person_id
        }
        this.$store.dispatch('GetPersonHealthList', param).then((personHealth) => {
          // console.log("健康记录查询", personHealth)
          if (personHealth.length !== 0) {
            this.personHealthInfo = personHealth[0]
            console.log('this.personHealthInfo', this.personHealthInfo)

            this.personHealthForm.travelInHb = this.personHealthInfo.travel_in_hb.toString()
            this.personHealthForm.contactHb = this.personHealthInfo.contact_hb.toString()
            this.personHealthForm.symptom = this.personHealthInfo.symptom.toString()
            this.personHealthForm.BackDate = this.personHealthInfo.back_date.toString()
            let travelInfoArray = this.personHealthInfo.travel_info.split(',')
            // console.log('travelInfoArray', travelInfoArray)
            travelInfoArray.forEach(travelInfo => {
              const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
              this.personHealthForm.travelInfoList.push({
                name: travelInfo,
                id: genRandom(1, 1000)
              })
            })

            const useTrafficListArray = this.personHealthInfo.use_traffic.split(',')
            console.log('useTrafficListArray', useTrafficListArray)
            useTrafficListArray.forEach(useTrafficInfo => {
              const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
              this.personHealthForm.useTrafficList.push({
                name: useTrafficInfo,
                id: genRandom(1, 1000)
              })
              /*
              const useTrafficArray = useTrafficList.split('－')
              console.log('useTrafficArray', useTrafficArray)
              let _trafficType = useTrafficArray[0]
              this.radioUseTraffic = _trafficType
              if (useTrafficArray[1] !== undefined) {
                switch (_trafficType) {
                  case "飞机":
                    const _feijiHBHArray = useTrafficArray[1].split(':')
                    // console.log('_feijiHBHArray', _feijiHBHArray)
                    if (_feijiHBHArray[0] === '航班号') {
                      this.personHealthForm.feijiHBH = _feijiHBHArray[1]
                    }
                    const _feijiWZHArray = useTrafficArray[2].split(':')
                    // console.log('_feijiHBHArray', _feijiHBHArray)
                    if (_feijiWZHArray[0] === '位置') {
                      this.personHealthForm.feijiZW = _feijiWZHArray[1]
                    }
                    break
                  case "火车":
                    const _houcheHBHArray = useTrafficArray[1].split(':')
                    // console.log('_feijiHBHArray', _feijiHBHArray)
                    if (_houcheHBHArray[0] === '车次') {
                      this.personHealthForm.huocheBC = _houcheHBHArray[1]
                    }
                    const _feijiZWHArray = useTrafficArray[2].split(':')
                    // console.log('_feijiHBHArray', _feijiHBHArray)
                    if (_feijiZWHArray[0] === '座位') {
                      this.personHealthForm.huocheZW = _feijiZWHArray[1]
                    }
                    break
                  case "班车":
                    const _bancheCPHHArray = useTrafficArray[1].split(':')
                    // console.log('_feijiHBHArray', _feijiHBHArray)
                    if (_bancheCPHHArray[0] === '车牌号') {
                      this.personHealthForm.bancheCPH = _bancheCPHHArray[1]
                    }

                    break
                  case "自驾":

                    const _cphArray = useTrafficArray[1].split(':')
                    if (_cphArray[0] === '车牌号') {
                      this.personHealthForm.zijiaCPH = _cphArray[1]
                    }
                    // console.log('useTrafficArrayuseTrafficArray',useTrafficArray[2]) 
                    break
                  case "其他":
                    const _jiaotongBZArray = useTrafficArray[1].split(':')
                    if (_jiaotongBZArray[0] === '备注') {
                      this.personHealthForm.jiaotongBZ = _jiaotongBZArray[1]
                    }
                    break
                }
              }*/
            })
          }
        }).catch(() => {

        })
      },
      // changeRadioUseTrafficHandle() {
      //   // console.log('changeRadioUseTrafficHandle')
      //   // this.clearUseTrafficData()
      // },
      handleSubmit() {
        // console.log('aaa',moment(this.personHealthForm.BackDate).format("YYYY-MM-DD"))
        // this.personHealthForm.useTraffic = ''
        let _useTrafficList = []
        this.personHealthForm.useTrafficList.forEach(useTraffic => {
          _useTrafficList.push(useTraffic.name)
        })
        // if (this.personHealthForm.feijiHBH !== '' || this.personHealthForm.feijiZW !== '') {
        //   useTrafficList.push(`飞机－航班号:${this.personHealthForm.feijiHBH}－位置:${this.personHealthForm.feijiZW}`)
        // }
        // if (this.personHealthForm.huocheBC !== '' || this.personHealthForm.huocheZW !== '') {
        //   useTrafficList.push(`火车－车次:${this.personHealthForm.huocheBC}－座位:${this.personHealthForm.huocheZW}`)
        // }
        // if (this.personHealthForm.bancheCPH !== '') {
        //   useTrafficList.push(`班车－车牌号:${this.personHealthForm.bancheCPH}`)
        // }
        // if (this.personHealthForm.zijiaCPH !== '') {
        //   useTrafficList.push(`自驾－车牌号:${this.personHealthForm.zijiaCPH}`)
        // }
        // if (this.personHealthForm.jiaotongBZ !== '') {
        //   useTrafficList.push(`其他－备注:${this.personHealthForm.jiaotongBZ}`)
        // }
        let traffic_info = _useTrafficList.join(',')
        // console.log('this.personHealthForm.useTraffic', this.personHealthForm.useTraffic)
        // console.log('this.personHealthForm.travelInfoList', this.personHealthForm.travelInfoList)
        let _travelInfoList = []
        this.personHealthForm.travelInfoList.forEach(travelInfo => {
          _travelInfoList.push(travelInfo.name)
        })
        let travel_info = _travelInfoList.join(",")
        // console.log('travel_info', travel_info)
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

        project_id:必选
        person_id:必须
        travel_info:节日期间流动情况
        travel_in_hb:有无疫情重点区域旅居史0无1有
        contact_hb:有无接触疫情重占区域人员0无1有
        back_date:返回日期
        use_traffic:所使用交通工具 
        symptom:14天内有无发热、干咳症状 0无，1有
        remark:备注,
        id:可选（有为更新，无为新增）

        */

        this.$refs.personHealthForm.validate(valid => {
          if (valid) {
            // this.getData(isExport)
            this.loading = true
            this.$confirm('是否确定要添加/修改健康情况?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              // center: true
            }).then(() => {
              let param = {
                method: 'person_health',
                project_id: this.project_id,
                person_id: this.personHealthDialog.person_id,
                travel_info: travel_info,
                travel_in_hb: this.personHealthForm.travelInHb,
                contact_hb: this.personHealthForm.contactHb,
                symptom: this.personHealthForm.symptom,
                back_date: moment(this.personHealthForm.BackDate).format("YYYY-MM-DD"),
                use_traffic: traffic_info //this.personHealthForm.useTraffic
              }
              if (this.personHealthInfo !== null) {
                param['id'] = this.personHealthInfo.id
              }
              console.log('param', param)
              return;
              this.$store.dispatch('SetPersonHealth', param).then((personList) => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.loading = false
                this.$store.dispatch('SetPersonListChanged', {}).then(() => {})
                this.handleCloseDialog()
              })
            }).catch(() => {
              this.loading = false
            });


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
      handlePersonHealtDeleteClick(data) {
        // console.log('handlePersonHealtDeleteClick', data)
        let _travelInfoList = this.personHealthForm.travelInfoList
        for (var i = _travelInfoList.length - 1; i >= 0; i--) {
          let _travelInfo = _travelInfoList[i]
          if (_travelInfo.id === data.id) {
            _travelInfoList.splice(i, 1);
          }
        }
      },
      openUseTrafficDialogHandle() {
        const param = {
          show: true,
        }
        this.$store.dispatch('SetUseTrafficDialog', param).then(() => {}).catch(() => {

        })
      },
      handleUseTrafficDeleteClick(data) {
        // console.log('handlePersonHealtDeleteClick', data)
        let _useTrafficList = this.personHealthForm.useTrafficList
        for (var i = _useTrafficList.length - 1; i >= 0; i--) {
          let _trafficInfo = _useTrafficList[i]
          if (_trafficInfo.id === data.id) {
            _useTrafficList.splice(i, 1);
          }
        }
      },
    },
    mounted() {


    }
  }

</script>
