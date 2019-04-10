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
    url: 'api/info/msg',
    method: 'post',
    data: data
  })
}
