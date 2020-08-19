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
    name: 'index',
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
    },
    watch: {
      project_id(curVal, oldVal) {
        console.log('curVal',curVal,oldVal)
        this.getplan()
      },
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
            console.log("this.titlebox",this.titlebox)
          })
      },
      planidtran(index){
        this.nowid=index
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
