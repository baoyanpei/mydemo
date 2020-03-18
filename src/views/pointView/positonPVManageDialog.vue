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
          <div v-if="picData1===null" class="pv-picture-area" @click="openPositionPictureDialogHandle(1)">
            <div class="el-upload-dragger"><i class="el-icon-picture"></i>
              <div class="el-upload__text">添加俯视图</div>
            </div>
          </div>
          <div v-if="picData1!==null" class="pv-picture-img" @click="openPositionPictureDialogHandle(1)">
            <img v-bind:src="picData1" />
          </div>
          <div class="pv-picture-delete-icon" @click="removePositionPictureHandle(1)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
        <div class="pv-picture">
          <div v-if="picData2===null" class="pv-picture-area" @click="openPositionPictureDialogHandle(2)">
            <div class="el-upload-dragger"><i class="el-icon-picture"></i>
              <div class="el-upload__text">添加侧视图</div>
            </div>
          </div>
          <div v-if="picData2!==null" class="pv-picture-img" @click="openPositionPictureDialogHandle(2)">
            <img v-bind:src="picData2" />
          </div>
          <div class="pv-picture-delete-icon" @click="removePositionPictureHandle(2)">
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
        pointViewData: null,
        picData1: null,
        picData2: null
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
      PositionPictureSaveData: {
        get: function () {
          return this.$store.state.viewPoint.PositionPictureSaveData
        },
        set: function (newValue) {
          this.$store.state.viewPoint.PositionPictureSaveData = newValue
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
      PositionPictureSaveData: { // 视角列表选择的结果发生改变
        handler: function (newVal, oldVal) {
          // console.log('value changed123 ', newVal)
          this.setPicture(newVal)

          // this.ViewPointCurrentData = newVal
          // this.ShowViewPoint()
          // if (newVal === true) {
          // this.initData()
          // this.getPersonInfo()
          // }

        },
        deep: true
      },
    },
    methods: {
      clearData() {
        this.picData1 = null
        this.picData2 = null
      },
      async openedSaveDialogHandle() {
        console.log('PositionViewPointManageDialog', this.PositionViewPointManageDialog)
        this.pointViewData = this.PositionViewPointManageDialog['data'];
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
        if (this.picData1 === null) {
          this.$message({
            message: '请添加俯视图截图',
            type: 'success'
          })
          return
        } else if (this.picData2 === null) {
          this.$message({
            message: '请添加侧视图截图',
            type: 'success'
          })
          return
        }

        this.stepActive = this.stepActive + 1;
      },
      handlePrevSubmit() {
        this.stepActive = this.stepActive - 1;
      },
      handleSaveDialogCancel() {
        this.closeSaveDialogHandle()
      },
      openPositionPictureDialogHandle(type) {
        // type 1 俯视图 2 侧视图
        const param = {
          show: true,
          type: type,
          pointViewData: this.pointViewData
        }
        this.$store.dispatch('ShowPositionPictureSaveDialog', param).then(() => {}).catch(() => {})
      },
      setPicture(data) {
        console.log('setPicture', data)
        const _type = data.type
        switch (_type) {
          case 1:
            this.picData1 = data.markupsBase64
            break;

          case 2:
            this.picData2 = data.markupsBase64
            break;
        }

      },
      removePositionPictureHandle(type) {
        switch (type) {
          case 1:
            this.picData1 = null
            break;

          case 2:
            this.picData2 = null
            break;
        }
      }
    }
  }

</script>
