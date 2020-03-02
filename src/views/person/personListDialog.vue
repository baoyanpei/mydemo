<style lang="scss">
  @import "./personListDialog";

  @font-face {
    font-family: 'icomoon';
    src: url('fonts/icomoon.eot?fwubr6');
    src: url('fonts/icomoon.eot?fwubr6#iefix') format('embedded-opentype'),
      url('fonts/icomoon.ttf?fwubr6') format('truetype'),
      url('fonts/icomoon.woff?fwubr6') format('woff'),
      url('fonts/icomoon.svg?fwubr6#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }

  [class^="icon-"],
  [class*=" icon-"] {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: 'icomoon' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;

    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .icon-credentials_icon:before {
    content: "\e900";
  }

  .icon-jishu:before {
    content: "\e901";
  }

  .icon-hetong:before {
    content: "\e902";
  }

  .icon-qiapian .path1:before {
    content: "\e903";
    color: rgb(68, 68, 68);
  }

  .icon-qiapian .path2:before {
    content: "\e904";
    margin-left: -1em;
    color: rgb(68, 68, 68);
  }

  .icon-qiapian .path3:before {
    content: "\e905";
    margin-left: -1em;
    color: rgb(0, 216, 160);
  }

  .icon-shiti:before {
    content: "\e906";
  }

  .icon-geren:before {
    content: "\e907";
  }

  .icon-anquandunpai:before {
    content: "\e908";
  }

  .icon-anquan:before {
    content: "\e909";
  }

  .iconred {
    color: red;
  }

</style>
<template>
  <el-dialog :modal="true" width="1105px" top="1vh" :lock-scroll="true" :append-to-body="true"
    :close-on-click-modal="false" @open="openPersonListDialogHandle" @close="closediv"
    :visible.sync="personListDialog.show" title="人员信息" v-dialogDrag>
    <div id="person-list-from" class="person-list-from">
      <el-form ref="personInoutForm" :model="personInoutForm" label-width="80px" :inline="true">
        <div>
          <el-form-item prop="GroupList" label="部门">
            <el-cascader placeholder="请选择部门" @change="groupChangeHandle" v-model="personInoutForm.GroupList"
              :options="optionGroups" filterable change-on-select size="mini">
            </el-cascader>
            <el-tooltip placement="right">
              <div slot="content">外部单位包括：<br />建设单位代表、监理单位代表、VIP等
                <br />不选择此项则只包含项目部人员
              </div>
              <el-checkbox v-model="checkedPersonType" style="margin-left:10px; ">
                包括外部单位
              </el-checkbox>
            </el-tooltip>
          </el-form-item>

          <el-form-item prop="person_id" label="人员姓名">
            <el-select v-model="personInoutForm.person_id" name="person_id" @change="persionChangeHandle" clearable
              placeholder="请填写人员名字（可选）" filterable size="mini">
              <el-option v-for="item in optionsProjectPersion" :key="item.person_id" :label="`${item.name}`"
                :value="item.person_id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <!--<el-form-item prop="lackid" label="缺失资料">-->
          <!--<el-select v-model="lackdata.value" name="value" placeholder="请选择缺少资料（可多选）"  filterable @change="handleSubmit(false)" clearable size="mini">-->
          <!--<el-option v-for="item in lackdata" :key="item.value" :label="item.label"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->

          <el-form-item prop="lackid" label="个人资料">
            <!--personInoutList-->
            <!--<el-cascader :options="lackdata" ref="cascaderAddr" :props="props" v-model="lackdatavalue" @change="titlechange()" collapse-tags></el-cascader>-->
            <el-cascader :options="lackdata" ref="cascaderAddr" :props="props" v-model="lackdatavalue"
              @change="handleSubmit(false)" collapse-tags size="mini"></el-cascader>
          </el-form-item>

          <el-form-item>
            <el-button type="success" :loading="loading" icon="el-icon-search"
              @click.native.prevent="handleSubmit(false)" size="mini">查询</el-button>

            <el-dropdown @command="handleExpertAllSubmit" trigger="click">
              <el-button type="success" size="mini" icon="el-icon-download">
                导出全部<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="ryxx">人员信息</el-dropdown-item>
                <el-dropdown-item command="jkzt">健康状态</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button type="success" :loading="loading" icon="el-icon-download"
              @click.native.prevent="handleSubmit(true)" size="mini">导出人员信息</el-button> -->
            <!-- <el-button type="success" :loading="loading" icon="el-icon-download"
              @click.native.prevent="handleExpertHealthSubmit()" size="mini">导出健康状态</el-button> -->
            <el-dropdown @command="handleExpertPersonSubmit" trigger="click">
              <el-button type="success" size="mini" icon="el-icon-download">
                导出个人<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="jkzt">健康状态</el-dropdown-item>
                <el-dropdown-item command="cwjl">测温记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </div>


      </el-form>
      <!-- <hr class="hr1" /> -->
      <span class="table-title">人员名单</span><span class="table-total">共 {{ totalPerson }} 人</span>
      <hr class="hr1" />
      <el-table ref="personInoutTable" v-loading="loading" :data="personInoutList" height="420px"
        @selection-change="handlePersonListSelectionChange" :empty-text="personInoutTableEmptyText"
        highlight-current-row @row-click="handleRowClick" style="width: 100%" size="mini" :show-header="true"
        header-align="center" :default-sort="{prop: 'name', order: 'ascending'}">
        <el-table-column label="基本信息">
          <el-table-column type="selection" width="30">
          </el-table-column>
          <el-table-column type="index" width="35">
          </el-table-column>
          <el-table-column property="name" sortable align="center" label="姓名" width="80" header-align="center">
            <template slot-scope="scope">
              <el-button @click="handleNameClick(scope.row)" type="text" size="small">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column property="" align="center" sortable label="资料" width="150" header-align="center">
            <template slot-scope="scope">
              <!--八种缺少的资料 datum_uploaded-->
              <el-button type="text" size="small" class="datum_uploaded_button">
                <!--<span>{{scope.row.datum_uploaded}}</span>-->
                <!--{{Math.pow(2,8)&parseInt(scope.row.datum_uploaded,2)>0}}-->
                <i title="入职照片" class="icon-geren"
                  :class="{'redicon':(Math.pow(2,8)&parseInt(scope.row.datum_uploaded,2))>0}"></i>
                <i title="身份证扫描件" class="icon-credentials_icon"
                  :class="{'redicon':(Math.pow(2,7)&parseInt(scope.row.datum_uploaded,2))>0}"></i>
                <i title="健康信息">
                  <font-awesome-icon icon="stethoscope" style="color:#c7c7c7"
                    :class="{'redicon':(Math.pow(2,9)&parseInt(scope.row.datum_uploaded,2))>0}" />
                </i>

                <i title="安全责任书" class="icon-anquandunpai"
                  :class="{'redicon':(Math.pow(2,6)&parseInt(scope.row.datum_uploaded,2))>0}"></i>
                <i title="劳动合同" class="icon-hetong"
                  :class="{'redicon':(Math.pow(2,5)&parseInt(scope.row.datum_uploaded,2))>0}"></i>
                <i title="安全交底" class="icon-anquan"
                  :class="{'redicon':(Math.pow(2,4)&parseInt(scope.row.datum_uploaded,2))>0}"></i>
                <i title="技术交底" class="icon-jishu"
                  :class="{'redicon':(Math.pow(2,3)&parseInt(scope.row.datum_uploaded,2))>0}"></i>
                <i title="三级安全教育记录卡" class="icon-shiti"
                  :class="{'redicon':(Math.pow(2,2)&parseInt(scope.row.datum_uploaded,2))>0}"></i>
                <i title="考试试题及结果" class="el-icon-tickets"
                  :class="{'redicon':(Math.pow(2,1)&parseInt(scope.row.datum_uploaded,2))>0}"></i>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column property="mobile" align="center" label="电话" width="90" header-align="center">
          </el-table-column>
          <el-table-column property="group_name_level[0]" align="center" sortable label="部门" width="80"
            header-align="center">
          </el-table-column>
          <el-table-column property="group_name_level[1]" align="center" sortable label="班组" width="90"
            header-align="center">
          </el-table-column>
          <el-table-column property="project_pos_name" align="center" sortable label="工种" width="70"
            header-align="center">
          </el-table-column>
          <el-table-column property="education" align="center" sortable label="学历" width="70" header-align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="健康信息">
          <el-table-column property="" align="center" label="当前体温" width="70" header-align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.healthDayLastInfo !== ''" class="healthText"
                @click="SetHealthDayLogDialog(scope.row)">
                <div v-if="parseFloat(scope.row.healthDayLastInfo.max_temp)>=37.3" class="redFont">
                  {{scope.row.healthDayLastInfo.max_temp}}</div>
                <div v-if="parseFloat(scope.row.healthDayLastInfo.max_temp)<37.3">
                  {{scope.row.healthDayLastInfo.max_temp}}</div>
              </div>
              <div v-if="scope.row.healthDayLastInfo === ''" class="healthText">
                <el-button size="mini" type="primary" class="btn-health-day-last"
                  @click.native.prevent="handlePersonHealthDaySubmit(scope.row)">
                  记录体温
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="" align="center" label="疫区旅居史" width="70" header-align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.healthInfo !== ''" @click="openPersonHealthDialogHandle(scope.row)"
                class="healthText">
                <div v-if="scope.row.healthInfo.travel_in_hb === 1" class="redFont">有</div>
                <div v-if="scope.row.healthInfo.travel_in_hb === 0">无</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="" align="center" label="接触疫区人员" width="80" header-align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.healthInfo === ''">
                <el-button size="mini" type="primary" class="btn-health"
                  @click="openPersonHealthDialogHandle(scope.row)">
                  登记健康情况
                </el-button>
              </div>
              <div v-if="scope.row.healthInfo !== ''" @click="openPersonHealthDialogHandle(scope.row)"
                class="healthText">
                <div v-if="scope.row.healthInfo.contact_hb === 1" class="redFont">有</div>
                <div v-if="scope.row.healthInfo.contact_hb === 0">无</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="" align="center" label="干咳等症状" width="70" header-align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.healthInfo !== ''" @click="openPersonHealthDialogHandle(scope.row)"
                class="healthText">
                <div v-if="scope.row.healthInfo.symptom === 1" class="redFont">有</div>
                <div v-if="scope.row.healthInfo.symptom === 0">无</div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <!--<el-table-column property="created_time" sortable align="left" label="入职时间" width="120" header-align="center">-->
        <!--<template slot-scope="scope">-->
        <!--{{trantime(scope.row.created_time)}}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column property="status" sortable align="center" label="人员状态" width="100" header-align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<span v-html="statusName(scope.row,true)"></span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleOperClick(scope.row)">操作</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import lodash from 'lodash'
  import {
    getGroupFromGroupsByGroupID
  } from '@/utils/project'
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
      projectGroupList() {
        return this.$store.state.project.projectGroupList
      },
      personListDialog: {
        get: function () {
          return this.$store.state.project.personListDialog
        },
        set: function (newValue) {
          this.$store.state.project.personListDialog = newValue
        }
      },
      projectPersonList: {
        // return this.$store.state.project.projectPersonList
        get: function () {
          return this.$store.state.project.projectPersonList
        },
        set: function (newValue) {
          this.$store.state.project.projectPersonList = newValue
        }
      },
      personListChanged() {
        return this.$store.state.project.personListChanged
      },
      personHealthDayChanged() {
        return this.$store.state.health.personHealthDayChanged
      }
    },
    data() {
      return {
        loadingInstance: null,
        loading: false,
        optionGroups: [], //部门选择的数据
        optionsProjectPersion: [],
        lackdatavalue: [],
        personinto2: [],
        props: {
          multiple: true
        },
        lackdata: [{
            value: '99',
            label: '全选'
          },
          {
            value: '8',
            label: '入职照片'
          }, {
            value: '7',
            label: '身份证扫描件'
          },
          {
            value: '9',
            label: '健康信息'
          }, {
            value: '1',
            label: '安全责任书'
          },
          {
            value: '2',
            label: '劳动合同'
          }, {
            value: '3',
            label: '安全交底'
          }, {
            value: '4',
            label: '技术交底'
          }, {
            value: '5',
            label: '三级安全教育记录卡'
          },
          {
            value: '6',
            label: '考试试题及结果'
          }
        ],
        value: '',
        personInoutList: [],
        personInoutForm: {
          GroupList: ['all'], // 计划名称
          person_id: '', // 人员
          person_name: '',
          datum_uploaded: ''
        },
        isMatchPerson: false, // 是否匹配人员名称
        personInoutTableEmptyText: '请点击查询按钮进行查询',
        checkedPersonType: false, //false 只有项目部
        totalPerson: 0,
        personHealthMap: new Map(),
        personHealthDayLastMap: new Map(),
        selectedPersonList: [] // 被选中的人员列表
        // list: []
      }
    },
    created: function () {


    },
    watch: {
      loading(curVal, oldVal) {
        if (curVal === false) {} else {

        }
      },
      personListDialog: {
        handler: function (newVal, oldVal) {
          // console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            // console.log('personListDialog - show')
            this.initData()
            this.getProjectGroups()
            this.getProjectPersons()

            this.getProjectPersonInout(false)
          } else {
            this.initData()
          }

        },
        deep: true
      },
      personListChanged(curVal, oldVal) {
        this.handleSubmit(false)
      },
      personHealthDayChanged(curVal, oldVal) {
        this.handleSubmit(false)
      }

    },
    methods: {
      titlechange() {
        this.personInoutList = []
        this.handleSubmit(false)
      },
      trantime: (time) => {
        return moment(time).format('YYYY-MM-DD')
      },
      statusName: (data, isHTML) => {
        // 人员状态 0正常2辞职4开除10是默认值
        let status = data.status
        let _statusName = ''
        switch (status) {
          case 0:
            _statusName = '正常'
            if (data.rfid_wg === '') {
              _statusName = "未开卡"
            }
            if (isHTML) {
              if (data.rfid_wg === '') {
                _statusName = '<span class="statu2">' + _statusName + '</span>'
              } else {
                _statusName = '<span class="statu0">' + _statusName + '</span>'
              }
            }
            break;
          case 2:
            _statusName = '辞职'
            if (isHTML) {
              _statusName = '<span class="statu2">' + _statusName + '</span>'
            }
            break;
          case 4:
            _statusName = '开除'
            if (isHTML) {
              _statusName = '<span class="statu4">' + _statusName + '</span>'
            }
            break;
          case 10:
            _statusName = ''
            break;
          default:
            _statusName = status
            break
        }
        return _statusName
      },
      initData() {
        this.personInoutList = []
        this.totalPerson = 0

        this.optionGroups = [] //部门选择的数据
        this.optionsProjectPersion = []
        this.personInoutForm = {
          GroupList: ['all'], // 计划名称
          person_id: '', // 人员
          person_name: '',
        }
      },
      getProjectPersons() {
        const param = {
          method: 'query_person_list',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectPersons', param).then(() => {
          console.log("所有人员全部信息", this.projectPersonList)
          this.optionsProjectPersion = this.projectPersonList
          this.loadingInstance.close();
        }).catch(() => {

        })
      },
      getProjectGroups() {
        const param = {
          method: 'query_group',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectGroups', param).then(() => {
          // console.log('this.projectGroupList1', this.projectGroupList)
          this.appendGroupData()
        }).catch(() => {

        })
      },
      // 健康记录查询
      getPersonHealthList() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'person_health_list',
            project_id: this.project_id,
            page: 1,
            limit: 10000
          }
          this.$store.dispatch('GetPersonHealthList', param).then((personHealthList) => {
            // console.log("健康记录查询", personHealthList)
            // this.optionsProjectPersion = this.projectPersonList
            // this.loadingInstance.close();
            resolve(personHealthList)
          }).catch(() => {

          })

        })
      },
      // 健康记录温度查询
      getPersonHealthDayLastList() {
        return new Promise((resolve, reject) => {
          const startTime = moment().add('day', 0).format('YYYY-MM-DD 00:00:00')
          const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
          console.log(startTime, endTime)
          const param = {
            method: 'person_health_day_last_list',
            project_id: this.project_id,
            page: 1,
            limit: 10000,
            bt: startTime,
            et: endTime
          }
          this.$store.dispatch('GetPersonHealthDayLastList', param).then((HealthDayLastList) => {
            // console.log("GetPersonHealthDayList", personHealth)
            // this.optionsProjectPersion = this.projectPersonList
            // this.loadingInstance.close();
            resolve(HealthDayLastList)
          }).catch(() => {

          })

        })
      },
      download(blobUrl, filename) {
        var a = document.createElement('a');
        if (a.click) {
          a.href = blobUrl;
          a.target = '_parent';
          if ('download' in a) {
            a.download = filename;
          }
          (document.body || document.documentElement).appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
        } else {
          if (window.top === window && blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
            var padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
            blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
          }
          window.open(blobUrl, '_parent');
        }
      },
      getPersonHealthExcel() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'person_health_excel',
            project_id: this.project_id,
            t: 'url'
          }
          this.$store.dispatch('GetPersonHealthExcel', param).then((res) => {
            console.log('res', res)
            if (res.status === "success") {
              console.log('res', res.url)
              this.download(res.url, 'downlod')
            }
            // 二进制流的方式
            /*
            const link = document.createElement('a')
            let blob = new Blob([res], {
              type: 'application/vnd.ms-excel'
            });
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob);
            let num = ''
            for (let i = 0; i < 10; i++) {
              num += Math.ceil(Math.random() * 10)
            }
            link.setAttribute('download', '劳务作业人员健康信息登记表.xlsx')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            */
          }).catch(() => {

          })

        })
      },
      async getProjectPersonInout(isExport) {
        const personHealthList = await this.getPersonHealthList()

        this.personHealthMap = new Map()
        personHealthList.forEach(personHealth => {
          this.personHealthMap.set(personHealth.person_id, personHealth)
        })

        const personHealthDayLastList = await this.getPersonHealthDayLastList()
        console.log('personHealthDayLastList123', personHealthDayLastList)
        this.personHealthDayLastMap = new Map()
        personHealthDayLastList.forEach(personHealth => {
          this.personHealthDayLastMap.set(personHealth.person_id, personHealth)
        })

        this.personInoutList = []
        this.loading = true
        const param = {
          method: 'query_person_list',
          project_id: this.project_id,
        }
        this.$store.dispatch('QueryProjectPersons', param).then((personList) => {
          // this.lackdatavalue=[]
          this.personInoutList = []
          personList.forEach(item => {
            let groupMatch = []
            if (this.personInoutForm.GroupList[0] === 'all') {
              this.checkPerson(item)
            } else if (this.personInoutForm.GroupList.length === 1) {
              groupMatch = lodash.intersection(item.group_id_level, this.personInoutForm.GroupList)
              if (groupMatch.length > 0) {
                this.checkPerson(item)
              }
            } else if (this.personInoutForm.GroupList.length > 1) {
              groupMatch = lodash.intersection(item.group_id_level, this.personInoutForm.GroupList)
              const groupMatch2 = lodash.union(item.group_id_level, this.personInoutForm.GroupList)
              if (groupMatch.length === groupMatch2.length) {
                this.checkPerson(item)
              }
            }
          })
          // console.log('lackdata.lackid',this.lackdata.value)//进行对资料的筛选
          this.personchange()

          this.totalPerson = this.personInoutList.length;
          this.loading = false
          if (this.personInoutList.length === 0) {
            this.personInoutTableEmptyText = "没有查询到符合条件的数据，请更换条件后再进行查询"
          }


          // this.persionChangeLackdata()
          if (isExport === true) {
            this.exportExcelSubmit()
          }
          // console.log('this.personInoutList', this.personInoutList)
        }).catch(() => {
          this.loading = false
        })
      },
      checkPerson(person) {
        // console.log('person', person)
        this.isMatchPerson = false
        if (this.personInoutForm.person_id !== '') {
          if (person.person_id.toString() === this.personInoutForm.person_id.toString()) {
            this.isMatchPerson = true
          }
        } else {
          this.isMatchPerson = true
        }
        if (this.checkedPersonType === false) { // 不显示外部单位 只显示项目部，就是persontype=1的
          //person_type 账号类型 1项目部2建设单位代表3监理单位代表,4VIP
          if (person.person_type !== 1) {
            this.isMatchPerson = false
          }
        }
        if (this.isMatchPerson === true) {
          // person.datum_uploaded = "10101010"

          const _personHealth = this.personHealthMap.get(person.person_id)
          // console.log('_personHealth', _personHealth)
          if (_personHealth !== undefined) {
            person['healthInfo'] = _personHealth
            // console.log('person', person)
          } else {
            person['healthInfo'] = ''
          }
          const _personHealthDayLast = this.personHealthDayLastMap.get(person.person_id)
          if (_personHealthDayLast !== undefined) {
            person['healthDayLastInfo'] = _personHealthDayLast
            // console.log('person', person)
          } else {
            person['healthDayLastInfo'] = ''
          }

          this.personInoutList.push(person)
          this.personinto2.push(person)
        }




      },
      // 打开窗口
      openPersonListDialogHandle() {
        //打开窗口的mask
        // this.loadingInstance = Loading.service({
        //   // fullscreen: true,
        //   target: '#person-list-from'
        // });

      },
      //关闭窗口
      closediv() {
        console.log("关闭窗口成功")
        this.personinto2 = []
        this.lackdatavalue = []
        this.personInoutList = []
      },
      appendGroupData() {
        console.log("this.projectGroupList.group", this.projectGroupList.group)
        const rootGroup = this.projectGroupList.group
        this.optionGroups = []
        // console.log("teim", item)
        this.optionGroups.push({
          label: '所有部门',
          value: 'all'
        })
        if (rootGroup !== undefined && rootGroup.length > 0) {
          //1为管理部门 0为施工部门3为建设单位4为监理单位5为外部单位 grouptype类型说明,并且做了筛选这部操作
          // console.log("item.group.groups_type", item.group)
          rootGroup.forEach(item1 => {
            if (item1.groups_type === 0 || item1.groups_type === 1 || item1.groups_type === 10) {
              // console.log('item1', item1)
              let children = []
              if (item1.group !== undefined && item1.group.length > 0) {
                item1.group.forEach(item2 => {
                  children.push({
                    label: `${item2.group_name}`,
                    value: item2.id,
                    // children: []
                  })
                })

              }
              this.optionGroups.push({
                label: `${item1.group_name}`,
                value: item1.id,
                children: children
              })
            }
          });
        }
        // console.log("this.optionGroups", this.optionGroups)
      },
      handleSubmit(isExport) {
        this.personInoutList = []
        this.totalPerson = 0
        this.getProjectPersonInout(isExport)

      },
      exportExcelSubmit() {
        let filename = '人员信息'
        if (this.personInoutForm.GroupList[0] !== 'all') {
          if (this.personInoutForm.GroupList.length === 1) {
            let group0 = getGroupFromGroupsByGroupID(this.projectGroupList, this.personInoutForm.GroupList[0])
            // console.log('group0_name',group0_name)
            filename = `${filename}_${group0.group_name}`
          } else {
            let group0 = getGroupFromGroupsByGroupID(this.projectGroupList, this.personInoutForm.GroupList[0])
            let group1 = getGroupFromGroupsByGroupID(this.projectGroupList, this.personInoutForm.GroupList[1])
            filename = `${filename}_${group0.group_name}_${group1.group_name}`
          }
        } else {
          filename = `${filename}_所有部门`
        }

        if (this.personInoutForm.person_name !== '') {
          filename = `${filename}_${this.personInoutForm.person_name}`
        }

        filename = `${filename}_${moment().format('YYYYMMDDHHmmss')}`

        // if (this.personInoutForm.person_id !== '') {
        //     filename = `${filename}_${this.personInoutForm.GroupList[0]}`
        // }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '姓名', '电话', '部门', '班组', '工种',
            '学历', '入职时间', '人员状态', '资料'
          ]
          const filterVal = ['xuhao', 'name', 'mobile', 'group0', 'group1', 'project_pos_name', 'education',
            'created_time', 'statusName', 'datum_uploaded'
          ]
          let list = []
          let xuhao = 0
          this.personInoutList.forEach(person => {
            list.push({
              xuhao: ++xuhao, //序号
              name: person.name,
              mobile: person.mobile,
              group0: person.group_name_level[0],
              group1: person.group_name_level[1],
              project_pos_name: person.project_pos_name,
              education: person.education,
              created_time: moment(person.created_time).format('YYYY-MM-DD'),
              statusName: this.statusName(person.status)
            })
          })
          // const list = this.personInoutList
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: this.autoWidth
          })
          this.downloadLoading = false
        })
      },
      handleCurrentChange(data) { //点击下级部门的分组
        console.log('data', data)


      },
      handleRowClick(row, event, column) {

      },
      handleNameClick(row) {
        // console.log("rowwwwwwwwwwwwwwwwwww",row)
        const param = {
          show: true,
          ...row
        }
        this.$store.dispatch('SetPersonInfoDialog', param).then(() => {}).catch(() => {

        })
      },
      handleOperClick(row) {
        const param = {
          show: true,
          opShow: true,
          ...row
        }
        this.$store.dispatch('SetPersonInfoDialog', param).then(() => {}).catch(() => {

        })
      },
      openPersonHealthDialogHandle(row) {
        const param = {
          show: true,
          title: '登记健康情况 - ' + row.name,
          // opShow: true,
          ...row
        }
        this.$store.dispatch('SetHealthDialog', param).then(() => {}).catch(() => {

        })
      },
      handlePersonHealthDaySubmit(row) {
        console.log('row', row)
        const param = {
          show: true,
          person_id: row.person_id,
          person_name: row.name
        }
        this.$store.dispatch('SetHealthDayDialog', param).then(() => {}).catch(() => {

        })
      },
      SetHealthDayLogDialog(row) {
        console.log('moment', moment().format('YYYY-MM-DD'))

        const param = {
          show: true,
          person_id: row.person_id,
          date: moment().format('YYYY-MM-DD'),
          person_name: row.name
        }
        this.$store.dispatch('SetHealthDayLogDialog', param).then(() => {}).catch(() => {

        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      persionChangeHandle(value) {
        if (value !== '') {
          // console.log(value)
          let _person = {};
          _person = this.projectPersonList.find((item) => { //这里的userList就是上面遍历的数据源
            return item.person_id === value; //筛选出匹配数据
          });
          // this.personInoutForm.person_name = _person.name
        } else {
          // this.personInoutForm.person_name = ''
        }
        // console.log('this.personInoutForm.person_name', this.personInoutForm.person_name)
      },
      personchange() { //资料框数据
        if (this.lackdatavalue.length !== 0) {
          if (this.lackdatavalue === '99') {
            this.lackdatavalue = []
            this.lackdatavalue.push('8', '7', '9', '6', '5', '4', '3', '2', '1')
            for (let i = 0; i < this.lackdatavalue.length; i++) {
              this.personInoutList = this.personinto2.filter((item) => {
                return (Math.pow(2, parseInt(this.lackdatavalue[i])) & parseInt(item.datum_uploaded, 2)) > 0
              });
            }
          } else {
            console.log("-->", this.lackdatavalue)

            for (let i = 0; i < this.lackdatavalue.length; i++) {
              console.log("-->personinto2", this.personinto2)
              this.personInoutList = this.personinto2.filter((item) => {
                return (Math.pow(2, parseInt(this.lackdatavalue[i])) & parseInt(item.datum_uploaded, 2)) > 0

              });
              // console.log(this.personInoutList)
            }
          }
        }
        this.personinto2 = []
      },
      persionChangeLackdata() { //查找资料
        if (this.lackdata.value !== '') {
          console.log(this.lackdata.value) //输出对应的id
          console.log('this.personInoutList1', this.personInoutList)
          this.personInoutList = this.personInoutList.filter((item) => {
            // console.log(this.lackdata.value)
            // console.log(Math.pow(2,this.lackdata.value))
            // console.log(parseInt(item.datum_uploaded,2))
            return (Math.pow(2, this.lackdata.value) & parseInt(item.datum_uploaded, 2)) ===
              0 //查找出来00000000中筛选出数据
          });
          console.log('this.personInoutList2', this.personInoutList)
        } else {}
      },
      groupChangeHandle() {},
      handleExpertHealthSubmit() {
        this.getPersonHealthExcel()
      },
      handleExpertAllSubmit(command) {
        // this.$message('click on item ' + command);
        switch (command) {
          case 'jkzt':
            this.handleSubmit(true)
            break;
          case 'cwxx':
            this.handleExpertHealthSubmit()
            break;
        }
      },
      handleExpertPersonSubmit(command) {
        if (this.selectedPersonList.length === 0) {
          this.$message({
            message: '请先选择要导出的人员！',
            type: 'error'
          })
          return;
        }
        switch (command) {
          case 'jkzt':
            console.log('command1 jkzt')
            break;
          case 'cwjl':
            console.log('command2 cwjl')
            break;
        }
      },
      handlePersonListSelectionChange(selection) {
        this.selectedPersonList = selection;
        console.log('this.selectedPersonList', this.selectedPersonList)
      },

    },
    mounted() {
      // console.log('project_id', this.project_id)

    }
  }

</script>
