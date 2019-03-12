import request from '@/utils/request'


/*
        '401': '会话Token失效',
        '1001': '参数不全',
        '1002': '参数值不符合要求',
        '1010': '用户未登录',
        '1011': '接口访问受限',
        '1012': '角色访问权限受限',
        '1013': '非项目成员',
        '1014': '没有绑定手机号码',
        '1015': '手机号码长度不正确',
        '1016': '手机号码格式不正确',
        '1017': '你请求的太频繁了，请1分钟后再试',
        '1018': '今天发送的认证码太多了',
        '1021': '数据库查询异常，检查查询条件',
        '1022': '数据库更新异常',
        '1031': '用户状态异常',
        '1041': '项目信息不存在',
        '1042': '用户信息不存在',
        '1043': '项目用户为离职或注销状态',

*/

// 项目人员信息查询
/*
/api/info/project
method:query_person
项目人员信息查询，
        project_id:
        id :personid 可选
*/
export function queryProjectPerson(data) {
  console.log("api", data)
  return request({
    url: 'api/info/project',
    method: 'post',
    data: data
  })
}

// 项目人员分组信息查询
/*
/api/info/project
method:query_group
参数：project_id
*/
export function queryProjectGroup(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: 'api/info/project',
    method: 'post',
    data: data
  })
}

// 获取最新的统计数据

export function queryProjectCount(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: 'api/info/project_count',
    method: 'post',
    data: data
  })
}

// 获取最新的进出person

export function queryProjectGatePerson(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: 'api/info/project_gateperson',
    method: 'post',
    data: data
  })
}

// 获取单个person的信息
/*
http://w.yidebim.com:3002/api/info/user_test?project_id=10000&method=query&idcard_no=500101199010167631
id,mobile,idcard_no
*/
export function queryProjectUser(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: 'api/info/user_test',
    method: 'get',
    params: data
  })
}
// 查询项目进出人员列表
/*
/api/info/project
查询项目进出人员列表
        method:query_person_inout
        参数: project_id
             in_status 进出状态 0 场外， 1 场内
             可选：
             bt:开始时间 格式 2016-6-5 00:00:00
             et:结束时间 格式 2016-6-5 00:00:00
             必须和 in_status==1 一起使用
*/

export function queryProjectPersonInout(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: 'api/info/project',
    method: 'post',
    data: data
  })
}

/* 清场*/
export function queryProjectPersonGoOut(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: 'api/info/project',
    method: 'post',
    data: data
  })
}

/* 设置人证校验是否为本人 */
/*
logs_person_comfirm
人工确认进场照片是否是本人,(目前只有进门采集了图片)
        参数：
        project_id:项目id
        id:日志id
        compare :2：人工确认本人，3:人工确认不是本人
        remark:说明 1|人脸过小

api: /api/info/gate
*/
export function queryLogsPersonComfirm(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: 'api/info/gate',
    method: 'post',
    data: data
  })
}

/* 
query_person_inday(self, params):
        '''
        查询一段时间内用户在场天数
        参数 project_id:
            bt: 2018-09-27 00:00:00
            et: 2018-09-27 23:59:59
*/
export function queryProjectPersonInDay(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: 'api/info/project',
    method: 'post',
    data: data
  })
}

/* 
检查用户是否可以访问
/api/info/person
method:checkPersonAccess 

参数：
project_id:
url:
url:
天气 tianqi_mobile
门禁 menjin_mobile

花名册 huamingce_admin
场内人员 changneiyuanyuan_admin
通讯录 tongxunlu_admin
日历 rili_admin
*/
export function checkPersonAccess(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: 'api/info/person',
    method: 'post',
    data: {
      method: 'checkPersonAccess',
      ...data
    }
  })
}

// 查询每天最大进场人数
/*
/api/rpt/project
method query_online_max
查询每天最大进场人数
参数 project_id
bt: yyyy-mm-dd 开始时间 天
et: yyyy-mm-dd 结束时间 天
*/
export function queryPersonOnlineMax(param) {
  // console.log('planTypeQuery')
  return request({
    url: '/api/rpt/project',
    method: 'post',
    data: param
  })
}

/*
查询用户信息：根据登录信息，返回用户资料
return {"status":"success","msg":'',"data":{"user":{},"person":{},"project":[] }}

*/
export function queryPersonInfo(param) {
  // console.log('planTypeQuery')
  return request({
    url: '/api/info/person',
    method: 'post',
    data: param
  })
}
