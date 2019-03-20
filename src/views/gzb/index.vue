<style lang="scss">
  @import "./index";
      </style>
<template>
  <div class="gzbsz-container" style="margin: 0px;">
    <el-row :gutter="10">
      <el-col :span="4">
        <TJFXMenu></TJFXMenu>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">
          <el-form ref="tjfxForm" :model="tjfxForm" label-width="80px" :inline="true">
            <el-form-item>
              <el-button type="primary" :loading="loading" icon="el-icon-search" @click.native.prevent="handleSubmit(false)"
                size="mini">增加</el-button>
              <el-button type="primary" :loading="loading" icon="el-icon-search" @click.native.prevent="handleSubmit(false)"
                size="mini">批量导入/导出/修改</el-button>
              <el-button type="danger" :loading="loading" icon="el-icon-search" @click.native.prevent="handleSubmit(false)"
                size="mini">删除</el-button>
            </el-form-item>
          </el-form>
          <hr class="hr1" />
          <el-table v-loading="loading" :data="personInoutList" height="550px" highlight-current-row @row-click="handleRowClick"
            style="width: 100%" size="mini" :show-header="true" header-align="center" :default-sort="{prop: 'name', order: 'ascending'}">
            <el-table-column fixed type="index" width="40">
            </el-table-column>
            <el-table-column property="group_name_level[0]" sortable label="部门" width="120" header-align="center">
            </el-table-column>
            <el-table-column property="group_name_level[1]" sortable label="专业" width="120" header-align="center">
            </el-table-column>
            <el-table-column property="inDay" sortable label="工种" align="center" width="120" header-align="center">
            </el-table-column>
            <el-table-column property="countDay" sortable label="工资（元/天）" align="center" width="130" header-align="center">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import moment from 'moment'
  import lodash from 'lodash'
  import TJFXMenu from "../layout/components/TJFXMenu.vue"
  import {
    Loading
  } from 'element-ui';
  export default {
    components: {
      TJFXMenu,
    },
    data() {
      return {
        loading: false,
        tjfxForm: {

        },
        personInoutList: []
      };
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      }

    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          // this.reloadData()
        }
      },
    },
    mounted() {


    },

    methods: {
      handleRowClick(row, event, column) {

      }
    }

  };

</script>
