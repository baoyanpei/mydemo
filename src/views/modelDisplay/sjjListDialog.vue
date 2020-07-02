<style lang="scss">
@import './sjjListDialog';
</style>
<template>
  <div id="sjj-list-dialog" class="sjj-list-dialog">
    <el-dialog
      :modal="false"
      width="450px"
      top="10vh"
      left="100"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :visible.sync="SjjListDialog.show"
      @opened="openedDialogHandle"
      @close="closeDialogHandle"
      :title="dialogTitle"
      v-el-drag-dialog
    >
      <div class="device_list">
        <div v-show="tipMessage!==''" class="tip-message">{{tipMessage}}</div>
        <el-row
          v-show="tipMessage===''"
          v-for="(item,index) in deviceList"
          :key="index"
          class="library-item"
        >
          <el-col :span="10" style="padding-left:5px;">
            <el-row :gutter="24">
              <div class="grid-content info-title">
                <span class="info-title-link">{{item.device_name}}</span>
              </div>
            </el-row>
          </el-col>
          <el-col :span="14">
            <div class="view-point-button">
              <el-button size="mini" type="primary" @click="findDeviceHandle(item,'find')">查找</el-button>
              <!-- <el-button size="mini" type="primary" @click="findDeviceHandle(item,'select')">高亮</el-button> -->
              <el-button size="mini" type="primary" @click="editDeviceHandle(item)">编辑</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64

import { Loading } from 'element-ui'

export default {
  components: {},
  directives: {},
  data() {
    return {
      loadingFull: false,
      dialogTitle: '已经配置的升降机',
      tipMessage: '',
      buildItem: null, // 建筑模型信息
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
    SjjListDialog: {
      get: function() {
        return this.$store.state.loT.SjjListDialog
      },
      set: function(newValue) {
        this.$store.state.loT.SjjListDialog = newValue
      }
    }
  },
  props: {},
  created: function() {},
  mounted() {
    // const __PROJECT_ID = Cookies.get("PROJECT_ID")
    // this.project_id = parseInt(__PROJECT_ID)
  },
  watch: {},
  methods: {
    clearData() {
      this.tipMessage = ''
      this.deviceList = []
      this.buildItem = null
    },
    async openedDialogHandle() {
      // this.tipMessage = "正在查询ComponentLibraryListDialog"
      this.buildItem = this.SjjListDialog.buildItem
      console.log('this.SjjListDialog', this.SjjListDialog)
      this.tipMessage = '正在查询...'
      this.deviceList = await this.getDeviceConfigList()
      if (this.deviceList.length === 0) {
        this.tipMessage = '当前建筑中没有配置升降机模型'
        return
      }
      this.tipMessage = ''
    },
    closeDialogHandle() {
      this.clearData()
    },

    getDeviceConfigList() {
      return new Promise((resolve, reject) => {
        let tajiList = []
        const param = {
          method: 'device_config',
          project_id: this.project_id,
          buliding_id: this.buildItem.item_id
        }
        this.$store.dispatch('GetDeviceConfig', param).then(_itemList => {
          console.log('GetDeviceConfig - _itemList', _itemList)
          _itemList.forEach(item => {
            if (item.device_type === 12) {
              tajiList.push(item)
            }
          })

          resolve(tajiList)
        })
      })
    },
    editDeviceHandle(item) {
      console.log('item', item)
      let param = {
        device: item
      }
      console.log('param', param)
      this.$store.dispatch('SetLotDeviceEditChange', param).then(result => {
        this.closeDialog()
      })
    },
    findDeviceHandle(item, type) {
      console.log('item', item)
      let param = {
        device: item,
        type: type
      }
      console.log('param', param)
      this.$store.dispatch('SetLotDeviceFindChange', param).then(result => {
        // this.closeDialog()
      })
    },
    closeDialog() {
      this.$store
        .dispatch('ShowLotListDialog', {
          show: false
        })
        .then(() => {})
        .catch(() => {})
    }
  }
}
</script>
