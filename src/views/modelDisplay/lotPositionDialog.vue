<style lang="scss">
  @import "./lotPositionDialog";

</style>
<template>

  <div id="lot-position-dialog" class="lot-position-dialog">
    <el-dialog :modal="false" width="400px" top="10vh" left="100" :lock-scroll="true" :close-on-click-modal="false"
      :close-on-press-escape="true" :visible.sync="LotPositionDialog.show" @opened="openedDialogHandle"
      @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>
      <el-form ref="lotPositionForm" :model="lotPositionForm" label-width="80px" :inline="true">
        <div style="font-size: 20px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;">平移</div>
        <el-form-item label="X轴方向">
          <el-input-number v-model="lotPositionForm.globalOffset.x" @change="lotPositionHandle('position_x')">
          </el-input-number>
        </el-form-item>
        <el-form-item label="Y轴方向">
          <el-input-number v-model="lotPositionForm.globalOffset.y" @change="lotPositionHandle('position_y')">
          </el-input-number>
        </el-form-item>
        <el-form-item label="Z轴方向">
          <el-input-number v-model="lotPositionForm.globalOffset.z" @change="lotPositionHandle('position_z')">
          </el-input-number>
        </el-form-item>
        <div style="font-size: 20px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;">旋转</div>
        <el-form-item label="X轴方向">
          <el-input-number v-model="lotPositionForm.rotate.x" @change="lotPositionHandle('rotate_x')"></el-input-number>
        </el-form-item>
        <el-form-item label="Y轴方向">
          <el-input-number v-model="lotPositionForm.rotate.y" @change="lotPositionHandle('rotate_y')"></el-input-number>
        </el-form-item>
        <el-form-item label="Z轴方向">
          <el-input-number v-model="lotPositionForm.rotate.z" @change="lotPositionHandle('rotate_z')"></el-input-number>
        </el-form-item>
      </el-form>
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
        dialogTitle: '物联网设备位置设置',
        tipMessage: '',
        lotPositionForm: {
          globalOffset: {
            x: 0,
            y: 0,
            z: 0
          },
          rotate: {
            x: 0,
            y: 0,
            z: 0
          }
        }
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
      LotPositionDialog: {
        get: function () {
          return this.$store.state.loT.LotPositionDialog
        },
        set: function (newValue) {
          this.$store.state.loT.LotPositionDialog = newValue
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
      openedDialogHandle() {
        // this.tipMessage = "正在查询ComponentLibraryListDialog"
        console.log('this.LotPositionDialog', this.LotPositionDialog)
        this.lotPositionForm.globalOffset = this.LotPositionDialog.globalOffset
      },
      closeDialogHandle() {
        this.clearData()
      },
      lotPositionHandle(type) {
        console.log("lotPositionForm", type, this.lotPositionForm.globalOffset.x)
        
        let param = {
          type: type,
          globalOffset: this.lotPositionForm.globalOffset
        }
        console.log('param', param)
        this.$store.dispatch('SetLotPositionChange', param).then((result) => {

        })
      }
    }
  }

</script>
