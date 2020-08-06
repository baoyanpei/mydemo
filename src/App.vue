<template>
  <div id="app">
    <router-view />
    <InoutForm></InoutForm>
    <!-- <NowinForm></NowinForm> -->
    <el-dialog
      :modal="false"
      custom-class="ryxx-dialog"
      width="800px"
      top="1vh"
      :lock-scroll="true"
      :close-on-click-modal="false"
      @open="openPersonFullCalendarDialogHandle"
      :visible.sync="personFullCalenderDialog.show"
      title="日历"
      v-dialogDrag
    >
      <PersonFullCalender></PersonFullCalender>
    </el-dialog>
    <el-dialog
      :modal="false"
      top="0.5vh"
      width="800px"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :visible.sync="worktimeFullCalendarDialog.show"
      :title="worktimeFullCalendarDialog.dialogTitle"
    >
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
    <!--任务大厅任务详情对话框-->
    <TaskInfoDialog></TaskInfoDialog>
    <!--发布任务-->
    <ReleaseTask></ReleaseTask>
    <!--人员详细信息对话框-->
    <PersonInfoDialog></PersonInfoDialog>
    <!--人员进出详细信息对话框-->
    <PersonInOutDetailDialog></PersonInOutDetailDialog>
    <!--人员辞退、辞职对话框-->
    <PersonQuitLeftDialog></PersonQuitLeftDialog>
    <!--人员信息对话框-->
    <PersonListDialog></PersonListDialog>

    <!--发布信息对话框-->
    <PublishDialog></PublishDialog>

    <!--摄像头画面dialog-->
    <VideoDialog></VideoDialog>

    <!--视点管理dialog-->
    <PointViewManageDialog></PointViewManageDialog>

    <!--视点保存dialog-->
    <PointViewSaveDialog></PointViewSaveDialog>

    <!--视点二维码dialog-->
    <XcxQrcodeDialog></XcxQrcodeDialog>

    <!--绑定BIM-->
    <bindBimDialog></bindBimDialog>

    <!--人员健康对话框-->
    <PersonHealthDialog></PersonHealthDialog>

    <!--人员健康体检对话框-->
    <PersonHealthDayDialog></PersonHealthDayDialog>

    <!--人员健康日志对话框-->
    <PersonHealthDayLogDialog></PersonHealthDayLogDialog>

    <!--世界城市dialog-->
    <worldCitysDialog></worldCitysDialog>

    <!--交通dialog-->
    <useTrafficDialog></useTrafficDialog>

    <!--位置视点管理dialog-->
    <PositonPVManageDialog></PositonPVManageDialog>

    <!--位置视点截图保存dialog-->
    <PositionPictureSaveDialog></PositionPictureSaveDialog>

    <!--构件库列表dialog-->
    <ComponentLibraryListDialog></ComponentLibraryListDialog>
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
//任务详情信息
import TaskInfoDialog from './views/taskinfo/info'
//发布任务
import ReleaseTask from './views/releasetask/release'
// 人员信息信息dialog
import PersonInfoDialog from './views/person/personInfoDialog'

// 人员健康dialog
import PersonHealthDialog from './views/person/personHealthDialog'

// 人员健康体检dialog
import PersonHealthDayDialog from './views/person/personHealthDayDialog'

// 人员体检日志dialog
import PersonHealthDayLogDialog from './views/person/personHealthDayLogDialog'

// 人员进出详细dialog
import PersonInOutDetailDialog from './views/person/personInOutDetailDialog'

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

// 摄像头画面dialog
import VideoDialog from './views/loT/videoDialog'

// 视点管理dialog
import PointViewManageDialog from './views/pointView/manageDialog'

// 视点保存dialog
import PointViewSaveDialog from './views/pointView/saveDialog'

// 视点二维码dialog
import XcxQrcodeDialog from './views/pointView/xcxQrcodeDialog'

// 位置视点管理dialog
import PositonPVManageDialog from './views/pointView/positonPVManageDialog'

// 位置视点截图保存ialog
import PositionPictureSaveDialog from './views/pointView/positionPictureSaveDialog'

// 绑定BIM
import bindBimDialog from './views/bindBim/bindBimDialog'

// 世界城市dialog
import worldCitysDialog from './views/components/worldCitysDialog'

// 交通dialog
import useTrafficDialog from './views/components/useTrafficDialog'

// 构件库列表
import ComponentLibraryListDialog from './views/ComponentLibrary/ListDialog'

