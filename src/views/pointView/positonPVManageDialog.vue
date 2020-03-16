<style lang="scss">
  @import "./positonPVManageDialog";

</style>
<template>

  <div id="positon-view-point-manage-dialog" class="positon-view-point-manage-dialog">
    <el-dialog :modal="true" :close-on-click-modal="false" width="500px" top="10vh" :lock-scroll="true"
      :visible.sync="PositionViewPointManageDialog.show" @opened="openedSaveDialogHandle" @close="closeSaveDialogHandle"
      :title="dialogTitle" v-el-drag-dialog>
      <el-steps :active="stepActive" finish-status="success" simple>
        <el-step title="1.标定位置视点" icon="el-icon-edit"></el-step>
        <el-step title="2.添加缩略图" icon="el-icon-upload"></el-step>
        <el-step title="3.填写基本信息" icon="el-icon-picture"></el-step>
      </el-steps>
      <div class="step-title">
        <span v-if="stepActive===1">添加缩略图</span>
        <span v-if="stepActive===2">基本信息</span>
      </div>
      <div v-if="stepActive===1" class="position-view-point-picture">
        <div class="pv-picture">
          <div class="pv-picture-area" @click="openPositionPicuureDialogHandle(1)">
            <div class="el-upload-dragger"><i class="el-icon-picture"></i>
              <div class="el-upload__text">添加俯视图</div>
            </div>
          </div>
          <div class="pv-picture-delete-icon">
            <i class="el-icon-delete"></i>
          </div>
        </div>
        <div class="pv-picture">
          <div class="pv-picture-area" @click="openPositionPicuureDialogHandle(1)">
            <div class="el-upload-dragger"><i class="el-icon-picture"></i>
              <div class="el-upload__text">添加侧视图</div>
            </div>
          </div>
          <div class="pv-picture-delete-icon">
            <i class="el-icon-delete"></i>
          </div>
        </div>
      </div>
      <div v-if="stepActive===2" class="position-view-point-from">
        <el-form ref="viewPointPositionSaveForm" :model="viewPointPositionSaveForm" label-width="80px" :inline="true">
          <div v-if="ViewPointType === 1">
            <el-form-item label="所属建筑">
              <el-select v-model="SelectedBuild" placeholder="请选择" style="width: 260px;" disabled>
                <el-option v-for="item in buildList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="位置楼层">
              <el-input-number v-model="floor" :min="floorMin" :max="floorMax" style="width: 160px;">
              </el-input-number>
              &nbsp;&nbsp;层
            </el-form-item>
            <el-form-item label="位置说明">
              <el-input v-model="PositionTitle" placeholder="请填写位置说明" style="width: 260px;"></el-input>
            </el-form-item>
          </div>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click='handleSaveDialogCancel'>取 消</el-button>
        <el-button v-if="stepActive==2" :loading="loadingSaveViewPoint" @click="handlePrevSubmit">上一步
        </el-button>
        <el-button v-if="stepActive==2" type="primary" :loading="loadingSaveViewPoint" @click="handleSaveDialogSubmit">
          完成</el-button>
        <el-button v-else type="primary" :loading="loadingSaveViewPoint" @click="handleNextSubmit">下一步</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    components: {},
    directives: {},
    data() {
      return {
        dialogTitle: '位置标定',
        loadingSaveViewPoint: false, // 保存视点按钮加载
        stepActive: 1,
        ViewPointType: 1,
        viewPointPositionSaveForm: {},
        floor: 0,
        SelectedBuild: '',
        PositionTitle: '',
        floorMin: -10,
        floorMax: 100,
        buildList: [], // 1 楼层 2 普通
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
      PositionViewPointManageDialog: {
        get: function () {
          return this.$store.state.viewPoint.PositionViewPointManageDialog
        },
        set: function (newValue) {
          this.$store.state.viewPoint.PositionViewPointManageDialog = newValue
        }
      },
    },
    props: {

    },
    created: function () {

    },
    mounted() {

    },
    watch: {

    },
    methods: {
      clearData() {

      },
      async openedSaveDialogHandle() {

      },
      closeSaveDialogHandle() {
        this.clearData()
        const param = {
          show: false,
        }
        this.$store.dispatch('ShowPositionViewPointSaveDialog', param).then(() => {}).catch(() => {})
      },
      handleSaveDialogSubmit() {

      },
      handleNextSubmit() {
        this.stepActive = this.stepActive + 1;
      },
      handlePrevSubmit() {
        this.stepActive = this.stepActive - 1;
      },
      handleSaveDialogCancel() {
        this.closeSaveDialogHandle()
      },
      openPositionPicuureDialogHandle(){
        const param = {
          show: true,
        }
        this.$store.dispatch('ShowPositionPictureSaveDialog', param).then(() => {}).catch(() => {})
      }
    }
  }

</script>
