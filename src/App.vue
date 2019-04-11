<template>
  <div id="app">
    <router-view />
    <InoutForm></InoutForm>
    <!-- <NowinForm></NowinForm> -->
    <el-dialog :modal="false" custom-class="ryxx-dialog" width="800px" top="1vh" :lock-scroll="true"
      :close-on-click-modal="false" @open="openPersonFullCalendarDialogHandle"
      :visible.sync="personFullCalenderDialog.show" title="日历">
      <PersonFullCalender></PersonFullCalender>
    </el-dialog>
    <el-dialog :modal="false" top="0.5vh" width="800px" :lock-scroll="true" :close-on-click-modal="false"
      :visible.sync="worktimeFullCalendarDialog.show"
      :title="worktimeFullCalendarDialog.dialogTitle">
      <!--人员上工日历dialog-->
      <WorktimeFullCalendarDialog></WorktimeFullCalendarDialog>


    </el-dialog>

    <!-- <NowinForm></NowinForm> -->
    <!--场内人员清单对话框-->
    <NowinDialog></NowinDialog>
    <PersonFacePercentDetailForm></PersonFacePercentDetailForm>
    <InOutPersonDetailDialog></InOutPersonDetailDialog>
    <PersonGoOutDialog></PersonGoOutDialog>
    <LogsPersonComfirmDialog></LogsPersonComfirmDialog>
    <!--人员详细信息对话框-->
    <PersonInfoDialog></PersonInfoDialog>
    <!--人员辞退、辞职对话框-->
    <PersonQuitLeftDialog></PersonQuitLeftDialog>
    <!--人员信息对话框-->
    <PersonListDialog></PersonListDialog>

    <!--发布信息对话框-->
    <PublishDialog></PublishDialog>

  </div>
</template>

