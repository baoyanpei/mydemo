<style lang="scss">
  @import "./personQuitLeftDialog";

</style>
<template>
  <div class="person-info-dialog">
    <el-dialog :modal="false" top="0.5vh" width="400px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonQuitLeftDialogHandle" :visible.sync="personQuitLeftDialog.show" :title="dialogTitle">
      <div id="person-quit-left-form" class="person-quit-left-form">
        <el-form ref="personQuitLeftDialog" :model="personQuitLeftData" label-position="left" label-width="110px"
          :inline="false">
          <el-form-item label="是否归还安全帽：">
            <el-radio v-model="personQuitLeftData.sfghaqm" label="1">已归还</el-radio>
            <el-radio v-model="personQuitLeftData.sfghaqm" label="2">未归还</el-radio>
          </el-form-item>
          <el-form-item label="是否注销卡：">
            <el-radio v-model="personQuitLeftData.sfzxk" label="1">已注销</el-radio>
            <el-radio v-model="personQuitLeftData.sfzxk" label="2">未注销</el-radio>
          </el-form-item>
          <el-form-item label="是否归还资料：">
            <el-radio v-model="personQuitLeftData.sfghzl" label="1">已归还</el-radio>
            <el-radio v-model="personQuitLeftData.sfghzl" label="2">未归还</el-radio>
          </el-form-item>
          <el-form-item label="是否完成交接：">
            <el-radio v-model="personQuitLeftData.sfwcjj" label="1">已交接</el-radio>
            <el-radio v-model="personQuitLeftData.sfwcjj" label="2">未交接</el-radio>
          </el-form-item>
          <el-form-item label="原因：">
            <el-radio v-model="personQuitLeftData.yy" label="1">技术能力不足</el-radio>
            <el-radio v-model="personQuitLeftData.yy" label="2">出勤率不足</el-radio>
            <el-radio v-model="personQuitLeftData.yy" label="3">其他</el-radio>
          </el-form-item>
          <!-- <div>备注：</div> -->
          <el-form-item label="备注：" inline="true">
          </el-form-item>
          <el-input type="textarea" v-model="personQuitLeftData.beizhu" :rows="6"></el-input>
          <hr class="hr1" />
          <div style="text-align: center">
            <el-button @click="submitlHandle" type="primary" @click="" size="mini">确定</el-button>
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
      return {
        dialogTitle: '',
        personQuitLeftData: {
          sfghaqm: '', // 是否归还安全码
          sfzxk: '', // 是否注销卡
          sfghzl: '', // 是否归还资料
          sfwcjj: '', // 是否完成交接
          yy: '', //原因
          beizhu: '' //备注
        }
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
          //   console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            this.initData()
            //   this.getProjectPersonInfo()
            //   this.getPersonDatum()
          } else {
            this.initData()
          }

        },
        deep: true
      },
    },
    methods: {
      initData() {
        // console.log('this.personQuitLeftDialog', this.personQuitLeftDialog)
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
      submitlHandle(){
          
      }

    },
    mounted() {


    }
  }

</script>
