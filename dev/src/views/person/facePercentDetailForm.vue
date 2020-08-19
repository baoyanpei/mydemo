<style lang="scss">
  @import "./facePercentDetailForm";

</style>
<template>
  <div>
    <el-dialog :modal="false" custom-class="ryxx-dialog" top="0.5vh" width="400px" :lock-scroll="true"
      :close-on-click-modal="false" @open="openPersonFacePercentDetailDialogHandle" :visible.sync="personFacePercentDialog.show"
      :title="personFacePercentDialog.name">
      <div id="person-face-person-detail-form" class="person-face-person-detail-form">
        <el-row :gutter="24">
          <el-col :span="8" style="text-align: center;padding-right:0px;">
            <div><img :src="idcard_pic" style="height:120px;" /></div>
            <div>(证件照)</div>
            
          </el-col>
          <el-col :span="16" style="text-align: left;padding: 2px;">
            <el-form label-width="80px">
              <el-form-item label="职位:">
                {{group_name}}
              </el-form-item>
              <el-form-item label="年龄:">
                {{age}}
              </el-form-item>
              <el-form-item label="识别率:">
                <span v-if="face_percent===''">

                </span>
                <span v-else-if="face_percent>=50">
                  {{face_percent}}%
                </span>
                <span v-else-if="face_percent>=0">
                  <span class="shibielvdi">
                    {{face_percent}}%
                  </span>
                </span>
                <span v-else>
                  <span class="weishibie">未识别</span>
                </span>
              </el-form-item>
              <el-form-item label="入职时间:">
                {{created_time}}
              </el-form-item>
              <div style="text-align: center;padding-top: 5px;">
                <div v-if="compare==2" class="info-compare-2">
                  <div>已经确认是本人</div>
                  <div>识别率低的原因为：{{remark}}</div>
                </div>
                <div v-if="compare==3" class="info-compare-3">
                  <span>已经确认不是本人</span>
                </div>
              </div>

            </el-form>


            <div style="text-align: center;margin-top:10px;">
              <el-button type="success" @click.native.prevent="handleLogsPersonComfirm(2)" size="mini">
                确认为本人
              </el-button>
              <el-button type="warning" @click.native.prevent="handleLogsPersonComfirm(3)" size="mini">
                确认不为本人
              </el-button>
            </div>


          </el-col>
        </el-row>
        <el-row>
          
        </el-row>
        <div style="margin-top: 5px;">
          入场照
        </div>
        <hr class="hr1" />
        <div style="text-align: center;height:320px;">
          <span v-show="last_in_pic!==''">
            <a :href="last_in_pic" target="_blank">
              <img :src="last_in_pic" style="height:320px;" />
            </a>
          </span>


        </div>

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
      personFacePercentDialog: {
        get: function () {
          return this.$store.state.project.personFacePercentDialog
        },
        set: function (newValue) {
          this.$store.state.project.personFacePercentDialog = newValue
        }
      },
      projectPersonInfoByFacePercent() {
        return this.$store.state.project.projectPersonInfoByFacePercent
      },
      personNowinChanged() {
        return this.$store.state.project.personNowinChanged
      }

    },
    data() {

      return {
        idcard_pic: '/static/photo_no.jpg',
        name: '',
        group_name: '',
        face_percent: '',
        last_in_pic: '',
        created_time: '',
        age: '',
        compare: -1,
        log_id: '',
        personInfo: null,
        remark:''
      }
    },
    created: function () {


    },
    watch: {
      personFacePercentDialog: {
        handler: function (newVal, oldVal) {
          console.info('value changed ', newVal)
          if (newVal === true) {
            this.initData()
            this.getPersonInfo()
          }

        },
        deep: true
      },
      personNowinChanged(curVal, oldVal) {
        console.log("personNowinChanged")
        this.initData()
        this.getPersonInfo()
      }
    },
    methods: {
      // 打开窗口
      openPersonFacePercentDetailDialogHandle() {
        console.log("----22222---")
        // this.loadingInstance = Loading.service({
        //   // fullscreen: true,
        //   target: '#person-face-person-detail-form'
        // });
        this.initData()
        this.getPersonInfo()

      },
      initData() {
        this.idcard_pic = '/static/photo_no.jpg'
        this.group_name = ""
        this.face_percent = ""
        this.last_in_pic = ""
        this.created_time = ""
        this.age = ""
        this.name = ""
        this.compare = -1
        this.remark = ""
      },
      getPersonInfo() {
        const param = {
          method: 'query_person',
          project_id: this.project_id,
          id: this.personFacePercentDialog.person_id
        }
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
        })
      },
      handleLogsPersonComfirm(compare) {
        const param = {
          show: true,
          personInfo: this.personInfo,
          compare: compare
        }
        this.$store.dispatch('SetLogsPersonComfirmDialog', param).then(() => {}).catch(() => {})
        /*
        let _msg = ''
        switch (compare) {
          case 2:
            _msg = `是否确定设置此人 <span style="color:green;"> 是 ${this.name} 本人</span>？`
            break;
          case 3:
            _msg = `是否确定设置此人 <span style="color:red;">不是 ${this.name} 本人</span>？`
            break;
        }

        this.$confirm(_msg, '人证合一 - 人工判断', {
            distinguishCancelAndClose: true,
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(() => {

            const param = {
              method: 'logs_person_comfirm',
              project_id: this.project_id,
              id: this.log_id,
              compare: compare
            }
            // console.log('param', param)
            // this.personNowInList = []
            this.$store.dispatch('queryLogsPersonComfirm', param).then(() => {
              // this.initData()
              this.getPersonInfo()
              this.$message({
                message: `设置成功！`,
                type: 'success'
              })

              this.$store.dispatch('SetPersonNowinChanged', {}).then(() => {
                // console.log('this.projectGroupList1', this.projectGroupList)
                // this.appendGroupData()
              }).catch(() => {

              })

            }).catch(() => {
              this.loading = false
            })



          })
          .catch(action => {
            // this.$message({
            //   type: 'info',
            //   message: action === 'cancel' ?
            //     '放弃保存并离开页面' : '停留在当前页面'
            // })
          });
          */
      },
    },
    mounted() {


    }
  }

</script>
