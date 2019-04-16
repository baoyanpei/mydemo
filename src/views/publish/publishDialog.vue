<style lang="scss">
  @import "./publishDialog";

</style>
<template>
  <el-dialog :modal="false" width="550px" top="15vh" :lock-scroll="true" :close-on-click-modal="false"
    @open="openPublishDialog" :visible.sync="publishDialog.show" title="发布管理">
    <div id="publish-dialog" class="publish-dialog">
      <el-form ref="publishForm" :model="publishForm" label-width="80px" :inline="true">
        <span class="table-title">通告：</span>
        <div style="padding-top: 10px;padding-bottom: 10px;">
          <el-input type="textarea" v-model="publishForm.msg" :rows="6"></el-input>
        </div>
        <div style="text-align: right;">
          <el-button type="success" :loading="loading" @click.native.prevent="handleMsgSubmit()" size="mini">确定修改
          </el-button>
        </div>

      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import lodash from 'lodash'

  import {
    Loading
  } from 'element-ui';
  // import Mock from 'mockjs'
  export default {
    components: {},
    directives: {},
    filters: {

    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      publishDialog: {
        get: function () {
          return this.$store.state.msg.publishDialog
        },
        set: function (newValue) {
          this.$store.state.msg.publishDialog = newValue
        }
      },

    },
    data() {
      return {
        loadingInstance: null,
        loading: false,
        publishForm: {
          msg: ''
        }
      }
    },
    created: function () {


    },
    watch: {
      loading(curVal, oldVal) {
        if (curVal === false) {} else {

        }
      },
      publishDialog: {
        handler: function (newVal, oldVal) {
          // console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            // console.log('publishDialog - show')
            this.initData()
            this.getMsg()
            //   this.getProjectPersons()
            //   this.getProjectPersonInout(false)
          } else {
            this.initData()
          }

        },
        deep: true
      },

    },
    methods: {
      initData() {
        this.publishForm = {
          msg: ''
        }
      },
      getMsg() {
        const param = {
          method: 'query',
          project_id: this.project_id,
          rows: 1,
          show_led: 1
        }
        this.$store.dispatch('QueryInfoMsg', param).then((msgList) => {
          //   console.log('msgList', msgList)
          if (msgList.length > 0) {
            let _msg = msgList[0]
            if (_msg.show_led === 1) {
              this.publishForm.msg = _msg.msg_cont
            }
          }
        })
      },
      // 打开窗口
      openPublishDialog() {
        //打开窗口的mask
        // this.loadingInstance = Loading.service({
        //   // fullscreen: true,
        //   target: '#person-list-from'
        // });

      },
      handleMsgSubmit() {
        this.$confirm('是否确定修改当前的公告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          // center: true
        }).then(() => {
          const param = {
            method: 'add',
            project_id: this.project_id,
            msg_cont: this.publishForm.msg,
            start_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            end_time: moment().add('day', 365).format('YYYY-MM-DD HH:mm:ss'),

            show_led: 1
          }
          this.$store.dispatch('AddInfoMsg', param).then((data) => {
            console.log('data', data)
            if (data.status === 'success') {
              this.$message({
                message: '公告修改成功',
                type: 'success'
              })
            }
          })

        }).catch(() => {

        });



      },
    },
    mounted() {

    }
  }

</script>
