<style lang="scss">
    @import "./markupTools";
  
  </style>
  <template>
    <div class="markup-tools" v-drag draggable="true">
      <div class="markup-tools-main" >
        <div class="title-area">
          <div>视点涂鸦工具</div>
        </div>
        <div class="tools-main">
          <div class="tools-button">
            <font-awesome-icon ref="Rectangle" :icon="['far','square']" class="tools-icon"
              @click="clickToolMainButtonHandle('Rectangle')" />
          </div>
          <div class="tools-button">
            <font-awesome-icon ref="Circle" :icon="['far','circle']" class="tools-icon"
              @click="clickToolMainButtonHandle('Circle')" />
          </div>
          <div class="tools-button">
            <font-awesome-icon ref="Arrow" icon="long-arrow-alt-up" class="tools-icon"
              @click="clickToolMainButtonHandle('Arrow')" />
          </div>
          <div class="tools-button">
            <font-awesome-icon ref="Freehand" icon="signature" class="tools-icon"
              @click="clickToolMainButtonHandle('Freehand')" />
          </div>
          <div class="tools-button">
            <font-awesome-icon ref="Text" :icon="['fas','font']" class="tools-icon"
              @click="clickToolMainButtonHandle('Text')" />
          </div>
        </div>
      </div>
      <div ref="markupToolsSquare" class="markup-tools-square">
      </div>
      <div ref="markupToolsExt" class="markup-tools-ext">
        <div class="tools-button" @click="clickPenButtonHandle(1)">
          <div ref="pen-1" class="peng-dot1"></div>
        </div>
        <div class="tools-button" @click="clickPenButtonHandle(2)">
          <div ref="pen-2" class="peng-dot2"></div>
        </div>
        <div class="tools-button" @click="clickPenButtonHandle(3)">
          <div ref="pen-3" class="peng-dot3"></div>
        </div>
        <div class="tools-button" @click="clickColorButtonHandle(1)">
          <div ref="color-1" class="color-rectangle1"></div>
        </div>
        <div class="tools-button" @click="clickColorButtonHandle(2)">
          <div ref="color-2" class="color-rectangle2"></div>
        </div>
        <div class="tools-button" @click="clickColorButtonHandle(3)">
          <div ref="color-3" class="color-rectangle3"></div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script>
    import Cookies from 'js-cookie'
    import lodash from 'lodash'
  
    export default {
      name: 'markup-tools',
      directives: {
        drag(el) {
          let oDiv = el; //当前元素
          let self = this; //上下文
          //禁止选择网页上的文字
          document.onselectstart = function () {
            return false;
          };
          oDiv.onmousedown = function (e) {
            //鼠标按下，计算当前元素距离可视区的距离
            let disX = e.clientX - oDiv.offsetLeft;
            let disY = e.clientY - oDiv.offsetTop;
            document.onmousemove = function (e) {
              //通过事件委托，计算移动的距离
              let l = e.clientX - disX;
              let t = e.clientY - disY;
              //移动当前元素
              oDiv.style.left = l + "px";
              oDiv.style.top = t + "px";
            }
            document.onmouseup = function (e) {
              document.onmousemove = null;
              document.onmouseup = null;
            };
            //return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
            return false;
          };
        }
      },
      components: {},
      data() {
        return {
          currenColorType: 1,
          bottonConfig: {
            'Rectangle': {
              'square': {
                left: '15px'
              },
              'extTools': {
                left: '0px',
                pen: 1,
                color: 1
              }
  
            },
            'Circle': {
              'square': {
                left: '58px'
              },
              'extTools': {
                left: '15px'
              }
            },
            'Arrow': {
              'square': {
                left: '100px'
              },
              'extTools': {
                left: '35px'
              }
            },
            'Freehand': {
              'square': {
                left: '140px'
              },
              'extTools': {
                left: '65px'
              }
            },
            'Text': {
              'square': {
                left: '180px'
              },
              'extTools': {
                left: '105px'
              }
            },
          }
        }
      },
      computed: {
  
      },
      created() {
  
      },
      destroyed() {},
      watch: {
  
      },
      mounted() {
  
      },
      methods: {
        clickToolMainButtonHandle(type) {
          // console.log("bottonConfig", this.bottonConfig[type]['square'].left)
          this.setToolMainSelected(type)
        },
        setToolMainSelected(type) {
          this.$refs['markupToolsSquare'].style.left = this.bottonConfig[type]['square'].left //修改属性
          this.$refs['markupToolsExt'].style.left = this.bottonConfig[type]['extTools'].left //修改属性
  
          Object.keys(this.bottonConfig).forEach((key) => {
            this.$refs[key].style.color = '#000000' //修改属性
  
          });
          this.$refs[type].style.color = '#1C9816' //修改属性
          this.$emit('setMarkerMode', type)
          // console.log('this.currenColorType', this.currenColorType)
          this.clickColorButtonHandle(this.currenColorType)
        },
        clickPenButtonHandle(type) {
          for (let i = 1; i <= 3; i++) {
            this.$refs['pen-' + i].style.backgroundColor = '#c2c2c2' //修改属性
          }
          this.$refs['pen-' + type].style.backgroundColor = '#0000FF' //修改属性
        },
        clickColorButtonHandle(type) {
          this.currenColorType = type
          for (let i = 1; i <= 3; i++) {
            this.$refs['color-' + i].style.border = '0px solid #000000' //修改属性
          }
          this.$refs['color-' + type].style.border = '1px solid #999999' //修改属性
          let _color = "#FD0800"
          switch (type) {
            case 1:
              _color = "#FD0800"
              break;
            case 2:
              _color = "#1800FC"
              break;
            case 3:
              _color = "#15F74C"
              break;
          }
          this.$emit('setMarkerStyle', _color)
        }
      }
    }
  
  </script>
  