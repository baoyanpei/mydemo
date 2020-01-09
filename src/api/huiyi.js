import request from '@/utils/request'

// 计划提交
/*
计划更新接口http://w.yidebim.com:3002/api/info/plan
method:add
传入参数：计划所有信息（
                id,（更新时使用）
                plan_type,
                plan_name,
                project_id,
                plan_start_date,
                actual_finished_time,
                datum_finished_time,
                status,
                create_user,
                execute_user,
                plan_end_date,
                actual_start_time,
                plan_desc,
                plan_address,
必选参数 ['project_id', 'plan_type', 'plan_name'])
更新时必须要有 id 参数
*/
/*
计划状态：
-1未执行完毕
0,资料完成，计划执行完毕
*/
export function huiyiSubmit(huiyiInfo) {
  return request({
    url: '/api/info/plan',
    method: 'post',
    data: huiyiInfo
  })
}


//计划类型
export function planTypeQuery() {
  // console.log('planTypeQuery')
  return request({
    url: '/api/info/plan',
    method: 'post',
    data: {
      method: 'plan_type'
    }
  })
}


//计划列表
/*
method=query
project_id
start_timeend_time=
*/
export function planQuery(param) {
  // console.log('planTypeQuery')
  return request({
    url: '/api/info/plan',
    method: 'post',
    data: param
  })
}