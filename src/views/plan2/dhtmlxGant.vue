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
            text: '2020年土木科技研发 2020年年计划',
            start_date: '2020-08-01',
            personName: '张垚',
            duration: 13,
            progress: 0.9,
          },
          {
            id: 2,
            text: 'Task #2',
            start_date: '2020-08-04',
            personName: '李总',
            duration: 3,
            progress: 1,
          },
          {
            id: 3,
            text: 'Task #2-1',
            start_date: '2020-08-06',
            personName: '赵总',
            duration: 3,
            progress: 0.4,
            parent: 2,
          },
        ],
        links: [
          { id: 1, source: 1, target: 2, type: '0' },
          { id: 2, source: 2, target: 3, type: '0' },
        ],
      },
      messages: [],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 在时间线上增加一行年份显示
    gantt.config.xml_date = '%Y-%m-%d'
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
  methods: {
    addMessage(message) {
      this.messages.unshift(message)
      if (this.messages.length > 40) {
        this.messages.pop()
      }
    },
  },
}
</script>
