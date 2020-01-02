<style lang="scss">
  @import "./manageDialog";

</style>
<template>

  <div id="view-point-manage-dialog" class="view-point-manage-dialog">
    <el-dialog :modal="false" width="300px" top="10vh" :lock-scroll="true" :visible.sync="ViewPointManageDialog.show"
      @opened="openedManageDialogHandle" @close="closeManageDialogHandle" :title="dialogTitle" v-el-drag-dialog>
      <el-tabs v-model="activeTabName" @tab-click="tabHandleClick">
        <el-tab-pane label="普通视点" name="2"></el-tab-pane>
        <el-tab-pane label="项目位置视点" name="1"></el-tab-pane>
        <el-tab-pane label="任务" name="3"></el-tab-pane>
      </el-tabs>
      <div class="view-point-list">
        <div v-show="tipMessage!==''" class="tip-message">{{tipMessage}}</div>
        <el-row :class="['view-point-item',item.bgShow]" v-for="(item,index) in viewPointDataList" :key="index">
          <el-col :span="8" style="height:100%;display: table-cell;vertical-align: middle;text-align: center;">
            <img :src="item.pictureLiteSrc" class="photo info-name-link" @click='getViewPointsDataHandle(item)'>
            <!-- <viewer class="imagesPreview" ref="viewer"> -->
            <div :class="[item.className]" v-viewer="viewOptions">
              <img :src="item.pictureFullSrc" :key="item.pictureFullSrc" v-show="false">
            </div>
            <!-- </viewer> -->
          </el-col>
          <el-col :span="12" style="padding-left:5px;">
            <el-row :gutter="24">
              <div class="grid-content info-title">
                <el-link @click='getViewPointsDataHandle(item)'>{{item.NAME}}</el-link>
              </div>
            </el-row>
            <el-row :gutter="24">
              <div class="grid-content info-create">创建人：
                <span>{{item.CREATOR_NAME}}</span>
              </div>
            </el-row>
            <el-row :gutter="24">
              <div class="grid-content info-date">创建时间：
                <span>{{item.CREATE_TIME.substring(0,10)}}</span>
              </div>
            </el-row>
          </el-col>
          <el-col :span="4">
            <div class="view-point-delete">
              <i class="el-icon-delete icon-delete" @click="deleteViewPointHander(item)"></i>
            </div>
          </el-col>
        </el-row>
      </div>

    </el-dialog>
  </div>

</template>

