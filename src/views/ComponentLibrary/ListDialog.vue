<style lang="scss">
  @import "./ListDIalog";

</style>
<template>

  <div id="component-library-list-dialog" class="component-library-list-dialog">
    <el-dialog :modal="false" width="300px" top="10vh" :lock-scroll="true" :close-on-click-modal="false"
      :close-on-press-escape="true" :visible.sync="ComponentLibraryListDialog.show" @opened="openedDialogHandle"
      @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>

      <div class="component-library-list">
        <div v-show="tipMessage!==''" class="tip-message">{{tipMessage}}</div>
        <el-row v-for="(item,index) in componentList" :key="index">
          <!-- <el-col :span="8" style="height:100%;display: table-cell;vertical-align: middle;text-align: center;">
            <img :src="item.pictureLiteSrc" class="photo info-name-link" @click='getViewPointsDataHandle(item)'>
            <div :class="[item.className]" v-viewer="viewOptions">
              <img :src="item.pictureFullSrc" :key="item.pictureFullSrc" v-show="false">
            </div>
          </el-col> -->
          <el-col :span="12" style="padding-left:5px;">
            <el-row :gutter="24">
              <div class="grid-content info-title">
                <span class="info-title-link" >{{item.name}}</span>
              </div>
            </el-row>

          </el-col>
          <el-col :span="4">
            <div class="view-point-delete">
              <i class="el-icon-plus " style="color: red; cursor: pointer;font-size: 16px;"
                @click="addCompnentHander(item)"></i>
            </div>
          </el-col>
        </el-row>
      </div>

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
        dialogTitle: '构件库',
        tipMessage: '',
        componentList: []
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
      ComponentLibraryListDialog: {
        get: function () {
          return this.$store.state.componentLibrary.ComponentLibraryListDialog
        },
        set: function (newValue) {
          this.$store.state.componentLibrary.ComponentLibraryListDialog = newValue
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
        this.componentList = []
      },
      openedDialogHandle() {
        // this.tipMessage = "正在查询ComponentLibraryListDialog"
        console.log('this.ComponentLibraryListDialog', this.ComponentLibraryListDialog)

        this.getProjectItemsAll()
      },
      closeDialogHandle() {
        this.clearData()
      },
      getProjectItemsAll() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'project_items',
            project_id: 10000,
            // access_token: this.access_token
          }
          this.$store.dispatch('GetProjectItems', param).then((_itemList) => {
            console.log('getProjectItemsAll11111 - _itemList', _itemList)
            this.componentList = _itemList
            // _buildList.forEach(async build => {
            //   build['from'] = 1 // 来自玮哥接口
            //   this.buildMap.set(build.id, build)
            // });
            resolve(_itemList)
          })

        })
      },
      addCompnentHander(item) {
        console.log('addCompnentHander', item)
        

      }
    }
  }

</script>
