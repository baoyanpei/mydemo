<style lang="scss">
  @import "./personInfoDialog";

</style>
<template>
  <div class="person-info-dialog">
    <el-dialog :modal="false" top="0.5vh" width="400px" :lock-scroll="true"
      :close-on-click-modal="false" @open="openPersonFacePercentDetailDialogHandle"
      :visible.sync="personInfoDialog.show" :title="personInfoDialog.name">
      <div id="person-face-person-detail-form" class="person-face-person-detail-form">
        <el-row :gutter="24">
          <el-col :span="8" style="text-align: center;padding-right:0px;">
            <div><img :src="idcard_pic" style="height:120px;" /></div>
            <!-- <div>(身份证照)</div> -->
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
        <div style="margin-top: 10px;">
          上工时间
        </div>
        <hr class="hr1" />
        

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
        idcard_pic: '/static/photo_no.jpg',
        name: '',
        mobile: '',
        bumen: '',
        zhuanye: '',
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
            this.getPersonInfo()
          } else {
            this.initData()
          }

        },
        deep: true
      },
    },
    methods: {
      // 打开窗口
      openPersonFacePercentDetailDialogHandle() {
        // console.log("----22222---")
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
          this.bumen = _personInfo.group_name_level[0]
          this.zhuanye = _personInfo.group_name_level[1]
        }).catch(() => {
          this.loading = false
        })

        
      },

    },
    mounted() {


    }
  }

</script>
