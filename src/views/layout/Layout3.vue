<template>
  <div>
    <!-- <sidebar class="sidebar-container" /> -->

    <div :class="classObj" class="app-wrapper">

      <div class="main-container3">
        <!-- <tags-view/> -->
        <app-main />
      </div>
    </div>
  </div>

</template>

<script>
  import {
    // Sidebar,
    // AppMain,
    TagsView
  } from './components'
  import ResizeMixin from './mixin/ResizeHandler'
  import AppMain from './components/AppMain3'
  export default {
    name: 'Layout3',
    components: {
    //   Navbar,
    //   Sidebar,
      AppMain,
      TagsView
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      classObj() {
        return {
          // hideSidebar: !this.sidebar.opened,
          // openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('closeSideBar', {
          withoutAnimation: false
        })
      },

    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }


  .nav-bar {
    /* z-index: 1001; */
  }

  .app-main {
    /* background-color: #3cba9c; */
  }

</style>
