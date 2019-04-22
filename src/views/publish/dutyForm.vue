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
      <el-table :data="dutyDataList" border style="width: 100%" size="mini" :show-header="true" header-align="center">
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
          this.optionsProjectPerson = personList
            this.loadingInstance.close();
          
        }).catch(() => {
            this.loadingDialog.close()
        })
      },
      handleMsgSubmit() {
        this.$confirm('是否确定修改值班人员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          // center: true
        }).then(() => {
          console.log('dutyDataListdutyDataList', this.dutyDataList)

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
      console.log('mount1111')
      this.getProjectPersons()
    }
  }

</script>
