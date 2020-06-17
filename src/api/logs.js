import request from '@/utils/request'

// 6.3 日志类

// 6.3.1 用户操作日志记录
/*
由客户端发起，服务端记录,需要带上token

数据库对应表 logs_oper
api:/api/logs/rec
method:logs
参数：
project_id
oper_type:# 操作类型1增，2删除，3改，4查，5下载，6导出
source: 1pc网页，2公众号，3http,4app,5闸机客户端6入职客户端7同步程序
desc:描述，格式文本存储，如果需要统计的，尽量格式规整
返回：
{"msg":"","status":"success"}

*/
export function setLogs(data) {
  // console.log("api", data)
  return request({
    url: '/api/logs/rec',
    method: 'post',
    data: data
  })
}