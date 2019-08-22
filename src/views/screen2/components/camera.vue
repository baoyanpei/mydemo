<style lang="scss">
  @import "./camera.scss";

</style>

<template>
  <div class="screen-camera">
    <div v-if="hasCamera === false" class="noCameraTips">{{noCameraTips}}</div>
    <div v-if="hasCamera === true" id="playerArea" v-html='source'></div>
  </div>
</template>
<script>
  import lodash from 'lodash'
  import moment from 'moment'

  let player;
  let playerHTML = ''


  export default {
    components: {},
    data() {
      return {
        noCameraTips: '', // 该项目没有配置监控视频
        player: null,
        timerReplay: null,
        isPlay: false, //是否开始播放
        source: playerHTML,
        cameraURList: [],
        hasCamera: true
      }
    },
    props: {

    },
    computed: {

    },
    created() {
      // playerHTML = this.getPlayerHTML('rtmp://rtmp.open.ys7.com/openlive/6afc96f4599c4708b8323fddc5b4cea2')
      // this.source = playerHTML
      window.addEventListener("online", () => {
        if (this.isPlay === false) {
          this.playVideo()
          // let sources = document.getElementById('playerArea');
          // sources.innerHTML = playerHTML
          // this.initPlayer()
          // this.player.play();
        }
      }); // offline网络连接事件        
      window.addEventListener("offline", () => {

      });
    },
    watch: {

    },
    async mounted() {
      // this.initPlayer()
      // this.refreshData()
    },
    destroyed() {

    },
    methods: {
      openPlayer(datumMeterMap) {
        // this.project_id = project_id
        datumMeterMap.forEach(datum => {
          if (datum.device_type === 16 && datum.video_url.length > 0 && datum.stable === 1) {
            this.cameraURList.push(datum)
          }
        })
        console.log('this.cameraURList', this.cameraURList)
        if (this.cameraURList.length > 0) {
          // this.initPlayer()

          playerHTML = this.getPlayerHTML('')
          this.source = playerHTML
          setTimeout(() => {
            if (this.isPlay === false) {
              this.playVideo()
            }
          }, 3 * 1000)
          this.refreshData()
        } else {
          this.hasCamera = false
          this.noCameraTips = '该项目没有配置监控视频'
        }

      },
      getPlayerHTML(url) {
        //rtmp://rtmp.open.ys7.com/openlive/6afc96f4599c4708b8323fddc5b4cea2
        if (url === '') {
          let _urlList = lodash.shuffle(this.cameraURList);
          // console.log('_urlList', _urlList)
          url = _urlList[0].video_url
        }

        let html =
          `<video id="screen_carame_player" poster="" controls playsInline webkit-playsinline autoplay=true><source src="${url}" type="rtmp/flv" /></video>`

        return html
      },
      rePlay() {
        console.log('rePlay')
        this.timerReplay = setTimeout(() => {
          if (this.isPlay === false) {
            this.playVideo()
            // let sources = document.getElementById('playerArea');
            // sources.innerHTML = playerHTML
            // this.initPlayer()
            // this.player.play();
          }
          this.rePlay()
        }, 10 * 1000)
      },
      initPlayer() {
        this.player = new EZUIPlayer('screen_carame_player');
        this.player.on('play', () => {
          this.isPlay = true;
          clearTimeout(this.timerReplay)
        })
        this.player.on('error', () => {
          console.log('error');
          this.isPlay = false;
          this.rePlay()
        });
      },
      refreshData() {
        setTimeout(() => {
          playerHTML = this.getPlayerHTML('')
          this.isPlay = false;
          this.rePlay()
          this.refreshData()
        }, 120 * 1000) //20秒
      },
      playVideo() {
        let sources = document.getElementById('playerArea');
        sources.innerHTML = playerHTML
        console.log('playerHTML', playerHTML)
        this.initPlayer()
        this.player.play();
      },
    },

  }

</script>
