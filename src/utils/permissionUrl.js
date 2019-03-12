import {
  checkPersonAccess
} from '@/api/person'
import {
    Message
  } from 'element-ui'

export default async function hasPermissionToOperation(param) {
  console.log("paramparam", param)
  return new Promise(function (resolve, reject) {
    checkPersonAccess(param).then(response => {

      if (response !== null && response.data !== undefined) {
        if (response.status === 'success') {
          resolve({
            result: true
          })
        } else {
          if (response.status_code === "1019") {
            Message.error('很抱歉，您没有此功能的访问权限')
            resolve({
              result: false
            })
          }
        }
        // const GateData = response.data[this.GateSN]
      }
      // const _data = response
      // console.log('hasPermissionToOperation - date', _data)
      resolve({
        result: false
      })
    }).catch(error => {
      //   reject(error)
      resolve({
        result: false
      })
    })
  })

}
