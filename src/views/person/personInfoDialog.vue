<style lang="scss">
  @import "./personInfoDialog";

</style>
<template>
  <div class="person-info-dialog">
    <el-dialog :modal="true" top="0.5vh" width="800px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonFacePercentDetailDialogHandle" :visible.sync="personInfoDialog.show"
      :title="personInfoDialog.name">
      <div id="person-face-person-detail-form" class="person-face-person-detail-form">
        <el-row :gutter="24" style="width: 700px;">
          <el-col :span="5" style="text-align: center;padding-right:0px;">
            <div><img :src="idcard_pic" style="height:120px;" /></div>
            <!-- <div>(身份证照)</div> -->
          </el-col>
          <el-col :span="19" class="persion-info-txt" style="text-align: left;padding: 2px;">
            <el-row :gutter="20">
              <el-col :span="6">
                部门：{{bumen}}
              </el-col>
              <el-col :span="5" class="fatherchange">
                <!--<div style="width: 100%;height: 100%;background-color: #1abc9c;color: #fff;text-align: center;border-radius: 7px"-->
                <!--@click="changegroup">更换组别</div>-->
                <el-popover placement="right" width="400" trigger="click">
                  <el-cascader-panel v-model="optionmodel" :options="optionGroups" @change="changevalue">
                  </el-cascader-panel>
                  <el-button type="primary" style="float: right;margin-top: 10px;" @click="open">确认</el-button>
                  <div
                    style="width: 100%;height: 100%;background-color: #1abc9c;color: #fff;text-align: center;border-radius: 7px"
                    slot="reference" @click="changegroup">更换组别</div>
                </el-popover>
              </el-col>
              <el-col :span="8">
                班组：{{zhuanye}}
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="8">
                年龄：{{age}}
              </el-col>
              <el-col :span="14">
                学历：-
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                电话：{{mobile}} <el-button id='btnCopy' type="primary" v-clipboard:copy="mobile"
                  v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError" size="mini">复制</el-button>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                入职时间：{{trasRuZHiShiJian(created_time)}}
                （状态：<span v-html="transStatus(status)"></span>
                <span v-if="status===4 && leave_time!==''" style="color:#FF0000;">开除时间：{{leave_time}}</span>
                <span v-if="status===2 && leave_time!==''" style="color:#FF0000;">辞职时间：{{leave_time}}</span>
                ）

              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                身份证号：{{idcard_no}}
              </el-col>

            </el-row>
            <el-divider>健康信息</el-divider>

            <el-row v-if="personHealthInfo!==null" :gutter="24">
              <el-col :span="24">
                重点疫区旅居史:
                <span v-if="personHealthInfo.travel_in_hb===1">有</span>
                <span v-if="personHealthInfo.travel_in_hb===0">无</span>
                &nbsp;
                接触疫区人员:
                <span v-if="personHealthInfo.contact_hb===1">有</span>
                <span v-if="personHealthInfo.contact_hb===0">无</span>
                &nbsp;
                返项目时间:{{personHealthInfo.back_date}}&nbsp;
                方式:{{personHealthInfo.useTrafficDesc}}
              </el-col>
            </el-row>
            <el-row v-if="personHealthInfo===null" :gutter="24">
              <el-col :span="24">未录入健康信息</el-col>
            </el-row>
            <el-row v-if="personLastHealthDayInfo!==null" :gutter="24">
              <el-col :span="24">
                体温：{{personLastHealthDayInfo.temp}}°C
                <span v-if="personLastHealthDayInfo.give_out_heat===1">有发热</span>
                <span v-if="personLastHealthDayInfo.give_out_heat===0">无发热</span>
                &nbsp;
                <span v-if="personLastHealthDayInfo.cough===1">有干咳等症状</span>
                <span v-if="personLastHealthDayInfo.cough===0">无干咳等症状</span>
                &nbsp;
                <span v-if="personLastHealthDayInfo.symptom!==''">过去14天,有{{personLastHealthDayInfo.symptom}}等症状</span>
                <br/>
                最后记录时间：{{personLastHealthDayInfo.created_time}}
              </el-col>
            </el-row>
            <el-row v-if="personLastHealthDayInfo===null" :gutter="24">
              <el-col :span="24">未记录体检信息</el-col>
            </el-row>

          </el-col>
        </el-row>
        <div v-if="personInfoDialog.opShow">
          <el-button v-if="BtnKaiChuDisable===false" type="danger"
            @click.native.prevent="handlePersonQuitLeftLogSubmit()" class="btn-kaichu" size="mini">开除</el-button>
          <el-button v-if="BtnKaiChuDisable===true" type="danger" class="btn-kaichu" size="mini" disabled>开除</el-button>

          <el-button v-if="BtnZhuXiaoKaDisable===false" type="warning" @click.native.prevent="handleZhuXiaoKaSubmit()"
            class="btn-zhuxiaoka" size="mini">注销卡</el-button>
          <el-button v-if="BtnZhuXiaoKaDisable===true" type="warning" class="btn-zhuxiaoka" size="mini" disabled>注销卡
          </el-button>

          <el-button v-if="BtnKaiChu===false" type="warning" @click.native.prevent="handleChiZhiSubmit()"
            class="btn-chizhi" size="mini">辞职
          </el-button>
          <el-button v-if="BtnKaiChu===true" type="warning" class="btn-chizhi" disabled size="mini">辞职
          </el-button>


        </div>
        <el-button type="success" @click.native.prevent="handleWorktimeLogSubmit()" size="mini"
          style="position:absolute;top:85px;right:20px;">上工日志</el-button>
        <el-button type="success" @click.native.prevent="handleWorktimeLogSubmit()" size="mini"
          style="position:absolute;top:200px;right:20px;">记录体检信息</el-button>
        <el-row>
          <el-tabs v-model="activeTabName" type="card" @tab-click="tabHandleClick">
            <el-tab-pane label="入职照片" name="rzzp">
              <div class="div-tab-item">
                <div style="text-align: center">
                  <a :href="entry_pic" target="_blank">
                    <div v-if="entry_pic===''" class="no-pic">{{loadingEntryPic}}</div>
                    <a v-if="entry_pic!==''" :href="entry_pic" target="_blank">
                      <img :src="entry_pic" style="width:500px;;margin: 0px auto" />
                    </a>
                  </a>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="体检日历" name="tjrl">
              <div class="div-tab-item">
                <div style="text-align: center">
                  敬请期待
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="身份证扫描件" name="sfzzp">
              <div class="div-tab-item">
                <div style="text-align: center">
                  <div v-if="idcarda===''" class="no-idcard">{{loadingIdCarda}}</div>
                  <a v-if="idcarda!==''" :href="idcarda" target="_blank">
                    <img :src="idcarda" style="width:80%;margin: 0px auto" />
                  </a>
                </div>
                <div style="text-align: center">
                  <div v-if="idcardb===''" class="no-idcard">{{loadingIdCardb}}</div>
                  <a v-if="idcardb!==''" :href="idcardb" target="_blank">
                    <img :src="idcardb" style="width:80%;margin: 0px auto" />
                  </a>
                </div>
              </div>

            </el-tab-pane>
            <el-tab-pane label="安全责任书" name="aqzrs">
              <div class="div-tab-item-pdf">
                <iframe id='previewPdf1' v-if="datum_file.has(1)" frameborder="no" border="0" marginwidth="0"
                  marginheight="0" scrolling="no" allowtransparency="yes" :src="datum_file.get(1).pdfurl" width="100%">
                </iframe>
                <div v-if="!datum_file.has(1)" class="no-datum">
                  尚未上传资料
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="劳动合同" name="ldht">
              <div class="div-tab-item-pdf">
                <iframe id='previewPdf2' v-if="datum_file.has(2)" :src="datum_file.get(2).pdfurl" frameborder="no"
                  border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" width="100%">
                </iframe>
                <div v-if="!datum_file.has(2)" class="no-datum">
                  尚未上传资料
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="安全交底" name="aqjd">
              <div class="div-tab-item-pdf">
                <iframe id='previewPdf3' v-if="datum_file.has(3)" :src="datum_file.get(3).pdfurl" frameborder="no"
                  border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" width="100%">
                </iframe>
                <div v-if="!datum_file.has(3)" class="no-datum">
                  尚未上传资料
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="技术交底" name="jsjd">
              <div class="div-tab-item-pdf">
                <iframe id='previewPdf4' v-if="datum_file.has(4)" :src="datum_file.get(4).pdfurl" frameborder="no"
                  border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" width="100%">
                </iframe>
                <div v-if="!datum_file.has(4)" class="no-datum">
                  尚未上传资料
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="三级安全教育记录卡" name="sjaqjyjlk">
              <div class="div-tab-item-pdf">
                <iframe id='previewPdf5' v-if="datum_file.has(5)" :src="datum_file.get(5).pdfurl" frameborder="no"
                  border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" width="100%">
                </iframe>
                <div v-if="!datum_file.has(5)" class="no-datum">
                  尚未上传资料
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="考试试题及结果" name="ksstjjg">
              <div class="div-tab-item-pdf">
                <iframe id='previewPdf6' v-if="datum_file.has(6)" :src="datum_file.get(6).pdfurl" frameborder="no"
                  border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" width="100%">
                </iframe>
                <div v-if="!datum_file.has(6)" class="no-datum">
                  尚未上传资料
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import moment from 'moment'
  // import vpdf from 'vpdf'
  // import pdf from 'vue-pdf'
  // import vueshowpdf from 'vueshowpdf'
  export default {
    components: {
      // pdf
      // vueshowpdf
    },
    directives: {},

    data() {

      return {
        radio: 3,
        activeTabName: 'rzzp',
        idcard_pic: '',
        entry_pic: '',
        name: '',
        age: '',
        mobile: '',
        created_time: '',
        status: '',
        leave_time: '',
        bumen: '',
        zhuanye: '',
        idcarda: '',
        idcardb: '',
        idcard_no: '',
        loading: false,
        currentPage: 0,
        pageCount: 0,
        isshowpdf: true,
        datum_file: new Map(),
        loadingEntryPic: '',
        loadingIdCarda: '',
        loadingIdCardb: '',
        BtnKaiChuDisable: true,
        BtnZhuXiaoKaDisable: true,
        groupchange: false,
        BtnKaiChu: true,
        groupall: [],
        songroup1: [],
        newsongroup: [],
        optionmodel: '',
        optionGroups: [],
        change_personid: 0,
        personHealthInfo: null, //健康信息
        personLastHealthDayInfo: null // 最新的一条健康日志

      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      projectGroupList() {
        return this.$store.state.project.projectGroupList
        // console.log("projectGroupList",projectGroupList)
      },
      personInfoDialog: {
        get: function () {
          return this.$store.state.project.personInfoDialog
        },
        set: function (newValue) {
          this.$store.state.project.personInfoDialog = newValue
        }
      },
      personInfoChanged() {
        return this.$store.state.project.personInfoChanged
      }

    },
    created: function () {

      // this.src = pdf.createLoadingTask(this.src)
    },
    watch: {
      personInfoDialog: {
        handler: function (newVal, oldVal) {
          //   console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            this.initData()
            this.getProjectPersonInfo()
            this.getPersonDatum()
            this.getPersonHealth()
            this.getPersonHealthDayLast()
            // this.getPerson()
          } else {
            this.initData()
          }

        },
        deep: true
      },
      personInfoChanged(curVal, oldVal) {
        this.initData()
        this.getProjectPersonInfo()
      },
    },
    methods: {
      trasRuZHiShiJian(time) {
        let timeFormat = ''
        if (time !== '') {
          timeFormat = moment(time).format('YYYY年MM月DD日')
        }
        return timeFormat
      },
      changegroup() { //更换组别
        console.log("this.projectGroupList.group", this.projectGroupList.group)
        const rootGroup = this.projectGroupList.group
        this.optionGroups = []
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
      },
      changevalue() {
        console.log("123321123", this.optionmodel[1])
      },
      open() {
        this.$alert('<span>更换部门成功</span>', '更换部门提示', {
          dangerouslyUseHTMLString: true
        });
        // console.log("个人更改信息",this.change_personid,this.optionmodel[1])
        const param = {
          method: 'set_person_props',
          project_id: this.project_id,
          person_id: this.change_personid,
          group_id: this.optionmodel[1]
        }
        this.$store.dispatch('PersonGroupChange', param).then(() => {}).catch(() => {

        })
      },
      transStatus(status) {
        let _text = ''
        switch (status) {
          case -1:
            _text = '注销'
            break
          case 1:
            _text = '需要激活'
            break
          case 2:
            _text = '<span style="color:#FF0000;">辞职</span>'
            break
          case 3:
            _text = '手动注销'
            break
          case 4:
            _text = '<span style="color:#FF0000;">开除</span>'
            break
          case 10:
            _text = '默认值'
            break
          case 0:
            _text = '<span style="color:#009900;">正常</span>'
            break
        }
        return _text
      },
      // 打开窗口
      openPersonFacePercentDetailDialogHandle() {
        // console.log("----22222---")
      },
      tabHandleClick(tab, event) {
        console.log(tab, event);
        this.activeTabName = tab.name
        // this.reloadData()
        // console.log('this.activeTabName', this.activeTabName)
      },
      initData() {
        this.activeTabName = 'rzzp'
        this.idcard_pic = '/static/photo_no.jpg'
        this.entry_pic = ''
        this.idcarda = ''
        this.idcardb = ''
        this.name = ""
        this.age = ""
        this.mobile = ""
        this.created_time = ""
        this.status = ""
        this.leave_time = ''
        this.bumen = ''
        this.zhuanye = ''
        this.idcard_no = ''
        this.datum_file = new Map()
        this.loadingEntryPic = '正在查询入职照片'
        this.loadingIdCarda = '正在查询身份证正面照片'
        this.loadingIdCardb = '正在查询身份证反面照片'

        this.BtnZhuXiaoKaDisable = true
        this.BtnKaiChuDisable = true
        this.BtnKaiChu = true
        this.personHealthInfo = null
        this.personLastHealthDayInfo = null
      },
      getProjectPersonInfo() {
        const param = {
          method: 'query_person',
          project_id: this.project_id,
          id: this.personInfoDialog.person_id
        }
        console.log('this.personInfoDialog', this.personInfoDialog)
        this.$store.dispatch('QueryProjectPerson', param).then((data_list) => {
          console.log("-data-->", data_list)
          this.change_personid = data_list[0].person_id
          console.log("projectGroupList", this.projectGroupList.group)
          const _personInfo = data_list[0]
          const _idcard_pic = _personInfo.idcard_pic
          if (_idcard_pic.length > 0) {
            this.idcard_pic = _idcard_pic

          }
          this.name = _personInfo.name
          this.mobile = _personInfo.mobile
          this.created_time = _personInfo.created_time
          this.status = _personInfo.status

          if ((this.status === 2 || this.status === 4) && _personInfo.leave_time !== '') {
            this.leave_time = _personInfo.leave_time
          }
          this.idcard_no = _personInfo.idcard_no
          this.bumen = _personInfo.group_name_level[0]
          this.zhuanye = _personInfo.group_name_level[1]
          if (_personInfo.entry_pic !== undefined && _personInfo.entry_pic !== '') {
            this.entry_pic = _personInfo.entry_pic
          } else {
            this.loadingEntryPic = '尚未拍摄入职照片'
          }
          if (_personInfo.idcarda !== undefined && _personInfo.idcarda !== '') {
            this.idcarda = _personInfo.idcarda
          } else {
            this.loadingIdCarda = '尚未上传身份证正面照片'
          }
          if (_personInfo.idcardb !== undefined && _personInfo.idcardb !== '') {
            this.idcardb = _personInfo.idcardb
          } else {
            this.loadingIdCardb = '尚未上传身份证反面照片'
          }

          this.age = _personInfo.age

          if (_personInfo.status === 0) {
            if (_personInfo.rfid_wg !== '') {
              this.BtnZhuXiaoKaDisable = false
            }
            this.BtnKaiChuDisable = false
            this.BtnKaiChu = false
          }
        }).catch(() => {
          this.loading = false
        })


      },
      getPersonHealth() {
        const param = {
          method: 'person_health_list',
          project_id: this.project_id,
          person_id: this.personInfoDialog.person_id
        }
        this.$store.dispatch('GetPersonHealthList', param).then((personHealth) => {

          if (personHealth.length !== 0) {
            this.personHealthInfo = personHealth[0]
            console.log("健康记录查询", this.personHealthInfo)
            let _useTrafficDesc = "-"
            if (this.personHealthInfo.use_traffic !== '') {
              const useTrafficListArray = this.personHealthInfo.use_traffic.split(',')
              let useTrafficTypeList = []
              useTrafficListArray.forEach((useTrafficList) => {

                const useTrafficArray = useTrafficList.split('－')
                if (useTrafficArray.length > 0) {
                  useTrafficTypeList.push(useTrafficArray[0])
                }

              })
              _useTrafficDesc = useTrafficTypeList.length > 0 ? useTrafficTypeList.join(',') : '-'
            }

            this.personHealthInfo['useTrafficDesc'] = _useTrafficDesc
          }
        }).catch(() => {

        })
      },
      getPersonHealthDayLast() {
        this.personLastHealthDayInfo = null
        const param = {
          method: 'person_health_day_list',
          project_id: this.project_id,
          person_id: this.personInfoDialog.person_id,
          page: 1,
          limit: 1
        }
        this.$store.dispatch('GetPersonHealthDayList', param).then((personHealth) => {
          if (personHealth.length > 0) {
            this.personLastHealthDayInfo = personHealth[0]
            console.log('this.personLastHealthDayInfo', this.personLastHealthDayInfo)
          }

        })
      },
      getPersonDatum() {
        const param = {
          method: 'query',
          project_id: this.project_id,
          person_id: this.personInfoDialog.person_id
        }
        console.log('this.personInfoDialog', this.personInfoDialog)
        this.$store.dispatch('QueryPersonDatum', param).then((data_list) => {
          console.log("QueryPersonDatum-data-->", data_list)
          data_list.forEach(item => {
            this.datum_file.set(item.datum_type, item)
            item.pdfurl = "/static/pdf/web/viewer.html?file=" + item.datum_file_url
          });
          // console.log('this.datum_file', this.datum_file)
        }).catch((e) => {
          console.log('e', e)
          // this.loading = false
        })
      },
      handleWorktimeLogSubmit() {
        const param = {
          show: true,
          ...this.personInfoDialog
        }
        this.$store.dispatch('SetWorktimeFullCalenderDialog', param).then(() => {}).catch(() => {

        })
      },
      closepdf() {
        this.isshowpdf = false
      },
      pdferr(errurl) {
        console.log(errurl);
      },
      handlePersonQuitLeftLogSubmit() {
        const param = {
          show: true,
          op_status: 4, //人员状态 -1注销0正常1需要激活2离职3手动注销4开除10是默认值
          ...this.personInfoDialog
        }
        this.$store.dispatch('SetPersonQuitLeftDialog', param).then(() => {}).catch(() => {

        })
      },
      handleZhuXiaoKaSubmit() {
        this.$confirm('是否确定要注销卡?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          // center: true
        }).then(() => {
          const param = {
            method: 'card_opera',
            project_id: this.project_id,
            rfid_wg: this.personInfoDialog.rfid_wg,
            status: -1
          }
          console.log('param', param)
          this.$store.dispatch('SetCardOpera', param).then((data) => {
            console.log('data', data)
            if (data.status === 'success') {
              this.$message({
                message: '注销卡成功',
                type: 'success'
              })
              this.$store.dispatch('SetPersonListChanged', {}).then(() => {})
              this.$store.dispatch('SetPersonInfoChanged', {}).then(() => {})


            }
          })

        }).catch(() => {

        });
      },
      handleChiZhiSubmit() {
        this.$confirm('是否确定要辞职?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          // center: true
        }).then(() => {
          const param = {
            method: 'quit_left',
            project_id: this.project_id,
            person_id: this.personInfoDialog.person_id,
            status: 2 //-1注销0正常1需要激活2离职(辞职)3手动注销4开除10是默认值
          }
          console.log('param', param)
          this.$store.dispatch('SetQuitLeft', param).then((data) => {
            console.log('data', data)
            if (data.status === 'success') {


              this.$store.dispatch('SetPersonListChanged', {}).then(() => {})
              this.$store.dispatch('SetPersonInfoChanged', {}).then(() => {})
              this.$message({
                message: '已经完成辞职操作！',
                type: 'success'
              })

            }
          })

        }).catch(() => {

        });
      },
      onCopySuccess() {
        console.log("copy", this.mobile)
        this.$message({
          message: '复制成功！',
          type: 'success'
        })
      },
      onCopyError() {
        this.$message({
          message: '复制失败',
          type: 'error'
        })
      }
    },
    mounted() {


    }
  }

</script>
