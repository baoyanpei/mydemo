<style lang="scss">
  @import "./inout.scss";

</style>

<template>
  <div class="screen-inout">
    <div style="width: 390px;">
      <el-table class="screen-inout-table" ref="personInoutTable1" stripe :data="personInoutList" height="215px"
        :empty-text="personInoutTableEmptyText" style="width:100%" size="mini" :show-header="true"
        :default-sort="{prop: 'group_name_level[0]', order: 'descending'}" :row-class-name="tableRowClassName">

        <el-table-column property="name" label="姓名" width="120" align="center" header-align="center">
        </el-table-column>
        <!-- <el-table-column property="mobile" label="电话" width="100" header-align="center">
              </el-table-column> -->
        <el-table-column property="group_name_level[0]" label="部门" header-align="left">
        </el-table-column>
        <el-table-column property="group_name_level[1]" label="班组" header-align="left">
        </el-table-column>
      </el-table>
    </div>


  </div>
</template>
<script>
  import lodash from 'lodash'
  export default {
    components: {},
    data() {
      return {
        project_id: 10000,
        // loading: false,
        personInoutTableEmptyText: '正在查询',
        personInoutList: [],
        personNowInDataList: [],
        checkedPersonType: false, //false 只有项目部
        singleHeight: 35,
        currentScroll: 0,
        timeoutScroll: null
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
      this.refreshData()
    },
    destroyed() {

    },
    methods: {
      getProjectPersonInout() {
        clearTimeout(this.timeoutScroll)
        this.$refs.personInoutTable1.bodyWrapper.scrollTop = 0
        this.personNowInDataList = []
        this.loading = true
 
        this.personNowInMap = new Map()
        this.personNowInMapList = []
        let param = {
          method: 'query_person_inout',
          project_id: this.project_id,
          in_status: 1,
          // bt:this.personNowinDialog.bt,
          // et:this.personNowinDialog.et
        }

        // this.personNowInList = []
        this.totalPerson = 0
        this.$store.dispatch('QueryProjectPersonNowIn', param).then((personNowInDataList) => {
          // personNowInDataList = personNowInDataList.concat(personNowInDataList)

          let totalPerson = personNowInDataList.length
          personNowInDataList.forEach(item => {
            this.personNowInDataList.push(item)
          })
          if (totalPerson > 5) {
            for (let i = 0; i < 5; i++) {
              this.personNowInDataList = this.personNowInDataList.concat(this.personNowInDataList)
            }
          }
          this.$emit('inoutTotalPerson', totalPerson)
          this.personInoutList = this.personNowInDataList
          if (this.personInoutList.length > 5) {
            setTimeout(() => {
              this.currentScroll = 0
              this.scrollTable()
            }, 5000) //120秒
          }


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
      },
      refreshData() {
        setTimeout(() => {
          this.getProjectPersonInout()
          this.refreshData()
        }, 60 * 1000) //120秒
      },
      scrollTable() {

        // console.log('scrollHeight', this.$refs.personInoutTable1.bodyWrapper.scrollHeight)
        // console.log('scrollTop', this.$refs.personInoutTable1.bodyWrapper.scrollTop, )

        let _scrollTop = this.singleHeight * this.personInoutList.length - this.singleHeight * 5
        // console.log('_scrollTop', _scrollTop, this.$refs.personInoutTable1.bodyWrapper.scrollTop, this.$refs
          // .personInoutTable1.bodyWrapper.scrollHeight)
        if (this.$refs.personInoutTable1.bodyWrapper.scrollTop >= _scrollTop - 5) {

          this.timeoutScroll = setTimeout(() => {
            this.$refs.personInoutTable1.bodyWrapper.scrollTop = 0

            this.timeoutScroll = setTimeout(() => {
              this.currentScroll = 0
              this.scrollTable()
            }, 5000) //120秒

          }, 5000) //120秒
        } else {
          this.$refs.personInoutTable1.bodyWrapper.scrollTop += 5

          this.currentScroll = this.currentScroll + 5
          if (this.currentScroll >= this.singleHeight * 5) {
            this.timeoutScroll = setTimeout(() => {
              this.currentScroll = 0
              this.scrollTable()
            }, 5000) //120秒
          } else {
            this.timeoutScroll = setTimeout(() => {
              this.scrollTable()
            }, 50) //120秒
          }
        }



      }
    },

  }

</script>