<script>
  let Base64 = require('js-base64').Base64

  import moment from 'moment'
  import lodash from 'lodash'

  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'

  Vue.use(Viewer, {
    defaultOptions: {
      zIndex: 9999,
      navbar: false
    }
  })
  export default {
    components: {},
    directives: {},
    data() {
      return {
        dialogTitle: '视点管理',
        activeTabName: '1',
        viewPointDataList: [], // 显示到列表重的数据
        viewPointAllList: [], // 从接口获取的所有数据
        tipMessage: '',
        CurrentFileIDList: '', //当前打开的模型的file_id列表
        viewOptions: "{'inline': true,'navbar': false,'movable':false}"
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
      ViewPointManageDialog: {
        get: function () {
          return this.$store.state.viewPoint.ViewPointManageDialog
        },
        set: function (newValue) {
          this.$store.state.viewPoint.ViewPointManageDialog = newValue
        }
      },
      ViewPointDataChanged() {
        return this.$store.state.viewPoint.ViewPointDataChanged
      }
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
      ViewPointDataChanged(curVal, oldVal) {
        console.log("ViewPointDataChanged")
        this.getData()
      }

    },
    methods: {
      clearData() {
        this.viewPointDataList = [] // 显示到列表重的数据
        this.viewPointAllList = [] // 从接口获取的所有数据
        this.activeTabName = '1'
      },
      async getData() {
        await this.GetViewpointsDataAll() // 获取所有的视点数据
        console.log(12313123)
        // await this.GetViewpointsData()
        this.FilterData()
      },
      tabHandleClick(tab, event) {
        console.log(tab, event);
        this.activeTabName = tab.name
        // console.log('this.activeTabName', this.activeTabName)
        this.FilterData()
      },
      openedManageDialogHandle() {
        this.tipMessage = "正在查询视点数据"
        // let dialogHeaderEl = document.getElementById("view-point-manage-dialog").querySelector('.el-dialog')
        // console.log('dialogHeaderEl', dialogHeaderEl)
        // dialogHeaderEl.style.cssText = `;right:500px !important;`
        console.log('ViewPointManageDialog', this.ViewPointManageDialog)

        this.CurrentFileIDList = []
        this.ViewPointManageDialog.itemInfoList.forEach(item => {
          this.CurrentFileIDList.push(item.FILE_ID)
        })
        this.getData()
      },
      GetViewpointsDataAll() {
        return new Promise((resolve, reject) => {
          let _itemInfoList = this.ViewPointManageDialog.itemInfoList
          let reqList = []
          this.viewPointAllList = []
          for (const item of _itemInfoList) {
            console.log('item', item)
            let p = this.GetViewpointsByFileId(item)
            reqList.push(p)
          }
          Promise.all(reqList).then(_viewPointList => {
            console.log("Promise.all", _viewPointList);
            _viewPointList.forEach(itemList => {
              this.viewPointAllList = [...this.viewPointAllList, ...itemList]
            })
            // 去处视点列表中'FILE_IDS'和'ID'重复的数据 
            this.viewPointAllList = lodash.unionBy(this.viewPointAllList, 'FILE_IDS', 'ID')
            resolve()
            console.log("this.viewPointAllList", this.viewPointAllList);
          })
        })

      },
      GetViewpointsByFileId(item) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetViewpointsByFileId',
            file_id: item.FILE_ID
          }
          this.$store.dispatch('GetViewpointsByFileId', param).then((_viewPointList) => {
            console.log('GetViewpointsByFileId - _viewPointList', _viewPointList)
            // this.tipMessage = ""
            // this.viewPointAllList = _viewPointList

            resolve(_viewPointList)
          })

        })
      },
      closeManageDialogHandle() {
        this.clearData()
      },
      // GetViewpointsData() {
      //   return new Promise((resolve, reject) => {
      //     const param = {
      //       method: 'GetViewpointsByProjectId',
      //       project_id: this.project_id
      //     }
      //     this.$store.dispatch('GetViewpointsByProjectId', param).then((_viewPointList) => {
      //       console.log('GetViewpointsByProjectId - _viewPointList', _viewPointList)
      //       this.tipMessage = ""
      //       this.viewPointAllList = _viewPointList
      //       resolve()
      //     })

      //   })
      // },
      FilterData() {
        this.viewPointDataList = []
        this.viewPointAllList.forEach(item => {
          console.log('item', item)
          if (parseInt(item.TYPE) === parseInt(this.activeTabName)) {

            let picture_info = item.PICTURE_INFO.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM)
            item['pictureLiteSrc'] = picture_info
            item['pictureFullSrc'] = picture_info.replace('lite.', '')
            item['className'] = `imagesPreview-${item.ID}`
            console.log('picture_info', picture_info)

            if (JSON.parse(item.FILE_IDS).sort().toString() !== this.CurrentFileIDList.sort().toString()) {
              // console.log(`.imagesPreview-${rowData.ID}`)
              item['bgShow'] = 'bgShow'
            }

            this.viewPointDataList.push(item)
          }


        });
        this.tipMessage = ''
        if (this.viewPointDataList.length === 0) {
          this.tipMessage = "没有此模型相关的视点数据"
        }
      },
      getViewPointsDataHandle(rowData) {
        console.log('getViewPointsDataHandle', rowData)
        // let CurrentFileIDList = []
        // this.ViewPointManageDialog.itemInfoList.forEach(item => {
        //   CurrentFileIDList.push(item.FILE_ID)
        // })
        if (JSON.parse(rowData.FILE_IDS).sort().toString() !== this.CurrentFileIDList.sort().toString()) {
          console.log(`.imagesPreview-${rowData.ID}`)
          const viewer = this.$el.querySelector(`.imagesPreview-${rowData.ID}`).$viewer
          viewer.show()
        } else {
          this.$store.dispatch('SetViewPointsShow', rowData).then(() => {})
        }



      },
      deleteViewPointHander(item) {
        console.log('deleteViewPointHander', item)
        this.$confirm(`是否要删除名为<label style="color:#0000FF;">${item.NAME}</label>的视点?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          const param = {
            method: 'DeleteViewpointById',
            id: item.ID
          }
          this.$store.dispatch('DeleteViewpointById', param).then((result) => {
            console.log('DeleteViewpointById - result', result)
            this.getData()
            this.$message({
              message: '视点删除成功！',
              type: 'success'
            })
            // this.viewPointAllList = _viewPointList
            // resolve()
          })
        })

      }

    }
  }

</script>
