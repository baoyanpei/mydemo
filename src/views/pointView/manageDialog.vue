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
        <div v-if="activeTabName==='2' || activeTabName==='3'">
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
                  <el-link @click='getViewPointsDataHandle(item)'>{{item.name}}</el-link>
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
            <el-col :span="4">
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
                        <el-col :span="8"
                          style="height:100%;display: table-cell;vertical-align: middle;text-align: center;">
                          <img :src="item.pictureLiteSrc" class="photo info-name-link"
                            @click='getViewPointsDataHandle(item)'>
                          <div :class="[item.className]" v-viewer="viewOptions">
                            <img :src="item.pictureFullSrc" :key="item.pictureFullSrc" v-show="false">
                          </div>
                        </el-col>
                        <el-col :span="12" style="padding-left:5px;">
                          <el-row :gutter="24">
                            <div class="grid-content info-title">
                              <el-link @click='getViewPointsDataHandle(item)'>{{item.name}}</el-link>
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
                        <el-col :span="4">
                          <div class="view-point-delete">
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
            <!-- <el-collapse-item title="反馈 Feedback" name="2">
              <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
              <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
            </el-collapse-item>
            <el-collapse-item title="效率 Efficiency" name="3">
              <div>简化流程：设计简洁直观的操作流程；</div>
              <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
              <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
            </el-collapse-item>
            <el-collapse-item title="可控 Controllability" name="4">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
              <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item> -->
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
        ProjectItemsAll: new Map(),
        access_token: null,
        viewPointDataList: [], // 显示到列表重的数据
        viewPointPosDataList: [], // 位置数据列表
        viewPointAllList: [], // 从接口获取的所有数据
        tipMessage: '',
        CurrentFileIDList: '', //当前打开的模型的file_id列表
        viewOptions: "{'inline': true,'navbar': false,'movable':false}",
        activeBuildNames: [],
        activeFloorNames: []
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
        this.viewPointPosDataList = []
        this.viewPointAllList = [] // 从接口获取的所有数据
        this.activeTabName = '1'
        this.ProjectItemsAll = new Map()
      },
      async getData() {
        await this.exchangeToken(getToken())
        await this.getProjectItemsAll() // 获取模型的item列表（最新版本）
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
      exchangeToken(token) {
        return new Promise((resolve, reject) => {
          const param = {
            method: "exchange_token",
            from: 'oa',
            token: token
          }
          this.$store.dispatch('ExchangeToken', param).then((resultData) => {
            console.log('ExchangeToken - resultData', resultData)
            if (resultData.status === 'success') {
              this.access_token = resultData.access_token
              resolve()
            } else {
              // console.log("123123123")
              this.tip_message = resultData.msg
              reject(resultData.msg)
            }

          })
        })

      },
      getProjectItemsAll() {
        return new Promise((resolve, reject) => {
          this.ProjectItemsAll = new Map()
          const param = {
            method: 'project_items',
            project_id: this.project_id,
            access_token: this.access_token
          }
          this.$store.dispatch('GetProjectItems', param).then((_itemList) => {
            // console.log('getProjectItemsAll - _itemList', _itemList)
            _itemList.forEach(async build => {
              this.ProjectItemsAll.set(build.id, build)
            });

            resolve()
          })

        })
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
            this.viewPointAllList = lodash.unionBy(this.viewPointAllList, 'file_ids', 'id')
            resolve()
            console.log("this.viewPointAllList", this.viewPointAllList);
          })
        })

      },
      GetViewpointsByFileId(item) {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'GetViewpointsByFileId',
            file_id: item.FILE_ID,
            project_id: this.project_id
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
        this.viewPointPosDataList = []
        console.log('this.ViewPointManageDialog.type', this.ViewPointManageDialog)
        if (parseInt(this.activeTabName) === 1) {
          let _mapBuild = new Map()
          this.viewPointAllList.forEach(item => {



            // console.log('item', item)
            if (parseInt(item.type) === 1) {

              // let picture_info = "/api/bim/bcp/thumbnail.jpg?vpid=32&project_id=10000&w=200" //item.PICTURE_INFO.replace('/www/bim_proj/', process.env.BASE_DOMAIN_BIM)
              item['pictureLiteSrc'] =
                `/api/bim/bcp/thumbnail.jpg?vpid=${item.id}&project_id=${this.project_id}&w=200`
              item['pictureFullSrc'] = `/api/bim/bcp/thumbnail.jpg?vpid=${item.id}&project_id=${this.project_id}`
              item['className'] = `imagesPreview-${item.id}`
              // console.log('picture_info', picture_info)

              if (JSON.parse(item.file_ids).sort().toString() !== this.CurrentFileIDList.sort().toString()) {
                // console.log(`.imagesPreview-${rowData.ID}`)
                item['bgShow'] = 'bgShow'
              }

              let _item_id = item.item_id
              // console.log('_mapBuild.get(item_id)', _mapBuild.get(_item_id))

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
            console.log('item111', item)

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
                'treeid':`build${item.build_id}-floor${floor.floor}`,
                'viewPointList': _viewPointList
              })
              this.activeFloorNames.push(`build${item.build_id}-floor${floor.floor}`)
            })
            // _buildList['floorInfos'] = floorList

            this.viewPointPosDataList.push({
              build_id: item.build_id,
              build_name: item.build_name,
              floorList: floorList,
              treeid:`build${item.build_id}`
            })
            this.activeBuildNames.push(`build${item.build_id}`)

          })


          // console.log('_mapBuild', _mapBuild)
          // console.log('_buildList', _buildList)
          console.log('this.viewPointPosDataList', this.viewPointPosDataList)
          this.tipMessage = ''
          if (this.viewPointPosDataList.length === 0) {
            this.tipMessage = "没有此模型相关的视点数据"
          }
        } else {
          this.viewPointAllList.forEach(item => {
            console.log('item', item)
            if (parseInt(item.type) === parseInt(this.activeTabName)) {

              item['pictureLiteSrc'] =
                `/api/bim/bcp/thumbnail.jpg?vpid=${item.id}&project_id=${this.project_id}&w=200`
              item['pictureFullSrc'] = `/api/bim/bcp/thumbnail.jpg?vpid=${item.id}&project_id=${this.project_id}`
              item['className'] = `imagesPreview-${item.id}`

              if (JSON.parse(item.file_ids).sort().toString() !== this.CurrentFileIDList.sort().toString()) {
                // console.log(`.imagesPreview-${rowData.ID}`)
                item['bgShow'] = 'bgShow'
              }

              this.viewPointDataList.push(item)
            }


          });
          console.log('this.viewPointDataList', this.viewPointDataList)
          this.tipMessage = ''
          if (this.viewPointDataList.length === 0) {
            this.tipMessage = "没有此模型相关的视点数据"
          }
        }

      },
      getViewPointsDataHandle(rowData) {
        console.log('getViewPointsDataHandle', rowData)
        // let CurrentFileIDList = []
        // this.ViewPointManageDialog.itemInfoList.forEach(item => {
        //   CurrentFileIDList.push(item.FILE_ID)
        // })

        this.$store.dispatch('SetViewPointsShow', rowData).then(() => {})
        // if (JSON.parse(rowData.file_ids).sort().toString() !== this.CurrentFileIDList.sort().toString()) {
        //   console.log(`.imagesPreview-${rowData.id}`)
        //   const viewer = this.$el.querySelector(`.imagesPreview-${rowData.id}`).$viewer
        //   viewer.show()
        // } else {
        //   this.$store.dispatch('SetViewPointsShow', rowData).then(() => {})
        // }



      },
      deleteViewPointHander(item) {
        console.log('deleteViewPointHander', item)
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
