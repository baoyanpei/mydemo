<style lang="scss">
  @import "./lotListDialog";

</style>
<template>

  <div id="lot-list-dialog" class="lot-list-dialog">
    <el-dialog :modal="false" width="400px" top="10vh" left="100" :lock-scroll="true" :close-on-click-modal="false"
      :close-on-press-escape="true" :visible.sync="LotListDialog.show" @opened="openedDialogHandle"
      @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>

      <div class="device_list">
        <div v-show="tipMessage!==''" class="tip-message">{{tipMessage}}</div>
        <el-row v-for="(item,index) in deviceList" :key="index" class="library-item">
          <el-col :span="14" style="padding-left:5px;">
            <el-row :gutter="24">
              <div class="grid-content info-title">
                <span class="info-title-link">{{item.device_name}}</span>
              </div>
            </el-row>

          </el-col>
          <el-col :span="10">
            <div class="view-point-button">
              <el-button size="mini"  type="primary" @click="findDeviceHandle(item)">查找</el-button>
              <el-button size="mini"  type="primary" @click="editDeviceHandle(item)">编辑</el-button>
            </div>
          </el-col>
        </el-row>
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
        loadingFull: false,
        dialogTitle: '物联网设备库',
        tipMessage: '',
        buildItem: null, // 建筑模型信息
        deviceList: []

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
      LotListDialog: {
        get: function () {
          return this.$store.state.loT.LotListDialog
        },
        set: function (newValue) {
          this.$store.state.loT.LotListDialog = newValue
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

      },
      async openedDialogHandle() {
        // this.tipMessage = "正在查询ComponentLibraryListDialog"
        this.buildItem = this.LotListDialog.buildItem
        console.log('this.LotListDialog', this.LotListDialog)

        this.deviceList = await this.getDeviceConfigList()
      },
      closeDialogHandle() {
        this.clearData()
      },

      getDeviceConfigList() {
        return new Promise((resolve, reject) => {
          this.buildList = []
          const param = {
            method: 'device_config',
            project_id: this.project_id,
            buliding_id: this.buildItem.item_id
          }
          this.$store.dispatch('GetDeviceConfig', param).then((_itemList) => {
            console.log('GetDeviceConfig - _itemList', _itemList)

            resolve(_itemList)
          })

        })
      },
      editDeviceHandle(item) {
        console.log('item', item)
        let param = {
          device: item
        }
        console.log('param', param)
        this.$store.dispatch('SetLotDeviceEditChange', param).then((result) => {
          this.closeDialog()
        })

      },
      findDeviceHandle(item) {
        console.log('item', item)
        let param = {
          device: item
        }
        console.log('param', param)
        this.$store.dispatch('SetLotDeviceFindChange', param).then((result) => {
          // this.closeDialog()
        })


        
      },
      closeDialog() {
        this.$store.dispatch('ShowLotListDialog', {
          show: false
        }).then(() => {}).catch(() => {})
      }
    }
  }

</script>
