<style lang="scss">
    @import "./index";
  
  </style>
  <template>
    <div class="main-container" style="margin: 0px;">
      <iframe id="show-iframe" frameborder=0 name="showHere" scrolling=auto src="https://720yun.com/t/260jud4f5w1"
        style="height:calc(100vh - 36.9px);width:calc(100vw - 40px);"></iframe>
    </div>
  </template>
  
  <script>
    // import $ from 'jquery'
    export default {
      directives: {},
      name: 'Main1',
      components: {
  
      },
      data() {
        return {
  
        }
      },
      computed: {
  
      },
      created() {
  
      },
      watch: {
  
      },
      mounted() {
        // this.draggableValue.handle = this.$refs[this.handleId];
  
        // $("#aaaa").html('哈哈哈')
        // toggleClass(document.body, 'custom-theme')
        const oIframe = document.getElementById('show-iframe');
        const deviceWidth = document.documentElement.clientWidth;
        //   const deviceHeight = document.documentElement.clientHeight;
        //   oIframe.style.width = deviceWidth + 'px';
        //   oIframe.style.height = "100%";
  
  
  
      },
      destroyed() {
        // window.removeEventListener('hashchange', this.afterQRScan)
      },
      methods: {
  
      }
    }
  
  </script>
  