export default {
  name: 'App',
  components: {
    // ModelDetail,
    // RyxxForm,
    InoutForm,
    // NowinForm,
    NowinDialog,
    TaskInfoDialog,
    PersonFullCalender,
    ReleaseTask,
    PersonFacePercentDetailForm,
    InOutPersonDetailDialog,
    PersonGoOutDialog,
    LogsPersonComfirmDialog,
    PersonInfoDialog,
    PersonHealthDayLogDialog,
    PersonHealthDialog,
    PersonHealthDayDialog,
    PersonInOutDetailDialog,
    PersonQuitLeftDialog,
    PersonListDialog,
    WorktimeFullCalendarDialog,
    PublishDialog,
    VideoDialog,
    PointViewManageDialog,
    PointViewSaveDialog,
    XcxQrcodeDialog,
    bindBimDialog,
    worldCitysDialog,
    useTrafficDialog,
    PositonPVManageDialog,
    PositionPictureSaveDialog,
    ComponentLibraryListDialog
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
      get: function() {
        return this.$store.state.project.personFullCalenderDialog
      },
      set: function(newValue) {
        this.$store.state.project.personFullCalenderDialog = newValue
      }
    },
    worktimeFullCalendarDialog: {
      get: function() {
        return this.$store.state.project.worktimeFullCalendarDialog
      },
      set: function(newValue) {
        this.$store.state.project.worktimeFullCalendarDialog = newValue
      }
    },
    personInfo() {
      return this.$store.state.person.personInfo
    }
  },
  watch: {
    async $route(to, from) {
      console.log('totototo', to)
      if (
        to.name !== 'login' &&
        to.name !== 'wxbindtip' &&
        to.name !== 'xcx-pointview-show' &&
        to.name !== 'xcx-model-display' &&
        to.name !== 'xcx-cesium-display' &&
        to.name !== 'xcx-cad-display' &&
        to.name !== 'xcx-sketchup-display' &&
        to.name !== 'screen3V3' &&
        this.personInfo === null
      ) {
        await this.getPerson()
      }
      console.log('fromfromfrom', from)
      if (
        from.name === 'lot2-index' ||
        from.name === 'lot3-index' ||
        from.name === 'lot4-index' ||
        from.name === 'lot5-index' ||
        from.name === 'lot6-index' ||
        from.name === 'modelDisplay-index' ||
        from.name === 'model-lot-setting' ||
        from.name === 'model-taji-setting' ||
        from.name === 'model-sjj-setting' ||
        from.name === 'lot-pv-setting'
      ) {
        location.reload()
      }
    }
  },
  created() {
    // console.log("App - created")
  },
  mounted() {},
  methods: {
    getPerson() {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'query'
        }
        this.$store
          .dispatch('QueryPersonInfo', param)
          .then(async () => {
            await this.setProjectInfo()
            resolve()
          })
          .catch(() => {
            this.loading = false
            resolve()
          })
      })
    },
    setProjectInfo() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('setProjectInfo', this.personInfo)
          .then(() => {
            resolve()
          })
          .catch(() => {
            this.loading = false
            resolve()
          })
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
    }
  }
}
</script>
<style>
/*表格*/
body .el-table th.gutter{
    display: table-cell!important;
  }
body .el-table colgroup.gutter{
    display: table-cell!important;
  }
table td,
th {
  border: 0px solid #000 !important;
}

.hr1 {
  border-top: 1px solid #eeeeee;
  border-bottom: 0px;
}

.span-link1 {
  padding-bottom: 1px;
  border-bottom: 1px dashed #999999;
  color: #e6a23c;
  cursor: pointer;
}

.el-dialog__header {
  padding: 5px 20px 5px;
  background-color: #2cbc9d;
}

.el-dialog__title {
  line-height: 24px;
  font-size: 16px;
  color: #ffffff;
}

.el-dialog__headerbtn {
  top: 10px;
  color: #ffffff;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #ffffff;
}

.el-dialog__wrapper {
  /*穿透该层  不能添加,否则Dialog 超过窗口以后,滚动条无法拖动*/
  /* pointer-events: none; */
}

.el-dialog {
  /*恢复点击处理*/
  pointer-events: auto;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #ffffff;
}

.el-button--primary {
  color: #fff;
  background-color: #29bb9c;
  border-color: #29bb9c;
}

.el-button--primary:hover {
  color: #fff;
  background-color: rgb(117, 192, 151);
  border-color: rgb(117, 192, 151);
}

.el-button--primary:focus,
.el-button--primary:hover {
  background: #29bb9c;
  border-color: #29bb9c;
}

.el-message-box__headerbtn {
  top: 8px;
}

.el-message-box {
  border-radius: 0px;
  border: 0px;
}

.el-message-box__status.el-icon-warning {
  color: #ff0000;
}

.el-message-box__status.el-icon-warning {
  color: #ff0000;
  font-size: 40px !important;
}

.el-message-box__status + .el-message-box__message {
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
  color: #ffffff;
}

.el-message-box__title {
  color: #ffffff;
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
}

/* loading 旋转的圆圈的颜色*/
.el-loading-spinner .path {
  /* stroke: #FFFFFF; */
}

.locationLabel {
  font-size: 12px;
  opacity: 0.4;
  cursor: pointer;
}

/deep/ .el-upload-list__item {
  display: flex !important;
  justify-content: space-between !important;
}
element.style {
    height: 10px;

}
.el-progress-bar__inner{
    height: 10px;
  }
</style>
