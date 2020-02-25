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

/*
6.1.3 健康记录表下载

http: GET,POST
api:/api/logs/rec
method:person_health_excel
参数：
        project_id:必选
        t: url 表示返回下载的 url(不带域名) 否则直接返回二进制文件流

返回：
xlsx 二进制个流

返回（t:url）：
{"data":[],"msg":"","status":"success","url":"/api/oa/file/download/tmp/eyJhbGciOiJIUzI1NiIsImV4cCI6MTU4MjY0NjI4OSwiaWF0IjoxNTgyNjE3NDg5fQ.eyJwZXJzb25faWQiOjAsInByb2plY3RfaWQiOiIxMDAwNCIsImZuYW1lIjoibHd6eWprZGpiXzM1YmJlN2RjMWZlMDRlNzI5NWVhNDNmMmExMmRmNGRiLnhsc3giLCJ0aXRsZSI6Ilx1NTJiM1x1NTJhMVx1NGY1Y1x1NGUxYVx1NGViYVx1NTQ1OFx1NTA2NVx1NWViN1x1NGZlMVx1NjA2Zlx1NzY3Ylx1OGJiMFx1ODg2OCJ9.yB2n65C-OWknrkfnaeE7iPpsIUnP3Ing8b91Nzj2BMY"}


*/
export function personHealthExcel(data) {
  return request({
    url: '/api/logs/rec',
    method: 'post',
    // responseType: 'blob',
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
        bt: yyyy-mm-dd 可选
        et: yyyy-mm-dd 可选 （bt,et 成对使用）
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

/*
6.2.3 健康记录按天最新查询
取每天最新一条记录
api:/api/logs/rec
method:person_health_day_last_list
参数：
        project_id:必选
        person_id:可选
        page:1 默认
        limit:31 默认
        bt: yyyy-mm-dd 可选
        et: yyyy-mm-dd 可选 （bt,et 成对使用）

返回：
 {
  "count": 2,
  "data": [
    {
      "contact_hb": 0,
      "cough": 0,
      "created_person": {
        "id": 100747,
        "name": "徐英"
      },
      "created_time": "2020-02-24 00:02:13",
      "day": "2020-02-24",
      "give_out_heat": 0,
      "id": 90,
      "person_id": 100589,
      "symptom": "无上述症状",
      "temp": 36.5
    },
    {
      "contact_hb": 0,
      "cough": 0,
      "created_person": {
        "id": 100566,
        "name": "张垚"
      },
      "created_time": "2020-02-22 16:08:47",
      "day": "2020-02-22",
      "give_out_heat": 1,
      "id": 33,
      "person_id": 100589,
      "symptom": "无上述症状",
      "temp": 37.5
    }
  ],
  "msg": "",
  "page": 1,
  "status": "success"
}

*/

export function personHealthDayLastList(data) {
  return request({
    url: '/api/logs/rec',
    method: 'post',
    data: data
  })
}