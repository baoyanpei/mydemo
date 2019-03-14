<style lang="scss">
  @import "./inOutPersonDetailDialog";

</style>
<template>
  <div>
    <el-dialog :modal="false" custom-class="ryxx-dialog" top="0.5vh" width="400px" :lock-scroll="true"
      :close-on-click-modal="false" @open="openPersonFacePercentDetailDialogHandle" :visible.sync="personInOutPercentDialog.show"
      :title="personInOutPercentDialog.name">
      <div id="person-face-person-detail-form" class="person-face-person-detail-form">
        <el-row :gutter="24">
          <el-col :span="8" style="text-align: center;padding-right:0px;">
            <div><img :src="idcard_pic" style="height:120px;" /></div>
            <div>(证件照)</div>

          </el-col>
          <el-col :span="16" style="text-align: left;padding: 2px;">
            <el-form label-width="80px">
              <el-form-item label="姓名:">
                {{name}}
              </el-form-item>
              <el-form-item label="电话:">
                {{mobile}}
              </el-form-item>
              <el-form-item label="部门:">
                {{bumen}}
              </el-form-item>
              <el-form-item label="专业:">
                {{zhuanye}}
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>

        </el-row>
        <div style="margin-top: 5px;">
          上工时间
        </div>
        <hr class="hr1" />


      </div>
    </el-dialog>

  </div>

</template>

<script>
  export default {
    components: {},
    directives: {},
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personInOutPercentDialog: {
        get: function () {
          return this.$store.state.project.personInOutPercentDialog
        },
        set: function (newValue) {
          this.$store.state.project.personInOutPercentDialog = newValue
        }
      }

    },
    data() {

      return {
        idcard_pic: '/static/photo_no.jpg',
        name: '',
        mobile: '',
        bumen: '',
        zhuanye: ''
      }
    },
    created: function () {


    },
    watch: {
      personInOutPercentDialog: {
        handler: function (newVal, oldVal) {
          console.info('value changed2 ', newVal)
          // if (newVal === true) {
          this.initData()
          this.getPersonInfo()
          // }

        },
        deep: true
      },
      // personNowinChanged(curVal, oldVal) {
      //   console.log("personNowinChanged")
      //   this.initData()
      //   this.getPersonInfo()
      // }
    },
    methods: {
      // 打开窗口
      openPersonFacePercentDetailDialogHandle() {
        console.log("----22222---")
        // this.loadingInstance = Loading.service({
        //   // fullscreen: true,
        //   target: '#person-face-person-detail-form'
        // });
        // this.initData()
        // this.getPersonInfo()

      },
      initData() {
        this.idcard_pic = '/static/photo_no.jpg'
        this.name = ""
        this.mobile = ""
        this.bumen = ''
        this.zhuanye = ''

      },
      getPersonInfo() {
        const param = {
          method: 'query_person',
          project_id: this.project_id,
          id: this.personInOutPercentDialog.person_id
        }
        console.log('this.personInOutPercentDialog', this.personInOutPercentDialog)
        this.$store.dispatch('QueryProjectPerson', param).then((data_list) => {
          console.log("-data-->", data_list)
          const _personInfo = data_list[0]
          const _idcard_pic = _personInfo.idcard_pic
          if (_idcard_pic.length > 0) {
            this.idcard_pic = _idcard_pic

          }
          this.name = _personInfo.name
          this.mobile = _personInfo.mobile
          this.bumen = _personInfo.group_name_level[0]
          this.zhuanye = _personInfo.group_name_level[1]
        }).catch(() => {
          this.loading = false
        })
        /*
          this.$store.dispatch('QueryProjectPersonsByFacePercent', param).then(() => {
            console.log("--->", this.projectPersonInfoByFacePercent)
            if (this.projectPersonInfoByFacePercent.length > 0) {
              const _personInfo = this.projectPersonInfoByFacePercent[0]
              this.personInfo = _personInfo
              console.log("_personInfo", _personInfo)
              const _idcard_pic = _personInfo.idcard_pic
              const _last_in_log = _personInfo.last_in_log
              if (_idcard_pic.length > 0) {
                this.idcard_pic = _idcard_pic
  
              }
              this.group_name = _personInfo.group_name_level.join('-')
              this.face_percent = _last_in_log.face_percent
              this.last_in_pic = _last_in_log.pic
              this.created_time = _last_in_log.created_time
              this.remark = _last_in_log.remark
              this.compare = _last_in_log.compare
              this.log_id = _last_in_log.id
              this.age = _personInfo.age
              this.name = _personInfo.name
  
            }
  
          }).catch(() => {
            this.loading = false
          })*/
      }
    },
    mounted() {


    }
  }

</script>
