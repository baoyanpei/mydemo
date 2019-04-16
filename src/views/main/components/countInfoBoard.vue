<style lang="scss">
  @import "./countInfoBoard";

</style>
<template>
  <div class="count-info-board">
    <!--v-draggable-->
    <div class="data-board">
      <!-- <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple text-center">
            甘肃省建设投资（控股）集团总公司
          </div>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple link" @click="personListDialogHandle">登记总人数：{{projectCount.登记人数}}</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple link" @click="personNowInDialogHandle">进场总人数：{{projectCount.all_count_in}}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-for="(item,index) in projectGroupList" :key="index" :span="8">
          <div class="grid-content info-name link" @click="personNowInDialogHandle({'group_names':[item.name]})">
            {{item.name}}: <span class="info-item-green">{{item.total_in}}</span>
            <span class="info-item-all" v-if="item.total_all>=0">/{{item.total_all}}</span>
          </div>
        </el-col>
        <!-- <el-col :span="8">
          <div class="grid-content info-name">监&nbsp;理&nbsp;&nbsp;单&nbsp;位: <span class="info-item-green">{{projectCount.监理人数}}</span></div>
        </el-col> -->
      </el-row>
      <el-row>
        <!-- <el-col :span="8" :push="0">
          <div class="grid-content info-name">项目经理部: <span class="info-item-green">{{projectCount.项目经理部}}</span><span
              class="info-item-all">/{{projectCount.group.项目经理部.all}}</span></div>
        </el-col>
        <el-col :span="8" :push="0">
          <div class="grid-content info-name">基础施工班: <span class="info-item-green">{{projectCount.基础施工班}}</span><span
              class="info-item-all">/{{projectCount.group.基础施工班.all}}</span></div>
        </el-col>
        <el-col :span="8" :push="0">
          <div class="grid-content info-name">土建施工班: <span class="info-item-green">{{projectCount.土建施工班}}</span><span
              class="info-item-all">/{{projectCount.group.土建施工班.all}}</span></div>
        </el-col>
        <el-col :span="8" :push="0">
          <div class="grid-content info-name">安装施工班: <span class="info-item-green">{{projectCount.安装施工班}}</span><span
              class="info-item-all">/{{projectCount.group.安装施工班.all}}</span></div>
        </el-col>
        <el-col :span="8" :push="0">
          <div class="grid-content info-name">装修施工班: <span class="info-item-green">{{projectCount.装修施工班}}</span><span
              class="info-item-all">/{{projectCount.group.装修施工班.all}}</span></div>
        </el-col>
        <el-col :span="8" :push="0">
          <div class="grid-content info-name">特种作业班: <span class="info-item-green">{{projectCount.特种作业班}}</span><span
              class="info-item-all">/{{projectCount.group.特种作业班.all}}</span></div>
        </el-col>
        <el-col :span="8" :push="0">
          <div class="grid-content info-name">技工施工班: <span class="info-item-green">{{projectCount.技工施工班}}</span><span
              class="info-item-all">/{{projectCount.group.技工施工班.all}}</span></div>
        </el-col>
        <el-col :span="8" :push="0">
          <div class="grid-content info-name">临时通行人: <span class="info-item-green">{{projectCount.临时人员}}</span></div>
        </el-col> -->
      </el-row>

      <!-- <el-row :gutter="24">
        <el-col :span="12" class="text-center">
          <div class="grid-content bg-purple">值班人数：刘亚良</div>
        </el-col>
        <el-col :span="12" class="text-center">
          <div class="grid-content bg-purple">2018年06年25日</div>
        </el-col>
      </el-row> -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'count-info-board',
    directives: {},
    components: {},
    data() {
      return {
        projectGroupList: []
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      projectCount: {
        get: function () {
          return this.$store.state.project.projectCount
        },
        set: function (newValue) {
          this.$store.state.project.projectCount = newValue
        }

      },
    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          this.getProjectCount()
        }
      },
    },
    mounted() {
      this.getProjectCount()
    },
    methods: {
      updateData(data) {
        this.projectCount = data
        this.setData()
      },
      getProjectCount() {
        if (this.project_id !== null) {
          const param = {
            method: 'project_count',
            project_id: this.project_id
          }
          this.$store.dispatch('QueryProjectCount', param).then(() => {

            this.setData()

          }).catch(() => {

          })
        }

      },
      setData() {
        // console.log('this.projectCount', this.projectCount)
        this.projectGroupList = []
        const _group = this.projectCount.group
        for (let key in this.projectCount) {
          if (key !== 'all_count_in' && key !== 'group' && key !== '登记人数' && key !== '入场人数') {
            // console.log(key, _group[key])
            let _total_all = -1
            if (_group[key] !== undefined) {
              _total_all = _group[key].all
            }
            this.projectGroupList.push({
              'name': key,
              'total_in': this.projectCount[key],
              'total_all': _total_all
            })
          }

        }
        // console.log("this.projectGroupList", this.projectGroupList)
      },
      personListDialogHandle() {
        const param = {
          show: true,
        }
        this.$store.dispatch('SetPersonListDialog', param).then(() => {}).catch(() => {

        })
      },
      personNowInDialogHandle(param) {
        console.log('param', param)
        const _param = {
          show: true,
          ...param
        }
        this.$store.dispatch('SetPersonNowInDialog', _param).then(() => {}).catch(() => {

        })
      },
    }
  }

</script>
