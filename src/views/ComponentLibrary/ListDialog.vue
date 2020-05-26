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
       
      },
      openedDialogHandle() {
        // this.tipMessage = "正在查询ComponentLibraryListDialog"
        console.log('this.ComponentLibraryListDialog', this.ComponentLibraryListDialog)


      },
      closeDialogHandle() {
        this.clearData()
      },
    }
  }

</script>
