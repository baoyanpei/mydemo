<style lang="scss">
  @import "./tasks.scss";

</style>

<template>
  <div class="screen-tasks">
    <div v-for="(item, i) in AllInstList" class="task-item">
      <div class="task-left">
        <img class="task-img" v-bind:src="item.imgSrc">
      </div>
      <div class="task-right">
        <div class="task-detail1">
          <div class="task-title">
            {{item.title}}
          </div>
          <div class="task-status">
            <span v-if="item.nodeId === 'Node2'" class="node2">待认领</span>
            <span v-if="item.nodeId === 'Node3'" class="node3">待处理</span>
            <span v-if="item.nodeId === 'Node5'" class="node5">待质检</span>
            <span v-if="item.nodeId === 'Node1' || item.nodeId === 'End4' || item.nodeId === undefined" class="node1">已完成</span>
          </div>
        </div>


        <div class="task-detail2">
          <div class="task-type" v-html='item.typeDesc'></div>
          <div class="task-creator">
            发起人：{{item.creatorName}}
          </div>
          <div class="task-time">
            {{item.sendTime}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import lodash from 'lodash'
  import moment from 'moment'
  export default {
    components: {},
    data() {
      return {
        project_id: null,
        AllInstList: [],
        typecolor: {
          "安全类": ["#EEB422"],
          "安全": ["#EEB422"],
          "质量": ["#00CD66"],
          "技术": ["#0000CD"],
          "施工": ["#388E8E"],
          "资料": ["#8B4513"],
          "财务": ["#CD3333"],
          "物资": ["#8968CD"],
          "劳务": ["#838B8B"],
          "法务": ["#262626"],
          "预算": ["#00E5EE"],
          "综合": ["#CDB79E"],
          "平台技术": ["#00B2EE"]
        },

      }
    },
    props: {

    },
    computed: {

    },
    created() {

    },
    watch: {

    },
    mounted() {
      // this.getVehicleGateData()
      // this.refreshData()
    },
    destroyed() {

    },
    methods: {
      async init(project_id) {
        this.project_id = project_id


        await this.getAllInstList()
        this.refreshData()

      },
      refreshData() {
        setTimeout(async () => {
          await this.getAllInstList()
          this.refreshData()
          // console.log('getVehicleGateData')
        }, 60 * 1000)
      },
      getInProgressInstList() {
        return new Promise((resolve, reject) => {
          let param = {
            method: 'get_all_inst_list',
            project_id: this.project_id,
            page: 1,
            limit: 300,
            qtype: 'inProgress',
            flow_id: 'ProblemFindSolve01'
          }

          this.$store.dispatch('GetAllInstList', param).then((InProgressList) => {
            // console.log('InProgressList', InProgressList)
            resolve(InProgressList)
          }).catch(() => {
            //   this.loading = false
          })

        })

      },
      getHasDoneInstList() {
        return new Promise((resolve, reject) => {
          let param = {
            method: 'get_all_inst_list',
            project_id: this.project_id,
            page: 1,
            limit: 30,
            qtype: 'hasDone',
            flow_id: 'ProblemFindSolve01'
          }

          this.$store.dispatch('GetAllInstList', param).then((HasDoneList) => {
            // console.log('HasDoneList', HasDoneList)
            resolve(HasDoneList)
          }).catch(() => {
            //   this.loading = false
          })

        })

      },
      getAllInstList() {
        return new Promise(async (resolve, reject) => {

          let _InProgressInstData = await this.getInProgressInstList()
          let _getHasDoneInstData = await this.getHasDoneInstList()
          console.log('_InProgressInstData', _InProgressInstData)
          console.log('_getHasDoneInstData', _getHasDoneInstData)
          this.AllInstList = []
          if (_InProgressInstData.count > 0) {
            this.AllInstList = [...this.AllInstList, ..._InProgressInstData.data]
          }
          if (_getHasDoneInstData.count > 0) {
            this.AllInstList = [...this.AllInstList, ..._getHasDoneInstData.data]
          }
          this.AllInstList = lodash.orderBy(this.AllInstList, ['sendTime'], ['desc']);
          if (this.AllInstList.length > 3) {
            this.AllInstList.splice(3)
          }
          this.AllInstList.forEach(item => {
            let _imgSrc = `https://buskey.cn/api/oa/workflow/thumbnail.jpg?work_id=${item.workId}&w=250`
            item['imgSrc'] = _imgSrc
            let _typeColor = this.typecolor[item.questions_type][0]
            item['typeDesc'] =
              `<span style='background-color:${_typeColor}'>${item.questions_type}</span>`
          })
          console.log('this.AllInstList', this.AllInstList)
          resolve()
        })

      },
    },

  }

</script>
