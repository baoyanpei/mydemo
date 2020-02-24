<style lang="scss">
  @import "./personHealthDayDialog";

</style>
<template>
  <div class="person-health-day-dialog">
    <el-dialog :modal="true" width="500px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonHealthDayDialogHandle" @close="closePersonHealthDayDialogHandle"
      :visible.sync="personHealthDayDialog.show" :title="title">
      <div id="person-health-day-from" class="person-health-day-from">
        <el-form ref="personHealthDayForm" :model="personHealthDayForm" label-width="200px" :inline="false">
          <el-form-item prop="temp" label="体温" :rules="ruleTemp">
            <el-input-number size="mini" v-model="personHealthDayForm.temp" :step="0.1" :precision="1">
            </el-input-number>
          </el-form-item>
          <el-form-item prop="give_out_heat" label="有无发热" :rules="ruleGiveOutHeat">
            <el-radio v-model="personHealthDayForm.give_out_heat" label="1">有</el-radio>
            <el-radio v-model="personHealthDayForm.give_out_heat" label="0">无</el-radio>
          </el-form-item>
          <el-form-item prop="cough" label="有无干咳等症状" :rules="ruleCough">
            <el-radio v-model="personHealthDayForm.cough" label="1">有</el-radio>
            <el-radio v-model="personHealthDayForm.cough" label="0">无</el-radio>
          </el-form-item>
          <el-form-item prop="symptom" label="过去十四天，有无以下症状" :rules="ruleSymptom">
            <el-checkbox-group v-model="symptomList">
              <el-checkbox label="发热" @change="handleSymptomCheckChange"></el-checkbox>
              <el-checkbox label="咳嗽" @change="handleSymptomCheckChange"></el-checkbox>
              <el-checkbox label="嗓子痛" @change="handleSymptomCheckChange"></el-checkbox>
              <el-checkbox label="胸闷" @change="handleSymptomCheckChange"></el-checkbox>
              <el-checkbox label="呼吸困难" @change="handleSymptomCheckChange"></el-checkbox>
              <el-checkbox label="腹泻" @change="handleSymptomCheckChange"></el-checkbox>
            </el-checkbox-group>
            <el-checkbox label="无上述症状" v-model="noSymptom" @change="handleNoSymptomCheckChange"></el-checkbox>
          </el-form-item>



        </el-form>
        <hr class="hr1" />
        <div style="text-align: center;">

          <el-button type="success" :loading="loading" @click.native.prevent="handleSubmit()" style="width: 80%;">提交
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
      const validateTemp = (rule, value, callback) => {
        if (value === undefined) {
          callback(new Error('必须设置体温'))
        } else {
          callback()
        }
      }
      const validateGiveOutHeat = (rule, value, callback) => {
        if (value === -1) {
          callback(new Error('必须选择有无发热'))
        } else {
          callback()
        }
      }
      const validateCough = (rule, value, callback) => {
        if (value === -1) {
          callback(new Error('必须选择有无干咳等症状'))
        } else {
          callback()
        }
      }

      const validateSymptom = (rule, value, callback) => {
        if (this.noSymptom === false && this.symptomList.length === 0) {
          callback(new Error('必须选择过去十四天，有无以下症状'))
        } else {
          callback()
        }
      }

      return {
        loading: false,
        title: '记录每日体温',
        symptomList: [],
        noSymptom: false,
        personHealthDayForm: {
          temp: 36.0,
          give_out_heat: -1,
          cough: -1,
          symptom: ''
        },
        ruleTemp: [{
          required: true,
          trigger: 'blur',
          validator: validateTemp
        }],
        ruleGiveOutHeat: [{
          required: true,
          trigger: 'blur',
          validator: validateGiveOutHeat
        }],
        ruleCough: [{
          required: true,
          trigger: 'blur',
          validator: validateCough
        }],

        ruleSymptom: [{
          required: true,
          trigger: 'blur',
          validator: validateSymptom
        }],
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personHealthDayDialog: {
        get: function () {
          return this.$store.state.health.personHealthDayDialog
        },
        set: function (newValue) {
          this.$store.state.health.personHealthDayDialog = newValue
        }
      },
    },
    created: function () {

      // this.src = pdf.createLoadingTask(this.src)
    },
    watch: {
      personHealthDayDialog: {
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

    },
    methods: {
      openPersonHealthDayDialogHandle() {
        console.log('personHealthDayDialog', this.personHealthDayDialog)
      },
      closePersonHealthDayDialogHandle() {

        this.clearData()
      },
      clearData() {
        this.symptomList = []
        this.personHealthDayForm.temp = 36.0
        this.personHealthDayForm.give_out_heat = -1
        this.personHealthDayForm.cough = -1
        this.personHealthDayForm.symptom = ""
        this.$refs.personHealthDayForm.resetFields();
      },
      handleCloseDialog() {
        const param = {
          show: false,
        }
        this.$store.dispatch('SetHealthDayDialog', param).then(() => {}).catch(() => {

        })
      },
      handleSubmit() {
        // console.log('this.symptomList0', this.symptomList)
        this.$refs.personHealthDayForm.validate(valid => {
          if (valid) {
            // console.log('12313123', this.personHealthDayForm.temp)

            if (this.symptomList.length > 0) {
              this.personHealthDayForm.symptom = this.symptomList.join(',')
            } else {
              this.personHealthDayForm.symptom = '无上述症状'
            }

            let param = {
              method: 'person_health_day',
              project_id: this.project_id,
              person_id: this.personHealthDayDialog.person_id,
              temp: this.personHealthDayForm.temp, //体温
              give_out_heat: parseInt(this.personHealthDayForm.give_out_heat), //有无发热0无1有
              cough: parseInt(this.personHealthDayForm.cough), //有无干咳0无1有
              symptom: this.personHealthDayForm.symptom, //有无以下症状
              contact_hb: 0,
              remark: ''
            }
            console.log('param', param)
            this.$store.dispatch('SetPersonHealthDay', param).then((personList) => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.loading = false
              this.$store.dispatch('SetPersonHealthDayChanged', {}).then(() => {})
              this.handleCloseDialog()
            })
          }
        })
      },
      handleSymptomCheckChange(value) {
        console.log('value1', value)
        if (value === true) {
          this.noSymptom = false
        }

      },
      handleNoSymptomCheckChange(value) {
        console.log('value0', value)
        if (value === true) {
          this.symptomList = []
        }
      }
    },
    mounted() {


    }
  }

</script>
