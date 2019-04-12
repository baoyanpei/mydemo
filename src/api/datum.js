import request from '@/utils/request'

// 设备列表：
/*
 设备列表：
/api/datum/meter   devlist
设备列表查询
        参数：
        project_id:
        可选参数：
        device_type:
        device_id:
        return {"status":"success","msg":'',"data":[{}]}

*/
export function queryDatumMeter(data) {
  // console.log("api", data)
  return request({
    url: 'api/datum/meter',
    method: 'post',
    data: data
  })
}

// 历史记录：
/*
历史记录：
/api/datum/meter   query_days
根据设备id 水表，电表查询历史天数据
        参数：
        meter_id:
        month:201912月份
        return {"status":"success","msg":'',"data":[]}

*/
export function queryDatumMeterDays(data) {
  // console.log("api", data)
  return request({
    url: 'api/datum/meter',
    method: 'post',
    data: data
  })
}