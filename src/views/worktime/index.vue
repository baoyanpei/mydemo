<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="worktime-container" style="margin: 0px;">
    worktime-container
  </div>
</template>
<script>
  export default {
    data() {
      return {

      };
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },

    },
    watch: {
      // project_id(curVal, oldVal) {
      //   if (curVal !== null) {
      //     this.reloadData()
      //   }
      // },
    },
    mounted() {

    },

    methods: {

    }

  };

</script>
