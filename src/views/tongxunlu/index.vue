<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="tongxunlu-container" style="margin: 0px;">
    <el-tabs v-model="activeTabName" type="card" @tab-click="tabHandleClick">
      <el-tab-pane label="项目通讯录" name="xmtxl"></el-tab-pane>

      <el-tab-pane label="外部通讯录" name="wbtxl"></el-tab-pane>
    </el-tabs>
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="grid-content bg-purple" style="border-right:1px solid #eeeeee; padding: 5px;min-height:500px">
          <!-- <el-row type="flex" class="row-bg" style="padding: 5px;">
              甘肃省建设投资（控股）集团总公司
            </el-row> -->
          <el-row type="flex" class="row-bg" style="padding: 5px;">
            <el-input v-model="searchName" placeholder="名字模糊查询" prefix-icon="el-icon-search" size="mini" clearable>
              <el-button slot="append" @click="searchHandle">搜索</el-button>
            </el-input>
          </el-row>

          <el-row type="flex" class="row-bg">
            <el-tree ref="groupTree" accordion :data="treeListData" :expand-on-click-node="false" node-key="group_id"
              :props="defaultProps" :empty-text="emptyTextTree" :highlight-current=true @node-click="groupTreeNodeClick"></el-tree>
          </el-row>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="" name="group_list">
              <template slot="title">
                <div style="margin: 0px 10px 10px 10px;font-size: 20px;">
                  <icon name="sitemap" scale="1.4"></icon> &nbsp;&nbsp;{{groupListTitle}}
                </div>

              </template>
              <el-row type="flex" class="row-bg" style="padding: 10px 10px 0px 10px;">
                <div style="width: 100%;background-color: #d7d7d7;padding: 10px;">
                  <el-button plain size="mini" disabled>添加子部门</el-button>
                  <el-button plain size="mini" disabled>调整顺序</el-button>
                </div>
              </el-row>
              <el-row type="flex" class="row-bg" style="padding: 10px;">

                <el-table ref="singleTable" :data="childGroupData" empty-text="没有下级部门" highlight-current-row
                  @current-change="handleCurrentChange" style="width: 100%" size="small" :show-header="false">
                  <el-table-column type="index" width="50">
                  </el-table-column>
                  <el-table-column property="group_name" label="分组名">
                  </el-table-column>
                </el-table>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="" name="contact_list">
              <template slot="title">
                <div style="margin: 10px 10px 10px 10px;font-size: 20px;">
                  <icon name="users" scale="1.4"></icon> &nbsp;&nbsp;{{personListTitle}}
                </div>

              </template>
              <el-row type="flex" class="row-bg" style="padding: 10px;">
                <div style="width: 100%;background-color: #d7d7d7;padding: 10px;">
                  <el-col :span="24">
                    <el-button plain size="mini" disabled>添加成员</el-button>
                    <el-button plain size="mini" disabled>批量导入/导出/修改</el-button>
                    <el-button plain size="mini" disabled>调整部门</el-button>
                    <el-button plain size="mini" disabled>调整顺序</el-button>
                    <el-button plain size="mini" disabled>批量删除</el-button>

                  </el-col>


                </div>
              </el-row>

              <el-row type="flex" class="row-bg" style="padding: 0px 0px 0px 10px;">
                <el-input v-model="searchContactListName" placeholder="名字模糊查询" prefix-icon="el-icon-search" size="mini"
                  style="width: 200px;" clearable>
                  <el-button slot="append" @click="searchContactHandle">搜索</el-button>
                </el-input>
              </el-row>
              <!-- <hr class="hr1" /> -->
              <el-row type="flex" class="row-bg" style="padding: 10px;">
                <el-table ref="multipleTable" :data="contactList" empty-text="该部门没有人员或未选择部门" tooltip-effect="dark"
                  style="width: 100%" @selection-change="handleSelectionChange" @sort-change="tableSortChangeHandle"
                  @row-click="contactListHandleRowClick" height="400" size="small">
                  <!-- <el-table-column type="selection" width="55">
                      </el-table-column> -->
                  <!--:default-sort="{prop: 'mobile', order: 'descending'}"-->
                  <el-table-column type="index" width="50">
                  </el-table-column>
                  <el-table-column property="name" sortable="custom" prop="name" label="姓名" width="100">
                  </el-table-column>
                  <el-table-column property="mobile" sortable label="手机">
                    <template slot-scope="scope">{{ scope.row.mobile }}</template>
                  </el-table-column>

                </el-table>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <!-- <el-row type="flex" class="row-bg" style="padding: 10px 10px 10px 10px;font-size: 20px;">
              <icon name="sitemap" scale="1.4"></icon> &nbsp;&nbsp;{{groupListTitle}}
            </el-row> -->



          <!-- <el-row type="flex" class="row-bg" style="padding: 10px;font-size: 20px;">
                <icon name="users" scale="1.4"></icon> &nbsp;&nbsp;{{personListTitle}}
            </el-row> -->

        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  // import msort from "mixed-sort"
  import lodash from 'lodash'
  import pinyin from 'tiny-pinyin'
  const defaultPersonListTitle = '部门人员'
  const defaultGroupListTitle = '下级部门'
  const initTextTree = "正在查询通讯录..."
  export default {
    data() {
      return {
        sort1: ['mobile', 'name'],
        emptyTextTree: initTextTree,
        activeTabName: 'xmtxl',
        activeNames: ['contact_list'],
        // radio3: '组织架构',
        personListTitle: defaultPersonListTitle,
        groupListTitle: defaultGroupListTitle,
        treeListData: [],
        childGroupData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        contactList: [],
        contactListOrigin: [],
        personData: null,
        searchName: '',
        searchContactListName: ''
      };
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      projectGroupList() {
        return this.$store.state.project.projectGroupList
      },
      projectPersonList() {
        return this.$store.state.project.projectPersonList
      }
    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          this.reloadData()
        }
      },
    },
    mounted() {
      this.getProjectGroups()
      // console.log(pinyin.convertToPinyin('我')) // WO
      // if (pinyin.isSupported()) {
      //   pinyin.convertToPinyin('我') // WO
      // }
    },

    methods: {
      tabHandleClick(tab, event) {
        console.log(tab, event);
        this.activeTabName = tab.name
        this.reloadData()
        // console.log('this.activeTabName', this.activeTabName)
      },
      handleSelectionChange() {
        console.log('handleSelectionChange')
      },
      contactListHandleRowClick(data, event, column) {
        console.log("data", data)
        // return;

      },
      reloadData() {
        this.treeListData = []
        this.personListTitle = defaultPersonListTitle
        this.groupListTitle = defaultGroupListTitle
        this.childGroupData = []
        this.contactList = []
        this.contactListOrigin = []
        this.emptyTextTree = initTextTree
        this.getProjectGroups()
      },
      getProjectPersons() {
        const param = {
          method: 'query_person_list',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectPersons', param).then(() => {
          this.projectPersonList.forEach(person => {

            person.pinyin = pinyin.convertToPinyin(person.name)
            // console.log("person1",person)
          })
          this.appendPersonMount()
          console.log('this.projectGroupList', this.projectGroupList)
          this.appendTreeData(this.projectGroupList)
          if (this.treeListData.length === 0) {
            this.emptyTextTree = "未查询到符合的人员"
          }

          console.log("this.treeListData", this.treeListData)
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
          this.getProjectPersons()


          // console.log('projectPersonList',this.projectPersonList)
        }).catch(() => {

        })
      },
      appendTreeData(item) {
        // console.log("teim", item)
        if (item.group !== undefined && item.group.length > 0) {
          //1为管理部门 0为施工部门3为建设单位4为监理单位5为外部单位 grouptype类型说明
          // console.log("item.group.groups_type", item.group)

          item.group.forEach(item1 => {
            if ((this.activeTabName === 'xmtxl' && (item1.groups_type === 0 || item1.groups_type === 1)) ||
              (this.activeTabName === 'wbtxl' && (item1.groups_type !== 0 && item1.groups_type !== 1))
            ) {
              // console.log('item1', item1)
              let children = []
              if (item1.group !== undefined && item1.group.length > 0) {
                item1.group.forEach(item2 => {
                  if (item2.totalPerson === undefined) {
                    item2.totalPerson = 0
                  }
                  if (this.searchName === '' || (this.searchName !== '' && item2.totalPerson !== 0)) {
                    children.push({
                      label: `${item2.group_name}(${item2.totalPerson}人)`,
                      personList: item2.personList,
                      group_id: item2.id,
                      children: []
                    })
                  }
                })

              }
              if (item1.totalPerson === undefined) {
                item1.totalPerson = 0
              }
              if (this.searchName === '' || (this.searchName !== '' && item1.totalPerson !== 0)) {
                // this.addTreeRootItem(item1, children)
                this.treeListData.push({
                  label: `${item1.group_name}(${item1.totalPerson}人)`,
                  personList: item1.personList,
                  group_id: item1.id,
                  children: children
                })
              }
            }
          });
        }
      },
      // addTreeRootItem(item, children) {
      //   this.treeListData.push({
      //     label: `${item.group_name}(${item.totalPerson}人)`,
      //     personList: item.personList,
      //     group_id: item.id,
      //     children: children
      //   })
      // },
      appendPersonMount() {
        this.projectPersonList.forEach(person => {
          // console.log("person", person)
          if (this.searchName !== "") {
            // person.name.string.indexOf('')
            if (person.name.indexOf(this.searchName) !== -1) {
              this.addPersonToList(person)
            }
            // console.log(this.searchName,result)
          } else {
            this.addPersonToList(person)
          }


        })
      },
      addPersonToList(person) {
        const group_id = person.group_id
        if (this.projectGroupList.group !== undefined) {
          this.projectGroupList.group.forEach(item => {
            let _totalPerson = 0
            if (item.totalPerson === undefined) {
              item.totalPerson = 0
              item.personList = []
            }

            if (item.id === group_id) {
              _totalPerson++
              item.personList.push(person)
            }

            if (item.group !== undefined) {

              item.group.forEach(item1 => {
                let _totalPersonChind = 0
                if (item1.totalPerson === undefined) {
                  item1.totalPerson = 0
                  item1.personList = []
                }

                if (item1.id === group_id) {
                  _totalPerson++
                  _totalPersonChind++
                  item.personList.push(person)
                  item1.personList.push(person)
                }
                item1.totalPerson = item1.totalPerson + _totalPersonChind
              })
            }
            item.totalPerson = item.totalPerson + _totalPerson
          })
        }
      },
      groupTreeNodeClick(data) { // 点击tree的节点
        // console.log("2222", data);
        this.childGroupData = []
        const childGroup = data.children
        childGroup.forEach(item => {
          this.childGroupData.push({
            group_name: item.label,
            group_id: item.group_id,
            treeNodeId: data.$treeNodeId,
            personList: item.personList
          })
        })
        this.searchContactListName = ""
        this.contactList = data.personList
        this.contactListOrigin = data.personList
        //重新排序
        // this.contactList = msort(this.contactList,['name'],0)
        // this.contactList = msort(this.contactList,['mobile','name'],0)
        this.personListTitle = `${data.label} - ${defaultPersonListTitle}`
        this.groupListTitle = `${data.label} - ${defaultGroupListTitle}`
      },
      // handleChange(val) {
      //   const group_id = val
      //   this.$refs.groupTree.setCurrentKey(group_id)
      //   console.log(val);
      // },
      handleCurrentChange(data) { //点击下级部门的分组
        // console.log('data', data)
        if (data !== null) {
          this.$refs.groupTree.setCurrentKey(data.group_id)
          this.searchContactListName = ""
          this.contactList = data.personList
          this.contactListOrigin = data.personList
          this.personListTitle = `${data.group_name} - ${defaultPersonListTitle}`
        }

      },
      // auditSortby(a, b) {
      //   const pyOption = {
      //     style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
      //     heteronym: true
      //   }
      //   const _pyA = pinyin(a.name, pyOption).join('')
      //   const _pyB = pinyin(b.name, pyOption).join('')
      //   console.log(a.name, b.name, _pyA, _pyB)
      //   if (_pyA > _pyB) {
      //     // console.log(b.date)
      //     return true;
      //   } else {
      //     // console.log(b.date)
      //     return false;
      //   }

      // },
      tableSortChangeHandle({
        column,
        prop,
        order
      }) {
        console.log({
          column,
          prop,
          order
        }, this.contactList)

        // this.contactList = msort(this.contactList, ['mobile', 'name'], 0)
        // console.log('contactList',this.contactList)
        if (prop === 'name' && order === 'ascending') {
          this.contactList = lodash.orderBy(this.contactList, ['pinyin', ], ['desc']);
        } else {
          this.contactList = lodash.orderBy(this.contactList, ['pinyin', ], ['asc']);
        }

      },
      searchHandle() {
        console.log("searchName", this.searchName)
        this.reloadData()
      },
      searchContactHandle() {


        console.log("this.searchContactListName", this.searchContactListName)
        if (this.searchContactListName !== "") {
          this.contactList = []
          this.contactListOrigin.forEach(item => {
            if (item.name.indexOf(this.searchContactListName) !== -1) {
              this.contactList.push(item)
            }

          })



          // console.log(this.searchName,result)
        } else {
          this.contactList = this.contactListOrigin
        }
        console.log("this.contactListOrigin", this.contactListOrigin)
        console.log("this.contactList", this.contactList)
      }
    }

  };

</script>
<!--

  项目人员信息查询，
        必选：
        project_id:
        可选
        id :person_id
        mobile:
        name：模糊查询
        card_type:# 逗号分割，不填为全部类型 4 临时卡
        可选参数都不带，都取全部列表
        status: 人员状态 -1注销0正常 2离职 3手动注销10是默认值  1需要激活：没有标示 默认状态是 全部

        在职：status=0正常、1需要激活
-->
