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
        <el-form ref="UseTrafficForm" label-width="80px" style="width: 200px;margin-top: 10px;" class="UseTrafficForm">
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
              <el-input placeholder="请输入备注" v-model="useTrafficForm.jiaotongBZ" size="mini"></el-input>
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


      },
      closeuseTrafficDialog() {

        this.clearData()
      },
      handleCloseDialog() {

      },
      changeRadioUseTrafficHandle() {
        // console.log('changeRadioUseTrafficHandle')
        // this.clearUseTrafficData()
      },
      handleSubmit() {


      }

    },
    mounted() {


    }
  }

</script>
