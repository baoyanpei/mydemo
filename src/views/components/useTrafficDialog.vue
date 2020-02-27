<style lang="scss">
  @import "./useTrafficDialog";

</style>
<template>
  <div class="use-traffic-dialog">
    <el-dialog :modal="true" width="300px" :lock-scroll="true" :close-on-click-modal="false"
      :visible.sync="useTrafficDialog.show" @close="closeuseTrafficDialog" :title="title">
      <div style="text-align: center;width: 100%;">
        <el-radio-group v-model="radioUseTraffic" size="mini" @change="changeRadioUseTrafficHandle">
          <el-radio-button label="飞机"></el-radio-button>
          <el-radio-button label="火车"></el-radio-button>
          <el-radio-button label="班车"></el-radio-button>
          <el-radio-button label="自驾"></el-radio-button>
          <el-radio-button label="其他"></el-radio-button>
        </el-radio-group>
        <el-form ref="UseTrafficForm" label-width="80px" style="width: 250px;margin-top: 10px;" class="UseTrafficForm">
          <div v-if="radioUseTraffic==='飞机'">
            <el-form-item label="航班号：">
              <el-input placeholder="请输入航班号" v-model="useTrafficForm.feijiHBH" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="座位：">
              <el-input placeholder="请输入座位" v-model="useTrafficForm.feijiZW" size="mini"></el-input>
            </el-form-item>
          </div>
          <div v-if="radioUseTraffic==='火车'">
            <el-form-item label="班次：">
              <el-input placeholder="请输入班次" v-model="useTrafficForm.huocheBC" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="座位：">
              <el-input placeholder="请输入座位" v-model="useTrafficForm.huocheZW" size="mini"></el-input>
            </el-form-item>
          </div>
          <div v-if="radioUseTraffic==='班车'">
            <el-form-item label="车牌号：">
              <el-input placeholder="请输入车牌号" v-model="useTrafficForm.bancheCPH" size="mini"></el-input>
            </el-form-item>
          </div>
          <div v-if="radioUseTraffic==='自驾'">
            <el-form-item label="车牌号：">
              <el-input placeholder="请输入车牌号" v-model="useTrafficForm.zijiaCPH" size="mini"></el-input>
            </el-form-item>
          </div>
          <div v-if="radioUseTraffic==='其他'">
            <el-form-item label="备注：">
              <el-input type="textarea" placeholder="请输入备注" v-model="useTrafficForm.jiaotongBZ" size="mini"
                :autosize="{ minRows: 2, maxRows: 4}" style="width: 100%;;"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div style="text-align: center;margin-top: 20px;">
        <el-button type="success" :loading="loading" @click.native.prevent="handleSubmit()" size="mini"
          style="width: 100%;">确定
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  export default {
    components: {
      // pdf
      // vueshowpdf
    },
    directives: {},

    data() {

      return {
        title: '交通工具',
        loading: false,
        radioUseTraffic: '飞机',
        useTrafficForm: {
          feijiHBH: '',
          feijiZW: '',
          huocheBC: '',
          huocheZW: '',
          bancheCPH: '',
          zijiaCPH: '',
          jiaotongBZ: ''
        }
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      useTrafficDialog: {
        get: function () {
          return this.$store.state.tools.useTrafficDialog
        },
        set: function (newValue) {
          this.$store.state.tools.useTrafficDialog = newValue
        }
      },


    },
    created: function () {},
    watch: {
      useTrafficDialog: {
        handler: function (newVal, oldVal) {
          //   console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            // this.initData()
            // this.getProjectPersonInfo()
            // this.getPersonDatum()

          } else {
            // this.initData()
          }

        },
        deep: true
      },

    },
    methods: {
      clearData() {
        this.radioUseTraffic = '飞机'
        this.clearUseTrafficData()

      },
      clearUseTrafficData() { // 清除交通工具的记录
        this.useTrafficForm.feijiHBH = ''
        this.useTrafficForm.feijiZW = ''
        this.useTrafficForm.huocheBC = ''
        this.useTrafficForm.huocheZW = ''
        this.useTrafficForm.bancheCPH = ''
        this.useTrafficForm.zijiaCPH = ''
        this.useTrafficForm.jiaotongBZ = ''
        
      },
      closeuseTrafficDialog() {
        
        this.clearData()
      },
      handleCloseDialog() {

      },
      changeRadioUseTrafficHandle() {
        // console.log('changeRadioUseTrafficHandle')
        this.clearUseTrafficData()
      },

      handleSubmit() {
        let _traffic_info = "";
        switch (this.radioUseTraffic) {
          case "飞机":
            if (this.useTrafficForm.feijiHBH === "") {
              this.$message({
                message: '请填写飞机航班号',
                type: 'error'
              })
              return
            } else if (this.useTrafficForm.feijiZW === "") {
              this.$message({
                message: '请填写飞机座位位置',
                type: 'error'
              })
              return
            }
            _traffic_info = `飞机－航班号:${this.useTrafficForm.feijiHBH}－位置:${this.useTrafficForm.feijiZW}`
            break;
          case "火车":
            if (this.useTrafficForm.huocheBC === "") {
              this.$message({
                message: '请填写火车车次',
                type: 'error'
              })
              return
            } else if (this.useTrafficForm.huocheZW === "") {
              this.$message({
                message: '请填写火车座位',
                type: 'error'
              })
              return
            }
            _traffic_info = `火车－车次:${this.useTrafficForm.huocheBC}－座位:${this.useTrafficForm.huocheZW}`
            break;
          case "班车":
            if (this.useTrafficForm.bancheCPH === "") {
              this.$message({
                message: '请填写班车车牌号',
                type: 'error'
              })
              return
            }
            _traffic_info = `班车－车牌号:${this.useTrafficForm.bancheCPH}`
            break;
          case "自驾":
            if (this.useTrafficForm.zijiaCPH === "") {
              this.$message({
                message: '请填写自驾车牌号',
                type: 'error'
              })
              return
            }
            _traffic_info = `自驾－车牌号:${this.useTrafficForm.zijiaCPH}`
            break;
          case "其他":
            if (this.useTrafficForm.jiaotongBZ === "") {
              this.$message({
                message: '请填写备注',
                type: 'error'
              })
              return
            }
            _traffic_info = `其他－备注:${this.useTrafficForm.jiaotongBZ}`
            break;
        }
        console.log('_traffic_info', _traffic_info)
        if (_traffic_info === "") {
          this.$message({
            message: '数据不正确,请检查!',
            type: 'error'
          })
          return;
        }
        this.$store.dispatch('SetUseTrafficData', {
          data: _traffic_info,
        }).then(() => {}).catch(() => {
          this.clearData()
        })

        // 关闭窗口
        this.$store.dispatch('SetUseTrafficDialog', {
          show: false,
        }).then(() => {}).catch(() => {

        })

      }

    },
    mounted() {


    }
  }

</script>
