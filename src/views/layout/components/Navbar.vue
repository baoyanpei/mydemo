<template>
  <div class="nav-bar" style="padding-left: 32px;">
    <el-menu class="navbar" mode="horizontal">
      <span class="nav-title">机构名称：{{org_name}}</span>
      <!-- <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" /> -->

      <!-- <breadcrumb class="breadcrumb-container" /> -->
      <span class="nav-xmmc">项目名称：</span>
      <el-select v-model="project_id" placeholder="请选择" style="width: 210px;" @change="ProjectChangeHandle">
        <el-option v-for="item in project_option" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <BindBimButton v-if="isBindBIM===false"></BindBimButton>
      <span v-if="isBindBIM===true" class="bim-name-area">
        {{bim_name_desc}}
      </span>
      <div class="right-menu">
        <el-button type="primary" style="top:0px;position: relative;" @click="openercode">
          <img src="../../../../static/icon/icon.png" alt="" style="width: 20px;height: 20px;color: #eaeefb"> <span>系统二维码生成</span>
        </el-button>
        <el-button type="primary" style="top:0px;position: relative;" @click="openScreenHandle">
          <icon name="desktop" scale="1.4" style="line-height: 0px;"></icon> <span>项目看板</span>
        </el-button>
        <el-button type="primary" style="top:0px;position: relative;" @click="tongxunluHandle">
          <icon name="users" scale="1.4" style="line-height: 20px;"></icon> <span>通讯录</span>
        </el-button>
        <el-button type="primary">
          <icon name="envelope" scale="1.2"></icon>
        </el-button>
        <el-button @click="userHandler" type="primary">
          <icon name="user-circle" scale="1.2"></icon>
        </el-button>
        <el-button type="primary" @click="logout">
          <icon name="power-off" scale="1.2"></icon>
        </el-button>
        <!-- <error-log class="errLog-container right-menu-item" /> -->

        <!-- <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
              <screenfull class="screenfull right-menu-item" />
            </el-tooltip> -->

        <!-- <lang-select class="international right-menu-item" /> -->

        <!-- <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
              <theme-picker class="theme-switch right-menu-item" />
            </el-tooltip> -->

        <!-- <el-dropdown class="avatar-container right-menu-item" trigger="click">
              <div class="avatar-wrapper">
                <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
                <i class="el-icon-caret-bottom" />
              </div>
              <el-dropdown-menu slot="dropdown">
                <router-link to="/">
                  <el-dropdown-item>
                    {{ $t('navbar.dashboard') }}
                  </el-dropdown-item>
                </router-link>
                <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
                  <el-dropdown-item>
                    {{ $t('navbar.github') }}
                  </el-dropdown-item>
                </a>
                <el-dropdown-item divided>
                  <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
      </div>
    </el-menu>
  </div>

</template>

<script>
  // import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
  import {
    mapGetters
  } from 'vuex'
  import Cookies from 'js-cookie'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import LangSelect from '@/components/LangSelect'
  import ThemePicker from '@/components/ThemePicker'
  import BindBimButton from '@/views/layout/components/BindBimButton'
  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      LangSelect,
      ThemePicker,
      BindBimButton
    },
    data() {
      return {
        isBindBIM: true,
        bim_name_desc: ''
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar'
      ]),
      project_id: {
        get: function () {
          return this.$store.state.project.project_id
        },
        set: function (newValue) {
          this.$store.state.project.project_id = newValue
        }
      },
      project_option() {
        return this.$store.state.project.project_option
      },
      project_list() {
        return this.$store.state.project.project_list
      },
      org_name: {
        get: function () {
          return this.$store.state.project.org_name
        },
        set: function (newValue) {
          this.$store.state.project.org_name = newValue
        }
      },
      BindBimDataChanged() {
        return this.$store.state.bindBim.BindBimDataChanged
      }

    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          console.log("Nabar-project_id", curVal)
          this.GetOutsysInfo(curVal)
        }
      },
      BindBimDataChanged(curVal, oldVal) {
        console.log("BindBimDataChanged")
        this.GetOutsysInfo(this.project_id)
      }
    },
    mounted() {
      // console.log("project_idproject_idproject_idproject_idproject_id", this.project_id)
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
        window.open(`/#/screen3?project_id=${this.project_id}`, '_blank');
      },
      openercode(){
        this.$router.push({
          path: '/generateercode'
        })
      },
      userHandler() {

        this.$store.dispatch('SetHuiyiFullCalendarDialog', {
          isShow: true
        }).then(() => {}).catch(() => {

        })
      },
      ProjectChangeHandle(projectID) {
        // console.log("aaa", projectID)
        this.project_list.forEach(optionData => {
          // console.log("optionData", optionData)
          if (optionData.project_id === projectID) {
            Cookies.set('PROJECT_ID', projectID)
            this.org_name = optionData.org_name
            // this.GetOutsysInfo(projectID)
          }
        })
      },
      GetOutsysInfo(project_id) {
        return new Promise((resolve, reject) => {
          this.bim_name_desc = ""
          this.isBindBIM = true
          const param = {
            method: 'get_outsys_info',
            project_id: project_id
          }
          this.$store.dispatch('GetOutsysInfo', param).then((res) => {
            console.log('GetOutsysInfo - res', res, res.access_code === undefined)
            if (res.access_code === undefined || res.access_code === ''){
              this.isBindBIM = false
            }else{
              this.isBindBIM = true
              this.bim_name_desc = `BIM项目：${res.name}`
            }
          })
        })
      },
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "./Navbar";

</style>
