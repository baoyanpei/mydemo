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
  const playerHTML =
    '<video id="myPlayer" poster="" controls playsInline webkit-playsinline autoplay=true><source src="rtmp://rtmp.open.ys7.com/openlive/6afc96f4599c4708b8323fddc5b4cea2" type="rtmp/flv" /></video>'

  export default {
    components: {},
    data() {
      return {
        player: null,
        timerReplay: null,
        isPlay: false, //是否开始播放
        source: playerHTML
      }
    },
    props: {

    },
    computed: {

    },
    created() {

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
    mounted() {
      this.initPlayer()
    },
    destroyed() {

    },
    methods: {
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

  }

</script>
