import request from '@/utils/request'

// 获取某个流程ID的所有流程实例,完成列表，或进行时列表：
/*
get_all_inst_list        '''
        获取某个流程ID的所有流程实例,完成列表，或进行时列表
        通过工作流引擎查询后透传
        参数：
        flow_id
        project_id
        page=1
        limit=20
        qtype:查询类型  已完成："hasDone"  未完成："inProgress"
        '''

*/
export function getAllInstList(data) {
  // console.log("api", data)
  return request({
    url: '/api/oa/workflow',
    method: 'post',
    data: data,
    // baseURL: 'http://w.yidebim.com:3004'
  })
}

export function queryTaskAll(data) {
  // console.log("api", data)
  return request({
    url: '/api/oa/workflow',
    method: 'post',
    data: data,
    // baseURL: 'http://w.yidebim.com:3004'
  })
}
