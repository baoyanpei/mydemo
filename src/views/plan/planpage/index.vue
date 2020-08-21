<style lang="scss">
@import './index';
</style>
<template>
  <div class="planpage-index">
    <div
      class="grid-content bg-purple tjfx-menu"
      style="border-right:0px solid #eeeeee; padding: 10px 5px 5px 10px;"
    >
      <el-row type="flex" class="row-bg">
        <div class="publictitle">
          <a href="javascript:void(0);" v-for="item in this.titlebox" :key="item.tid">
            <div
              class="littletitle"
              :class="{'active':(nowid==item.tid)}"
              @click="planidtran(item.tid)"
            >{{item.name}}</div>
          </a>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'yearsplan',
  data() {
    return {
      titlebox: [],
      nowid: 0,
    }
  },
  computed: {
    project_id() {
      return this.$store.state.project.project_id
    },
    plan_typeid() {
      return this.$store.state.plantypeid.count
    },
  },
  watch: {
    project_id(curVal, oldVal) {
      console.log('curVal', curVal, oldVal)
      this.getplan()
    },
    plan_typeid(curVal, oldVal) {
      this.nowid = curVal
    },
  },
  mounted() {
    if (this.project_id !== null) {
      this.getplan()
    }
  },
  methods: {
    getplan() {
      const param = {
        method: 'plan_type',
        project_id: this.project_id,
      }
      this.$store.dispatch('Getplan', param).then((data) => {
        this.titlebox = data.data
        console.log('this.titlebox1', this.titlebox)
        for (let i = 0; i < this.titlebox.length; i++) {
          if (this.titlebox[i].tid == 6) {
            this.titlebox.splice(i, 1)
          }
        }
        this.nowid = this.titlebox[0].tid

        const _plan_typeid = this.$route.query.plan_typeid
        console.log('_plan_typeid', _plan_typeid)
        if (_plan_typeid !== undefined) {
          this.nowid = _plan_typeid
        }
        console.log('this.nowid1111', this.nowid)
        // console.log('this.titlebox2', this.titlebox)
        let cookiePlayType = Cookies.get('CurrentPlanType')
        if (cookiePlayType !== undefined) {
          this.nowid = parseInt(cookiePlayType)
          if (this.nowid == 1) {
            this.$store.commit('planindexfirstnamefnc', '年计划')
          }
          if (this.nowid == 2) {
            this.$store.commit('planindexfirstnamefnc', '月计划')
          }
          if (this.nowid == 3) {
            this.$store.commit('planindexfirstnamefnc', '周计划')
          }
          if (this.nowid == 4) {
            this.$store.commit('planindexfirstnamefnc', '日计划')
          }
          if (this.nowid == 5) {
            this.$store.commit('planindexfirstnamefnc', '施工组织计划')
          }
          if (this.nowid == 7) {
            this.$store.commit('planindexfirstnamefnc', '施工计划')
          }
          if (this.nowid == 0) {
            this.$store.commit('planindexfirstnamefnc', '其他计划')
          }
        }
      })
    },
    planidtran(index) {
      // this.$store.commit('planidchange', 0)
      if (index == 1) {
        this.$store.commit('planindexfirstnamefnc', '年计划')
      }
      if (index == 2) {
        this.$store.commit('planindexfirstnamefnc', '月计划')
      }
      if (index == 3) {
        this.$store.commit('planindexfirstnamefnc', '周计划')
      }
      if (index == 4) {
        this.$store.commit('planindexfirstnamefnc', '日计划')
      }
      if (index == 5) {
        this.$store.commit('planindexfirstnamefnc', '施工组织计划')
      }
      if (index == 7) {
        this.$store.commit('planindexfirstnamefnc', '施工计划')
      }
      if (index == 0) {
        this.$store.commit('planindexfirstnamefnc', '其他计划')
      }
      this.nowid = index
      Cookies.set('CurrentPlanType', index)
      console.log('this.$route.params', this.$route.name)
      if (this.$route.name == 'indexplan') {
        this.$store.commit('planidchange', index)
      } else {
        this.$router.push({ path: '/indexplan' })
      }
    },
  },
}
</script>
<style>
</style>
<!--不要66666666-->
