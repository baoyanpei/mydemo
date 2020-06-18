<style lang="scss">
  @import "./manageDialog";

</style>
<template>

  <div id="view-point-manage-dialog" class="view-point-manage-dialog">
    <el-dialog :modal="false" width="380px" top="10vh" :lock-scroll="true" :close-on-click-modal="false"
      :close-on-press-escape="true" :visible.sync="ViewPointManageDialog.show" @opened="openedManageDialogHandle"
      @close="closeManageDialogHandle" :title="dialogTitle" v-el-drag-dialog>
      <el-tabs v-model="activeTabName" @tab-click="tabHandleClick">
        <el-tab-pane label="普通视点" name="2"></el-tab-pane>
        <el-tab-pane label="项目位置视点" name="1"></el-tab-pane>
        <el-tab-pane label="任务" name="3"></el-tab-pane>
      </el-tabs>
      <div class="view-point-list">
        <div v-show="tipMessage!==''" class="tip-message">{{tipMessage}}</div>
        <div v-if="activeTabName==='2' || activeTabName==='3'">
          <el-row :class="['view-point-item',item.bgShow]" v-for="(item,index) in viewPointDataList" :key="index">
            <el-col :span="6" style="height:100%;display: table-cell;vertical-align: middle;text-align: center;">
              <img :src="item.pictureLiteSrc" class="photo info-name-link" @click='getViewPointsDataHandle(item)'>
              <!-- <viewer class="imagesPreview" ref="viewer"> -->
              <div :class="[item.className]" v-viewer="viewOptions">
                <img :src="item.pictureFullSrc" :key="item.pictureFullSrc" v-show="false">
              </div>
              <!-- </viewer> -->
            </el-col>
            <el-col :span="13" style="padding-left:5px;">
              <el-row :gutter="24">
                <div class="grid-content info-title">
                  <!-- <el-link @click='getViewPointsDataHandle(item)'>{{item.name}}</el-link> -->
                  <span class="info-title-link" @click='getViewPointsDataHandle(item)'>{{item.name}}</span>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="grid-content info-create">创建人：
                  <span>{{item.creator_name}}</span>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="grid-content info-date">创建时间：
                  <span>{{item.create_time.substring(0,10)}}</span>
                </div>
              </el-row>
            </el-col>
            <el-col :span="5">
              <div class="view-point-delete">
                <i class="el-icon-delete " style="color: red; cursor: pointer;font-size: 16px;"
                  @click="deleteViewPointHander(item)"></i>
              </div>
            </el-col>
          </el-row>

        </div>

        <div v-if="activeTabName==='1'">
          <el-collapse v-model="activeBuildNames">
            <el-collapse-item :name="build.treeid" v-for="(build,index) in viewPointPosDataList" :key="build.build_id">
              <template slot="title">
                <span class="buildTitle">{{build.build_name}}</span>
              </template>
              <div class="floorArea">
                <el-collapse v-model="activeFloorNames">
                  <el-collapse-item :name="floor.treeid" v-for="(floor,index) in build.floorList" :key="floor.floor">
                    <template slot="title">
                      <span class="buildTitle">{{floor.floor}}层</span>
                    </template>
                    <div>
                      <el-row :class="['view-point-item',item.bgShow]" v-for="(item,index) in floor.viewPointList"
                        :key="index">
                        <el-col :span="6"
                          style="height:100%;display: table-cell;vertical-align: middle;text-align: center;">
                          <img :src="item.pictureLiteSrc" class="photo info-name-link"
                            @click='getViewPointsDataHandle(item)'>
                          <div :class="[item.className]" v-viewer="viewOptions">
                            <img :src="item.pictureFullSrc" :key="item.pictureFullSrc" v-show="false">
                          </div>
                        </el-col>
                        <el-col :span="13" style="padding-left:5px;">
                          <el-row :gutter="24">
                            <div class="grid-content info-title">
                              <span class="info-title-link" @click='getViewPointsDataHandle(item)'>{{item.name}}</span>
                            </div>
                          </el-row>
                          <el-row :gutter="24">
                            <div class="grid-content info-create">创建人：
                              <span>{{item.creator_name}}</span>
                            </div>
                          </el-row>
                          <el-row :gutter="24">
                            <div class="grid-content info-date">创建时间：
                              <span>{{item.create_time.substring(0,10)}}</span>
                            </div>
                          </el-row>
                        </el-col>
                        <el-col :span="5">
                          <div class="view-point-delete">
                            <font-awesome-icon v-if="item.bgShow === 'bgShowSelected'" icon="share-square"
                              class="el-icon-share" style="color:#FFFFFF;" @click="shareViewPointHander(item)" />
                            <font-awesome-icon v-if="item.bgShow !== 'bgShowSelected'" icon="share-square"
                              class="el-icon-share" style="color:#2cbc9d;" @click="shareViewPointHander(item)" />

                            <i class="el-icon-delete " style="color: red; cursor: pointer;font-size: 16px;"
                              @click="deleteViewPointHander(item)"></i>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>


            </el-collapse-item>
          </el-collapse>

        </div>


      </div>

    </el-dialog>
  </div>

