<style lang="scss">
  @import "./saveDialog";

</style>
<template>

  <div id="view-point-save-dialog" class="view-point-save-dialog">
    <el-dialog :modal="true" :close-on-click-modal="false" width="400px" top="10vh" :lock-scroll="true"
      :visible.sync="ViewPointSaveDialog.show" @opened="openedSaveDialogHandle" @close="closeSaveDialogHandle"
      :title="dialogTitle" v-el-drag-dialog>
      <div id="view-point-save-from" class="view-point-save-from">
        <el-form ref="viewPointPositionSaveForm" :model="viewPointPositionSaveForm" label-width="80px" :inline="true">
          <div v-if="ViewPointType === 1">
            <el-form-item label="所属建筑">
              <el-select v-model="SelectedBuild" placeholder="请选择" style="width: 260px;" disabled>
                <el-option v-for="item in buildList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="位置楼层">
              <el-input-number v-model="floor" :min="floorMin" :max="floorMax" style="width: 160px;"></el-input-number>
              &nbsp;&nbsp;层
            </el-form-item>
            <el-form-item label="位置说明">
              <el-input v-model="PositionTitle" placeholder="请填写位置说明" style="width: 260px;"></el-input>
            </el-form-item>
          </div>
          <div v-if="ViewPointType === 2">
            <el-form-item label="视点名字">
              <el-input v-model="ViewPointTitle" placeholder="请填写视点名字" style="width: 260px;"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loadingSaveViewPoint" @click="handleSaveDialogSubmit">确 定</el-button>
        <el-button @click='handleSaveDialogCancel'>取 消</el-button>

      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {
    getToken
  } from '@/utils/auth'
  export default {
    components: {},
    directives: {},
    data() {
      return {
        dialogTitle: '编辑位置信息',
        loadingSaveViewPoint: false, // 保存视点按钮加载
        viewPointPositionSaveForm: {},
        ViewPointType: 0, // 1 楼层 2 普通
        buildList: [],
        itemInfoListMap: new Map(),
        floorMin: -10,
        floorMax: 100,
        SelectedBuild: '',
        floor: 0,
        PositionTitle: '',
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
      ViewPointSaveDialog: {
        get: function () {
          return this.$store.state.viewPoint.ViewPointSaveDialog
        },
        set: function (newValue) {
          this.$store.state.viewPoint.ViewPointSaveDialog = newValue
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
        console.log('ViewPointSaveDialog', this.ViewPointSaveDialog)
        let _data = this.ViewPointSaveDialog.data
        this.editType = _data.editType
        switch (this.editType) {
          case 0:
            this.dialogTitle = '修改位置信息'
            break;
          case 1:
            this.dialogTitle = '新增位置信息'
            break;
        }
        this.ViewPointType = _data.type

        this.ViewPointCurrentData = _data.ViewPointCurrentData

        if (this.ViewPointCurrentData !== null && _data.editType === 0) {
          this.PositionTitle = this.ViewPointCurrentData.name
          this.ViewPointTitle = this.ViewPointCurrentData.name

          this.floor = this.ViewPointCurrentData.floor_name
        }
        this.itemInfoListMap = new Map()

        const __itemInfoList = _data.itemInfoList
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
        // }

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
        this.$store.dispatch('ShowViewPointSaveDialog', param).then(() => {}).catch(() => {})
      },
      handleSaveDialogCancel() {
        this.closeSaveDialogHandle()
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


        const __data = this.ViewPointSaveDialog.data
        console.log('this.ViewPointSaveDialog.data', this.ViewPointSaveDialog.data)

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
        if (this.editType === 0) {
          param['id'] = this.ViewPointCurrentData.id
        }
        console.log('this.ViewPointSaveDialog.param', param)
        this.$store.dispatch('SaveViewPoint', param).then((result) => {
          console.log('result', result)
          if (result.status === "success") {
            setTimeout(() => {
              param['id'] = result.id
              this.$store.dispatch('SetViewPointDataChanged', param).then((result) => {
                this.$message({
                  message: '视点保存成功！',
                  type: 'success'
                })
                this.loadingSaveViewPoint = false
                this.closeSaveDialogHandle()
              })
            }, 2500);
          }
        })

      }
    }
  }

</script>
