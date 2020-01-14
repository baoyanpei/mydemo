<style rel="stylesheet/scss" lang="scss">
  @import "./BindBimButton";

</style>
<template>
  <span class="bind_bim_button">
    <!-- <el-button type="success" @click="clickBindBimHandle" icon="el-icon-link">绑定BIM项目</el-button> -->
  </span>

</template>

<script>
  export default {
    components: {

    },
    data() {
      return {

      }
    },
    computed: {},
    mounted() {
      // console.log("personInfo123", this.personInfo)
    },
    methods: {
      clickBindBimHandle() {
        const param = {
          show: true,
        //   itemInfoList: this.itemInfoList
        }
        // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
        this.$store.dispatch('ShowBindBimDialog', param).then(() => {}).catch(() => {})
      }

      
    }
  }

</script>
