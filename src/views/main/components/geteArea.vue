<style lang="scss">
  @import "./gate.scss";

</style>
<template>
  <div class="gate-area">
    <Gate ref="gate1"></Gate>
    <Gate ref="gate2"></Gate>
  </div>
</template>
<script>
  import Gate from './gate'
  export default {
    components: {
      Gate
    },
    data() {
      return {}
    },
    props: {

    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      projectGatePerson() {
        return this.$store.state.project.projectGatePerson
      }
    },

    methods: {
      receiveData(message) {
        // console.log('receive data', message)
        if (message.destinationName === this.topicCount) {
          this.mqttUserCount(message.payloadString)
        } else {
          const nameArr = message.destinationName.split('/')

          if (nameArr.length === 5 && nameArr[4] === 'msg') {
            const _errData = JSON.parse(message.payloadString)
            const _gateID = `gate${_errData.door_no}`
            this.$refs[_gateID].updateErrorInfo(_errData)
          } else {
            this.mqttUserInfo(message.payloadString)
          }


        }
      },
      mqttUserInfo(data) {
        const _data = JSON.parse(data)
        // console.log("_data", _data)
        // console.log("0000", this.$refs.gate01)
        const _gateID = `gate${_data.door_no}`
        // console.log('_gateID', _gateID)
        this.$refs[_gateID].updateData(_data)
      },
      getProjectGatePerson() {
        if (this.project_id !== null) {
          const param = {
            method: 'project_gateperson',
            project_id: this.project_id
          }

          this.$store.dispatch('QueryProjectGatePerson', param).then(() => {
            //   console.log('this.projectGatePerson123', this.projectGatePerson)
            for (let key in this.projectGatePerson) {
              // console.log(key, this.projectGatePerson[key])
              const GateData = this.projectGatePerson[key]
              const _gateID = `gate${GateData.door_no}`
              // console.log("_gateID", _gateID)
              if (GateData !== undefined) {
                this.$refs[_gateID].setProjectGatePerson(GateData)

              }
            }
          }).catch(() => {

          })
        }

      },
    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          this.getProjectGatePerson()
        }
      },
    },
    mounted() {
      this.getProjectGatePerson()
    }
  }

</script>
