<style lang="scss">
@import './dhtmlxGant';

.gantt_tooltip {
  b {
    line-height: 24px;
  }
}
</style>
<template>
  <div class="dhtmlx-gant">
    <div ref="gantt" class="left-container" />
    <div class="right-container">
      <div class="gantt-selected-info">
        <div v-if="selectedTask">
          <h2>{{selectedTask.text}}</h2>
          <span>
            <b>ID:</b>
            {{selectedTask.id}}
          </span>
          <br />
          <span>
            <b>完成度:</b>
            {{selectedTask.progress|toPercent}}%
          </span>
          <br />
          <span>
            <b>开始时间:</b>
            {{selectedTask.start_date|niceDate}}
          </span>
          <br />
          <span>
            <b>完成时间:</b>
            {{selectedTask.end_date|niceDate}}
          </span>
          <br />
        </div>
        <div v-else class="select-task-prompt">
          <h2>请选择一个计划查看详情</h2>
        </div>
      </div>
      <ul class="gantt-messages">
        <li class="gantt-message" v-for="message in messages" v-bind:key="index">{{message}}</li>
      </ul>
    </div>
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
            open: true,
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
          { id: 3, source: 1, target: 3, type: '0' },
        ],
      },
      messages: [],
      selectedTask: null,
    }
  },
  filters: {
    toPercent(val) {
      if (!val) return '0'
      return Math.round(+val * 100)
    },
    niceDate(obj) {
      return `${obj.getFullYear()}-${obj.getMonth() + 1}-${obj.getDate()}`
    },
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 在时间线上增加一行年份显示
    gantt.config.xml_date = '%Y-%m-%d'
    gantt.config.date_scale = '%d(%D)'
    gantt.config.scale_height = 80
    //甘特图右侧表头的高度
    gantt.config.min_column_width = 70
    gantt.config.subscales = [
      {
        unit: 'year',
        step: 1,
        date: '%Y',
      },
      {
        unit: 'month',
        step: 1,
        date: '%M',
      },
      // { unit: 'day', step: 1, date: '%j' },
      // { unit: 'month', step: 1, date: '%m' },
    ]

    gantt.config.columns = [
      {
        name: 'text',
        label: '计划名称',
        tree: true,
        width: '300',
        resize: true,
      },
      { name: 'personName', label: '发起人', align: 'center' },
      { name: 'start_date', label: '开始时间', align: 'center', width: '300' },
      { name: 'duration', label: '持续时间', align: 'center' },
      { name: 'add', width: 40 },
    ]
    // 中文本地化
    gantt.i18n.setLocale('cn')

    gantt.plugins({
      tooltip: true,
    })
    gantt.templates.tooltip_text = function (start, end, task) {
      return (
        '<b >计划名称:</b> ' +
        task.text +
        '<br/><b>执行天数:</b> ' +
        task.duration
      )
    }

    gantt.attachEvent('onGanttReady', () => {
      console.log('onGanttReady')
      var tooltips = gantt.ext.tooltips
      tooltips.tooltip.setViewport(gantt.$task_data)
    })
    gantt.attachEvent('onTaskCreated', (task) => {
      console.log('onTaskCreated')
      task.priority = '1'
      if (task.type == gantt.config.types.placeholder) {
        task.text = 'Create a new task'
      }
      return true
    })
    // 初始化
    gantt.init(this.$refs.gantt)
    // 数据解析
    gantt.parse(this.tasks)

    // gantt.ext.inlineEditors.attachEvent('onSave', (state) => {
    //   console.log('onSave', state)
    //   var col = state.columnName
    //   if (
    //     gantt.autoSchedule &&
    //     (col == 'start_date' || col == 'end_date' || col == 'duration')
    //   ) {
    //     gantt.autoSchedule()
    //   }
    // })

    // 跳过节假日：比如你选择的包含周六日，他会自动延长时间或者缩短，延长或者缩短是因为包含节假日，要增加或者减少天数。
    //gantt.config.correct_work_time = true;
    //gantt.config.inherit_scale_class = true;
    gantt.config.project_start = new Date(2020, 8, 1)
    if (gantt.addMarker) {
      gantt.addMarker({
        start_date: gantt.config.project_start,
        text: 'project start',
      })
    }
    gantt.attachEvent('onTaskSelected', (id) => {
      let task = gantt.getTask(id)
      console.log('onTaskSelected - ', task)
      this.selectedTask = task
      // this.$emit('task-selected', task)
    })

    gantt.attachEvent('onLinkClick', (id) => {
      var link = this.getLink(id),
        src = this.getTask(link.source),
        trg = this.getTask(link.target),
        types = this.config.links

      var first = '',
        second = ''
      switch (link.type) {
        case types.finish_to_start:
          first = '先完成'
          second = '再开始'
          break
        case types.start_to_start:
          first = 'start'
          second = '再开始'
          break
        case types.finish_to_finish:
          first = '先完成'
          second = '再完成'
          break
      }

      gantt.message(
        '应该 ' +
          first +
          ' <b>' +
          src.text +
          '</b> 然后 ' +
          second +
          ' <b>' +
          trg.text +
          '</b>'
      )
    })

    gantt.config.order_branch = 'marker'
    // prevent moving to another sub-branch
    gantt.attachEvent('onAfterTaskMove', (id, parent, tindex) => {
      // any custom logic here
      console.log('onAfterTaskMove', id, parent, tindex)
    })

    gantt.attachEvent('onTaskIdChange', (id, new_id) => {
      console.log('onTaskIdChange1 - ', id, new_id)
      if (gantt.getSelectedId() == new_id) {
        let task = gantt.getTask(new_id)
        console.log('onTaskIdChange - ', id, new_id, task)
        // this.$emit('task-selected', task)
      }
    })
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
