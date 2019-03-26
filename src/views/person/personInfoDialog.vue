<style lang="scss">
  @import "./personInfoDialog";

</style>
<template>
  <div class="person-info-dialog">
    <el-dialog :modal="false" top="0.5vh" width="450px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonFacePercentDetailDialogHandle" :visible.sync="personInfoDialog.show"
      :title="personInfoDialog.name">
      <div id="person-face-person-detail-form" class="person-face-person-detail-form">
        <el-row :gutter="24">
          <el-col :span="8" style="text-align: center;padding-right:0px;">
            <div><img :src="idcard_pic" style="height:120px;" /></div>
            <!-- <div>(身份证照)</div> -->
          </el-col>
          <el-col :span="16" class="persion-info-txt" style="text-align: left;padding: 2px;">
            <el-row :gutter="24">
              <el-col :span="12">
                部门：{{bumen}}
              </el-col>
              <el-col :span="12">
                专业：{{zhuanye}}
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                年龄：{{age}}
              </el-col>
              <el-col :span="12">
                学历：-
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                电话：{{mobile}}
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                入职时间：{{trasRuZHiShiJian(created_time)}}
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                身份证号：{{idcard_no}}
              </el-col>

            </el-row>
            <el-button type="success" @click.native.prevent="handleWorktimeLogSubmit()" size="mini"
              style="position:absolute;top:85px;right:20px;">上工日志</el-button>
            <!-- <el-form-item label="姓名:">
                {{name}}
              </el-form-item> -->
          </el-col>
        </el-row>
        <el-row>

        </el-row>
        <el-tabs v-model="activeTabName" type="card" @tab-click="tabHandleClick">
          <el-tab-pane label="照片资料" name="zpzl">
            <div class="div-tab-item">
              <div>入职照片</div>
              <hr class="hr1">
              <div style="text-align: center">
                <a :href="entry_pic" target="_blank">
                  <img :src="entry_pic" style="height:150px;margin: 0px auto" />
                </a>
              </div>
              <div>身份证扫描件</div>
              <hr class="hr1">
              <div style="text-align: center">
                <a :href="idcarda" target="_blank">
                  <img :src="idcarda" style="height:150px;margin: 0px auto" />
                </a>

              </div>
              <div style="text-align: center">
                <a :href="idcardb" target="_blank">
                  <img :src="idcardb" style="height:150px;margin: 0px auto" />
                </a>
              </div>
            </div>

          </el-tab-pane>
          <el-tab-pane label="安全责任书" name="aqzrs">
            <div class="div-tab-item">
            </div>
          </el-tab-pane>
          <el-tab-pane label="劳动合同" name="ldht">
            <div class="div-tab-item">
            </div>
          </el-tab-pane>
          <el-tab-pane label="安全交底" name="aqjd">
            <div class="div-tab-item">
            </div>
          </el-tab-pane>
          <el-tab-pane label="技术交底" name="jsjd">
            <div class="div-tab-item">
            </div>
          </el-tab-pane>
        </el-tabs>


      </div>
    </el-dialog>

  </div>

</template>

<script>
  import moment from 'moment'
  export default {
    components: {},
    directives: {},
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personInfoDialog: {
        get: function () {
          return this.$store.state.project.personInfoDialog
        },
        set: function (newValue) {
          this.$store.state.project.personInfoDialog = newValue
        }
      }

    },
    data() {

      return {
        activeTabName: 'zpzl',

        idcard_pic: '',
        entry_pic: '',
        name: '',
        age: '',
        mobile: '',
        created_time: '',
        bumen: '',
        zhuanye: '',
        idcarda: '',
        idcardb: '',
        idcard_no: '',
        loading: false
      }
    },
    created: function () {


    },
    watch: {
      personInfoDialog: {
        handler: function (newVal, oldVal) {
          //   console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            this.initData()
            this.getProjectPersonInfo()
            this.getPersonDatum()
            // this.getPerson()
          } else {
            this.initData()
          }

        },
        deep: true
      },
    },
    methods: {
      trasRuZHiShiJian(time) {
        let timeFormat = ''
        if (time !== '') {
          timeFormat = moment(time).format('YYYY年MM月DD日')
        }
        return timeFormat
      },
      // 打开窗口
      openPersonFacePercentDetailDialogHandle() {
        // console.log("----22222---")
      },
      tabHandleClick(tab, event) {
        console.log(tab, event);
        this.activeTabName = tab.name
        // this.reloadData()
        // console.log('this.activeTabName', this.activeTabName)
      },
      initData() {
        this.idcard_pic = '/static/photo_no.jpg'
        this.entry_pic = '/static/photo_no.jpg'
        this.idcarda = '/static/noidcard.jpeg'
        this.idcardb = '/static/noidcard.jpeg'
        this.name = ""
        this.age = ""
        this.mobile = ""
        this.created_time = ""
        this.bumen = ''
        this.zhuanye = ''
        this.idcard_no = ''

      },
      getProjectPersonInfo() {
        const param = {
          method: 'query_person',
          project_id: this.project_id,
          id: this.personInfoDialog.person_id
        }
        console.log('this.personInfoDialog', this.personInfoDialog)
        this.$store.dispatch('QueryProjectPerson', param).then((data_list) => {
          console.log("-data-->", data_list)
          const _personInfo = data_list[0]
          const _idcard_pic = _personInfo.idcard_pic
          if (_idcard_pic.length > 0) {
            this.idcard_pic = _idcard_pic

          }
          this.name = _personInfo.name
          this.mobile = _personInfo.mobile
          this.created_time = _personInfo.created_time
          this.idcard_no = _personInfo.idcard_no
          this.bumen = _personInfo.group_name_level[0]
          this.zhuanye = _personInfo.group_name_level[1]
          this.entry_pic = _personInfo.entry_pic
          this.idcarda = _personInfo.idcarda
          this.idcardb = _personInfo.idcardb
          this.age = _personInfo.age
        }).catch(() => {
          this.loading = false
        })


      },
      getPersonDatum() {
        const param = {
          method: 'query',
          project_id: this.project_id,
          person_id: this.personInfoDialog.person_id
        }
        console.log('this.personInfoDialog', this.personInfoDialog)
        this.$store.dispatch('QueryPersonDatum', param).then((data_list) => {
          console.log("-data-->", data_list)
          
        }).catch((e) => {
          console.log('e', e)
          // this.loading = false
        })
      },
      handleWorktimeLogSubmit() {
        const param = {
          show: true,
          ...this.personInfoDialog
        }
        this.$store.dispatch('SetWorktimeFullCalenderDialog', param).then(() => {}).catch(() => {

        })
      }

    },
    mounted() {


    }
  }

</script>
