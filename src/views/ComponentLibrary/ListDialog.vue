<style lang="scss">
  @import "./ListDIalog";

</style>
<template>

  <div id="component-library-list-dialog" class="component-library-list-dialog">
    <el-dialog :modal="false" width="400px" top="10vh" :lock-scroll="true" :close-on-click-modal="false"
      :close-on-press-escape="true" :visible.sync="ComponentLibraryListDialog.show" @opened="openedDialogHandle"
      @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>

      <div class="component-library-list">
        <div v-show="tipMessage!==''" class="tip-message">{{tipMessage}}</div>
        <el-row v-for="(item,index) in componentList" :key="index" class="library-item">
          <el-col :span="6" style="height:100%;display: table-cell;vertical-align: middle;text-align: center;">
            <img :src="item.img" class="photo info-name-link">
            <div :class="[item.className]">
              <img :src="item.pictureFullSrc" :key="item.pictureFullSrc" v-show="false">
            </div>
          </el-col>
          <el-col :span="12" style="padding-left:5px;">
            <el-row :gutter="24">
              <div class="grid-content info-title">
                <span class="info-title-link">{{item.name}}</span>
              </div>
            </el-row>

          </el-col>
          <el-col :span="6">
            <div class="view-point-delete">
              
                <el-button size="mini"  type="primary" @click="addCompnentHander(item)">添加</el-button>
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

        this.getFamilyList()
      },
      closeDialogHandle() {
        this.clearData()
      },
      getFamilyList() {
        return new Promise((resolve, reject) => {
          this.buildList = []
          const param = {
            method: 'family_query',
            project_id: this.project_id,
            // access_token: this.access_token
          }
          this.$store.dispatch('GetFamilyQuery', param).then((_itemList) => {
            console.log('GetFamilyQuery - _itemList', _itemList)
            this.componentList = _itemList

            resolve()
          })

        })
      },
      addCompnentHander(item) {
        console.log('addCompnentHander', item)
        let param = {
          item: item
        }
        // const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
        // param.refresh1 = genRandom(1, 1000)
        this.$store.dispatch('SetComponentDataAdd', param).then((result) => {
          // this.$message({
          //   message: '视点保存成功！',
          //   type: 'success'
          // })
          // this.loadingSaveViewPoint = false
          // this.closeSaveDialogHandle()
        })

      }
    }
  }

</script>
