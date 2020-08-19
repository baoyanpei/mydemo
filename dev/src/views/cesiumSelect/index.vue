<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="project-cesium-select-index">
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
          </el-col>
        </el-row>

        <el-row :gutter="20" style="border-bottom:0px solid #eeeeee;">
          <el-table ref="multipleTable" row-key="tid" :data="tableFilterData" :height="tableHeight" default-expand-all
            tooltip-effect="dark" style="width: 100%;height: 100vh;"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column prop="label" label="名称" width="380">
              <template slot-scope="scope">
                <div v-if="scope.row.label !== ''">
                  {{scope.row.label}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="oper" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"
                  v-if="scope.row.menuType==='item' && scope.row.url!==undefined && scope.row.url!==null && scope.row.url!==''"
                  @click="handleEdit(scope.row)">查看模型
                </el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="upload_name" label="上传人" width="150" align="center">
            </el-table-column> -->
            <el-table-column label="上传时间" width="250" align="center">
              <template slot-scope="scope">{{ scope.row.up_time }}</template>
            </el-table-column>
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
  import BindBimButton from '@/views/layout/components/BindBimButton'
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
        tableData: [],
        tableFilterData: [],
        tableHeight: 0,
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
      },
      formatDate(data) {
        return moment(data).format("YYYY年MM月DD日 HH:mm")
      },
      countTableHeight() {
        window.tableHeight = window.innerHeight || document.documentElement.clientHeight || document.body
          .clientHeight
        this.tableHeight = window.tableHeight - 130
      },
      getProjectItemsAll() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'project_files',
            project_id: this.project_id,
            file_type: 4
            // access_token: this.access_token
          }
          this.$store.dispatch('GetProjectFiles', param).then((_itemList) => {
            console.log('getProjectItemsAll - _itemList', _itemList)
            resolve(_itemList)
          })

        })
      },
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
          let _ProjectItemsAll = await this.getProjectItemsAll() // 获取模型的item列表（最新版本）

          _ProjectItemsAll.forEach(_Item => {
            if (_Item.process_status === 1) {
              // console.log('_Item', _Item)
              _Item['tid'] = `item-${_Item.id}`
              _Item['menuType'] = 'item'

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
        Cookies.set('CESIUM_DISPLAY_DATA', JSON.stringify({
          'item_list': [_item]
        }))
        this.$store.dispatch('SetModelDisplayData', {
          'item_list': [_item]
        }).then(() => {
          this.$router.push({
            path: '/cesiumDisplay',
            // query: {
            //   'queryData': 131
            // }
          })
        }).catch(() => {})

      },
    }
  }

</script>
