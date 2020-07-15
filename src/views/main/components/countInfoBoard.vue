<style lang="scss">
@import './countInfoBoard';
</style>
<template>
  <div class="count-info-board">
    <!--v-draggable-->
    <div class="data-board">
      <el-row>
        <el-col :span="8">
          <div
            class="grid-content bg-purple link"
            @click="personListDialogHandle"
          >登记总人数：{{projectCount.登记人数}}</div>
        </el-col>
        <el-col :span="8">
          <div
            class="grid-content bg-purple link"
            @click="personNowInDialogHandle"
          >进场总人数：{{projectCount.all_count_in}}</div>
        </el-col>
      </el-row>
      <div v-if="project_id===10000">
        <el-row style="margin: 6px 0px;">
          <el-col :span="8">
            <div
              class="grid-content bg-purple link"
              @click="personListDialogHandle"
            >建 设 单 位：{{projectGroupDict.建设单位.total_in}}</div>
          </el-col>
          <el-col :span="8">
            <div
              class="grid-content bg-purple link"
              @click="personListDialogHandle"
            >监 理 单 位：{{projectGroupDict.监理单位.total_in}}</div>
          </el-col>
        </el-row>
        <el-row style="margin: 6px 0px;">
          <el-col :span="8">
            <div
              class="grid-content info-name link"
              @click="personNowInDialogHandle({'group_names':['项目经理部']})"
            >
              项目经理部：{{projectGroupDict.项目经理部.total_in}}
              <span
                class="info-item-all"
              >/{{projectGroupDict.项目经理部.total_all}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              class="grid-content info-name link"
              @click="personNowInDialogHandle({'group_names':['基础施工班']})"
            >
              基础施工班：{{projectGroupDict.基础施工班.total_in}}
              <span
                class="info-item-all"
              >/{{projectGroupDict.基础施工班.total_all}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              class="grid-content info-name link"
              @click="personNowInDialogHandle({'group_names':['土建施工班']})"
            >
              土建施工班：{{projectGroupDict.土建施工班.total_in}}
              <span
                class="info-item-all"
              >/{{projectGroupDict.土建施工班.total_all}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin: 6px 0px;">
          <el-col :span="8">
            <div
              class="grid-content info-name link"
              @click="personNowInDialogHandle({'group_names':['安装施工班']})"
            >
              安装施工班：{{projectGroupDict.安装施工班.total_in}}
              <span
                class="info-item-all"
              >/{{projectGroupDict.安装施工班.total_all}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              class="grid-content info-name link"
              @click="personNowInDialogHandle({'group_names':['装修施工班']})"
            >
              装修施工班：{{projectGroupDict.装修施工班.total_in}}
              <span
                class="info-item-all"
              >/{{projectGroupDict.装修施工班.total_all}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              class="grid-content info-name link"
              @click="personNowInDialogHandle({'group_names':['特种作业班']})"
            >
              特种作业班：{{projectGroupDict.特种作业班.total_in}}
              <span
                class="info-item-all"
              >/{{projectGroupDict.特种作业班.total_all}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div
              class="grid-content info-name link"
              @click="personNowInDialogHandle({'group_names':['技工施工班']})"
            >
              技工施工班：{{projectGroupDict.技工施工班.total_in}}
              <span
                class="info-item-all"
              >/{{projectGroupDict.技工施工班.total_all}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              class="grid-content info-name link"
              @click="personNowInDialogHandle({'group_names':['临时通行人']})"
            >临时通行人：{{projectGroupDict.临时通行人.total_in}}</div>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="project_id!==10000">
        <el-col v-for="(item,index) in projectGroupList" :key="index" :span="8">
          <div
            class="grid-content info-name link"
            @click="personNowInDialogHandle({'group_names':[item.name]})"
          >
            {{item.name}}:
            <span class="info-item-green">{{item.total_in}}</span>
            <span class="info-item-all" v-if="item.total_all>=0">/{{item.total_all}}</span>
          </div>
        </el-col>
      </el-row>
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
      projectGroupList: [],
      projectGroupDict: {
        建设单位: {
          total_in: 0,
          total_all: 0
        },
        监理单位: {
          total_in: 0,
          total_all: 0
        },
        项目经理部: {
          total_in: 0,
          total_all: 0
        },
        基础施工班: {
          total_in: 0,
          total_all: 0
        },
        土建施工班: {
          total_in: 0,
          total_all: 0
        },
        安装施工班: {
          total_in: 0,
          total_all: 0
        },
        装修施工班: {
          total_in: 0,
          total_all: 0
        },
        特种作业班: {
          total_in: 0,
          total_all: 0
        },
        技工施工班: {
          total_in: 0,
          total_all: 0
        },
        临时通行人: {
          total_in: 0,
          total_all: 0
        }
      }
    }
  },
  computed: {
    project_id() {
      return this.$store.state.project.project_id
    },
    projectCount: {
      get: function() {
        return this.$store.state.project.projectCount
      },
      set: function(newValue) {
        this.$store.state.project.projectCount = newValue
      }
    }
  },
  watch: {
    project_id(curVal, oldVal) {
      if (curVal !== null) {
        this.getProjectCount()
      }
    }
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
        this.$store
          .dispatch('QueryProjectCount', param)
          .then(() => {
            this.setData()
          })
          .catch(() => {})
      }
    },
    setData() {
      // console.log('this.projectCount', this.projectCount)
      this.projectGroupList = []
      const _group = this.projectCount.group
      for (let key in this.projectCount) {
        if (
          key !== 'all_count_in' &&
          key !== 'group' &&
          key !== '登记人数' &&
          key !== '入场人数'
        ) {
          // console.log(key, _group[key])
          let _total_all = -1
          if (_group[key] !== undefined) {
            _total_all = _group[key].all
          }
          this.projectGroupList.push({
            name: key,
            total_in: this.projectCount[key],
            total_all: _total_all
          })
          this.projectGroupDict[key] = {
            name: key,
            total_in: this.projectCount[key],
            total_all: _total_all
          }
        }
      }
      // console.log('this.projectGroupDict', this.projectGroupDict)
    },
    personListDialogHandle() {
      const param = {
        show: true
      }
      this.$store
        .dispatch('SetPersonListDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    personNowInDialogHandle(param) {
      console.log('param', param)
      const _param = {
        show: true,
        ...param
      }
      this.$store
        .dispatch('SetPersonNowInDialog', _param)
        .then(() => {})
        .catch(() => {})
    }
  }
}
</script>
