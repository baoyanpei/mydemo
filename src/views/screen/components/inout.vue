<style lang="scss">
  @import "./inout.scss";

</style>

<template>
  <div class="screen-inout">
    <el-table class="screen-inout-table" ref="personInoutTable" stripe v-loading="loading" :data="personInoutList" height="350px"
      :empty-text="personInoutTableEmptyText" style="width: 100%" size="mini" :show-header="true" header-align="center"
      :default-sort="{prop: 'group_name_level[0]', order: 'descending'}" :row-class-name="tableRowClassName">
      <el-table-column type="index" label="序号" >
      </el-table-column>
      <el-table-column property="name" label="姓名" header-align="left">
      </el-table-column>
      <!-- <el-table-column property="mobile" label="电话" width="100" header-align="center">
        </el-table-column> -->
      <el-table-column property="group_name_level[0]" label="部门" header-align="center">
      </el-table-column>
      <el-table-column property="group_name_level[1]" label="专业" header-align="center">
      </el-table-column>
      <el-table-column property="group_name_level[1]" label="工种" header-align="center">
      </el-table-column>
      <!-- <el-table-column property="countDay" sortable label="统计天数" width="100" align="center" header-align="center">
          <template slot-scope="scope">
            <span class="span-link1" @click="handleInDayClick(scope.row)">
              {{scope.row.countDay}}
            </span>
          </template>
        </el-table-column> -->
    </el-table>
  </div>
</template>
<script>
  import lodash from 'lodash'
  export default {
    components: {},
    data() {
      return {
        project_id: 10000,
        loading: false,
        personInoutTableEmptyText: '请点击查询按钮进行查询',
        personInoutList: [],
        checkedPersonType: false, //false 只有项目部
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
      this.getProjectPersonInout()
    },
    destroyed() {

    },
    methods: {
      getProjectPersonInout() {
        console.log('personNowinDialog', this.personNowinDialog)
        this.loading = true
        // this.loadingDialog = this.$loading({
        //   // lock: true,
        //   // text: '正在读取数据...',
        //   // spinner: 'el-icon-loading',
        //   // background: 'rgba(0, 0, 0, 0.5)',
        //   // customClass: 'loading-class',
        //   target: document.querySelector('.nowin-dialog')
        // });
        this.personNowInMap = new Map()
        this.personNowInMapList = []
        let param = {
          method: 'query_person_inout',
          project_id: this.project_id,
          in_status: 1,
          // bt:this.personNowinDialog.bt,
          // et:this.personNowinDialog.et
        }

        this.personNowInList = []
        this.totalPerson = 0
        this.$store.dispatch('QueryProjectPersonNowIn', param).then((personNowInDataList) => {
          personNowInDataList.forEach(item => {
            this.personInoutList.push(item)
          })
          this.personInoutList = lodash.chunk(this.personInoutList, 8)[0]
          //   this.totalPerson = this.personNowInList.length;
          this.loading = false
          //   this.loadingDialog.close()
          // console.log('this.personInoutList', this.personInoutList)
        }).catch(() => {
          this.loading = false
        })
      },

      tableRowClassName({
        row,
        rowIndex
      }) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    },

  }

</script>
