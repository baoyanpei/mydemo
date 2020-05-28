<style lang="scss">
  @import "./lotInfoDetailDIalog";

</style>
<template>

  <div id="lot-info-detail-dialog" class="lot-info-detail-dialog">
    <el-dialog :modal="false" width="600px" top="10vh" left="100" :lock-scroll="true" :close-on-click-modal="false"
      :close-on-press-escape="true" :visible.sync="LotInfoDetailDialog.show" @opened="openedDialogHandle"
      @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>
      <el-form ref="lotInfoDetailForm" label-width="120px" :inline="false">
        <el-form-item label="设备类型">
          <el-select v-model="deviceType" @change="deviceTypeChangeHandle" placeholder="请选择设备类型" size="mini">
            <el-option v-for="item in deviceTypeList" :key="item.id" :label="`${item.name}`" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备">
          <el-select v-model="deviceId" @change="deviceChangeHandle" placeholder="请选择设备" size="mini">
            <el-option v-for="item in deviceList" :key="item.id" :label="`${item.device_name}`" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物联网模型">
          <span v-if="deviceModelData === null">不配置模型</span>
          <span v-if="deviceModelData !== null">{{deviceModelData.infoData.name}}</span>
        </el-form-item>
        <el-form-item label="mqtt地址">
          <el-input type="input" v-model="mqttParam"></el-input>
        </el-form-item>
        <el-form-item label="其他参数">
          <el-input type="textarea" v-model="params_json" :rows="6"></el-input>
        </el-form-item>

      </el-form>
      <hr class="hr1" style="margin-bottom: 20px;"/>
      <div style="text-align: right;">
        <el-button :loading="loading" @click.native.prevent="closeDialogHandle">取消
        </el-button>
        <el-button type="success" :loading="loading" @click.native.prevent="handleSubmit()">确定
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  let Base64 = require('js-base64').Base64

  import {
    Loading
  } from 'element-ui';

  export default {
    components: {},
    directives: {},
    data() {
      return {
        loading: false,
        dialogTitle: '物联网设备信息设置',
        tipMessage: '',
        params_json: '',
        mqttParam: '',
        deviceType: '',
        deviceId: '',
        deviceData: '',
        deviceModelData: null,
        deviceTypeList: [],
        deviceList: [],

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
      LotInfoDetailDialog: {
        get: function () {
          return this.$store.state.loT.LotInfoDetailDialog
        },
        set: function (newValue) {
          this.$store.state.loT.LotInfoDetailDialog = newValue
        }
      },

    },
    props: {

    },
    created: function () {

    },
    mounted() {
      // const __PROJECT_ID = Cookies.get("PROJECT_ID")
      // this.project_id = parseInt(__PROJECT_ID)

    },
    watch: {


    },
    methods: {
      clearData() {
        this.params_json = ''
        this.mqttParam = ''
        this.deviceType = ''
        this.deviceId = ''
        this.deviceData = ''
        this.deviceModelData = null
        this.deviceTypeList = []
        this.deviceList = []
      },
      async openedDialogHandle() {
        // this.tipMessage = "正在查询ComponentLibraryListDialog"
        console.log('this.LotInfoDetailDialog', this.LotInfoDetailDialog)
        this.deviceModelData = this.LotInfoDetailDialog.deviceModel
        this.deviceTypeList = await this.getDeviceTypeList()
        // this.getDeviceConfigList()
      },
      closeDialogHandle() {
        this.clearData()
        const param = {
          show: false,
          title: '',
        }
        this.$store.dispatch('ShowLotInfoDetailDialog', param).then(() => {}).catch(() => {

        })
      },
      getDeviceTypeList() {
        return new Promise((resolve, reject) => {
          this.buildList = []
          const param = {
            method: 'device_type',
            project_id: this.project_id,

            // access_token: this.access_token
          }
          this.$store.dispatch('GetDeviceType', param).then((_itemList) => {
            console.log('GetDeviceType - _itemList', _itemList)

            resolve(_itemList)
          })

        })
      },
      getDeviceConfigList(deviceType) {
        return new Promise((resolve, reject) => {
          this.buildList = []
          const param = {
            method: 'device_config',
            project_id: this.project_id,
            device_type: deviceType
          }
          this.$store.dispatch('GetDeviceConfig', param).then((_itemList) => {
            console.log('GetDeviceConfig - _itemList', _itemList)

            resolve(_itemList)
          })

        })
      },
      async deviceTypeChangeHandle(deviceType) {
        console.log('deviceType', deviceType)
        this.deviceList = await this.getDeviceConfigList(deviceType)
      },
      deviceChangeHandle(id) {
        console.log('deviceId', id)

        this.deviceList.forEach(_device => {
          if (_device.id === id) {
            this.deviceData = _device
          }
        })
        this.mqttParam = this.deviceData.mqttParam
        this.params_json = JSON.stringify(this.deviceData.params_json)
        if (this.params_json === '{}') {
          this.params_json = ''
        }
        console.log('this.deviceData', this.deviceData)
      },
      handleSubmit() {

      }
    }
  }

</script>
