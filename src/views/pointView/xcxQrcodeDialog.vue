<style lang="scss">
  @import "./xcxQrcodeDialog";

</style>
<template>

  <div id="xcx-qrcode-dialog" class="xcx-qrcode-dialog">
    <el-dialog :modal="true" :close-on-click-modal="false" width="650px" top="10vh" :lock-scroll="true"
      :visible.sync="ViewPointQrcodeDialog.show" @opened="openedDialogHandle" @close="closeDialogHandle"
      :title="dialogTitle" v-el-drag-dialog>
      <div style="margin:0px 0px;text-align: center;padding: 5px;" class="qrcode-area">
        <div class="creat-img" ref="qrcodeBox">
          <el-row>
            <el-col :span="12">
              <div id="xcxPVQrcode" style="padding: 5px;"></div>
            </el-col>
            <el-col :span="12">
              <div class="qrcode_type_name">{{qrcodeTypeName}}</div>
              <div class="view_point_name">{{viewPointName}}</div>
              <div class="view_point_floor" v-html='viewPointFloor'></div>
              <div class="logo-img">
                <img src="/static/icon/qrcode_title2.png" style="width:250px;padding-top: 5px;">
              </div>

            </el-col>
          </el-row>
        </div>
        <div v-if="imgUrl.length === 0" style="margin: 20px;" >正在生成二维码图片...</div>
        <div v-show="imgUrl.length>0" id="xcxPVQrcodeImg">
          <img :src="imgUrl">
          <div>
            <el-button class="ml10" type="text" size="medium" @click="copyQrcode">点击下载</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {
    qrcanvas
  } from 'qrcanvas';
  import $ from 'jquery'
  import moment from 'moment'
  export default {
    components: {},
    directives: {},
    data() {
      return {
        dialogTitle: '',
        imgUrl: '',
        qrcodeTypeName: '',
        viewPointName: '',
        viewPointFloor: ''
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
      ViewPointQrcodeDialog: {
        get: function () {
          return this.$store.state.viewPoint.ViewPointQrcodeDialog
        },
        set: function (newValue) {
          this.$store.state.viewPoint.ViewPointQrcodeDialog = newValue
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
      imgUrl(val, oldval) {
        //监听到imgUrl有变化以后 说明新图片已经生成 隐藏DOM
        if (val !== '') {
          $('#xcxPVQrcode').html('')
          this.$refs.qrcodeBox.style.display = "none";
        } else {
          this.$refs.qrcodeBox.style.display = "block";
        }
      },
    },
    methods: {
      clearData() {
        this.dialogTitle = ''
        this.imgUrl = ''
        this.qrcodeTypeName = ''
        this.viewPointName = ''
        this.viewPointFloor = ''
        $('#xcxPVQrcode').html('')
      },
      async openedDialogHandle() {
        console.log('ViewPointQrcodeDialog', this.ViewPointQrcodeDialog)
        // this.clearData()
        let isHasSelected = false
        let _data = this.ViewPointQrcodeDialog.data


        const cameraInfo = JSON.parse(Base64.decode(_data.camera_info))
        console.log('cameraInfo', cameraInfo)
        let _objectSetList = cameraInfo.objectSet
        if (_objectSetList !== undefined && _objectSetList.length > 0) {
          let objectSetIDs = _objectSetList[0].id
          if (objectSetIDs.length > 0) {
            isHasSelected = true
          }
        }

        let _title = ''
        if (isHasSelected === true) {

          this.qrcodeTypeName = 'BIM构件二维码'
          this.viewPointName = `构件：${_data.name}`
          _title = `${this.viewPointName} BIM构件二维码`
        } else {

          this.qrcodeTypeName = 'BIM视点二维码'
          this.viewPointName = _data.name
          _title = `${this.viewPointName} BIM视点二维码`
        }
        if (_data.floor_name !== '') {
          this.viewPointFloor = `${_data.floor_name}楼`
        } else {
          this.viewPointFloor = '&nbsp;'
        }
        this.dialogTitle = _title
        // https://xcx.tddata.net/smz/#/xcx/pvshow?project_id=10000&pvid=100


        setTimeout(() => {
          let _qrcode_url =
            `https://xcx.tddata.net/smz/#/xcx/pvshow?project_id=${_data.project_id}&pvid=${_data.id}&from=xcx_pv_qrcode`
          console.log('_qrcode_url', _qrcode_url)
          let canvas1 = qrcanvas({
            data: decodeURIComponent(_qrcode_url), //分享链接（根据需求来）
            cellSize: 7,
            // size: 140,
            // padding: 0,
            // typeNumber:6
            // size: 155 //二维码大小
          });
          document.getElementById('xcxPVQrcode').appendChild(canvas1);
          html2canvas(this.$refs.qrcodeBox).then((canvas) => {
            this.imgUrl = canvas.toDataURL("image/png");
          });
        }, 1000)



      },
      closeDialogHandle() {
        this.clearData()
      },
      copyQrcode() {
        let imgSrc = $('#xcxPVQrcodeImg img').attr("src");
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          // 不支持download时，可提示用户右键下载
          console.log('不支持download时，可提示用户右键下载')
        } else {
          let _t = moment().format('YYYYMMDDHHmmss')
          let alink = document.createElement("a");
          alink.href = imgSrc;
          alink.download = `${this.dialogTitle.replace(' ','_')}_${_t}.png`;
          alink.click();
        }
      },
    }
  }

</script>
