<template>
  <div class="nav-bar2" style="padding-left: 0px;">
    <el-menu class="navbar" mode="horizontal">
      <span class="nav-title">机构名称：{{orgName}}</span>
      <div class="right-menu">
        <!-- <el-button type="primary" style="top:0px;position: relative;" @click="openScreenHandle">
          <icon name="desktop" scale="1.4" style="line-height: 20px;"></icon>
          <span>项目看板</span>
        </el-button>-->
        <!-- <el-button type="primary" style="top:0px;position: relative;" @click="tongxunluHandle">
          <icon name="users" scale="1.4" style="line-height: 20px;"></icon>
          <span>通讯录</span>
        </el-button>-->
        <!-- <el-button type="primary">
          <icon name="envelope" scale="1.2"></icon>
        </el-button>-->
        <!-- <el-button @click="userHandler" type="primary">
          <icon name="user-circle" scale="1.2"></icon>
        </el-button>-->
        <el-button type="primary" @click="logout">
          <icon name="power-off" scale="1.2"></icon>
        </el-button>
      </div>
    </el-menu>
    <div v-show="IsViewPointEditMode===true" class="navbar_mask"></div>
  </div>
</template>
<!--模型用，导航简单-->
<script>
// import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'

export default {
  components: {},
  data() {
    return {
      orgName: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar']),
    project_id: {
      get: function() {
        return this.$store.state.project.project_id
      },
      set: function(newValue) {
        this.$store.state.project.project_id = newValue
      }
    },
    project_list() {
      return this.$store.state.project.project_list
    },
    // org_name: {
    //   get: function() {
    //     return this.$store.state.project.org_name
    //   },
    //   set: function(newValue) {
    //     this.$store.state.project.org_name = newValue
    //   }
    // },
    currentProject: {
      get: function() {
        return this.$store.state.project.currentProject
      },
      set: function(newValue) {
        this.$store.state.project.currentProject = newValue
      }
    },
    IsViewPointEditMode() {
      return this.$store.state.viewPoint.IsViewPointEditMode
    }
  },
  watch: {
    IsViewPointEditMode(curVal, oldVal) {
      // console.log("IsViewPointEditMode", curVal)
    },
    currentProject(curVal, oldVal) {
      if (curVal !== null) {
        this.ShowOriName(this.currentProject)
      }
    }
  },
  mounted() {
    if (this.currentProject !== null && this.orgName === '') {
      this.ShowOriName(this.currentProject)
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    tongxunluHandle() {
      this.$router.push({
        path: '/tongxunlu'
      })
    },
    openScreenHandle() {
      window.open(`/#/screen3?project_id=${this.project_id}`, '_blank')
    },
    userHandler() {
      this.$store
        .dispatch('SetHuiyiFullCalendarDialog', {
          isShow: true
        })
        .then(() => {})
        .catch(() => {})
    },
    ShowOriName(projectInfo) {
      let _orgName = ''
      if (projectInfo !== null) {
        if (
          projectInfo.org_full_name !== '' &&
          projectInfo.org_full_name.length <= 10
        ) {
          _orgName = projectInfo.org_full_name
        } else {
          _orgName = projectInfo.org_name
        }
      }
      this.orgName = _orgName
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import './Navbar2';
</style>
