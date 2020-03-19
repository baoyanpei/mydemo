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
        picData2: null,
        itemInfoListMap: new Map(),
        ViewPointTitle: '',
        editType: 1, // 1 新增 0 修改
        ViewPointCurrentData: null
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
        this.stepActive = 1
        this.picData1 = null
        this.picData2 = null

        this.buildList = []
        this.SelectedBuild = ''
        this.floor = 0
        this.ViewPointType = 0
        this.PositionTitle = ''
        this.ViewPointTitle = ''
        this.itemInfoListMap = new Map()
        this.loadingSaveViewPoint = false
        this.editType = 1
        this.ViewPointCurrentData = null
      },
      async openedSaveDialogHandle() {
        console.log('PositionViewPointManageDialog', this.PositionViewPointManageDialog)
        this.pointViewData = this.PositionViewPointManageDialog['data'];
        this.editType = this.pointViewData.editType
        this.ViewPointType = this.pointViewData.type

        this.ViewPointCurrentData = this.pointViewData.ViewPointCurrentData

        if (this.ViewPointCurrentData !== null && this.editType === 0) {
          this.PositionTitle = this.ViewPointCurrentData.name
          this.ViewPointTitle = this.ViewPointCurrentData.name

          this.floor = this.ViewPointCurrentData.floor_name
          this.picData1 = this.ViewPointCurrentData.top_pic === "" ? null :
            `/api/bim/bcp/thumbnail.jpg?vpid=${this.ViewPointCurrentData.id}&project_id=${this.project_id}&w=380&t=top`

          this.picData2 = this.ViewPointCurrentData.side_pic === "" ? null :
            `/api/bim/bcp/thumbnail.jpg?vpid=${this.ViewPointCurrentData.id}&project_id=${this.project_id}&w=380&t=top`
        }
        this.itemInfoListMap = new Map()

        const __itemInfoList = this.pointViewData.itemInfoList
        __itemInfoList.forEach(itemInfo => {
          console.log('itemInfo', itemInfo)
          this.itemInfoListMap.set(itemInfo.item_id, itemInfo)
        })
        console.log('this.itemInfoListMap', this.itemInfoListMap)
        // await this.exchangeToken(getToken())
        await this.getProjectItemsAll()
        // if (this.editType === 1) { // 新增模式
        if (this.buildList.length === 1) {
          this.SelectedBuild = this.buildList[0].value
        }

      },
      getProjectItemsAll() {
        return new Promise((resolve, reject) => {
          this.buildList = []
          const param = {
            method: 'project_items',
            project_id: this.project_id,
            // access_token: this.access_token
          }
          this.$store.dispatch('GetProjectItems', param).then((_itemList) => {
            console.log('getProjectItemsAll - _itemList', _itemList)

            _itemList.forEach(build => {
              let _itemInfo = this.itemInfoListMap.get(build.id)
              if (_itemInfo !== undefined) {
                if (build.name !== '') {
                  this.buildList.push({
                    value: build.id,
                    label: build.name
                  })
                }
              }

            });
            console.log('buildList', this.buildList)
            resolve()
          })

        })
      },
      closeSaveDialogHandle() {
        this.clearData()
        const param = {
          show: false,
        }
        this.$store.dispatch('ShowPositionViewPointSaveDialog', param).then(() => {}).catch(() => {})
      },
      handleSaveDialogSubmit() {
        let _name = ""
        if (this.ViewPointType === 1) {
          if (this.SelectedBuild === '') {
            this.$message({
              message: '请选择所属建筑!',
              type: 'error'
            });
            return
          } else if (this.PositionTitle === '') {
            this.$message({
              message: '请填写位置说明!',
              type: 'error'
            });
            return
          }
          _name = this.PositionTitle
        } else if (this.ViewPointType === 2) {
          if (this.ViewPointTitle === '') {
            this.$message({
              message: '请填写视点名字!',
              type: 'error'
            });
            return
          }
          _name = this.ViewPointTitle
        }


        const __data = this.pointViewData
        this.loadingSaveViewPoint = true
        const param = {
          "method": "SaveViewPoint",
          "type": __data.type,
          "project_id": this.project_id,
          "item_id": this.SelectedBuild,
          "floor_name": this.floor === 0 ? "" : this.floor,
          "name": _name,
          "desc": "",
          "file_ids": __data.file_ids,
          "item_ids": __data.item_ids,
          "camera_info": __data.camera_info,
          "picture_info": __data.picture_info,
          "svg_info": __data.svg_info,
          "creator": __data.creator
        }

        if (this.picData1 !== null && this.picData1.indexOf('data:image') !== -1) {
          param['top_pic'] = this.picData1
        }
        if (this.picData2 !== null && this.picData2.indexOf('data:image') !== -1) {
          param['side_pic'] = this.picData2
        }
        if (this.editType === 0) {
          param['id'] = this.ViewPointCurrentData.id
        }
        console.log('this.ViewPointSaveDialog.param', param)
        this.$store.dispatch('SaveViewPoint', param).then((result) => {
          console.log('result', result)
          setTimeout(() => {
            this.$store.dispatch('SetViewPointDataChanged', {}).then((result) => {
              this.$message({
                message: '视点保存成功！',
                type: 'success'
              })
              this.loadingSaveViewPoint = false
              this.closeSaveDialogHandle()
            })
          }, 2500);
        })
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
