<style lang="scss">
@import './tajiInfoDetailDIalog';
</style>
<template>
  <div id="taji-info-detail-dialog" class="taji-info-detail-dialog">
    <el-dialog
      :modal="false"
      width="600px"
      top="10vh"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :visible.sync="TajiInfoDetailDialog.show"
      @opened="openedDialogHandle"
      @close="closeDialogHandle"
      :title="dialogTitle"
      v-el-drag-dialog
    >
      <el-form
        ref="lotInfoDetailForm"
        :model="lotInfoDetailForm"
        label-width="150px"
        :inline="false"
      >
        <el-form-item prop="deviceId" label="塔机" :rules="ruleDeviceId">
          <el-select
            v-model="lotInfoDetailForm.deviceId"
            name="deviceId"
            :disabled="deviceDisabled"
            @change="deviceChangeHandle"
            placeholder="请选择塔吊"
            size="mini"
          >
            <el-option
              v-for="item in deviceList"
              :key="item.id"
              :label="`${item.device_name}`"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物联网模型">
          <span v-if="deviceModelData === null">不配置模型</span>
          <span v-if="deviceModelData !== null">塔机模型</span>
        </el-form-item>
        <el-form-item prop="displayHeight" label="塔机实际高度（米）" :rules="ruleDisplayHeight" :min="0">
          <el-input-number name="displayHeight" v-model="lotInfoDetailForm.displayHeight"></el-input-number>
        </el-form-item>
        <el-form-item label="mqtt地址">
          <el-input type="input" v-model="lotInfoDetailForm.mqttParam"></el-input>
        </el-form-item>
        <el-form-item prop="params_json" label="其他参数" :rules="ruleParamsJson">
          <el-input
            type="textarea"
            v-model="lotInfoDetailForm.params_json"
            name="params_json"
            :rows="6"
          ></el-input>
        </el-form-item>
      </el-form>
      <hr class="hr1" style="margin-bottom: 20px;" />
      <div style="text-align: right;">
        <el-button :loading="loading" @click.native.prevent="closeDialogHandle">取消</el-button>
        <el-button type="success" :loading="loading" @click.native.prevent="handleSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64
import { isJSON } from '@/utils/validate'

import { Loading } from 'element-ui'

