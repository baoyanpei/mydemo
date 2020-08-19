<style lang="scss">
  @import "./lotPVModelListSettingDialog";

</style>
<template>

  <div id="lot-pv-model-list-setting-dialog" class="lot-pv-model-list-setting-dialog">
    <el-dialog :modal="false" width="950px" top="10vh" left="100" :lock-scroll="true" :close-on-click-modal="false"
      :close-on-press-escape="true" :visible.sync="LotPVModelListSettingDialog.show" @opened="openedDialogHandle"
      @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>
      <el-transfer v-model="selectedItemList" :props="{
      key: 'value',
      label: 'desc'
    }" :titles="['所有建筑模型', '场景中需要的建筑模型']" :data="allItemList">
      </el-transfer>
      <hr class="hr1" style="margin-bottom: 20px;" />
      <div style="text-align: right;">
        <el-button :loading="loading" @click.native.prevent="closeDialogHandle">取消
        </el-button>
        <el-button type="success" :loading="loading" @click.native.prevent="handleSubmit()">确定
        </el-button>
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
        loading: false,
        dialogTitle: '物联网建筑模型选择',
        allItemList: [],
        selectedItemList: []
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
      LotPVModelListSettingDialog: {
        get: function () {
          return this.$store.state.loT.LotPVModelListSettingDialog
        },
        set: function (newValue) {
          this.$store.state.loT.LotPVModelListSettingDialog = newValue
        }
      },

    },
    props: {

    },
    created: function () {

    },
    mounted() {
      const __PROJECT_ID = Cookies.get("PROJECT_ID")
      this.project_id = parseInt(__PROJECT_ID)

    },
    watch: {


    },
    methods: {
      clearData() {
        this.allItemList = []
        this.loading = false
        this.selectedItemList = []
      },
      async openedDialogHandle() {
        // this.tipMessage = "正在查询ComponentLibraryListDialog"
        console.log('this.LotPVModelListSettingDialog', this.LotPVModelListSettingDialog)

        const _itemList = this.LotPVModelListSettingDialog.all_item_ist //await this.getProjectItemsAll()



        _itemList.forEach(item => {
          if (item.process_status === 1 && item.url !== undefined && item.url !== null && item.url !==
            '') {
            this.allItemList.push({
              value: item.id,
              desc: item.name,
            })
          }
        });

        this.selectedItemList = this.LotPVModelListSettingDialog.item_id_list

      },
      closeDialogHandle() {
        this.clearData()
        const param = {
          show: false,
          title: '',
        }
        this.$store.dispatch('ShowLotPVModelListSettingDialog', param).then(() => {}).catch(() => {

        })
      },
      handleSubmit() {
        console.log('handleSubmit')
        console.log('this.selectedItemList', this.selectedItemList)
        console.log('this.allItemList', this.allItemList)

        if (this.selectedItemList.length === 0) {
          this.$message({
            message: '请至少选择一个建筑模型',
            type: 'error'
          })
          return
        }
        let param = {
          SelectedItemList: this.selectedItemList
        }
        console.log('param', param)
        this.$store.dispatch('SetLotPVModelListChange', param).then((result) => {
          this.closeDialogHandle()
        })
      },
      // getProjectItemsAll() {
      //   return new Promise((resolve, reject) => {
      //     const param = {
      //       method: 'project_items',
      //       project_id: this.project_id,
      //       // access_token: this.access_token
      //     }
      //     this.$store.dispatch('GetProjectItems', param).then((_itemList) => {
      //       console.log('getProjectItemsAll - _itemList', _itemList)
      //       let _listData = []
      //       _itemList.forEach(item => {
      //         if (item.process_status === 1 && item.url !== undefined && item.url !== null && item.url !==
      //           '') {
      //           _listData.push({
      //             value: item.id,
      //             desc: item.name,
      //           })
      //         }
      //       });
      //       console.log('_listData', _listData)
      //       resolve(_listData)
      //     })

      //   })
      // },
    }
  }

</script>