<script>
  // 引入IndexedDB
  // import IndexedDB from './indexedDB/IndexedDB'
  // import ModelDetail from './views/model3D/modelDetail'
  // import RyxxForm from './views/main/components/ryxxForm'
  import InoutForm from './views/person/inoutForm'
  // import NowinForm from './views/person/nowinForm'
  import PersonFullCalender from './views/person/fullCalender'
  import PersonFacePercentDetailForm from './views/person/facePercentDetailForm'
  import InOutPersonDetailDialog from './views/person/inOutPersonDetailDialog'
  // 人员信息信息dialog
  import PersonInfoDialog from './views/person/personInfoDialog'

  // 人员辞退、辞职dialog
  import PersonQuitLeftDialog from './views/person/personQuitLeftDialog'

  // 场内人员dialog
  import NowinDialog from './views/person/nowinDialog'

  // 人员上工日历dialog
  import WorktimeFullCalendarDialog from './views/person/worktimeFullCalendarDialog'

  // 人员信息dialog
  import PersonListDialog from './views/person/personListDialog'

  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import PersonGoOutDialog from './views/person/personGoOutDialog'
  import LogsPersonComfirmDialog from './views/person/logsPersonComfirmDialog'

  import PublishDialog from './views/publish/publishDialog'
  export default {
    name: 'App',
    components: {
      // ModelDetail,
      // RyxxForm,
      InoutForm,
      // NowinForm,
      NowinDialog,
      PersonFullCalender,
      PersonFacePercentDetailForm,
      InOutPersonDetailDialog,
      PersonGoOutDialog,
      LogsPersonComfirmDialog,
      PersonInfoDialog,
      PersonQuitLeftDialog,
      PersonListDialog,
      WorktimeFullCalendarDialog,
      PublishDialog
    },
    directives: {
      elDragDialog
    },
    data() {
      return {
        // dialogRYXXVisible: true
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personFullCalenderDialog: {
        get: function () {
          return this.$store.state.project.personFullCalenderDialog
        },
        set: function (newValue) {
          this.$store.state.project.personFullCalenderDialog = newValue
        }
      },
      worktimeFullCalendarDialog: {
        get: function () {
          return this.$store.state.project.worktimeFullCalendarDialog
        },
        set: function (newValue) {
          this.$store.state.project.worktimeFullCalendarDialog = newValue
        }
      },
      personInfo() {
        return this.$store.state.person.personInfo
      },

    },
    watch: {
      '$route'(to, from) {
        // console.log("totototo", to)
        if (to.name !== "login" && to.name !== "wxbindtip" && this.personInfo === null) {
          this.getPerson()
        }
      }
    },
    created() {
      // console.log("App - created")

    },
    mounted() {},
    methods: {
      getPerson() {
        const param = {
          method: 'query'
        }
        this.$store.dispatch('QueryPersonInfo', param).then(() => {
          this.setProjectInfo();

        }).catch(() => {
          this.loading = false
        })
      },
      setProjectInfo() {
        this.$store.dispatch('setProjectInfo', this.personInfo).then(() => {

        }).catch(() => {
          this.loading = false
        })


      },
      // 打开窗口
      openPersonFullCalendarDialogHandle() {
        console.log('openPersonFullCalendarDialogHandle')
        // this.renderFullCalender()
        //打开窗口的mask
        // this.loadingInstance = Loading.service({
        //   // fullscreen: true,
        //   target: '#inout-from'
        // });

      },
    }
  }

</script>
<style>
  .hr1 {
    border-top: 1px solid #eeeeee;
    border-bottom: 0px;
  }

  .span-link1 {
    padding-bottom: 1px;
    border-bottom: 1px dashed #999999;
    color: #E6A23C;
    cursor: pointer;
  }

  .el-dialog__header {
    padding: 5px 20px 5px;
    background-color: #2cbc9d;
  }

  .el-dialog__title {
    line-height: 24px;
    font-size: 16px;
    color: #FFFFFF;
  }

  .el-dialog__headerbtn {
    top: 10px;
    color: #FFFFFF;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #FFFFFF;
  }

  .el-dialog__wrapper {
    /*穿透该层*/
    pointer-events: none;
  }

  .el-dialog {
    /*恢复点击处理*/
    pointer-events: auto;
  }

  .el-radio__input.is-checked+.el-radio__label {
    color: #FFFFFF;
  }

  .el-button--primary {
    color: #fff;
    background-color: #29BB9C;
    border-color: #29BB9C;
  }

  .el-button--primary:hover {
    color: #fff;
    background-color: rgb(117, 192, 151);
    border-color: rgb(117, 192, 151);
  }

  .el-button--primary:focus,
  .el-button--primary:hover {
    background: #29BB9C;
    border-color: #29BB9C;
  }

  .el-message-box__headerbtn {
    top: 8px;
  }

  .el-message-box {
    border-radius: 0px;
    border: 0px;
  }

  .el-message-box__status.el-icon-warning {
    color: #FF0000;
  }

  .el-message-box__status.el-icon-warning {
    color: #FF0000;
    font-size: 40px !important;
  }

  .el-message-box__status+.el-message-box__message {
    padding-left: 56px;
    padding-right: 12px;
  }

  .el-message-box__content {
    position: relative;
    padding: 30px 15px;
    color: #606266;
    font-size: 14px;
  }

  /* background-color: #2cbc9d;*/
  .el-message-box__header {
    position: relative;
    padding: 8px 15px 8px;
    border-bottom: 1px solid #eeeeee;
    background-color: #2cbc9d;
  }

  .el-message-box__headerbtn .el-message-box__close {
    color: #FFFFFF;
  }

  .el-message-box__title {
    color: #FFFFFF;
  }

  .el-message-box__btns {
    padding: 5px 15px 0;
    text-align: right;
    border-top: 1px solid #eeeeee;
  }

  .el-date-editor .el-range-separator {
    width: 20px;
  }

  /* loading 文字颜色*/
  .el-loading-spinner .el-loading-text {
    /* color: #FFFFFF; */
    /* margin: 3px 0; */
    /* font-size: 14px; */
  }

  /* loading 旋转的圆圈的颜色*/
  .el-loading-spinner .path {
    /* stroke: #FFFFFF; */
  }

</style>
