<style lang="scss">
  @import "./personQuitLeftDialog";

</style>
<template>
  <div class="person-info-dialog">
    <el-dialog :modal="false" top="0.5vh" width="400px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonQuitLeftDialogHandle" :visible.sync="personQuitLeftDialog.show" :title="dialogTitle">
      <div id="personQuitLeftForm" class="person-quit-left-form">
        <el-form ref="personQuitLeftDialog" :model="personQuitLeftData" label-position="left" label-width="120px"
          :inline="false" :validate-on-rule-change="true">
          <el-form-item prop="sfghaqm" label="是否归还安全帽：" :rules="ruleSfghaqm">
            <el-radio v-model="personQuitLeftData.sfghaqm" label="1">已归还</el-radio>
            <el-radio v-model="personQuitLeftData.sfghaqm" label="0">未归还</el-radio>
          </el-form-item>
          <el-form-item prop="sfzxk" label="是否注销卡：" :rules="ruleSfzxk">
            <el-radio v-model="personQuitLeftData.sfzxk" label="1">已注销</el-radio>
            <el-radio v-model="personQuitLeftData.sfzxk" label="0">未注销</el-radio>
          </el-form-item>
          <el-form-item prop="sfghzl" label="是否归还资料：" :rules="ruleSfghzl">
            <el-radio v-model="personQuitLeftData.sfghzl" label="1">已归还</el-radio>
            <el-radio v-model="personQuitLeftData.sfghzl" label="0">未归还</el-radio>
          </el-form-item>
          <el-form-item prop="sfwcjj" label="是否完成交接：" :rules="ruleSfwcjj">
            <el-radio v-model="personQuitLeftData.sfwcjj" label="1">已交接</el-radio>
            <el-radio v-model="personQuitLeftData.sfwcjj" label="0">未交接</el-radio>
          </el-form-item>
          <el-form-item prop="yy" label="原因：" :rules="ruleYy">
            <el-radio v-model="personQuitLeftData.yy" label="技术能力不足">技术能力不足</el-radio>
            <el-radio v-model="personQuitLeftData.yy" label="出勤率不足">出勤率不足</el-radio>
            <el-radio v-model="personQuitLeftData.yy" label="其他">其他</el-radio>
          </el-form-item>
          <!-- <div>备注：</div> -->
          <el-form-item label="备注：" inline="true">
          </el-form-item>
          <el-input type="textarea" v-model="personQuitLeftData.beizhu" :rows="6"></el-input>
          <hr class="hr1" />
          <div style="text-align: center">
            <el-button @click.native.prevent="submitlHandle" type="primary" size="mini">确定</el-button>
            <el-button @click="cancelHandle" size="mini" style="margin-left: 100px;">取消</el-button>
          </div>
        </el-form>
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
      const validateSfghaqm = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择是否归还安全帽'))
        } else {
          callback()
        }
      }
      const validateSfzxk = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择是否注销卡'))
        } else {
          callback()
        }
      }
      const validateSfghzl = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择是否归还资料'))
        } else {
          callback()
        }
      }
      const validateSfwcjj = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择是否完成交接'))
        } else {
          callback()
        }
      }
      const validateYy = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择原因'))
        } else {
          callback()
        }
      }
      return {
        dialogTitle: '',
        personQuitLeftData: {
          sfghaqm: '', // 是否归还安全帽
          sfzxk: '', // 是否注销卡
          sfghzl: '', // 是否归还资料
          sfwcjj: '', // 是否完成交接
          yy: '', //原因
          beizhu: '' //备注
        },
        ruleSfghaqm: [{ // 是否归还安全帽
          required: true,
          trigger: 'blur',
          validator: validateSfghaqm
        }],
        ruleSfzxk: [{ // 是否注销卡
          required: true,
          trigger: 'blur',
          validator: validateSfzxk
        }],
        ruleSfghzl: [{ // 是否归还资料
          required: true,
          trigger: 'blur',
          validator: validateSfghzl
        }],
        ruleSfwcjj: [{ // 是否完成交接
          required: true,
          trigger: 'blur',
          validator: validateSfwcjj
        }],
        ruleYy: [{ // 原因
          required: true,
          trigger: 'blur',
          validator: validateYy
        }],
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personQuitLeftDialog: {
        get: function () {
          return this.$store.state.project.personQuitLeftDialog
        },
        set: function (newValue) {
          this.$store.state.project.personQuitLeftDialog = newValue
        }
      }

    },
    created: function () {

      // this.src = pdf.createLoadingTask(this.src)
    },
    watch: {
      personQuitLeftDialog: {
        handler: function (newVal, oldVal) {
          if (newVal.show === true) {
            this.initData()
          } else {
            this.initData()
            this.$refs.personQuitLeftDialog.clearValidate(['sfghaqm', 'sfzxk', 'sfghzl', 'sfwcjj', 'yy'])
          }

        },
        deep: true
      },
    },
    methods: {
      initData() {
        this.personQuitLeftData = {
          sfghaqm: '', // 是否归还安全帽
          sfzxk: '', // 是否注销卡
          sfghzl: '', // 是否归还资料
          sfwcjj: '', // 是否完成交接
          yy: '', //原因
          beizhu: '' //备注
        }
        if (this.personQuitLeftDialog.op_status === 4) {
          this.dialogTitle = '开除 ' + this.personQuitLeftDialog.name
        }

      },
      // 打开窗口
      openPersonQuitLeftDialogHandle() {
        // console.log("----22222---")
      },
      cancelHandle() {
        const param = {
          show: false
        }
        this.$store.dispatch('SetPersonQuitLeftDialog', param).then(() => {}).catch(() => {

        })
      },
      submitlHandle() {
        this.$refs.personQuitLeftDialog.validate(valid => {
          if (valid) {
            let _tipName = ''
            if (this.personQuitLeftDialog.op_status === 4) {
              _tipName = `是否确定要开除${this.personQuitLeftDialog.name} ？`
            }
            this.$confirm(_tipName, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              // center: true
            }).then(() => {
              // cancel_card：是否注销卡0/1
              //   return_datum：是否归还资料0/1
              //   turn_over：是否交结工作0/1
              //   eturn_safety_helmet：是否归还安全帽
              //   score：评分
              //   resume_reason：离职原因10个人原因11项目结束12开除13更换部门
              const param = {
                method: 'quit_left',
                project_id: this.project_id,
                person_id: this.personQuitLeftDialog.person_id,
                status: 4, //-1注销0正常1需要激活2离职(辞职)3手动注销4开除10是默认值
                remark: this.personQuitLeftData.beizhu,
                return_safety_helmet: this.personQuitLeftData.sfghaqm,
                cancel_card: this.personQuitLeftData.sfzxk, //是否注销卡0/1
                return_datum: this.personQuitLeftData.sfghzl, //是否归还资料0/1
                turn_over: this.personQuitLeftData.sfwcjj, // 是否交结工作0/1
                resume_reason: this.personQuitLeftData.yy //离职原因10个人原因11项目结束12开除13更换部门


              }
              console.log('param', param)
              this.$store.dispatch('SetQuitLeft', param).then((data) => {
                console.log('data', data)
                if (data.status === 'success') {


                  this.$store.dispatch('SetPersonListChanged', {}).then(() => {})
                  this.$store.dispatch('SetPersonInfoChanged', {}).then(() => {})
                  this.$message({
                    message: `已经将 ${this.personQuitLeftDialog.name} 开除`,
                    type: 'success'
                  })

                  const param = {
                    show: false,
                  }
                  this.$store.dispatch('SetPersonQuitLeftDialog', param).then(() => {}).catch(() => {})
                }
              })

            }).catch(() => {

            });
          }
        })
      }

    },
    mounted() {


    }
  }

</script>
