<style lang="scss">
  @import "./bindBimDialog";

</style>
<template>

  <div id="bind-bim-dialog" class="bind-bim-dialog">
    <el-dialog :modal="false" width="400px" top="10vh" :lock-scroll="true" :visible.sync="BindBimDialog.show"
      @opened="openedDialogHandle" @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>
      <el-form ref="bindBimForm" :model="bindBimForm" class="login-form" auto-complete="on" label-position="left"
        :validate-on-rule-change="true">
        <div style="margin: 5px;font-size: 16px;font-weight: 600;margin-bottom: 20px;">关联码</div>
        <el-form-item prop="bimCode" :rules="ruleBimCode">
          <el-input v-model="bindBimForm.bimCode" placeholder="请输入关联码" class="bimCodeInput"
            style="font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"></el-input>
        </el-form-item>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click='handleDialogCancel'>取 消</el-button>
        <el-button type="primary" :loading="loadingBindBim" @click="handleDialogSubmit">确 定</el-button>

      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {
    getToken
  } from '@/utils/auth'
  export default {
    components: {},
    directives: {},
    data() {
      const validateBimCode = (rule, value, callback) => {
        if (value.length < 12) {
          callback(new Error('请输入有效的关联码'))
        } else {
          callback()
        }
      }
      return {
        dialogTitle: '请输入关联码',
        ruleBimCode: [{
          required: true,
          trigger: 'blur',
          validator: validateBimCode
        }],
        bindBimForm: {
          bimCode: ""
        },
        loadingBindBim: false
      }
    },
    computed: {
      project_id: {
        get: function () {
          return this.$store.state.project.project_id
        },
        set: function (newValue) {
          this.$store.state.project.project_id = newValue
        }
      },
      BindBimDialog: {
        get: function () {
          return this.$store.state.bindBim.BindBimDialog
        },
        set: function (newValue) {
          this.$store.state.bindBim.BindBimDialog = newValue
        }
      },
    },
    props: {

    },
    created: function () {

    },
    mounted() {

    },
    watch: {

    },
    methods: {
      clearData() {
        this.bindBimForm = {
          bimCode: ""
        }
        this.loadingBindBim = false
      },
      openedDialogHandle() {
        console.log('BindBimDialog', this.BindBimDialog)

      },

      handleDialogSubmit() {

        this.$refs.bindBimForm.validate(valid => {
          if (valid) {
            const param = {
              method: 'set_outsys_info',
              project_id: this.project_id,
              access_code: this.bindBimForm.bimCode
            }
            console.log('this.project_id', this.project_id)
            this.loadingBindBim = true
            this.$store.dispatch('SetOutsysInfo', param).then((res) => {

              console.log('SetOutsysInfo - res', res)
              this.loadingBindBim = false
              if (res.status === "success") {
                this.$store.dispatch('SetBindBimDataChanged', {}).then((result) => {

                })
                this.closeDialog()
                this.$message({
                  message: "与BIM项目的关联绑定成功",
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            }).catch(() => {})
          } else {
            console.log('error submit!!')
            return false
          }
        })

      },
      handleDialogCancel() {
        this.closeDialog()
      },
      closeDialogHandle() {
        this.clearData()
      },
      closeDialog() {
        this.$refs['bindBimForm'].resetFields();
        const param = {
          show: false,
        }
        this.$store.dispatch('ShowBindBimDialog', param).then(() => {}).catch(() => {})
      }
    }
  }

</script>
