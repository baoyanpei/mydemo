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

// 按小时查询
/*
/api/datum/meter
method:query_hours
{
    "project_id": 10000,
    "meter_id": "YD10000SB03",
    "bt": "2019-05-01 00:00:00",
    "bt": "2019-06-01 23:59:59"
    # "id": 100812
},

*/
export function queryDatumMeterHours(data) {
  // console.log("api", data)
  return request({
    url: 'api/datum/meter',
    method: 'post',
    data: data
  })
}

// 查询项目定位历史信息
/*
/api/datum/meter
method：query_location_his
查询项目定位历史信息
参数：
project_id:
bt:起时间
et:止时间
return {"status":"success","msg":'',"data":[]}

*/
export function queryLocationHis(data) {
  // console.log("api", data)
  return request({
    url: 'api/datum/meter',
    method: 'post',
    data: data
  })
}
