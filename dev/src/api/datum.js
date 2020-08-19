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
    url: '/api/datum/meter',
    method: 'post',
    data: data
  })
}
// 进出车辆日志查询  api:/api/info/gate
export function inoutcarquery(data) {
  return request({
    url:'/api/info/gate',
    method:'post',
    data:data,
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
    url: '/api/datum/meter',
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
    url: '/api/datum/meter',
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
    url: '/api/datum/meter',
    method: 'post',
    data: data
  })
}

//safety-inspection   批量下载
export function allbatchdownload(data) {
  return request({
    url:'/api/oa/file/batch/safe',
    method:'post',
    data:data,
  })
}
// task/index.vue    接受全部任務列表信息
export function allpersondata(data) {
  // console.log("allpersondata",data)
  return request({
    url:'/api/oa/workflow',
    method:'post',
    data:data,
  })
}

export function allinfodictionary(data) {
  return request({
    url:'/api/oa/helper',
    method:'post',
    data:data,
    // baseURL: 'http://w.yidebim.com:3004'
  })
}

export function postmomment(data) {//上传评论信息
  return request({
    url:'/api/oa/comment',
    method:'post',
    data:data,
    // baseURL: 'http://w.yidebim.com:3004'
  })
}

//安全巡检

export function safeinspection(data) {//安全巡检页面
  return request({
    url:'/api/oa/workflow',
    method:'post',
    data:data,
    // baseURL: 'http://w.yidebim.com:3004'
  })
}

// 计划
export function plan(data) {//计划
  return request({
    url:'/api/oa/plan',
    method:'post',
    data:data,
  })
}
//资料管理
export function datamanagement(data) {//计划
  return request({
    url:'/api/doc/project',
    method:'post',
    data:data,
  })
}
