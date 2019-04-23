<style lang="scss">
  @import "./dutyForm";

</style>
<template>
  <div id="duty-form" class="duty-form">
    <el-form ref="dustForm" label-width="80px" :inline="true">
      <div class="table-title">值班人员：
        <el-button type="success" class="btnDutySuubmit" :loading="loading" @click.native.prevent="handleMsgSubmit()"
          size="mini">确定修改
        </el-button>
      </div>
      <el-table ref="table1" :data="dutyDataList" :key="Math.random()" border style="width: 100%" size="mini" clearable
        @change="persionChangeHandle" :show-header="true" header-align="center">
        <el-table-column property="weekName" width="90" align="center" label="日期" header-align="center">
        </el-table-column>
        <el-table-column label="值班人1" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="span-link1">
              <el-select v-model="scope.row.person_id1" name="person_id1" filterable placeholder="请选择人员名字" size="mini">
                <el-option v-for="item in optionsProjectPerson" :key="item.person_id" :label="item.name"
                  :value="item.person_id">
                </el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="值班人2" header-align="center" align="center">
          <template slot-scope="scope">
            <span class="span-link1">
              <el-select v-model="scope.row.person_id2" name="person_id2" filterable placeholder="请选择人员名字" size="mini">
                <el-option v-for="item in optionsProjectPerson" :key="item.person_id" :label="item.name"
                  :value="item.person_id">
                </el-option>
              </el-select>
            </span>
          </template>

        </el-table-column>

      </el-table>


    </el-form>
  </div>
</template>

<script>
  import moment from 'moment'
  import lodash from 'lodash'

  import {
    Loading
  } from 'element-ui';
  // import Mock from 'mockjs'
  export default {
    components: {},
    directives: {},
    filters: {

    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      publishDialog: {
        get: function () {
          return this.$store.state.msg.publishDialog
        },
        set: function (newValue) {
          this.$store.state.msg.publishDialog = newValue
        }
      },
    },
    data() {
      return {
        loadingInstance: null,
        loading: false,
        dutyDataList: [{
          weekName: '星期一',

        }, {
          weekName: '星期二',
        }, {
          weekName: '星期三',
        }, {
          weekName: '星期四',
        }, {
          weekName: '星期五',
        }, {
          weekName: '星期六',
        }, {
          weekName: '星期日',
        }],
        optionsProjectPerson: [],
      }
    },
    created: function () {


    },
    watch: {
      publishDialog: {
        handler: function (newVal, oldVal) {
          if (newVal.show === true) {
            this.initData()
            this.getProjectPersons()
          } else {
            this.initData()
          }

        },
        deep: true
      },
    },
    methods: {
      initData() {
        this.optionsProjectPerson = []
        this.dutyDataList.forEach(data => {
          data['person_id1'] = ''
          data['person_id2'] = ''
        });
      },
      getProjectPersons() {
        this.loadingDialog = this.$loading({
          // lock: true,
          // text: '正在读取数据...',
          // spinner: 'el-icon-loading',
          // background: 'rgba(0, 0, 0, 0.5)',
          // customClass: 'loading-class',
          target: document.querySelector('.duty-form')
        });
        const param = {
          method: 'query_person_list',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectPersons', param).then((personList) => {
          //   console.log('personList', personList)
          personList.forEach(person => {
            if (person.person_type === 1 && person.status === 0) {
              this.optionsProjectPerson.push(person)
            }
          });
          //   console.log('this.optionsProjectPerson', this.optionsProjectPerson)
          this.queryDutyWeek()
          // this.loadingInstance.close();

        }).catch(() => {
          // this.loadingDialog.close()
        })
      },
      queryDutyWeek() {
        const param = {
          method: 'query_duty_week',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryDutyWeek', param).then((DutyData) => {
          if (DutyData.status === "success") {
            let _data = DutyData.data
            this.getDayData(_data.day1, 0)
            this.getDayData(_data.day2, 1)
            this.getDayData(_data.day3, 2)
            this.getDayData(_data.day4, 3)
            this.getDayData(_data.day5, 4)
            this.getDayData(_data.day6, 5)
            this.getDayData(_data.day0, 6)
          }
          //   this.optionsProjectPerson = personList
          
          this.$refs.table1.clearSelection()
          this.loadingInstance.close();

        }).catch(() => {
          this.loadingDialog.close()
        })
      },
      getDayData(data, weekIndex) {
        if (data.length === 2) {
          this.dutyDataList[weekIndex].person_id1 = data[0].id
          this.dutyDataList[weekIndex].person_id2 = data[1].id
        } else if (data.length === 1) {
          this.dutyDataList[weekIndex].person_id1 = data[0].id
        }
      },
      getDayDataForSubmit(dutyData, weekIndex) {
        let personId = ''
        let personId1 = dutyData.person_id1
        let personId2 = dutyData.person_id2

        if (personId1 === undefined) {
          personId1 = ''
        }

        if (personId2 === undefined) {
          personId2 = ''
        }

        if (personId1 !== '' && personId2 !== '') {
          personId = `${personId1}|${personId2}`
        } else if (personId1 !== '') {
          personId = `${personId1}`
        } else if (personId2 !== '') {
          personId = `${personId2}`
        }
        return personId
      },
      handleMsgSubmit() {
        this.$confirm('是否确定修改值班人员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          // center: true
        }).then(() => {
          console.log('dutyDataListdutyDataList', this.dutyDataList)


          const param = {
            method: 'update_duty_week',
            project_id: this.project_id,
            day1: this.getDayDataForSubmit(this.dutyDataList[0], 0),
            day2: this.getDayDataForSubmit(this.dutyDataList[1], 1),
            day3: this.getDayDataForSubmit(this.dutyDataList[2], 2),
            day4: this.getDayDataForSubmit(this.dutyDataList[3], 3),
            day5: this.getDayDataForSubmit(this.dutyDataList[4], 4),
            day6: this.getDayDataForSubmit(this.dutyDataList[5], 5),
            day0: this.getDayDataForSubmit(this.dutyDataList[6], 6)
          }
          console.log('paramparam', param)
          this.$store.dispatch('UpdateDutyWeek', param).then((DutyData) => {
            if (DutyData.status === "success") {
              this.$message({
                message: '公告修改成功',
                type: 'success'
              })
            }
          }).catch(() => {

          });
        }).catch(() => {

        });
      },
      persionChangeHandle(value, ddd) {
        console.log('persionChangeHandle', value, ddd)
        if (value !== '') {

          let _person = {};
          _person = this.optionsProjectPerson.find((item) => { //这里的userList就是上面遍历的数据源
            return item.person_id === value; //筛选出匹配数据
          });
          //   this.personInoutForm.person_name = _person.name
          // console.log('_person', _person)
          // console.log(_person.name); //我这边的name就是对应label的
        } else {
          //   this.personInoutForm.person_name = ''
        }

      },
    },
    mounted() {
      this.getProjectPersons()
    }
  }

</script>
