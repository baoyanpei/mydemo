<style lang="scss">
  @import "./duty.scss";

</style>

<template>
  <div class="screen-duty">
    <div v-if="hasDuty === false" class="noDutyTip">{{noDutyTip}}</div>
    <div v-if="hasDuty === true" class="list-duty">
      <div v-for="person in personList" :key="person.id" class="item-duty">
        <div class="person-line">
          <div class="person-index">{{person.index}}</div>
          <div class="person-zhibanren">值班人</div>
          <div class="person-name">{{person.name}}</div>
          <div class="person-mobile">{{person.mobile}}</div>
        </div>

      </div>

    </div>

  </div>
</template>
<script>
  import lodash from 'lodash'
  export default {
    components: {},
    data() {
      return {
        project_id: null,
        personList: [],
        hasDuty: true,
        noDutyTip: ''

      }
    },
    props: {

    },
    computed: {

    },
    created() {

    },
    watch: {

    },
    mounted() {
      // this.getProjectDutyDay()
    },
    destroyed() {

    },
    methods: {
      init(project_id) {
        this.project_id = project_id
        this.getProjectDutyDay()
      },
      getProjectDutyDay() {
        this.personList = []
        let param = {
          method: 'query_duty_day',
          project_id: this.project_id,
          //   source: 3,
          //   userid: "admin_sluice"
        }

        this.$store.dispatch('QueryDutyDay', param).then((DutyData) => {
          // console.log('DutyData', DutyData)

          const _data = DutyData.data
          // console.log('_data', _data)
          let _index = 0
          if (_data.length > 0) {
            let _personList = _data[0].persons
            // console.log("_personList", _personList)

            _personList.forEach(person => {
              _index = _index + 1
              person.index = _index
              this.personList.push(person)
            });
            // if (persons.length > 0) {
            //   const person = persons[0]
            //   this.zhiban = `${person.name} ${person.mobile}`
            // }
          }
          if (this.personList.length > 0) {
            this.hasDuty = true
          } else {
            this.hasDuty = false
            this.noDutyTip = '当前没有设置值班人员'
          }
          // console.log('this.personList', this.personList)
        }).catch(() => {
          //   this.loading = false
        })
      },
    },

  }

</script>
