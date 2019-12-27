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
      return {
        deviceIDs: []
      }
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
      initDevlist() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'devlist',
            project_id: this.project_id
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            // console.log('QueryDatumMeter - data', data)
            data.forEach(datum => {
              // this.datumMeterMap.set(datum.device_id, datum)
              if (datum.device_type === 14) {
                // this.cameraURList.push(datum)
                this.deviceIDs.push(datum.device_id)


              }
            })
            resolve()
          }).catch((e) => {
            console.log(e)
            resolve()
          })


        })
      },
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
      async getProjectGatePerson() {
        if (this.project_id !== null) {
          await this.initDevlist()
          const param = {
            method: 'project_gateperson',
            project_id: this.project_id
          }

          this.$store.dispatch('QueryProjectGatePerson', param).then(() => {
            console.log('this.projectGatePerson123', this.projectGatePerson)
            // for (let key in this.projectGatePerson) {
            //   // console.log(key, this.projectGatePerson[key])
            //   const GateData = this.projectGatePerson[key]
            //   const _gateID = `gate${GateData.door_no}`
            //   // console.log("_gateID", _gateID)
            //   if (GateData !== undefined) {
            //     this.$refs[_gateID].setProjectGatePerson(GateData)

            //   }
            // }

            for (let key in this.projectGatePerson) {
              const GateData = this.projectGatePerson[key]

              if (this.deviceIDs.indexOf(GateData.gate_sn) !== -1) {
                const _gateID = `gate${GateData.door_no}`
                // console.log("_gateID", _gateID)
                // console.log('this.deviceIDs', this.deviceIDs)
                // console.log('indexOf', this.deviceIDs.indexOf(GateData.gate_sn))
                if (GateData !== undefined) {
                  this.$refs[_gateID].setProjectGatePerson(GateData)

                }
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
