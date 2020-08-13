<style lang="scss">
@import './dhtmlxGant';
</style>
<template>
  <div class="dhtmlx-gant">
    <div ref="gantt" class="left-container" />
  </div>
</template>


<script>
import gantt from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
// import 'dhtmlx-gantt/codebase/locale/locale_cn'
export default {
  name: 'dhtmlx-gant',
  components: {},
  data() {
    return {
      tasks: {
        data: [
          {
            id: 1,
            text: 'Task #1',
            start_date: '15-04-2020',
            personName: '张总',
            duration: 3,
            progress: 0.9,
          },
          {
            id: 2,
            text: 'Task #2',
            start_date: '18-04-2020',
            personName: '李总',
            duration: 3,
            progress: 0.4,
          },
          {
            id: 3,
            text: 'Task #2-1',
            start_date: '20-04-2020',
            personName: '赵总',
            duration: 3,
            progress: 0.4,
            parent: 2,
          },
        ],
        links: [{ id: 1, source: 1, target: 2, type: '0' }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 在时间线上增加一行年份显示
    gantt.config.subscales = [
      {
        unit: 'year',
        step: 1,
        date: '%Y',
      },
      // { unit: 'day', step: 1, date: '%j' },
      // { unit: 'month', step: 1, date: '%m' },
    ]

    gantt.i18n.setLocale('cn')
    // 初始化
    gantt.init(this.$refs.gantt)
    // 数据解析
    gantt.parse(this.tasks)
  },
  destroyed() {},
  methods: {},
}
</script>
