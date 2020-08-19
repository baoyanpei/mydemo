<style lang="scss">
  @import "./logsPersonComfirmDialog";

</style>

<template>
  <el-dialog :modal="false" custom-class="ryxx-dialog" width="450px" top="20vh" :lock-scroll="true"
    :close-on-click-modal="false" @open="openLogsPersonComfirmDialogHandle" :visible.sync="logsPersonComfirmDialog.show"
    title="确认为本人">
    <div id="logs-rerson-comfirm-dialog" class="logs-rerson-comfirm-dialog">

      <el-form v-if="compare===2" label-width="30px" size="small">
        <el-form-item>
          是否确定设置此人<span style="color:blue;">是 <b>{{person_name}}</b> 本人</span>，识别率低的原因为：
        </el-form-item>
        <el-form-item>
          <el-radio v-model="remark" label="1|无人脸">1.无人脸</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="remark" label="2|人脸过小">2.人脸过小</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="remark" label="3|戴口罩或围巾">3.戴口罩或围巾</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="remark" label="4|安全帽遮挡">4.安全帽遮挡</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="remark" label="5|人多">5.人多</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="remark" label="6|其他">6.其他</el-radio>
        </el-form-item>

      </el-form>
      <el-form v-if="compare===3" label-width="30px" size="small">
        <el-form-item style="padding:40px;">
          是否确定设置此人<span style="color:red;">不是 <b>{{person_name}}</b> 本人。</span>
        </el-form-item>
      </el-form>
    </div>
    <hr class="hr1" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="logsPersonComfirmDialog.show = false" size="small">取 消</el-button>
      <el-button @click="logsPersonComfirmSubmit" type="primary" size="small" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  //   import moment from 'moment'
  //   import lodash from 'lodash'
  // import Mock from 'mockjs'
  export default {
    components: {},
    directives: {},
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      logsPersonComfirmDialog: {
        get: function () {
          return this.$store.state.person.logsPersonComfirmDialog
        },
        set: function (newValue) {
          this.$store.state.person.logsPersonComfirmDialog = newValue
        }
      }
    },
    data() {
      return {
        loading: false,
        remark: '',
        personInfo: null,
        person_name: '',
        compare: -1,
        log_id: 0
      }
    },
    created: function () {
      this.loading = false

    },
    watch: {
      logsPersonComfirmDialog: {
        handler: function (newVal, oldVal) {
          console.info('logsPersonComfirmDialog value changed ', newVal)

          //   this.initData()
          //   this.getPersonInfo()
        },
        deep: true
      }

    },
    methods: {
      // 打开窗口后的handle
      openLogsPersonComfirmDialogHandle() {
        // console.log('openLogsPersonComfirmDialogHandle')

        this.personInfo = this.logsPersonComfirmDialog.personInfo
        console.log("this.personInfo", this.personInfo)
        this.person_name = this.personInfo.name
        this.compare = this.logsPersonComfirmDialog.compare
        //打开窗口的mask
        // this.loadingInstance = Loading.service({
        //   // fullscreen: true,
        //   target: '#inout-from'
        // });
      },
      closeDialog() {
        const param = {
          show: false,
          personInfo: null,
          compare: -1
        }
        this.$store.dispatch('SetLogsPersonComfirmDialog', param).then(() => {}).catch(() => {})
      },
      logsPersonComfirmSubmit() {

        console.log('1', this.compare, this.remark)
        if (this.compare === 2 && this.remark === "") {
          this.$message({
            message: '请选择识别率低的原因！',
            type: 'error'
          })
          return
        }
        console.log('2')
        this.loading = true
        let param = {
          method: 'logs_person_comfirm',
          project_id: this.project_id,
          id: this.personInfo.last_in_log.id,
          compare: this.compare,
          remark: this.remark
        }
        if (this.compare === 2) {
          param.remark = this.remark
        } else {
          param.remark = ""
        }

        // console.log('param', param)
        // this.personNowInList = []
        this.$store.dispatch('queryLogsPersonComfirm', param).then(() => {
          // this.initData()
          // this.getPersonInfo()
          this.loading = false
          this.$message({
            message: `设置成功！`,
            type: 'success'
          })
          this.closeDialog()
          this.$store.dispatch('SetPersonNowinChanged', {}).then(() => {
            // console.log('this.projectGroupList1', this.projectGroupList)
            // this.appendGroupData()
          }).catch(() => {

          })

        }).catch(() => {
          this.loading = false
        })
      }
    },
    mounted() {}
  }

</script>
