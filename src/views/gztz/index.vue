<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="gztz-container" style="margin: 0px;">
工资台帐
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {

      };
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      }

    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          // this.reloadData()
        }
      },
    },
    mounted() {
      if (this.project_id !== null) {
      }
    },
    methods: {

    }
  };
</script>