</template>

<script>
  let Base64 = require('js-base64').Base64
  import {
    getToken
  } from '@/utils/auth'
  import moment from 'moment'
  import lodash from 'lodash'
  import {
    Loading
  } from 'element-ui';

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
        loadingFull: false,
        dialogTitle: '视点管理',
        activeTabName: '', //
        ProjectItemsAll: new Map(),
        access_token: null,
        viewPointDataList: [], // 显示到列表重的数据
        viewPointPosDataList: [], // 位置数据列表
        viewPointAllList: [], // 从接口获取的所有数据
        tipMessage: '',
        // CurrentFileIDList: '', //当前打开的模型的file_id列表
        CurrentItemIDList: '', //当前打开的模型的item_id列表
        viewOptions: "{'inline': true,'navbar': false,'movable':false}",
        activeBuildNames: [],
        activeFloorNames: [],
        currentChoosedItem: null
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
      ViewPointDataChanged: {
        handler: function (newVal, oldVal) {
          console.log('ViewPointDataChanged ', newVal)
          this.getData()
          this.getViewPointsDataHandle(newVal)

        },
        deep: true
      }

    },
    methods: {
      clearData() {
        this.viewPointDataList = [] // 显示到列表重的数据
        this.viewPointPosDataList = []
        this.viewPointAllList = [] // 从接口获取的所有数据
        this.activeTabName = ''
        this.ProjectItemsAll = new Map()
        this.currentChoosedItem = null
        // this.CurrentFileIDList = []
        this.CurrentItemIDList = []
      },
      async getData() {
        await this.getProjectItemsAll() // 获取模型的item列表（最新版本）
        this.getPointViewData()
      },
      tabHandleClick(tab, event) {
        // console.log(tab, event);
        this.activeTabName = tab.name
        this.getPointViewData()
      },
      openedManageDialogHandle() {
        this.tipMessage = "正在查询视点数据"
        console.log('this.ViewPointManageDialog', this.ViewPointManageDialog)

        this.CurrentItemIDList = []
        this.ViewPointManageDialog.itemInfoList.forEach(item => {
          this.CurrentItemIDList.push(item.item_id)
        })
        if (this.CurrentItemIDList.length > 1) {
          this.activeTabName = '2'
        } else {
          this.activeTabName = '1'
        }

        this.getData()
      },
      closeManageDialogHandle() {
        this.clearData()
      },
      getProjectItemsAll() {
        this.loadingFull = this.$loading({
          target: document.getElementById("view-point-manage-dialog").querySelector('.el-dialog')
        });
        return new Promise((resolve, reject) => {
          this.ProjectItemsAll = new Map()
          const param = {
            method: 'project_items',
            project_id: this.project_id
          }
          this.$store.dispatch('GetProjectItems', param).then((_itemList) => {
            _itemList.forEach(async build => {
              this.ProjectItemsAll.set(build.id, build)
            });
            this.loadingFull.close()
            resolve()
          })

        })
      },
      /*
      GetViewpointsByFileIdDataAll() {
        return new Promise((resolve, reject) => {
          let _itemInfoList = this.ViewPointManageDialog.itemInfoList
          let reqList = []
          this.viewPointAllList = []
          for (const item of _itemInfoList) {
            // console.log('item', item)
            let p = this.GetViewpointsByFileId(item)
            reqList.push(p)
          }
          Promise.all(reqList).then(_viewPointList => {
            // console.log("Promise.all", _viewPointList);
            _viewPointList.forEach(itemList => {
              this.viewPointAllList = [...this.viewPointAllList, ...itemList]
            })
            // 去处视点列表中'FILE_IDS'和'ID'重复的数据 
            this.viewPointAllList = lodash.unionBy(this.viewPointAllList, 'file_ids', 'id')
            resolve()
            // console.log("this.viewPointAllList", this.viewPointAllList);
          })
        })

      },
      GetViewpointsByFileId(item) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetViewpointsByFileId',
            file_id: item.file_id,
            project_id: this.project_id
          }
          this.$store.dispatch('GetViewpointsByFileId', param).then((_viewPointList) => {
            // console.log('GetViewpointsByFileId - _viewPointList', _viewPointList)
            // this.tipMessage = ""
            // this.viewPointAllList = _viewPointList

            resolve(_viewPointList)
          })

        })
      },*/
      GetViewpointsByItemIdsAll(type) {
        // console.log('typetype,', type)
        return new Promise(async (resolve, reject) => {
          let _itemInfoList = this.ViewPointManageDialog.itemInfoList
          let _viewPointList = await this.GetViewPointsByType(type)
          this.viewPointAllList = []
          for (const item of _itemInfoList) {
            // console.log('itemitem,', item)
            _viewPointList.forEach(viewPoint => {
              // console.log('viewPointviewPoint,', viewPoint.item_ids)
              if (viewPoint.item_ids !== undefined && viewPoint.item_ids !== '') {
                if (JSON.parse(viewPoint.item_ids).indexOf(item.item_id) !== -1) {
                  this.viewPointAllList.push(viewPoint)
                }
              }
            })
          }
          this.viewPointAllList = lodash.unionBy(this.viewPointAllList, 'item_ids', 'id')
          resolve()
        })
      },
      GetViewPointsByType(type) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetViewPoints',
            type: parseInt(type),
            project_id: this.project_id
          }
          this.$store.dispatch('GetViewPoints', param).then((_viewPointList) => {
            resolve(_viewPointList)
          })

        })
      },
      GetViewpointsByItemIdDataAll(type) {
        return new Promise((resolve, reject) => {
          let _itemInfoList = this.ViewPointManageDialog.itemInfoList
          let reqList = []
          this.viewPointAllList = []
          for (const item of _itemInfoList) {
            // console.log('item', item)
            let p = this.GetViewPointsByItemId(item, type)
            reqList.push(p)
          }
          Promise.all(reqList).then(_viewPointList => {
            // console.log("Promise.all", _viewPointList);
            _viewPointList.forEach(itemList => {
              this.viewPointAllList = [...this.viewPointAllList, ...itemList]
            })
            // 去处视点列表中'FILE_IDS'和'ID'重复的数据 
            this.viewPointAllList = lodash.unionBy(this.viewPointAllList, 'file_ids', 'id')

            resolve()
            // console.log("this.viewPointAllList", this.viewPointAllList);
          })
        })

      },
      GetViewPointsByItemId(item, type) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetViewPoints',
            type: parseInt(type),
            item_id: item.item_id,
            project_id: this.project_id
          }
          this.$store.dispatch('GetViewPoints', param).then((_viewPointList) => {
            resolve(_viewPointList)
          })

        })
      },
      async getPointViewData() {
        if (parseInt(this.activeTabName) === 1 && this.CurrentItemIDList.length > 1) {
          this.tipMessage = "合并模型不能查看位置视点，如需查看位置视点，请单独打开模型查看"
          return
        }
        this.loadingFull = this.$loading({
          target: document.getElementById("view-point-manage-dialog").querySelector('.el-dialog')
        });
        this.viewPointDataList = []
        this.viewPointPosDataList = []
        if (parseInt(this.activeTabName) === 1) { // 项目位置视点

          await this.GetViewpointsByItemIdDataAll(this.activeTabName)

          let _mapBuild = new Map()
          this.viewPointAllList.forEach(item => {


            item['bgShowNormal'] = ''
            // console.log('item', item)
            if (parseInt(item.type) === 1) { // 项目位置视点

              // let picture_info = "/api/bim/bcp/thumbnail.jpg?vpid=32&project_id=10000&w=200" //item.PICTURE_INFO.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM)
              item['pictureLiteSrc'] =
                `/api/bim/bcp/thumbnail.jpg?vpid=${item.id}&project_id=${this.project_id}&w=200`
              // item['pictureFullSrc'] = `/api/bim/bcp/thumbnail.jpg?vpid=${item.id}&project_id=${this.project_id}`
              item['pictureFullSrc'] = ''
              const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
              item['pictureTopSrc'] = item.top_pic === "" ? "" :
                `/api/bim/bcp/thumbnail.jpg?vpid=${item.id}&project_id=${this.project_id}&w=380&t=top&random=${genRandom(1,1000)}`


              item['pictureSideSrc'] = item.top_pic === "" ? "" :
                `/api/bim/bcp/thumbnail.jpg?vpid=${item.id}&project_id=${this.project_id}&w=380&t=side&random=${genRandom(1,1000)}`

              item['className'] = `imagesPreview-${item.id}`

              if (this.CurrentItemIDList.length > 1) {
                // console.log(`.imagesPreview-${rowData.ID}`)
                item['bgShow'] = 'bgShow'
                item['bgShowNormal'] = 'bgShow'
              }

              let _item_id = item.item_id

              let _buildInfo = _mapBuild.get(_item_id)
              if (_buildInfo === undefined) {
                _mapBuild.set(_item_id, {
                  'build_id': _item_id,
                  'build_name': this.ProjectItemsAll.get(_item_id).name,
                  'floorInfos': new Map()
                })
                _buildInfo = _mapBuild.get(_item_id)
                // console.log('buildInfo1', _buildInfo)

              }

              let _floorName = item.floor_name
              let _floorInfo = _buildInfo.floorInfos.get(_floorName)
              if (_floorInfo === undefined) {
                _buildInfo.floorInfos.set(_floorName, {
                  'floor': _floorName,
                  'ViewPointMap': new Map()
                })
                _floorInfo = _buildInfo.floorInfos.get(_floorName)
              }

              let _viewPointId = item.id
              let _viewPointInfo = _floorInfo.ViewPointMap.get(_viewPointId)
              if (_viewPointInfo === undefined) {
                _floorInfo.ViewPointMap.set(_viewPointId, item)
              }


              // this.viewPointPosDataList.push(item)
            }


          });

          // let _buildList = []
          this.activeBuildNames = []
          this.activeFloorNames = []

          _mapBuild.forEach(item => {
            // console.log('item111', item)

            let floorList = []
            let _floorInfos = item.floorInfos
            _floorInfos.forEach(floor => {
              let _viewPointList = []
              let _viewPoints = floor.ViewPointMap
              _viewPoints.forEach(viewPoint => {
                _viewPointList.push(viewPoint)
              })
              // console.log('floor', floor)
              floorList.push({
                'floor': floor.floor,
                'treeid': `build${item.build_id}-floor${floor.floor}`,
                'viewPointList': _viewPointList
              })
              this.activeFloorNames.push(`build${item.build_id}-floor${floor.floor}`)
            })
            // _buildList['floorInfos'] = floorList

            this.viewPointPosDataList.push({
              build_id: item.build_id,
              build_name: item.build_name,
              floorList: floorList,
              treeid: `build${item.build_id}`
            })
            this.activeBuildNames.push(`build${item.build_id}`)

          })

          this.setCurrentChoosedStyleByItemId()
          this.tipMessage = ''
          if (this.viewPointPosDataList.length === 0) {
            this.tipMessage = "没有此模型相关的视点数据"
          }
        } else {
          // await this.GetViewpointsByFileIdDataAll() // 获取所有的视点数据
          await this.GetViewpointsByItemIdsAll(this.activeTabName)
          this.viewPointAllList.forEach(item => {
            // console.log('item', item)
            if (parseInt(item.type) === parseInt(this.activeTabName)) {

              item['pictureLiteSrc'] =
                `/api/bim/bcp/thumbnail.jpg?vpid=${item.id}&project_id=${this.project_id}&w=200`
              item['pictureFullSrc'] = `/api/bim/bcp/thumbnail.jpg?vpid=${item.id}&project_id=${this.project_id}`
              item['className'] = `imagesPreview-${item.id}`
              // console.log('1231231231', item, this.CurrentFileIDList, this.CurrentItemIDList)
              // if (JSON.parse(item.file_ids).sort().toString() !== this.CurrentFileIDList.sort().toString()) {
              if (JSON.parse(item.item_ids).sort().toString() !== this.CurrentItemIDList.sort().toString()) {
                // console.log(`.imagesPreview-${rowData.ID}`)
                item['bgShow'] = 'bgShow'
                item['bgShowNormal'] = 'bgShow'
              }
              this.viewPointDataList.push(item)
            }


          });
          this.setCurrentChoosedStyle()
          this.tipMessage = ''
          if (this.viewPointDataList.length === 0) {
            this.tipMessage = "没有此模型相关的视点数据"
          }
        }
        this.loadingFull.close();
      },
      setCurrentChoosedStyle() {
        let tempList = []
        this.viewPointDataList.forEach(item => {
          // console.log('12222222', item, this.currentChoosedItem)
          if (this.currentChoosedItem !== null && item.id === this.currentChoosedItem.id) {
            item['bgShow'] = 'bgShowSelected'
            // console.log('1222222222222222')
          } else {
            item['bgShow'] = item['bgShowNormal']
          }
          tempList.push(item)
        })
        this.viewPointDataList = tempList
      },
      setCurrentChoosedStyleByItemId() {
        this.viewPointPosDataList.forEach(build => {
          build.floorList.forEach(floor => {
            floor.viewPointList.forEach(viewPoint => {
              if (this.currentChoosedItem !== null && viewPoint.id === this.currentChoosedItem.id) {
                viewPoint['bgShow'] = 'bgShowSelected'
                // Vue.set(viewPoint, 'bgShow', 'bgShowSelected')
                // console.log('122222222-2222222')
              } else {
                viewPoint['bgShow'] = viewPoint['bgShowNormal']
              }

            })
          })
        })
        const tempList = this.viewPointPosDataList
        this.viewPointPosDataList = []
        this.viewPointPosDataList = tempList
      },
      getViewPointsDataHandle(rowData) {
        // console.log('getViewPointsDataHandle', rowData)
        this.currentChoosedItem = rowData
        // this.getPointViewData()
        if (parseInt(this.activeTabName) === 1) { // 项目位置视点
          this.setCurrentChoosedStyleByItemId()
        } else {
          this.setCurrentChoosedStyle()
        }

        this.$store.dispatch('SetViewPointsShow', rowData).then(() => {})
      },
      deleteViewPointHander(item) {
        // console.log('deleteViewPointHander', item)
        this.$confirm(`是否要删除名为<label style="color:#0000FF;">${item.name}</label>的视点?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          const param = {
            method: 'DeleteViewpointById',
            id: item.id,
            project_id: this.project_id
          }
          this.$store.dispatch('DeleteViewpointById', param).then((result) => {
            // console.log('DeleteViewpointById - result', result)
            this.getData()
            this.$message({
              message: '视点删除成功！',
              type: 'success'
            })
            // this.viewPointAllList = _viewPointList
            // resolve()
          })
        })

      },
      shareViewPointHander(item) {

        const param = {
          show: true,
          data: item
        }

        this.$store.dispatch('ShowViewPointQrcodeDialog', param).then(() => {}).catch(() => {})
      }

    }
  }

</script>
