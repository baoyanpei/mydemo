import request from "@/utils/request";

// 16.3 计划进度工作日志
// http://git.buskey.cn/BIM/server/wf_server/issues/16

// 16.3.1 工作日志提交记录
/*
api:/api/oa/plan
method: worklog

参数：
        project_id:
        pid（计划id）/work_id（任务id）
        form:
        work_date:工作日期（日志的日期）
可选参数：
       form_lid:前端记录位置用，位置用
返回：
{
   "msg": "", 
  "status": "success"
}
*/
export function worklog(data) {
  // console.log("api", data)
  return request({
    url: "/api/oa/plan",
    method: "post",
    data: data
  });
}

// 16.3.2 查询计划任务下的工作日志
/*
api:/api/oa/plan
method: worklog_query_works
计划任务下工作日志查询
参数：
        project_id
        work_id/pid (任务id或计划id)
可选：
        sort:asc/desc work_date排序

可选参数：
       form_lid:前端记录位置用，位置用
返回：
{
  "count": 3, 
  "msg": "", 
  "status": "success", 
  "data": [
    {
      "creator_name": "陈玮", 
      "form": {}, 
      "creator": 100587, 
      "pid": 200447, 
      "created_time": "2020-08-14 16:38:53", 
      "id": 2, 
      "work_id": "HZ000000728387770173eaf31fa73816", 
      "form_lid":"",
      "work_date": "2020-08-13"
    }
  ]
}

*/
export function worklog_query_works(data) {
  // console.log("api", data)
  return request({
    url: "/api/oa/plan",
    method: "post",
    data: data
  });
}
