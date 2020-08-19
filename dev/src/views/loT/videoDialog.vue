<style lang="scss">
  @import "./videoDialog";

</style>
<template>

  <div id="video-detail" class="video-detail">
    <el-dialog :modal="false" width="600px" top="6vh" :lock-scroll="true" :close-on-click-modal="false"
      @open="openVideoDialogHandle" @opened="openedVideoDialogHandle" @close="closeVideoDialogHandle"
      :visible.sync="VideoDialog.show" :title="dialogTitle">
      <div style="height:380px;" v-if="VideoDialog.show">
        <!-- <div id="playerArea" v-html='source'></div> -->
        <div id="playerArea">
          <video id="myPlayer" poster="" controls playsInline webkit-playsinline autoplay=true>
            <source :src="video_url" type="rtmp/flv" /></video>
        </div>

      </div>
    </el-dialog>
  </div>

</template>

<script>
  import moment from 'moment'
  import lodash from 'lodash'
  const playerHTML =
    '<video id="myPlayer" poster="" controls playsInline webkit-playsinline autoplay=true><source src="rtmp://rtmp.open.ys7.com/openlive/6afc96f4599c4708b8323fddc5b4cea2" type="rtmp/flv" /></video>'
  import {
    Loading
  } from 'element-ui';
  // import Mock from 'mockjs'
  export default {
    components: {},
    directives: {},
    data() {
      return {
        loading: false,
        player: null,
        timerReplay: null,
        isPlay: false, //是否开始播放
        source: playerHTML,
        video_url: '',
        dialogTitle:''
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      VideoDialog: {
        get: function () {
          return this.$store.state.loT.VideoDialog
        },
        set: function (newValue) {
          this.$store.state.loT.VideoDialog = newValue
        }
      },
    },
    created: function () {
      // window.addEventListener("online", () => {
      //   if (this.isPlay === false) {
      //     let sources = document.getElementById('playerArea');
      //     sources.innerHTML = playerHTML
      //     this.initPlayer()
      //     this.player.play();
      //   }
      // }); // offline网络连接事件

    },
    watch: {

    },
    methods: {
      openVideoDialogHandle() {

      },
      // 打开窗口
      openedVideoDialogHandle() {
        console.log("2131313")
        console.log('VideoDialog', this.VideoDialog)
        this.video_url = this.VideoDialog.deviceData.video_url
        this.dialogTitle = this.VideoDialog.deviceData.device_name + ' - 监控视频直播'
        setTimeout(() => {
          // if (this.player === null) {
          this.initPlayer()
          this.player.play();
          // }

        }, 3000)

      },
      closeVideoDialogHandle() {
        this.video_url = ""
        console.log('closeVideoDialogHandle')
      },
      rePlay() {
        console.log('rePlay')
        this.timerReplay = setTimeout(() => {
          if (this.isPlay === false) {
            let sources = document.getElementById('playerArea');
            sources.innerHTML = playerHTML
            this.initPlayer()
            this.player.play();
          }
          this.rePlay()
        }, 10 * 1000)
      },
      initPlayer() {
        this.player = new EZUIPlayer('myPlayer');

        this.player.on('play', () => {
          this.isPlay = true;
          clearTimeout(this.timerReplay)
        })
        this.player.on('error', () => {
          console.log('error');
          this.isPlay = false;
          this.rePlay()
        });
      }
    },
    mounted() {

    }
  }

</script>
