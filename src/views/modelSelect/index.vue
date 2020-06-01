<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="project-model-select-index">
    <!-- <div class="tree-area">
        <el-tree :data="treeData" default-expand-all :expand-on-click-node="false" current-node-key
          :check-on-click-node="true" node-key="id" ref="tree" highlight-current show-checkbox :props="defaultProps"
          @check-change="checkChange" @node-click="handleNodeClick">
        </el-tree>
      </div> -->
    <div v-show="isShow === true && isBindBim === false" class="not-bind-bim">
      当前项目没有与BIM项目绑定
      <div class="btn-bind-bim">
        <BindBimButton></BindBimButton>
      </div>
    </div>
    <div v-show="isShow === true && isBindBim === true" class="list-area">
      <div class="list-main">
        <el-row :gutter="20" style="border-bottom:0px solid #eeeeee;">
          <el-col :span="18">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <el-button v-if="itemListSelected.length>0" type="primary" size="small" @click="showModels">合并显示选中的模型
            </el-button>
            <el-button v-if="itemListSelected.length===0" size="small" disabled>合并显示选中的模型</el-button>

            <!-- <el-button type="primary" size="small" @click="openUploadModelDialogHandle">上传模型</el-button> -->

            <el-button-group style="margin-left: 100px;">
              <!-- <el-button size="small" @click="addBuildingHandle">创建建筑</el-button> -->
              <!-- <el-button size="small">批量删除</el-button> -->
            </el-button-group>

          </el-col>
          <!-- <el-col :span="6">
              <el-input placeholder="按建筑名搜索" v-model="input" style="float: right;">
              </el-input>
            </el-col> -->
        </el-row>

        <el-row :gutter="20" style="border-bottom:0px solid #eeeeee;">
          <el-table ref="multipleTable" row-key="tid" :data="tableFilterData" :height="tableHeight" default-expand-all
            tooltip-effect="dark" style="width: 100%;height: 100vh;"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column prop="isSelected" label="选择" width="100" align="center">
              <template slot-scope="scope">

                <el-checkbox
                  v-if="scope.row.menuType==='item' && scope.row.url!==undefined && scope.row.url!==null && scope.row.url!==''"
                  v-model="scope.row.isSelected" @change="handleCheckedCitiesChange(scope.row)"></el-checkbox>
                <el-checkbox
                  v-if="scope.row.menuType==='item' && (scope.row.url===undefined || scope.row.url===null || scope.row.url==='')"
                  disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="建筑名" width="380">
              <template slot-scope="scope">
                <!-- <div v-if="scope.row.name === ''">
                    <el-input ref="newBuildName" v-model="newBuildName" placeholder="请输入建筑名" size="small"></el-input>
                  </div> -->
                <div v-if="scope.row.name !== ''">
                  {{scope.row.name}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="oper" label="操作" width="250" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"
                  v-if="scope.row.menuType==='item' && scope.row.url!==undefined && scope.row.url!==null && scope.row.url!==''"
                  @click="handleEdit(scope.row)">查看模型
                </el-button>
                <el-button type="primary" size="mini"
                  v-if="scope.row.menuType==='item' && scope.row.url!==undefined && scope.row.url!==null && scope.row.url!==''"
                  @click="handleLotSetting(scope.row)">物联设备模型配置
                </el-button>
                <!-- <el-button title="上传"
                  v-if="scope.row.name !== '' && scope.row.menuType ==='item' && scope.row.isShowUploadItem === true"
                  size="small" icon="el-icon-upload2" class="small_cicle btn-blue" @click="handleItemEdit(scope.row)">
                </el-button>

                <el-button title="删除" v-if="scope.row.name !== '' && scope.row.menuType ==='build'" size="small"
                  icon="el-icon-delete" class="small_cicle" @click="handleBuildingDelete(scope.row)">
                </el-button>
                <el-button title="删除"
                  v-if="scope.row.name !== '' && scope.row.menuType ==='item' && scope.row.isShowDeleteItem ===true"
                  size="small" icon="el-icon-delete" class="small_cicle" @click="handleItemDelete(scope.row)">
                </el-button>

                <div v-if="scope.row.name === ''">
                  <el-button size="mini" type="success" @click="submitNewBuildingHandle">确定</el-button>
                  <el-button size="mini" @click="cancelNewBuildingHandle">取消</el-button>
                </div> -->



              </template>
            </el-table-column>
            <!-- <el-table-column prop="version" label="版本" width="100" align="center">
            </el-table-column> -->
            <!-- <el-table-column prop="status_display" label="状态" width="120" align="center">
              <template slot-scope="scope">
                <div v-bind:class="scope.row.status_css">{{scope.row.status_display}}</div>
              </template>
            </el-table-column> -->
            <el-table-column prop="upload_name" label="上传人" width="150" align="center">
            </el-table-column>
            <!-- <el-table-column prop="address" label="大小" width="120">
              </el-table-column> -->
            <el-table-column label="上传时间" width="250" align="center">
              <template slot-scope="scope">{{ scope.row.up_time }}</template>
            </el-table-column>
            <!-- <el-table-column label="处理时间" width="220" align="center">
              <template slot-scope="scope">{{ scope.row.process_time }}</template>
            </el-table-column> -->
          </el-table>
        </el-row>
      </div>
    </div>
    </el-row>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import moment from 'moment'
  import lodash from 'lodash'
  import BindBimButton from '@/views/layout/components/BindBimButton'
  import {
    getToken
  } from '@/utils/auth'
  import {
    Message
  } from 'element-ui'
  const treeRoot = [{
    id: 0,
    label: '模型列表',
    children: []
  }]
  export default {
    name: 'ModelSelect',
    components: {
      BindBimButton
    },
    data() {
      return {
        isShow: false,
        isBindBim: false,
        buildMap: new Map(),
        buildList: [],
        // treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        input: "",
        tableData: [],
        tableFilterData: [],
        multipleSelection: [],
        tableHeight: 0,
        itemListSelected: [],
        checkAll: false,
        isIndeterminate: false,
        newBuildName: '',
        isNewBUildingShow: false,
        // access_token: null
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
      BindBimDataChanged() {
        return this.$store.state.bindBim.BindBimDataChanged
      }
      // personInfo() {
      //   return this.$store.state.person.personInfo
      // },
      // ModelSelectListChangeSeed() {
      //   return this.$store.state.model3d.ModelSelectListChangeSeed
      // }
    },
    watch: {
      project_id(curVal, oldVal) {
        console.log('curVal, oldVal', curVal, oldVal)
        if (curVal !== null && oldVal !== null && parseInt(curVal) !== parseInt(oldVal)) {
          console.log('project_idproject_id-aaa', this.project_id)
          this.clearData()
          this.reloadAllData()
        }
      },
      BindBimDataChanged(curVal, oldVal) {
        console.log("BindBimDataChanged - index")
        this.reloadAllData()
      }
      // ModelSelectListChangeSeed(curVal, oldVal) {
      //   this.reloadAllData()
      // }
    },
    created() {

    },
    async mounted() {
      // console.log('__PROJECT_ID', Cookies.get("PROJECT_ID"))
      const __PROJECT_ID = Cookies.get("PROJECT_ID")
      if (__PROJECT_ID === undefined) {
        window.location.href = "/"
      }
      this.project_id = parseInt(__PROJECT_ID)
      
      this.countTableHeight()
      window.onresize = () => {
        return (() => {
          this.countTableHeight()
        })()
      }
      // 
      // await this.exchangeToken(getToken())
      await this.GetOutsysInfo()
      console.log('this.isBindBim', this.isBindBim)
      this.getItemListByProID()
    },
    beforeDestroy() {
      this.clearData()

      console.log('beforeDestroy')
    },
    methods: {
      GetOutsysInfo() {
        return new Promise((resolve, reject) => {
          this.bim_name_desc = ""
          // this.isBindBim = true
          const param = {
            method: 'get_outsys_info',
            project_id: this.project_id
          }
          this.$store.dispatch('GetOutsysInfo', param).then((res) => {
            console.log('GetOutsysInfo - res', res, res.access_code === undefined)
            if (res.access_code === undefined || res.access_code === '') {
              this.isBindBim = false
            } else {
              this.isBindBim = true
              // this.bim_name_desc = `BIM项目：${res.name}`
            }
            this.isShow = true
            resolve()
          })
        })
      },
      clearData() {
        // this.treeData = []
        this.tableFilterData = []
        this.tableData = []
      },
      async reloadAllData() {
        // this.getBuildingListByProID()
        await this.GetOutsysInfo()
        this.getItemListByProID()
        this.checkAll = false
        this.isIndeterminate = false
      },
      formatDate(data) {
        return moment(data).format("YYYY年MM月DD日 HH:mm")
      },
      countTableHeight() {
        window.tableHeight = window.innerHeight || document.documentElement.clientHeight || document.body
          .clientHeight
        this.tableHeight = window.tableHeight - 130
      },
      // getBimBuildingAll() {
      //   return new Promise((resolve, reject) => {
      //     const param = {
      //       method: 'bim_building_all',
      //       project_id: this.project_id
      //     }
      //     this.$store.dispatch('QueryBimBuildingAll', param).then((_buildList) => {
      //       // console.log('QueryBimBuildingAll - _buildList', _buildList)
      //       _buildList.forEach(async build => {
      //         build['from'] = 1 // 来自玮哥接口
      //         this.buildMap.set(build.id, build)
      //       });
      //       resolve()
      //     })

      //   })
      // },
      getProjectItemsAll() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'project_items',
            project_id: this.project_id,
            // access_token: this.access_token
          }
          this.$store.dispatch('GetProjectItems', param).then((_itemList) => {
            console.log('getProjectItemsAll - _itemList', _itemList)
            // _buildList.forEach(async build => {
            //   build['from'] = 1 // 来自玮哥接口
            //   this.buildMap.set(build.id, build)
            // });
            resolve(_itemList)
          })

        })
      },
      // getItemInfoListByProID() {
      //   return new Promise((resolve, reject) => {
      //     const param = {
      //       method: 'GetItemInfoListByProID',
      //       project_id: this.project_id
      //     }
      //     this.$store.dispatch('GetItemInfoListByProID', param).then((_itemList) => {
      //       console.log('GetItemInfoListByProID - _itemList', _itemList)
      //       resolve(_itemList)
      //     })

      //   })
      // },
      getItemListByProID() {
        console.log('getItemListByProID - isBindBim', this.isBindBim)
        if (this.isBindBim !== true) {
          return
        }
        // console.log('this.project_id', this.project_id)
        return new Promise(async (resolve, reject) => {
          this.tableData = []
          this.isNewBUildingShow = false
          let _itemInfoMap = new Map()
          // await this.getBimBuildingAll()
          let _ProjectItemsAll = await this.getProjectItemsAll() // 获取模型的item列表（最新版本）
          // let _ItemInfoList = await this.getItemInfoListByProID() // 获取模型的item详细列表（包含所有版本）
          // _ItemInfoList.forEach(item => {
          //   _itemInfoMap.set(item.FILE_ID, item) // 模型具体的信息
          // });
          // console.log('_itemInfoMap', _itemInfoMap)

          _ProjectItemsAll.forEach(_Item => {
            if (_Item.process_status === 1) {
              // console.log('_Item', _Item)
              _Item['tid'] = `item-${_Item.id}`
              // build['name'] = build.ITEM_NAME
              _Item['menuType'] = 'item'
              _Item['isSelected'] = false
              // let _ItemInfo = _itemInfoMap.get(_Item.file_id)
              // console.log('_ItemInfo', _Item.id, _ItemInfo)

              let upload_name = _Item.username

              if (_Item.upload_username !== null && _Item.upload_username !== '' && _Item.upload_username !==
                'None') {
                upload_name = _Item.upload_username
              }

              let up_time = "-"
              if (_Item.upload_time !== null && _Item.upload_time !== '' && _Item.upload_time !== 'None') {
                up_time = moment(_Item.upload_time).format("YYYY年MM月DD日 HH:mm")
              }
              let process_time = "-"
              if (_Item.process_time !== null && _Item.process_time !== '' && _Item.process_time !== 'None') {
                process_time = moment(_Item.process_time).format("YYYY年MM月DD日 HH:mm")
              }
              let status_display = ""
              let status_css = ""
              // 处理状态：-1=未处理；0=处理中；1=处理成功；2=处理失败；
              switch (_Item.process_status) {
                case -1:
                  status_display = "未处理"
                  status_css = ''
                  break;
                case 0:
                  status_display = "处理中"
                  status_css = 'status-display-warning'
                  break;
                case 1:
                  status_display = "处理成功"
                  status_css = 'status-display-success'
                  break;
                case 2:
                  status_display = "处理失败"
                  status_css = 'status-display-danger'
                  break;
              }

              let _isShowDeleteItem = false
              if (_Item.process_status === null || (_Item.process_status !== 8 && _Item.process_status !==
                  0)) {
                _isShowDeleteItem = true
              }

              let _isShowUploadItem = false
              if (_Item.process_status === null || (_Item.process_status !== 8 && _Item.process_status !==
                  0)) {
                _isShowUploadItem = true
              }
              _Item['upload_name'] = upload_name
              _Item['status_display'] = status_display
              _Item['status_css'] = status_css
              _Item['isShowDeleteItem'] = _isShowDeleteItem
              _Item['isShowUploadItem'] = _isShowUploadItem
              _Item['up_time'] = up_time
              _Item['process_time'] = process_time
              _Item = {
                ..._Item,
                // ..._ItemInfo
              }
              this.tableData.push(_Item)
            }


          })
          this.tableFilterData = this.tableData
          console.log('this.tableFilterData', this.tableFilterData)
        })
      },
      handleEdit(row) {
        console.log('rowrowrow', row)
        let _item = {
          ITEM_ID: row.id,
          FILE_ID: row.file_id,
        }
        console.log('_item', _item);
        Cookies.set('MODEL_DISPLAY_DATA', JSON.stringify({
          'item_list': [_item]
        }))
        this.$store.dispatch('SetModelDisplayData', {
          'item_list': [_item]
        }).then(() => {
          this.$router.push({
            path: '/modelDisplay',
            // query: {
            //   'queryData': 131
            // }
          })
        }).catch(() => {})

      },
      handleLotSetting(row) {
        console.log('rowrowrow', row)
        let _item = {
          ITEM_ID: row.id,
          FILE_ID: row.file_id,
        }
        console.log('_item', _item);
        Cookies.set('MODEL_DISPLAY_DATA', JSON.stringify({
          'item_list': [_item]
        }))
        this.$store.dispatch('SetModelDisplayData', {
          'item_list': [_item]
        }).then(() => {
          this.$router.push({
            path: '/modelLotSetting',
            // query: {
            //   'queryData': 131
            // }
          })
        }).catch(() => {})

      },
      // handleBuildingDelete(row) {
      //   console.log('row', row)
      //   this.$confirm(`是否要删除建筑<label style="color:#0000FF;">${row.name}</label>, 是否继续?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //     dangerouslyUseHTMLString: true
      //   }).then(() => {
      //     const param = {
      //       method: 'bim_building_remove',
      //       project_id: this.project_id,
      //       id: row.id
      //     }
      //     console.log('param', param)
      //     this.$store.dispatch('RemoveBimBuilding', param).then((resultData) => {
      //       console.log('RemoveBimBuilding - resultData', resultData)
      //       this.reloadAllData()
      //     }).catch((e) => {
      //       console.log("e", e)
      //     })

      //   }).catch(() => {

      //   });
      // },
      // handleItemDelete(row) {
      //   console.log('row,', row)
      //   this.$confirm(`是否要删除模型<label style="color:#0000FF;">${row.name}</label>, 是否继续?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //     dangerouslyUseHTMLString: true
      //   }).then(() => {
      //     const param = {
      //       method: 'project_item_del',
      //       project_id: this.project_id,
      //       id: row.id
      //     }
      //     console.log('param', param)
      //     this.$store.dispatch('RemoveBimItem', param).then((resultData) => {
      //       console.log('RemoveBimItem - resultData', resultData)
      //       this.reloadAllData()
      //     }).catch((e) => {
      //       console.log("e", e)
      //     })

      //   }).catch(() => {

      //   });
      // },
      showModels() {

        if (this.itemListSelected.length !== 0) {
          Cookies.set('MODEL_DISPLAY_DATA', JSON.stringify({
            'item_list': this.itemListSelected
          }))
          this.$router.push({
            path: '/modelDisplay',

          })
        } else {
          this.$message({
            message: '请选择要显示的模型!'
          });
        }

      },
      handleCheckedCitiesChange(value, aaa) {
        console.log('handleCheckedCitiesChange', value)
        this.getItemListSelected(value)

      },
      getItemListSelected(item) {
        this.itemListSelected = []
        let totalSelected = 0
        let totalItem = 0
        // build.isSelectedTotal = 0
        this.tableData.forEach(async item => {
          totalItem++
          if (item.isSelected === true && item.url !== null && item.url !== '') {
            // console.log('item', item)
            // build.isSelectedTotal++
            totalSelected++
            let _item = {
              ITEM_ID: item.id,
              FILE_ID: item.file_id,
            }
            this.itemListSelected.push(_item)
          }
        })
        // if (build.isSelectedTotal > 0) {
        //   if (build.isSelectedTotal === itemList.length) {
        //     build.isSelected = true
        //     build.indeterminate = false

        //   } else {
        //     build.isSelected = false
        //     build.indeterminate = true
        //   }
        // } else {
        //   build.isSelected = false
        //   build.indeterminate = false
        // }
        console.log("--->", totalSelected, totalItem)
        if (totalSelected > 0) {
          if (totalSelected === totalItem) {
            this.isIndeterminate = false
            this.checkAll = true
          } else {
            this.isIndeterminate = true
            this.checkAll = false
          }
        } else {
          this.isIndeterminate = false
          this.checkAll = false
        }
        console.log('this.itemListSelected - ', this.itemListSelected)
      },
      handleCheckAllChange(value) {
        this.isSelected = !this.isSelected
        this.tableData.forEach(async item => {
          item.isSelected = this.isSelected
        })
        this.getItemListSelected()
      },
      // unCheckAll() {
      //   this.isNewBUildingShow = false
      //   this.isSelected = false
      //   this.checkAll = false;
      //   this.tableData.forEach(async build => {
      //     let itemList = build.children
      //     build.isSelectedTotal = 0
      //     itemList.forEach(async item => {
      //       item.isSelected = false
      //     })
      //   })
      //   this.getItemListSelected()
      // },
      // checkChange(data) {
      //   this.unCheckAll()
      //   // console.log('data', data)
      //   let _checkKeys = this.$refs.tree.getCheckedKeys();
      //   // console.log('_checkKeys', _checkKeys)
      //   this.tableFilterData = []
      //   this.tableData.forEach(build => {
      //     let _match = lodash.includes(_checkKeys, build.id) //ST 主体
      //     if (_match === true) {
      //       this.tableFilterData.push(build)
      //     }
      //   })
      // },
      // handleNodeClick(data) {
      //   this.unCheckAll()
      //   // console.log(data);
      //   this.$refs.tree.setCheckedKeys([data.id]);
      //   this.tableFilterData = []
      //   this.tableData.forEach(build => {
      //     if (build.id === data.id) {
      //       this.tableFilterData.push(build)
      //     }
      //   })
      // },
      // openUploadModelDialogHandle() {
      //   const param = {
      //     show: true,
      //     // modelData: this.modelData,
      //     project_id: this.project_id
      //     // buildlist: this.buildList
      //   }
      //   // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      //   this.$store.dispatch('SetUploadModelDialog', param).then(() => {}).catch(() => {})
      // },
      // submitNewBuildingHandle() {
      //   if (this.newBuildName.trim() === '') {
      //     Message.error('请输入建筑名')
      //     return
      //   }
      //   const param = {
      //     method: 'bim_building_add',
      //     project_id: this.project_id,
      //     building_name: this.newBuildName,
      //     building_desc: ''
      //   }
      //   this.$store.dispatch('AddBimBuilding', param).then((resultData) => {
      //     console.log('AddBimBuilding - resultData', resultData)
      //     this.reloadAllData()
      //   }).catch((e) => {
      //     console.log("e", e)
      //   })
      // },
      // cancelNewBuildingHandle() {
      //   this.isNewBUildingShow = false
      //   let _arr = this.tableFilterData
      //   this.newBuildName = ""
      //   let _i = _arr.length;
      //   while (_i--) {
      //     if (_arr[_i].name === '') {
      //       _arr.splice(_i, 1);
      //     }
      //   }
      // },
      // handleItemEdit(row) {

      //   console.log('row', row)
      //   const param = {
      //     show: true,
      //     // modelData: this.modelData,
      //     project_id: this.project_id,
      //     item_id: row.id,
      //     // buildlist: this.buildList,
      //     formData: {
      //       // building_id: row.BUILDING_ID,
      //       // building_item_type: row.TYPE_ID,
      //       item_name: row.name,
      //       item_desc: row.desc
      //     }
      //   }
      //   this.$store.dispatch('SetUploadModelDialog', param).then(() => {}).catch(() => {})
      // }

    }
  }

</script>
