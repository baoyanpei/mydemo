<style lang="scss">
  @import "./camera.scss";

</style>

<template>
  <div class="screen-camera">
    <div id="playerArea" v-html='source'></div>
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
        player: null,
        timerReplay: null,
        isPlay: false, //是否开始播放
        source: playerHTML,
        cameraURList: []
      }
    },
    props: {

    },
    computed: {

    },
    created() {
      playerHTML = this.getPlayerHTML('rtmp://rtmp.open.ys7.com/openlive/6afc96f4599c4708b8323fddc5b4cea2')
      this.source = playerHTML
      window.addEventListener("online", () => {
        if (this.isPlay === false) {
          let sources = document.getElementById('playerArea');
          sources.innerHTML = playerHTML
          this.initPlayer()
          this.player.play();
        }
      }); // offline网络连接事件        
      window.addEventListener("offline", () => {

      });
    },
    watch: {

    },
    async mounted() {
      await this.initDevlist()
      console.log('this.cameraURList', this.cameraURList)
      this.initPlayer()
      this.refreshData()
    },
    destroyed() {

    },
    methods: {
      initDevlist() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'devlist',
            project_id: 10000
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            // console.log('QueryDatumMeter - data', data)
            data.forEach(datum => {
              if (datum.device_type === 16 && datum.video_url.length > 0) {
                this.cameraURList.push(datum)
              }

            })

            resolve()
          }).catch((e) => {
            console.log(e)
            resolve()
          })


        })
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
            let sources = document.getElementById('playerArea');
            sources.innerHTML = playerHTML
            this.initPlayer()
            this.player.play();
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
      }
    },

  }

</script>
