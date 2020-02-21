<style lang="scss">
  @import "./personHealthDialog";

</style>
<template>
  <div class="person-health-dialog">
    <el-dialog :modal="true" top="13vh" width="570px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonFaceHealthDialogHandle" :visible.sync="personHealthDialog.show"
      :title="personHealthDialog.title">
      <div id="person-health-from" class="person-health-from">
        <el-form ref="personHealthForm" :model="personHealthForm" label-width="180px" :inline="false">
          <el-form-item label="节假日流动情况">
            <el-button type="success" :loading="loading" icon="el-icon-search"
              @click.native.prevent="openWorldCitysDialogHandle()" size="mini">添加
            </el-button>
          </el-form-item>
          <el-form-item prop="BackDate" label="返兰日期" :rules="ruleBackDate">
            <el-date-picker type="date" v-model="personHealthForm.BackDate" name="BackDate" :editable="false"
              :clearable="false" placeholder="选择日期" size="mini">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="useTraffic" label="外地返兰乘坐交通工具">
            <el-radio-group v-model="radioUseTraffic" size="mini">
              <el-radio-button label="飞机"></el-radio-button>
              <el-radio-button label="火车"></el-radio-button>
              <el-radio-button label="班车"></el-radio-button>
              <el-radio-button label="自驾"></el-radio-button>
              <el-radio-button label="其他"></el-radio-button>
            </el-radio-group>

            <el-form ref="UseTrafficForm" label-width="80px" style="width: 200px;;">
              <div v-if="radioUseTraffic==='飞机'">
                <el-form-item label="航班号：">
                  <el-input placeholder="请输入航班号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="位置：">
                  <el-input placeholder="请输入位置" size="mini"></el-input>
                </el-form-item>
              </div>
              <div v-if="radioUseTraffic==='火车'">
                <el-form-item label="班次：">
                  <el-input placeholder="请输入火车班次" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="座位：">
                  <el-input placeholder="请输入位置" size="mini"></el-input>
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
          callback(new Error('必须选择反兰日期'))
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
      return {
        loading: false,
        radioUseTraffic: '飞机',
        personHealthForm: {
          BackDate: '', // 时间范围
          travelInHb: -1,
          contactHb: -1,
          symptom: -1
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
      // personInfoChanged(curVal, oldVal) {
      //   this.initData()
      //   this.getProjectPersonInfo()
      // },
    },
    methods: {
      openPersonFaceHealthDialogHandle() {
        // console.log("----22222---")
      },
      handleCloseDialog() {

      },
      handleSubmit() {
        this.$refs.personHealthForm.validate(valid => {
          if (valid) {
            // this.getData(isExport)
            console.log('12312313')
          }
        })
      },
      openWorldCitysDialogHandle() {
        const param = {
          show: true,
        }
        this.$store.dispatch('SetWorldCitysDialog', param).then(() => {}).catch(() => {

        })
      }
    },
    mounted() {


    }
  }

</script>
