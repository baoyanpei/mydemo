<style lang="scss">
  @import "./shenjiangjiTaji.scss";

</style>
<template>
  <div class="screen-shengjiangji-taji">
    <div class="bg-img">
      <!-- <img src="../../assets/tadiao.png"> -->
    </div>
    <el-row>
      <el-col :span="24" class="title">
        <span>升降机数据</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          高度：
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          {{sjjData.sjjgd}} 米
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          楼层：
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          {{sjjData.sjjlc}} 层
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          笼门状态：
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          {{sjjData.mzt}}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          上报时间：
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          {{sjjData.sbsj}}
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import moment from 'moment'
  export default {
    components: {},
    data() {
      return {
        sjjData: {
          sjjgd: '-',
          sjjlc: '-',
          sbsj: '-',
          mzt: '-'
        },


      }
    },
    props: {

    },
    filters: { //如下这样写

    },
    methods: {
      updateData(data) {
        this.sjjData.sjjgd = data.Height
        this.sjjData.sjjlc = data.Floor
        switch (data.DoorState) {
          case "0":
            this.sjjData.mzt = '内外笼门全关'
            break;
          case "1":
            this.sjjData.mzt = '内外笼门全开'
            break;
          case "2":
            this.sjjData.mzt = '仅内笼门开'
            break;
          case "3":
            this.sjjData.mzt = '仅外笼门开'
            break;
        }
        this.sjjData.sbsj = moment(data.RTime).format("HH:mm:ss")
      },
    },
    watch: {

    },
    mounted() {
      //   console.log("persion_data.entry_pic", this.persion_data.entry_pic)

    }
  }

</script>
