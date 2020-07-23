<style lang="scss">
  @import "./TJFXMenu";
  </style>
<template>
  <div class="grid-content bg-purple tjfx-menu" style="border-right:1px solid #eeeeee; padding: 5px;min-height:500px">
    <el-row type="flex" class="row-bg">
        <div class="publictitle">
          <div v-for="item in this.titlebox">
            <div class="littletitle" :class="{'active':(nowid==item.tid)}" @click="planidtran(item.tid)">{{item.name}}</div>
          </div>
        </div>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'yearsplan',
    data() {
      return {
        titlebox:[],
        nowid:0
      };
    },
    computed:{
      project_id() {
        return this.$store.state.project.project_id
      },
      plan_typeid(){
        return this.$store.state.plantypeid.count
      }
    },
    watch: {
      project_id(curVal, oldVal) {
        console.log('curVal',curVal,oldVal)
        this.getplan()
      },
      plan_typeid(curVal, oldVal){
        this.nowid=curVal
      }
    },
    mounted(){
      if (this.project_id !== null) {
        this.getplan()
      }
    },
    methods:{
      getplan(){
        const param = {
            method:'plan_type',
            project_id: this.project_id,
          }
          this.$store.dispatch('Getplan', param).then((data) => {
            this.titlebox=data.data
            for(let i=0;i<this.titlebox.length;i++){
              if(this.titlebox[i].tid==6){
                this.titlebox.splice(i,1)
              }
            }
            this.nowid=this.titlebox[0].tid
            console.log("this.titlebox",this.titlebox)
          })
      },
      planidtran(index){
        this.nowid=index
        this.$store.commit('planidchange',index)
      }
    }
  }
</script>
<style>
  .publictitle{
    width: 100%;
  }
  .littletitle{
    width: 100%;
    height: 40px;
    margin-top: 5px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #A0A0A0;
    color: #A0A0A0;
  }
  .active{
    background-color: #1abc9c;
    color: #ffffff;
  }
</style>
<!--不要66666666-->
