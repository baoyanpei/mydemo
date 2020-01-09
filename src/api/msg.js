import request from '@/utils/request'

/*
/api/info/msg
查询：
query
参数：
根据project_id,rows,msg_type

*/
export function queryInfoMsg(data) {
  return request({
    url: '/api/info/msg',
    method: 'post',
    data: data
  })
}

/*
新增
add
通知内容
传入参数：（
        'msg_id', 
        'project_id',
        'msg_cont',
        'end_time', 
        'created_time', 
        'show_led

传出参数：是否成功

*/
export function addInfoMsg(data) {
  return request({
    url: '/api/info/msg',
    method: 'post',
    data: data
  })
}
