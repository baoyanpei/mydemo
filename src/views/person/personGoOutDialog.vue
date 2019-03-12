<style lang="scss">
  @import "./personGoOutDialog";
  
  </style>

<template>
  <el-dialog :modal="false" custom-class="ryxx-dialog" width="450px" top="20vh" :lock-scroll="true"
    :close-on-click-modal="false" @open="openPersonGoOutDialogHandle" :visible.sync="personGoOutDialog.show" title="手工出场">
    <div id="person-go-out-dialog" class="person-go-out-dialog">

      <el-form label-width="30px" size="small">

        <el-form-item v-if="type==='all'">
          是否确定将<span style="color:red;"> <b>所有人</b> 出场</span>，未自动出场的原因：
        </el-form-item>
        <el-form-item v-if="type==='single'">
          是否确定将<span style="color:red;"><b>{{person.name}}</b> 出场</span>，未自动出场的原因：
        </el-form-item>
        <el-form-item>
          <el-radio v-model="remark" label="1|时间过晚，闸机关闭">1.时间过晚，闸机关闭</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="remark" label="2|从其他出口出场">2.从其他出口出场</el-radio>
        </el-form-item>

      </el-form>

    </div>
    <hr class="hr1" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="personGoOutDialog.show = false" size="small">取 消</el-button>
      <el-button @click="personGoOutSubmit" type="primary" size="small" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    components: {},
    directives: {},
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personGoOutDialog: {
        get: function () {
          return this.$store.state.person.personGoOutDialog
        },
        set: function (newValue) {
          this.$store.state.person.personGoOutDialog = newValue
        }
      }
    },
    data() {
      return {
        loading: false,
        remark: '',
        type: '',
        person: null
      }
    },
    created: function () {


    },
    watch: {
      personGoOutDialog: {
        handler: function (newVal, oldVal) {
          console.info('personGoOutDialog value changed ', newVal.show)

          //   this.initData()
          //   this.getPersonInfo()
        },
        deep: true
      }

    },
    methods: {
      // 打开窗口后的handle
      openPersonGoOutDialogHandle() {
        console.log('openPersonGoOutDialogHandle', this.personGoOutDialog)
        this.loading = false
        this.person = this.personGoOutDialog.person
        this.type = this.personGoOutDialog.type
        //   console.log("this.personInfo", this.personInfo)
        //   this.person_name = this.personInfo.name
        //   this.compare = this.logsPersonComfirmDialog.compare

      },
      closeDialog() {
        const param = {
          show: false,
          type: '',
          person: null
        }
        this.$store.dispatch('SetPersonGoOutDialog', param).then(() => {}).catch(() => {})
      },
      personGoOutSubmit() {
        if (this.remark === "") {
          this.$message({
            message: '请选择未自动出场的原因！',
            type: 'error'
          })
          return
        }
        this.loading = true
        let param = {
          method: 'person_goout',
          project_id: this.project_id,
          remark: this.remark
        }

        if (this.type === 'single') {
          param.person_id = this.person.person_id
        }

        console.log("-param->", param)
        console.log("this.type", this.type)



        this.$store.dispatch('QueryProjectPersonGoOut', param).then(() => {
          this.loading = false
          let _msg = ''
          if (this.type === "all") {
            _msg = '所有人员手动出场成功'
          } else {
            _msg = `${this.person.name} 手动出场成功！`
          }
          this.$message({
            message: _msg,
            type: 'success'
          })
          this.closeDialog()
          this.$store.dispatch('SetPersonNowinChanged', {}).then(() => {
            // console.log('this.projectGroupList1', this.projectGroupList)
            // this.appendGroupData()
          }).catch(() => {

          })
          
        }).catch(() => {
          this.loading = false
        })

      }
    },
    mounted() {}
  }

</script>
