<style lang="scss">
@import './sjjPositionDialog';
</style>
<template>
  <div id="sjj-position-dialog" class="sjj-position-dialog">
    <el-dialog
      :modal="false"
      width="400px"
      top="10vh"
      left="100"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :visible.sync="SjjPositionDialog.show"
      @opened="openedDialogHandle"
      @close="closeDialogHandle"
      :title="dialogTitle"
      v-el-drag-dialog
    >
      <el-form ref="tajiPositionForm" :model="tajiPositionForm" label-width="80px" :inline="true">
        <el-tabs type="border-card" style="height: 550px;">
          <el-tab-pane label="轿箱设置">
            <div
              style="font-size: 18px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;"
            >平移</div>
            <el-form-item label="X轴方向">
              <el-input-number
                v-model="tajiPositionForm.elevatorPosition.x"
                @change="lotPositionHandle('elevator_position')"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="Y轴方向">
              <el-input-number
                v-model="tajiPositionForm.elevatorPosition.y"
                @change="lotPositionHandle('elevator_position')"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="Z轴方向">
              <el-input-number
                v-model="tajiPositionForm.elevatorPosition.z"
                @change="lotPositionHandle('elevator_position')"
              ></el-input-number>
            </el-form-item>
            <div
              style="font-size: 18px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;"
            >旋转</div>
            <el-form-item label="初始方向">
              <el-input-number
                v-model="tajiPositionForm.elevatorRotate.z"
                @change="lotPositionHandle('elevator_rotate_z')"
              ></el-input-number>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="大柱设置">
            <div
              style="font-size: 18px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;"
            >平移</div>
            <el-form-item label="X轴方向">
              <el-input-number
                v-model="tajiPositionForm.sectionPosition.x"
                @change="lotPositionHandle('section_position')"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="Y轴方向">
              <el-input-number
                v-model="tajiPositionForm.sectionPosition.y"
                @change="lotPositionHandle('section_position')"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="Z轴方向">
              <el-input-number
                v-model="tajiPositionForm.sectionPosition.z"
                @change="lotPositionHandle('section_position')"
              ></el-input-number>
            </el-form-item>
            <div
              style="font-size: 18px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;"
            >旋转</div>
            <el-form-item label="初始方向">
              <el-input-number
                v-model="tajiPositionForm.sectionRotate.z"
                @change="lotPositionHandle('section_rotate_z')"
              ></el-input-number>
            </el-form-item>
            <div
              style="font-size: 18px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;"
            >高度</div>
            <el-form-item label="模型高度">
              <el-input-number
                v-model="tajiPositionForm.sectionHeight"
                @change="lotPositionHandle('section_height')"
                :min="1"
              ></el-input-number>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="其他设置">
            <div
              style="font-size: 18px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;"
            >缩放</div>
            <el-form-item label="缩放倍数">
              <el-input-number
                v-model="tajiPositionForm.scale"
                @change="lotPositionHandle('scale')"
                :min="1"
              ></el-input-number>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-row></el-row>
        <el-row>
          <el-col :span="12"></el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-form>
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
      dialogTitle: '升降机模型设置',
      tipMessage: '',
      tajiPositionForm: {
        elevatorPosition: {
          x: 0,
          y: 0,
          z: 0
        },
        sectionPosition: {
          x: 0,
          y: 0,
          z: 0
        },
        elevatorRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        sectionRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        sectionHeight: 0,
        scale: 1
      }
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
    SjjPositionDialog: {
      get: function() {
        return this.$store.state.loT.SjjPositionDialog
      },
      set: function(newValue) {
        this.$store.state.loT.SjjPositionDialog = newValue
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
      this.tajiPositionForm = {
        elevatorPosition: {
          x: 0,
          y: 0,
          z: 0
        },
        sectionPosition: {
          x: 0,
          y: 0,
          z: 0
        },
        elevatorRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        sectionRotate: {
          x: 0,
          y: 0,
          z: 0
        },
        sectionHeight: 0,
        scale: 1
      }
    },
    openedDialogHandle() {
      // this.tipMessage = "正在查询ComponentLibraryListDialog"
      console.log('this.SjjPositionDialogAAAAAAA', this.SjjPositionDialog)
      this.tajiPositionForm.elevatorPosition = this.SjjPositionDialog.elevatorPosition
      this.tajiPositionForm.sectionPosition = this.SjjPositionDialog.sectionPosition
      this.tajiPositionForm.elevatorRotate.z = this.SjjPositionDialog.elevatorRotate.z
      this.tajiPositionForm.sectionRotate.z = this.SjjPositionDialog.sectionRotate.z
      this.tajiPositionForm.sectionHeight = this.SjjPositionDialog.sectionHeight
      this.tajiPositionForm.scale = this.SjjPositionDialog.scale
    },
    closeDialogHandle() {
      this.clearData()
    },
    lotPositionHandle(type) {
      console.log(
        'tajiPositionForm',
        type,
        this.tajiPositionForm.elevatorPosition.x
      )

      let param = {
        type: type,
        elevatorPosition: this.tajiPositionForm.elevatorPosition,
        sectionPosition: this.tajiPositionForm.sectionPosition,
        elevatorRotate: this.tajiPositionForm.elevatorRotate,
        sectionRotate: this.tajiPositionForm.sectionRotate,
        sectionHeight: this.tajiPositionForm.sectionHeight,
        scale: this.tajiPositionForm.scale
      }
      // console.log('param', param)
      this.$store.dispatch('SetTajiPositionChange', param).then(result => {})
    }
  }
}
</script>
