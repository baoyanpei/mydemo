/*
健康相关接口
*/

import request from '@/utils/request'

// 6.1 用户健康报告记录
/*

6.1.1 健康记录新增/修改
api:/api/logs/rec
method:person_health
参数：
        project_id:必选
        person_id:必须
        travel_info:节日期间流动情况
        travel_in_hb:有无疫情重点区域旅居史0无1有
        contact_hb:有无接触疫情重占区域人员0无1有
        back_date:返回日期
        use_traffic:所使用交通工具 
        symptom:14天内有无发热、干咳症状 0无，1有
        remark:备注,
        id:可选（有为更新，无为新增）
返回：
  {"status":"success","msg":''}
*/
export function personHealth(data) {
  return request({
    url: '/api/logs/rec',
    method: 'post',
    data: data
  })
}

/*
6.1.2 健康记录查询
api:/api/logs/rec
method:person_health_list
参数：
        project_id:必选
        person_id:可选
        page:1 默认
        limit:1 默认

返回：
{
    "count": 1,
    "data": [{
        "back_date": "2020-01-27",
        "contact_hb": 0,
        "created_person": "100587",
        "created_time": "2020-02-20 15:10:29",
        "id": 9,
        "modify_person": "100587",
        "modify_time": "",
        "person_id": 100587,
        "remark": "",
        "symptom": 0,
        "travel_in_hb": 0,
        "travel_info": "\节\日\期\间\流\动\情\况",
        "use_traffic": "\所\使\用\交\通\工\具"
    }],
    "msg": "",
    "page": 1,
    "status": "success"
}

*/
export function personHealthList(data) {
  return request({
    url: '/api/logs/rec',
    method: 'post',
    data: data
  })
}

// 6.2 用户健康日记录
/*
6.2.1 每日健康记录新增

api:/api/logs/rec
method:person_health_day
参数：
        project_id:必选
        person_id:必须
        temp:体温
        give_out_heat:有无发热0无1有
        cough:有无干咳0无1有
        symptom:有无以下症状
        contact_hb:过去14天，有无接触或去过重点区域
        remark:备注,
返回：
  {"status":"success","msg":''}

*/

export function personHealthDay(data) {
  return request({
    url: '/api/logs/rec',
    method: 'post',
    data: data
  })
}

// 6.2 用户健康日记录
/*
6.2.2 用户健康日记录

api:/api/logs/rec
method:person_health_day_list
参数：
        project_id:必选
        person_id:可选
        page:1 默认
        limit:1 默认

返回：
  {
    "count": 2,
    "data": [{
        "contact_hb": 0,
        "cough": 0,
        "created_person": "100747",
        "created_time": "2020-02-21 09:17:42",
        "give_out_heat": 0,
        "id": 5,
        "person_id": 100869,
        "symptom": "\无\上\述\症\状",
        "temp": 36.5
    }, {
        "contact_hb": 0,
        "cough": 0,
        "created_person": "100747",
        "created_time": "2020-02-21 09:17:13",
        "give_out_heat": 0,
        "id": 4,
        "person_id": 100869,
        "symptom": "\无\上\述\症\状",
        "temp": 36.5
    }],
    "msg": "",
    "page": 1,
    "status": "success"
}
*/

export function personHealthDayList(data) {
  return request({
    url: '/api/logs/rec',
    method: 'post',
    data: data
  })
}
