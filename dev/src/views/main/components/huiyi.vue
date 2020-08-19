<style lang="scss">
  @import "./huiyi";
</style>
<template>
  <div class="index-huiyi">
    <el-form ref="jdhyForm" :model="jdhyForm" label-width="100px" :validate-on-rule-change="true">
      <el-form-item prop="JHLX" label="计划类型" :rules="ruleJHLX">
        <el-select v-model="jdhyForm.JHLX" default-first-option placeholder="请选择计划类型" size="mini" :clearable="false"
          @change="JHLXChange" style="width: 150px;">
          <el-option v-for="item in optionsJHLX" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span class="JHLX_TIP">{{JHLX_TIP}}</span>
      </el-form-item>
      <el-form-item prop="JHMC" label="计划名称" :rules="ruleJHMC">
        <el-input placeholder="请填写计划名称" v-model="jdhyForm.JHMC" name="JHMC" size="mini"></el-input>
      </el-form-item>
      <el-form-item prop="JHSJ" label="计划时间" :rules="ruleJHSJ">
        <el-date-picker type="daterange" v-model="jdhyForm.JHSJ" name="JHSJ" :editable="false" :clearable="false"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" style="width: 100%">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="JHFZR" label="计划负责人" :rules="ruleJHFZR">
        <el-select v-model="jdhyForm.JHFZR" name="JHFZR" filterable placeholder="请填写负责人名字" size="mini">
          <el-option v-for="item in optionsProjectPersion" :key="item.id" :label="`${item.name}（${item.group_name}）`"
            :value="item.id">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item prop="JHDD" label="计划地点">
        <el-input placeholder="请填写计划地点" v-model="jdhyForm.JHDD" name="JHDD" size="mini"></el-input>
      </el-form-item>
      <el-form-item prop="BZ" label="备注">
        <el-input placeholder="请填写备注" v-model="jdhyForm.BZ" name="BZ" type="textarea" :rows="3" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" :loading="loading" style="float: right;" @click.native.prevent="handleSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import moment from 'moment'
  export default {
    components: {},
    data() {
      //计划名称
      const validateJHMC = (rule, value, callback) => {
        if (value.length <= 1) {
          callback(new Error('必须填写计划名称'))
        } else {
          callback()
        }
      }
      //计划类型
      const validateJHLX = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('必须选择计划类型'))
        } else {
          callback()
        }
      }
      //计划负责人
      const validateJHFZR = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('必须填写计划负责人'))
        } else {
          callback()
        }
      }

      //计划模式
      const validateJHDD = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('必须填写计划地点'))
        } else {
          callback()
        }
      }

      //计划时间
      const validateJHSJ = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('必须选择计划的时间范围'))
        } else {
          callback()
        }
      }

      return {
        loading: false,
        jdhyForm: {
          JHMC: '', // 计划名称
          JHLX: '', // 计划类型
          JHFZR: '', // 计划负责人
          JHMS: '', // 计划模式
          JHDD: '', // 计划地点
          JHSJ: [], // 计划时间
          BZ: '' // 备注
        },
        JHLX_TIP: '',
        optionsJHLX: [],
        optionsProjectPersion: [],
        ruleJHMC: [{ //计划名称
          required: true,
          trigger: 'blur',
          validator: validateJHMC
        }],
        ruleJHLX: [{ //计划类型
          required: true,
          trigger: 'blur',
          validator: validateJHLX
        }],
        ruleJHFZR: [{ //计划负责任
          required: true,
          trigger: 'blur',
          validator: validateJHFZR
        }],
        ruleJHDD: [{ //计划地点
          required: true,
          trigger: 'blur',
          validator: validateJHDD
        }],
        ruleJHSJ: [{ //计划时间
          required: true,
          trigger: 'blur',
          validator: validateJHSJ
        }]
      }
    },
    created: function () {


    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      planTypeList() {
        return this.$store.state.huiyi.planType
      },
      projectPersonList() {
        return this.$store.state.project.projectPersonList
      }
    },
    methods: {
      getPlanTypeQuery() {
        this.$store.dispatch('PlanTypeQuery', {}).then(() => {
          this.optionsJHLX = this.planTypeList
        }).catch(() => {

        })
      },
      getProjectPersons() {
        const param = {
          method: 'query_person',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectPersons', param).then(() => {
          console.log(this.projectPersonList)
          this.optionsProjectPersion = this.projectPersonList
        }).catch(() => {

        })
      },
      handleSubmit() {

        this.$refs.jdhyForm.validate(valid => {
          if (valid) {
            const sTime = moment(this.jdhyForm.JHSJ[0]).format('YYYY-MM-DD')
            const eTime = moment(this.jdhyForm.JHSJ[1]).format('YYYY-MM-DD')
            // -> store module ->api
            const submitData = {
              method: "add",
              plan_type: this.jdhyForm.JHLX,
              plan_name: this.jdhyForm.JHMC,
              project_id: this.project_id,
              plan_start_date: sTime,
              plan_end_date: eTime,
              plan_address: this.jdhyForm.JHDD,
              plan_desc: this.jdhyForm.BZ,
              execute_user: this.jdhyForm.JHFZR //.join(',')

            }
            // console.log("submitData", submitData)
            // return
            this.loading = true
            this.$store.dispatch('HuiYiSubmit', submitData).then((aaa) => {
              this.$refs['jdhyForm'].resetFields();
              this.JHLX_TIP = "";
              this.$message({
                message: '创建会议计划成功！',
                type: 'success'
              })
              this.loading = false
              //   this.$router.push({
              //     path: '/main'
              //   })
            }).catch(() => {
              this.loading = false
            })
          }
        })

      },
      loadAll() {
        return [
          // {
          //   "value": "三全鲜食（北新泾店）",
          //   "address": "长宁区新渔路144号"
          // },
          // {
          //   "value": "Hot honey 首尔炸鸡（仙霞路）",
          //   "address": "上海市长宁区淞虹路661号"
          // },
          // {
          //   "value": "新旺角茶餐厅",
          //   "address": "上海市普陀区真北路988号创邑金沙谷6号楼113"
          // },
        ];
      },
      querySearchAsync(queryString, cb) {
        console.log("queryString", queryString)
        var restaurants = [];
        // var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        cb(restaurants);
        // clearTimeout(this.timeout);
        // this.timeout = setTimeout(() => {
        //   cb(results);
        // }, 3000 * Math.random());
      },
      JHLXChange(value) {
        console.log(value);
        const JHLX = this.optionsJHLX.filter((item, index, array) => {
          if (item.id.toString() === value.toString()) {
            this.JHLX_TIP = item.desc
            return item
          }
        })
        console.log(JHLX)

      }
    },
    mounted() {
      this.getPlanTypeQuery()
      this.getProjectPersons()
    }
  }

</script>
