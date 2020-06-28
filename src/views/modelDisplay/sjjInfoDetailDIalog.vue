<style lang="scss">
@import './sjjInfoDetailDIalog';
</style>
<template>
  <div id="sjj-info-detail-dialog" class="sjj-info-detail-dialog">
    <el-dialog
      :modal="false"
      width="600px"
      top="10vh"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :visible.sync="SjjInfoDetailDialog.show"
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
        <el-form-item prop="deviceId" label="升降机" :rules="ruleDeviceId">
          <el-select
            v-model="lotInfoDetailForm.deviceId"
            name="deviceId"
            :disabled="deviceDisabled"
            @change="deviceChangeHandle"
            placeholder="请选择升降机"
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
          <span v-if="deviceModelData !== null">升降机模型</span>
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
        callback(new Error('请选择升降机'))
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

    return {
      tipMessage: '',
      loading: false,
      dialogTitle: '升降机信息设置',
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
      lotInfoDetailForm: {
        deviceType: '',
        deviceId: '',
        params_json: '',
        mqttParam: ''
      },

      buildItem: null,
      deviceName: '',
      deviceEditData: null, // 设备的数据
      deviceModelData: null, // 设备的模型
      elevatorPosition: null,
      sectionPosition: null,
      elevatorRotate: null,
      sectionRotate: null,
      sectionHeight: null,
      scale: null,
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
    SjjInfoDetailDialog: {
      get: function() {
        return this.$store.state.loT.SjjInfoDetailDialog
      },
      set: function(newValue) {
        this.$store.state.loT.SjjInfoDetailDialog = newValue
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

      this.elevatorPosition = null
      this.sectionPosition = null
      this.elevatorRotate = null
      this.sectionRotate = null
      this.sectionHeight = null
      this.scale = null
      this.deviceList = []
      this.lotInfoDetailForm = {
        deviceType: '',
        deviceId: '',
        params_json: '',
        mqttParam: ''
      }
      this.$refs.lotInfoDetailForm.resetFields()
    },
    async openedDialogHandle() {
      // this.tipMessage = "正在查询ComponentLibraryListDialog"
      console.log('this.TajiInfoDetailDialog1111', this.SjjInfoDetailDialog)
      this.buildItem = this.SjjInfoDetailDialog.buildItem
      this.deviceModelData = this.SjjInfoDetailDialog.deviceModel
      this.deviceEditData = this.SjjInfoDetailDialog.deviceEditData

      this.elevatorPosition = this.SjjInfoDetailDialog.elevatorPosition
      this.sectionPosition = this.SjjInfoDetailDialog.sectionPosition
      this.elevatorRotate = this.SjjInfoDetailDialog.elevatorRotate
      this.sectionRotate = this.SjjInfoDetailDialog.sectionRotate
      this.sectionHeight = this.SjjInfoDetailDialog.sectionHeight
      this.scale = this.SjjInfoDetailDialog.scale

      this.deviceList = await this.getDeviceConfigList(12)
      console.log(
        'this.deviceListthis.deviceListthis.deviceList',
        this.deviceList
      )
      if (this.deviceEditData !== null) {
        // this.deviceTypeDisabled = true
        this.deviceDisabled = true
        this.deviceName = this.deviceEditData.device_name
        // if (this.deviceEditData.family_id > 0) {
        //   const familyLocation = JSON.parse(this.deviceEditData.family_location)

        // }

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
        .dispatch('ShowSjjInfoDetailDialog', param)
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
    // 手工选择升降机下拉
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
              elevatorPosition: this.elevatorPosition,
              sectionPosition: this.sectionPosition,
              elevatorRotate: this.elevatorRotate,
              sectionRotate: this.sectionRotate,
              sectionHeight: this.sectionHeight,
              scale: this.scale
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
