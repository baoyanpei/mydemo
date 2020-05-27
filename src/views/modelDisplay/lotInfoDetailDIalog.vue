<style lang="scss">
    @import "./lotPositionDialog";
  
  </style>
  <template>
  
    <div id="lot-position-dialog" class="lot-position-dialog">
      <el-dialog :modal="false" width="400px" top="10vh" left="100" :lock-scroll="true" :close-on-click-modal="false"
        :close-on-press-escape="true" :visible.sync="LotInfoDetailDialog.show" @opened="openedDialogHandle"
        @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>
        <el-form ref="lotInfoDetailForm" :model="lotInfoDetailForm" label-width="80px" :inline="true">
          <!-- <el-form-item prop="GroupList" label="X轴方向">
            <el-input-number v-model="lotInfoDetailForm.globalOffset.x" @blur="blurPositionXHandle"></el-input-number>
          </el-form-item> -->
          
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
          dialogTitle: '物联网设备信息设置',
          tipMessage: '',
          lotInfoDetailForm: {
            
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
  
        },
        openedDialogHandle() {
          // this.tipMessage = "正在查询ComponentLibraryListDialog"
          console.log('this.LotInfoDetailDialog', this.LotInfoDetailDialog)
        },
        closeDialogHandle() {
          this.clearData()
        },
        
      }
    }
  
  </script>
  