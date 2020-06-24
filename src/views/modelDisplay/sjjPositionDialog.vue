<style lang="scss">
    @import "./lotPositionDialog";
  
  </style>
  <template>
  
    <div id="sjj-position-dialog" class="sjj-position-dialog">
      <el-dialog :modal="false" width="400px" top="10vh" left="100" :lock-scroll="true" :close-on-click-modal="false"
        :close-on-press-escape="true" :visible.sync="SjjPositionDialog.show" @opened="openedDialogHandle"
        @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>
        <el-form ref="tajiPositionForm" :model="tajiPositionForm" label-width="80px" :inline="true">
          <div style="font-size: 20px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;">平移</div>
          <el-form-item label="X轴方向">
            <el-input-number v-model="tajiPositionForm.globalOffset.x" @change="lotPositionHandle('position_x')">
            </el-input-number>
          </el-form-item>
          <el-form-item label="Y轴方向">
            <el-input-number v-model="tajiPositionForm.globalOffset.y" @change="lotPositionHandle('position_y')">
            </el-input-number>
          </el-form-item>
          <el-form-item label="Z轴方向">
            <el-input-number v-model="tajiPositionForm.globalOffset.z" @change="lotPositionHandle('position_z')">
            </el-input-number>
          </el-form-item>
          <div style="font-size: 20px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;">高度</div>
          <el-form-item label="模型高度">
            <el-input-number v-model="tajiPositionForm.height" @change="lotPositionHandle('height')" :min="1">
            </el-input-number>
          </el-form-item>
          <div style="font-size: 20px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;">缩放</div>
          <el-form-item label="缩放倍数">
            <el-input-number v-model="tajiPositionForm.scale" @change="lotPositionHandle('scale')" :min="1">
            </el-input-number>
          </el-form-item>
          <div style="font-size: 20px;margin: 10px;padding: 10px;border-bottom: 1px solid #eeeeee;">旋转</div>
          <el-form-item label="初始方向">
            <el-input-number v-model="tajiPositionForm.rotate.z" @change="lotPositionHandle('rotate_z')">
            </el-input-number>
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
          dialogTitle: '升降机模型设置',
          tipMessage: '',
          tajiPositionForm: {
            globalOffset: {
              x: 0,
              y: 0,
              z: 0
            },
            rotate: {
              x: 0,
              y: 0,
              z: 0
            },
            height: 0,
            scale: 1
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
        SjjPositionDialog: {
          get: function () {
            return this.$store.state.loT.SjjPositionDialog
          },
          set: function (newValue) {
            this.$store.state.loT.SjjPositionDialog = newValue
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
          console.log('this.SjjPositionDialog', this.SjjPositionDialog)
          this.tajiPositionForm.globalOffset = this.SjjPositionDialog.position
          //   this.tajiPositionForm.rotate.x = this.SjjPositionDialog.rotate.x
          //   this.tajiPositionForm.rotate.y = this.SjjPositionDialog.rotate.y
          this.tajiPositionForm.rotate.z = this.SjjPositionDialog.rotate.z
          this.tajiPositionForm.height = this.SjjPositionDialog.height
          this.tajiPositionForm.scale = this.SjjPositionDialog.scale
        },
        closeDialogHandle() {
          this.clearData()
        },
        lotPositionHandle(type) {
          console.log("tajiPositionForm", type, this.tajiPositionForm.globalOffset.x)
  
          let param = {
            type: type,
            globalOffset: this.tajiPositionForm.globalOffset,
            rotate: this.tajiPositionForm.rotate,
            height: this.tajiPositionForm.height,
            scale: this.tajiPositionForm.scale,
          }
          console.log('param', param)
          this.$store.dispatch('SetTajiPositionChange', param).then((result) => {
  
          })
        }
      }
    }
  
  </script>
  