export default {
  components: {},
  directives: {},
  data() {
    const validateDeviceId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择塔机'))
      } else {
        callback()
      }
    }

    const validateParamsJson = (rule, value, callback) => {
      if (value !== '' && !isJSON(value)) {
        callback(
          new Error('参数必须为JSON格式,key必须用双印号，如：{"aaaa": 1}')
        )
      } else {
        callback()
      }
    }
    const validateDisplayHeight = (rule, value, callback) => {
      if (value <= 0 && this.deviceModelData !== null) {
        callback(new Error('塔机实际高度必须大于0米'))
      } else {
        callback()
      }
    }

    return {
      tipMessage: '',
      loading: false,
      dialogTitle: '塔机信息设置',
      // deviceTypeDisabled: false,
      deviceDisabled: false,
      ruleDeviceId: [
        {
          required: true,
          trigger: 'blur',
          validator: validateDeviceId
        }
      ],
      ruleParamsJson: [
        {
          // required: true,
          trigger: 'blur',
          validator: validateParamsJson
        }
      ],
      ruleDisplayHeight: [
        {
          // required: true,
          trigger: 'blur',
          validator: validateDisplayHeight
        }
      ],
      lotInfoDetailForm: {
        deviceType: '',
        deviceId: '',
        params_json: '',
        mqttParam: '',
        displayHeight: 0
      },

      buildItem: null,
      deviceName: '',
      deviceEditData: null, // 设备的数据
      deviceModelData: null, // 设备的模型
      devicePosition: null, // 模型的位置
      deviceRotate: null, // 模型的旋转
      tajiHeight: 0,
      tajiScale: 1,
      deviceList: []
    }
  },
  computed: {
    project_id: {
      get: function() {
        return this.$store.state.project.project_id
      },
      set: function(newValue) {
        this.$store.state.project.project_id = newValue
      }
    },
    TajiInfoDetailDialog: {
      get: function() {
        return this.$store.state.loT.TajiInfoDetailDialog
      },
      set: function(newValue) {
        this.$store.state.loT.TajiInfoDetailDialog = newValue
      }
    }
  },
  props: {},
  created: function() {},
  mounted() {},
  watch: {},
  methods: {
    clearData() {
      this.tipMessage = ''
      this.loading = false
      // this.deviceTypeDisabled = false
      this.deviceDisabled = false
      this.buildItem = null
      this.deviceName = ''
      this.deviceEditData = null
      this.deviceModelData = null
      this.devicePosition = null // 模型的位置
      this.deviceRotate = null // 模型的旋转
      this.deviceList = []
      this.tajiHeight = 0
      this.tajiScale = 1
      this.lotInfoDetailForm = {
        deviceType: '',
        deviceId: '',
        params_json: '',
        mqttParam: '',
        displayHeight: 0
      }
      this.$refs.lotInfoDetailForm.resetFields()
    },
    async openedDialogHandle() {
      // this.tipMessage = "正在查询ComponentLibraryListDialog"
      console.log('this.TajiInfoDetailDialog1111', this.TajiInfoDetailDialog)
      this.buildItem = this.TajiInfoDetailDialog.buildItem
      this.deviceModelData = this.TajiInfoDetailDialog.deviceModel
      this.deviceEditData = this.TajiInfoDetailDialog.deviceEditData
      this.devicePosition = this.TajiInfoDetailDialog.devicePosition // 模型的位置
      this.deviceRotate = this.TajiInfoDetailDialog.deviceRotate // 模型的旋转
      this.tajiHeight = this.TajiInfoDetailDialog.tajiHeight // 塔机的高度
      this.tajiScale = this.TajiInfoDetailDialog.tajiScale // 塔机的比例
      this.deviceList = await this.getDeviceConfigList(13)
      console.log(
        'this.deviceListthis.deviceListthis.deviceList',
        this.deviceList
      )
      if (this.deviceEditData !== null) {
        // this.deviceTypeDisabled = true
        this.deviceDisabled = true
        this.deviceName = this.deviceEditData.device_name
        if (this.deviceEditData.family_id > 0) {
          const familyLocation = JSON.parse(this.deviceEditData.family_location)
          this.lotInfoDetailForm.displayHeight = familyLocation.displayHeight
        }

        // let _dType = this.deviceEditData.device_type
        // this.lotInfoDetailForm.deviceType = _dType
        // this.deviceTypeChangeHandle(_dType)
        this.lotInfoDetailForm.deviceId = this.deviceEditData.id

        if (this.deviceEditData.params_json !== '') {
          this.lotInfoDetailForm.params_json = JSON.stringify(
            this.deviceEditData.params_json
          )
          if (this.lotInfoDetailForm.params_json === '{}') {
            this.lotInfoDetailForm.params_json = ''
          }
        }
        this.lotInfoDetailForm.mqttParam = this.deviceEditData.mqtt_url
      }
    },
    closeDialogHandle() {
      this.clearData()
      const param = {
        show: false,
        title: ''
      }
      this.$store
        .dispatch('ShowTajiInfoDetailDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    getDeviceConfigList(deviceType) {
      return new Promise((resolve, reject) => {
        this.buildList = []
        const param = {
          method: 'device_config',
          project_id: this.project_id,
          device_type: deviceType
        }
        this.$store.dispatch('GetDeviceConfig', param).then(_itemList => {
          console.log('GetDeviceConfig - _itemList', _itemList)

          let _deviceList = []
          if (this.deviceEditData === null) {
            _itemList.forEach(_item => {
              if (_item.family_id === 0) {
                _deviceList.push(_item)
              }
            })
          } else {
            _deviceList = _itemList
          }
          console.log('deviceEditData _deviceList', _deviceList)
          resolve(_deviceList)
        })
      })
    },
    // async deviceTypeChangeHandle(deviceType) {
    //   console.log('deviceType', deviceType)
    //   this.lotInfoDetailForm.deviceId = ''
    //   this.deviceList = await this.getDeviceConfigList(deviceType)
    // },
    // 手工选择塔机下拉
    deviceChangeHandle(id) {
      console.log('deviceId', id)
      let _deviceData = null
      this.deviceList.forEach(_device => {
        if (_device.id === id) {
          _deviceData = _device
        }
      })

      if (_deviceData.params_json !== '') {
        this.lotInfoDetailForm.params_json = JSON.stringify(
          _deviceData.params_json
        )
        if (this.lotInfoDetailForm.params_json === '{}') {
          this.lotInfoDetailForm.params_json = ''
        }
      }

      this.lotInfoDetailForm.mqttParam = _deviceData.mqtt_url
      console.log('_deviceData', _deviceData)
      this.deviceName = _deviceData.device_name
    },
    handleSubmit() {
      console.log('handleSubmit')
      this.$refs.lotInfoDetailForm.validate(valid => {
        console.log('valid', valid)
        if (valid) {
          this.loading = true
          console.log('this.lotInfoDetailForm', this.lotInfoDetailForm)

          let _paramsJson = this.lotInfoDetailForm.params_json
          if (_paramsJson !== '') {
            _paramsJson = JSON.parse(this.lotInfoDetailForm.params_json)
          }
          let param = {
            method: 'device_config_update',
            project_id: this.project_id,
            id: this.lotInfoDetailForm.deviceId,
            mqtt_url: this.lotInfoDetailForm.mqttParam,
            params_json: _paramsJson,
            buliding_id: '',
            family_id: '',
            family_location: ''
          }

          if (this.deviceModelData !== null) {
            param['buliding_id'] = this.buildItem.item_id
            param['family_id'] = 999999
            let _familyLocation = {
              position: this.devicePosition,
              rotate: this.deviceRotate,
              displayHeight: this.lotInfoDetailForm.displayHeight,
              height: this.tajiHeight,
              scale: this.tajiScale
            }
            param['family_location'] = JSON.stringify(_familyLocation)
          }
          console.log('paramparam', param)
          this.$store.dispatch('UpdateDeviceConfig', param).then(personList => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.SetLotInfoDetailSavedChange()
            this.loading = false
          })
        }
      })
    },
    SetLotInfoDetailSavedChange() {
      let param = {
        device_name: this.deviceName
      }
      this.$store
        .dispatch('SetLotInfoDetailSavedChange', param)
        .then(personList => {})
    }
  }
}
</script>
